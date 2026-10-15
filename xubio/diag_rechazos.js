// Diagnóstico SOLO LECTURA de las OP de Producción (sin datos de negocio).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500));
(async () => {
  const ops = await db.collection("xubioOP").get();
  out("prd OP total " + ops.size);
  ops.docs.forEach((d, i) => {
    const x = d.data();
    out("OP " + (i + 1) + " / estado " + x.estado + " / modo " + x.modo + " / tiene numero OP " + !!x.opNumero + " / retenciones " + ((x.retenciones || []).length) + " / mensaje: " + String(x.mensaje || "").replace(/[\d.,$]+/g, "#").slice(0, 200));
  });
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
