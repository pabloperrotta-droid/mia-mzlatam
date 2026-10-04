/*
 * Respaldo diario de la base de MIA (Producción). Lo corre GitHub Actions todos los días
 * (.github/workflows/respaldo.yml).
 *
 * Copia todas las colecciones de Producción (sin las de QA "qa_*", ni las de registro técnico)
 * en un solo JSON comprimido (gzip), y lo guarda en la misma base, en `respaldosDiarios/{AAAA-MM-DD}`,
 * partido en pedazos de 700 KB (`partes/{n}`). Se conservan los últimos 15 días (cada respaldo pesa ~7,5 MB comprimido por los PDF guardados; 15 días ≈ 110 MB del 1 GB gratis de la base).
 *
 * No se guarda en el repositorio porque el repositorio es público.
 */
const admin = require("firebase-admin");
const zlib = require("zlib");

admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
const db = admin.firestore();

const COLECCION = "respaldosDiarios";
const NO_COPIAR = new Set([COLECCION, "presencia", "xubioLog", "xubioPedidos", "respaldos"]);
const PARTE = 700000;
const DIAS = 15;

const plano = (v) => {
  if (v instanceof admin.firestore.Timestamp) return { __timestamp__: v.toMillis() };
  if (Array.isArray(v)) return v.map(plano);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plano(x)]));
  return v;
};

async function copiarColeccion(col) {
  const out = {};
  const snap = await col.get();
  for (const d of snap.docs) {
    const item = { datos: plano(d.data()) };
    const subs = await d.ref.listCollections();
    if (subs.length) {
      item.sub = {};
      for (const s of subs) item.sub[s.id] = await copiarColeccion(s);
    }
    out[d.id] = item;
  }
  return out;
}

(async () => {
  const hoy = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
  const todo = {};
  const resumen = {};
  for (const col of await db.listCollections()) {
    if (col.id.startsWith("qa_") || NO_COPIAR.has(col.id)) continue;
    todo[col.id] = await copiarColeccion(col);
    resumen[col.id] = Object.keys(todo[col.id]).length;
  }
  const json = JSON.stringify({ fecha: hoy, creado: Date.now(), colecciones: todo });
  const b64 = zlib.gzipSync(Buffer.from(json, "utf8")).toString("base64");
  const partes = Math.max(1, Math.ceil(b64.length / PARTE));
  const ref = db.collection(COLECCION).doc(hoy);
  for (let i = 0; i < partes; i++) await ref.collection("partes").doc(String(i)).set({ datos: b64.slice(i * PARTE, (i + 1) * PARTE) });
  await ref.set({ fecha: hoy, creado: Date.now(), partes, bytesJson: json.length, bytesComprimido: b64.length, colecciones: resumen });
  console.log(`Respaldo ${hoy}: ${Math.round(json.length / 1024)} KB (${Math.round(b64.length / 1024)} KB comprimido, ${partes} parte/s)`, resumen);

  // Se conservan los últimos DIAS respaldos.
  const viejos = (await db.collection(COLECCION).orderBy("fecha", "desc").get()).docs.slice(DIAS);
  for (const d of viejos) {
    for (const p of (await d.ref.collection("partes").get()).docs) await p.ref.delete();
    await d.ref.delete();
    console.log("Borrado respaldo viejo " + d.id);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
