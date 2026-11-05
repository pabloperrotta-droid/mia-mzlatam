// Prueba de cuota de Firestore: 1 lectura y 1 escritura en un documento de prueba de QA. No toca Producción.
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
const db = admin.firestore();
const n = (s) => console.log("::notice::" + s);
(async () => {
  try { await db.doc("qa_app/pruebaCuota").get(); n("LECTURA: OK"); } catch (e) { n("LECTURA: " + (e.details || e.message)); }
  try { await db.doc("qa_app/pruebaCuota").set({ t: Date.now() }); n("ESCRITURA: OK"); } catch (e) { n("ESCRITURA: " + (e.details || e.message)); }
})();
