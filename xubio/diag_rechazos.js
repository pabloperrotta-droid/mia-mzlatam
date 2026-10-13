// Diagnóstico SOLO LECTURA: nombre exacto del centro "Gastos Generales" en Xubio y cuántas líneas internas fallan.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500));
(async () => {
  const c = await db.doc("xubioConfig/centros").get();
  const nombres = (c.exists && c.get("nombres")) || [];
  out("Centros en Xubio: " + nombres.length + ". Parecidos a gastos generales: " + JSON.stringify(nombres.filter((n) => /GAST|GENERAL|GRAL|ADMIN|ESTRUCT/i.test(n))));
  const snap = await db.collection("xubioEstado").get();
  const internas = {};
  snap.docs.forEach((d) => { if (/"INTERNO /i.test(String(d.get("mensaje") || ""))) { const e = d.get("estado"); internas[e] = (internas[e] || 0) + 1; } });
  out("Líneas internas que todavía fallan, por estado: " + JSON.stringify(internas));
  const gg = {};
  snap.docs.forEach((d) => { if (/gastos generales de oficina/i.test(String(d.get("centroMia") || "") + " " + String(d.get("mensaje") || ""))) { const e = d.get("estado"); gg[e] = (gg[e] || 0) + 1; } });
  out("Líneas con Gastos Generales de Oficina, por estado: " + JSON.stringify(gg));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
