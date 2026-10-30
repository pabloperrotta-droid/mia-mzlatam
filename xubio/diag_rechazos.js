// SOLO LECTURA: lista de productos/servicios de compra en Xubio y cómo viene el producto en un renglón (sin importes).
const admin = require("firebase-admin");
admin.initializeApp();
const { xubio, fechaXubio } = require("./xubio");
const out = (t) => console.log("::notice::" + String(t).replace(/\$[-\d.,]+/g, "$#").slice(0, 900));
const lista = (r) => (Array.isArray(r) ? r : r && typeof r === "object" ? Object.values(r).find(Array.isArray) || [] : []);
(async () => {
  for (const ruta of ["/ProductoCompraBean", "/productoCompraBean", "/productoBean", "/ProductoVentaBean"]) {
    try {
      const l = lista(await xubio("GET", ruta));
      out(ruta + ": " + l.length + " · campos: " + Object.keys(l[0] || {}).join(","));
      out(ruta + " nombres: " + l.slice(0, 40).map((p) => (p.nombre || p.descripcion || "?") + "#" + (p.productoid ?? p.ID ?? p.id ?? "")).join(" | "));
    } catch (e) { out(ruta + ": ERROR " + (e.status || "") + " " + String(e.message || "").slice(0, 150)); }
  }
  try {
    const hoy = new Date(), d = new Date(hoy - 20 * 864e5), f = fechaXubio;
    const l = lista(await xubio("GET", "/comprobanteCompraBean?fechaDesde=" + f(d) + "&fechaHasta=" + f(hoy)));
    const c = l[0] && (await xubio("GET", "/comprobanteCompraBean/" + l[0].transaccionid));
    const it = c && (Array.isArray(c.transaccionProductoItems) ? c.transaccionProductoItems : [])[0];
    out("Renglón: campos " + Object.keys(it || {}).join(","));
    out("Renglón.producto: " + JSON.stringify(it && it.producto) + " · centro: " + JSON.stringify(it && it.centroDeCosto && Object.keys(it.centroDeCosto)));
  } catch (e) { out("Factura: ERROR " + String(e.message || "").slice(0, 200)); }
})().catch((e) => { out("ERROR " + e.message); process.exit(1); });
