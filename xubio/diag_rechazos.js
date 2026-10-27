// SOLO LECTURA: ¿Xubio corta el listado de comprobantes de compra en 1000? (cantidades y fechas extremas)
const { xubio, comoLista, fechaXubio } = require("./xubio");
const out = (t) => console.log("::notice::" + String(t).slice(0, 900));
(async () => {
  const hoy = new Date();
  for (const meses of [1, 2, 3, 4, 6, 13]) {
    const d = new Date(); d.setMonth(d.getMonth() - meses);
    const h = new Date(); h.setDate(h.getDate() + 30);
    const l = comoLista(await xubio("GET", "/comprobanteCompraBean?fechaDesde=" + fechaXubio(d) + "&fechaHasta=" + fechaXubio(h)));
    const f = l.map((c) => c.fecha).filter(Boolean).sort();
    out(meses + " meses: " + l.length + " comprobantes, fechas " + f[0] + " a " + f[f.length - 1]);
  }
  for (const extra of ["&page=2", "&pagina=2", "&offset=1000", "&limit=2000", "&size=2000"]) {
    const d = new Date(); d.setMonth(d.getMonth() - 13);
    try {
      const l = comoLista(await xubio("GET", "/comprobanteCompraBean?fechaDesde=" + fechaXubio(d) + "&fechaHasta=" + fechaXubio(hoy) + extra));
      const f = l.map((c) => c.fecha).filter(Boolean).sort();
      out("con " + extra + ": " + l.length + ", fechas " + f[0] + " a " + f[f.length - 1]);
    } catch (e) { out("con " + extra + ": error " + String(e.message).slice(0, 100)); }
  }
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
