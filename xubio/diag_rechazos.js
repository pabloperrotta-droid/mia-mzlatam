// Diagnóstico SOLO LECTURA: líneas sin procesar y motivos de rechazo (sin datos de negocio).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 1000));
const fISO = (s) => { const m = String(s || "").match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/); return m ? m[3] + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0") : String(s || "").slice(0, 10); };
(async () => {
  const est = {};
  (await db.collection("xubioEstado").get()).docs.forEach((d) => (est[d.id] = d.data()));
  const lineas = (await db.doc("app/st_pagosSemanales").get()).get("v") || [];
  const cfg = (await db.doc("xubioConfig/op").get()).data() || {};
  const validas = lineas.filter((l) => l && l.id && String(l.cuit || "").replace(/\D/g, "") && String(l.factura || "").trim() && (!l.fechaPagado || fISO(l.fechaPagado) >= cfg.desde));
  const sin = validas.filter((l) => !est[String(l.id)]);
  out("Sin procesar " + sin.length + ": " + sin.map((l) => "pagado " + (l.fechaPagado ? fISO(l.fechaPagado) : "no") + " sePaga " + l.sePaga + " cliente " + (String(l.cliente || "").toUpperCase() === "INTERNO" ? "interno" : "otro")).join(" ; "));
  const todasSin = lineas.filter((l) => l && l.id && String(l.cuit || "").replace(/\D/g, "") && String(l.factura || "").trim() && !est[String(l.id)]);
  out("Con CUIT y factura sin estado (incluye pagadas viejas): " + todasSin.length);
  const rech = Object.values(est).filter((e) => e.estado === "rechazada");
  const motivos = {};
  rech.forEach((e) => { const m = String(e.mensaje || "").replace(/[\d.,$]{3,}/g, "#").replace(/.*?(Xubio rechaz|motivo)/i, "$1").slice(0, 140); motivos[m] = (motivos[m] || 0) + 1; });
  out("Rechazadas " + rech.length + ", ultimo intento hace (min) min/max: " + Math.round((Date.now() - Math.max(...rech.map((e) => e.intento || 0))) / 60000) + "/" + Math.round((Date.now() - Math.min(...rech.map((e) => e.intento || 0))) / 60000));
  Object.entries(motivos).slice(0, 6).forEach(([m, n]) => out("x" + n + ": " + m));
  const vivas = new Set(validas.map((l) => String(l.id)));
  out("Rechazadas que siguen en lineas sin pagar/activas: " + rech.filter((e, i) => vivas.has(Object.keys(est).find((k) => est[k] === e))).length);
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
