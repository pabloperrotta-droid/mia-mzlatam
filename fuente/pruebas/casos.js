// Casos de prueba: mismos datos de entrada → mismo resultado que hoy ("foto" del comportamiento actual).
// Si un cambio de código altera alguno de estos resultados, la prueba falla y avisa cuál.
const lineaPago = (o) => ({ facturaA: true, mat: false, mo: false, importeBruto: 0, echeq: 0, transferencia: 0, ...o });
module.exports = {
  limpiarNumero: [["-1.000,50"], ["1.234.567"], ["abc12,3456"], ["-"], [""], ["1000-"]],
  conSeparadorMiles: [["-1000"], ["1234567.891"], ["0.5"], ["-"], [""], ["12."]],
  fmt: [[1234567.89], [-500], [0], [null]],
  pct: [[23.3], [null], [-2.94]],
  markupDeMb: [[23.26], [100], [-2.9], [0]],
  pctMk: [[23.3], [100]],
  parseFechaMesAnio: [["Febrero 2026"], ["13/02/2026"], ["x"]],
  consolidarProveedores: [[[{ proveedor: "A", presupuesto: 10, presupuestoOriginal: 10 }, { proveedor: "a ", presupuesto: 5, presupuestoOriginal: 4 }, { proveedor: "B", presupuesto: 1 }]]],
  normalizarFecha: [["1/2/26"], ["2026-02-01"], ["01-02-2026"], ["31/02/2026"], [""], ["hola"]],
  normalizeNombreSubobra: [["WU  Palermo-2 "], ["Martín Coronado"]],
  nombresSubobraCoinciden: [["WU PALERMO 2", "palermo 2"], ["WU MORON", "WU MERLO"]],
  ordenCompraIncluye: [["2640000099, MZ01", "mz01"], ["2640000099", "264"], ["", "MZ01"]],
  montosPorOCDe: [[{ venta: 100 }], [{ montosPorOC: { A: 1 } }], [{}]],
  conMontoDeOC: [[{ venta: 100, ordenCompra: "A" }, "B", 50], [{ montosPorOC: { A: 10 }, ordenCompra: "A" }, "A", 20]],
  sinMontoDeOC: [[{ montosPorOC: { A: 10, B: 5 }, venta: 15, ordenCompra: "A, B" }, "b"], [{ venta: 7, ordenCompra: "X" }, "X"]],
  normOC: [[" mz 01 "], [2640000099]],
  adicionalesPorOC: [[[{ nombre: "S1", adicionales: [{ concepto: "2640000500", monto: 100, tc: 1500 }, { concepto: "varios", monto: 5 }] }, { nombre: "S2", adicionales: [{ concepto: "MZ01", monto: 30 }] }], ["MZ01"]]],
  montoDeSubCostoParaOC: [[{ venta: 9 }, "X"], [{ montosPorOC: { MZ01: 580000, A: 3 } }, "mz01"]],
  fechaPedidoWuADdMmAaaa: [["16-SEP-2026"], ["2026-09-16"], [""]],
  fechaConGuiones: [["25/09/2026"], [""]],
  fechaEsValida: [["25/09/2026"], ["—"], ["31/13/2026"]],
  anioDeFecha: [["25/09/2026"], ["x"]],
  mesIdxDeFecha: [["25/09/2026"], ["x"]],
  capitalizar: [["hola mundo"]],
  clavesEjercicioFiscal: [[2026]],
  etiquetaEjercicioFiscal: [[2025]],
  cambiosParaGuardar: [
    [{ a: 1, b: { x: 1, y: 2 }, c: [1, 2] }, { a: 1, b: { x: 1, y: 3, z: 9 }, c: [1] }],
    [{ a: { "": 1 } }, { a: { k: 2 } }],
    [{ a: 1 }, null],
  ],
  aplicarCambios: [[{ a: 1, b: { x: 1, z: 9 } }, [[["b", "y"], 2], [["b", "z"], "__MIA_BORRAR_CAMPO__"], [["c"], [1, 2]]]]],
  combinarEstado: [[{ a: 2, b: { x: 1, y: 5 } }, { a: 1, b: { x: 1, y: 2 } }, { a: 1, b: { x: 7, y: 2 }, c: 3 }]],
  normalizarTexto: [["  Martín  Coronado "], [null]],
  distanciaLevenshtein: [["PALERMO", "PALERMO 2"], ["", "ABC"]],
  resolverConCoincidencia: [["palermo 2", ["WU PALERMO 2", "WU PALERMO"], {}], ["moron", ["WU MORON", "WU MERLO"], { MORON: "WU MORON" }]],
  tasaRegalias: [[2025, 0], [2026, 5], [2026, 11]],
  generarSemanas: [["01/10/2026", 3]],
  semanaLabelCorta: [["09/10/2026"]],
  calcularRetencionGananciasProveedor: [
    // EUROLAMP real (OP X-0001-00002753): MAT, Factura A, pagado con E-Cheq → retención 248.199,20 sobre 12.633.960
    [[lineaPago({ mat: true, importeBruto: 8109000, echeq: 9811890 }), lineaPago({ mat: true, importeBruto: 4524960, echeq: 5475201.6 })]],
    // MO con transferencia: 2% sobre lo que pasa de 67.170
    [[lineaPago({ mo: true, importeBruto: 800000, transferencia: 1000000 })]],
    // sin Factura A no retiene
    [[lineaPago({ facturaA: false, mat: true, importeBruto: 9999999, echeq: 1 })]],
    // debajo del mínimo
    [[lineaPago({ mat: true, importeBruto: 200000, echeq: 1 })]],
  ],
  xubioFirma: [[{ cuit: "30-70759893-6", factura: " 74627 ", cliente: "wu", centroCosto: "WU CIVIL WORK", subObra: "WU MARTIN CORONADO", importe: 344586.31 }]],
  xubioFechaISO: [["25/09/2026"], ["x"]],
  xubioClaveOP: [[{ cuit: "33-71432258-9", fechaPagado: "25/09/2026" }]],
  ocPdfId: [["WU|WU CIVIL WORK", "mz 01"]],
};
