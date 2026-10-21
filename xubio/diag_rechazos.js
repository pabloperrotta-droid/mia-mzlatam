// SOLO LECTURA: ¿se usó el ingreso por mail en QA? (cantidad de cuentas, confirmadas, último ingreso; sin mails)
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 600));
(async () => {
  const l = await admin.auth().listUsers(1000);
  const conMail = l.users.filter((u) => u.email);
  out("Cuentas con mail: " + conMail.length + " / confirmadas " + conMail.filter((u) => u.emailVerified).length + " / proveedores " + JSON.stringify([...new Set(conMail.flatMap((u) => u.providerData.map((p) => p.providerId)))]) + " / ultimo ingreso " + (conMail.map((u) => u.metadata.lastSignInTime).filter(Boolean).sort().pop() || "-"));
  const us = await db.collection("qa_usuarios").get();
  out("qa_usuarios: " + us.size + " (roles: " + us.docs.map((d) => d.get("rol") + (d.get("activo") === false ? " inactivo" : "")).join(", ") + ")");
  const admins = await db.collection("qa_usuarios").where("rol", "==", "admin").get();
  const mailAdmin = admins.docs.map((d) => d.id);
  out("El Admin de QA ya ingresó: " + conMail.some((u) => mailAdmin.includes(String(u.email).toLowerCase()) && u.emailVerified));
  out("roles definidos en prd: " + (await db.collection("roles").get()).size + ", usuarios prd: " + (await db.collection("usuarios").get()).size);
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
