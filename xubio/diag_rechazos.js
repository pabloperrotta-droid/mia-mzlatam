// SOLO LECTURA: OP de Producción con fecha de pago 21/10/2026 (estado y motivo; números enmascarados).
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500));
const m = (s) => String(s || "").replace(/\d{3,}/g, "#");
(async () => {
  const ops = (await db.collection("xubioOP").get()).docs.filter((d) => d.id.endsWith("_2026-10-21"));
  out("OP del 21/10: " + ops.length);
  for (const d of ops) {
    const x = d.data();
    out("estado " + x.estado + " / modo " + x.modo + " / proveedor " + (x.proveedorXubio || "-") + " / lineas " + (x.lineas || []).length + " / cheques " + (x.cheques || []).length + " / retenciones " + (x.retenciones || []).length + " / importes " + m(JSON.stringify(x.importes)) + " / aviso " + m(x.aviso));
    out("mensaje: " + m(x.mensaje));
  }
  const ch = (await db.collection("echeqs").get()).docs.map((d) => d.data());
  out("e-cheqs cargados " + ch.length + ", con fecha de emision 21/10: " + ch.filter((c) => c.fechaEmision === "2026-10-21").length + ", fechas de emision: " + [...new Set(ch.map((c) => c.fechaEmision))].slice(0, 10).join(","));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
