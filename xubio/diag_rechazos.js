// SOLO LECTURA: estados de centro de costo después del arreglo de la Sección 143 (sin importes).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).replace(/\$[-\d.,]+/g, "$#").slice(0, 900));
(async () => {
  const est = (await db.collection("xubioEstado").get()).docs.map((d) => d.data());
  const c = {};
  est.forEach((e) => (c[e.estado] = (c[e.estado] || 0) + 1));
  out("Estados: " + Object.entries(c).map(([k, v]) => k.replace(/_/g, " ") + " = " + v).join(" / "));
  const desde = Date.UTC(2026, 9, 27, 22, 20);
  const rec = est.filter((e) => (e.intento || 0) >= desde);
  const r = {};
  rec.forEach((e) => (r[e.estado] = (r[e.estado] || 0) + 1));
  out("Procesadas desde el arreglo: " + rec.length + " → " + Object.entries(r).map(([k, v]) => k.replace(/_/g, " ") + " = " + v).join(" / "));
  est.filter((e) => /A-0*4-0*000000[34]\b|00004-0000000[34]/.test(String(e.mensaje || "") + " " + String(e.facturaXubio || ""))).forEach((e) => out("PABLO MOHR?: " + e.estado + " / " + String(e.mensaje || "").slice(0, 160)));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
