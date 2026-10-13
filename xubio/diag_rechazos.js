// Diagnóstico SOLO LECTURA (13/10/2026): motivo real ("description") de las líneas que Xubio rechazó.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500).replace(/\n/g, " "));
(async () => {
  const snap = await db.collection("xubioEstado").where("estado", "in", ["rechazada", "bloqueada", "error"]).get();
  out("Líneas rechazadas/bloqueadas/error en Producción: " + snap.size);
  const motivos = {};
  let ejemplo = null;
  snap.docs.forEach((d) => {
    const x = d.data();
    let desc = "";
    try {
      const j = JSON.parse(x.errorXubio || "{}");
      const buscar = (o, p) => { if (!o || typeof o !== "object" || p > 5) return; if (typeof o.description === "string") desc = desc || o.description; for (const k of Object.keys(o)) buscar(o[k], p + 1); };
      buscar(j, 0);
    } catch { desc = String(x.errorXubio || "").match(/"description"\s*:\s*"([^"]*)"/)?.[1] || ""; }
    const k = (x.estado || "") + " | " + (desc || (x.mensaje || "").slice(0, 120));
    motivos[k] = (motivos[k] || 0) + 1;
    if (!ejemplo && /74897/.test(x.factura || "")) ejemplo = { estado: x.estado, desc, tieneError: !!x.errorXubio, largo: String(x.errorXubio || "").length };
  });
  Object.entries(motivos).slice(0, 7).forEach(([k, n]) => out(n + " × " + k));
  out("Factura 74897: " + JSON.stringify(ejemplo));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
