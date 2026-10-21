// SOLO LECTURA: verifica las reglas publicadas y que una sesión anónima (como la de cualquiera con el link)
// ya no pueda leer la base, y que la cuenta de servicio (Xubio, respaldo) siga leyendo.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const out = (t) => console.log("::notice::" + String(t).slice(0, 500));
(async () => {
  const fuente = require("fs").readFileSync("fuente/partes/00_base_e_iconos.js", "utf8");
  const apiKey = (fuente.match(/apiKey:\s*"([^"]+)"/) || [])[1];
  const tok = (await admin.app().options.credential.getAccessToken()).access_token;
  const pid = JSON.parse(require("fs").readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")).project_id;
  const rel = await (await fetch("https://firebaserules.googleapis.com/v1/projects/" + pid + "/releases/cloud.firestore", { headers: { Authorization: "Bearer " + tok } })).json();
  const rs = await (await fetch("https://firebaserules.googleapis.com/v1/" + rel.rulesetName, { headers: { Authorization: "Bearer " + tok } })).json();
  const txt = (rs.source.files[0] || {}).content || "";
  out("Reglas publicadas: " + rel.updateTime + " / tienen usuarios: " + txt.includes("habilitado(prefijo(coleccion))") + " / tienen la regla vieja abierta: " + /allow read, write: if request\.auth != null;/.test(txt));
  // Sesión anónima, como la que tendría cualquiera con el link:
  const anon = await (await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + apiKey, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ returnSecureToken: true }) })).json();
  if (!anon.idToken) return out("No se pudo crear sesión anónima: " + JSON.stringify(anon.error && anon.error.message));
  const base = "https://firestore.googleapis.com/v1/projects/" + pid + "/databases/(default)/documents/";
  for (const p of ["app/st_pagosSemanales", "usuarios", "qa_app/state", "roles"]) {
    const r = await fetch(base + p, { headers: { Authorization: "Bearer " + anon.idToken } });
    out("Anonimo lee " + p + ": " + r.status + (r.status === 403 ? " (bloqueado, bien)" : " (ATENCION: no bloqueado)"));
  }
  await fetch("https://identitytoolkit.googleapis.com/v1/accounts:delete?key=" + apiKey, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: anon.idToken }) });
  const d = await db.doc("app/st_pagosSemanales").get();
  out("Cuenta de servicio lee Pagos: " + d.exists + " / usuarios prd: " + (await db.collection("usuarios").get()).size);
  const l = await admin.auth().listUsers(1000);
  out("Cuentas con mail: " + l.users.filter((u) => u.email).length + " (confirmadas " + l.users.filter((u) => u.email && u.emailVerified).length + ")");
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
