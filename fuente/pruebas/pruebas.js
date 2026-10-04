// Pruebas automáticas de MIA: node fuente/pruebas/pruebas.js        → corre las pruebas
//                             node fuente/pruebas/pruebas.js --foto → vuelve a sacar la "foto" (solo si el cambio de resultado es a propósito)
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { cargar } = require("./cargar");
const casos = require("./casos");

const f = cargar();
const ARCHIVO_FOTO = path.join(__dirname, "foto_resultados.json");
let fallas = 0;
const prueba = (nombre, fn) => {
  try {
    fn();
    console.log("  ✓ " + nombre);
  } catch (e) {
    fallas++;
    console.log("  ✗ " + nombre + "\n      " + String(e.message).split("\n").join("\n      "));
  }
};
const cerca = (a, b, tol = 0.005) => assert.ok(Math.abs(a - b) <= tol, a + " ≠ " + b);

console.log("Cálculos verificados con casos reales:");
prueba("Retención EUROLAMP (OP X-0001-00002753) = $248.199,20", () => {
  const r = f.calcularRetencionGananciasProveedor(casos.calcularRetencionGananciasProveedor[0][0]);
  cerca(r.retGanChe, 248199.2);
  assert.strictEqual(r.retGanTransf, 0);
});
prueba("Markup de SHANGAI ITUZAINGO (MB 23,3%) = 30,3%", () => {
  const mb = ((198549994 - 152360474) / 198549994) * 100;
  cerca(f.markupDeMb(mb), 30.3, 0.05);
});
prueba("Negativos: '-1000' se muestra '-1.000' y se lee -1000", () => {
  assert.strictEqual(f.conSeparadorMiles("-1000"), "-1.000");
  assert.strictEqual(Number(f.limpiarNumero("-1.000")), -1000);
});
prueba("OC MZ01: la parte de la sub obra para esa OC", () => {
  assert.strictEqual(f.montoDeSubCostoParaOC({ venta: 580000, ordenCompra: "MZ01" }, "MZ01"), 580000);
  assert.ok(f.ordenCompraIncluye("2640000099, MZ01", "mz01"));
});
// El estado de la app siempre tiene las mismas claves de primer nivel (obras, pagosMap…): lo que cambia
// es su contenido, incluidas sub-claves que se agregan o se borran.
prueba("Guardado: aplicar los cambios calculados reconstruye exactamente lo local", () => {
  const ejemplos = [
    [{ a: 1, b: { x: 1, y: [1, 2] }, c: "z" }, { a: 2, b: { x: 1, w: 3 }, c: "z" }],
    [{ obras: [{ n: 1 }], pagosMap: { "A|B": [1] } }, { obras: [], pagosMap: { "A|B": [1], "C|D": [2] } }],
    [{ a: {} }, { a: { k: 1 } }],
  ];
  for (const [local, base] of ejemplos) {
    const r = f.aplicarCambios(base, f.cambiosParaGuardar(local, base));
    assert.deepStrictEqual(JSON.parse(JSON.stringify(r)), local);
  }
});
prueba("Guardado: combinar no pisa lo que cambió otro usuario", () => {
  const r = f.combinarEstado({ a: 2, b: { x: 1, y: 5 } }, { a: 1, b: { x: 1, y: 2 } }, { a: 1, b: { x: 7, y: 2 }, c: 3 });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(r)), { a: 2, b: { x: 7, y: 5 }, c: 3 });
});
prueba("Datos repartidos: las 8 claves pesadas van a documentos propios", () => {
  assert.strictEqual(f.ESTADO_EXTERNO.length, 8);
  assert.ok(f.ESTADO_EXTERNO.includes("pagosSemanales") && f.ESTADO_EXTERNO.includes("cfSalidasValores"));
});

// Sección 97: facturas en PDF (textos tal cual los da pdf.js de una factura con el formato de ARCA).
const TEXTO_FC_A = ["A", "COD. 01", "FACTURA", "Razón Social: FERNANDEZ JORGE Y CHUMBA", "Domicilio Comercial: Av. Siempre Viva 123 - CABA",
  "Punto de Venta: 00014", "Comp. Nro: 00000002", "Fecha de Emisión: 02/10/2026", "CUIT: 20123456786", "Ingresos Brutos: 901-123456-7",
  "CUIT: 30718082311", "Apellido y Nombre / Razón Social: MZ LATAM SRL", "100.000,00", "Importe Neto Gravado: $ 100.000,00",
  "Importe Total: $ 121.000,00", "CAE N°: 70417054367476"];
prueba("Factura PDF: del texto sale CUIT del emisor (no el nuestro), número, tipo A y total", () => {
  const fc = f.armarFactura(null, f.facturaDesdeTexto(TEXTO_FC_A));
  assert.strictEqual(fc.cuit, "20123456786");
  assert.strictEqual(fc.factura, "00014-00000002");
  assert.strictEqual(fc.letra, "A");
  assert.strictEqual(fc.total, 121000);
  assert.strictEqual(fc.fecha, "02/10/2026");
  assert.strictEqual(fc.razonSocial, "FERNANDEZ JORGE Y CHUMBA");
});
prueba("Factura PDF: el QR de ARCA manda (nota de crédito C)", () => {
  const d = { ver: 1, fecha: "2026-10-02", cuit: 27111111117, ptoVta: 2, tipoCmp: 13, nroCmp: 15, importe: 3000, moneda: "PES", ctz: 1 };
  const qr = f.facturaDesdeQr("https://www.afip.gob.ar/fe/qr/?p=" + Buffer.from(JSON.stringify(d)).toString("base64"));
  const fc = f.armarFactura(qr, { total: 999, cuit: "20123456786" });
  assert.strictEqual(fc.cuit, "27111111117");
  assert.strictEqual(fc.factura, "00002-00000015");
  assert.strictEqual(fc.letra, "C");
  assert.ok(fc.notaCredito);
  assert.strictEqual(fc.total, 3000);
  assert.strictEqual(fc.fecha, "02/10/2026");
});
prueba("Factura PDF: importes y CUIT", () => {
  assert.strictEqual(f.fcLeerImporte("1.234.567,89"), 1234567.89);
  assert.strictEqual(f.fcLeerImporte("1234567.89"), 1234567.89);
  assert.strictEqual(f.fcLeerImporte("121.000"), 121000);
  assert.ok(f.cuitValido("30-71808231-1") && !f.cuitValido("30718082312"));
});
const OBRAS_FC = [{ cliente: "WU", obra: "WU CIVIL WORK" }, { cliente: "ARCOS", obra: "PALERMO" }, { cliente: "OTRO", obra: "PALERMO" }, { cliente: "ARCOS", obra: "BELGRANO" }];
const SUBS_FC = { "WU|WU CIVIL WORK": [{ id: "s1", nombre: "SUCURSAL FLORES" }] };
prueba("Factura PDF: centro de costo / sub obra desde el nombre del archivo", () => {
  const c = (n) => JSON.parse(JSON.stringify(f.centroDesdeNombreArchivo(n, OBRAS_FC, SUBS_FC)));
  assert.deepStrictEqual(c("San Andres - Belgrano.pdf"), { cliente: "ARCOS", centroCosto: "BELGRANO", subObra: "" });
  assert.deepStrictEqual(c("fc 123_sucursal flores.pdf"), { cliente: "WU", centroCosto: "WU CIVIL WORK", subObra: "SUCURSAL FLORES" });
  assert.deepStrictEqual(c("San Andres Palermo.pdf"), { cliente: "", centroCosto: "", subObra: "", ambiguo: true });
  assert.deepStrictEqual(c("Arcos Palermo.pdf"), { cliente: "ARCOS", centroCosto: "PALERMO", subObra: "" });
  assert.deepStrictEqual(c("factura.pdf"), { cliente: "", centroCosto: "", subObra: "", ambiguo: false });
});
prueba("Factura PDF: proveedor con el nombre de MIA (por CUIT) e imputación según lo ya cargado", () => {
  const tabla = [{ proveedor: "San Andres", cuit: "20-12345678-6", razonSocial: "FERNANDEZ JORGE Y CHUMBA" }];
  assert.strictEqual(f.proveedorPorCuit("20123456786", tabla, {}, []), "SAN ANDRES");
  assert.strictEqual(f.proveedorPorCuit("27111111117", tabla, {}, [{ cuit: "27111111117", proveedorPago: "pepe" }]), "PEPE");
  const lineas = [
    { proveedorPago: "SAN ANDRES", proveedor: "PINTURA", cliente: "ARCOS", centroCosto: "PALERMO", subObra: "" },
    { proveedorPago: "SAN ANDRES", proveedor: "YESERIA", cliente: "ARCOS", centroCosto: "BELGRANO", subObra: "" },
    { proveedorPago: "SAN ANDRES", proveedor: "PINTURA", cliente: "X", centroCosto: "Y", subObra: "" },
  ];
  assert.strictEqual(f.imputacionSugerida("SAN ANDRES", { cliente: "ARCOS", centroCosto: "BELGRANO", subObra: "" }, lineas, ["YESERIA", "PINTURA"]), "YESERIA");
  assert.strictEqual(f.imputacionSugerida("SAN ANDRES", { cliente: "N", centroCosto: "NUEVA", subObra: "" }, lineas, ["PINTURA", "YESERIA", "OTRO"]), "PINTURA");
  assert.strictEqual(f.imputacionSugerida("SAN ANDRES", { cliente: "N", centroCosto: "NUEVA", subObra: "" }, lineas, ["ELECTRICIDAD"]), "");
});
prueba("Factura PDF: completa la línea tipeada a mano sin factura, sin pisar nada", () => {
  const fc = { cuit: "20123456786", factura: "00014-00000002", total: 121000, letra: "A" };
  const lineas = [
    { id: "a", proveedorPago: "SAN ANDRES", factura: "", importe: 50000, fechaPagado: "" },
    { id: "b", proveedorPago: "SAN ANDRES", factura: "", importe: 121000, fechaPagado: "" },
    { id: "c", cuit: "20123456786", factura: "14-2", importe: 121000 },
  ];
  assert.strictEqual(f.lineaParaFactura(fc, lineas, "SAN ANDRES").linea.id, "c");
  assert.strictEqual(f.lineaParaFactura(fc, lineas.slice(0, 2), "SAN ANDRES").linea.id, "b");
  assert.strictEqual(f.lineaParaFactura(fc, lineas.slice(0, 1), "SAN ANDRES"), null);
  const r = f.completarLineaConFactura({ id: "a", factura: "", importe: 120000, importeBruto: 0, cuit: "", razonSocial: "", facturaA: false }, fc, "FERNANDEZ");
  assert.deepStrictEqual(JSON.parse(JSON.stringify(r.cambios)), { factura: "00014-00000002", cuit: "20123456786", razonSocial: "FERNANDEZ", importeBruto: 121000, facturaA: true });
  assert.strictEqual(r.avisos.length, 1);
});

console.log("Foto del comportamiento actual (" + Object.keys(casos).length + " funciones):");
const actual = {};
for (const [nombre, lista] of Object.entries(casos)) {
  assert.strictEqual(typeof f[nombre], "function", "No existe la función " + nombre);
  actual[nombre] = lista.map((args) => {
    try {
      return JSON.parse(JSON.stringify(f[nombre](...JSON.parse(JSON.stringify(args))) ?? null));
    } catch (e) {
      return { __error__: String(e.message) };
    }
  });
}
if (process.argv.includes("--foto")) {
  fs.writeFileSync(ARCHIVO_FOTO, JSON.stringify(actual, null, 1));
  console.log("  Foto guardada en " + ARCHIVO_FOTO);
} else {
  const foto = JSON.parse(fs.readFileSync(ARCHIVO_FOTO, "utf8"));
  for (const nombre of Object.keys(casos))
    prueba(nombre, () => assert.deepStrictEqual(actual[nombre], foto[nombre], "El resultado cambió respecto de la foto"));
}
console.log(fallas ? "\n" + fallas + " prueba(s) fallaron" : "\nTodas las pruebas pasaron");
process.exit(fallas ? 1 : 0);
