// SOLO LECTURA: estado de los respaldos diarios (fechas, horas, partes y tamaño; sin datos).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const zlib = require("zlib");
const out = (t) => console.log("::notice::" + String(t).slice(0, 600));
(async () => {
  const r = await db.collection("respaldosDiarios").orderBy("fecha", "desc").limit(3).get();
  for (const d of r.docs) {
    const m = d.data();
    const ps = await d.ref.collection("partes").get();
    let b64 = "";
    for (let i = 0; i < (m.partes || 0); i++) { const p = await d.ref.collection("partes").doc(String(i)).get(); b64 += (p.exists && p.data().datos) || ""; }
    let ok = "ok";
    try { const j = JSON.parse(zlib.gunzipSync(Buffer.from(b64, "base64")).toString("utf8")); ok = "ok, se lee (creado " + new Date(j.creado).toISOString() + ")"; } catch (e) { ok = "NO SE LEE: " + e.message; }
    out(d.id + " · meta creado " + new Date(m.creado).toISOString() + " · partes meta " + m.partes + " / en base " + ps.size + " · " + ok);
  }
})().catch((e) => out("ERROR " + e.message));
