// Diagnóstico SOLO LECTURA: cómo están numerados los certificados de retención de las OP existentes.
const { xubio, comoLista, fechaXubio } = require("./xubio");
const out = (t) => console.log("::notice::" + String(t).slice(0, 1200));
(async () => {
  const hasta = new Date(), desde = new Date();
  desde.setDate(desde.getDate() - 365);
  const l = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta)));
  const certs = [];
  for (const op of l) for (const r of comoLista(op.transaccionRetencionItems)) certs.push({ n: String(r.numeroComprobante || ""), f: op.fecha, t: r.tipoRetencion, c: r.conceptoRetencion && r.conceptoRetencion.ID });
  out("OP " + l.length + ", retenciones " + certs.length + ", sin numero " + certs.filter((x) => !x.n).length);
  const patrones = {};
  certs.forEach((x) => { const p = x.n.replace(/\d/g, "9"); patrones[p] = (patrones[p] || 0) + 1; });
  out("Formatos: " + Object.entries(patrones).map(([k, v]) => k + " x" + v).join(" / "));
  const pref = {};
  certs.forEach((x) => { const m = x.n.match(/^(\d+)-/); m && (pref[m[1]] = (pref[m[1]] || 0) + 1); });
  out("Prefijos: " + JSON.stringify(pref));
  const orden = certs.filter((x) => x.n).sort((a, b) => String(a.f).localeCompare(String(b.f)));
  out("Ultimos 8 por fecha (fecha numero tipo): " + orden.slice(-8).map((x) => x.f + " " + x.n + " t" + x.t).join(" ; "));
  const nums = certs.map((x) => Number((x.n.match(/(\d+)$/) || [])[1])).filter((n) => n > 0);
  out("Mayor numero final " + Math.max(...nums) + ", repetidos " + (nums.length - new Set(nums).size));
  out("Misma OP con dos retenciones: " + l.filter((op) => comoLista(op.transaccionRetencionItems).length > 1).map((op) => comoLista(op.transaccionRetencionItems).map((r) => r.numeroComprobante).join("=")).slice(0, 5).join(" ; "));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
