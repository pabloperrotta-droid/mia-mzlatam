/*
 * Integración automática MIA → Xubio (centro de costo de las facturas de compra).
 *
 * GitHub Actions corre este script cada ~5 minutos (.github/workflows/xubio.yml). En cada corrida:
 *   1. Lee las líneas de Pagos de MIA (app/st_pagosSemanales desde la Sección 90; antes app/state).
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
const { armarOP, crearOP, claveGrupo, fechaISO } = require("./ordenesPago");
const { limpiarCaches, facturaYaAplicada, diagnostico, diagnosticoPagos, diagnosticoPruebaOP, modelosOP, resumenFacturas, asignarCentroCosto, centrosDeCosto, CENTRO_GASTOS_GENERALES, partesNumero, normalizar } = require("./xubio");

admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
const db = admin.firestore();

// `automatico`: si se procesan solas las líneas de Pagos de ese ambiente.
// Producción queda apagada hasta que el usuario dé el OK para subir la integración.
// Producción activada el 30/09/2026 con OK del usuario ("pasalo a producción").
// QA usa el mismo Xubio: desde ese momento el centro de costo en QA es solo prueba (no cambia Xubio)
// y las OP en QA son solo vista previa.
const AMBIENTES = [
  { nombre: "qa", prefijo: "qa_", automatico: true, simular: true },
  // Pausado del 30/09 al 13/10/2026. REACTIVADO el 13/10/2026 con OK del usuario ("lo de Xubio también"):
  // centro de costo automático (solo líneas sin Fecha Pagado, Sección 120).
  // Sección 126: órdenes de pago ACTIVADAS el 15/10/2026 con OK del usuario ("poné en producción el tema de las
  // órdenes de pago"). `opActivacion`: la fecha "desde" que quedó de la prueba del 30/09 se descarta; se toma
  // de nuevo la de hoy y todo lo que ya estaba pagado queda como "anterior" (esas OP ya se hicieron a mano).
  // Pausadas del 15/10 al 20/10/2026 (esperando a Xubio). REACTIVADAS el 20/10/2026 con OK del usuario ("las OP a
  // partir de cuándo se despause"): nueva activación, todo lo pagado hasta ahora queda como "anterior".
  // PAUSADAS de nuevo el 21/10/2026 14:25 (pedido del usuario: "pausalo todo") hasta que Xubio confirme qué
  // tipoCuenta va para el cheque propio diferido ("Tipo de cuenta acepta valores 1, 2 ó 5"; manda 4).
  { nombre: "prd", prefijo: "", automatico: true, ops: false, opActivacion: Date.UTC(2026, 9, 20, 18, 0) },
];
const MAX_PEDIDOS = 40;
const MAX_LINEAS = 40;
const REINTENTO_MS = 3 * 3600 * 1000;
const ARREGLO_DESCRIPCION = Date.UTC(2026, 9, 13, 18, 0); // 13/10/2026 15:00 (Argentina)
const ARREGLO_INTERNOS = Date.UTC(2026, 9, 13, 19, 50); // 13/10/2026 16:50 (Argentina): internos → Gastos Generales
// Sección 143: 27/10/2026 ~19:45 (Argentina). Las que quedaron mal por el tope de 1000 de Xubio o por tomar una
// nota de crédito como factura se vuelven a probar una vez enseguida.
const ARREGLO_TOPE_Y_NC = Date.UTC(2026, 9, 27, 22, 45);
// Sección 144: "s/f" (sin factura) en el número de factura → no va a Xubio (pedido del usuario, 27/10/2026).
const sinFactura = (f) => /^(sf|sinfactura|sinfac|sinfact)$/.test(String(f || "").toLowerCase().replace(/[\s.\/\\_-]/g, ""));
const TRABADO_MS = 15 * 60 * 1000;
const BIEN = new Set(["ok", "ya_estaba", "simulacion", "en_otra_linea"]);
// Estados que no se arreglan solos: se reintentan una vez por día.
const LENTOS = new Set(["rechazada", "bloqueada", "repartida", "centro_no_encontrado", "varias_facturas", "importe_no_coincide"]);

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
    String(Number(l.importe) || 0),
  ].join("|");

const camposLinea = (l, importeMia) => ({
  importeMia: importeMia != null ? importeMia : l.importe != null && l.importe !== "" ? Number(l.importe) || 0 : null,
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

// Desde la Sección 90 las líneas de Pagos están en su propio documento (app/st_pagosSemanales, campo "v");
// si todavía no se mudaron, siguen en app/state.
async function leerPagos(amb) {
  const ext = await db.doc(amb.prefijo + "app/st_pagosSemanales").get();
  if (ext.exists) return ext.get("v") || [];
  const st = await db.doc(amb.prefijo + "app/state").get();
  return (st.exists && st.get("pagosSemanales")) || [];
}

// ---------- Líneas de Pagos (automático) ----------
async function procesarLineas(amb) {
  const lineas = await leerPagos(amb);
  const col = db.collection(amb.prefijo + "xubioEstado");
  const previos = {};

  // Una misma factura cargada en varias líneas de Pagos con distintos centros de costo (ej. Imak repartida
  // en 3 sub obras de WU): en Xubio se le pone el centro de costo de la parte con mayor Importe Bruto
  // (definición del usuario: "en Xubio poner el centro de costo de la imputación más grande"). Las demás
  // líneas quedan como "en_otra_linea".
  // Sección 120 (pedido del usuario, 09/10/2026): el centro de costo se pone solo en las líneas SIN Fecha Pagado
  // ("Sin Fecha Pagado" y "Postergados"). Las pagadas no se tocan (en Xubio ya suelen tener el pago aplicado), salvo
  // las pagadas desde que se activaron las OP: esas necesitan el centro antes de emitir su OP.
  const cfgOP = await db.doc(amb.prefijo + "xubioConfig/op").get();
  const opDesde = (cfgOP.exists && cfgOP.get("desde")) || null;
  const validas = lineas.filter(
    (l) => l && l.id && soloDigitos(l.cuit) && t(l.factura) && !sinFactura(l.factura) && (!fechaISO(l.fechaPagado) || (opDesde && fechaISO(l.fechaPagado) >= opDesde)),
  );
  // Sección 122: se leen solo los estados de estas líneas (no la colección entera), para gastar pocas lecturas
  // de la base ahora que el proceso corre seguido.
  for (let i = 0; i < validas.length; i += 200) {
    const refs = validas.slice(i, i + 200).map((l) => col.doc(String(l.id)));
    refs.length && (await db.getAll(...refs)).forEach((d) => d.exists && (previos[d.id] = d.data()));
  }
  // Los gastos internos van todos a Gastos Generales (Sección 125): dos rubros internos en la misma factura no son "repartida".
  const objetivo = (l) =>
    normalizar(
      t(l.centroCostoXubio) ||
        (normalizar(l.cliente) === "INTERNO"
          ? CENTRO_GASTOS_GENERALES
          : normalizar(l.cliente) === "WU" ? t(l.subObra) : t(l.cliente) + " " + t(l.centroCosto)),
    );
  const grupos = {};
  for (const l of validas) {
    const k = soloDigitos(l.cuit) + "|" + partesNumero(l.factura).numero;
    (grupos[k] = grupos[k] || []).push(l);
  }
  // Importe Final de Pagos por factura (si está en varias líneas, la suma) para compararlo con Xubio.
  const claveFactura = (l) => soloDigitos(l.cuit) + "|" + partesNumero(l.factura).numero;
  const importePorFactura = {};
  for (const l of validas) importePorFactura[claveFactura(l)] = (importePorFactura[claveFactura(l)] || 0) + (Number(l.importe) || 0);
  const repartida = {};
  const nombreCentro = (l) =>
    t(l.centroCostoXubio) ||
    (normalizar(l.cliente) === "INTERNO" ? CENTRO_GASTOS_GENERALES : normalizar(l.cliente) === "WU" ? t(l.subObra) : t(l.centroCosto));
  for (const g of Object.values(grupos)) {
    const destinos = [...new Set(g.map(objetivo))];
    if (g.length > 1 && destinos.length > 1) {
      const principal = g
        .slice()
        .sort((a, b) => (Number(b.importeBruto) || 0) - (Number(a.importeBruto) || 0) || (Number(b.importe) || 0) - (Number(a.importe) || 0))[0];
      for (const l of g)
        l.id !== principal.id &&
          (repartida[l.id] =
            "Factura repartida en " + g.length + " líneas: en Xubio va el centro de costo de la parte más grande (" + nombreCentro(principal) + ").");
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
    // Factura repartida: si cambió cuál es la parte más grande, se vuelve a procesar.
    else if (e && e.estado === "en_otra_linea" && !repartida[l.id]) prioridad = 0;
    else if (repartida[l.id] && (!e || e.estado !== "en_otra_linea")) prioridad = 0;
    else if (e && BIEN.has(e.estado)) prioridad = null;
    else if (!e || e.firma !== f) prioridad = 0;
    // Sección 123: las rechazadas antes del arreglo de la descripción vacía se vuelven a probar una vez enseguida.
    else if (e.estado === "rechazada" && (e.intento || 0) < ARREGLO_DESCRIPCION) prioridad = 1;
    // Sección 125: las líneas internas que no quedaron bien se vuelven a probar una vez enseguida, ahora con Gastos Generales.
    else if (normalizar(l.cliente) === "INTERNO" && !t(l.centroCostoXubio) && (e.intento || 0) < ARREGLO_INTERNOS) prioridad = 1;
    else if (["importe_no_coincide", "factura_no_encontrada", "varias_facturas"].includes(e.estado) && (e.intento || 0) < ARREGLO_TOPE_Y_NC) prioridad = 1;
    // Sección 120: si faltaba el centro de costo en Xubio, se vuelve a probar cada 30 minutos (por si lo crearon a mano).
    else if (!BIEN.has(e.estado) && ahora - (e.intento || 0) > (e.estado === "centro_no_encontrado" ? 30 * 60 * 1000 : LENTOS.has(e.estado) ? 24 * 3600 * 1000 : REINTENTO_MS))
      prioridad = 1;
    if (prioridad !== null) cola.push({ l, f, e, prioridad });
  }
  cola.sort((a, b) => a.prioridad - b.prioridad || ((a.e && a.e.intento) || 0) - ((b.e && b.e.intento) || 0));

  let n = 0;
  for (const { l, f, e } of cola.slice(0, MAX_LINEAS)) {
    let r;
    try {
      r = repartida[l.id]
        ? { estado: "en_otra_linea", mensaje: repartida[l.id] }
        : await asignarCentroCosto({ ...camposLinea(l, importePorFactura[claveFactura(l)]), centroAnterior: (e && e.centro) || "", simular: !!amb.simular });
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
      errorXubio: r.errorXubio || null,
      transaccionid: r.transaccionid || (r.factura && r.factura.id) || null,
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
  // Resumen visible en GitHub (sin datos): cuántas líneas se miraron y cuántas se procesaron.
  avisos < 8 && n > 0 && (avisos++, console.log(`::notice::[${amb.nombre}] ${new Date().toISOString()} líneas sin pagar con factura: ${validas.length}, procesadas ahora: ${n}, en espera: ${Math.max(0, cola.length - n)}`));
}
let avisos = 0;


// ---------- Órdenes de pago (ver ordenesPago.js) ----------
const OP_HECHA = new Set(["creada", "ya_existia", "pago_ya_aplicado"]);
async function procesarOPs(amb) {
  const cfgRef = db.doc(amb.prefijo + "xubioConfig/op");
  const cfgSnap = await cfgRef.get();
  let cfg = cfgSnap.exists ? cfgSnap.data() : {};
  let primeraVez = false;
  if (!cfg.desde || (amb.opActivacion && (cfg.activado || 0) < amb.opActivacion)) {
    // Solo se arman OP de líneas pagadas desde que se activó esto. Las que ya estaban pagadas en ese
    // momento (aunque sean de hoy) quedan como "anterior": esas OP ya se hicieron a mano.
    const hoy = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
    cfg = { ...cfg, desde: hoy };
    primeraVez = true;
    await cfgRef.set({ desde: hoy, activado: Date.now() }, { merge: true });
  }
  // En Producción se crea al tildar pagada; QA usa el mismo Xubio, así que ahí nunca se crea.
  const crear = amb.nombre === "prd";

  const lineas = (await leerPagos(amb)).filter(
    (l) => l && l.id && soloDigitos(l.cuit) && t(l.factura) && !sinFactura(l.factura) && fechaISO(l.fechaPagado) && fechaISO(l.fechaPagado) >= cfg.desde,
  );
  if (!lineas.length) return;
  const grupos = {};
  for (const l of lineas) (grupos[claveGrupo(l)] = grupos[claveGrupo(l)] || []).push(l);

  const colOP = db.collection(amb.prefijo + "xubioOP");
  const previas = {};
  (await colOP.get()).docs.forEach((d) => (previas[d.id] = d.data()));
  const estadosCentro = {};
  (await db.collection(amb.prefijo + "xubioEstado").get()).docs.forEach((d) => (estadosCentro[d.id] = d.data()));
  const cheques = (await db.collection(amb.prefijo + "echeqs").get()).docs.map((d) => ({ id: d.id, ...d.data() }));

  if (primeraVez) {
    // Las OP que hubieran quedado sin hacer de una activación anterior (ej. con error) también pasan a "anterior".
    for (const [clave, prev] of Object.entries(previas))
      if (!OP_HECHA.has(prev.estado) && prev.estado !== "anterior")
        await colOP.doc(clave).set({ estado: "anterior", mensaje: "Pagada antes de reactivar las órdenes de pago: la OP se hace a mano.", actualizado: Date.now() }, { merge: true });
    for (const [clave, ls] of Object.entries(grupos))
      await colOP.doc(clave).set({
        estado: "anterior",
        mensaje: "Ya estaba pagada cuando se activó la integración: la OP se hace a mano.",
        lineas: ls.map((l) => l.id),
        actualizado: Date.now(),
      });
    console.log(`[${amb.nombre}] OP: activación, ${Object.keys(grupos).length} grupos ya pagados quedan como anteriores`);
    return;
  }
  for (const [clave, ls] of Object.entries(grupos)) {
    const prev = previas[clave];
    if (prev && (OP_HECHA.has(prev.estado) || prev.estado === "anterior")) continue;
    // Sección 127: sin E-Cheq ni transferencia no hay OP (efectivo y Diego Levy van sin orden de pago).
    if (!ls.some((l) => (Number(l.echeq) || 0) > 0 || (Number(l.transferencia) || 0) > 0)) {
      if (prev) await colOP.doc(clave).delete();
      continue;
    }
    const [cuit, fecha] = clave.split("_");
    const suyos = cheques.filter((c) => c.cuit === cuit && c.fechaEmision === fecha && (!c.asignadoA || c.asignadoA === clave));
    let r;
    try {
      r = await armarOP(ls, suyos, estadosCentro);
    } catch (e) {
      r = { estado: "error", mensaje: texto((e && e.message) || e, 500) };
    }
    const doc = { ...r, actualizado: Date.now(), modo: crear ? "crear" : "vista_previa" };
    delete doc.cuerpo;
    if (r.estado === "lista" && crear) {
      // Sección 118: antes de emitir, se verifica factura por factura que no tenga ya un pago aplicado.
      let aplicadas = [];
      try {
        for (const f of r.facturas || []) (await facturaYaAplicada(f.id)).aplicada && aplicadas.push(f.numero);
      } catch (e) {
        doc.estado = "error";
        doc.mensaje = "No se pudo verificar si las facturas ya tienen un pago aplicado: " + texto((e && e.message) || e, 300);
        await colOP.doc(clave).set(limpio(doc));
        console.log(`[${amb.nombre}] OP ${clave} → error al verificar: ${doc.mensaje}`);
        continue;
      }
      if (aplicadas.length) {
        doc.estado = "pago_ya_aplicado";
        doc.mensaje =
          "El pago ya fue aplicado anteriormente en Xubio a " + (aplicadas.length > 1 ? "las facturas " : "la factura ") + aplicadas.join(", ") +
          " (la OP se hizo a mano). No se emitió la OP.";
        await registrar(amb, { accion: "ordenPago", grupo: clave, estado: doc.estado, mensaje: doc.mensaje });
        await colOP.doc(clave).set(limpio(doc));
        console.log(`[${amb.nombre}] OP ${clave} → ${doc.estado}: ${doc.mensaje}`);
        continue;
      }
      await colOP.doc(clave).set(limpio({ ...doc, estado: "creando" }));
      try {
        const c = await crearOP(r.cuerpo);
        doc.estado = c.estado;
        doc.opNumero = c.numero || null;
        doc.opId = c.id || null;
        doc.mensaje =
          (c.estado === "creada"
            ? "OP " + c.numero + " creada en Xubio."
            : c.porCheque
              ? "Ya había en Xubio una OP con estos mismos e-cheqs (hecha a mano): " + c.numero + ". No se creó otra."
              : "Ya había en Xubio una OP igual: " + c.numero + ".") +
          " Falta aplicarla a las facturas en Xubio.";
        doc.creada = Date.now();
        for (const ch of suyos) await db.collection(amb.prefijo + "echeqs").doc(ch.id).set({ asignadoA: clave }, { merge: true });
      } catch (e) {
        doc.estado = "error";
        doc.mensaje = "No se pudo crear la OP: " + texto((e && e.message) || e, 400);
      }
      await registrar(amb, { accion: "ordenPago", grupo: clave, estado: doc.estado, mensaje: doc.mensaje });
    }
    await colOP.doc(clave).set(limpio(doc));
    console.log(`[${amb.nombre}] OP ${clave} → ${doc.estado}: ${doc.mensaje || ""}`);
  }
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
      else if (p.accion === "resumenFacturas") r = await resumenFacturas(p);
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

// ---------- Lista de centros de costo de Xubio para MIA (cada ~30 minutos) ----------
async function actualizarCentros() {
  const refs = AMBIENTES.map((a) => db.doc(a.prefijo + "xubioConfig/centros"));
  const actual = await refs[0].get();
  // Sección 120: la lista de centros de Xubio que se ve en MIA se actualiza cada 30 minutos (antes cada 6 horas).
  if (actual.exists && Date.now() - (actual.get("actualizado") || 0) < 30 * 60 * 1000) return;
  const nombres = (await centrosDeCosto())
    .map((c) => c.nombre)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"));
  for (const r of refs) await r.set({ nombres, actualizado: Date.now() });
  console.log("Centros de costo de Xubio actualizados: " + nombres.length);
}

// Una pasada completa por ambiente (pedidos sueltos, líneas de Pagos y OP).
async function pasada(amb, conOP) {
  limpiarCaches();
  await procesarPedidos(amb);
  if (amb.automatico) await procesarLineas(amb);
  if (conOP && amb.automatico && amb.ops !== false)
    await procesarOPs(amb).catch((e) => console.error(`[${amb.nombre}] OP:`, (e && e.message) || e));
}
const dormir = (ms) => new Promise((ok) => setTimeout(ok, ms));
const ultimoCambio = async (amb) => {
  const d = await db.doc(amb.prefijo + "app/st_pagosSemanales").get();
  return d.exists && d.updateTime ? d.updateTime.toMillis() : 0;
};
const hayPedidos = async (amb) =>
  !(await db.collection(amb.prefijo + "xubioPedidos").where("estado", "==", "pendiente").limit(1).get()).empty ||
  // Sección 131: "Reintentar todas" / "Reintentar ahora" de Pagos (de a 40 por pasada, hasta terminar).
  !(await db.collection(amb.prefijo + "xubioEstado").where("forzar", "==", true).limit(1).get()).empty;

// Sección 122: GitHub no respeta el "cada 5 minutos" (corría cada 4-7 horas). Ahora cada corrida queda
// VIGILANDO unas 5 horas y 45 minutos: cada 60 segundos mira si cambiaron los Pagos de Producción (1 lectura)
// o si hay pedidos, y si cambió algo procesa enseguida. Cada 30 minutos hace una pasada completa en los dos
// ambientes (reintentos). Al terminar, el workflow se vuelve a lanzar solo.
async function vigilar(minutos) {
  const fin = Date.now() + minutos * 60 * 1000;
  const marca = {};
  let completa = 0,
    opQA = 0;
  while (Date.now() < fin) {
    const ahora = Date.now(),
      toca = ahora - completa >= 30 * 60 * 1000;
    try {
      toca && (await actualizarCentros().catch((e) => console.error("Centros:", (e && e.message) || e)));
      // Producción primero (QA es de prueba y su vista previa de OP puede tardar).
      for (const amb of [...AMBIENTES].sort((a, b) => (a.nombre === "prd" ? -1 : b.nombre === "prd" ? 1 : 0))) {
        if (toca) {
          marca[amb.nombre] = await ultimoCambio(amb);
          // La vista previa de OP de QA, solo cada 3 horas.
          await pasada(amb, amb.nombre === "prd" || ahora - opQA >= 3 * 3600 * 1000);
          amb.nombre !== "prd" && ahora - opQA >= 3 * 3600 * 1000 && (opQA = ahora);
          continue;
        }
        if (amb.nombre !== "prd") continue; // QA (pruebas) solo en las pasadas completas
        const m = await ultimoCambio(amb);
        if (m !== marca[amb.nombre] || (await hayPedidos(amb))) {
          marca[amb.nombre] = m;
          await pasada(amb, true);
        }
      }
      toca && (completa = ahora);
    } catch (e) {
      console.error("Pasada:", (e && e.message) || e);
    }
    await dormir(60 * 1000);
  }
}

(async () => {
  const minutos = Number(process.env.VIGILAR_MINUTOS || 0);
  if (minutos > 0) return vigilar(minutos);
  try {
    await actualizarCentros();
  } catch (e) {
    console.error("No se pudo actualizar la lista de centros:", (e && e.message) || e);
  }
  for (const amb of AMBIENTES) await pasada(amb, true);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
