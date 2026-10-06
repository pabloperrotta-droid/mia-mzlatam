// Prueba de pantalla: abre la app en un navegador real (Chromium) con la base simulada y recorre
// todas las pestañas, verificando que se dibujen sin errores. Necesita internet (librerías de la página).
// Uso: node fuente/pruebas/pantalla.js   (en GitHub Actions corre solo, ver .github/workflows/controles.yml)
const fs = require("fs");
const os = require("os");
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const raiz = path.join(__dirname, "..");
const head = fs
  .readFileSync(path.join(raiz, "head.html"), "utf8")
  .replace(/<script src="[^"]*firebase[^"]*"><\/script>\n?/g, "");
const tail = fs.readFileSync(path.join(raiz, "tail.html"), "utf8");
const app = fs
  .readdirSync(path.join(raiz, "partes"))
  .filter((f) => f.endsWith(".js"))
  .sort()
  .map((f) => fs.readFileSync(path.join(raiz, "partes", f), "utf8"))
  .join("");
const simulada = fs.readFileSync(path.join(__dirname, "base_simulada.js"), "utf8");
const i = head.lastIndexOf("<script>window.__APP_ENV__");
const html = head.slice(0, i) + "<script>" + simulada + "</script>\n" + head.slice(i) + app + "\n" + tail;
const archivo = path.join(os.tmpdir(), "mia_prueba_pantalla.html");
fs.writeFileSync(archivo, html);

const PESTANAS = ["Obras", "Facturación", "Proveedores", "Cashflow", "Pagos", "EERR", "Operaciones", "Verónica"];
const SUB_CASHFLOW = ["Ingresos", "Egresos", "Salidas Semanales"];

(async () => {
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ viewport: { width: 1600, height: 1000 } });
  const errores = [];
  pagina.on("pageerror", (e) => errores.push("Error de la página: " + e.message));
  pagina.on("console", (m) => m.type() === "error" && !/favicon|ERR_|net::/.test(m.text()) && errores.push("Consola: " + m.text()));
  await pagina.goto("file://" + archivo);
  await pagina.waitForFunction(() => document.body.innerText.includes("VENTA TOTAL"), null, { timeout: 30000 });
  let fallas = 0;
  const control = async (nombre, fn) => {
    const antes = errores.length;
    try {
      await fn();
      const nuevos = errores.slice(antes);
      if (nuevos.length) throw new Error(nuevos.join(" | "));
      console.log("  ✓ " + nombre);
    } catch (e) {
      fallas++;
      console.log("  ✗ " + nombre + ": " + String(e.message).slice(0, 500));
      // En GitHub Actions, la falla también queda como anotación (se ve sin abrir el registro completo).
      process.env.GITHUB_ACTIONS && console.log("::error::" + nombre + ": " + String(e.message).slice(0, 900).replace(/\n/g, " "));
    }
  };
  const clic = async (texto) => {
    // Clic directo en el elemento (el aviso diario del tipo de cambio queda encima y taparía el clic real).
    const ok = await pagina.evaluate((t) => {
      const el = [...document.querySelectorAll("button,a,div,span")].find((e) => e.children.length < 3 && e.textContent.trim() === t);
      return el ? (el.click(), true) : false;
    }, texto);
    if (!ok) throw new Error("No se encontró el botón " + texto);
    await pagina.waitForTimeout(600);
    const vacio = await pagina.evaluate(() => document.getElementById("root").innerText.trim().length < 50);
    if (vacio) throw new Error("La pantalla quedó en blanco");
  };
  console.log("Pantallas:");
  await control("La app abre y muestra la Venta Total", async () => {});
  for (const p of PESTANAS) {
    await control("Pestaña " + p, () => clic(p));
    if (p === "Cashflow") for (const s of SUB_CASHFLOW) await control("Cashflow → " + s, () => clic(s));
  }
  // Sección 97: cargar una factura PDF ficticia cuyos datos están solo en el QR (prueba el lector de QR).
  await control("Pagos → Facturas PDF (lee el QR de ARCA)", async () => {
    await clic("Pagos");
    const entrada = await pagina.$("input[type=file][multiple]");
    if (!entrada) throw new Error("No está el botón Facturas PDF");
    await entrada.setInputFiles(path.join(__dirname, "factura_prueba_qr.pdf"));
    await pagina.waitForFunction(() => document.body.innerText.includes("Revisar facturas antes de cargarlas"), null, { timeout: 60000 });
    const valores = await pagina.evaluate(() => [...document.querySelectorAll("input")].map((i) => i.value).join(" | "));
    if (!valores.includes("00007-00000123")) throw new Error("No leyó el número de factura del QR: " + valores.slice(0, 300));
    await pagina.evaluate(() => [...document.querySelectorAll("button")].find((b) => /^Cargar 1 factura$/.test(b.textContent.trim())).click());
    await pagina.waitForFunction(() => document.body.innerText.includes("Facturas PDF cargadas"), null, { timeout: 30000 });
  });
  // Sección 99: el Excel de Verónica sale con las 20 columnas de su planilla, fechas como fecha.
  await control("Verónica → Descargar Excel (20 columnas, fechas)", async () => {
    await pagina.evaluate(() => {
      VERO_ST.iniciado = true;
      VERO_ST.cargado = true;
      VERO_ST.filas = {
        p1: { id: "p1", snc: "WC X999901234567", fecha: "10/09/2026", recepcion: "05/10/2026", cliente: "CENCOSUD SA", comprobante: "0001A00000001", descripcion: "Producto", sucursal: "Sucursal", subtotal: 100.5, total: 121.6, cargado: 1 },
      };
      VERO_ST.subs.forEach((f) => f());
    });
    await clic("Verónica");
    const espera = pagina.waitForEvent("download", { timeout: 15000 });
    await pagina.evaluate(() => [...document.querySelectorAll("button")].find((b) => /Descargar Excel/.test(b.textContent)).click());
    const archivo = await (await espera).path();
    const r = await pagina.evaluate((b64) => {
      const wb = XLSX.read(b64, { type: "base64" }),
        ws = wb.Sheets[wb.SheetNames[0]],
        filas = XLSX.utils.sheet_to_json(ws, { header: 1 });
      return { columnas: filas[0].length, snc: filas[1][3], fecha: ws.C2 && ws.C2.w, subtotal: filas[1][7] };
    }, fs.readFileSync(archivo).toString("base64"));
    if (r.columnas !== 20 || r.snc !== "WC X999901234567" || r.subtotal !== 100.5 || !/10\/0?9\/(20)?26/.test(r.fecha || ""))
      throw new Error("Excel distinto de lo esperado: " + JSON.stringify(r));
  });
  await navegador.close();
  console.log(fallas ? "\n" + fallas + " control(es) de pantalla fallaron" : "\nTodas las pantallas abren sin errores");
  process.exit(fallas ? 1 : 0);
})().catch((e) => {
  process.env.GITHUB_ACTIONS && console.log("::error::" + String((e && e.stack) || e).slice(0, 900).replace(/\n/g, " "));
  console.error(e);
  process.exit(1);
});
