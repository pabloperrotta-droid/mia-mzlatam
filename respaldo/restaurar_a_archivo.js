/*
 * Baja un respaldo diario a un archivo JSON local (no modifica la base).
 * Uso (con las credenciales de la cuenta de servicio en GOOGLE_APPLICATION_CREDENTIALS):
 *   node respaldo/restaurar_a_archivo.js 2026-10-04 respaldo_2026-10-04.json
 */
const admin = require("firebase-admin");
const zlib = require("zlib");
const fs = require("fs");
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "mzlatam-app" });
(async () => {
  const [fecha, salida] = process.argv.slice(2);
  const ref = admin.firestore().collection("respaldosDiarios").doc(fecha);
  const meta = await ref.get();
  if (!meta.exists) throw new Error("No hay respaldo del " + fecha);
  let b64 = "";
  for (let i = 0; i < meta.get("partes"); i++) b64 += (await ref.collection("partes").doc(String(i)).get()).get("datos");
  fs.writeFileSync(salida || "respaldo_" + fecha + ".json", zlib.gunzipSync(Buffer.from(b64, "base64")));
  console.log("Listo: " + (salida || "respaldo_" + fecha + ".json"));
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
