// RECUPERACIÓN (pedida por el usuario 05/11/2026: "Sí, recuperá las facturas"): vuelve a agregar a Facturación de
// Producción las facturas del respaldo diario del 04/11/2026 (11:26). Solo AGREGA las que no están (mismo id); no
// borra ni modifica nada. En el log solo cantidades y fechas (sin datos).
const admin = require("firebase-admin");
const zlib = require("zlib");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 900));
const revivir = (v) => {
  if (Array.isArray(v)) return v.map(revivir);
  if (v && typeof v === "object") {
    if (Object.keys(v).length === 1 && typeof v.__timestamp__ === "number") return admin.firestore.Timestamp.fromMillis(v.__timestamp__);
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, revivir(x)]));
  }
  return v;
};
async function escribir(ref, item) {
  await ref.set(revivir(item.datos || {}));
  for (const [sub, docs] of Object.entries(item.sub || {})) for (const [id, it] of Object.entries(docs)) await escribir(ref.collection(sub).doc(id), it);
}
(async () => {
  const ref = db.collection("respaldosDiarios").doc("2026-11-04");
  const m = (await ref.get()).data();
  let b64 = "";
  for (let i = 0; i < m.partes; i++) b64 += (await ref.collection("partes").doc(String(i)).get()).data().datos;
  const j = JSON.parse(zlib.gunzipSync(Buffer.from(b64, "base64")).toString("utf8"));
  const fact = (j.colecciones || {}).facturas || {};
  const ya = new Set((await db.collection("facturas").get()).docs.map((d) => d.id));
  let agregadas = 0, salteadas = 0, ultimaAlta = 0;
  for (const [id, item] of Object.entries(fact)) {
    if (ya.has(id)) { salteadas++; continue; }
    await escribir(db.collection("facturas").doc(id), item);
    agregadas++;
    ultimaAlta = Math.max(ultimaAlta, Number((item.datos || {}).creadoEn) || 0);
  }
  const ahora = (await db.collection("facturas").get()).size;
  out("Respaldo 04/11: " + Object.keys(fact).length + " facturas · agregadas " + agregadas + " · ya estaban " + salteadas + " · ahora en Facturación: " + ahora + " · la más nueva cargada el " + (ultimaAlta ? new Date(ultimaAlta - 3 * 3600e3).toISOString().slice(0, 16).replace("T", " ") : "?"));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
