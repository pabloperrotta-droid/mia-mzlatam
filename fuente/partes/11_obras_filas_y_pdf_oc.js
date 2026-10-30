function ProveedorRow({ p: n, index: d, onSave: c, onDelete: p, readOnly: g, soloEliminar: C, m2: S }) {
  const [f, F] = useState(false),
    [A, k] = useState(false),
    [L, oe] = useState(n),
    ve = S != null,
    P = ve ? "1.7fr 1fr 1fr 1fr 1fr 1fr 1.2fr 50px" : "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px",
    M = ve && S > 0 ? n.presupuesto / S : null;
  return f
    ? React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: P,
            columnGap: 10,
            fontSize: 12.5,
            padding: "6px 8px",
            background: "#F7EDD2",
            borderRadius: 4,
            gap: 4,
            alignItems: "center",
          },
        },
        React.createElement("input", {
          style: inputStyle,
          defaultValue: n.proveedor,
          onChange: (Pe) => oe((ye) => ({ ...ye, proveedor: Pe.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%", textAlign: "right" },
          type: "number",
          defaultValue: n.presupuestoOriginal,
          onChange: (Pe) => oe((ye) => ({ ...ye, presupuestoOriginal: Pe.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%", textAlign: "right" },
          type: "number",
          defaultValue: n.presupuesto,
          onChange: (Pe) => oe((ye) => ({ ...ye, presupuesto: Pe.target.value })),
        }),
        React.createElement("div", { style: { textAlign: "right", color: GREEN } }, fmt(n.pagado)),
        React.createElement(
          "div",
          { style: { textAlign: "right", color: n.resta > 0 ? RED : MUTED, fontWeight: 600 } },
          fmt(n.resta),
        ),
        ve && React.createElement("div", { style: { textAlign: "right", color: MUTED } }, M != null ? fmt(M) : "—"),
        React.createElement(
          "div",
          { style: { textAlign: "right", color: n.desvio > 0 ? RED : n.desvio < 0 ? GREEN : MUTED, fontWeight: 600 } },
          fmt(n.desvio),
          " (",
          n.desvioPct >= 0 ? "+" : "",
          n.desvioPct.toFixed(1),
          "%)",
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 4 } },
          React.createElement(
            "button",
            {
              onClick: () => {
                (c(L), F(false));
              },
              style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
            },
            "✓",
          ),
          React.createElement(
            "button",
            { onClick: () => F(false), style: { border: "none", background: "none", cursor: "pointer", color: RED } },
            "✕",
          ),
        ),
      )
    : React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: P,
            columnGap: 10,
            fontSize: 12.5,
            padding: "7px 8px",
            background: d % 2 === 0 ? "#fff" : "#F5F4F0",
            borderRadius: 4,
            alignItems: "center",
          },
        },
        React.createElement(
          "div",
          { style: { fontStyle: C ? "italic" : "normal", color: C ? MUTED : "inherit" } },
          n.proveedor,
          C ? " (estimado)" : "",
        ),
        React.createElement("div", { style: { textAlign: "right", color: MUTED } }, fmt(n.presupuestoOriginal, n.tc)),
        React.createElement("div", { style: { textAlign: "right" } }, fmt(n.presupuesto, n.tc)),
        React.createElement("div", { style: { textAlign: "right", color: GREEN } }, fmt(n.pagado)),
        React.createElement(
          "div",
          { style: { textAlign: "right", color: n.resta > 0 ? RED : MUTED, fontWeight: 600 } },
          fmt(n.resta),
        ),
        ve && React.createElement("div", { style: { textAlign: "right", color: MUTED } }, M != null ? fmt(M) : "—"),
        React.createElement(
          "div",
          { style: { textAlign: "right", color: n.desvio > 0 ? RED : n.desvio < 0 ? GREEN : MUTED, fontWeight: 600 } },
          fmt(n.desvio),
          " (",
          n.desvioPct >= 0 ? "+" : "",
          n.desvioPct.toFixed(1),
          "%)",
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 5, justifyContent: "center", alignItems: "center" } },
          g
            ? null
            : A
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: p,
                      style: {
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: RED,
                        fontWeight: 700,
                        fontSize: 13,
                      },
                    },
                    "✓",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => k(false),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 },
                    },
                    "✕",
                  ),
                )
              : React.createElement(
                  React.Fragment,
                  null,
                  !C &&
                    React.createElement(
                      "button",
                      {
                        onClick: () => F(true),
                        style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                      },
                      React.createElement(Pencil, { size: 12 }),
                    ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => k(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: RED },
                    },
                    React.createElement(Trash2, { size: 12 }),
                  ),
                ),
        ),
      );
}
function AdicionalRow({ a: n, onSave: d, onDelete: c, readOnly: p }) {
  const [g, C] = useState(false),
    [S, f] = useState(false),
    [F, A] = useState(n);
  return g
    ? React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr 50px",
            columnGap: 10,
            fontSize: 12.5,
            padding: "6px 8px",
            background: "#F7EDD2",
            gap: 4,
            alignItems: "center",
          },
        },
        React.createElement("input", {
          style: inputStyle,
          defaultValue: n.concepto,
          onChange: (k) => A((L) => ({ ...L, concepto: k.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%", textAlign: "right" },
          type: "number",
          defaultValue: n.monto,
          onChange: (k) => A((L) => ({ ...L, monto: k.target.value })),
        }),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 4 } },
          React.createElement(
            "button",
            {
              onClick: () => {
                (d(F), C(false));
              },
              style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
            },
            "✓",
          ),
          React.createElement(
            "button",
            { onClick: () => C(false), style: { border: "none", background: "none", cursor: "pointer", color: RED } },
            "✕",
          ),
        ),
      )
    : React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr 50px",
            columnGap: 10,
            fontSize: 12.5,
            padding: "6px 8px",
            alignItems: "center",
          },
        },
        React.createElement("div", null, n.concepto),
        React.createElement("div", { style: { textAlign: "right" } }, fmt(n.monto, n.tc)),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 5, justifyContent: "center", alignItems: "center" } },
          p
            ? null
            : S
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: c,
                      style: {
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: RED,
                        fontWeight: 700,
                        fontSize: 13,
                      },
                    },
                    "✓",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => f(false),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 },
                    },
                    "✕",
                  ),
                )
              : React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: () => C(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(Pencil, { size: 12 }),
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => f(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: RED },
                    },
                    React.createElement(Trash2, { size: 12 }),
                  ),
                ),
        ),
      );
}
function SubCostoNombre({ nombre: n, onSave: d, readOnly: c }) {
  const [p, g] = useState(false),
    [C, S] = useState(n);
  return p
    ? React.createElement(
        "div",
        { style: { display: "flex", gap: 6, alignItems: "center", flex: 1 } },
        React.createElement("input", { style: inputStyle, defaultValue: n, onChange: (f) => S(f.target.value) }),
        React.createElement(
          "button",
          {
            onClick: () => {
              (d(C), g(false));
            },
            style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
          },
          "✓",
        ),
        React.createElement(
          "button",
          { onClick: () => g(false), style: { border: "none", background: "none", cursor: "pointer", color: RED } },
          "✕",
        ),
      )
    : React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 8 } },
        React.createElement("span", { style: { fontWeight: 700, color: NAVY, fontSize: 13 } }, n),
        !c &&
          React.createElement(
            "button",
            { onClick: () => g(true), style: { border: "none", background: "none", cursor: "pointer", color: MUTED } },
            React.createElement(Pencil, { size: 12 }),
          ),
      );
}
function SubCostoVentaOC({ venta: n, ordenCompra: d, onSave: c, readOnly: p }) {
  const [g, C] = useState(false),
    [S, f] = useState({ venta: n, ordenCompra: d });
  return g
    ? React.createElement(
        "div",
        { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" } },
        React.createElement("input", {
          style: { ...inputStyle, width: 120 },
          type: "number",
          placeholder: "Venta",
          defaultValue: n || "",
          onChange: (F) => f((A) => ({ ...A, venta: F.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: 140 },
          placeholder: "Orden de compra",
          defaultValue: d || "",
          onChange: (F) => f((A) => ({ ...A, ordenCompra: F.target.value })),
        }),
        React.createElement(
          "button",
          {
            onClick: () => {
              (c(S), C(false));
            },
            style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
          },
          "✓",
        ),
        React.createElement(
          "button",
          { onClick: () => C(false), style: { border: "none", background: "none", cursor: "pointer", color: RED } },
          "✕",
        ),
      )
    : React.createElement(
        "span",
        { style: { display: "inline-flex", alignItems: "center", gap: 6 } },
        React.createElement(
          "span",
          null,
          "Venta: ",
          React.createElement("b", { style: { color: TEXT } }, fmt(n || 0)),
          d
            ? React.createElement(
                React.Fragment,
                null,
                " · OC: ",
                React.createElement("b", { style: { color: TEXT } }, d),
              )
            : null,
        ),
        !p &&
          React.createElement(
            "button",
            {
              onClick: () => C(true),
              style: { border: "none", background: "none", cursor: "pointer", color: MUTED, display: "inline-flex" },
            },
            React.createElement(Pencil, { size: 11 }),
          ),
      );
}
// ---------- PDF de las órdenes de compra (Sección 89) ----------
// Se guarda en la base, aparte del estado principal (colección `pdfsOC`, `qa_pdfsOC` en QA), partido en
// pedazos porque cada documento admite hasta ~1 MB. El estado principal no crece.
const OC_PDF_MAX = 8 * 1024 * 1024;
const OC_PDF_PARTE = 700000;
const OC_PDF_ST = { metas: {}, subs: new Set(), iniciado: false, pendientes: {} };
function ocPdfDb() {
  try {
    return typeof firebase < "u" && firebase.apps && firebase.apps.length ? scopedDb(firebase.firestore()) : null;
  } catch {
    return null;
  }
}
function ocPdfId(obraKey, oc) {
  return (String(obraKey || "") + "__" + normOC(oc)).replace(/[\/#?\[\]]/g, "_").slice(0, 600);
}
function ocPdfIniciar() {
  if (OC_PDF_ST.iniciado) return;
  const db = ocPdfDb();
  if (!db) {
    setTimeout(ocPdfIniciar, 2000);
    return;
  }
  OC_PDF_ST.iniciado = true;
  db.collection("pdfsOC").onSnapshot(
    (s) => {
      const m = {};
      s.docs.forEach((d) => (m[d.id] = d.data()));
      OC_PDF_ST.metas = m;
      OC_PDF_ST.subs.forEach((f) => f());
    },
    () => {},
  );
}
function useOcPdfs() {
  const [, f] = React.useState(0);
  React.useEffect(() => {
    ocPdfIniciar();
    const g = () => f((x) => x + 1);
    return OC_PDF_ST.subs.add(g), () => OC_PDF_ST.subs.delete(g);
  }, []);
  return OC_PDF_ST;
}
function ocPdfLeerBase64(file) {
  return new Promise((ok, mal) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(",")[1] || "");
    r.onerror = () => mal(new Error("No se pudo leer el PDF"));
    r.readAsDataURL(file);
  });
}
async function ocPdfGuardar(obraKey, oc, file) {
  if (!file || !oc) return;
  if (file.size > OC_PDF_MAX) throw new Error("El PDF pesa más de 8 MB.");
  const db = ocPdfDb();
  if (!db) throw new Error("Sin conexión con la base de datos");
  const b64 = await ocPdfLeerBase64(file),
    id = ocPdfId(obraKey, oc),
    ref = db.collection("pdfsOC").doc(id),
    partes = Math.max(1, Math.ceil(b64.length / OC_PDF_PARTE));
  for (let i = 0; i < partes; i++)
    await ref.collection("partes").doc(String(i)).set({ datos: b64.slice(i * OC_PDF_PARTE, (i + 1) * OC_PDF_PARTE) });
  let rol = "";
  try {
    rol = localStorage.getItem("obras-role") || "";
  } catch {}
  await ref.set({ obra: obraKey, oc: String(oc).trim(), nombre: file.name || "orden_de_compra.pdf", tamano: file.size, partes, subido: Date.now(), rol });
}
async function ocPdfBlob(id) {
  const db = ocPdfDb(),
    meta = OC_PDF_ST.metas[id];
  if (!db || !meta) throw new Error("No se encontró el PDF");
  const ref = db.collection("pdfsOC").doc(id);
  let b64 = "";
  for (let i = 0; i < meta.partes; i++) {
    const p = await ref.collection("partes").doc(String(i)).get();
    b64 += (p.exists && p.data().datos) || "";
  }
  const bin = atob(b64),
    bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: "application/pdf" });
}
function OcPdfCelda({ obraKey, oc, puedeEditar }) {
  const st = useOcPdfs(),
    ref = React.useRef(null),
    [ocupado, setOcupado] = React.useState(""),
    id = oc ? ocPdfId(obraKey, oc) : "",
    meta = id ? st.metas[id] : null,
    abrir = async (descargar) => {
      const w = descargar ? null : window.open("", "_blank");
      setOcupado(descargar ? "Bajando…" : "Abriendo…");
      try {
        const url = URL.createObjectURL(await ocPdfBlob(id));
        if (descargar) {
          const a = document.createElement("a");
          a.href = url;
          a.download = meta.nombre || "orden_de_compra_" + oc + ".pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else if (w) w.location.href = url;
        else window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } catch (e) {
        w && w.close();
        window.alert("No se pudo abrir el PDF: " + ((e && e.message) || e));
      }
      setOcupado("");
    },
    subir = async (ev) => {
      const f = ev.target.files && ev.target.files[0];
      ev.target.value = "";
      if (!f) return;
      setOcupado("Subiendo…");
      try {
        await ocPdfGuardar(obraKey, oc, f);
      } catch (e) {
        window.alert("No se pudo guardar el PDF: " + ((e && e.message) || e));
      }
      setOcupado("");
    },
    btn = { border: "none", background: "none", cursor: "pointer", color: NAVY, fontSize: 11, fontWeight: 700, padding: 0 };
  if (!oc) return React.createElement("div", null);
  if (ocupado) return React.createElement("div", { style: { fontSize: 11, color: MUTED } }, ocupado);
  return React.createElement(
    "div",
    { style: { display: "flex", gap: 8, alignItems: "center", fontSize: 11 } },
    meta &&
      React.createElement(
        "button",
        { onClick: () => abrir(false), style: btn, title: "Ver el PDF de la orden de compra (" + meta.nombre + ")" },
        "👁 Ver",
      ),
    meta &&
      React.createElement("button", { onClick: () => abrir(true), style: btn, title: "Descargar " + meta.nombre }, "⬇"),
    puedeEditar &&
      React.createElement("input", { ref, type: "file", accept: "application/pdf", style: { display: "none" }, onChange: subir }),
    puedeEditar &&
      React.createElement(
        "button",
        {
          onClick: () => ref.current && ref.current.click(),
          style: { ...btn, color: MUTED, fontWeight: 400 },
          title: meta ? "Reemplazar el PDF" : "Adjuntar el PDF de esta orden de compra",
        },
        meta ? "↻" : "+ PDF",
      ),
    !meta && !puedeEditar && React.createElement("span", { style: { color: MUTED } }, "—"),
  );
}
function SubobraRow({
  s: n,
  onSave: d,
  onDelete: c,
  readOnly: p,
  saldoAFacturar: g,
  mbPromedio: C,
  tieneLigadas: S,
  ligadasCount: f,
  onVerSubObras: F,
  adicional: adic,
  esAdicionalNuevo: esNuevo,
  obraKey: obraKeyOC,
}) {
  const esMZ = /^MZ/.test(normOC(n.ordenCompra)),
    [A, k] = useState(false),
    [L, oe] = useState(false),
    [ve, P] = useState(n);
  return A
    ? React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 50px",
            columnGap: 10,
            fontSize: 12.5,
            padding: "6px 8px",
            background: "#F7EDD2",
            gap: 4,
            alignItems: "center",
          },
        },
        React.createElement("input", {
          style: inputStyle,
          defaultValue: n.ordenCompra,
          onChange: (M) => P((Pe) => ({ ...Pe, ordenCompra: M.target.value })),
        }),
        esMZ
          ? React.createElement(
              "div",
              {
                style: { textAlign: "right", color: MUTED, fontSize: 11.5 },
                title: "Las órdenes de compra que empiezan con MZ suman sola la venta de sus sub obras",
              },
              fmt(n.venta),
              " (suma)",
            )
          : React.createElement("input", {
              style: { ...inputStyle, width: "100%", textAlign: "right" },
              type: "number",
              defaultValue: n.venta,
              onChange: (M) => P((Pe) => ({ ...Pe, venta: M.target.value })),
            }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          defaultValue: n.fecha,
          onChange: (M) => P((Pe) => ({ ...Pe, fecha: M.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          defaultValue: n.observaciones || "",
          onChange: (M) => P((Pe) => ({ ...Pe, observaciones: M.target.value })),
        }),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 4 } },
          React.createElement(
            "button",
            {
              onClick: () => {
                (d(ve), k(false));
              },
              style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
            },
            "✓",
          ),
          React.createElement(
            "button",
            { onClick: () => k(false), style: { border: "none", background: "none", cursor: "pointer", color: RED } },
            "✕",
          ),
        ),
      )
    : React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1fr 0.8fr 0.9fr 1.1fr 0.9fr 0.8fr 1.3fr 50px",
            columnGap: 10,
            fontSize: 12.5,
            padding: "6px 8px",
            alignItems: "center",
          },
        },
        React.createElement(
          "div",
          {
            title: esNuevo
              ? "Orden de compra nueva, cargada como adicional de sub obra"
              : fechaEsValida(n.fecha)
                ? ""
                : "Fecha no reconocida: se atribuye al mes de la obra, no al mes que corresponde",
          },
          n.ordenCompra || "—",
          !esNuevo &&
            !fechaEsValida(n.fecha) &&
            React.createElement("span", { style: { color: RED, fontWeight: 700 } }, " ⚠"),
        ),
        React.createElement("div", { style: { color: MUTED } }, n.fecha || "—"),
        React.createElement(
          "div",
          {
            style: { textAlign: "right" },
            title: esMZ
              ? "Suma de la venta de las sub obras que tienen la orden de compra " + n.ordenCompra + ": si agregás una sub obra con esta OC se suma, si la quitás se resta."
              : adic
              ? esNuevo
                ? "Adicional cargado en la sub obra " + adic.subObras.join(", ") + ". Suma solo venta: sin costo ni margen."
                : "Orden de compra " + fmt(n.venta, n.tc) + " + adicional " + fmt(adic.monto) + " cargado en la sub obra " + adic.subObras.join(", ")
              : "",
          },
          esNuevo ? fmt(adic.monto) : fmt((Number(n.venta) || 0) + (adic ? adic.monto : 0), adic ? void 0 : n.tc),
          adic &&
            !esNuevo &&
            React.createElement(
              "div",
              { style: { fontSize: 10.5, color: GOLD, fontWeight: 600 } },
              "incl. adicional ",
              fmt(adic.monto),
            ),
        ),
        React.createElement(
          "div",
          { style: { textAlign: "right", color: g > 0 ? RED : g < 0 ? GOLD : MUTED, fontWeight: 600 } },
          fmt(g),
        ),
        React.createElement(
          "div",
          { style: { textAlign: "right", color: S ? (C < 0 ? RED : GREEN) : MUTED, fontWeight: 600 } },
          S ? pctMk(C) : "—",
        ),
        esNuevo
          ? React.createElement("div", null)
          : React.createElement(OcPdfCelda, { obraKey: obraKeyOC, oc: (n.ordenCompra || "").trim(), puedeEditar: !p }),
        esNuevo
          ? React.createElement(
              "div",
              { style: { fontSize: 11, color: GOLD, fontWeight: 700 } },
              "Adicional de ",
              adic.subObras.join(", "),
            )
          : React.createElement(
          "div",
          {
            onClick: F,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              fontSize: 11,
              color: NAVY,
              fontWeight: 700,
            },
          },
          React.createElement("span", { style: { fontSize: 9 } }, "▶"),
          " ",
          f > 0 ? "Ver sub obras (" + f + ")" : "Ver sub obras",
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 5, justifyContent: "center", alignItems: "center" } },
          p
            ? null
            : L
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: c,
                      style: {
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: RED,
                        fontWeight: 700,
                        fontSize: 13,
                      },
                    },
                    "✓",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => oe(false),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 },
                    },
                    "✕",
                  ),
                )
              : React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: () => k(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(Pencil, { size: 12 }),
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => oe(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: RED },
                    },
                    React.createElement(Trash2, { size: 12 }),
                  ),
                ),
        ),
      );
}
function PagoRow({ p: n, onSave: d, onDelete: c, readOnly: p }) {
  const [g, C] = useState(false),
    [S, f] = useState(false),
    [F, A] = useState(n);
  return g
    ? React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px",
            columnGap: 10,
            fontSize: 12,
            padding: "5px 8px",
            background: "#F7EDD2",
            gap: 4,
            alignItems: "center",
          },
        },
        React.createElement("input", {
          style: inputStyle,
          defaultValue: n.proveedor,
          onChange: (k) => A((L) => ({ ...L, proveedor: k.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%", textAlign: "right" },
          type: "number",
          defaultValue: n.monto,
          onChange: (k) => A((L) => ({ ...L, monto: k.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%", textAlign: "right" },
          defaultValue: n.fecha,
          onChange: (k) => A((L) => ({ ...L, fecha: k.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%", textAlign: "right" },
          defaultValue: n.fc,
          onChange: (k) => A((L) => ({ ...L, fc: k.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          defaultValue: n.observaciones || "",
          onChange: (k) => A((L) => ({ ...L, observaciones: k.target.value })),
        }),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 4 } },
          React.createElement(
            "button",
            {
              onClick: () => {
                (d(F), C(false));
              },
              style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
            },
            "✓",
          ),
          React.createElement(
            "button",
            { onClick: () => C(false), style: { border: "none", background: "none", cursor: "pointer", color: RED } },
            "✕",
          ),
        ),
      )
    : React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px",
            columnGap: 10,
            fontSize: 12,
            padding: "5px 8px",
            alignItems: "center",
          },
        },
        React.createElement("div", null, n.proveedor),
        React.createElement("div", { style: { textAlign: "right" } }, fmt(n.monto, n.tc)),
        React.createElement("div", { style: { textAlign: "right", color: MUTED } }, n.fecha),
        React.createElement("div", { style: { textAlign: "right", color: MUTED } }, n.fc),
        React.createElement(
          "div",
          {
            style: { color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
            title: n.observaciones || "",
          },
          n.observaciones || "—",
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 5, justifyContent: "center", alignItems: "center" } },
          p
            ? null
            : S
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: c,
                      style: {
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: RED,
                        fontWeight: 700,
                        fontSize: 13,
                      },
                    },
                    "✓",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => f(false),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 },
                    },
                    "✕",
                  ),
                )
              : React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: () => C(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(Pencil, { size: 12 }),
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => f(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: RED },
                    },
                    React.createElement(Trash2, { size: 12 }),
                  ),
                ),
        ),
      );
}
function FacturaRow({ f: n, onSave: d, onDelete: c, onView: p, readOnly: g, mostrarOC: C, ocListId: S }) {
  const [f, F] = useState(false),
    [A, k] = useState(false),
    [L, oe] = useState(n),
    ve = C
      ? "1.5fr 0.7fr 0.8fr 1fr 1fr 0.9fr 1.1fr 0.9fr 0.7fr 50px"
      : "1.8fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.7fr 50px";
  return f
    ? React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: ve,
            columnGap: 10,
            padding: "8px 16px",
            fontSize: 12,
            alignItems: "center",
            background: "#F7EDD2",
            gap: 4,
          },
        },
        React.createElement("input", {
          style: inputStyle,
          defaultValue: n.concepto || "",
          onChange: (P) => oe((M) => ({ ...M, concepto: P.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          defaultValue: n.tipo || "",
          onChange: (P) => oe((M) => ({ ...M, tipo: P.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          defaultValue: n.nro || "",
          onChange: (P) => oe((M) => ({ ...M, nro: P.target.value })),
        }),
        C &&
          React.createElement("input", {
            style: { ...inputStyle, width: "100%" },
            list: S,
            defaultValue: n.ordenCompra || "",
            onChange: (P) => oe((M) => ({ ...M, ordenCompra: P.target.value })),
          }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          value: L.fecha || "",
          onChange: (P) => oe((M) => ({ ...M, fecha: P.target.value })),
          onBlur: (P) => oe((M) => ({ ...M, fecha: normalizarFecha(P.target.value) })),
        }),
        React.createElement(
          "select",
          {
            style: { ...selectStyle, width: "100%" },
            defaultValue: n.status,
            onChange: (P) => oe((M) => ({ ...M, status: P.target.value })),
          },
          React.createElement("option", { value: "ADEUDA" }, "Adeuda"),
          React.createElement("option", { value: "PAGADA" }, "Pagada"),
        ),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%", textAlign: "right" },
          type: "number",
          defaultValue: n.importe,
          onChange: (P) => oe((M) => ({ ...M, importe: P.target.value })),
        }),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          defaultValue: n.fechaPago || "",
          onChange: (P) => oe((M) => ({ ...M, fechaPago: P.target.value })),
        }),
        L.pdfName
          ? React.createElement(
              "button",
              {
                onClick: () => oe((P) => ({ ...P, pdfData: null, pdfName: null })),
                title: "Quitar PDF adjunto",
                style: {
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: RED,
                  display: "flex",
                  justifyContent: "center",
                },
              },
              React.createElement(Trash2, { size: 13 }),
            )
          : React.createElement(
              "label",
              { style: { cursor: "pointer", color: MUTED, display: "flex", justifyContent: "center" } },
              React.createElement(Paperclip, { size: 13 }),
              React.createElement("input", {
                type: "file",
                accept: "application/pdf",
                style: { display: "none" },
                onChange: (P) => {
                  const M = P.target.files[0];
                  if (!M) return;
                  if (M.size > PDF_MAX_BYTES) {
                    alert(
                      "El PDF pesa demasiado (máx. 180 KB). Comprimilo o subilo a Drive y pegá el link en el concepto.",
                    );
                    return;
                  }
                  const Pe = new FileReader();
                  ((Pe.onload = (ye) => oe((Z) => ({ ...Z, pdfData: ye.target.result, pdfName: M.name }))),
                    Pe.readAsDataURL(M));
                },
              }),
            ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 4 } },
          React.createElement(
            "button",
            {
              onClick: () => {
                (d(L), F(false));
              },
              style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
            },
            "✓",
          ),
          React.createElement(
            "button",
            { onClick: () => F(false), style: { border: "none", background: "none", cursor: "pointer", color: RED } },
            "✕",
          ),
        ),
      )
    : React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: ve,
            columnGap: 10,
            padding: "9px 16px",
            fontSize: 12.5,
            alignItems: "center",
          },
        },
        React.createElement(
          "div",
          { style: { color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
          n.concepto || "—",
        ),
        React.createElement("div", null, n.tipo || "—"),
        React.createElement("div", null, n.nro || "—"),
        C &&
          React.createElement(
            "div",
            { style: { color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
            n.ordenCompra || "—",
          ),
        React.createElement("div", null, normalizarFecha(n.fecha)),
        React.createElement(
          "div",
          null,
          React.createElement(StatusBadge, { status: n.status === "PAGADA" ? "FINALIZADA" : "EN PROCESO" }),
        ),
        React.createElement(
          "div",
          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
          fmt(n.importe, n.tc),
        ),
        React.createElement("div", { style: { color: MUTED } }, n.fechaPago ? normalizarFecha(n.fechaPago) : "—"),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 4, justifyContent: "center" } },
          n.pdfData
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  "button",
                  {
                    onClick: p,
                    title: "Ver PDF",
                    style: { border: "none", background: "none", cursor: "pointer", color: NAVY },
                  },
                  React.createElement(Eye, { size: 13 }),
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => ofrecerDescarga(n.pdfName || "factura.pdf", dataUrlToBlob(n.pdfData)),
                    title: "Descargar",
                    style: { border: "none", background: "none", cursor: "pointer", color: MUTED, display: "flex" },
                  },
                  React.createElement(Download, { size: 13 }),
                ),
              )
            : React.createElement("span", { style: { color: "#CCCFD9", fontSize: 11 } }, "—"),
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 5, justifyContent: "center", alignItems: "center" } },
          g
            ? null
            : A
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: c,
                      style: {
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: RED,
                        fontWeight: 700,
                        fontSize: 13,
                      },
                    },
                    "✓",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => k(false),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 },
                    },
                    "✕",
                  ),
                )
              : React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "button",
                    {
                      onClick: () => F(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(Pencil, { size: 12 }),
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => k(true),
                      style: { border: "none", background: "none", cursor: "pointer", color: RED },
                    },
                    React.createElement(Trash2, { size: 12 }),
                  ),
                ),
        ),
      );
}
function SortHeader({ label: n, tableId: d, sortKey: c, sortState: p, onSort: g, align: C }) {
  const S = p[d]?.key === c,
    f = S ? p[d].dir : null;
  return React.createElement(
    "div",
    {
      onClick: () => g(d, c),
      style: {
        cursor: "pointer",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        gap: 3,
        justifyContent: C === "right" ? "flex-end" : "flex-start",
        color: S ? NAVY : MUTED,
        letterSpacing: 0.3,
      },
    },
    n,
    " ",
    React.createElement("span", { style: { fontSize: 9, opacity: S ? 1 : 0.35 } }, f === "desc" ? "▼" : "▲"),
  );
}
function MiniStat({ label: n, value: d, color: c }) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      {
        style: {
          fontSize: 10,
          fontWeight: 700,
          color: MUTED,
          marginBottom: 4,
          letterSpacing: 0.4,
          textTransform: "uppercase",
        },
      },
      n,
    ),
    React.createElement(
      "div",
      { style: { fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: c || NAVY } },
      d,
    ),
  );
}
