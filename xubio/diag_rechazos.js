// Diagnóstico SOLO LECTURA: cuántas líneas de Producción hay en cada estado de Xubio (sin datos).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500));
(async () => {
  const snap = await db.collection("xubioEstado").get();
  const c = {}, hoy = {};
  const desde = Date.UTC(2026, 9, 13, 18, 0);
  snap.docs.forEach((d) => { const e = d.get("estado"); c[e] = (c[e] || 0) + 1; (d.get("intento") || 0) >= desde && (hoy[e] = (hoy[e] || 0) + 1); });
  out("Estados (todas): " + JSON.stringify(c));
  out("Procesadas desde las 15:00: " + JSON.stringify(hoy));
  const r = snap.docs.filter((d) => d.get("estado") === "rechazada" && (d.get("intento") || 0) >= desde).map((d) => String(d.get("mensaje") || "").replace(/.*No se pudo completar la operación"?:? ?/, "").slice(0, 120));
  out("Rechazadas después del arreglo, motivos: " + JSON.stringify([...new Set(r)]).slice(0, 900));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
