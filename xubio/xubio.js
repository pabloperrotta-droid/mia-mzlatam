/*
 * Lógica de la integración MIA ↔ Xubio (solo lo que habla con la API de Xubio).
 * Reglas pedidas por el usuario:
 *   · si la factura no está en Xubio, no la carga (devuelve "factura_no_encontrada");
 *   · si el centro de costo no existe en Xubio, no lo crea (la API tampoco lo permite).
 * Las credenciales llegan por variables de entorno (XUBIO_CLIENT_ID / XUBIO_SECRET_ID),
 * que GitHub toma de los secretos del repo.
 */
const BASE = "https://xubio.com/API/1.1";

let tokenCache = { token: null, vence: 0 };

async function obtenerToken() {
  if (tokenCache.token && Date.now() < tokenCache.vence) return tokenCache.token;
  const id = process.env.XUBIO_CLIENT_ID;
  const sec = process.env.XUBIO_SECRET_ID;
  if (!id || !sec) throw new Error("Faltan las credenciales de Xubio en el servidor.");
  const r = await fetch(BASE + "/TokenEndpoint", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(id + ":" + sec).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: "grant_type=client_credentials",
  });
  const txt = await r.text();
  if (!r.ok) throw new Error("Xubio rechazó las credenciales (" + r.status + "): " + txt.slice(0, 200));
  const j = JSON.parse(txt);
  tokenCache = { token: j.access_token, vence: Date.now() + ((Number(j.expires_in) || 3600) - 60) * 1000 };
  return j.access_token;
}

async function xubio(metodo, ruta, cuerpo) {
  const r = await fetch(BASE + ruta, {
    method: metodo,
    headers: {
      Authorization: "Bearer " + (await obtenerToken()),
      Accept: "application/json",
      ...(cuerpo ? { "Content-Type": "application/json" } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const txt = await r.text();
  if (!r.ok) {
    const e = new Error("Xubio respondió " + r.status + " en " + metodo + " " + ruta + ": " + txt.slice(0, 400));
    e.status = r.status;
    throw e;
  }
  return txt ? JSON.parse(txt) : null;
}

const soloDigitos = (s) => String(s || "").replace(/\D/g, "");
const sinCeros = (s) => soloDigitos(s).replace(/^0+/, "") || (soloDigitos(s) ? "0" : "");
const normalizar = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
const comoLista = (x) => (Array.isArray(x) ? x : x ? [x] : []);
const idDe = (o) => (o ? (o.ID != null ? o.ID : o.id) : null);

function fechaXubio(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function leerFecha(s) {
  const p = String(s || "").split(/[\/\-]/).map((x) => parseInt(x, 10));
  if (p.length !== 3 || p.some(isNaN)) return null;
  return p[0] > 31 ? new Date(p[0], p[1] - 1, p[2]) : new Date(p[2] < 100 ? 2000 + p[2] : p[2], p[1] - 1, p[0]);
}

// "0003-00012345" → {pv:"3", numero:"12345"}; "12345" → {pv:null, numero:"12345"}
function partesNumero(s) {
  const grupos = String(s || "").match(/\d+/g) || [];
  if (grupos.length >= 2) return { pv: sinCeros(grupos[grupos.length - 2]), numero: sinCeros(grupos[grupos.length - 1]) };
  if (grupos.length === 1) return { pv: null, numero: sinCeros(grupos[0]) };
  return { pv: null, numero: "" };
}

function resumenComprobante(c) {
  return {
    id: c.transaccionid,
    fecha: c.fecha,
    proveedor: c.proveedor ? c.proveedor.nombre : null,
    proveedorId: idDe(c.proveedor),
    puntoVenta: c.puntoVenta,
    numeroDocumento: c.numeroDocumento,
    total: c.importetotal,
    renglones: comoLista(c.transaccionProductoItems).map((it) => ({
      descripcion: it.descripcion,
      total: it.total,
      centroDeCosto: it.centroDeCosto ? it.centroDeCosto.nombre || it.centroDeCosto.codigo || idDe(it.centroDeCosto) : null,
    })),
  };
}

async function centrosDeCosto() {
  return comoLista(await xubio("GET", "/centroDeCostoBean")).map((c) => ({
    id: idDe(c),
    codigo: c.codigo,
    nombre: c.nombre,
  }));
}

async function diagnostico() {
  const hasta = new Date();
  const desde = new Date();
  desde.setDate(desde.getDate() - 30);
  const [centros, comps] = await Promise.all([
    centrosDeCosto(),
    xubio("GET", "/comprobanteCompraBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta)),
  ]);
  const lista = comoLista(comps);
  return {
    estado: "ok",
    centrosDeCosto: centros,
    facturasUltimos30Dias: lista.length,
    ejemplos: lista.slice(0, 5).map(resumenComprobante),
  };
}

async function buscarFactura({ cuit, factura, fecha }) {
  const cuitDig = soloDigitos(cuit);
  if (!cuitDig) return { estado: "falta_cuit", mensaje: "La línea de Pagos no tiene CUIT del proveedor." };
  const buscada = partesNumero(factura);
  if (!buscada.numero) return { estado: "falta_factura", mensaje: "La línea de Pagos no tiene número de factura." };

  const provs = comoLista(await xubio("GET", "/ProveedorBean?numeroIdentificacion=" + encodeURIComponent(cuitDig)));
  const prov = provs.find((p) => soloDigitos(p.cuit) === cuitDig) || (provs.length === 1 ? provs[0] : null);
  if (!prov) return { estado: "proveedor_no_encontrado", mensaje: "No hay en Xubio un proveedor con CUIT " + cuitDig + "." };
  const provId = prov.proveedorid;

  const base = leerFecha(fecha) || new Date();
  const desde = new Date(base);
  desde.setDate(desde.getDate() - 180);
  const hasta = new Date(base);
  hasta.setDate(hasta.getDate() + 60);
  const comps = comoLista(
    await xubio("GET", "/comprobanteCompraBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta)),
  );
  const candidatas = comps.filter((c) => {
    if (idDe(c.proveedor) !== provId) return false;
    const x = partesNumero((c.puntoVenta ? c.puntoVenta + "-" : "") + (c.numeroDocumento || ""));
    const pvX = c.puntoVenta ? sinCeros(c.puntoVenta) : x.pv;
    return x.numero === buscada.numero && (!buscada.pv || !pvX || pvX === buscada.pv);
  });
  if (candidatas.length === 0)
    return {
      estado: "factura_no_encontrada",
      mensaje: "No se encontró en Xubio la factura " + factura + " de " + (prov.nombre || prov.razonSocial) + ".",
    };
  if (candidatas.length > 1)
    return {
      estado: "varias_facturas",
      mensaje: "Hay " + candidatas.length + " facturas en Xubio que coinciden; no se modificó ninguna.",
      candidatas: candidatas.map(resumenComprobante),
    };
  return { estado: "encontrada", proveedor: prov.nombre || prov.razonSocial, comprobante: candidatas[0] };
}

function buscarCentro(centros, nombres) {
  for (const n of nombres) {
    const k = normalizar(n);
    if (!k) continue;
    const c = centros.find((x) => normalizar(x.nombre) === k || normalizar(x.codigo) === k);
    if (c) return c;
  }
  return null;
}

async function asignarCentroCosto(p) {
  const r = await buscarFactura(p);
  if (r.estado !== "encontrada") return r;
  const centros = await centrosDeCosto();
  const nombres = [p.centroCostoXubio, (p.cliente || "") + " " + (p.centroCosto || ""), p.centroCosto].filter(Boolean);
  const cc = buscarCentro(centros, nombres);
  if (!cc)
    return {
      estado: "centro_no_encontrado",
      mensaje: 'No existe en Xubio un centro de costo llamado "' + nombres[0] + '". No se creó ninguno.',
      centrosDisponibles: centros.map((c) => c.nombre),
    };

  const id = r.comprobante.transaccionid;
  const completo = await xubio("GET", "/comprobanteCompraBean/" + id);
  const items = comoLista(completo.transaccionProductoItems);
  if (items.length === 0) return { estado: "sin_renglones", mensaje: "La factura en Xubio no tiene renglones." };
  const yaTenia = items.every((it) => idDe(it.centroDeCosto) === cc.id);
  const antes = resumenComprobante(completo);
  if (yaTenia) return { estado: "ya_estaba", mensaje: "La factura ya tenía ese centro de costo.", factura: antes };

  const modificado = {
    ...completo,
    transaccionProductoItems: items.map((it) => ({
      ...it,
      centroDeCosto: { ID: cc.id, id: cc.id, codigo: cc.codigo, nombre: cc.nombre },
    })),
  };
  if (p.simular)
    return {
      estado: "simulacion",
      mensaje: 'Se asignaría "' + cc.nombre + '" a ' + items.length + " renglón(es). No se modificó nada.",
      factura: antes,
      centroDeCosto: cc,
    };

  await xubio("PUT", "/comprobanteCompraBean/" + id, modificado);
  const despues = await xubio("GET", "/comprobanteCompraBean/" + id);
  const ok = comoLista(despues.transaccionProductoItems).every((it) => idDe(it.centroDeCosto) === cc.id);
  const totalIgual = Number(despues.importetotal) === Number(completo.importetotal);
  return {
    estado: ok && totalIgual ? "ok" : "no_verificado",
    mensaje: ok && totalIgual
      ? 'Centro de costo "' + cc.nombre + '" asignado en Xubio.'
      : "Xubio aceptó el cambio pero al volver a leer la factura no coincide. Revisarla en Xubio.",
    factura: resumenComprobante(despues),
    centroDeCosto: cc,
  };
}

module.exports = { diagnostico, asignarCentroCosto };
