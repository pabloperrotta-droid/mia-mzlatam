// Diagnóstico SOLO LECTURA (09/10/2026): ¿Xubio informa el saldo / si una factura de compra está aplicada?
// ¿Cómo vienen los números de e-cheq en las OP (pagoBean)? Solo se muestran nombres de campos y marcas, no datos.
const { xubio, comoLista } = require("./xubio.js");
const out = (t) => console.log("::notice::" + String(t).slice(0, 1800).replace(/\n/g, " "));
const claves = (o) => Object.keys(o || {});
const interes = (o) => claves(o).filter((k) => /sald|estad|aplic|pend|pag|cobr|cancel|imput|deuda/i.test(k)).map((k) => k + "=" + JSON.stringify(o[k]).slice(0, 60));
(async () => {
  const f = await xubio("GET", "/comprobanteCompraBean/77723999");
  out("FACTURA campos: " + claves(f).join(","));
  out("FACTURA de interés (aplicada): " + interes(f).join(" | "));
  const items = comoLista(f.transaccionProductoItems);
  out("ITEM campos: " + claves(items[0]).join(","));
  // Listado por fecha (a veces trae más datos que el detalle)
  try {
    const l = comoLista(await xubio("GET", "/comprobanteCompraBean?fechaDesde=2026-09-25&fechaHasta=2026-09-25"));
    const x = l.find((c) => String(c.transaccionid || c.transaccionId) === "77723999") || l[0];
    out("LISTADO (" + l.length + ") campos: " + claves(x).join(","));
    out("LISTADO de interés: " + interes(x).join(" | "));
  } catch (e) { out("LISTADO error: " + e.message); }
  for (const ruta of ["/comprobanteCompraBean/77723999/saldo", "/saldoComprobanteBean/77723999", "/cuentaCorrienteProveedorBean?proveedorId=6357339", "/facturaCompraBean/77723999"]) {
    try { const r = await xubio("GET", ruta); out("RUTA " + ruta + " OK: " + (Array.isArray(r) ? "lista " + r.length + " campos " + claves(r[0]).join(",") : "campos " + claves(r).join(","))); }
    catch (e) { out("RUTA " + ruta + " → " + String(e.message).slice(0, 160)); }
  }
  // OP recientes: cómo vienen los e-cheqs
  const hoy = new Date(), desde = new Date(hoy - 30 * 86400000), f2 = (d) => d.toISOString().slice(0, 10);
  const ops = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + f2(desde) + "&fechaHasta=" + f2(hoy)));
  out("OP últimos 30 días: " + ops.length + " | campos OP: " + claves(ops[0]).join(","));
  const conCheque = ops.map((o) => comoLista(o.transaccionInstrumentoDePago)).flat().filter((i) => /cheq/i.test(JSON.stringify(i)));
  out("Instrumentos con cheque: " + conCheque.length + " | campos: " + claves(conCheque[0]).join(","));
  conCheque[0] && out("Campos de cheque con valor (sin mostrar números): " + claves(conCheque[0]).filter((k) => /cheq|numero|venc|banco|tipo/i.test(k)).map((k) => k + (conCheque[0][k] == null || conCheque[0][k] === "" ? "=vacío" : "=con dato")).join(", "));
  const op0 = ops.find((o) => comoLista(o.transaccionInstrumentoDePago).some((i) => /cheq/i.test(JSON.stringify(i))));
  op0 && out("OP con cheques: ¿trae facturas aplicadas? campos con 'aplic|factur|comprob': " + claves(op0).filter((k) => /aplic|factur|comprob|transaccion/i.test(k)).map((k) => k + "=" + (Array.isArray(op0[k]) ? "lista " + op0[k].length : typeof op0[k])).join(", "));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
