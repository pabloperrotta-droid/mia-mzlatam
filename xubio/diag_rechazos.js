// Diagnóstico SOLO LECTURA de la reactivación de OP en Producción (sin datos de negocio).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 800));
(async () => {
  const c = await db.doc("xubioConfig/op").get();
  out("desde " + c.get("desde") + " activado " + new Date(c.get("activado") || 0).toISOString());
  const e = {};
  (await db.collection("xubioOP").get()).docs.forEach((d) => { const s = d.get("estado"); e[s] = (e[s] || 0) + 1; });
  out("OP por estado: " + Object.entries(e).map(([k, v]) => k.replace(/_/g, " ") + " = " + v).join(" / "));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
