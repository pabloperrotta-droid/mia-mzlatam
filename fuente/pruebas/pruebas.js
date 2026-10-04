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
