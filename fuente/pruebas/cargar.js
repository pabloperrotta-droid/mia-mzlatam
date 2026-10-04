// Carga todo el código de la app (fuente/partes/*.js) en un entorno aislado de Node, sin navegador,
// y devuelve las funciones de cálculo para probarlas. No dibuja nada ni toca la base de datos.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const EXPORTAR = [
  "limpiarNumero", "conSeparadorMiles", "fmt", "pct", "markupDeMb", "pctMk", "aUsd",
  "parseFechaMesAnio", "consolidarProveedores", "normalizarFecha", "normalizeNombreSubobra",
  "nombresSubobraCoinciden", "ordenCompraIncluye", "montosPorOCDe", "conMontoDeOC", "sinMontoDeOC",
  "normOC", "adicionalesPorOC", "montoDeSubCostoParaOC", "fechaPedidoWuADdMmAaaa", "parseOrdenDeCompraItems",
  "fechaConGuiones", "fechaEsValida", "anioDeFecha", "mesIdxDeFecha", "capitalizar", "clavesEjercicioFiscal",
  "etiquetaEjercicioFiscal", "anioInicioEjercicioDeFecha", "dateAFechaStr", "numeroSemanaISO",
  "cambiosParaGuardar", "aplicarCambios", "combinarEstado", "normalizarTexto", "distanciaLevenshtein",
  "resolverConCoincidencia", "viernesDeLaSemana", "tasaRegalias", "regaliasPorSemana", "regaliaPendiente",
  "generarSemanas", "moverSemanas", "semanaLabelCorta", "calcularRetencionGananciasProveedor",
  "xubioFirma", "xubioFechaISO", "xubioClaveOP", "ocPdfId", "BORRAR_CAMPO", "ESTADO_EXTERNO",
];

function cargar() {
  const dir = path.join(__dirname, "..", "partes");
  const codigo = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".js"))
    .sort()
    .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
    .join("");
  const nada = () => null;
  const ctx = {
    React: { useState: (v) => [v, nada], useEffect: nada, useLayoutEffect: nada, useMemo: (f) => f(), useRef: (v) => ({ current: v }), createElement: nada, Fragment: "F" },
    ReactDOM: { createRoot: () => ({ render: nada }) },
    Recharts: {},
    document: { getElementById: () => ({}) },
    window: { __APP_ENV__: "qa", localStorage: { getItem: nada, setItem: nada } },
    console,
    Intl, Date, Math, JSON, Set, Map, Number, String, Array, Object, RegExp, Promise, Symbol, Error, URL,
    setTimeout, clearTimeout,
  };
  vm.createContext(ctx);
  vm.runInContext(codigo + "\nglobalThis.__exp = {" + EXPORTAR.map((n) => n + ": typeof " + n + " === 'undefined' ? undefined : " + n).join(",") + "};", ctx, {
    filename: "app.js",
  });
  return ctx.__exp;
}

module.exports = { cargar, EXPORTAR };
