// Diagnóstico SOLO LECTURA: estructura (solo nombres de campos y tipos) de las retenciones de OP existentes en Xubio.
const { xubio, comoLista, fechaXubio } = require("./xubio");
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500));
(async () => {
  const hasta = new Date(), desde = new Date();
  desde.setDate(desde.getDate() - 120);
  const l = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + fechaXubio(desde) + "&fechaHasta=" + fechaXubio(hasta)));
  const conRet = l.filter((op) => comoLista(op.transaccionRetencionItems).length);
  out("OP leidas " + l.length + ", con retencion en el listado " + conRet.length);
  const tipo = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v === "object" ? "obj{" + Object.keys(v).join(",") + "}" : typeof v);
  const muestra = conRet[0] || l[0];
  if (!muestra) return out("sin OP");
  const full = muestra;
  out("ids: " + Object.entries(muestra).filter(([k]) => /id$/i.test(k)).map(([k, v]) => k + "=" + tipo(v)).join(", "));
  const it = comoLista(full.transaccionRetencionItems)[0];
  out("Campos OP completa: " + Object.keys(full).join(", "));
  out("Retencion item: " + (it ? Object.entries(it).map(([k, v]) => k + ":" + tipo(v) + (/Id$|ID$|^id$|tipo/i.test(k) && typeof v !== "object" ? "=" + v : "")).join(" | ") : "ninguno"));
  const ins = comoLista(full.transaccionInstrumentoDePago)[0];
  out("Instrumento: " + (ins ? Object.entries(ins).map(([k, v]) => k + ":" + tipo(v)).join(" | ") : "ninguno"));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
