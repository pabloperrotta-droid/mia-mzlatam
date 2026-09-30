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
const cacheListas = {};

async function pedirToken(id, sec) {
  const r = await fetch(BASE + "/TokenEndpoint", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(id + ":" + sec).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: "grant_type=client_credentials",
  });
  return { ok: r.ok, status: r.status, txt: await r.text() };
}

async function obtenerToken() {
  if (tokenCache.token && Date.now() < tokenCache.vence) return tokenCache.token;
  const id = String(process.env.XUBIO_CLIENT_ID || "").trim();
  const sec = String(process.env.XUBIO_SECRET_ID || "").trim();
  if (!id || !sec) throw new Error("Faltan las credenciales de Xubio en el servidor.");
  let r = await pedirToken(id, sec);
  if (!r.ok) {
    // Por si el Client ID y el Secret ID quedaron cargados al revés en GitHub.
    const inv = await pedirToken(sec, id);
    if (inv.ok) {
      console.log("Aviso: XUBIO_CLIENT_ID y XUBIO_SECRET_ID están invertidos en los secretos de GitHub.");
      r = inv;
    }
  }
  if (!r.ok)
    throw new Error(
      "Xubio rechazó las credenciales (" + r.status + "): " + r.txt.slice(0, 200) +
        " [largo Client ID: " + id.length + ", largo Secret ID: " + sec.length + "]",
    );
  const j = JSON.parse(r.txt);
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
    // Xubio devuelve el error con todo el stack de Java: se extrae solo el mensaje.
    let detalle = txt;
    try {
      const j = JSON.parse(txt);
      const msgs = [];
      const juntar = (o, prof) => {
        if (!o || typeof o !== "object" || prof > 4) return;
        for (const k of ["message", "localizedMessage", "error", "error_description", "descripcion", "mensaje"])
          if (typeof o[k] === "string" && o[k] && !msgs.includes(o[k])) msgs.push(o[k]);
        if (o.cause) juntar(o.cause, prof + 1);
      };
      juntar(j, 0);
      detalle = msgs.length ? msgs.join(" | ") : Object.keys(j).join(",");
    } catch {}
    const e = new Error("Xubio respondió " + r.status + " en " + metodo + " " + ruta.split("?")[0] + ": " + String(detalle).slice(0, 400));
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

let centrosCache = null;
function centrosDeCosto() {
  if (!centrosCache) centrosCache = centrosDeCostoXubio();
  return centrosCache;
}
async function centrosDeCostoXubio() {
  return comoLista(await xubio("GET", "/centroDeCostoBean")).map((c) => ({
    id: c.centroDeCosto_id != null ? c.centroDeCosto_id : idDe(c),
    codigo: c.codigo,
    nombre: c.nombre,
  }));
}

async function diagnostico() {
  const hasta = new Date();
  const desde = new Date();
  desde.setDate(desde.getDate() - 30);
  const [crudosCentros, comps] = await Promise.all([
    xubio("GET", "/centroDeCostoBean"),
    xubio("GET", "/comprobanteCompraBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta)),
  ]);
  const lista = comoLista(comps);
  let completo = null;
  if (lista[0]) {
    const c = await xubio("GET", "/comprobanteCompraBean/" + lista[0].transaccionid);
    completo = { campos: Object.keys(c), renglon: comoLista(c.transaccionProductoItems)[0] || null, proveedor: c.proveedor };
  }
  const provs = comoLista(await xubio("GET", "/ProveedorBean").catch(() => []));
  return {
    estado: "ok",
    proveedoresTotal: provs.length,
    proveedorCrudo: provs[0] || null,
    centroCrudo: comoLista(crudosCentros)[0] || null,
    comprobanteCrudo: completo,
    centrosDeCosto: comoLista(crudosCentros).map((c) => ({ id: c.centroDeCosto_id != null ? c.centroDeCosto_id : idDe(c), codigo: c.codigo, nombre: c.nombre })),
    facturasUltimos30Dias: lista.length,
    ejemplos: lista.slice(0, 5).map(resumenComprobante),
  };
}

// El CUIT puede venir con o sin guiones y en distintos campos según la versión de Xubio:
// se compara solo por dígitos contra cualquier campo que parezca un CUIT.
const cuitsDe = (p) =>
  Object.entries(p || {})
    .filter(([k, v]) => /cuit|identificacion|documento/i.test(k) && (typeof v === "string" || typeof v === "number"))
    .map(([, v]) => soloDigitos(v))
    .filter(Boolean);
let proveedoresCache = null;
const proveedorPorCuit = {};
async function buscarProveedor(cuitDig) {
  if (!(cuitDig in proveedorPorCuit)) proveedorPorCuit[cuitDig] = buscarProveedorXubio(cuitDig);
  return proveedorPorCuit[cuitDig];
}
async function buscarProveedorXubio(cuitDig) {
  const guiones = cuitDig.length === 11 ? cuitDig.slice(0, 2) + "-" + cuitDig.slice(2, 10) + "-" + cuitDig.slice(10) : cuitDig;
  for (const q of [cuitDig, guiones]) {
    const provs = comoLista(await xubio("GET", "/ProveedorBean?numeroIdentificacion=" + encodeURIComponent(q)).catch(() => []));
    const p = provs.find((x) => cuitsDe(x).includes(cuitDig));
    if (p) return p;
  }
  if (!proveedoresCache) proveedoresCache = xubio("GET", "/ProveedorBean").then(comoLista);
  return (await proveedoresCache).find((x) => cuitsDe(x).includes(cuitDig)) || null;
}

async function buscarFactura({ cuit, factura, fecha }) {
  const cuitDig = soloDigitos(cuit);
  if (!cuitDig) return { estado: "falta_cuit", mensaje: "La línea de Pagos no tiene CUIT del proveedor." };
  const buscada = partesNumero(factura);
  if (!buscada.numero) return { estado: "falta_factura", mensaje: "La línea de Pagos no tiene número de factura." };

  const prov = await buscarProveedor(cuitDig);
  if (!prov) return { estado: "proveedor_no_encontrado", mensaje: "No hay en Xubio un proveedor con CUIT " + cuitDig + "." };
  const provId = prov.proveedorid != null ? prov.proveedorid : idDe(prov);

  // Facturas de compra desde 13 meses antes de la fecha de la línea (o de hoy) hasta hoy + 30 días.
  const hoy = new Date();
  const base = leerFecha(fecha) || hoy;
  const desde = new Date(Math.min(base.getTime(), hoy.getTime()));
  desde.setDate(1);
  desde.setMonth(desde.getMonth() - 13);
  const hasta = new Date(hoy);
  hasta.setDate(hasta.getDate() + 30);
  const ruta = "/comprobanteCompraBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta);
  if (!cacheListas[ruta]) cacheListas[ruta] = xubio("GET", ruta).then(comoLista);
  const comps = await cacheListas[ruta];
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
  // Cómo se llama el centro de costo en Xubio según los datos de la línea de Pagos
  // (lo elegido a mano en la lista siempre manda):
  //   · WU: el centro de costo de Xubio es la Sub Obra (WU PALERMO 2, WU MORON...).
  //   · Resto: Centro (NATURA CABILDO) > Cliente + Centro (PANDORA UNICENTER) >
  //     primera palabra del Cliente + Centro (SABORES VALENTIN ALSINA).
  const cc0 = String(p.centroCosto || "").trim();
  const cli = String(p.cliente || "").trim();
  const esWU = normalizar(cli) === "WU";
  const nombres = (
    esWU
      ? [p.centroCostoXubio, p.subObra]
      : [p.centroCostoXubio, cc0, cli && cc0 ? cli + " " + cc0 : "", cli && cc0 ? cli.split(/\s+/)[0] + " " + cc0 : ""]
  ).filter((x) => x && String(x).trim());
  if (esWU && nombres.length === 0)
    return {
      estado: "centro_no_encontrado",
      mensaje: "Es de WU y la línea no tiene Sub Obra: cargá la Sub Obra o elegí el centro de costo de la lista.",
    };
  const cc = buscarCentro(centros, nombres);
  if (!cc)
    return {
      estado: "centro_no_encontrado",
      mensaje:
        "No hay en Xubio un centro de costo que coincida con " +
        [...new Set(nombres.map((n) => '"' + String(n).trim() + '"'))].join(" / ") +
        ". Elegilo de la lista en Pagos. No se creó ninguno.",
    };

  const id = r.comprobante.transaccionid;
  const completo = await xubio("GET", "/comprobanteCompraBean/" + id);
  const items = comoLista(completo.transaccionProductoItems);
  if (items.length === 0) return { estado: "sin_renglones", mensaje: "La factura en Xubio no tiene renglones." };
  const yaTenia = items.every((it) => idDe(it.centroDeCosto) === cc.id);
  const antes = resumenComprobante(completo);
  if (yaTenia) return { estado: "ya_estaba", mensaje: "La factura ya tenía ese centro de costo.", factura: antes, centroDeCosto: cc };
  // Si en Xubio tenía otro centro de costo, se pisa con el de MIA (pedido del usuario: "pisalo").
  const otros = [
    ...new Set(
      items
        .filter((it) => it.centroDeCosto && idDe(it.centroDeCosto) != null && idDe(it.centroDeCosto) !== cc.id)
        .map((it) => it.centroDeCosto.nombre || it.centroDeCosto.codigo || String(idDe(it.centroDeCosto))),
    ),
  ];
  const antesTenia = otros.length ? ' (antes tenía "' + otros.join(", ") + '")' : "";

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
      mensaje: 'Se asignaría "' + cc.nombre + '" a ' + items.length + " renglón(es)" + antesTenia + ". No se modificó nada.",
      factura: antes,
      centroDeCosto: cc,
    };

  try {
    await xubio("PUT", "/comprobanteCompraBean/" + id, modificado);
  } catch (err) {
    if (err.status !== 401 && err.status !== 403) throw err;
    const pagos = comoLista(completo.transaccionOrdenPagoItems).length;
    return {
      estado: "bloqueada",
      mensaje:
        (pagos
          ? "Xubio no deja modificar esta factura porque ya tiene un pago (orden de pago) aplicado."
          : "Xubio no deja modificar esta factura (normalmente porque ya está cancelada con una orden de pago).") +
        ' Hay que ponerle el centro de costo "' + cc.nombre + '" a mano en Xubio' + antesTenia + ".",
      factura: antes,
      centroDeCosto: cc,
      ordenesDePago: pagos,
    };
  }
  const despues = await xubio("GET", "/comprobanteCompraBean/" + id);
  const ok = comoLista(despues.transaccionProductoItems).every((it) => idDe(it.centroDeCosto) === cc.id);
  const totalIgual = Number(despues.importetotal) === Number(completo.importetotal);
  return {
    estado: ok && totalIgual ? "ok" : "no_verificado",
    mensaje: ok && totalIgual
      ? 'Centro de costo "' + cc.nombre + '" asignado en Xubio' + antesTenia + "."
      : "Xubio aceptó el cambio pero al volver a leer la factura no coincide. Revisarla en Xubio.",
    factura: resumenComprobante(despues),
    centroDeCosto: cc,
  };
}



// Solo lectura: cómo vienen las órdenes de pago, cuentas, bancos y retenciones en Xubio,
// y una factura completa (para entender por qué Xubio rechaza modificarla).
async function diagnosticoPagos(p) {
  const desde = p.fechaDesde || "2026-09-25";
  const hasta = p.fechaHasta || "2026-09-25";
  const res = {};
  const intentar = async (k, fn) => {
    try {
      res[k] = await fn();
    } catch (e) {
      res[k] = { error: String((e && e.message) || e).slice(0, 300) };
    }
  };
  await intentar("pagos", async () => {
    const l = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + desde + "&fechaHasta=" + hasta));
    return { cantidad: l.length, lista: l.slice(0, 40).map((x) => ({ id: x.transaccionid, recibo: x.numeroRecibo, prov: x.proveedor && x.proveedor.nombre })) };
  });
  if (p.buscarRecibo)
    await intentar("pagoEjemplo", async () => {
      const l = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + desde + "&fechaHasta=" + hasta));
      const x = l.find((y) => String(y.numeroRecibo || "").includes(p.buscarRecibo));
      if (!x) return null;
      const completo = await xubio("GET", "/pagoBean/" + x.transaccionid).catch(() => null);
      return { deLista: x, completo };
    });
  await intentar("cuentas", async () =>
    comoLista(await xubio("GET", "/cuenta")).map((c) => ({ id: idDe(c) != null ? idDe(c) : c.cuentaid, codigo: c.codigo, nombre: c.nombre })),
  );
  await intentar("bancos", async () => comoLista(await xubio("GET", "/banco")).slice(0, 80));
  await intentar("retenciones", async () => comoLista(await xubio("GET", "/retencionBean")).slice(0, 80));
  if (p.comprobanteId) await intentar("comprobante", () => xubio("GET", "/comprobanteCompraBean/" + p.comprobanteId));
  return { estado: "ok", ...res };
}


// Solo lectura: datos para armar la prueba de orden de pago.
async function diagnosticoPruebaOP(p) {
  const res = {};
  const intentar = async (k, fn) => {
    try {
      res[k] = await fn();
    } catch (e) {
      res[k] = { error: String((e && e.message) || e).slice(0, 300) };
    }
  };
  await intentar("proveedorPrueba", () => buscarProveedorXubio(soloDigitos(p.cuitPrueba)));
  await intentar("proveedorModelo", async () => {
    const x = await buscarProveedorXubio(soloDigitos(p.cuitModelo));
    return x ? await xubio("GET", "/ProveedorBean/" + (x.proveedorid != null ? x.proveedorid : idDe(x))) : null;
  });
  await intentar("facturaModelo", async () => {
    const r = await buscarFactura({ cuit: p.cuitModelo, factura: p.facturaModelo, fecha: p.fechaModelo });
    return r.estado === "encontrada" ? await xubio("GET", "/comprobanteCompraBean/" + r.comprobante.transaccionid) : r;
  });
  return { estado: "ok", ...res };
}

module.exports = { diagnosticoPruebaOP, diagnosticoPagos, diagnostico, asignarCentroCosto, centrosDeCosto, partesNumero, normalizar };
