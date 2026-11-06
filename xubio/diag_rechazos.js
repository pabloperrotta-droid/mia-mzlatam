// SOLO LECTURA (salvo 1 escritura de prueba en qa_app/pruebaCuota). Imprime solo horas y cantidades, ningún dato del negocio.
const zlib = require("zlib");
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
const db = admin.firestore();
const n = (s) => console.log("::notice::" + s);
const ar = (ms) => (ms ? new Date(ms - 3 * 3600 * 1000).toISOString().slice(5, 16).replace("T", " ") : "-");
async function abrir(d) {
  const m = d.data();
  try {
    const partes = (await d.ref.collection("partes").get()).docs.sort((a, b) => +a.id - +b.id);
    const j = JSON.parse(zlib.gunzipSync(Buffer.from(partes.map((p) => p.get("datos")).join(""), "base64")).toString("utf8"));
    const mal = Object.entries(m.colecciones || {}).some(([c, k]) => Object.keys(j.colecciones[c] || {}).length !== k);
    return `${d.id}(${ar(m.creado)}) ${mal ? "NO COINCIDE" : "ok"} fc${Object.keys(j.colecciones.facturas || {}).length}`;
  } catch (e) { return `${d.id} ERROR ${e.message}`; }
}
(async () => {
  try { await db.doc("qa_app/pruebaCuota").get(); n("LECTURA: OK"); } catch (e) { n("LECTURA: " + (e.details || e.message)); return; }
  try { await db.doc("qa_app/pruebaCuota").set({ t: Date.now() }); n("ESCRITURA: OK"); } catch (e) { n("ESCRITURA: " + (e.details || e.message)); }
  const pd = (await db.doc("procesoXubio/pasadaDiaria").get()).data() || {};
  n("PASADA DIARIA: " + (pd.fecha || "-") + " inicio " + ar(pd.inicio) + " fin " + ar(pd.fin));
  const c = await db.doc("qa_app/copiaDeProduccion").get();
  const out = [`QA copiada ${c.exists ? ar(c.get("copiado")) : "nunca"}`];
  for (const col of ["app", "facturas", "facturasPapelera", "pdfsOC", "echeqs"]) {
    out.push(`${col} ${(await db.collection(col).count().get()).data().count}/${(await db.collection("qa_" + col).count().get()).data().count}`);
  }
  n("PRD/QA: " + out.join(" · "));
})().catch((e) => { console.error(e); process.exit(1); });
