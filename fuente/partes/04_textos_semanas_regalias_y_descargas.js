function normalizarTexto(n) {
  return String(n || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}
function distanciaLevenshtein(n, d) {
  const c = n.length,
    p = d.length;
  if (c === 0) return p;
  if (p === 0) return c;
  let g = new Array(p + 1),
    C = new Array(p + 1);
  for (let S = 0; S <= p; S++) g[S] = S;
  for (let S = 1; S <= c; S++) {
    C[0] = S;
    for (let f = 1; f <= p; f++) {
      const F = n[S - 1] === d[f - 1] ? 0 : 1;
      C[f] = Math.min(C[f - 1] + 1, g[f] + 1, g[f - 1] + F);
    }
    [g, C] = [C, g];
  }
  return g[p];
}
function resolverConCoincidencia(n, d, c) {
  const p = String(n || "").trim();
  if (!p) return { valor: "", corregido: false };
  const g = normalizarTexto(p),
    C = (d || []).filter(Boolean),
    S = C.find((A) => normalizarTexto(A) === g);
  if (S) return { valor: S, corregido: S !== p };
  if (g.length < 5) return { valor: p, corregido: false };
  if (c && c[g] && C.some((A) => normalizarTexto(A) === normalizarTexto(c[g]))) {
    const A = C.find((k) => normalizarTexto(k) === normalizarTexto(c[g]));
    return { valor: A, corregido: normalizarTexto(A) !== g };
  }
  const f = g.length <= 4 ? 1 : g.length <= 8 ? 2 : 3,
    F = C.filter((A) => {
      const k = normalizarTexto(A);
      return k.includes(g) || g.includes(k) ? true : distanciaLevenshtein(k, g) <= f;
    });
  return F.length === 1 ? { valor: F[0], corregido: true } : { valor: p, corregido: false };
}
function viernesDeLaSemana(n) {
  const c = (5 - n.getDay() + 7) % 7,
    p = new Date(n);
  return (p.setDate(p.getDate() + c), p);
}
function tasaRegalias(anio, mesIdx) {
  const k = anio * 12 + mesIdx;
  return k <= 2027 * 12 + 5 ? 0.01 : k <= 2028 * 12 + 5 ? 0.015 : k <= 2029 * 12 + 5 ? 0.02 : 0.025;
}
function regaliasPorSemana(facturas, semanas) {
  const r = {};
  return (
    (semanas || []).forEach((s) => {
      const [dd, mm, yy] = String(s)
        .split("/")
        .map((x) => parseInt(x, 10));
      if (!(dd >= 1 && dd <= 7) || !mm || !yy) return;
      let m = mm - 2,
        y = yy;
      m < 0 && ((m = 11), (y -= 1));
      const base = (facturas || [])
          .filter((f) => {
            const p = String(f.fecha || "").split("/");
            return p.length === 3 && parseInt(p[1], 10) - 1 === m && parseInt(p[2], 10) === y;
          })
          .reduce((a, f) => a + (Number(f.importe) || 0), 0),
        tasa = tasaRegalias(y, m);
      r[s] = {
        clave: y + "-" + String(m + 1).padStart(2, "0"),
        mesNombre: MESES[m].charAt(0) + MESES[m].slice(1).toLowerCase() + " " + y,
        base,
        tasa,
        monto: Math.round(base * tasa * 100) / 100,
      };
    }),
    r
  );
}
function regaliaPendiente(mapa, pagadas, s) {
  const x = mapa[s];
  return x && !(pagadas || {})[x.clave] ? x.monto : 0;
}
function generarSemanas(n, d) {
  const c = viernesDeLaSemana(fechaAObjetoDate(n) || /* @__PURE__ */ new Date()),
    p = [];
  for (let g = 0; g < d; g++) {
    const C = new Date(c);
    (C.setDate(C.getDate() + g * 7), p.push(dateAFechaStr(C)));
  }
  return p;
}
// Sección 135: cuántas semanas muestra Cashflow desde la semana `n`: como mínimo 26, y siempre hasta el
// 31/12 del año al que se llega con esas 26 (pedido del usuario: "poner la estructura de todo 2027").
// Ej.: desde el 30/10/2026 → hasta el 31/12/2027 (62 semanas).
// Sección 137: semanas anteriores a `primera` que tienen algo cargado en alguno de los mapas de Cashflow
// (claves "fila|dd/mm/aaaa"). Lo cargado en semanas pasadas sigue pendiente hasta que se borre (pedido del
// usuario): se suma al saldo de las semanas que se ven, sin importar en qué semana esté parado.
function semanasAnterioresConDatos(mapas, primera) {
  const lim = fechaAObjetoDate(primera),
    vistas = new Set();
  for (const m of mapas || [])
    for (const [k, v] of Object.entries(m || {})) {
      if (v === "" || v == null || !Number(v)) continue;
      const s = k.slice(k.lastIndexOf("|") + 1);
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s) || vistas.has(s)) continue;
      const d = fechaAObjetoDate(s);
      d && lim && d < lim && vistas.add(s);
    }
  return [...vistas].sort((a, b) => fechaAObjetoDate(a) - fechaAObjetoDate(b));
}
// ===== Sección 142: lectura tolerante de los Excel de Cashflow (pedido del usuario: "todo lo que sea
// previsible, cómo el usuario carga la información, MIA lo debería detectar"). =====
// Texto comparable: sin acentos, mayúsculas, sin espacios de más.
function textoComparableCf(t) {
  return String(t == null ? "" : t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toUpperCase();
}
// Título de columna → semana (el viernes, "dd/mm/aaaa") o null. Acepta texto en varios formatos
// (30/10/2026, 30-10-26, 30.10.2026, 2026-10-30, 1/9/2027), fechas de Excel y números de serie de fecha.
// Si la fecha no es viernes, se toma la semana a la que pertenece.
function semanaDeTituloCashflow(v) {
  let d = null;
  if (v instanceof Date) d = new Date(v.getTime() + 12 * 3600 * 1000);
  else if (typeof v == "number") {
    if (v > 30000 && v < 80000) {
      const u = new Date(Date.UTC(1899, 11, 30) + Math.round(v) * 864e5);
      d = new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate());
    }
  } else {
    const t = String(v == null ? "" : v).trim();
    let m = t.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2}|\d{4})$/),
      y, mes, dia;
    if (m) (dia = +m[1]), (mes = +m[2]), (y = m[3].length === 2 ? 2000 + +m[3] : +m[3]);
    else if ((m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) (y = +m[1]), (mes = +m[2]), (dia = +m[3]);
    if (m) {
      d = new Date(y, mes - 1, dia);
      // 31/02 o 13/40 no son fechas: Date las "corre" de mes, así que se descartan.
      (d.getMonth() !== mes - 1 || d.getDate() !== dia) && (d = null);
    }
  }
  if (!d || isNaN(d) || d.getFullYear() < 2000 || d.getFullYear() > 2100) return null;
  return dateAFechaStr(viernesDeLaSemana(new Date(d.getFullYear(), d.getMonth(), d.getDate())));
}
// Nombre de columna conocido (sin importar acentos, mayúsculas ni espacios) → el que usa MIA.
const ETIQUETAS_CF = {
  ID: "ID",
  CLIENTE: "Cliente",
  "CENTRO DE COSTO": "Centro de Costo",
  "CENTRO COSTO": "Centro de Costo",
  OBRA: "Centro de Costo",
  PROVEEDOR: "Proveedor",
  CATEGORIA: "Categoría",
  TIPO: "Tipo",
  "N° FACTURA": "N° Factura",
  "Nº FACTURA": "N° Factura",
  "NRO FACTURA": "N° Factura",
  "NRO. FACTURA": "N° Factura",
  "N FACTURA": "N° Factura",
  FACTURA: "N° Factura",
  "IMPORTE TOTAL": "Importe Total",
  SALDO: "Saldo",
};
function etiquetaCanonicaCf(t) {
  return ETIQUETAS_CF[textoComparableCf(t)] || String(t == null ? "" : t).trim();
}
// Importe de una celda → { valor } (null = vacía) o { invalido: texto } si no se entiende.
// "$ 1.234.567,89", "1,234,567.89", "(1.000)" (negativo), "-", "=1500*2", "1.234" (mil doscientos…).
function numeroDeCeldaCashflow(v) {
  if (v == null || v === "") return { valor: null };
  if (typeof v == "number") return isFinite(v) ? { valor: v } : { invalido: String(v) };
  if (typeof v == "boolean" || v instanceof Date) return { invalido: String(v) };
  let t = String(v).trim();
  if (!t || /^[-–—]$/.test(t)) return { valor: null };
  if (/^=/.test(t)) {
    const r = evaluarCuenta(t);
    return r == null ? { invalido: t } : { valor: r };
  }
  const neg = /^\(.*\)$/.test(t) || /^-/.test(t) || /-$/.test(t);
  const limpio = t.replace(/^\(|\)$/g, "").replace(/\$|ARS|AR\$|PESOS?/gi, "").replace(/[\s\u00a0]/g, "").replace(/^-|-$/g, "");
  if (!/^[\d.,]+$/.test(limpio) || !/\d/.test(limpio)) return { invalido: t };
  const n = leerNumeroFlexible(limpio);
  return { valor: neg ? -n : n };
}
// Busca una hoja por nombre sin importar acentos, mayúsculas ni espacios ("salidas semanales", "Salidas").
function hojaDeLibroCashflow(wb, nombres) {
  const q = nombres.map(textoComparableCf);
  const n = (wb.SheetNames || []).find((x) => q.includes(textoComparableCf(x)));
  return n ? { nombre: n, ws: wb.Sheets[n] } : null;
}
// Lee una hoja de Cashflow: busca la fila de títulos (puede haber filas arriba), reconoce las columnas de
// semanas y las de datos, saltea filas vacías y de TOTAL, y junta valores y comentarios por semana.
function leerHojaCashflow(ws, etiquetaClave) {
  const rango = XLSX.utils.decode_range(ws["!ref"] || "A1"),
    celda = (r, c) => ws[XLSX.utils.encode_cell({ r, c })],
    valorTitulo = (c) => (c ? (c.v instanceof Date ? c.v : c.t === "n" && c.z && XLSX.SSF.is_date(c.z) ? new Date(Math.round((c.v - 25569) * 864e5)) : c.v) : null);
  let filaTit = -1;
  for (let r = rango.s.r; r <= Math.min(rango.e.r, rango.s.r + 15) && filaTit < 0; r++) {
    let etiqueta = false,
      semanas = 0;
    for (let c = rango.s.c; c <= rango.e.c; c++) {
      const v = valorTitulo(celda(r, c));
      etiquetaCanonicaCf(v) === etiquetaClave && (etiqueta = true);
      semanaDeTituloCashflow(v) && semanas++;
    }
    (etiqueta || semanas >= 2) && (filaTit = r);
  }
  const res = { filas: [], semanas: [], corregidas: 0, repetidas: [], noReconocidas: [], filaTitulos: filaTit + 1 };
  if (filaTit < 0) return res;
  const cols = [];
  for (let c = rango.s.c; c <= rango.e.c; c++) {
    const v = valorTitulo(celda(filaTit, c)),
      sem = semanaDeTituloCashflow(v);
    if (sem) {
      cols.push({ c, semana: sem });
      const txt = v instanceof Date || typeof v == "number" ? sem : String(v).trim();
      txt !== sem && res.corregidas++;
    } else if (v != null && String(v).trim() !== "") {
      cols.push({ c, etiqueta: etiquetaCanonicaCf(v) });
      // Parece una fecha pero no se entiende (ej. 31/02/2027, o mes/día al revés como 11/13/2026).
      /\d{1,4}[\/\-.]\d{1,2}([\/\-.]\d{1,4})?/.test(String(v)) && res.noReconocidas.push(String(v).trim());
    }
  }
  const vistas = new Set();
  for (const x of cols) x.semana && (vistas.has(x.semana) ? res.repetidas.push(x.semana) : vistas.add(x.semana));
  res.semanas = [...vistas];
  for (let r = filaTit + 1; r <= rango.e.r; r++) {
    const f = { filaExcel: r + 1, datos: {}, semanas: {}, invalidos: [], comentarios: {} };
    let algo = false;
    for (const x of cols) {
      const ce = celda(r, x.c);
      if (x.etiqueta) {
        if (ce && ce.v != null && String(ce.v).trim() !== "") (f.datos[x.etiqueta] = ce.v), (algo = true);
        continue;
      }
      const n = numeroDeCeldaCashflow(ce ? ce.v : null),
        com = ce && ce.c && ce.c.length ? String(ce.c[ce.c.length - 1].t || "").trim() : "";
      com && (f.comentarios[x.semana] = com);
      if (n.invalido != null) {
        f.invalidos.push({ semana: x.semana, texto: n.invalido });
        algo = true;
        continue;
      }
      n.valor != null && (algo = true);
      const prev = f.semanas[x.semana];
      f.semanas[x.semana] = prev == null || prev === null ? n.valor : n.valor == null ? prev : prev + n.valor;
    }
    if (!algo) continue;
    const primera = Object.values(f.datos).map((v) => String(v)).find((v) => v.trim());
    if (primera && /^TOTAL/.test(textoComparableCf(primera))) continue;
    res.filas.push(f);
  }
  return res;
}
// Título de una celda (para las pruebas y los comentarios): la semana si es fecha, si no el nombre de columna.
function tituloDeCeldaCashflow(c) {
  if (!c || c.v == null) return "";
  const v = c.v instanceof Date ? c.v : c.t === "n" && c.z && XLSX.SSF.is_date(c.z) ? new Date(Math.round((c.v - 25569) * 864e5)) : c.v;
  return semanaDeTituloCashflow(v) || etiquetaCanonicaCf(v);
}
function semanasDeCashflow(n) {
  const c = viernesDeLaSemana(fechaAObjetoDate(n) || /* @__PURE__ */ new Date()),
    lim = new Date(c);
  lim.setDate(lim.getDate() + 25 * 7);
  const fin = new Date(lim.getFullYear(), 11, 31);
  return Math.max(26, Math.floor((fin - c) / (7 * 864e5)) + 1);
}
function moverSemanas(n, d) {
  const c = fechaAObjetoDate(n) || /* @__PURE__ */ new Date(),
    p = new Date(c);
  return (p.setDate(p.getDate() + d * 7), dateAFechaStr(viernesDeLaSemana(p)));
}
function semanaLabelCorta(n) {
  const d = n.split("/");
  return d[0] + "/" + d[1];
}
function fechaComercialHoy() {
  const n = /* @__PURE__ */ new Date(),
    d = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  n.getHours() < 9 && d.setDate(d.getDate() - 1);
  const c = d.getFullYear(),
    p = String(d.getMonth() + 1).padStart(2, "0"),
    g = String(d.getDate()).padStart(2, "0");
  return c + "-" + p + "-" + g;
}
function dataUrlToBlob(n) {
  const [d, c] = n.split(","),
    p = d.match(/:(.*?);/),
    g = p ? p[1] : "application/pdf",
    C = atob(c),
    S = new Uint8Array(C.length);
  for (let f = 0; f < C.length; f++) S[f] = C.charCodeAt(f);
  return new Blob([S], { type: g });
}
function dataUrlToBlobUrl(n) {
  try {
    return URL.createObjectURL(dataUrlToBlob(n));
  } catch {
    return n;
  }
}
async function ofrecerDescarga(n, d) {
  try {
    if (window.claude && window.claude.use) {
      const C = await window.claude.use("downloads");
      if (C) {
        await C.save({ filename: n, data: d });
        return;
      }
    }
    const c = d instanceof Blob ? d : new Blob([d], { type: "application/octet-stream" }),
      p = URL.createObjectURL(c),
      g = document.createElement("a");
    ((g.href = p),
      (g.download = n),
      document.body.appendChild(g),
      g.click(),
      document.body.removeChild(g),
      setTimeout(() => URL.revokeObjectURL(p), 4e3));
  } catch (c) {
    (!c || c.code !== "declined") && alert('No se pudo descargar "' + n + '".');
  }
}
function descargarLibroXlsx(n, d) {
  const c = XLSX.write(n, { bookType: "xlsx", type: "array" });
  ofrecerDescarga(d, new Blob([c], { type: "application/octet-stream" }));
}
