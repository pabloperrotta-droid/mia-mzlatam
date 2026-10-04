function EerrView({ eerrMensual: n, setEerrMensual: d, canEdit: c }) {
  const p = useMemo(() => anioInicioEjercicioDeFecha(/* @__PURE__ */ new Date()), []),
    g = useMemo(() => {
      const H = /* @__PURE__ */ new Set([p]);
      return (
        Object.keys(n || {}).forEach((Ee) => {
          const Nt = Ee.match(/^(\d{4})-(\d{2})$/);
          if (!Nt) return;
          const qt = Number(Nt[1]),
            po = Number(Nt[2]);
          H.add(po >= 7 ? qt : qt - 1);
        }),
        Array.from(H).sort((Ee, Nt) => Nt - Ee)
      );
    }, [n, p]),
    [C, S] = useState(p),
    f = useMemo(() => {
      const H = new Set(g);
      return (H.add(C), H.add(C - 1), Array.from(H).sort((Ee, Nt) => Nt - Ee));
    }, [g, C]);
  function F(H, Ee) {
    d((Nt) => ({ ...(Nt || {}), [H]: Ee }));
  }
  const A = (H) => H != null && H !== "" && H !== "-",
    k = C - 1,
    L = useMemo(() => clavesEjercicioFiscal(C), [C]),
    oe = useMemo(() => clavesEjercicioFiscal(k), [k]),
    ve = L.map((H, Ee) => ({
      clave: H,
      mes: MESES_FISCAL_CORTO[Ee],
      valor: (n || {})[H],
      claveAnterior: oe[Ee],
      valorAnterior: (n || {})[oe[Ee]],
    })),
    P = ve.some((H) => A(H.valor)),
    M = ve.some((H) => A(H.valorAnterior)),
    Pe = ve.reduce((H, Ee) => H + (Number(Ee.valor) || 0), 0),
    ye = ve.reduce((H, Ee) => H + (Number(Ee.valorAnterior) || 0), 0),
    Z = Pe - ye,
    Ye = M && ye !== 0 ? (Z / Math.abs(ye)) * 100 : null,
    ee = useMemo(() => clavesEjercicioFiscal(p), [p]);
  let lt = -1;
  ee.forEach((H, Ee) => {
    A((n || {})[H]) && (lt = Ee);
  });
  const ne = ee.reduce((H, Ee) => H + (Number((n || {})[Ee]) || 0), 0),
    Be = ve.map((H) => {
      const Ee = Number(H.valor) || 0;
      return { mes: H.mes, positivo: Ee > 0 ? Ee : null, negativo: Ee < 0 ? Ee : null };
    }),
    Le = ve.map((H) => ({
      mes: H.mes,
      actual: A(H.valor) ? Number(H.valor) || 0 : null,
      anterior: A(H.valorAnterior) ? Number(H.valorAnterior) || 0 : null,
    })),
    Lt = {
      textAlign: "left",
      padding: "8px 8px",
      fontSize: 10.5,
      fontWeight: 700,
      color: MUTED,
      letterSpacing: 0.3,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      borderBottom: "1px solid " + BORDER,
      background: BG,
    },
    nt = {
      width: 26,
      height: 26,
      borderRadius: 7,
      border: "1px solid " + BORDER,
      background: "#fff",
      color: NAVY,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      lineHeight: 1,
    };
  return React.createElement(
    "div",
    { style: { padding: "22px 28px" } },
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
          flexWrap: "wrap",
          gap: 10,
        },
      },
      React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { style: { fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: NAVY } },
          "EERR — Estado de Resultados",
        ),
        React.createElement(
          "div",
          { style: { fontSize: 11.5, color: MUTED, marginTop: 2 } },
          "Resultado mensual por ejercicio fiscal (1° de julio a 30 de junio). Comparado contra el ejercicio ",
          etiquetaEjercicioFiscal(k),
          ".",
        ),
      ),
      React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 6 } },
        React.createElement("span", { style: { fontSize: 11.5, color: MUTED, marginRight: 2 } }, "Ejercicio"),
        React.createElement(
          "button",
          {
            type: "button",
            title: "Ver ejercicio " + etiquetaEjercicioFiscal(C - 1),
            style: nt,
            onClick: () => S((H) => H - 1),
          },
          "◀",
        ),
        React.createElement(
          "select",
          { style: { ...inputStyle, width: 130 }, value: C, onChange: (H) => S(Number(H.target.value)) },
          f.map((H) => React.createElement("option", { key: H, value: H }, etiquetaEjercicioFiscal(H))),
        ),
        React.createElement(
          "button",
          {
            type: "button",
            title: "Ver ejercicio " + etiquetaEjercicioFiscal(C + 1),
            style: nt,
            onClick: () => S((H) => H + 1),
          },
          "▶",
        ),
      ),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 14, margin: "16px 0 20px", flexWrap: "wrap" } },
      React.createElement(SummaryCard, {
        label: "Total ejercicio " + etiquetaEjercicioFiscal(C),
        value: P ? fmt(Pe) : "—",
        color: P ? (Pe >= 0 ? GREEN : RED) : MUTED,
      }),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" } },
      React.createElement(
        "div",
        {
          style: {
            flex: "1 1 560px",
            minWidth: 460,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            overflow: "hidden",
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
              React.createElement("th", { style: Lt }, "Mes"),
              React.createElement("th", { style: { ...Lt, textAlign: "right" } }, etiquetaEjercicioFiscal(C)),
              React.createElement("th", { style: { ...Lt, textAlign: "right" } }, etiquetaEjercicioFiscal(k)),
              React.createElement("th", { style: { ...Lt, textAlign: "right" } }, "Variación"),
            ),
          ),
          React.createElement(
            "tbody",
            null,
            ve.map((H, Ee) => {
              const Nt = Number(H.valor) < 0,
                qt = Number(H.valorAnterior) < 0,
                po = (Number(H.valor) || 0) - (Number(H.valorAnterior) || 0),
                oo = A(H.valor) && A(H.valorAnterior);
              return React.createElement(
                "tr",
                { key: H.clave, style: { background: Ee % 2 === 1 ? ZEBRA : "#fff" } },
                React.createElement(
                  "td",
                  { style: { padding: "6px 8px", fontSize: 12.5, borderBottom: "1px solid " + BORDER } },
                  H.mes,
                ),
                React.createElement(
                  "td",
                  {
                    style: {
                      padding: c ? "3px 8px" : "6px 8px",
                      fontSize: 12.5,
                      textAlign: "right",
                      borderBottom: "1px solid " + BORDER,
                      color: Nt ? RED : "inherit",
                      fontWeight: Nt ? 700 : 400,
                    },
                  },
                  c
                    ? React.createElement(MilesInput, {
                        style: {
                          ...inputStyle,
                          width: "100%",
                          textAlign: "right",
                          color: Nt ? RED : TEXT,
                          fontWeight: Nt ? 700 : 400,
                        },
                        value: H.valor ?? "",
                        onChange: (Eo) => F(H.clave, Eo),
                        onFocus: (Eo) => Eo.target.select(),
                        placeholder: "—",
                      })
                    : A(H.valor)
                      ? fmt(Number(H.valor) || 0)
                      : React.createElement("span", { style: { color: "#CCCFD9" } }, "—"),
                ),
                React.createElement(
                  "td",
                  {
                    style: {
                      padding: "6px 8px",
                      fontSize: 12.5,
                      textAlign: "right",
                      borderBottom: "1px solid " + BORDER,
                      color: qt ? RED : MUTED,
                    },
                  },
                  A(H.valorAnterior)
                    ? fmt(Number(H.valorAnterior) || 0)
                    : React.createElement("span", { style: { color: "#CCCFD9" } }, "—"),
                ),
                React.createElement(
                  "td",
                  {
                    style: {
                      padding: "6px 8px",
                      fontSize: 12.5,
                      textAlign: "right",
                      borderBottom: "1px solid " + BORDER,
                      color: oo ? (po < 0 ? RED : GREEN) : "#CCCFD9",
                    },
                  },
                  oo ? fmt(po) : "—",
                ),
              );
            }),
            React.createElement(
              "tr",
              { style: { background: "#F1E9D2" } },
              React.createElement(
                "td",
                {
                  style: {
                    padding: "7px 8px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: NAVY,
                    borderTop: "2px solid " + NAVY,
                  },
                },
                "TOTAL",
              ),
              React.createElement(
                "td",
                {
                  style: {
                    padding: "7px 8px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    textAlign: "right",
                    color: Pe < 0 ? RED : NAVY,
                    borderTop: "2px solid " + NAVY,
                  },
                },
                P ? fmt(Pe) : "—",
              ),
              React.createElement(
                "td",
                {
                  style: {
                    padding: "7px 8px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    textAlign: "right",
                    color: M ? (ye < 0 ? RED : NAVY) : MUTED,
                    borderTop: "2px solid " + NAVY,
                  },
                },
                M ? fmt(ye) : "—",
              ),
              React.createElement(
                "td",
                {
                  style: {
                    padding: "7px 8px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    textAlign: "right",
                    color: !P || !M ? MUTED : Z < 0 ? RED : GREEN,
                    borderTop: "2px solid " + NAVY,
                  },
                },
                P && M ? fmt(Z) : "—",
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          style: {
            flex: "1 1 420px",
            minWidth: 320,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            padding: "16px 18px",
            height: 360,
            boxSizing: "border-box",
          },
        },
        React.createElement(
          "div",
          { style: { fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 10 } },
          "Resultado mensual — Ejercicio ",
          etiquetaEjercicioFiscal(C),
        ),
        React.createElement(
          "div",
          { style: { height: 300 } },
          React.createElement(
            ResponsiveContainer,
            null,
            React.createElement(
              BarChart,
              { data: Be, margin: { top: 10, right: 10, left: 0, bottom: 0 } },
              React.createElement(CartesianGrid, { vertical: false, stroke: BORDER }),
              React.createElement(XAxis, {
                dataKey: "mes",
                tick: { fontSize: 10.5, fill: MUTED },
                axisLine: false,
                tickLine: false,
              }),
              React.createElement(YAxis, {
                tick: { fontSize: 10.5, fill: MUTED },
                axisLine: false,
                tickLine: false,
                tickFormatter: (H) => (H / 1e6).toFixed(0) + "M",
              }),
              React.createElement(Tooltip, { formatter: (H) => fmt(H) }),
              React.createElement(Bar, { dataKey: "positivo", stackId: "r", fill: GREEN, radius: [3, 3, 0, 0] }),
              React.createElement(Bar, { dataKey: "negativo", stackId: "r", fill: RED, radius: [0, 0, 3, 3] }),
            ),
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          marginTop: 24,
          background: "#fff",
          borderRadius: 12,
          border: "1px solid " + BORDER,
          boxShadow: CARD_SHADOW,
          padding: "16px 18px",
          height: 320,
          boxSizing: "border-box",
        },
      },
      React.createElement(
        "div",
        { style: { fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 10 } },
        "Comparativo mes a mes — ",
        etiquetaEjercicioFiscal(C),
        " vs. ",
        etiquetaEjercicioFiscal(k),
      ),
      React.createElement(
        "div",
        { style: { height: 260 } },
        React.createElement(
          ResponsiveContainer,
          null,
          React.createElement(
            BarChart,
            { data: Le, margin: { top: 10, right: 10, left: 0, bottom: 0 } },
            React.createElement(CartesianGrid, { vertical: false, stroke: BORDER }),
            React.createElement(XAxis, {
              dataKey: "mes",
              tick: { fontSize: 10.5, fill: MUTED },
              axisLine: false,
              tickLine: false,
            }),
            React.createElement(YAxis, {
              tick: { fontSize: 10.5, fill: MUTED },
              axisLine: false,
              tickLine: false,
              tickFormatter: (H) => (H / 1e6).toFixed(0) + "M",
            }),
            React.createElement(Tooltip, { formatter: (H) => fmt(H) }),
            React.createElement(Legend, {
              wrapperStyle: { fontSize: 11 },
              formatter: (H) => etiquetaEjercicioFiscal(H === "actual" ? C : k),
            }),
            React.createElement(Bar, { dataKey: "actual", name: "actual", fill: NAVY, radius: [3, 3, 0, 0] }),
            React.createElement(Bar, { dataKey: "anterior", name: "anterior", fill: GOLD, radius: [3, 3, 0, 0] }),
          ),
        ),
      ),
    ),
    c &&
      React.createElement(
        "div",
        { style: { fontSize: 11, color: MUTED, marginTop: 14 } },
        "El resultado de cada mes se carga a mano (viene del sistema contable). Cuando cierre cada mes, cargalo acá para que quede reflejado en el ejercicio ",
        etiquetaEjercicioFiscal(p),
        ". Usá las flechas ◀ ▶ para moverte a ejercicios anteriores o posteriores, incluso si todavía no tienen datos cargados.",
      ),
  );
}
