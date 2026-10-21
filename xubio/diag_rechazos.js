// Alta del primer Admin en la lista de usuarios de QA (qa_usuarios), pedido del usuario 20/10/2026.
// El mail llega por variable de entorno del paso (no queda en el código).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 300));
(async () => {
  const email = String(process.env.MAIL_ADMIN || "").trim().toLowerCase();
  if (!email.includes("@")) return out("falta el mail");
  const ref = db.collection("qa_usuarios").doc(email);
  const ya = await ref.get();
  if (ya.exists) return out("ya estaba: rol " + ya.get("rol"));
  await ref.set({ nombre: "Pablo", rol: "admin", activo: true, alta: Date.now(), altaPor: "inicial" });
  out("Admin de QA cargado");
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
