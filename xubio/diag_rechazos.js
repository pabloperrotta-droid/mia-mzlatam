// Diagnóstico (13/10/2026): la factura A-00014-00074897 (línea de Pagos con centro WU SAN MARTIN) fue rechazada.
// Se repite exactamente la operación que hace la integración (está autorizada para esta línea) y se muestra el
// motivo real de Xubio (campo "description", al final de la respuesta). Solo se muestran nombres de campos y el motivo.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const { xubio, comoLista, idDe, centrosDeCosto } = require("./xubio.js");
const out = (t) => console.log("::notice::" + String(t).slice(0, 1500).replace(/\n/g, " "));
(async () => {
  const snap = await db.collection("xubioEstado").where("estado", "==", "rechazada").get();
  const d = snap.docs.find((x) => /74897/.test(x.get("factura") || ""));
  if (!d) return out("No encontré la línea 74897 rechazada");
  const id = d.get("transaccionid");
  out("transaccionid: " + (id ? "sí" : "no") + " | campos estado: " + Object.keys(d.data()).join(","));
  const f = await xubio("GET", "/comprobanteCompraBean/" + id);
  out("Percepciones: " + comoLista(f.transaccionPercepcionItems).length + " | campos percepción: " + Object.keys(comoLista(f.transaccionPercepcionItems)[0] || {}).join(","));
  out("Percepción (valores no numéricos): " + JSON.stringify(comoLista(f.transaccionPercepcionItems)[0] || {}).replace(/\d{4,}/g, "#").slice(0, 600));
  const centros = await centrosDeCosto();
  const cc = centros.find((c) => String(c.nombre).trim().toUpperCase() === "WU SAN MARTIN");
  out("Centro WU SAN MARTIN en Xubio: " + (cc ? "sí" : "no"));
  const items = comoLista(f.transaccionProductoItems);
  const cuerpo = { ...f, transaccionProductoItems: items.map((it) => ({ ...it, centroDeCosto: { ID: cc.id } })) };
  const id2 = String(process.env.XUBIO_CLIENT_ID || "").trim(), sec = String(process.env.XUBIO_SECRET_ID || "").trim();
  const tk = await fetch("https://xubio.com/API/1.1/TokenEndpoint", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(id2 + ":" + sec).toString("base64"), "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: "grant_type=client_credentials" });
  const token = JSON.parse(await tk.text()).access_token;
  const r = await fetch("https://xubio.com/API/1.1/comprobanteCompraBean/" + id, { method: "PUT", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(cuerpo) });
  const txt = await r.text();
  out("PUT status " + r.status + " | largo " + txt.length);
  const m = txt.match(/"description"\s*:\s*"([^"]*)"/);
  out("MOTIVO (description): " + (m ? m[1] : "(no vino)") + " | codeResponse: " + ((txt.match(/"codeResponse"\s*:\s*"?([^",}]*)/) || [])[1] || "-"));
  if (r.ok) {
    const g = await xubio("GET", "/comprobanteCompraBean/" + id);
    out("Después: total " + g.importetotal + " | centros " + comoLista(g.transaccionProductoItems).map((it) => it.centroDeCosto && it.centroDeCosto.nombre).join(","));
  }
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
