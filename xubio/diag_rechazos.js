// SOLO LECTURA: ¿hubo una restauración de backup en Producción? Cuenta facturas por hora de creación del documento
// (una restauración borra y vuelve a crear todas a la vez) y la última modificación de los documentos de app/. Sin datos.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 900));
const ar = (ts) => new Date(ts.toMillis() - 3 * 3600e3).toISOString().slice(0, 16).replace("T", " ");
(async () => {
  for (const pref of ["", "qa_"]) {
    const f = await db.collection(pref + "facturas").get();
    const c = {};
    f.docs.forEach((d) => { const k = ar(d.createTime).slice(0, 15) + "x"; c[k] = (c[k] || 0) + 1; });
    const top = Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => k + " → " + v).join(" · ");
    out((pref || "PRD ") + "facturas: " + f.size + " docs; más creadas por 10 min (hora AR): " + top);
    const app = await db.collection(pref + "app").get();
    out((pref || "PRD ") + "app: " + app.docs.map((d) => d.id + " " + ar(d.updateTime)).join(" · "));
  }
})().catch((e) => out("ERROR " + e.message));
