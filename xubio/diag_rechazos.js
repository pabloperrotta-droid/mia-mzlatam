// Diagnóstico SOLO LECTURA del estado general de Xubio en Producción (sin datos de negocio).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 900));
const hace = (t) => (t ? Math.round((Date.now() - t) / 60000) + " min" : "-");
(async () => {
  const est = (await db.collection("xubioEstado").get()).docs.map((d) => ({ id: d.id, ...d.data() }));
  const c = {};
  est.forEach((e) => (c[e.estado] = (c[e.estado] || 0) + 1));
  out("Centro de costo por estado: " + Object.entries(c).map(([k, v]) => k.replace(/_/g, " ") + " = " + v).join(" / "));
  out("Ultima linea procesada hace " + hace(Math.max(...est.map((e) => e.intento || 0))) + "; procesadas en la ultima hora: " + est.filter((e) => Date.now() - (e.intento || 0) < 3600000).length);
  const lineas = (await db.doc("app/st_pagosSemanales").get()).get("v") || [];
  const cfg = (await db.doc("xubioConfig/op").get()).data() || {};
  const validas = lineas.filter((l) => l && l.id && String(l.cuit || "").replace(/\D/g, "") && String(l.factura || "").trim() && (!l.fechaPagado || String(l.fechaPagado) >= cfg.desde));
  const sinEstado = validas.filter((l) => !est.find((e) => e.id === String(l.id)));
  out("Lineas que se mandan a Xubio: " + validas.length + "; sin procesar todavia: " + sinEstado.length);
  const ops = (await db.collection("xubioOP").get()).docs.map((d) => d.data());
  out("OP: desde " + cfg.desde + " / " + ops.map((o) => o.estado + (o.opNumero ? " con numero" : "") + " (" + hace(o.actualizado) + ") " + String(o.mensaje || "").replace(/[\d.,$]{3,}/g, "#").slice(0, 120)).join(" | "));
  const pagHoy = lineas.filter((l) => l && l.fechaPagado && String(l.fechaPagado).replace(/\//g, "-").includes("2026-10-20") || String(l && l.fechaPagado).includes("20-10-2026") || String(l && l.fechaPagado).includes("20/10/2026"));
  out("Lineas con Fecha Pagado de hoy: " + pagHoy.length + " (con E-Cheq " + pagHoy.filter((l) => Number(l.echeq) > 0).length + ", con transferencia " + pagHoy.filter((l) => Number(l.transferencia) > 0).length + ")");
  const cen = await db.doc("xubioConfig/centros").get();
  out("Centros de Xubio: " + ((cen.get("nombres") || []).length) + " actualizados hace " + hace(cen.get("actualizado")));
  out("e-cheqs cargados: " + (await db.collection("echeqs").get()).size);
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
