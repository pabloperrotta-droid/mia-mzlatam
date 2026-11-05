// Prueba de cuota de Firestore: 1 lectura y 1 escritura en un documento de prueba de QA. No toca Producción.
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
const db = admin.firestore();
const n = (s) => console.log("::notice::" + s);
(async () => {
  try {
    const t = (await admin.credential.applicationDefault().getAccessToken()).access_token;
    const r = await fetch("https://cloudbilling.googleapis.com/v1/projects/mzlatam-app/billingInfo", { headers: { Authorization: "Bearer " + t } });
    const j = await r.json();
    n("FACTURACION: " + (r.ok ? "billingEnabled=" + !!j.billingEnabled : r.status + " " + ((j.error && j.error.status) || "")));
  } catch (e) { n("FACTURACION: " + e.message); }
  try { await db.doc("qa_app/pruebaCuota").get(); n("LECTURA: OK"); } catch (e) { n("LECTURA: " + (e.details || e.message)); }
  try { await db.doc("qa_app/pruebaCuota").set({ t: Date.now() }); n("ESCRITURA: OK"); } catch (e) { n("ESCRITURA: " + (e.details || e.message)); }
})();
