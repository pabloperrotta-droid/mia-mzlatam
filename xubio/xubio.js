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

// Xubio (soporte, 30/09/2026): "actualizar la validación del token antes de realizar la operación, ya que
// se vencen". Por eso: token nuevo antes de cada cambio (PUT/POST) y, si responde 401, token nuevo y un reintento.
async function xubio(metodo, ruta, cuerpo) {
  if (metodo !== "GET") tokenCache = { token: null, vence: 0 };
  try {
    return await xubioUnaVez(metodo, ruta, cuerpo);
  } catch (e) {
    if (e.status !== 401) throw e;
    tokenCache = { token: null, vence: 0 };
    return xubioUnaVez(metodo, ruta, cuerpo);
  }
}
async function xubioUnaVez(metodo, ruta, cuerpo) {
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
        // "description" trae el motivo real (soporte de Xubio, 09/10/2026: "La transacción se encuentra aplicada.").
        for (const k of ["description", "message", "localizedMessage", "error", "error_description", "descripcion", "mensaje"])
          if (typeof o[k] === "string" && o[k] && !msgs.includes(o[k])) msgs.push(o[k]);
        if (o.cause) juntar(o.cause, prof + 1);
      };
      juntar(j, 0);
      detalle = msgs.length ? msgs.join(" | ") : Object.keys(j).join(",");
    } catch {}
    const e = new Error("Xubio respondió " + r.status + " en " + metodo + " " + ruta.split("?")[0] + ": " + String(detalle).slice(0, 400));
    // El motivo real ("description") viene al final: se guarda el principio y el final de la respuesta.
    e.cuerpo = txt.length > 6000 ? txt.slice(0, 1500) + " … " + txt.slice(-4500) : txt;
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

// Sección 143: Xubio devuelve como máximo 1000 comprobantes por consulta (los más nuevos), sin paginar
// (verificado el 27/10/2026: 13 meses → 1000, desde el 14/07). Se pide de a un mes; si un tramo llega a 1000,
// se parte al medio. Cada tramo se guarda en memoria durante la pasada.
const TOPE_XUBIO = 1000;
async function listarPorFechas(bean, desde, hasta) {
  const tramos = [];
  for (let d = new Date(desde.getFullYear(), desde.getMonth(), 1); d <= hasta; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const ini = d < desde ? new Date(desde) : new Date(d),
      fin = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    tramos.push([ini, fin > hasta ? new Date(hasta) : fin]);
  }
  const vistos = new Map();
  const traer = async (ini, fin) => {
    const ruta = "/" + bean + "?fechaDesde=" + fechaXubio(ini) + "&fechaHasta=" + fechaXubio(fin);
    if (!cacheListas[ruta]) cacheListas[ruta] = xubio("GET", ruta).then(comoLista);
    const l = await cacheListas[ruta];
    const dias = Math.round((fin - ini) / 864e5);
    if (l.length >= TOPE_XUBIO && dias >= 1) {
      const medio = new Date(ini.getTime() + Math.floor(dias / 2) * 864e5);
      await traer(ini, medio);
      await traer(new Date(medio.getTime() + 864e5), fin);
      return;
    }
    for (const c of l) vistos.set(c.transaccionid != null ? c.transaccionid : JSON.stringify(c), c);
  };
  for (const [a, b] of tramos) await traer(a, b);
  return [...vistos.values()];
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
  const comps = await listarPorFechas("comprobanteCompraBean", desde, hasta);
  // Sección 143: las notas de crédito (tipo 3, importe negativo) no son la factura aunque tengan el mismo número.
  const candidatasTodas = comps.filter((c) => {
    if (idDe(c.proveedor) !== provId) return false;
    if (Number(c.tipo) === 3 || Number(c.importetotal) < 0) return false;
    const x = partesNumero((c.puntoVenta ? c.puntoVenta + "-" : "") + (c.numeroDocumento || ""));
    const pvX = c.puntoVenta ? sinCeros(c.puntoVenta) : x.pv;
    return x.numero === buscada.numero && (!buscada.pv || !pvX || pvX === buscada.pv);
  });
  // Si además hay notas de débito u otros con el mismo número, manda la factura (tipo 1).
  const soloFacturas = candidatasTodas.filter((c) => Number(c.tipo) === 1);
  const candidatas = soloFacturas.length ? soloFacturas : candidatasTodas;
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

const CENTRO_GASTOS_GENERALES = "Gastos Generales de Oficina"; // nombre exacto en Xubio (verificado 13/10/2026)
// Sección 152: productos/servicios de compra de Xubio ("Producto/Servicio" de los renglones). MIA nunca los crea.
let productosCache = null;
function productosCompra() {
  if (!productosCache)
    productosCache = xubio("GET", "/ProductoCompraBean").then((l) =>
      comoLista(l)
        .map((x) => ({ id: x.productoid != null ? x.productoid : idDe(x), nombre: String(x.nombre || x.codigo || "").trim(), codigo: x.codigo }))
        .filter((x) => x.id != null && x.nombre),
    );
  return productosCache;
}
function buscarProducto(productos, nombre) {
  const k = normalizar(nombre);
  return (k && productos.find((x) => normalizar(x.nombre) === k || normalizar(x.codigo) === k)) || null;
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

const plata = (v) => "$" + (Number(v) || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function asignarCentroCosto(p) {
  const r = await buscarFactura(p);
  if (r.estado !== "encontrada") return r;
  // Chequeo previo 1 (pedido del usuario): el importe final de la factura en Xubio tiene que coincidir
  // con el Importe Final de Pagos (si la factura está en varias líneas, con la suma).
  if (p.importeMia != null && p.importeMia !== "") {
    const enXubio = Number(r.comprobante.importetotal) || 0;
    const enMia = Number(p.importeMia) || 0;
    if (Math.abs(enXubio - enMia) > 1)
      return {
        estado: "importe_no_coincide",
        mensaje:
          "Importe no coincide: la factura " + r.comprobante.numeroDocumento + " en Xubio es de " + plata(enXubio) +
          " y en Pagos de " + plata(enMia) + ". No se le puso el centro de costo.",
        factura: resumenComprobante(r.comprobante),
      };
  }
  const centros = await centrosDeCosto();
  // Cómo se llama el centro de costo en Xubio según los datos de la línea de Pagos
  // (lo elegido a mano en la lista siempre manda):
  //   · WU: el centro de costo de Xubio es la Sub Obra (WU PALERMO 2, WU MORON...).
  //   · Resto: Centro (NATURA CABILDO) > Cliente + Centro (PANDORA UNICENTER) >
  //     primera palabra del Cliente + Centro (SABORES VALENTIN ALSINA).
  const cc0 = String(p.centroCosto || "").trim();
  const cli = String(p.cliente || "").trim();
  const esWU = normalizar(cli) === "WU";
  // Sección 125 (pedido del usuario): los gastos internos van siempre a "Gastos Generales de Oficina" en Xubio,
  // sea cual sea el rubro (salvo que en la línea se haya elegido a mano otro centro de la lista).
  const esInterno = normalizar(cli) === "INTERNO";
  const nombres = (
    esInterno
      ? [p.centroCostoXubio, CENTRO_GASTOS_GENERALES]
      : esWU
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

  // Sección 152: tipo de servicio de Xubio según la tabla de proveedores de MIA (si el proveedor lo tiene).
  const prodNombre = String(p.productoXubio || "").trim();
  let prod = null;
  if (prodNombre) {
    prod = buscarProducto(await productosCompra(), prodNombre);
    if (!prod)
      return {
        estado: "producto_no_encontrado",
        mensaje: 'No hay en Xubio un producto/servicio "' + prodNombre + '" (tipo de servicio del proveedor en MIA). Crealo en Xubio o elegí otro en la tabla de proveedores. No se tocó la factura.',
      };
  }
  const yServ = prod ? ' y servicio "' + prod.nombre + '"' : "";

  const id = r.comprobante.transaccionid;
  const completo = await xubio("GET", "/comprobanteCompraBean/" + id);
  const items = comoLista(completo.transaccionProductoItems);
  if (items.length === 0) return { estado: "sin_renglones", mensaje: "La factura en Xubio no tiene renglones." };
  const prodOk = (it) => !prod || idDe(it.producto) === prod.id;
  const yaTenia = items.every((it) => idDe(it.centroDeCosto) === cc.id && prodOk(it));
  const antes = resumenComprobante(completo);
  if (yaTenia) return { estado: "ya_estaba", mensaje: "La factura ya tenía ese centro de costo" + yServ + ".", factura: antes, centroDeCosto: cc, producto: prod };
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
    // Sección 123: si la factura no tiene descripción, Xubio falla al guardar ("getDescripcion() is null" →
    // "No se pudo completar la operación"). Se manda vacía.
    descripcion: completo.descripcion == null ? "" : completo.descripcion,
    transaccionProductoItems: items.map((it) => ({
      ...it,
      centroDeCosto: { ID: cc.id },
      ...(prod ? { producto: { ID: prod.id } } : {}),
    })),
  };
  if (p.simular)
    return {
      estado: "simulacion",
      mensaje: 'Se asignaría "' + cc.nombre + '"' + yServ + " a " + items.length + " renglón(es)" + antesTenia + ". No se modificó nada.",
      factura: antes,
      centroDeCosto: cc,
      producto: prod,
    };

  // Chequeo previo 2 (pedido del usuario): si la factura ya tiene una orden de pago aplicada no se toca.
  // Xubio no siempre lo informa en la factura; si no lo informa, lo confirma rechazando el cambio.
  let motivoXubio = "";
  const bloqueada = (tieneOP) => ({
    estado: tieneOP ? "bloqueada" : "rechazada",
    mensaje: tieneOP
      ? "Orden de pago aplicada: la factura " + completo.numeroDocumento + " ya tiene una orden de pago aplicada en Xubio. Hay que ponerle el centro de costo \"" + cc.nombre + "\" a mano en Xubio" + antesTenia + "."
      : "Xubio rechazó el cambio de centro de costo de la factura " + completo.numeroDocumento +
        " (respondió \"No se pudo completar la operación\"" + (motivoXubio ? ": " + motivoXubio : "") + "). Hay que ponerle \"" + cc.nombre + "\" a mano en Xubio" + antesTenia + ".",
    factura: antes,
    centroDeCosto: cc,
  });
  if (comoLista(completo.transaccionOrdenPagoItems).length) return bloqueada(true);
  // Sección 152: si Xubio no acepta el cambio de servicio, se pone solo el centro de costo y se avisa.
  let servicioNoAceptado = false;
  const soloCentro = { ...modificado, transaccionProductoItems: items.map((it) => ({ ...it, centroDeCosto: { ID: cc.id } })) };
  try {
    try {
      await xubio("PUT", "/comprobanteCompraBean/" + id, modificado);
    } catch (e1) {
      if (!prod || items.every(prodOk) || /se encuentra aplicada/i.test(String(e1.message || "") + String(e1.cuerpo || ""))) throw e1;
      servicioNoAceptado = true;
      await xubio("PUT", "/comprobanteCompraBean/" + id, soloCentro);
    }
  } catch (err) {
    if (err.status !== 401 && err.status !== 403) throw err;
    // Xubio (09/10/2026): el rechazo era porque "La transacción se encuentra aplicada" (la factura ya tiene un
    // pago/OP aplicado). Una factura aplicada no se puede modificar por la API.
    if (/se encuentra aplicada/i.test(String(err.message || "") + String(err.cuerpo || "")))
      return {
        estado: "bloqueada",
        mensaje: "Factura aplicada en Xubio: la factura " + completo.numeroDocumento + " ya tiene un pago aplicado, y Xubio no deja cambiarle el centro de costo por la API. Si hace falta, ponerle \"" + cc.nombre + "\" a mano en Xubio" + antesTenia + ".",
        factura: antes,
        centroDeCosto: cc,
        transaccionid: id,
      };
    motivoXubio = (String(err.cuerpo || "").match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || "";
    motivoXubio = motivoXubio.replace(/\\"/g, '"').slice(0, 200);
    // Se guarda la respuesta completa de Xubio (JSON) para poder mandarla a soporte (info@xubio.com).
    return { ...bloqueada(false), errorXubio: String(err.cuerpo || err.message || "").slice(0, 6000), transaccionid: id };
  }
  let despues = await xubio("GET", "/comprobanteCompraBean/" + id);
  // Sección 152: si al cambiar el servicio Xubio cambió el total (ej. otra alícuota de IVA), se deja como estaba
  // el servicio y se pone solo el centro de costo: la factura nunca puede quedar con otro importe.
  if (prod && !servicioNoAceptado && Number(despues.importetotal) !== Number(completo.importetotal)) {
    servicioNoAceptado = true;
    await xubio("PUT", "/comprobanteCompraBean/" + id, soloCentro);
    despues = await xubio("GET", "/comprobanteCompraBean/" + id);
  }
  const itemsDespues = comoLista(despues.transaccionProductoItems);
  const ok = itemsDespues.every((it) => idDe(it.centroDeCosto) === cc.id);
  const servOk = !prod || servicioNoAceptado || itemsDespues.every(prodOk);
  const totalIgual = Number(despues.importetotal) === Number(completo.importetotal);
  return {
    estado: ok && totalIgual && servOk ? (servicioNoAceptado ? "servicio_no_aceptado" : "ok") : "no_verificado",
    mensaje: ok && totalIgual && servOk
      ? 'Centro de costo "' + cc.nombre + '"' + (servicioNoAceptado ? "" : yServ) + (prod && !servicioNoAceptado ? " asignados" : " asignado") + " en Xubio" + antesTenia + "." +
        (servicioNoAceptado ? ' Xubio no aceptó cambiar el servicio a "' + prod.nombre + '" sin cambiar el importe: ponelo a mano en Xubio si hace falta.' : "")
      : "Xubio aceptó el cambio pero al volver a leer la factura no coincide. Revisarla en Xubio.",
    factura: resumenComprobante(despues),
    centroDeCosto: cc,
    producto: servicioNoAceptado ? null : prod,
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


// Solo lectura: qué tipos de valores (cheque, transferencia, efectivo...) y qué conceptos de
// retención se usan en las órdenes de pago existentes, con un ejemplo de cada uno.
async function modelosOP(p) {
  const hasta = new Date();
  const desde = new Date();
  desde.setDate(desde.getDate() - (p.dias || 90));
  const l = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta)));
  const instrumentos = {};
  const retenciones = {};
  for (const op of l) {
    for (const it of comoLista(op.transaccionInstrumentoDePago)) {
      const k = it.tipoCuenta + "|" + (it.cuenta && it.cuenta.nombre);
      if (!instrumentos[k]) instrumentos[k] = { veces: 0, ejemplo: { ...it, op: op.numeroRecibo, proveedor: op.proveedor && op.proveedor.nombre } };
      instrumentos[k].veces++;
    }
    for (const r of comoLista(op.transaccionRetencionItems)) {
      const k = r.tipoRetencion + "|" + (r.conceptoRetencion && r.conceptoRetencion.nombre);
      if (!retenciones[k]) retenciones[k] = { veces: 0, ejemplo: { ...r, op: op.numeroRecibo, proveedor: op.proveedor && op.proveedor.nombre } };
      retenciones[k].veces++;
    }
  }
  const conceptos = comoLista(await xubio("GET", "/retencionBean").catch(() => []))
    .filter((r) => r.codigoImpuesto === "217")
    .map((r) => ({ id: r.retencionId, nombre: r.nombre, regimen: r.codigoRegimen, desde: r.importedesde, porcentaje: r.porcentaje }));
  return { estado: "ok", ops: l.length, instrumentos, retenciones, conceptosGanancias: conceptos };
}








// Solo lectura: rasgos de varias facturas (las que Xubio deja cambiar y las que no) para compararlas.
async function resumenFacturas(p) {
  const out = [];
  for (const f of p.facturas || []) {
    const r = await buscarFactura({ cuit: f.cuit, factura: f.factura, fecha: "" });
    if (r.estado !== "encontrada") {
      out.push({ ...f, estado: r.estado });
      continue;
    }
    const b = await xubio("GET", "/comprobanteCompraBean/" + r.comprobante.transaccionid);
    const items = comoLista(b.transaccionProductoItems);
    out.push({
      grupo: f.grupo,
      numero: b.numeroDocumento,
      id: b.transaccionid,
      fecha: b.fecha,
      fechaFiscal: b.fechaFiscal,
      total: b.importetotal,
      percepciones: comoLista(b.transaccionPercepcionItems).map((x) => (x.percepcionImpuesto && x.percepcionImpuesto.nombre) + " " + x.importe),
      renglones: items.map((it) => ({
        producto: it.producto && it.producto.nombre,
        centro: it.centroDeCosto && it.centroDeCosto.nombre,
        iva: it.iva,
        importe: it.importe,
        total: it.total,
        pciva: it.precioconivaincluido,
        exento: it.montoExento,
      })),
      provincia: b.provincia && b.provincia.nombre,
      condicionDePago: b.condicionDePago,
      tipo: b.tipo,
      campos: Object.keys(b).sort().join(","),
    });
  }
  return { estado: "ok", facturas: out };
}



// Sección 118 (pedido del usuario, 09/10/2026): justo antes de emitir la OP, se vuelve a guardar cada factura
// en Xubio con el mismo centro de costo que ya tiene (sin cambiar nada). Si Xubio responde "La transacción se
// encuentra aplicada", la factura ya tiene un pago aplicado (alguien hizo la OP a mano) y la OP no se emite.
async function facturaYaAplicada(id) {
  const completo = await xubio("GET", "/comprobanteCompraBean/" + id);
  const numero = completo.numeroDocumento;
  if (comoLista(completo.transaccionOrdenPagoItems).length) return { aplicada: true, numero };
  const items = comoLista(completo.transaccionProductoItems);
  const cuerpo = {
    ...completo,
    descripcion: completo.descripcion == null ? "" : completo.descripcion, // Sección 123
    transaccionProductoItems: items.map((it) => ({ ...it, ...(it.centroDeCosto && idDe(it.centroDeCosto) != null ? { centroDeCosto: { ID: idDe(it.centroDeCosto) } } : {}) })),
  };
  try {
    await xubio("PUT", "/comprobanteCompraBean/" + id, cuerpo);
  } catch (err) {
    if (/se encuentra aplicada/i.test(String(err.message || "") + String(err.cuerpo || ""))) return { aplicada: true, numero };
    throw err;
  }
  // Control: se vuelve a leer y no tiene que haber cambiado el total ni los centros.
  const despues = await xubio("GET", "/comprobanteCompraBean/" + id);
  const centros = (f) => comoLista(f.transaccionProductoItems).map((it) => idDe(it.centroDeCosto)).join(",");
  if (Number(despues.importetotal) !== Number(completo.importetotal) || centros(despues) !== centros(completo))
    throw new Error("Al verificar la factura " + numero + " en Xubio cambió el total o el centro de costo: revisarla.");
  return { aplicada: false, numero };
}

// Sección 122: el proceso ahora queda corriendo horas (vigilando); antes de cada pasada se borran las listas
// guardadas de Xubio (facturas, proveedores, centros) para trabajar siempre con lo último.
function limpiarCaches() {
  productosCache = null;
  for (const k of Object.keys(cacheListas)) delete cacheListas[k];
  centrosCache = null;
  proveedoresCache = null;
}

module.exports = { listarPorFechas, limpiarCaches, facturaYaAplicada, resumenFacturas, xubio, buscarFactura, buscarProveedor, fechaXubio, comoLista, idDe, modelosOP, diagnosticoPruebaOP, diagnosticoPagos, diagnostico, asignarCentroCosto, centrosDeCosto, productosCompra, buscarProducto, CENTRO_GASTOS_GENERALES, partesNumero, normalizar };
