// SOLO LECTURA: huellas (hash) de las filas con importe en Salidas Semanales, para compararlas con el Excel
// sin mostrar nombres ni importes.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const crypto = require("crypto");
const h = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 6);
const out = (t) => console.log("::notice::" + String(t).slice(0, 3000));
(async () => {
  const v = (await db.doc("app/st_cfSalidasValores").get()).get("v") || {};
  const ids = {};
  Object.keys(v).forEach((k) => { if (v[k] === "" || !Number(v[k])) return; const i = k.lastIndexOf("|"); const id = k.slice(0, i); ids[id] = (ids[id] || 0) + 1; });
  out("filas con importe " + Object.keys(ids).length + ": " + Object.entries(ids).map(([id, n]) => h(id) + ":" + n).join(" "));
  const ejemplo = Object.keys(v).find((k) => v[k] !== "" && Number(v[k]));
  out("forma de una clave: " + (ejemplo || "").replace(/[A-Za-zÁÉÍÓÚÑáéíóúñ0-9 .()]+/g, (m) => (/^\d{2}\/\d{2}\/\d{4}$/.test(m) ? m : "x")) + " / tipo valor " + typeof v[ejemplo]);
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
