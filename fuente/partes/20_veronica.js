// ---------- Sección "Verónica" (Sección 99) ----------
// Solicitudes de Nota de Crédito de Cencosud en PDF → una fila por solicitud con: N° de solicitud, fecha,
// tipo, descripción (del producto con más cantidad), sucursal, comprobante asociado y subtotal. Se guardan
// en la base (colección `veronicaSolicitudes`, `qa_` en QA; solo los datos, no el PDF), se marcan como
// "Realizado" (como en Pagos) y se descargan en Excel. Solo la ve el rol que tenga la sección habilitada
// (y Admin).
const VERO_ST = { filas: {}, subs: new Set(), iniciado: false, cargado: false };
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
  db.collection("veronicaSolicitudes").onSnapshot(
    (s) => {
      const m = {};
      s.docs.forEach((d) => (m[d.id] = { id: d.id, ...d.data() }));
      VERO_ST.filas = m;
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
  };
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
const VERO_COLUMNAS = [
  ["numero", "N° de solicitud"],
  ["fecha", "Fecha"],
  ["tipo", "Tipo"],
  ["descripcion", "Descripción"],
  ["sucursal", "Sucursal"],
  ["comprobante", "Comprobante asociado"],
  ["subtotal", "Subtotal"],
];
function VeronicaView({ canEdit: puede }) {
  const st = useVeronica(),
    [filtro, setFiltro] = React.useState("pendientes"),
    [busca, setBusca] = React.useState(""),
    [prog, setProg] = React.useState(""),
    [res, setRes] = React.useState(null),
    [arrastre, setArrastre] = React.useState(false),
    todas = Object.values(st.filas).sort((a, b) => (b.cargado || 0) - (a.cargado || 0) || String(a.numero).localeCompare(String(b.numero))),
    q = normalizarTexto(busca),
    visibles = todas
      .filter((f) => (filtro === "pendientes" ? !f.realizado : filtro === "realizados" ? !!f.realizado : true))
      .filter((f) => !q || normalizarTexto(VERO_COLUMNAS.map(([k]) => f[k]).join(" ")).includes(q)),
    total = visibles.reduce((a, f) => a + (Number(f.subtotal) || 0), 0);
  async function importar(lista) {
    const archivos = Array.from(lista || []).filter((x) => /\.pdf$/i.test(x.name || "") || x.type === "application/pdf");
    if (!archivos.length) return window.alert("Elegí archivos PDF.");
    const db = veroDb();
    if (!db) return window.alert("Sin conexión con la base de datos.");
    const r = { nuevas: 0, actualizadas: 0, errores: [] };
    for (let i = 0; i < archivos.length; i++) {
      setProg("Leyendo " + (i + 1) + " de " + archivos.length + "…");
      const f = archivos[i];
      try {
        const d = await leerSolicitudNCPdf(f);
        if (!d) {
          r.errores.push(f.name + ": no se encontró el N° de solicitud");
          continue;
        }
        const id = d.numero.replace(/[^\dA-Za-z-]/g, ""),
          previa = st.filas[id];
        await db
          .collection("veronicaSolicitudes")
          .doc(id)
          .set({ ...d, archivo: f.name || "", cargado: (previa && previa.cargado) || Date.now(), actualizado: Date.now() }, { merge: true });
        previa ? r.actualizadas++ : r.nuevas++;
        !d.subtotal && r.errores.push(f.name + ": no se encontró el Subtotal (revisalo)");
        !d.descripcion && r.errores.push(f.name + ": no se encontró la descripción (revisala)");
      } catch (e) {
        r.errores.push(f.name + ": " + ((e && e.message) || e));
      }
    }
    setProg("");
    setRes(r);
  }
  function marcar(ids, si) {
    const db = veroDb();
    db &&
      ids.forEach((id) =>
        db
          .collection("veronicaSolicitudes")
          .doc(id)
          .set({ realizado: !!si, realizadoEn: si ? Date.now() : null }, { merge: true })
          .catch(() => {}),
      );
  }
  function borrar(f) {
    const db = veroDb();
    db && window.confirm("¿Borrar la solicitud " + f.numero + "?") && db.collection("veronicaSolicitudes").doc(f.id).delete().catch(() => {});
  }
  function descargar() {
    if (!visibles.length) return window.alert("No hay filas para descargar.");
    const hoja = XLSX.utils.aoa_to_sheet([
        VERO_COLUMNAS.map(([, t]) => t),
        ...visibles.map((f) => VERO_COLUMNAS.map(([k]) => (k === "subtotal" ? Number(f.subtotal) || 0 : f[k] || ""))),
      ]),
      libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Solicitudes");
    descargarLibroXlsx(libro, "solicitudes_nc_" + filtro + "_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  }
  const th = { textAlign: "left", padding: "8px 8px", fontSize: 10.5, color: MUTED, fontWeight: 700, textTransform: "uppercase", background: "#FAFAF7", borderBottom: "1px solid " + BORDER, whiteSpace: "nowrap" },
    td = { padding: "7px 8px", fontSize: 12.5, borderBottom: "1px solid #EEE", verticalAlign: "top" },
    boton = (activo) => ({ ...smallBtnGhost, ...(activo ? { background: NAVY, color: "#fff", borderColor: NAVY } : {}) });
  return React.createElement(
    "div",
    {
      style: { padding: "22px 28px" },
      onDragOver: (e) => puede && e.dataTransfer && Array.from(e.dataTransfer.types || []).includes("Files") && (e.preventDefault(), arrastre || setArrastre(true)),
      onDragLeave: (e) => e.currentTarget.contains(e.relatedTarget) || setArrastre(false),
      onDrop: (e) => {
        if (!puede || !e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return;
        (e.preventDefault(), setArrastre(false), prog || importar(Array.from(e.dataTransfer.files)));
      },
    },
    React.createElement("h2", { style: { fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: "0 0 2px" } }, "Verónica"),
    React.createElement(
      "div",
      { style: { fontSize: 12.5, color: MUTED, marginBottom: 12 } },
      "Solicitudes de Nota de Crédito (PDF) → Excel. Cargá o arrastrá los PDF; de cada uno se toma la descripción del producto con más cantidad, la sucursal, el comprobante asociado y el subtotal.",
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 } },
      puede &&
        React.createElement(
          "label",
          { style: { ...smallBtnPrimary, ...(prog ? { opacity: 0.7, cursor: "wait" } : { cursor: "pointer" }) } },
          React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
          " " + (prog || "Cargar PDF"),
          React.createElement("input", {
            type: "file",
            accept: "application/pdf,.pdf",
            multiple: true,
            disabled: !!prog,
            style: { display: "none" },
            onChange: (e) => {
              const l = Array.from(e.target.files || []);
              ((e.target.value = ""), importar(l));
            },
          }),
        ),
      React.createElement(
        "button",
        { onClick: descargar, style: smallBtnGhost, title: "Descarga en Excel las filas que se ven (según el filtro y el buscador)" },
        React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
        " Descargar Excel",
      ),
      ["pendientes", "realizados", "todos"].map((k) =>
        React.createElement(
          "button",
          { key: k, onClick: () => setFiltro(k), style: boton(filtro === k) },
          k === "pendientes" ? "Pendientes (" + todas.filter((f) => !f.realizado).length + ")" : k === "realizados" ? "Realizados" : "Todos",
        ),
      ),
      React.createElement("input", {
        value: busca,
        onChange: (e) => setBusca(e.target.value),
        placeholder: "Buscar n°, sucursal, descripción…",
        style: { ...inputStyle, width: 230 },
      }),
      puede &&
        filtro === "pendientes" &&
        visibles.length > 0 &&
        React.createElement(
          "button",
          {
            onClick: () => window.confirm("¿Marcar las " + visibles.length + " solicitudes que se ven como realizadas?") && marcar(visibles.map((f) => f.id), true),
            style: { ...smallBtnGhost, background: "#C9A227", borderColor: "#C9A227", color: "#1A1A1A", fontWeight: 700 },
          },
          "✓ Marcar todas como realizadas",
        ),
    ),
    res &&
      React.createElement(
        "div",
        { style: { background: "#fff", border: "1px solid " + BORDER, borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12.5 } },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between" } },
          React.createElement("strong", { style: { color: NAVY } }, "✅ " + res.nuevas + " nuevas" + (res.actualizadas ? " · " + res.actualizadas + " ya estaban (se actualizaron)" : "")),
          React.createElement("button", { onClick: () => setRes(null), style: { border: "none", background: "none", cursor: "pointer", color: MUTED } }, "✕"),
        ),
        res.errores.map((e, i) => React.createElement("div", { key: i, style: { color: "#9A6700", marginTop: 3 } }, "⚠️ " + e)),
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
          maxHeight: "70vh",
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
            React.createElement("th", { style: { ...th, width: 30 } }, "Realizado"),
            VERO_COLUMNAS.map(([k, t]) => React.createElement("th", { key: k, style: k === "subtotal" ? { ...th, textAlign: "right" } : th }, t)),
            puede && React.createElement("th", { style: th }),
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
                { colSpan: VERO_COLUMNAS.length + 2, style: { ...td, textAlign: "center", color: MUTED, padding: 24 } },
                st.cargado ? (filtro === "pendientes" ? "No hay solicitudes pendientes. Cargá o arrastrá PDF acá." : "No hay solicitudes.") : "Cargando…",
              ),
            ),
          visibles.map((f) =>
            React.createElement(
              "tr",
              { key: f.id, style: { opacity: f.realizado ? 0.6 : 1 } },
              React.createElement(
                "td",
                { style: { ...td, textAlign: "center" } },
                React.createElement("input", { type: "checkbox", checked: !!f.realizado, disabled: !puede, onChange: (e) => marcar([f.id], e.target.checked) }),
              ),
              VERO_COLUMNAS.map(([k]) =>
                React.createElement(
                  "td",
                  { key: k, style: k === "subtotal" ? { ...td, textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" } : k === "numero" ? { ...td, whiteSpace: "nowrap" } : td, title: k === "descripcion" && f.cantidad ? "Cantidad: " + f.cantidad : k === "numero" ? f.archivo || "" : "" },
                  k === "subtotal" ? "$ " + (Number(f.subtotal) || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : f[k] || React.createElement("span", { style: { color: RED } }, "—"),
                ),
              ),
              puede &&
                React.createElement(
                  "td",
                  { style: td },
                  React.createElement("button", { onClick: () => borrar(f), style: { border: "none", background: "none", cursor: "pointer", color: RED }, title: "Borrar" }, React.createElement(Trash2, { size: 13 })),
                ),
            ),
          ),
          visibles.length > 0 &&
            React.createElement(
              "tr",
              { style: { background: BG, fontWeight: 700 } },
              React.createElement("td", { style: td, colSpan: VERO_COLUMNAS.length }, visibles.length + " solicitud(es)"),
              React.createElement("td", { style: { ...td, textAlign: "right", whiteSpace: "nowrap" } }, "$ " + total.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
              puede && React.createElement("td", { style: td }),
            ),
        ),
      ),
    ),
  );
}
