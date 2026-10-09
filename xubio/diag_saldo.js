// Diagnóstico SOLO LECTURA (09/10/2026): ¿Xubio informa el saldo / si una factura de compra está aplicada?
// ¿Cómo vienen los números de e-cheq en las OP (pagoBean)? Solo se muestran nombres de campos y marcas, no datos.
const { xubio, comoLista } = require("./xubio.js");
const out = (t) => console.log("::notice::" + String(t).slice(0, 1800).replace(/\n/g, " "));
const claves = (o) => Object.keys(o || {});
const interes = (o) => claves(o).filter((k) => /sald|estad|aplic|pend|pag|cobr|cancel|imput|deuda/i.test(k)).map((k) => k + "=" + JSON.stringify(o[k]).slice(0, 60));
(async () => {
  // OP recientes: cómo vienen los e-cheqs
  const hoy = new Date(), desde = new Date(hoy - 30 * 86400000), f2 = (d) => d.toISOString().slice(0, 10);
  const ops = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + f2(desde) + "&fechaHasta=" + f2(hoy)));
  out("OP últimos 30 días: " + ops.length);
  const tipos = {};
  ops.forEach((o) => comoLista(o.transaccionInstrumentoDePago).forEach((i) => { const k = claves(i).sort().join(","); tipos[k] = (tipos[k] || 0) + 1; }));
  Object.entries(tipos).slice(0, 4).forEach(([k, n]) => out("Instrumento (" + n + "): " + k));
  const conCheque = ops.map((o) => comoLista(o.transaccionInstrumentoDePago)).flat().filter((i) => /cheq/i.test(JSON.stringify(i)));
  out("Instrumentos con cheque: " + conCheque.length + " | campos: " + claves(conCheque[0]).join(","));
  conCheque[0] && out("Campos de cheque con valor (sin mostrar números): " + claves(conCheque[0]).filter((k) => /cheq|numero|venc|banco|tipo/i.test(k)).map((k) => k + (conCheque[0][k] == null || conCheque[0][k] === "" ? "=vacío" : "=con dato")).join(", "));
  const op0 = ops.find((o) => comoLista(o.transaccionInstrumentoDePago).some((i) => /cheq/i.test(JSON.stringify(i))));
  op0 && out("OP con cheques: ¿trae facturas aplicadas? campos con 'aplic|factur|comprob': " + claves(op0).filter((k) => /aplic|factur|comprob|transaccion/i.test(k)).map((k) => k + "=" + (Array.isArray(op0[k]) ? "lista " + op0[k].length : typeof op0[k])).join(", "));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
