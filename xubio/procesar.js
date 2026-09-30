/*
 * Procesa los pedidos a Xubio que deja MIA en Firestore.
 *
 * Cómo funciona (sin servidor propio y sin plan pago de Firebase):
 *   1. En Pagos, el usuario toca "Xubio" en una línea → MIA crea un documento en
 *      `xubioPedidos` (`qa_xubioPedidos` en QA) con estado "pendiente".
 *   2. GitHub Actions corre este script cada ~5 minutos (.github/workflows/xubio.yml).
 *   3. El script toma los pendientes, habla con Xubio y escribe el resultado en el mismo
 *      documento (estado ok / factura_no_encontrada / centro_no_encontrado / ...).
 *      MIA lo muestra en la línea de Pagos.
 *
 * Cada pedido procesado queda además en `xubioLog` (`qa_xubioLog`).
 */
const admin = require("firebase-admin");
const { diagnostico, asignarCentroCosto, centrosDeCosto } = require("./xubio");

admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
const db = admin.firestore();

const AMBIENTES = [
  { nombre: "qa", pedidos: "qa_xubioPedidos", log: "qa_xubioLog" },
  { nombre: "prd", pedidos: "xubioPedidos", log: "xubioLog" },
];
const MAX_POR_CORRIDA = 40;
const TRABADO_MS = 15 * 60 * 1000;

const texto = (v, max = 200) => (v == null ? "" : String(v).slice(0, max));
const limpio = (o) => JSON.parse(JSON.stringify(o === undefined ? null : o));

async function tomar(ref) {
  return db.runTransaction(async (t) => {
    const s = await t.get(ref);
    if (!s.exists || s.get("estado") !== "pendiente") return null;
    t.update(ref, { estado: "procesando", inicio: Date.now() });
    return s.data();
  });
}

async function ejecutar(p) {
  if (p.accion === "diagnostico") return diagnostico();
  if (p.accion === "asignarCentroCosto")
    return asignarCentroCosto({
      cuit: texto(p.cuit, 20),
      factura: texto(p.factura, 40),
      fecha: texto(p.fecha, 20),
      cliente: texto(p.cliente),
      centroCosto: texto(p.centroCosto),
      subObra: texto(p.subObra),
      centroCostoXubio: texto(p.centroCostoXubio),
      simular: !!p.simular,
    });
  return { estado: "error", mensaje: "Acción desconocida: " + texto(p.accion, 40) };
}

async function procesarAmbiente(amb) {
  const col = db.collection(amb.pedidos);

  // Pedidos que quedaron "procesando" por una corrida que se cortó.
  const trabados = await col.where("estado", "==", "procesando").get();
  for (const d of trabados.docs) {
    if (Date.now() - (d.get("inicio") || 0) > TRABADO_MS)
      await d.ref.update({ estado: "error", mensaje: "El proceso se interrumpió. Volvé a enviarla.", procesado: Date.now() });
  }

  const snap = await col.where("estado", "==", "pendiente").limit(MAX_POR_CORRIDA).get();
  let n = 0;
  for (const d of snap.docs) {
    const p = await tomar(d.ref);
    if (!p) continue;
    let r;
    try {
      r = await ejecutar(p);
    } catch (e) {
      r = { estado: "error", mensaje: texto((e && e.message) || e, 500) };
    }
    const { estado, mensaje, ...detalle } = r || {};
    await d.ref.update({
      estado: estado || "error",
      mensaje: mensaje || null,
      detalle: limpio(detalle),
      procesado: Date.now(),
    });
    await db
      .collection(amb.log)
      .add({
        fecha: Date.now(),
        pedidoId: d.id,
        accion: p.accion || null,
        rol: p.rol || null,
        uid: p.uid || null,
        lineaPagosId: p.lineaPagosId || null,
        cuit: p.cuit || null,
        factura: p.factura || null,
        cliente: p.cliente || null,
        centroCosto: p.centroCosto || null,
        simular: !!p.simular,
        estado: estado || "error",
        mensaje: mensaje || null,
      })
      .catch(() => {});
    console.log(`[${amb.nombre}] ${d.id} ${p.accion} ${p.factura || ""} → ${estado}: ${mensaje || ""}`);
    n++;
  }
  console.log(`[${amb.nombre}] pedidos procesados: ${n}`);
}

// Lista de centros de costo de Xubio para que MIA la muestre (se refresca cada ~6 horas).
async function actualizarCentros() {
  const refs = AMBIENTES.map((a) => db.collection(a.nombre === "qa" ? "qa_xubioConfig" : "xubioConfig").doc("centros"));
  const actual = await refs[0].get();
  if (actual.exists && Date.now() - (actual.get("actualizado") || 0) < 6 * 3600 * 1000) return;
  const nombres = (await centrosDeCosto()).map((c) => c.nombre).filter(Boolean).sort((a, b) => a.localeCompare(b, "es"));
  for (const r of refs) await r.set({ nombres, actualizado: Date.now() });
  console.log("Centros de costo de Xubio actualizados: " + nombres.length);
}

(async () => {
  try {
    await actualizarCentros();
  } catch (e) {
    console.error("No se pudo actualizar la lista de centros:", (e && e.message) || e);
  }
  for (const amb of AMBIENTES) await procesarAmbiente(amb);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
