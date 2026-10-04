const OPERACIONES_UMBRAL_SOBRECARGA = 4;
function armarDragObra(n, d) {
  return JSON.stringify({ cliente: n.cliente, obra: n.obra, campo: d });
}
function leerDragObra(n) {
  try {
    const d = n.dataTransfer.getData("application/json") || n.dataTransfer.getData("text/plain");
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
}
function autoScrollEnArrastre(n) {
  const c = n.clientY,
    p = window.innerHeight;
  c < 90
    ? window.scrollBy(0, -Math.ceil((90 - c) / 4))
    : c > p - 90 && window.scrollBy(0, Math.ceil((90 - (p - c)) / 4));
}
function OperacionesResumenPersona({
  titulo: n,
  personas: d,
  campo: c,
  onGoToObra: p,
  onReasignar: g,
  onQuitarAsignacion: C,
  canEdit: S,
}) {
  const [f, F] = useState(null),
    A = c === "pm" ? "PM" : "DDO",
    k = (L, oe) =>
      React.createElement(
        "div",
        {
          key: L.cliente + "|" + L.obra,
          draggable: !!S,
          onDragStart: S
            ? (ve) => {
                ((ve.dataTransfer.effectAllowed = "move"),
                  ve.dataTransfer.setData("application/json", armarDragObra(L, c)));
              }
            : void 0,
          onClick: p ? () => p(L.cliente, L.obra) : void 0,
          style: {
            fontSize: 12,
            color: oe ? MUTED : NAVY,
            padding: "1px 0",
            cursor: S ? "grab" : p ? "pointer" : "default",
            textDecoration: !oe && p ? "underline" : "none",
            textDecorationColor: BORDER,
            display: "flex",
            alignItems: "center",
            gap: 5,
          },
          title:
            (S ? "Arrastrá para reasignar" + (p ? " · " : "") : "") + (p ? "Click para ir al centro de costo" : ""),
        },
        S && React.createElement("span", { style: { color: BORDER, fontSize: 11 } }, "⠿"),
        React.createElement("span", { style: { flex: 1 } }, L.cliente, " · ", L.obra),
        S &&
          C &&
          React.createElement(
            "span",
            {
              onClick: (ve) => {
                (ve.stopPropagation(), C(L.cliente, L.obra, c));
              },
              title: "Sacarle el " + A + " a esta obra (pasa a Sin asignar)",
              style: { fontSize: 10.5, color: MUTED, cursor: "pointer", padding: "0 3px", flexShrink: 0 },
              onMouseEnter: (ve) => {
                ve.currentTarget.style.color = RED;
              },
              onMouseLeave: (ve) => {
                ve.currentTarget.style.color = MUTED;
              },
            },
            "✕",
          ),
      );
  return React.createElement(
    "div",
    {
      style: {
        background: "#fff",
        borderRadius: 12,
        border: "1px solid " + BORDER,
        boxShadow: CARD_SHADOW,
        padding: "18px 20px",
        marginBottom: 16,
      },
    },
    React.createElement(
      "div",
      { style: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12, fontFamily: "Georgia, serif" } },
      n,
    ),
    d.length === 0
      ? React.createElement("div", { style: { fontSize: 12.5, color: MUTED } }, "Todavía no hay nadie cargado.")
      : React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 } },
          d.map((L) => {
            const oe = L.enProceso.length >= OPERACIONES_UMBRAL_SOBRECARGA,
              ve = f === L.nombre;
            return React.createElement(
              "div",
              {
                key: L.nombre,
                onDragOver:
                  S && g
                    ? (P) => {
                        (P.preventDefault(), (P.dataTransfer.dropEffect = "move"), f !== L.nombre && F(L.nombre));
                      }
                    : void 0,
                onDragLeave: S && g ? () => F((P) => (P === L.nombre ? null : P)) : void 0,
                onDrop:
                  S && g
                    ? (P) => {
                        (P.preventDefault(), F(null));
                        const M = leerDragObra(P);
                        M && M.campo === c && g(M.cliente, M.obra, c, L.nombre);
                      }
                    : void 0,
                style: {
                  border: "1px solid " + (ve ? GOLD : oe ? "#EAC7BE" : BORDER),
                  background: ve ? "#FFF8E6" : oe ? "#FBF3F1" : BG,
                  borderRadius: 10,
                  padding: "12px 14px",
                  boxShadow: ve ? "0 0 0 2px " + GOLD + " inset" : "none",
                  transition: "background 0.1s, border-color 0.1s",
                },
              },
              React.createElement(
                "div",
                { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
                React.createElement("div", { style: { fontWeight: 700, color: NAVY, fontSize: 13.5 } }, L.nombre),
                oe &&
                  React.createElement(
                    "div",
                    {
                      title: "Tiene " + L.enProceso.length + " obras en proceso a la vez",
                      style: {
                        fontSize: 10,
                        fontWeight: 700,
                        color: RED,
                        background: "#F7E6E3",
                        border: "1px solid #EAC7BE",
                        borderRadius: 20,
                        padding: "2px 8px",
                      },
                    },
                    "⚠ SOBRECARGADO",
                  ),
              ),
              React.createElement(
                "div",
                { style: { display: "flex", gap: 14, marginBottom: 8 } },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    { style: { fontSize: 9.5, fontWeight: 700, color: MUTED, letterSpacing: 0.3 } },
                    "EN PROCESO",
                  ),
                  React.createElement(
                    "div",
                    { style: { fontSize: 18, fontWeight: 700, color: oe ? RED : NAVY, fontFamily: "Georgia, serif" } },
                    L.enProceso.length,
                  ),
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    { style: { fontSize: 9.5, fontWeight: 700, color: MUTED, letterSpacing: 0.3 } },
                    "FINALIZADAS",
                  ),
                  React.createElement(
                    "div",
                    { style: { fontSize: 18, fontWeight: 700, color: GREEN, fontFamily: "Georgia, serif" } },
                    L.finalizadas.length,
                  ),
                ),
              ),
              L.enProceso.length > 0 &&
                React.createElement(
                  "div",
                  { style: { marginBottom: L.finalizadas.length > 0 ? 8 : 0 } },
                  React.createElement(
                    "div",
                    { style: { fontSize: 10, fontWeight: 700, color: MUTED, marginBottom: 3 } },
                    "Trabajando ahora:",
                  ),
                  L.enProceso.map((P) => k(P, false)),
                ),
              L.finalizadas.length > 0 &&
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    { style: { fontSize: 10, fontWeight: 700, color: MUTED, marginBottom: 3 } },
                    "Finalizadas:",
                  ),
                  L.finalizadas.map((P) => k(P, true)),
                ),
              L.enProceso.length === 0 &&
                L.finalizadas.length === 0 &&
                React.createElement(
                  "div",
                  { style: { fontSize: 11, color: MUTED, fontStyle: "italic" } },
                  "Soltá acá una obra para asignarla",
                ),
            );
          }),
        ),
  );
}
function OperacionesView({
  obras: n,
  onGoToObra: d,
  onReasignar: c,
  onQuitarAsignacion: p,
  onAsignar: g,
  pmCatalogo: C,
  ddoCatalogo: S,
  canEdit: f,
}) {
  const [F, A] = useState(null),
    [k, L] = useState(null),
    oe = (ye) => {
      const Z = {};
      return (
        n.forEach((Ye) => {
          const ee = (Ye[ye] || "").trim();
          ee &&
            (Z[ee] || (Z[ee] = { nombre: ee, enProceso: [], finalizadas: [] }),
            Ye.status === "FINALIZADA" ? Z[ee].finalizadas.push(Ye) : Z[ee].enProceso.push(Ye));
        }),
        Object.values(Z).sort(
          (Ye, ee) => ee.enProceso.length - Ye.enProceso.length || Ye.nombre.localeCompare(ee.nombre),
        )
      );
    },
    ve = useMemo(() => oe("pm"), [n]),
    P = useMemo(() => oe("ddo"), [n]),
    M = useMemo(() => n.filter((ye) => ye.status !== "FINALIZADA" && !(ye.pm || "").trim()), [n]),
    Pe = useMemo(() => n.filter((ye) => ye.status !== "FINALIZADA" && !(ye.ddo || "").trim()), [n]);
  return (
    useEffect(() => {
      if (f && c)
        return (
          document.addEventListener("dragover", autoScrollEnArrastre),
          () => document.removeEventListener("dragover", autoScrollEnArrastre)
        );
    }, [f, c]),
    React.createElement(
      "div",
      { style: { padding: "22px 28px" } },
      React.createElement(
        "div",
        { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 4 } },
        "Operaciones",
      ),
      React.createElement(
        "div",
        { style: { fontSize: 12.5, color: MUTED, marginBottom: 18 } },
        "Qué obra tiene cada PM y cada DDO, cuáles están en proceso y cuáles finalizadas, para ver quién está trabajando en qué y detectar sobrecarga (4 o más obras en proceso a la vez).",
        f &&
          c &&
          " Arrastrá una obra de una persona a otra para reasignarla (o a “Sin asignar” para sacarle el PM o el DDO), o tocá la ✕ junto a una obra para sacarle directamente esa asignación.",
      ),
      React.createElement(OperacionesResumenPersona, {
        titulo: "Por PM",
        personas: ve,
        campo: "pm",
        onGoToObra: d,
        onReasignar: c,
        onQuitarAsignacion: p,
        canEdit: f,
      }),
      React.createElement(OperacionesResumenPersona, {
        titulo: "Por DDO",
        personas: P,
        campo: "ddo",
        onGoToObra: d,
        onReasignar: c,
        onQuitarAsignacion: p,
        canEdit: f,
      }),
      (M.length > 0 || Pe.length > 0) &&
        React.createElement(
          "div",
          {
            style: {
              background: "#fff",
              borderRadius: 12,
              border: "1px solid " + BORDER,
              boxShadow: CARD_SHADOW,
              padding: "18px 20px",
            },
          },
          React.createElement(
            "div",
            { style: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10, fontFamily: "Georgia, serif" } },
            "Obras en proceso sin asignar",
          ),
          React.createElement(
            "div",
            { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 } },
            [
              ["pm", "SIN PM", M],
              ["ddo", "SIN DDO", Pe],
            ].map(([ye, Z, Ye]) =>
              React.createElement(
                "div",
                {
                  key: ye,
                  onDragOver:
                    f && c
                      ? (ee) => {
                          (ee.preventDefault(), (ee.dataTransfer.dropEffect = "move"), F !== ye && A(ye));
                        }
                      : void 0,
                  onDragLeave: f && c ? () => A((ee) => (ee === ye ? null : ee)) : void 0,
                  onDrop:
                    f && c
                      ? (ee) => {
                          (ee.preventDefault(), A(null));
                          const lt = leerDragObra(ee);
                          lt && lt.campo === ye && c(lt.cliente, lt.obra, ye, "");
                        }
                      : void 0,
                  style: {
                    borderRadius: 8,
                    padding: 8,
                    border: "1px dashed " + (F === ye ? GOLD : "transparent"),
                    background: F === ye ? "#FFF8E6" : "transparent",
                  },
                },
                React.createElement(
                  "div",
                  { style: { fontSize: 10.5, fontWeight: 700, color: MUTED, marginBottom: 6 } },
                  Z,
                  " (",
                  Ye.length,
                  ")",
                ),
                Ye.length === 0
                  ? React.createElement("div", { style: { fontSize: 12, color: MUTED } }, "—")
                  : Ye.map((ee) => {
                      const lt = ye + "|" + ee.cliente + "|" + ee.obra;
                      return React.createElement(
                        "div",
                        { key: lt, style: { padding: "2px 0" } },
                        k === lt
                          ? React.createElement(
                              "div",
                              { style: { display: "flex", alignItems: "center", gap: 5 } },
                              React.createElement(
                                "div",
                                { style: { flex: 1, minWidth: 0 } },
                                React.createElement(CascadingSelect, {
                                  value: "",
                                  options: ye === "pm" ? C : S,
                                  disabled: false,
                                  emptyLabel: "Elegí un " + (ye === "pm" ? "PM" : "DDO"),
                                  newLabel: "+ Agregar nuevo " + (ye === "pm" ? "PM" : "DDO"),
                                  style: {
                                    ...inputStyle,
                                    width: "100%",
                                    boxSizing: "border-box",
                                    fontSize: 12,
                                    padding: "3px 6px",
                                  },
                                  onCommit: (Be, Le, Lt) => {
                                    (g(ee.cliente, ee.obra, ye, Be.trim().toUpperCase(), Lt), L(null));
                                  },
                                }),
                              ),
                              React.createElement(
                                "span",
                                {
                                  onClick: () => L(null),
                                  title: "Cancelar",
                                  style: {
                                    fontSize: 11,
                                    color: MUTED,
                                    cursor: "pointer",
                                    padding: "0 3px",
                                    flexShrink: 0,
                                  },
                                  onMouseEnter: (Be) => {
                                    Be.currentTarget.style.color = RED;
                                  },
                                  onMouseLeave: (Be) => {
                                    Be.currentTarget.style.color = MUTED;
                                  },
                                },
                                "✕",
                              ),
                            )
                          : React.createElement(
                              "div",
                              {
                                draggable: !!f,
                                onDragStart: f
                                  ? (Be) => {
                                      ((Be.dataTransfer.effectAllowed = "move"),
                                        Be.dataTransfer.setData("application/json", armarDragObra(ee, ye)));
                                    }
                                  : void 0,
                                style: {
                                  fontSize: 12,
                                  color: NAVY,
                                  cursor: f ? "grab" : d ? "pointer" : "default",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                },
                              },
                              f && React.createElement("span", { style: { color: BORDER, fontSize: 11 } }, "⠿"),
                              React.createElement(
                                "span",
                                { style: { flex: 1 }, onClick: d ? () => d(ee.cliente, ee.obra) : void 0 },
                                ee.cliente,
                                " · ",
                                ee.obra,
                              ),
                              f &&
                                g &&
                                React.createElement(
                                  "span",
                                  {
                                    onClick: (Be) => {
                                      (Be.stopPropagation(), L(lt));
                                    },
                                    title: "Asignar " + (ye === "pm" ? "PM" : "DDO"),
                                    style: {
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: NAVY,
                                      cursor: "pointer",
                                      flexShrink: 0,
                                      width: 16,
                                      height: 16,
                                      borderRadius: "50%",
                                      border: "1px solid " + BORDER,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      lineHeight: 1,
                                    },
                                    onMouseEnter: (Be) => {
                                      ((Be.currentTarget.style.background = GOLD),
                                        (Be.currentTarget.style.borderColor = GOLD));
                                    },
                                    onMouseLeave: (Be) => {
                                      ((Be.currentTarget.style.background = "transparent"),
                                        (Be.currentTarget.style.borderColor = BORDER));
                                    },
                                  },
                                  "+",
                                ),
                            ),
                      );
                    }),
              ),
            ),
          ),
        ),
    )
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
