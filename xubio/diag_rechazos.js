// SOLO LECTURA: ¿Xubio acepta las credenciales ahora? (pide token 3 veces y lee la lista de centros; sin datos).
const { xubio, limpiarCaches } = require("./xubio");
const out = (t) => console.log("::notice::" + String(t).slice(0, 600));
(async () => {
  for (let i = 1; i <= 3; i++) {
    try {
      limpiarCaches();
      const l = await xubio("POST" === "x" ? "POST" : "GET", "/centroDeCostoBean");
      out("Intento " + i + ": OK (" + (Array.isArray(l) ? l.length : "?") + " centros)");
    } catch (e) {
      out("Intento " + i + ": ERROR " + String(e.message || e).replace(/\d{6,}/g, "#").slice(0, 300));
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
})();
