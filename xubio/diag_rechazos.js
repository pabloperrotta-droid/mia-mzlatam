// Diagnóstico SOLO LECTURA antes de activar las OP en Producción (sin datos de negocio).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500));
(async () => {
  const c = await db.doc("xubioConfig/op").get();
  out("prd xubioConfig/op existe: " + c.exists + " desde: " + (c.exists ? c.get("desde") : "-") + " activado: " + (c.exists && c.get("activado") ? new Date(c.get("activado")).toISOString() : "-"));
  const ops = await db.collection("xubioOP").get();
  const e = {};
  ops.docs.forEach((d) => { const s = d.get("estado"); e[s] = (e[s] || 0) + 1; });
  out("prd xubioOP por estado: " + JSON.stringify(e));
  out("prd echeqs cargados: " + (await db.collection("echeqs").get()).size);
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
