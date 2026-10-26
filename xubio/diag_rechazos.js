// SOLO LECTURA: cómo quedó guardado Cashflow → Salidas Semanales en Producción y si hubo fallas de guardado
// hoy (solo cantidades y textos de error, sin importes).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).replace(/\d{4,}/g, "#").slice(0, 900));
(async () => {
  const docs = (await db.collection("app").get()).docs;
  const donde = docs.filter((d) => JSON.stringify(Object.keys(d.data())).includes("cfSalidasValores") || d.id.includes("cfSalidas"));
  out("Docs de app: " + docs.map((d) => d.id + "(" + Math.round(JSON.stringify(d.data()).length / 1024) + "KB)").join(", "));
  for (const d of donde) {
    const v = d.get("cfSalidasValores") || d.get("v") || {};
    const ks = Object.keys(v);
    const porSemana = {};
    ks.forEach((k) => { const s = k.split("|").pop(); if (v[k] !== "" && Number(v[k])) porSemana[s] = (porSemana[s] || 0) + 1; });
    out(d.id + " actualizado " + d.updateTime.toDate().toISOString() + " / claves " + ks.length + " / con importe " + ks.filter((k) => v[k] !== "" && Number(v[k])).length + " / vacías " + ks.filter((k) => v[k] === "").length);
    out("Semanas con importes: " + Object.entries(porSemana).sort().slice(0, 30).map(([s, n]) => s.replace(/\/(\d{4})$/, "") + "=" + n).join(" "));
  }
  const fallas = (await db.collection("erroresGuardado").orderBy("fecha", "desc").limit(8).get().catch(() => ({ docs: [] }))).docs;
  fallas.forEach((d) => out("Falla " + new Date(d.get("fecha") || 0).toISOString() + ": " + String(d.get("motivo") || d.get("mensaje") || JSON.stringify(d.data())).slice(0, 300)));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
