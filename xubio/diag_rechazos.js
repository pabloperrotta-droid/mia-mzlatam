// SOLO LECTURA: respaldos (diarios y por hora) y réplica de QA: fechas, horas y tamaño. Sin datos.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 900));
const ar = (ms) => new Date(ms - 3 * 3600e3).toISOString().slice(0, 16).replace("T", " ");
(async () => {
  for (const c of ["respaldosHorarios", "respaldosDiarios"]) {
    const r = await db.collection(c).orderBy("fecha", "desc").limit(4).get();
    out(c + ": " + r.docs.map((d) => d.id + " (creado " + ar(d.get("creado")) + ", " + Math.round((d.get("bytesComprimido") || 0) / 1024) + " KB)").join(" · "));
  }
  const q = await db.doc("qa_app/copiaDeProduccion").get();
  out("QA copia de Producción: " + (q.exists ? ar(q.get("copiado")) + " · " + q.get("documentos") + " docs" : "todavía no"));
})().catch((e) => out("ERROR " + e.message));
