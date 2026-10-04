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
  assert.strictEqual(fc.neto, 100000);
  assert.strictEqual(fc.fecha, "02/10/2026");
  assert.strictEqual(fc.razonSocial, "FERNANDEZ JORGE Y CHUMBA");
});
prueba("Factura PDF: el Importe Bruto es el de los productos (sin IVA ni percepciones de IIBB)", () => {
  const conPercepcion = ["FACTURA", "A", "COD. 01", "Subtotal: $ 200.000,00", "Importe Neto Gravado: $ 200.000,00", "IVA 21%: $ 42.000,00",
    "Percepción IIBB: $ 6.000,00", "Importe Otros Tributos: $ 6.000,00", "Importe Total: $ 248.000,00"];
  const a = f.armarFactura(null, f.facturaDesdeTexto(conPercepcion));
  assert.strictEqual(a.total, 248000);
  assert.strictEqual(a.neto, 200000);
  const c = f.armarFactura(null, f.facturaDesdeTexto(["FACTURA", "C", "COD. 011", "Subtotal: $ 80.000,00", "Importe Otros Tributos: $ 0,00", "Importe Total: $ 80.000,00"]));
  assert.strictEqual(c.letra, "C");
  assert.strictEqual(c.neto, 80000);
  const soloQr = f.armarFactura({ cuit: "1", pv: 1, nro: 1, tipo: 1, total: 121000 }, {});
  assert.strictEqual(soloQr.neto, 0, "Factura A sin el detalle: el bruto queda para completar a mano");
});
// Diseños reales distintos (datos inventados, mismas posiciones): totales a la derecha, totales en
// tabla con el título arriba, números a la inglesa, y títulos que no se pueden leer (son imagen).
const it = (s, x, y, w = 40, h = 9) => ({ s, x, y, w, h });
prueba("Factura PDF: importes por posición en distintos diseños de factura", () => {
  // Totales a la derecha, pero en el texto los importes quedan corridos respecto de su título.
  const a = f.facturaDesdeTexto([it("Cuit: 20-12345678-6", 380, 760, 90), it("Nº A00014-00000013", 380, 790, 100), it("COMERCIAL PRUEBA S.R.L. /", 80, 720, 120),
    it("$ 1000.00", 480, 120, 50), it("Subtotal:", 390, 120, 40), it("Neto gravado:", 390, 105, 55), it("$ 1000.00", 480, 105, 50),
    it("IVA 21%:", 390, 60, 40), it("$ 210.00", 480, 60, 50), it("TOTAL:", 390, 40, 35), it("$ 1210.00", 480, 40, 50)]);
  assert.strictEqual(a.total, 1210);
  assert.strictEqual(a.neto, 1000);
  assert.strictEqual(a.razonSocial, "COMERCIAL PRUEBA S.R.L.");
  assert.strictEqual(f.armarFactura(null, a).factura, "00014-00000013");
  // Totales en tabla (título arriba, importe abajo) y números a la inglesa.
  const b = f.facturaDesdeTexto([it("Sub Total", 30, 100, 45), it("Impuestos", 110, 100, 45), it("Total", 480, 100, 25),
    it("18,000,000", 20, 88, 60), it("500500.00", 100, 88, 45), it("3,780,000.00", 360, 88, 60), it("22,280,500.00", 470, 88, 65)]);
  assert.strictEqual(b.neto, 18000000);
  assert.strictEqual(b.total, 22280500);
  // Mismo caso pero sin títulos legibles: el renglón donde un importe es la suma de los demás.
  const c = f.facturaDesdeTexto([it("18,000,000", 20, 88, 60), it("500500.00", 100, 88, 45), it("3,780,000.00", 360, 88, 60), it("22,280,500.00", 470, 88, 65),
    it("307083776150010000286405811971722202610121", 20, 20, 300)]);
  assert.strictEqual(c.neto, 18000000);
  assert.strictEqual(c.total, 22280500);
  assert.strictEqual(c.cuit, "30708377615", "CUIT del código de barras de AFIP");
  // "Subtotal Gravado" (y no el "Subtotal" de la columna de los renglones de arriba).
  const d = f.facturaDesdeTexto([it("Subtotal", 520, 600, 40), it("13,863.21", 520, 588, 45), it("Subtotal Gravado :", 400, 120, 75), it("$23,878.76", 515, 120, 50),
    it("Total :", 455, 60, 30), it("$28,893.30", 510, 60, 50)]);
  assert.strictEqual(d.neto, 23878.76);
  assert.strictEqual(d.total, 28893.3);
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
prueba("Factura PDF: proveedor con el nombre de MIA (por CUIT)", () => {
  const tabla = [{ proveedor: "San Andres", cuit: "20-12345678-6", razonSocial: "FERNANDEZ JORGE Y CHUMBA" }];
  assert.strictEqual(f.proveedorPorCuit("20123456786", tabla, {}, []), "SAN ANDRES");
  assert.strictEqual(f.proveedorPorCuit("27111111117", tabla, {}, [{ cuit: "27111111117", proveedorPago: "pepe" }]), "PEPE");
});
prueba("Factura PDF: nombre de archivo de ARCA + imputación y sub obra escritas en el nombre", () => {
  const nombre = "20238459045_001_00001_00000540 victor nunez wu moron.pdf";
  const a = f.facturaDesdeNombreArchivo(nombre);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), { cuit: "20238459045", tipo: 1, pv: 1, nro: 540 });
  const fc = f.armarFactura(null, { total: 1000 }, a);
  assert.strictEqual(fc.factura, "00001-00000540");
  assert.strictEqual(fc.letra, "A");
  const obras = [{ cliente: "WU", obra: "WU CIVIL WORK" }, { cliente: "OTRO", obra: "CENTRO" }];
  const subs = { "WU|WU CIVIL WORK": [{ id: "s1", nombre: "WU MORÓN" }, { id: "s2", nombre: "WU FLORES" }] };
  assert.deepStrictEqual(JSON.parse(JSON.stringify(f.centroDesdeNombreArchivo(nombre, obras, subs))), { cliente: "WU", centroCosto: "WU CIVIL WORK", subObra: "WU MORÓN" });
  assert.strictEqual(f.imputacionDesdeNombreArchivo(nombre, "ARIEL CASA", ["PINTURA"], ["VICTOR NUÑEZ", "ARIEL CASA"]), "VICTOR NUÑEZ");
  assert.strictEqual(f.imputacionDesdeNombreArchivo("San Andres - Palermo.pdf", "SAN ANDRES", [], ["SAN ANDRES"], { cliente: "ARCOS", centroCosto: "PALERMO", subObra: "" }), "");
  assert.strictEqual(f.proveedorPorRazonSocial("CASA ARIEL S.R.L.", [{ proveedor: "Ariel Casa" }]), "ARIEL CASA");
});
prueba("Factura PDF: interno + rubro, sub obra abreviada e imputación por una palabra", () => {
  const c = (n, o, sb) => JSON.parse(JSON.stringify(f.centroDesdeNombreArchivo(n, o || [], sb || {})));
  assert.deepStrictEqual(c("27271455165_011_00001_00000220 hernan caminos interno sueldos.pdf"), { cliente: "INTERNO", centroCosto: "SUELDOS", subObra: "" });
  assert.deepStrictEqual(c("fc interno marketing.pdf"), { cliente: "INTERNO", centroCosto: "MKT", subObra: "" });
  assert.deepStrictEqual(c("interno finanzas.pdf"), { cliente: "INTERNO", centroCosto: "FINANCIERO", subObra: "" });
  assert.deepStrictEqual(c("Daniel interno.pdf"), { cliente: "INTERNO", centroCosto: "DANIEL", subObra: "" });
  assert.strictEqual(f.fcRubroInterno("horarios"), "HONORARIOS");
  const obras = [{ cliente: "WU", obra: "WU CIVIL WORK" }, { cliente: "SABORES EXPRESS", obra: "LANUS" }];
  const subs = { "WU|WU CIVIL WORK": [{ id: "s1", nombre: "WU MORON" }, { id: "s2", nombre: "WU FLORES" }] };
  const moron = { cliente: "WU", centroCosto: "WU CIVIL WORK", subObra: "WU MORON" };
  assert.deepStrictEqual(c("casas w moron.pdf", obras, subs), moron);
  assert.deepStrictEqual(c("W Morón Pintura.pdf", obras, subs), moron);
  assert.strictEqual(f.imputacionDesdeNombreArchivo("casas w moron.pdf", "SAN ANDRES", ["ARIEL CASAS", "PINTURA"], [], moron), "ARIEL CASAS");
  assert.strictEqual(f.imputacionDesdeNombreArchivo("W Morón Pintura.pdf", "SAN ANDRES", ["ARIEL CASAS", "PINTURA"], [], moron), "PINTURA");
  assert.strictEqual(f.imputacionDesdeNombreArchivo("w moron.pdf", "ARIEL CASAS", ["ARIEL CASAS", "PINTURA"], [], moron), "");
});
prueba("Proveedores: la tabla aprende de Pagos (solo lo vacío) y el PDF corrige el tipo de factura", () => {
  const tabla = [{ proveedor: "SAN ANDRES", cuit: "", razonSocial: "YA CARGADA", cbu: "", actividad: "", factura: "", imputacion: "" }, { proveedor: "OTRO", cuit: "1" }];
  const lineas = [
    { proveedorPago: "SAN ANDRES", cuit: "20-12345678-6", razonSocial: "FERNANDEZ", cbu: "111", mo: true, facturaA: true, proveedor: "PINTURA", cliente: "WU" },
    { proveedorPago: "SAN ANDRES", cuit: "20-12345678-6", cbu: "222", mo: true, proveedor: "PINTURA", cliente: "WU" },
    { proveedorPago: "SAN ANDRES", proveedor: "", cliente: "INTERNO", centroCosto: "VARIOS" },
  ];
  const t = JSON.parse(JSON.stringify(f.aprenderProveedores(tabla, lineas)));
  assert.deepStrictEqual(t[0], { proveedor: "SAN ANDRES", cuit: "20-12345678-6", razonSocial: "YA CARGADA", cbu: "222", actividad: "MO", factura: "A", imputacion: "PINTURA" });
  assert.strictEqual(f.aprenderProveedores(t, lineas), null, "sin cambios la segunda vez");
  const c = JSON.parse(JSON.stringify(f.corregirTipoFacturaProveedores(t, { "SAN ANDRES": "C" })));
  assert.strictEqual(c[0].factura, "C");
  assert.strictEqual(f.aprenderProveedores(c, lineas), null, "no vuelve a poner A después de la corrección");
});
prueba("Factura PDF: casos del usuario (NO interno finanzas, sistemas, imputación nueva del nombre)", () => {
  const c = (n) => JSON.parse(JSON.stringify(f.centroDesdeNombreArchivo(n, [], {})));
  assert.deepStrictEqual(c("27271455165_011_00001_00000220 NO INTERNO FINANZAS.pdf"), { cliente: "INTERNO", centroCosto: "FINANCIERO", subObra: "" });
  assert.deepStrictEqual(c("interno 20203505109_001_00002_00005891_MZ_Latam interno sistemas.pdf"), { cliente: "INTERNO", centroCosto: "SISTEMAS", subObra: "" });
  const nc = { cliente: "NATURA", centroCosto: "NATURA CABILDO", subObra: "" };
  assert.strictEqual(f.imputacionDesdeNombreArchivo("Factura A-00003-0000002683 natura cabildo pablo morh.pdf", "SOLO HIERROS", [], [], nc, "Solo Hierros SA"), "PABLO MORH");
  const moron = { cliente: "WU", centroCosto: "WU CIVIL WORK", subObra: "WU MORON" };
  assert.strictEqual(f.imputacionDesdeNombreArchivo("Factura Electrónica A (PV 14) A00014-00000013 - MZ LATAM  wu moron eurolmap.pdf", "EUROLAMP", [], [], moron, "ILUMINACION EUROLAMP S.R.L."), "");
  assert.strictEqual(f.imputacionDesdeNombreArchivo("27374280371_011_00002_00000249 WU MORON AYELEN.pdf", "", [], [], moron, ""), "AYELEN");
});
prueba("Rubros internos: se pueden crear nuevos y se reconocen en el nombre del archivo", () => {
  const r = f.rubrosInternos([{ cliente: "INTERNO", centroCosto: "Seguros" }, { cliente: "WU", centroCosto: "X" }]);
  assert.ok(r.includes("SEGUROS") && r.includes("SISTEMAS") && !r.includes("X"));
  assert.deepStrictEqual(JSON.parse(JSON.stringify(f.centroDesdeNombreArchivo("fc interno seguros.pdf", [], {}, r))), { cliente: "INTERNO", centroCosto: "SEGUROS", subObra: "" });
});
prueba("Factura PDF: completa la línea tipeada a mano sin factura, sin pisar nada", () => {
  const fc = { cuit: "20123456786", factura: "00014-00000002", total: 121000, neto: 100000, letra: "A" };
  const lineas = [
    { id: "a", proveedorPago: "SAN ANDRES", factura: "", importe: 50000, fechaPagado: "" },
    { id: "b", proveedorPago: "SAN ANDRES", factura: "", importe: 121000, fechaPagado: "" },
    { id: "c", cuit: "20123456786", factura: "14-2", importe: 121000 },
  ];
  assert.strictEqual(f.lineaParaFactura(fc, lineas, "SAN ANDRES").linea.id, "c");
  assert.strictEqual(f.lineaParaFactura(fc, lineas.slice(0, 2), "SAN ANDRES").linea.id, "b");
  assert.strictEqual(f.lineaParaFactura(fc, lineas.slice(0, 1), "SAN ANDRES"), null);
  const r = f.completarLineaConFactura({ id: "a", factura: "", importe: 120000, importeBruto: 0, cuit: "", razonSocial: "", facturaA: false }, fc, "FERNANDEZ");
  assert.deepStrictEqual(JSON.parse(JSON.stringify(r.cambios)), { factura: "00014-00000002", cuit: "20123456786", razonSocial: "FERNANDEZ", importeBruto: 100000, facturaA: true });
  assert.strictEqual(r.avisos.length, 1);
});

prueba("Cuentas en los importes: =13.000/4, mitad y mitad, porcentajes", () => {
  assert.strictEqual(f.evaluarCuenta("=13.000/4"), 3250);
  assert.strictEqual(f.evaluarCuenta("=454.960/2"), 227480);
  assert.strictEqual(f.evaluarCuenta("=(1.500+2.300)*2"), 7600);
  assert.strictEqual(f.evaluarCuenta("=50%*80.000"), 40000);
  assert.strictEqual(f.evaluarCuenta("1000x3"), 3000);
  assert.strictEqual(f.evaluarCuenta("=10/3"), 3.33);
  assert.strictEqual(f.evaluarCuenta("=1.234,5+0,5"), 1235);
  assert.strictEqual(f.evaluarCuenta("=13000/"), null);
  assert.strictEqual(f.evaluarCuenta("=alert(1)"), null);
  assert.ok(f.esCuenta("=5") && f.esCuenta("13.000/4") && f.esCuenta("100-20") && !f.esCuenta("-1000") && !f.esCuenta("13.000"));
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
