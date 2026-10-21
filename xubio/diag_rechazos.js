// SOLO LECTURA: reglas de seguridad actuales de Firestore (texto de las reglas, sin datos).
const admin = require("firebase-admin");
admin.initializeApp();
const out = (t) => console.log("::notice::" + String(t).slice(0, 4000));
(async () => {
  const tok = (await admin.app().options.credential.getAccessToken()).access_token;
  const pid = JSON.parse(require("fs").readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")).project_id;
  const g = async (u) => { const r = await fetch("https://firebaserules.googleapis.com/v1/" + u, { headers: { Authorization: "Bearer " + tok } }); return { st: r.status, j: await r.json() }; };
  const rel = await g("projects/" + pid + "/releases/cloud.firestore");
  out("release status " + rel.st + " " + (rel.j.rulesetName || JSON.stringify(rel.j).slice(0, 300)));
  if (rel.j.rulesetName) {
    const rs = await g(rel.j.rulesetName);
    (rs.j.source && rs.j.source.files || []).forEach((f) => out("ARCHIVO " + f.name + ": " + f.content.replace(/\n/g, " ⏎ ")));
  }
  const auth = await fetch("https://identitytoolkit.googleapis.com/admin/v2/projects/" + pid + "/config", { headers: { Authorization: "Bearer " + tok } });
  const a = await auth.json();
  out("auth config status " + auth.status + " email habilitado: " + JSON.stringify(a.signIn && a.signIn.email) + " anonimo: " + JSON.stringify(a.signIn && a.signIn.anonymous) + " dominios: " + JSON.stringify(a.authorizedDomains));
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
