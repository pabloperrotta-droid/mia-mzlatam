// ---------- Sección "Verónica" (Sección 99; desde la Sección 114 funciona con la planilla importada) ----------
// Solicitudes de Nota de Crédito de Cencosud en PDF → una fila por solicitud con: N° de solicitud, fecha,
// tipo, descripción (del producto con más cantidad), sucursal, comprobante asociado y subtotal. Se guardan
// en la base (colección `veronicaSolicitudes`, `qa_` en QA; solo los datos, no el PDF), se marcan como
// "Realizado" (como en Pagos) y se descargan en Excel. Solo la ve el rol que tenga la sección habilitada
// (y Admin).
// INSTRUCCIÓN DEL USUARIO (05/10/2026): "veronica nunca lo subas a produccion al menos que te lo diga
// directamente así". Por eso la sección queda APAGADA en Producción con este interruptor (el código de
// Producción es el mismo que QA). Solo se cambia a true con un pedido explícito del usuario.
const VERONICA_EN_PRODUCCION = false;
const VERONICA_HABILITADA = (typeof window < "u" && window.__APP_ENV__ !== "prd") || VERONICA_EN_PRODUCCION;
const VERO_ST = { planilla: null, subs: new Set(), iniciado: false, cargado: false };
function veroDb() {
  try {
    return typeof firebase < "u" && firebase.apps && firebase.apps.length ? scopedDb(firebase.firestore()) : null;
  } catch {
    return null;
  }
}
function veroIniciar() {
  if (VERO_ST.iniciado) return;
  const db = veroDb();
  if (!db) {
    setTimeout(veroIniciar, 2000);
    return;
  }
  VERO_ST.iniciado = true;
  // Sección 114: la planilla importada (Excel de Verónica) vive en un solo documento.
  db.collection("veronicaPlanilla")
    .doc("actual")
    .onSnapshot(
      (d) => {
        VERO_ST.planilla = d.exists ? d.data() : null;
        VERO_ST.cargado = true;
        VERO_ST.subs.forEach((f) => f());
      },
      () => {},
    );
}
function useVeronica() {
  const [, f] = React.useState(0);
  React.useEffect(() => {
    veroIniciar();
    const g = () => f((x) => x + 1);
    return VERO_ST.subs.add(g), () => VERO_ST.subs.delete(g);
  }, []);
  return VERO_ST;
}

// Lee una "SOLICITUD NOTA DE CREDITO" de Cencosud a partir de los textos de pdf.js con su posición
// ({ s, x, y, w }, una lista por página). Devuelve null si no parece una solicitud.
function leerSolicitudNC(paginas) {
  const todos = paginas.flat(),
    plano = todos.map((i) => i.s).join(" ").replace(/\s+/g, " "),
    m = plano.match(/N[º°o]\.?\s*(\d{4})\s*-\s*(\d{6,8})/);
  if (!m) return null;
  const r = {
    numero: m[1] + "-" + m[2],
    tipo: ((plano.match(/SOLICITUD NOTA DE CR[EÉ]DITO\s+(POR\s+[A-ZÁÉÍÓÚÑ ]+?)\s+(?:CENCOSUD|DOCUMENTO|N[º°o]|X\b)/i) || [])[1] || "").trim(),
    fecha: "",
    comprobante: ((plano.match(/Comprobante\s+Asoc\.?:?\s*([0-9A-Z]{6,})/i) || [])[1] || "").trim(),
    descripcion: "",
    cantidad: 0,
    sucursal: "",
    subtotal: 0,
    total: 0,
    cliente: "",
    snc: "",
  };
  // Cliente: el emisor (ej. "CENCOSUD S.A." → "CENCOSUD SA"), el primer nombre de empresa de la hoja.
  const emp = todos.find((i) => /\bS\.?\s?A\.?$|S\.?R\.?L\.?$/i.test(i.s) && /[a-z]{3}/i.test(i.s) && fcSoloDigitos(i.s).length < 4);
  emp && (r.cliente = emp.s.replace(/\./g, "").replace(/\s+/g, " ").trim().toUpperCase());
  // SNC con el formato de la planilla: letras del "Nº de Interno" (ej. WC-0195549447 → WC) + " X" + punto de
  // venta + número (ej. "WC X999903964306").
  const interno = todos.find((i) => /^[A-Z]{1,3}-\d{6,}$/.test(i.s));
  r.snc = (interno ? interno.s.split("-")[0] + " " : "") + "X" + m[1] + m[2].padStart(8, "0");
  // Fecha: la que está a la derecha de "Fecha:" en el mismo renglón (o pegada al texto).
  for (const items of paginas) {
    const et = items.find((i) => /^fecha:?/i.test(i.s) && !/emisi/i.test(i.s));
    if (!et) continue;
    const pegada = et.s.match(/(\d{2}[-/]\d{2}[-/]\d{4})/),
      der = items
        .filter((i) => Math.abs(i.y - et.y) < 3 && i.x > et.x && /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(i.s))
        .sort((a, b) => a.x - b.x)[0],
      v = (pegada && pegada[1]) || (der && der.s);
    if (v) {
      r.fecha = v.replace(/-/g, "/");
      break;
    }
  }
  r.fecha || (r.fecha = ((plano.match(/Fecha de Emisi[oó]n:?\s*(\d{2}[-/]\d{2}[-/]\d{4})/i) || [])[1] || "").replace(/-/g, "/"));
  // Subtotal: el importe al lado de "Sub-Total" (en la última página que lo tenga).
  for (let p = paginas.length - 1; p >= 0 && !r.subtotal; p--) {
    const v = fcValorJunto(paginas[p], /^\s*sub\s*-?\s*total\b/i);
    v && (r.subtotal = Math.abs(v));
  }
  // Total (Monto Final).
  for (let p = paginas.length - 1; p >= 0 && !r.total; p--) {
    const v = fcValorJunto(paginas[p], /^\s*total\b/i, true);
    v && (r.total = Math.abs(v));
  }
  // Renglones: debajo de los títulos de la tabla (Codigo / Descripcion / Sec / Sucursal / Cantidad…).
  const renglones = [];
  paginas.forEach((items) => {
    const hDesc = items.find((i) => /^descripci[oó]n$/i.test(i.s));
    if (!hDesc) return;
    const enFila = (i, y) => Math.abs(i.y - y) < 3,
      titulos = items.filter((i) => enFila(i, hDesc.y)).sort((a, b) => a.x - b.x),
      hCod = titulos.find((i) => /^c[oó]digo$/i.test(i.s)),
      hSec = titulos.find((i) => /^sec$/i.test(i.s)),
      hSuc = titulos.find((i) => /^sucursal$/i.test(i.s)),
      hCant = titulos.find((i) => /^cant(\.|idad)\s*fact/i.test(i.s)) || titulos.find((i) => /^cantidad$/i.test(i.s)),
      despuesSuc = hSuc ? titulos.find((i) => i.x > hSuc.x + (hSuc.w || 0)) : null,
      fin = items.find((i) => /^son pesos|^sub\s*-?\s*total/i.test(i.s)),
      yFin = fin ? fin.y : -Infinity,
      filas = [];
    items
      .filter((i) => i.y < hDesc.y - 2 && i.y > yFin + 1)
      .forEach((i) => {
        const f = filas.find((x) => enFila(i, x.y));
        f ? f.items.push(i) : filas.push({ y: i.y, items: [i] });
      });
    const desdeDesc = hCod ? hCod.x + (hCod.w || 0) + 5 : 40,
      hastaDesc = hSec ? hSec.x - 3 : hSuc ? hSuc.x - 15 : hDesc.x + 150,
      desdeSuc = hSec ? hSec.x + (hSec.w || 0) - 15 : hSuc ? hSuc.x - 20 : hastaDesc,
      hastaSuc = despuesSuc ? despuesSuc.x - 3 : desdeSuc + 120,
      centroCant = hCant ? hCant.x + (hCant.w || 0) / 2 : null;
    filas.forEach((f) => {
      const texto = (desde, hasta) =>
          f.items
            .filter((i) => i.x >= desde && i.x < hasta && !/^[\d.,]+$/.test(i.s))
            .sort((a, b) => a.x - b.x)
            .map((i) => i.s)
            .join(" ")
            .trim(),
        desc = texto(desdeDesc, hastaDesc),
        suc = texto(desdeSuc, hastaSuc),
        nums = f.items.filter((i) => /^[\d.,]+$/.test(i.s) && /\d/.test(i.s)),
        cantItem =
          centroCant != null && nums.length
            ? nums.slice().sort((a, b) => Math.abs(a.x + (a.w || 0) / 2 - centroCant) - Math.abs(b.x + (b.w || 0) / 2 - centroCant))[0]
            : null;
      // Las cantidades vienen con punto decimal ("000000021.00", "1.000" = 1).
      const cant = cantItem ? (/^\d+(\.\d+)?$/.test(cantItem.s) ? Number(cantItem.s) : Math.abs(fcLeerImporte(cantItem.s))) : 0;
      desc && renglones.push({ descripcion: desc, sucursal: suc, cantidad: cant });
    });
  });
  if (renglones.length) {
    const mayor = renglones.reduce((a, b) => (b.cantidad > a.cantidad ? b : a));
    r.descripcion = mayor.descripcion;
    r.cantidad = mayor.cantidad;
    r.sucursal = mayor.sucursal || (renglones.find((x) => x.sucursal) || {}).sucursal || "";
  }
  return r;
}
async function leerSolicitudNCPdf(file) {
  if (!window.pdfjsLib) throw new Error("No se pudo cargar el lector de PDF (pdf.js).");
  const doc = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise,
    paginas = [];
  for (let p = 1; p <= Math.min(doc.numPages, 10); p++) {
    const page = await doc.getPage(p);
    paginas.push(
      (await page.getTextContent()).items
        .filter((i) => (i.str || "").trim())
        .map((i) => ({ s: i.str.trim(), x: i.transform[4], y: i.transform[5], w: i.width || 0, h: i.height || 8 })),
    );
  }
  return leerSolicitudNC(paginas);
}
// ---------- Sección 114: planilla de Verónica (Excel importado + PDF que completan) ----------
// Pedido del usuario (08/10/2026): "primero importo el Excel… me lo armás tal cual en el sistema. Luego subo
// los PDF y me termina de completar los campos que están en amarillo… la clave es el número de solicitud"
// (SNC, ej. "WH X999903960547"). Amarillos en su Excel: N° Comp. Asoc., Descripción, Subtotal y Sucursal.
// Si el PDF tiene varios ítems, va el de mayor cantidad (eso ya lo hace leerSolicitudNC).
const VERO_COLS = [
  "Fecha de Recepcion", "Cliente", "FechaSNC", "SNC", "N° Comp, Asoc", "Concepto de SNC", "Descripcion", "Subtotal",
  "Monto Final", "Sucursal", "Estado", "OP", "Lote", "ND Interna", "Fecha NC", "Nro, NC Emitida", "Monto Neto",
  "Monto Final", "Observaciones", "Cargada en BI",
];
const VERO_AMARILLAS = { 4: "comprobante", 6: "descripcion", 7: "subtotal", 9: "sucursal" }; // columna → dato del PDF
const VERO_FECHAS = [0, 2, 14];
const VERO_IMPORTES = [7, 8, 16, 17];
const veroNorm = (t) => String(t == null ? "" : t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
// Clave de una solicitud: la parte "X" + números del SNC (así "WH X999903960547" y " X999903960547" coinciden).
function veroClaveSnc(t) {
  const m = String(t || "").toUpperCase().replace(/\s+/g, "").match(/X\d{6,}/);
  return m ? m[0] : veroNorm(t);
}
// "10/09/2026" → número de fecha de Excel (días desde 30/12/1899), para que la celda sea una fecha.
function veroFecha(t) {
  const m = String(t || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? Math.round((Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])) - Date.UTC(1899, 11, 30)) / 86400000) : t || "";
}
const veroVacio = (v) => v == null || String(v).trim() === "";
// Fecha de Excel (Date, número de serie o texto) → "dd/mm/aaaa".
function veroFechaTexto(v) {
  if (veroVacio(v)) return "";
  if (v instanceof Date && !isNaN(v)) return String(v.getUTCDate()).padStart(2, "0") + "/" + String(v.getUTCMonth() + 1).padStart(2, "0") + "/" + v.getUTCFullYear();
  if (typeof v == "number" && v > 20000 && v < 80000) return veroFechaTexto(new Date(Date.UTC(1899, 11, 30) + Math.round(v) * 86400000));
  return normalizarFecha(String(v).trim()) || String(v).trim();
}
// Filas de la hoja (lista de listas, como XLSX.utils.sheet_to_json con header: 1) → planilla.
// Busca la fila de títulos (la que dice "SNC") y ubica cada columna por su título.
function veroLeerPlanilla(aoa) {
  const filas = aoa || [];
  const iTit = filas.findIndex((f) => (f || []).some((c) => veroNorm(c) === "snc"));
  if (iTit < 0) return null;
  const tit = (filas[iTit] || []).map(veroNorm),
    usados = new Set(),
    pos = VERO_COLS.map((t) => {
      const j = tit.findIndex((x, k) => !usados.has(k) && x === veroNorm(t));
      return j >= 0 && usados.add(j), j;
    });
  const salida = [];
  filas.slice(iTit + 1).forEach((f, n) => {
    const v = pos.map((j, c) => {
      const x = j >= 0 ? (f || [])[j] : "";
      return VERO_FECHAS.includes(c) ? veroFechaTexto(x) : x instanceof Date ? veroFechaTexto(x) : typeof x == "string" ? x.trim() : x == null ? "" : x;
    });
    v.some((x) => !veroVacio(x)) && salida.push({ id: "f" + (n + 1) + "_" + veroClaveSnc(v[3]), v, pdf: {} });
  });
  return salida;
}
// Al reimportar el Excel: lo que ya se había completado con PDF (amarillas) y en el Excel nuevo está vacío, se mantiene.
function veroConservarCompletados(nuevas, viejas) {
  const usados = new Set();
  return nuevas.map((f) => {
    const k = veroClaveSnc(f.v[3]);
    const i = (viejas || []).findIndex((o, j) => !usados.has(j) && veroClaveSnc(o.v[3]) === k && Object.keys(VERO_AMARILLAS).some((c) => veroVacio(f.v[c]) && !veroVacio(o.v[c])));
    if (i < 0) return f;
    usados.add(i);
    const o = viejas[i],
      v = f.v.slice(),
      pdf = { ...(f.pdf || {}) };
    Object.keys(VERO_AMARILLAS).forEach((c) => veroVacio(v[c]) && !veroVacio(o.v[c]) && ((v[c] = o.v[c]), (pdf[c] = (o.pdf || {})[c] || true)));
    return { ...f, v, pdf };
  });
}
// Completa con los datos de un PDF (leerSolicitudNC) las amarillas vacías de las filas con el mismo SNC.
// Devuelve { filas, estado: "completado" | "ya_estaba" | "no_esta", cuantas }.
function veroCompletarConPdf(filas, d, archivo) {
  const k = veroClaveSnc(d && d.snc);
  let cuantas = 0,
    hay = false;
  const salida = (filas || []).map((f) => {
    if (!k || veroClaveSnc(f.v[3]) !== k) return f;
    hay = true;
    const v = f.v.slice(),
      pdf = { ...(f.pdf || {}) };
    let cambio = false;
    Object.entries(VERO_AMARILLAS).forEach(([c, dato]) => {
      const x = d[dato];
      veroVacio(v[c]) && !veroVacio(x) && ((v[c] = dato === "subtotal" ? Number(x) || 0 : x), (pdf[c] = archivo || true), (cambio = true));
    });
    return cambio ? (cuantas++, { ...f, v, pdf }) : f;
  });
  return { filas: salida, estado: !hay ? "no_esta" : cuantas ? "completado" : "ya_estaba", cuantas };
}
// Fila "por completar": le falta el Subtotal o la Sucursal (en el Excel del usuario las filas viejas pueden tener
// vacío el N° Comp. Asoc. o la Descripción y ya están terminadas). Los PDF igual completan cualquier amarilla vacía.
const veroFaltan = (f) => (veroVacio(f.v[7]) || veroVacio(f.v[9]) ? Object.keys(VERO_AMARILLAS).filter((c) => veroVacio(f.v[c])) : []);
function VeronicaView({ canEdit: puede }) {
  const st = useVeronica(),
    planilla = st.planilla,
    filas = (planilla && planilla.filas) || [],
    [filtro, setFiltro] = React.useState("todas"),
    [busca, setBusca] = React.useState(""),
    [prog, setProg] = React.useState(""),
    [res, setRes] = React.useState(null),
    [arrastre, setArrastre] = React.useState(false),
    q = normalizarTexto(busca),
    pendientes = filas.filter((f) => veroFaltan(f).length),
    completas = filas.filter((f) => !veroFaltan(f).length),
    visibles = (filtro === "pendientes" ? pendientes : filtro === "completas" ? completas : filas).filter((f) => !q || normalizarTexto(f.v.join(" ")).includes(q));
  async function guardar(nuevas, extra) {
    const db = veroDb();
    if (!db) throw new Error("Sin conexión con la base de datos.");
    await db.collection("veronicaPlanilla").doc("actual").set({ ...(planilla || {}), ...(extra || {}), filas: nuevas, actualizado: Date.now() });
  }
  async function importarExcel(archivo) {
    try {
      setProg("Leyendo el Excel…");
      const wb = XLSX.read(await archivo.arrayBuffer(), { cellDates: true }),
        ws = wb.Sheets[wb.SheetNames[0]],
        nuevas = veroLeerPlanilla(XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" }));
      if (!nuevas) return (setProg(""), window.alert("No encontré la fila de títulos (con la columna SNC) en " + archivo.name + "."));
      if (filas.length && !window.confirm("Ya hay una planilla cargada (" + filas.length + " filas). ¿Reemplazarla por " + archivo.name + " (" + nuevas.length + " filas)?\nLo que ya se completó con PDF y en el Excel nuevo está vacío se conserva.")) return setProg("");
      const finales = veroConservarCompletados(nuevas, filas);
      await guardar(finales, { archivo: archivo.name, importado: Date.now() });
      setRes({ titulo: "✅ Excel importado: " + finales.length + " filas (" + finales.filter((f) => veroFaltan(f).length).length + " con campos amarillos por completar)", lineas: [] });
      setFiltro("todas"); // Sección 115: después de importar se ve la planilla entera, tal cual el Excel
    } catch (e) {
      window.alert("No se pudo leer el Excel: " + ((e && e.message) || e));
    }
    setProg("");
  }
  async function subirPdfs(lista) {
    const archivos = Array.from(lista || []).filter((x) => /\.pdf$/i.test(x.name || "") || x.type === "application/pdf");
    if (!archivos.length) return window.alert("Elegí archivos PDF.");
    if (!filas.length) return window.alert("Primero importá el Excel: los PDF completan las filas de esa planilla (la clave es el SNC).");
    let actual = filas;
    const lineas = [];
    let completadas = 0;
    for (let i = 0; i < archivos.length; i++) {
      setProg("Leyendo PDF " + (i + 1) + " de " + archivos.length + "…");
      const f = archivos[i];
      try {
        const d = await leerSolicitudNCPdf(f);
        if (!d || !d.snc) {
          lineas.push("⚠️ " + f.name + ": no se encontró el N° de solicitud (SNC)");
          continue;
        }
        const r = veroCompletarConPdf(actual, d, f.name);
        actual = r.filas;
        r.estado === "completado" && ((completadas += r.cuantas), lineas.push("✅ " + d.snc + ": completado (" + f.name + ")"));
        r.estado === "ya_estaba" && lineas.push("ℹ️ " + d.snc + ": ya tenía los campos completos (no se cambió nada)");
        r.estado === "no_esta" && lineas.push("⚠️ " + d.snc + ": no está en la planilla importada (" + f.name + ")");
      } catch (e) {
        lineas.push("⚠️ " + f.name + ": " + ((e && e.message) || e));
      }
    }
    try {
      completadas && (await guardar(actual));
      setRes({ titulo: completadas ? "✅ " + completadas + " fila(s) completadas con los PDF" : "No se completó ninguna fila", lineas });
    } catch (e) {
      window.alert("No se pudo guardar: " + ((e && e.message) || e));
    }
    setProg("");
  }
  function vaciar() {
    window.confirm("¿Vaciar la planilla cargada (" + filas.length + " filas)? Descargá antes el Excel si lo necesitás.") &&
      guardar([], { archivo: "", importado: null }).catch(() => {});
  }
  function descargar() {
    const lista = visibles;
    if (!lista.length) return window.alert("No hay filas para descargar.");
    const hoja = XLSX.utils.aoa_to_sheet([
        VERO_COLS,
        ...lista.map((f) =>
          f.v.map((x, c) => (VERO_FECHAS.includes(c) ? veroFecha(x) : VERO_IMPORTES.includes(c) && !veroVacio(x) && !isNaN(Number(x)) ? Number(x) : x == null ? "" : x)),
        ),
      ]),
      libro = XLSX.utils.book_new();
    lista.forEach((_, n) =>
      VERO_COLS.forEach((__, c) => {
        const z = VERO_FECHAS.includes(c) ? "dd/mm/yyyy" : VERO_IMPORTES.includes(c) ? "#,##0.00" : null,
          cel = hoja[XLSX.utils.encode_cell({ r: n + 1, c })];
        z && cel && cel.t === "n" && (cel.z = z);
      }),
    );
    XLSX.utils.book_append_sheet(libro, hoja, "Hoja1");
    descargarLibroXlsx(libro, "planilla_nc_" + (filtro === "pendientes" ? "por_completar_" : filtro === "completas" ? "completas_" : "") + new Date().toISOString().slice(0, 10) + ".xlsx");
  }
  const th = { textAlign: "left", padding: "7px 8px", fontSize: 10.5, color: MUTED, fontWeight: 700, textTransform: "uppercase", background: "#FAFAF7", borderBottom: "1px solid " + BORDER, whiteSpace: "nowrap", position: "sticky", top: 0, zIndex: 1 },
    td = { padding: "6px 8px", fontSize: 12, borderBottom: "1px solid #EEE", verticalAlign: "top", whiteSpace: "nowrap", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis" },
    boton = (activo) => ({ ...smallBtnGhost, ...(activo ? { background: NAVY, color: "#fff", borderColor: NAVY } : {}) }),
    plata = (x) => (veroVacio(x) || isNaN(Number(x)) ? x : "$ " + Number(x).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
    archivoInput = (accept, multiple, onPick) =>
      React.createElement("input", {
        type: "file",
        accept,
        multiple,
        disabled: !!prog,
        style: { display: "none" },
        onChange: (e) => {
          const l = Array.from(e.target.files || []);
          ((e.target.value = ""), onPick(l));
        },
      });
  return React.createElement(
    "div",
    {
      style: { padding: "22px 28px" },
      onDragOver: (e) => puede && e.dataTransfer && Array.from(e.dataTransfer.types || []).includes("Files") && (e.preventDefault(), arrastre || setArrastre(true)),
      onDragLeave: (e) => e.currentTarget.contains(e.relatedTarget) || setArrastre(false),
      onDrop: (e) => {
        if (!puede || !e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length || prog) return;
        e.preventDefault();
        setArrastre(false);
        const l = Array.from(e.dataTransfer.files),
          x = l.find((a) => /\.(xlsx|xls)$/i.test(a.name || ""));
        x ? importarExcel(x) : subirPdfs(l);
      },
    },
    React.createElement("h2", { style: { fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: "0 0 2px" } }, "Verónica"),
    React.createElement(
      "div",
      { style: { fontSize: 12.5, color: MUTED, marginBottom: 12 } },
      "1) Importá el Excel de seguimiento: queda igual acá. 2) Subí (o arrastrá) los PDF de Solicitud de NC: por el N° de solicitud (SNC) completan los campos en amarillo — N° Comp. Asoc., Descripción (el ítem con más cantidad), Subtotal y Sucursal. 3) Descargá el Excel completo.",
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 } },
      puede &&
        React.createElement(
          "label",
          { style: { ...smallBtnGhost, ...(prog ? { opacity: 0.7, cursor: "wait" } : { cursor: "pointer" }) } },
          React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
          " 1) Importar Excel",
          archivoInput(".xlsx,.xls", false, (l) => l[0] && importarExcel(l[0])),
        ),
      puede &&
        React.createElement(
          "label",
          { style: { ...smallBtnPrimary, ...(prog ? { opacity: 0.7, cursor: "wait" } : { cursor: "pointer" }) } },
          React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
          " " + (prog || "2) Subir PDF"),
          archivoInput("application/pdf,.pdf", true, subirPdfs),
        ),
      React.createElement(
        "button",
        { onClick: descargar, style: smallBtnGhost, title: "Descarga en Excel las filas que se ven (según el filtro y el buscador), con las 20 columnas" },
        React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
        " 3) Descargar Excel",
      ),
      React.createElement("button", { onClick: () => setFiltro("todas"), style: boton(filtro === "todas") }, "Todas (" + filas.length + ")"),
      // Sección 116: filtros Todas / Por completar (falta PDF) / Completas.
      React.createElement("button", { onClick: () => setFiltro("pendientes"), style: boton(filtro === "pendientes") }, "Por completar — falta PDF (" + pendientes.length + ")"),
      React.createElement("button", { onClick: () => setFiltro("completas"), style: boton(filtro === "completas") }, "Completas (" + completas.length + ")"),
      React.createElement("input", { value: busca, onChange: (e) => setBusca(e.target.value), placeholder: "Buscar SNC, sucursal, descripción…", style: { ...inputStyle, width: 230 } }),
      puede && filas.length > 0 && React.createElement("button", { onClick: vaciar, style: { ...smallBtnGhost, color: RED } }, "Vaciar planilla"),
    ),
    planilla &&
      planilla.archivo &&
      React.createElement(
        "div",
        { style: { fontSize: 11.5, color: MUTED, marginBottom: 8 } },
        "Planilla: " + planilla.archivo + (planilla.importado ? " · importada el " + new Date(planilla.importado).toLocaleDateString("es-AR") : ""),
      ),
    res &&
      React.createElement(
        "div",
        { style: { background: "#fff", border: "1px solid " + BORDER, borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12.5 } },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between" } },
          React.createElement("strong", { style: { color: NAVY } }, res.titulo),
          React.createElement("button", { onClick: () => setRes(null), style: { border: "none", background: "none", cursor: "pointer", color: MUTED } }, "✕"),
        ),
        res.lineas.map((e, i) => React.createElement("div", { key: i, style: { marginTop: 3, color: /^⚠️/.test(e) ? "#9A6700" : "#333" } }, e)),
      ),
    React.createElement(
      "div",
      { style: { fontSize: 11.5, color: MUTED, marginBottom: 6, display: "flex", gap: 14, flexWrap: "wrap" } },
      React.createElement("span", null, React.createElement("span", { style: { display: "inline-block", width: 12, height: 12, background: "#FFF3A0", border: "1px solid #E5D36A", verticalAlign: "-2px" } }), " falta completar con el PDF"),
      React.createElement("span", null, React.createElement("span", { style: { display: "inline-block", width: 12, height: 12, background: "#DFF2E1", border: "1px solid #A9D5AF", verticalAlign: "-2px" } }), " completado con el PDF"),
    ),
    React.createElement(
      "div",
      {
        style: {
          background: "#fff",
          borderRadius: 12,
          border: "1px solid " + BORDER,
          boxShadow: CARD_SHADOW,
          overflow: "auto",
          maxHeight: "68vh",
          ...(arrastre ? { outline: "3px dashed #C9A227", outlineOffset: -3, background: "#FFFBEA" } : {}),
        },
      },
      React.createElement(
        "table",
        { style: { borderCollapse: "collapse", width: "100%" } },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            VERO_COLS.map((t, c) => React.createElement("th", { key: c, style: { ...th, ...(VERO_AMARILLAS[c] ? { background: "#FFF3A0" } : {}), ...(VERO_IMPORTES.includes(c) ? { textAlign: "right" } : {}) } }, t)),
          ),
        ),
        React.createElement(
          "tbody",
          null,
          visibles.length === 0 &&
            React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                { colSpan: VERO_COLS.length, style: { ...td, textAlign: "center", color: MUTED, padding: 24, whiteSpace: "normal" } },
                !st.cargado ? "Cargando…" : !filas.length ? "Todavía no hay planilla. Importá el Excel (o arrastralo acá)." : filtro === "pendientes" ? "No quedan filas con campos amarillos por completar." : filtro === "completas" ? "Todavía no hay filas completas." : "No hay filas.",
              ),
            ),
          visibles.map((f) =>
            React.createElement(
              "tr",
              { key: f.id },
              f.v.map((x, c) => {
                const amarilla = !!VERO_AMARILLAS[c],
                  falta = amarilla && veroVacio(x) && veroFaltan(f).length > 0,
                  dePdf = amarilla && !falta && f.pdf && f.pdf[c];
                return React.createElement(
                  "td",
                  {
                    key: c,
                    title: dePdf && typeof f.pdf[c] == "string" ? "Completado con " + f.pdf[c] : String(x == null ? "" : x),
                    style: { ...td, ...(falta ? { background: "#FFF3A0" } : dePdf ? { background: "#DFF2E1" } : {}), ...(VERO_IMPORTES.includes(c) ? { textAlign: "right" } : {}), ...(c === 3 ? { fontWeight: 700 } : {}) },
                  },
                  VERO_IMPORTES.includes(c) ? plata(x) : String(x == null ? "" : x),
                );
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
