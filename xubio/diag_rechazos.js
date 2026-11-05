// SOLO LECTURA: cantidad de documentos por colección en Producción y en QA (sin datos).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 900));
(async () => {
  const r = [];
  for (const c of ["app", "facturas", "facturasPapelera", "partes", "pdfsOC", "echeqs"]) {
    const a = (await db.collection(c).get()).size, b = (await db.collection("qa_" + c).get()).size;
    r.push(c + " prd " + a + " / qa " + b);
  }
  out("Colecciones: " + r.join(" · "));
})().catch((e) => out("ERROR " + e.message));
