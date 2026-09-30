/*
 * Integración automática MIA → Xubio (centro de costo de las facturas de compra).
 *
 * GitHub Actions corre este script cada ~5 minutos (.github/workflows/xubio.yml). En cada corrida:
 *   1. Lee las líneas de Pagos de MIA (campo `pagosSemanales` de app/state; qa_app/state en QA).
 *   2. Toda línea con CUIT y número de factura se manda a Xubio: busca la factura (por CUIT del
 *      proveedor + número) y le pone el centro de costo. Nunca crea facturas ni centros.
 *   3. El resultado de cada línea queda en `xubioEstado/{id de la línea}` (qa_xubioEstado en QA),
 *      que MIA muestra en Pagos como ✅ / ❌ al lado del número de factura.
 *   - Líneas nuevas, o en rojo que se modificaron: se mandan en la corrida siguiente.
 *   - Las que quedaron en verde no se vuelven a mandar nunca (salvo "Reintentar ahora").
 *   - Las que no quedaron bien (❌) se reintentan cada 3 horas (por si la factura se carga después).
 *   - "Reintentar ahora" desde MIA marca `forzar` y se reintenta en la corrida siguiente.
 *
 * También procesa pedidos sueltos de `xubioPedidos` (diagnóstico). Todo queda en `xubioLog`.
 */
const admin = require("firebase-admin");
const { diagnostico, diagnosticoPagos, diagnosticoPruebaOP, modelosOP, asignarCentroCosto, centrosDeCosto, partesNumero, normalizar } = require("./xubio");

admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
const db = admin.firestore();

// `automatico`: si se procesan solas las líneas de Pagos de ese ambiente.
// Producción queda apagada hasta que el usuario dé el OK para subir la integración.
const AMBIENTES = [
  { nombre: "qa", prefijo: "qa_", automatico: true },
  { nombre: "prd", prefijo: "", automatico: false },
];
const MAX_PEDIDOS = 40;
const MAX_LINEAS = 40;
const REINTENTO_MS = 3 * 3600 * 1000;
const TRABADO_MS = 15 * 60 * 1000;
const BIEN = new Set(["ok", "ya_estaba"]);
// Estados que no se arreglan solos: se reintentan una vez por día.
const LENTOS = new Set(["bloqueada", "repartida", "centro_no_encontrado", "varias_facturas"]);

const texto = (v, max = 200) => (v == null ? "" : String(v).slice(0, max));
const limpio = (o) => JSON.parse(JSON.stringify(o === undefined ? null : o));
const soloDigitos = (s) => String(s || "").replace(/\D/g, "");
const t = (s) => String(s || "").trim();

// Debe ser idéntica a xubioFirma() en MIA: si cambia algo de esto, la línea se vuelve a mandar.
const firma = (l) =>
  [
    soloDigitos(l.cuit),
    t(l.factura),
    t(l.cliente).toUpperCase(),
    t(l.centroCosto).toUpperCase(),
    t(l.subObra).toUpperCase(),
    t(l.centroCostoXubio),
  ].join("|");

const camposLinea = (l) => ({
  cuit: texto(l.cuit, 20),
  factura: texto(l.factura, 40),
  fecha: texto(l.fechaPagado, 20),
  cliente: texto(l.cliente),
  centroCosto: texto(l.centroCosto),
  subObra: texto(l.subObra),
  centroCostoXubio: texto(l.centroCostoXubio),
});

async function registrar(amb, datos) {
  await db
    .collection(amb.prefijo + "xubioLog")
    .add({ fecha: Date.now(), ...limpio(datos) })
    .catch(() => {});
}

// ---------- Líneas de Pagos (automático) ----------
async function procesarLineas(amb) {
  const st = await db.doc(amb.prefijo + "app/state").get();
  const lineas = (st.exists && st.get("pagosSemanales")) || [];
  const col = db.collection(amb.prefijo + "xubioEstado");
  const previos = {};
  (await col.get()).docs.forEach((d) => (previos[d.id] = d.data()));

  // Una misma factura cargada en varias líneas de Pagos con distintos centros de costo no se toca:
  // Xubio tiene un centro por renglón y no se sabe cómo repartirla.
  const validas = lineas.filter((l) => l && l.id && soloDigitos(l.cuit) && t(l.factura));
  const objetivo = (l) =>
    normalizar(
      t(l.centroCostoXubio) ||
        (normalizar(l.cliente) === "WU" ? t(l.subObra) : t(l.cliente) + " " + t(l.centroCosto)),
    );
  const grupos = {};
  for (const l of validas) {
    const k = soloDigitos(l.cuit) + "|" + partesNumero(l.factura).numero;
    (grupos[k] = grupos[k] || []).push(l);
  }
  const repartida = {};
  for (const g of Object.values(grupos)) {
    const destinos = [...new Set(g.map(objetivo))];
    if (g.length > 1 && destinos.length > 1) {
      const nombres = [
        ...new Set(g.map((l) => t(l.centroCostoXubio) || (normalizar(l.cliente) === "WU" ? t(l.subObra) : t(l.centroCosto)))),
      ];
      for (const l of g)
        repartida[l.id] =
          "Esta factura está en " + g.length + " líneas de Pagos con distintos centros de costo (" + nombres.join(", ") +
          "). Como en Xubio se reparte por renglón, no se tocó: hay que ponerle los centros a mano en Xubio.";
    }
  }

  const ahora = Date.now();
  const cola = [];
  for (const l of validas) {
    const f = firma(l);
    const e = previos[l.id];
    let prioridad = null;
    // Una vez en verde no se vuelve a mandar nunca (pedido del usuario), salvo "Reintentar ahora".
    if (e && e.forzar) prioridad = -1;
    else if (e && BIEN.has(e.estado)) prioridad = null;
    else if (!e || e.firma !== f) prioridad = 0;
    else if (!BIEN.has(e.estado) && ahora - (e.intento || 0) > (LENTOS.has(e.estado) ? 24 * 3600 * 1000 : REINTENTO_MS))
      prioridad = 1;
    if (prioridad !== null) cola.push({ l, f, e, prioridad });
  }
  cola.sort((a, b) => a.prioridad - b.prioridad || ((a.e && a.e.intento) || 0) - ((b.e && b.e.intento) || 0));

  let n = 0;
  for (const { l, f, e } of cola.slice(0, MAX_LINEAS)) {
    let r;
    try {
      r = repartida[l.id]
        ? { estado: "repartida", mensaje: repartida[l.id] }
        : await asignarCentroCosto({ ...camposLinea(l), centroAnterior: (e && e.centro) || "" });
    } catch (err) {
      r = { estado: "error", mensaje: texto((err && err.message) || err, 500) };
    }
    const mismo = e && e.firma === f;
    const doc = {
      estado: r.estado || "error",
      mensaje: r.mensaje || null,
      // Centro que quedó puesto en Xubio (solo si quedó bien); sirve para poder cambiarlo si después cambia en MIA.
      centro: BIEN.has(r.estado) && r.centroDeCosto ? r.centroDeCosto.nombre : (e && e.centro) || null,
      centroMia: (r.centroDeCosto && r.centroDeCosto.nombre) || null,
      facturaXubio: (r.factura && r.factura.numeroDocumento) || null,
      proveedorXubio: (r.factura && r.factura.proveedor) || null,
      factura: texto(l.factura, 40),
      firma: f,
      intento: Date.now(),
      intentos: (mismo ? e.intentos || 0 : 0) + 1,
      primerIntento: (mismo && e.primerIntento) || Date.now(),
      forzar: false,
    };
    await col.doc(l.id).set(limpio(doc));
    await registrar(amb, {
      accion: "linea",
      lineaPagosId: l.id,
      ...camposLinea(l),
      estado: doc.estado,
      mensaje: doc.mensaje,
    });
    console.log(`[${amb.nombre}] línea ${l.id} factura ${l.factura} → ${doc.estado}: ${doc.mensaje || ""}`);
    n++;
  }
  console.log(`[${amb.nombre}] líneas procesadas: ${n} (en espera: ${Math.max(0, cola.length - n)})`);
}

// ---------- Pedidos sueltos (diagnóstico) ----------
async function procesarPedidos(amb) {
  const col = db.collection(amb.prefijo + "xubioPedidos");
  const trabados = await col.where("estado", "==", "procesando").get();
  for (const d of trabados.docs)
    if (Date.now() - (d.get("inicio") || 0) > TRABADO_MS)
      await d.ref.update({ estado: "error", mensaje: "El proceso se interrumpió.", procesado: Date.now() });

  const snap = await col.where("estado", "==", "pendiente").limit(MAX_PEDIDOS).get();
  for (const d of snap.docs) {
    const p = await db.runTransaction(async (tx) => {
      const s = await tx.get(d.ref);
      if (!s.exists || s.get("estado") !== "pendiente") return null;
      tx.update(d.ref, { estado: "procesando", inicio: Date.now() });
      return s.data();
    });
    if (!p) continue;
    let r;
    try {
      if (p.accion === "diagnostico") r = await diagnostico();
      else if (p.accion === "diagnosticoPagos") r = await diagnosticoPagos(p);
      else if (p.accion === "diagnosticoPruebaOP") r = await diagnosticoPruebaOP(p);
      else if (p.accion === "modelosOP") r = await modelosOP(p);
      else if (p.accion === "asignarCentroCosto")
        r = await asignarCentroCosto({
          ...camposLinea({ ...p, fechaPagado: p.fecha }),
          simular: amb.automatico ? !!p.simular : true,
        });
      else r = { estado: "error", mensaje: "Acción desconocida: " + texto(p.accion, 40) };
    } catch (e) {
      r = { estado: "error", mensaje: texto((e && e.message) || e, 500) };
    }
    const { estado, mensaje, ...detalle } = r || {};
    await d.ref.update({ estado: estado || "error", mensaje: mensaje || null, detalle: limpio(detalle), procesado: Date.now() });
    await registrar(amb, { accion: p.accion || null, pedidoId: d.id, estado: estado || "error", mensaje: mensaje || null });
    console.log(`[${amb.nombre}] pedido ${d.id} ${p.accion} → ${estado}`);
  }
}

// ---------- Lista de centros de costo de Xubio para MIA (cada ~6 horas) ----------
async function actualizarCentros() {
  const refs = AMBIENTES.map((a) => db.doc(a.prefijo + "xubioConfig/centros"));
  const actual = await refs[0].get();
  if (actual.exists && Date.now() - (actual.get("actualizado") || 0) < 6 * 3600 * 1000) return;
  const nombres = (await centrosDeCosto())
    .map((c) => c.nombre)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"));
  for (const r of refs) await r.set({ nombres, actualizado: Date.now() });
  console.log("Centros de costo de Xubio actualizados: " + nombres.length);
}

(async () => {
  try {
    await actualizarCentros();
  } catch (e) {
    console.error("No se pudo actualizar la lista de centros:", (e && e.message) || e);
  }
  for (const amb of AMBIENTES) {
    await procesarPedidos(amb);
    if (amb.automatico) await procesarLineas(amb);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
