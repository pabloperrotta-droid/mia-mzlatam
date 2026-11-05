// SOLO LECTURA: verifica que los respaldos se puedan abrir y que QA sea copia de Producción.
// Imprime solo fechas, tamaños y cantidades de documentos (ningún dato del negocio).
const zlib = require("zlib");
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
const db = admin.firestore();
const n = (s) => console.log("::notice::" + s);
const ar = (ms) => (ms ? new Date(ms - 3 * 3600 * 1000).toISOString().slice(0, 16).replace("T", " ") : "-");

async function revisar(col, cuantos) {
  const docs = (await db.collection(col).orderBy("fecha", "desc").get()).docs;
  n(`${col}: ${docs.length} guardados (de ${docs.length ? docs[docs.length - 1].id : "-"} a ${docs.length ? docs[0].id : "-"})`);
  for (const d of docs.slice(0, cuantos)) {
    const m = d.data();
    let ok = "ERROR";
    try {
      const partes = (await d.ref.collection("partes").get()).docs.sort((a, b) => +a.id - +b.id);
      if (partes.length !== m.partes) throw new Error(`partes ${partes.length}/${m.partes}`);
      const json = JSON.parse(zlib.gunzipSync(Buffer.from(partes.map((p) => p.get("datos")).join(""), "base64")).toString("utf8"));
      const malas = Object.entries(m.colecciones || {}).filter(([c, k]) => Object.keys(json.colecciones[c] || {}).length !== k);
      const f = Object.keys(json.colecciones.facturas || {}).length;
      const app = Object.keys(json.colecciones.app || {}).length;
      ok = malas.length ? "NO COINCIDE " + malas.map((x) => x[0]).join(",") : `OK se abre bien · facturas ${f} · docs app ${app}`;
    } catch (e) {
      ok = "ERROR " + e.message;
    }
    n(`  ${col}/${d.id} creado ${ar(m.creado)} · ${Math.round((m.bytesComprimido || 0) / 1024)} KB · ${ok}`);
  }
}

(async () => {
  await revisar("respaldosDiarios", 3);
  await revisar("respaldosHorarios", 4);
  const man = await db.collection("respaldosManuales").get();
  n(`respaldosManuales: ${man.size}`);
  const c = await db.doc("qa_app/copiaDeProduccion").get();
  n(`QA copia de Producción: ${c.exists ? ar(c.get("copiado")) + " · " + c.get("documentos") + " documentos" : "nunca"}`);
  for (const col of ["app", "facturas", "partes", "pdfsOC", "echeqs"]) {
    const p = (await db.collection(col).count().get()).data().count;
    const q = (await db.collection("qa_" + col).count().get()).data().count;
    n(`  ${col}: Producción ${p} · QA ${q}`);
  }
  const s = await db.doc("app/st_pagosSemanales").get();
  const sq = await db.doc("qa_app/st_pagosSemanales").get();
  n(`Último cambio Pagos: Producción ${ar(s.updateTime && s.updateTime.toMillis())} · QA ${ar(sq.updateTime && sq.updateTime.toMillis())}`);
})().catch((e) => { console.error(e); process.exit(1); });
