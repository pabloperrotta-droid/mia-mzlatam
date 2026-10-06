// Número de versión de MIA (Sección 102): si en la base hay uno mayor, la pantalla pide recargar.
const VERSION_MIA = 102;
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
function combinarLista(L, B, R, descartados) {
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
      // Sección 102: si el elemento ya no está en la base (otra pantalla le cambió el nombre o lo borró),
      // no se vuelve a agregar con los datos viejos (antes quedaba repetido o volvía el nombre viejo): se descarta y se avisa.
      j >= 0 ? ((resultado[j] = l), usados.add(j)) : descartados && descartados.push(l);
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
// Sección 102: al guardar, las listas se combinan con lo que hay EN ESE MOMENTO en la base (leído dentro
// de la misma operación), para que una pantalla con datos viejos (ej. conexión cortada o compu dormida)
// no pise con su lista entera lo que otra pantalla cambió mientras tanto.
function valorEnRuta(obj, ruta) {
  return ruta.length === 1 ? (obj || {})[ruta[0]] : ((obj || {})[ruta[0]] || {})[ruta[1]];
}
function combinarCambiosConRemoto(cambios, base, remotoEn, descartados) {
  return (cambios || []).map(([ruta, v]) => {
    if (v === BORRAR_CAMPO || !esListaDeObjetos(v)) return [ruta, v];
    const B = valorEnRuta(base, ruta),
      R = remotoEn(ruta),
      d = [];
    if (!(esListaDeObjetos(B) && esListaDeObjetos(R))) return [ruta, v];
    const r = combinarLista(v, B, R, d);
    descartados && d.forEach((el) => descartados.push((NOMBRES_CLAVES[ruta[0]] || ruta[0]) + ": " + (nombreElemento(ruta[0], el) || (ruta[1] || ""))));
    return [ruta, r];
  });
}

// Sección 103: cada guardado deja en el documento un "sello" (pantalla:número). Si llega de la base una
// versión con un sello de ESTA pantalla más viejo que el último que ya se confirmó, es un eco atrasado de
// un guardado propio anterior (no otra pantalla): se ignora, así no vuelve un valor viejo ni da falsa alarma.
function selloAtrasado(sello, miPantalla, ultimoConfirmado) {
  const m = /^(.*):(\d+)$/.exec(String(sello || ""));
  return !!m && m[1] === miPantalla && Number(m[2]) < (Number(ultimoConfirmado) || 0);
}

// ---------- Aviso de cambios pisados (Sección 101) ----------
// Después de cada guardado se anota lo que esta pantalla cambió. Si después llega de la base una versión
// donde eso ya no está (otra pantalla lo pisó), se avisa. Las listas se miran elemento por elemento.
const NOMBRES_CLAVES = {
  obras: "Obras", pagosSemanales: "Pagos", proveedoresMap: "Proveedores de Costos", pagosMap: "Pagos de Costos",
  subCostoProveedoresMap: "Proveedores de sub obras", subCostoPagosMap: "Pagos de sub obras", cfEgresosValores: "Cashflow (Egresos)",
  cfIngresosValores: "Cashflow (Ingresos)", cfSalidasValores: "Cashflow (Salidas)", ordenesCompraMap: "Órdenes de compra",
  costoSubobrasMap: "Sub obras", adicionalesMap: "Adicionales",
};
function nombreElemento(k, el) {
  if (!el) return "";
  if (k === "obras") return [el.cliente, el.obra].filter(Boolean).join(" – ");
  if (k === "pagosSemanales") return [el.proveedorPago || el.proveedor, el.factura, el.centroCosto].filter(Boolean).join(" · ");
  return el.nombre || el.proveedor || el.obra || el.id || "";
}
// Anota lo guardado: para listas, los elementos que cambiaron; para el resto, el valor de cada ruta.
function anotarGuardado(anotados, cambios, baseAntes, ahora) {
  const t = (x) => JSON.stringify(x),
    lista = (anotados || []).filter((a) => ahora - a.ts < 15 * 60 * 1000);
  const valorEn = (obj, ruta) => (ruta.length === 1 ? (obj || {})[ruta[0]] : ((obj || {})[ruta[0]] || {})[ruta[1]]);
  (cambios || []).forEach(([ruta, v]) => {
    const k = ruta[0],
      clave = ruta.join("\u0001"),
      B = valorEn(baseAntes, ruta);
    if (esListaDeObjetos(v) && esListaDeObjetos(B)) {
      const enB = new Set(B.map(t)),
        enV = new Set(v.map(t)),
        cambiados = v.filter((x) => !enB.has(t(x))),
        viejos = B.filter((x) => !enV.has(t(x))),
        ids = new Set([...cambiados, ...viejos].map(idDeElemento).filter(Boolean));
      // Lo anotado antes de esos mismos elementos queda reemplazado por esto nuevo.
      for (let i = lista.length - 1; i >= 0; i--) lista[i].clave === clave && lista[i].el && ids.has(idDeElemento(lista[i].el)) && lista.splice(i, 1);
      cambiados.forEach((el) => lista.push({ ts: ahora, k, clave, ruta, el }));
    } else {
      for (let i = lista.length - 1; i >= 0; i--) lista[i].clave === clave && lista.splice(i, 1);
      lista.push({ ts: ahora, k, clave, ruta, valor: v === BORRAR_CAMPO ? void 0 : v });
    }
  });
  return lista;
}
// Devuelve { pisados: [textos], quedan: anotados que siguen vigentes }.
function cambiosPisados(anotados, remoto) {
  const t = (x) => JSON.stringify(x),
    pisados = [],
    quedan = [];
  (anotados || []).forEach((a) => {
    let ok = true;
    if (a.el) {
      const R = a.ruta.length === 1 ? (remoto || {})[a.ruta[0]] : ((remoto || {})[a.ruta[0]] || {})[a.ruta[1]];
      ok = !Array.isArray(R) || R.some((x) => t(x) === t(a.el));
    } else {
      const R = a.ruta.length === 1 ? (remoto || {})[a.ruta[0]] : ((remoto || {})[a.ruta[0]] || {})[a.ruta[1]];
      ok = t(R) === t(a.valor);
    }
    ok ? quedan.push(a) : pisados.push((NOMBRES_CLAVES[a.k] || a.k) + (a.el ? ": " + nombreElemento(a.k, a.el) : ""));
  });
  return { pisados: [...new Set(pisados)], quedan };
}
