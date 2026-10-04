const BORRAR_CAMPO = "__MIA_BORRAR_CAMPO__";
// Sección 90: el estado ya no entra en un solo documento (límite de 1 MB de la base). Estas claves, las
// más pesadas, se guardan cada una en su propio documento app/st_<clave> (campo "v"); el resto sigue en
// app/state. Para la pantalla es un único estado: se juntan al leer y se reparten al guardar.
const ESTADO_EXTERNO = [
  "cfSalidasValores",
  "pagosSemanales",
  "pagosMap",
  "cfEgresosValores",
  "cfIngresosValores",
  "subCostoPagosMap",
  "proveedoresMap",
  "subCostoProveedoresMap",
];
const docEstadoExterno = (k) => "app/st_" + k;
function esObjetoPlano(v) {
  return v !== null && typeof v == "object" && !Array.isArray(v);
}
function jsonIgual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function subclavesSeguras(a, b) {
  return [...Object.keys(a || {}), ...Object.keys(b || {})].every((k) => k !== "");
}
function cambiosParaGuardar(local, base) {
  const out = [];
  return (
    Object.keys(local || {}).forEach((k) => {
      const L = local[k],
        B = base ? base[k] : void 0;
      if (jsonIgual(L, B)) return;
      esObjetoPlano(L) && esObjetoPlano(B) && subclavesSeguras(L, B)
        ? new Set([...Object.keys(L), ...Object.keys(B)]).forEach((sub) => {
            jsonIgual(L[sub], B[sub]) || out.push([[k, sub], L[sub] === void 0 ? BORRAR_CAMPO : L[sub]]);
          })
        : out.push([[k], L === void 0 ? null : L]);
    }),
    out
  );
}
function aplicarCambios(base, cambios) {
  const r = { ...(base || {}) };
  return (
    cambios.forEach(([ruta, v]) => {
      if (ruta.length === 1) v === BORRAR_CAMPO ? delete r[ruta[0]] : (r[ruta[0]] = v);
      else {
        const o = { ...(esObjetoPlano(r[ruta[0]]) ? r[ruta[0]] : {}) };
        (v === BORRAR_CAMPO ? delete o[ruta[1]] : (o[ruta[1]] = v), (r[ruta[0]] = o));
      }
    }),
    r
  );
}
function combinarEstado(local, base, remoto) {
  const r = { ...remoto };
  return (
    Object.keys(local || {}).forEach((k) => {
      const L = local[k],
        B = base ? base[k] : void 0,
        R = remoto[k];
      if (jsonIgual(L, B)) return;
      if (esObjetoPlano(L) && esObjetoPlano(B) && esObjetoPlano(R)) {
        const m = { ...R };
        (new Set([...Object.keys(L), ...Object.keys(B)]).forEach((sub) => {
          jsonIgual(L[sub], B[sub]) || (L[sub] === void 0 ? delete m[sub] : (m[sub] = L[sub]));
        }),
          (r[k] = m));
      } else r[k] = L;
    }),
    r
  );
}
