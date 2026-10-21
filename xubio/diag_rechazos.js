// SOLO LECTURA: cómo están cargados los instrumentos de pago de las OP hechas a mano (tipos y campos).
const { xubio, comoLista, fechaXubio } = require("./xubio");
const out = (t) => console.log("::notice::" + String(t).slice(0, 1200));
(async () => {
  const hasta = new Date(), desde = new Date();
  desde.setDate(desde.getDate() - 60);
  const l = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta)));
  const tipos = {};
  for (const op of l)
    for (const i of comoLista(op.transaccionInstrumentoDePago)) {
      const k = "tipo " + i.tipoCuenta + " | " + (i.cuenta && i.cuenta.nombre) + " (id " + (i.cuenta && (i.cuenta.ID || i.cuenta.id)) + ")";
      const t = (tipos[k] = tipos[k] || { n: 0, chPropio: 0, chTerceros: 0, venc: 0, banco: 0 });
      t.n++;
      i.chequePropio && t.chPropio++;
      i.chequeTerceros && t.chTerceros++;
      i.vencimientoCheque && t.venc++;
      i.banco && i.banco.nombre && t.banco++;
    }
  Object.entries(tipos).sort((a, b) => b[1].n - a[1].n).slice(0, 12).forEach(([k, v]) => out(k + " → " + JSON.stringify(v)));
  const conCheque = l.find((op) => comoLista(op.transaccionInstrumentoDePago).some((i) => i.chequePropio));
  if (conCheque) {
    const i = comoLista(conCheque.transaccionInstrumentoDePago).find((x) => x.chequePropio);
    out("Ejemplo instrumento con cheque propio (campos): " + Object.entries(i).map(([k, v]) => k + "=" + (v && typeof v === "object" ? "{" + Object.keys(v).join(",") + (v.nombre ? ":" + v.nombre : "") + "}" : typeof v === "number" && k !== "tipoCuenta" ? "num" : typeof v === "string" && /\d{4,}/.test(v) ? "texto" : v)).join(" | "));
  }
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
