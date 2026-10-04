// Renombra variables locales de una parte del código de forma segura (entendiendo el alcance de cada
// variable, no buscar-y-reemplazar), usando el motor de TypeScript.
// Uso: node fuente/herramientas/renombrar.js <archivo de la parte> <mapa.json>
//   mapa.json: [["nombreViejo", "nombreNuevo", "texto único donde se declara (opcional)"], ...]
// No renombra si el nombre nuevo ya existe en algún lugar del código (para no tapar otra variable).
const fs = require("fs");
const path = require("path");
const ts = require(process.env.TYPESCRIPT || "typescript");

const [archivo, mapaArchivo] = process.argv.slice(2);
const mapa = JSON.parse(fs.readFileSync(mapaArchivo, "utf8"));
let texto = fs.readFileSync(archivo, "utf8");

const todo = () =>
  fs
    .readdirSync(path.dirname(archivo))
    .filter((f) => f.endsWith(".js"))
    .sort()
    .map((f) => (path.join(path.dirname(archivo), f) === path.resolve(archivo) || f === path.basename(archivo) ? texto : fs.readFileSync(path.join(path.dirname(archivo), f), "utf8")))
    .join("\n");

// Nombres usados como variables (declaradas o usadas) en todo el código. No cuentan los nombres de
// propiedades ({ obras: x }, objeto.obras), que no chocan con variables.
function identificadores(src) {
  const sf = ts.createSourceFile("todo.jsx", src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const out = new Set();
  const esNombreDePropiedad = (n) => {
    const p = n.parent;
    if (!p) return false;
    if (ts.isPropertyAccessExpression(p) && p.name === n) return true;
    if ((ts.isPropertyAssignment(p) || ts.isMethodDeclaration(p) || ts.isPropertyDeclaration(p) || ts.isGetAccessor(p) || ts.isSetAccessor(p)) && p.name === n) return true;
    if (ts.isBindingElement(p) && p.propertyName === n) return true;
    if (ts.isJsxAttribute(p) && p.name === n) return true;
    return false;
  };
  const visitar = (n) => {
    if (ts.isIdentifier(n) && !esNombreDePropiedad(n)) out.add(n.text);
    ts.forEachChild(n, visitar);
  };
  visitar(sf);
  return out;
}

const NOMBRE = "parte.jsx";
let version = 0;
const host = {
  getScriptFileNames: () => [NOMBRE],
  getScriptVersion: () => String(version),
  getScriptSnapshot: (f) => (f === NOMBRE ? ts.ScriptSnapshot.fromString(texto) : undefined),
  getCurrentDirectory: () => "/",
  getCompilationSettings: () => ({ allowJs: true, checkJs: false, noLib: true, jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2020 }),
  getDefaultLibFileName: () => "lib.d.ts",
  fileExists: (f) => f === NOMBRE,
  readFile: () => undefined,
};
const servicio = ts.createLanguageService(host, ts.createDocumentRegistry());

let hechos = 0;
for (const [viejo, nuevo, ancla] of mapa) {
  const existentes = identificadores(todo());
  if (existentes.has(nuevo)) {
    console.log("  — salteado " + viejo + " → " + nuevo + " (ese nombre ya existe en el código)");
    continue;
  }
  let pos;
  if (ancla) {
    const i = texto.indexOf(ancla);
    if (i < 0 || texto.indexOf(ancla, i + 1) >= 0) {
      console.log("  — salteado " + viejo + ": el texto ancla no aparece una sola vez");
      continue;
    }
    pos = i + ancla.search(new RegExp("\\b" + viejo.replace(/\$/g, "\\$") + "\\b"));
  }
  const lugares = servicio.findRenameLocations(NOMBRE, pos, false, false, { providePrefixAndSuffixTextForRename: true });
  if (!lugares || !lugares.length) {
    console.log("  — salteado " + viejo + ": no se encontró la declaración");
    continue;
  }
  lugares
    .slice()
    .sort((a, b) => b.textSpan.start - a.textSpan.start)
    .forEach((l) => {
      const actual = texto.substr(l.textSpan.start, l.textSpan.length);
      if (actual !== viejo) throw new Error("Lugar inesperado para " + viejo + ": " + actual);
      texto = texto.slice(0, l.textSpan.start) + (l.prefixText || "") + nuevo + (l.suffixText || "") + texto.slice(l.textSpan.start + l.textSpan.length);
    });
  version++;
  hechos++;
  console.log("  ✓ " + viejo + " → " + nuevo + " (" + lugares.length + " usos)");
}
fs.writeFileSync(archivo, texto);
console.log(hechos + " variable(s) renombrada(s) en " + archivo);
