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
// Listas de objetos (obras, líneas de Pagos…): se aplican sobre la versión de la base SOLO los
// elementos que cambiaron en esta pantalla, en vez de pisar la lista entera. Así, si otra pantalla
// cambió otro elemento (ej. renombró un centro de costo), ese cambio no se pierde.
// Identidad de un elemento: su "id" si tiene; si no, cliente + obra.
function idDeElemento(x) {
  return x && x.id != null && x.id !== "" ? "id:" + x.id : x && x.cliente != null && x.obra != null ? "co:" + x.cliente + "|" + x.obra : null;
}
function esListaDeObjetos(v) {
  return Array.isArray(v) && v.every(esObjetoPlano);
}
function combinarLista(L, B, R) {
  const texto = (x) => JSON.stringify(x),
    resultado = R.slice(),
    usados = new Set(),
    buscarEnR = (b) => {
      const t = texto(b);
      let i = resultado.findIndex((x, j) => !usados.has(j) && texto(x) === t);
      if (i < 0) {
        const id = idDeElemento(b);
        id && (i = resultado.findIndex((x, j) => !usados.has(j) && idDeElemento(x) === id));
      }
      return i;
    };
  const idsL = new Set(L.map(idDeElemento)),
    idsB = new Set(B.map(idDeElemento)),
    // Misma cantidad y cada posición cambiada es el mismo elemento (mismo id) o un cambio de nombre
    // en el lugar (el id nuevo no estaba antes y el viejo ya no está).
    enElLugar =
      L.length === B.length &&
      L.every((l, i) => {
        const a = idDeElemento(l),
          b = idDeElemento(B[i]);
        return texto(l) === texto(B[i]) || a === b || (!idsB.has(a) && !idsL.has(b));
      });
  if (enElLugar) {
    // Se compara posición por posición (cambios de datos o de nombre).
    L.forEach((l, i) => {
      if (texto(l) === texto(B[i])) return;
      const j = buscarEnR(B[i]);
      j >= 0 ? ((resultado[j] = l), usados.add(j)) : idDeElemento(l) && !resultado.some((x) => idDeElemento(x) === idDeElemento(l)) && resultado.push(l);
    });
    return resultado;
  }
  // Se agregaron o quitaron elementos: se sacan los quitados y se suman los nuevos.
  const cuenta = (xs) => {
      const m = new Map();
      xs.forEach((x) => m.set(texto(x), (m.get(texto(x)) || 0) + 1));
      return m;
    },
    enL = cuenta(L),
    enB = cuenta(B),
    quitados = [],
    agregados = [];
  enB.forEach((n, t) => {
    for (let i = 0; i < n - (enL.get(t) || 0); i++) quitados.push(JSON.parse(t));
  });
  enL.forEach((n, t) => {
    for (let i = 0; i < n - (enB.get(t) || 0); i++) agregados.push(JSON.parse(t));
  });
  quitados.forEach((q) => {
    const j = buscarEnR(q);
    j >= 0 && usados.add(j);
  });
  const sinQuitados = resultado.filter((_, j) => !usados.has(j));
  agregados.forEach((a) => {
    const id = idDeElemento(a),
      j = id ? sinQuitados.findIndex((x) => idDeElemento(x) === id) : -1;
    j >= 0 ? (sinQuitados[j] = a) : sinQuitados.push(a);
  });
  return sinQuitados;
}
function combinarEstado(local, base, remoto) {
  const r = { ...remoto };
  return (
    Object.keys(local || {}).forEach((k) => {
      const L = local[k],
        B = base ? base[k] : void 0,
        R = remoto[k];
      if (jsonIgual(L, B)) return;
      if (esListaDeObjetos(L) && esListaDeObjetos(B) && esListaDeObjetos(R)) {
        r[k] = combinarLista(L, B, R);
        return;
      }
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
