/*
 * Respaldo diario de la base de MIA (Producción). Lo corre GitHub Actions todos los días
 * (.github/workflows/respaldo.yml).
 *
 * Copia todas las colecciones de Producción (sin las de QA "qa_*", ni las de registro técnico)
 * en un solo JSON comprimido (gzip), y lo guarda en la misma base, en `respaldosDiarios/{AAAA-MM-DD}`,
 * partido en pedazos de 700 KB (`partes/{n}`). Se conservan los últimos 20 diarios (completos) y 48 por hora (sin PDF, solo si algo cambió).
 * Desde el 05/11/2026 los corre el proceso de Xubio (xubio/procesar.js): el diario a las 18 hs y uno por hora.
 *
 * No se guarda en el repositorio porque el repositorio es público.
 */
const zlib = require("zlib");

const COLECCION = "respaldosDiarios";
// Sección 165: además del diario (completo), uno por hora "liviano" (sin los PDF guardados) si algo cambió, para
// poder volver a cualquier hora de los últimos días (pedido del usuario: "que nunca nunca se borren los datos").
const COLECCION_HORA = "respaldosHorarios";
// Los PDF de facturas de proveedores no entran en el respaldo diario (se guardan solo 15 días y el usuario
// tiene los originales). Los PDF de las órdenes de compra SÍ se respaldan (pedido del usuario: "que
// queden en el respaldo, por las dudas").
const NO_COPIAR = new Set([COLECCION, COLECCION_HORA, "respaldosManuales", "procesoXubio", "presencia", "xubioLog", "xubioPedidos", "respaldos", "pdfsFacturasPago"]);
const NO_COPIAR_HORA = new Set([...NO_COPIAR, "pdfsOC", "historial", "facturasEdiciones", "facturasPapelera", "erroresGuardado"]);
const PARTE = 700000;
const DIAS = 20;
const HORAS = 48;

function plano(admin, v) {
  if (v instanceof admin.firestore.Timestamp) return { __timestamp__: v.toMillis() };
  if (Array.isArray(v)) return v.map((x) => plano(admin, x));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plano(admin, x)]));
  return v;
}
// Sin los PDF (campos con datos de archivo en base64), para el respaldo por hora.
function sinPdf(v) {
  if (Array.isArray(v)) return v.map(sinPdf);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, /^pdf(Data|Base64)$/.test(k) ? (x ? "[pdf]" : x) : sinPdf(x)]));
  return typeof v === "string" && v.length > 200000 && /^data:/.test(v) ? "[archivo]" : v;
}

async function copiarColeccion(admin, col, liviano) {
  const out = {};
  const snap = await col.get();
  for (const d of snap.docs) {
    const datos = plano(admin, d.data());
    const item = { datos: liviano ? sinPdf(datos) : datos };
    const subs = await d.ref.listCollections();
    if (subs.length) {
      item.sub = {};
      for (const s of subs) item.sub[s.id] = await copiarColeccion(admin, s, liviano);
    }
    out[d.id] = item;
  }
  return out;
}

// Hace un respaldo de Producción. tipo "diario" (completo, doc = fecha) u "hora" (liviano, doc = fecha_hora).
// Sección 168: `espejo` (opcional, solo para el de hora) = copia en memoria que mantiene el proceso de Xubio
// escuchando la base: { colecciones: { id: { docId: datosPlanos } } }. Las colecciones que están en el espejo no
// se vuelven a leer (solo se leyeron los documentos que cambiaron); las demás se leen como siempre.
async function hacerRespaldo(admin, db, tipo = "diario", espejo = null) {
  const hora = tipo === "hora";
  const ar = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
  const id = hora ? ar.slice(0, 13).replace("T", "_") : ar.slice(0, 10);
  const nombreCol = hora ? COLECCION_HORA : COLECCION;
  const todo = {};
  const resumen = {};
  for (const col of await db.listCollections()) {
    if (col.id.startsWith("qa_") || (hora ? NO_COPIAR_HORA : NO_COPIAR).has(col.id)) continue;
    const e = hora && espejo && espejo.colecciones && espejo.colecciones[col.id];
    todo[col.id] = e
      ? Object.fromEntries(Object.entries(e).map(([id, datos]) => [id, { datos: sinPdf(datos) }]))
      : await copiarColeccion(admin, col, hora);
    resumen[col.id] = Object.keys(todo[col.id]).length;
  }
  const json = JSON.stringify({ fecha: id, creado: Date.now(), colecciones: todo });
  const b64 = zlib.gzipSync(Buffer.from(json, "utf8")).toString("base64");
  const partes = Math.max(1, Math.ceil(b64.length / PARTE));
  const ref = db.collection(nombreCol).doc(id);
  for (let i = 0; i < partes; i++) await ref.collection("partes").doc(String(i)).set({ datos: b64.slice(i * PARTE, (i + 1) * PARTE) });
  await ref.set({ fecha: id, creado: Date.now(), partes, bytesJson: json.length, bytesComprimido: b64.length, colecciones: resumen });
  console.log(`Respaldo ${tipo} ${id}: ${Math.round(json.length / 1024)} KB (${Math.round(b64.length / 1024)} KB comprimido, ${partes} parte/s)`);
  // Se conservan los últimos DIAS diarios y HORAS por hora.
  const viejos = (await db.collection(nombreCol).orderBy("fecha", "desc").get()).docs.slice(hora ? HORAS : DIAS);
  for (const d of viejos) {
    for (const p of (await d.ref.collection("partes").get()).docs) await p.ref.delete();
    await d.ref.delete();
    console.log("Borrado respaldo viejo " + nombreCol + "/" + d.id);
  }
  return id;
}

module.exports = { hacerRespaldo, plano, NO_COPIAR_HORA };

if (require.main === module) {
  const admin = require("firebase-admin");
  admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
  hacerRespaldo(admin, admin.firestore(), process.env.TIPO_RESPALDO || "diario").catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
