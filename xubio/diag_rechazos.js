// SOLO LECTURA: cómo distingue Xubio una factura de una nota de crédito en las compras (campos de tipo).
const { xubio, comoLista, fechaXubio } = require("./xubio");
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500));
(async () => {
  const hasta = new Date(), desde = new Date();
  desde.setMonth(desde.getMonth() - 6);
  const l = comoLista(await xubio("GET", "/comprobanteCompraBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta)));
  const neg = l.filter((c) => Number(c.importetotal) < 0), pos = l.filter((c) => Number(c.importetotal) > 0);
  out("comprobantes " + l.length + ", negativos " + neg.length + ", positivos " + pos.length);
  const simples = (c) => Object.entries(c).filter(([k, v]) => v == null || typeof v !== "object" || (v && (v.nombre || v.codigo))).map(([k, v]) => k + "=" + (v && typeof v === "object" ? (v.codigo || "") + "/" + (v.nombre || "") : typeof v === "number" && !/tipo|letra|id$/i.test(k) ? "num" : String(v).replace(/\d{5,}/g, "#").slice(0, 25))).join(" | ");
  neg[0] && out("NEGATIVO: " + simples(neg[0]));
  pos[0] && out("POSITIVO: " + simples(pos[0]));
  const tipos = {};
  l.forEach((c) => { const k = ["tipo", "tipoComprobante", "tipocomprobante", "nombre"].map((x) => x + ":" + JSON.stringify(c[x] && typeof c[x] === "object" ? c[x].nombre || c[x].codigo : c[x])).join(" ") + " signo:" + Math.sign(Number(c.importetotal)); tipos[k] = (tipos[k] || 0) + 1; });
  out("combinaciones: " + JSON.stringify(tipos).slice(0, 1200));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
