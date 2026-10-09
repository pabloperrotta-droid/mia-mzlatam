// Prueba pedida por soporte de Xubio (07/10/2026), autorizada por el usuario: PUT del JSON que mandó Xubio sobre
// la factura de compra 77723999 (A-00011-00008239). Lee antes, guarda, lee después. Solo informa centros e importes.
const { xubio, comoLista, idDe } = require("./xubio.js");
const ID = 77723999;
const cuerpo = {
  externalId: "", numeroDocumento: "A-00011-00008239", descripcion: "", fecha: "2026-09-25",
  importeGravado: 152479.34, importeImpuestos: 32020.66, importetotal: 184500,
  moneda: { ID: -2, nombre: "Pesos Argentinos", codigo: "PESOS_ARGENTINOS", id: -2 },
  circuitoContable: { ID: -2, nombre: "default", codigo: "DEFAULT", id: -2 },
  cotizacion: 1, fechaVto: "2026-09-25", cotizacionListaDePrecio: 1,
  deposito: { ID: -2, nombre: "Depósito Universal", codigo: "DEPOSITO_UNIVERSAL", id: -2 },
  provincia: { ID: 1, nombre: "Buenos Aires", codigo: "BUENOS_AIRES", id: 1 },
  condicionDePago: 1, transaccionid: 77723999, fechaComprobante: "2026-09-25",
  transaccionProductoItems: [{
    transaccionCVItemId: 95921824, importe: 152479.34, descripcion: "",
    centroDeCosto: { ID: 61321 }, // 2º intento (08/10/2026): Xubio mandó el centro solo con {ID}
    cantidad: 1, precio: 152479.34,
    producto: { ID: 2676728, nombre: "MATERIALES", codigo: "MATERIALES", id: 2676728 },
    deposito: { ID: -2, nombre: "Depósito Universal", codigo: "DEPOSITO_UNIVERSAL", id: -2 },
    iva: 32020.66, total: 184500, precioconivaincluido: 0, montoExento: 0, porcentajeDescuento: 0, transaccionId: 77723999,
  }],
  proveedor: { ID: 6357339, nombre: "JORGE FERNANDEZ  Y  SILVIA CHUMBA   SH", codigo: "JORGE_FERNANDEZ_Y_SILVIA_CHUMBA_SH", id: 6357339 },
  tipo: 1, transaccionPercepcionItems: [], transaccionOrdenPagoItems: [], fechaFiscal: "2026-09-25", puntoVenta: "00011", cbuinformada: false,
};
const resumen = (f) => {
  const items = comoLista(f.transaccionProductoItems);
  return "total " + f.importetotal + " | items " + items.length + " | centros " + items.map((it) => (it.centroDeCosto && it.centroDeCosto.nombre) || idDe(it.centroDeCosto) || "-").join(",") +
    " | itemIds " + items.map((it) => it.transaccionCVItemId).join(",") + " | OP " + comoLista(f.transaccionOrdenPagoItems).length;
};
(async () => {
  const antes = await xubio("GET", "/comprobanteCompraBean/" + ID);
  console.log("::notice::ANTES " + resumen(antes));
  if (Math.abs(Number(antes.importetotal) - 184500) > 1) { console.log("::error::El total no es 184500: no se manda nada."); process.exit(1); }
  // 3er pedido de soporte (09/10): "el CURL que están utilizando y el error exacto". Se hace el PUT a mano
  // (sin el ayudante) para mostrar la respuesta de Xubio completa, tal cual llega.
  const id = String(process.env.XUBIO_CLIENT_ID || "").trim(), sec = String(process.env.XUBIO_SECRET_ID || "").trim();
  const tk = await fetch("https://xubio.com/API/1.1/TokenEndpoint", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(id + ":" + sec).toString("base64"), "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: "grant_type=client_credentials",
  });
  const tkTxt = await tk.text();
  console.log("::notice::TOKEN status " + tk.status + " | campos: " + Object.keys((() => { try { return JSON.parse(tkTxt); } catch { return {}; } })()).join(","));
  const token = JSON.parse(tkTxt).access_token;
  const cuerpoTxt = JSON.stringify(cuerpo);
  const r = await fetch("https://xubio.com/API/1.1/comprobanteCompraBean/" + ID, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json", Accept: "application/json" },
    body: cuerpoTxt,
  });
  const txt = await r.text();
  console.log("::notice::PUT status " + r.status + " " + r.statusText + " | date " + r.headers.get("date") + " | content-type " + r.headers.get("content-type") + " | largo " + txt.length);
  for (let i = 0; i < Math.min(txt.length, 12000); i += 1800) console.log("::notice::RESPUESTA[" + i + "] " + txt.slice(i, i + 1800).replace(/\r?\n/g, " ⏎ "));
  console.log("::notice::BODY_ENVIADO_LARGO " + cuerpoTxt.length);
  const despues = await xubio("GET", "/comprobanteCompraBean/" + ID);
  console.log("::notice::DESPUES " + resumen(despues));
})().catch((e) => { console.log("::error::" + String((e && e.message) || e).slice(0, 600).replace(/\n/g, " ")); process.exit(1); });
