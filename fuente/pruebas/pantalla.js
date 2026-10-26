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
  await control("Herramientas → Registros (con Fallas de guardado)", async () => {
    await pagina.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Herramientas")).click());
    await pagina.waitForTimeout(300);
    await clic("Registros");
    const ok = await pagina.evaluate(() => document.body.innerText.includes("cambios de los últimos 3 días"));
    if (!ok) throw new Error("No se abrió la ventana de Registros");
    await pagina.keyboard.press("Escape");
    await pagina.evaluate(() => {
      const x = [...document.querySelectorAll("button")].find((b) => b.closest("[role=dialog]") || (b.parentElement && b.parentElement.textContent.includes("cambios de los últimos 3 días") && b.querySelector("svg")));
      x && x.click();
    });
    await pagina.waitForTimeout(300);
  });
  await control("Pagos → Proveedores (MAT/MO/Fact. A) con búsqueda", async () => {
    await clic("Pagos");
    await pagina.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Proveedores (MAT/MO")).click());
    await pagina.waitForTimeout(400);
    const campo = pagina.locator('input[placeholder^="Buscar proveedor, razón social"]');
    if (!(await campo.count())) throw new Error("No está el campo de búsqueda");
    await campo.fill("zzzz-no-existe");
    await pagina.waitForTimeout(300);
    const txt = await pagina.evaluate(() => document.body.innerText);
    if (!/\b0 de \d+/.test(txt)) throw new Error("No muestra el conteo de la búsqueda");
    await campo.fill("");
    await pagina.evaluate(() => {
      const t = [...document.querySelectorAll("div")].find((d) => d.textContent.trim() === "Proveedores — Actividad y Factura");
      t && t.parentElement.querySelector("button").click();
    });
    await pagina.waitForTimeout(300);
  });
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
  await control("Verónica → planilla importada y Descargar Excel (20 columnas, fechas)", async () => {
    await pagina.evaluate(() => {
      VERO_ST.iniciado = true;
      VERO_ST.cargado = true;
      const v = Array(20).fill("");
      Object.assign(v, { 0: "05/10/2026", 1: "CLIENTE SA", 2: "10/09/2026", 3: "WC X999901234567", 4: "0001A00000001", 6: "Producto", 7: 100.5, 8: 121.6, 9: "Sucursal" });
      const v2 = Array(20).fill("");
      Object.assign(v2, { 1: "CLIENTE SA", 3: "WH X999901234568", 8: 50 });
      VERO_ST.planilla = { archivo: "prueba.xlsx", filas: [{ id: "f1", v, pdf: { 4: "a.pdf" } }, { id: "f2", v: v2, pdf: {} }] };
      VERO_ST.subs.forEach((f) => f());
    });
    await clic("Verónica");
    const todas = await pagina.evaluate(() => document.body.innerText.includes("WC X999901234567") && document.body.innerText.includes("WH X999901234568"));
    if (!todas) throw new Error("Al entrar no se ven todas las filas de la planilla");
    await clic("Completas (1)");
    const comp = await pagina.evaluate(() => document.body.innerText.includes("WC X999901234567") && !document.body.innerText.includes("WH X999901234568"));
    await clic("Por completar — falta PDF (1)");
    const pend = await pagina.evaluate(() => !document.body.innerText.includes("WC X999901234567") && document.body.innerText.includes("WH X999901234568"));
    if (!comp || !pend) throw new Error("Los filtros Completas / Por completar no separan bien las filas");
    await clic("Todas (2)");
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
  await control("Cashflow → Salidas Semanales: exportar, cambiar importes en el Excel e importar", async () => {
    await clic("Cashflow");
    await clic("Salidas Semanales");
    const espera = pagina.waitForEvent("download", { timeout: 15000 });
    await pagina.evaluate(() => [...document.querySelectorAll("button")].find((b) => /Exportar Excel/.test(b.textContent)).click());
    const original = fs.readFileSync(await (await espera).path()).toString("base64");
    const r = await pagina.evaluate((b64) => {
      const wb = XLSX.read(b64, { type: "base64" }),
        ws = wb.Sheets["Salidas Semanales"],
        filas = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }),
        i = filas.findIndex((f, k) => k > 0 && f[3]);
      if (i < 0) return { error: "el Excel exportado no tiene filas de proveedor", filas: filas.length };
      ws[XLSX.utils.encode_cell({ r: i, c: 5 })] = { t: "n", v: 12345 };
      ws[XLSX.utils.encode_cell({ r: i, c: 6 })] = { t: "n", v: 23456.5 };
      return { b64: XLSX.write(wb, { type: "base64", bookType: "xlsx" }), fila: filas[i].slice(0, 4), semanas: filas[0].slice(5, 7), filas: filas.length };
    }, original);
    if (r.error) throw new Error(r.error + " (" + r.filas + ")");
    const tmp = path.join(os.tmpdir(), "cashflow_prueba.xlsx");
    fs.writeFileSync(tmp, Buffer.from(r.b64, "base64"));
    await pagina.setInputFiles('input[type="file"][accept=".xlsx,.xls,.csv"]', tmp);
    await pagina.waitForFunction(() => /Importado:|No se pudo leer/.test(document.body.innerText), null, { timeout: 10000 });
    const msg = await pagina.evaluate(() => (document.body.innerText.match(/(Importado:[^\n]*|No se pudo leer[^\n]*)/) || [""])[0]);
    await pagina.waitForTimeout(3000);
    const seve = await pagina.evaluate(() => /\$12\.345\b/.test(document.body.innerText) && /\$23\.45[67]\b/.test(document.body.innerText));
    // Lo que MIA tiene guardado: se vuelve a exportar y se mira la misma celda.
    const espera2 = pagina.waitForEvent("download", { timeout: 15000 });
    await pagina.evaluate(() => [...document.querySelectorAll("button")].find((b) => /Exportar Excel/.test(b.textContent)).click());
    const despues = fs.readFileSync(await (await espera2).path()).toString("base64");
    const celdas = await pagina.evaluate(([b64, id]) => {
      const filas = XLSX.utils.sheet_to_json(XLSX.read(b64, { type: "base64" }).Sheets["Salidas Semanales"], { header: 1, defval: "" });
      const f = filas.find((x) => x[0] === id);
      return f ? f.slice(5, 7) : "fila no encontrada";
    }, [despues, r.fila[0]]);
    if (!seve)
      throw new Error("Después de importar no se ven los importes. Mensaje: " + msg + " / fila " + JSON.stringify(r.fila) + " semanas " + JSON.stringify(r.semanas) + " / al volver a exportar la fila trae: " + JSON.stringify(celdas));
  });
  await control("Recibos efectivo: PDF con un recibo por línea en efectivo (2 por hoja)", async () => {
    const espera = pagina.waitForEvent("download", { timeout: 15000 });
    const n = await pagina.evaluate(() =>
      descargarRecibosEfectivo([
        { id: "r1", sePaga: "SI", efectivo: 1543000, cliente: "NATURA", centroCosto: "SANTA FE", proveedor: "LUCIO GONZALEZ" },
        { id: "r2", sePaga: "SI", efectivo: 1250.5, cliente: "WU", centroCosto: "WU CIVIL WORK", subObra: "WU MORON", proveedor: "PROVEEDOR CON UN NOMBRE MUY LARGO PARA PROBAR QUE ENTRA" },
        { id: "r3", sePaga: "SI", efectivo: 20000, cliente: "INTERNO", centroCosto: "MKT", proveedor: "OTRO" },
        { id: "r4", sePaga: "SI", efectivo: 0, transferencia: 100, cliente: "NATURA", proveedor: "SIN EFECTIVO" },
      ]),
    );
    const pdf = fs.readFileSync(await (await espera).path()).toString("latin1");
    const paginas = (pdf.match(/\/Type \/Page\b/g) || []).length;
    if (n !== 3 || paginas !== 2) throw new Error("Esperaba 3 recibos en 2 hojas y salieron " + n + " en " + paginas);
    for (const t of ["MZ LATAM", "RECIBO", "0003-00000001", "NATURA SANTA FE", "LUCIO GONZALEZ", "QUINIENTOS CUARENTA Y TRES MIL PESOS", "Firma y aclar"])
      if (!pdf.includes(t)) throw new Error("El PDF no tiene: " + t);
  });
  await control("Ingreso con mail (QA): pantalla de ingreso, contraseña mala, ingreso, Usuarios y salir", async () => {
    await pagina.goto("file://" + archivo + "#mail");
    await pagina.reload(); // cambiar solo el # no recarga la página
    await pagina.waitForFunction(() => document.body.innerText.includes("¿Olvidaste tu contraseña?"), null, { timeout: 30000 }).catch(async () => { throw new Error("No apareció \"¿Olvidaste tu contraseña?\". En pantalla: " + (await pagina.evaluate(() => document.body.innerText.slice(0, 300)))); });
    if (await pagina.evaluate(() => document.body.innerText.includes("VENTA TOTAL"))) throw new Error("Muestra datos sin ingresar");
    await pagina.fill('input[type="email"]', "admin@prueba.com");
    await pagina.fill('input[type="password"]', "mala");
    await clic("Ingresar");
    await pagina.waitForFunction(() => document.body.innerText.includes("Mail o contraseña incorrectos"), null, { timeout: 5000 }).catch(async () => { throw new Error("No apareció \"Mail o contraseña incorrectos\". En pantalla: " + (await pagina.evaluate(() => document.body.innerText.slice(0, 300)))); });
    await pagina.fill('input[type="password"]', "clave123");
    await clic("Ingresar");
    await pagina.waitForFunction(() => document.body.innerText.includes("VENTA TOTAL"), null, { timeout: 30000 }).catch(async () => { throw new Error("No apareció \"VENTA TOTAL\". En pantalla: " + (await pagina.evaluate(() => document.body.innerText.slice(0, 300)))); });
    if (!(await pagina.evaluate(() => document.body.innerText.includes("Prueba · Admin ✓")))) throw new Error("No muestra el usuario y su rol arriba");
    await pagina.evaluate(() => [...document.querySelectorAll("button")].find((b) => /^Herramientas/.test(b.textContent.trim())).click());
    await pagina.waitForTimeout(300);
    await clic("Usuarios");
    await pagina.waitForFunction(() => document.body.innerText.includes("Agregar usuario"), null, { timeout: 5000 }).catch(async () => { throw new Error("No apareció \"Agregar usuario\". En pantalla: " + (await pagina.evaluate(() => document.body.innerText.slice(0, 300)))); });
    await clic("✕");
    await pagina.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Prueba · Admin ✓").click());
    await pagina.waitForFunction(() => document.body.innerText.includes("¿Olvidaste tu contraseña?"), null, { timeout: 5000 }).catch(async () => { throw new Error("No apareció \"¿Olvidaste tu contraseña?\". En pantalla: " + (await pagina.evaluate(() => document.body.innerText.slice(0, 300)))); });
  });
  await navegador.close();
  console.log(fallas ? "\n" + fallas + " control(es) de pantalla fallaron" : "\nTodas las pantallas abren sin errores");
  process.exit(fallas ? 1 : 0);
})().catch((e) => {
  process.env.GITHUB_ACTIONS && console.log("::error::" + String((e && e.stack) || e).slice(0, 900).replace(/\n/g, " "));
  console.error(e);
  process.exit(1);
});
