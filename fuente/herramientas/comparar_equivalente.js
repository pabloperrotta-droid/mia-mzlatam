// Controla que dos versiones del código sean el mismo programa salvo nombres de variables renombradas.
// Uso: node comparar_equivalente.js viejo.js nuevo.js mapa.json
// Compara token por token (sin espacios ni comentarios); solo acepta diferencias en identificadores
// que estén en el mapa de renombres (viejo → nuevo).
const fs = require("fs");
const ts = require(process.env.TYPESCRIPT || "typescript");
const [va, vb, m] = process.argv.slice(2);
const pares = new Set(JSON.parse(fs.readFileSync(m, "utf8")).map(([a, b]) => a + "\u0000" + b));
// Se recorre el árbol del programa (no un escaneo plano), así las plantillas `...` y las expresiones
// regulares se leen bien.
const tokens = (src) => {
  const sf = ts.createSourceFile("x.js", src, ts.ScriptTarget.Latest, false, ts.ScriptKind.JSX);
  const out = [];
  const visitar = (n) => {
    const hijos = n.getChildren(sf);
    if (!hijos.length) out.push([n.kind, n.getText(sf)]);
    else hijos.forEach(visitar);
  };
  visitar(sf);
  return out;
};
const a = tokens(fs.readFileSync(va, "utf8")),
  b = tokens(fs.readFileSync(vb, "utf8"));
let renombres = 0;
for (let i = 0; i < Math.max(a.length, b.length); i++) {
  const [ka, ta] = a[i] || [],
    [kb, tb] = b[i] || [];
  if (ka === kb && ta === tb) continue;
  if (ka === ts.SyntaxKind.Identifier && kb === ts.SyntaxKind.Identifier && pares.has(ta + "\u0000" + tb)) {
    renombres++;
    continue;
  }
  console.error("DIFERENTE en el token " + i + ": " + JSON.stringify(ta) + " vs " + JSON.stringify(tb));
  console.error("  contexto viejo: " + a.slice(Math.max(0, i - 8), i + 8).map((x) => x[1]).join(" "));
  console.error("  contexto nuevo: " + b.slice(Math.max(0, i - 8), i + 8).map((x) => x[1]).join(" "));
  process.exit(1);
}
console.log("Equivalentes: " + a.length + " tokens, " + renombres + " cambios de nombre esperados");
