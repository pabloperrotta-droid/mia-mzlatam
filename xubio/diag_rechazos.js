// SOLO LECTURA: cuántas facturas hay en cada respaldo y en la base ahora (sin datos).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 900));
const ar = (ms) => new Date(ms - 3 * 3600e3).toISOString().slice(0, 16).replace("T", " ");
(async () => {
  for (const c of ["respaldosDiarios", "respaldosHorarios", "respaldosManuales"]) {
    const r = await db.collection(c).get();
    out(c + ": " + r.docs.map((d) => d.id + " facturas=" + ((d.get("colecciones") || {}).facturas ?? "?") + " creado " + ar(d.get("creado") || 0)).join(" · ") || "(vacío)");
  }
  const f = await db.collection("facturas").get();
  out("facturas ahora: " + f.size);
  const h = await db.collection("historial").get();
  out("historial: " + h.docs.map((d) => d.id + " facturas=" + ((d.get("facturas") || []).length)).join(" · "));
})().catch((e) => out("ERROR " + e.message));
