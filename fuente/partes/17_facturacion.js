// Sección 148: gráfico de barras por mes (como "Venta por mes" de Obras): en Facturación con las facturas
// (por fecha de factura) y en Pagos con lo pagado (por Fecha Pagado). items: [{ fecha, importe, tc }].
// Se eligen los años a comparar; arriba, el acumulado del año contra el anterior en los mismos meses.
function importePorMes(items) {
  const r = {};
  for (const f of items || []) {
    const fe = normalizarFecha(f.fecha),
      a = anioDeFecha(fe),
      m = mesIdxDeFecha(fe);
    if (a == null || m == null || m < 0 || m > 11) continue;
    const k = a + "|" + m;
    r[k] = r[k] || { ars: 0, usd: 0 };
    r[k].ars += Number(f.importe) || 0;
    r[k].usd += aUsd(f.importe, f.tc) || 0;
  }
  return r;
}
// Sección 149: ¿la fecha cae en ese mes y año? (para filtrar la tabla al tocar una barra del gráfico)
function fechaEnMes(fecha, mes) {
  if (!mes) return true;
  const fe = normalizarFecha(fecha);
  return anioDeFecha(fe) === mes.anio && mesIdxDeFecha(fe) === mes.mesIdx;
}
function GraficoPorMes({ titulo, items, verbo, plegable, mesElegido, onElegirMes }) {
  const mes3 = (i) => MESES[i].charAt(0) + MESES[i].slice(1, 3).toLowerCase(),
    porMes = useMemo(() => importePorMes(items), [items]),
    anios = useMemo(() => [...new Set(Object.keys(porMes).map((k) => Number(k.split("|")[0])))].sort(), [porMes]),
    hoy = new Date(),
    anioActual = hoy.getFullYear(),
    [elegidos, setElegidos] = useState(() => [anioActual - 1, anioActual]),
    vistos = anios.filter((a) => elegidos.includes(a)),
    valor = (a, m) => {
      const x = porMes[a + "|" + m];
      return x ? valSmart(x.ars, x.usd) : 0;
    },
    datos = MESES.map((_, m) => {
      const o = { label: mes3(m), mesIdx: m };
      vistos.forEach((a) => (o[a] = valor(a, m)));
      return o;
    }),
    hastaMes = hoy.getMonth(),
    acumulado = (a) => {
      let ars = 0, usd = 0;
      for (let m = 0; m <= hastaMes; m++) {
        const x = porMes[a + "|" + m];
        x && ((ars += x.ars), (usd += x.usd));
      }
      return { ars, usd };
    },
    act = acumulado(anioActual),
    ant = acumulado(anioActual - 1),
    delta = valSmart(act.ars - ant.ars, act.usd - ant.usd),
    base = valSmart(ant.ars, ant.usd),
    colorDe = (a) => PIE_COLORS[anios.indexOf(a) % PIE_COLORS.length],
    // En Pagos se puede plegar (queda recordado en esta compu) para no correr la tabla hacia abajo.
    claveVista = "mia-grafico-" + titulo,
    [abierto, setAbierto] = useState(() => {
      try {
        return !plegable || window.localStorage.getItem(claveVista) !== "no";
      } catch {
        return true;
      }
    }),
    alternar = () =>
      setAbierto((x) => {
        try {
          window.localStorage.setItem(claveVista, x ? "no" : "si");
        } catch {}
        return !x;
      });
  if (!abierto)
    return React.createElement(
      "button",
      { onClick: alternar, style: { ...smallBtnGhost, marginBottom: 14 } },
      "▼ Ver gráfico: " + titulo.toLowerCase(),
    );
  return React.createElement(
    "div",
    { style: { background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px", marginBottom: 18 } },
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 6 } },
      React.createElement(
        "div",
        { style: { fontSize: 11.5, fontWeight: 700, color: MUTED, letterSpacing: 0.3 } },
        titulo,
        plegable && React.createElement("button", { onClick: alternar, style: { border: "none", background: "none", color: MUTED, cursor: "pointer", fontSize: 11, marginLeft: 8 } }, "▲ ocultar"),
        onElegirMes &&
          !mesElegido &&
          React.createElement("span", { style: { fontWeight: 400, marginLeft: 8, fontSize: 11 } }, "· tocá una barra para filtrar la tabla por ese mes"),
        mesElegido &&
          React.createElement(
            "button",
            {
              onClick: () => onElegirMes(null),
              title: "Sacar el filtro de mes",
              style: { marginLeft: 10, border: "1px solid " + GOLD, background: "#FBF5E6", color: NAVY, borderRadius: 14, padding: "2px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" },
            },
            "Filtrando la tabla: " + mes3(mesElegido.mesIdx) + " " + mesElegido.anio + "  ✕",
          ),
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
        anios.map((a) =>
          React.createElement(
            "button",
            {
              key: a,
              onClick: () => setElegidos((x) => (x.includes(a) ? x.filter((y) => y !== a) : [...x, a])),
              style: {
                border: "1px solid " + (elegidos.includes(a) ? colorDe(a) : BORDER),
                background: elegidos.includes(a) ? colorDe(a) : "#fff",
                color: elegidos.includes(a) ? "#fff" : MUTED,
                borderRadius: 14,
                padding: "2px 10px",
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
              },
            },
            a,
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 8 } },
      React.createElement("span", { style: { fontSize: 20, fontWeight: 700, color: NAVY } }, fmtSmart(act.ars, act.usd)),
      React.createElement("span", { style: { fontSize: 11, color: MUTED } }, verbo + " " + anioActual + " (Ene–" + mes3(hastaMes) + ")"),
      base > 0 &&
        React.createElement(
          "span",
          {
            style: {
              fontSize: 11,
              fontWeight: 700,
              color: delta >= 0 ? GREEN : RED,
              background: delta >= 0 ? "#E6EEE9" : "#F7E6E3",
              borderRadius: 20,
              padding: "2px 10px",
            },
            title: "Comparado con " + (anioActual - 1) + " en los mismos meses (Ene–" + mes3(hastaMes) + "): " + fmtSmart(ant.ars, ant.usd),
          },
          (delta >= 0 ? "▲ " : "▼ ") + fmtSmart(Math.abs(act.ars - ant.ars), Math.abs(act.usd - ant.usd)) + " (" + ((Math.abs(delta) / base) * 100).toFixed(0) + "%) vs " + (anioActual - 1),
        ),
    ),
    vistos.length === 0
      ? React.createElement("div", { style: { fontSize: 12, color: MUTED, padding: "30px 0", textAlign: "center" } }, "Elegí al menos un año arriba.")
      : React.createElement(
          "div",
          { style: { width: "100%", height: 240 } },
          React.createElement(
            ResponsiveContainer,
            null,
            React.createElement(
              BarChart,
              { data: datos, margin: { top: 5, right: 10, left: 0, bottom: 0 } },
              React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: BORDER, vertical: false }),
              React.createElement(XAxis, { dataKey: "label", tick: { fontSize: 11, fill: MUTED }, axisLine: { stroke: BORDER }, tickLine: false }),
              React.createElement(YAxis, {
                tick: { fontSize: 10, fill: MUTED },
                axisLine: false,
                tickLine: false,
                tickFormatter: (e) => (Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(0) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(0) + "k" : e),
              }),
              React.createElement(Tooltip, { formatter: (e, n) => [fmt(e), verbo.charAt(0).toUpperCase() + verbo.slice(1) + " " + n] }),
              vistos.length > 1 && React.createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
              vistos.map((a) =>
                React.createElement(
                  Bar,
                  {
                    key: a,
                    dataKey: a,
                    name: String(a),
                    fill: colorDe(a),
                    radius: [4, 4, 0, 0],
                    cursor: onElegirMes ? "pointer" : "default",
                    onClick: (o) => {
                      if (!onElegirMes) return;
                      const m = (o && (o.payload || o)).mesIdx;
                      onElegirMes(mesElegido && mesElegido.anio === a && mesElegido.mesIdx === m ? null : { anio: a, mesIdx: m });
                    },
                  },
                  datos.map((d) =>
                    React.createElement(Cell, {
                      key: d.mesIdx,
                      fill: colorDe(a),
                      opacity: !mesElegido || (mesElegido.anio === a && mesElegido.mesIdx === d.mesIdx) ? 1 : 0.3,
                    }),
                  ),
                ),
              ),
            ),
          ),
        ),
  );
}
function FacturacionView({
  facturas: n,
  obras: d,
  onViewPdf: c,
  onMarcarAnio: p,
  isAdmin: g,
  isComercial: C,
  onGoToObra: S,
}) {
  const [f, F] = useState("TODOS"),
    [A, k] = useState("TODOS"),
    // Sección 149: arranca mostrando el año en curso (pedido del usuario); "Todos los años" sigue en la lista.
    [L, oe] = useState(() => new Date().getFullYear()),
    [ve, P] = useState(null),
    [M, Pe] = useState(false),
    [ye, Z] = useState(""),
    [Ye, ee] = useState(null),
    [mesFact, setMesFact] = useState(null),
    lt = useMemo(() => ["TODOS", ...Array.from(new Set(n.map((y) => y.cliente))).sort()], [n]),
    ne = useMemo(
      () => ["TODOS", ...Array.from(new Set([new Date().getFullYear(), ...d.map((y) => y.anio || /* @__PURE__ */ new Date().getFullYear())])).sort()],
      [d],
    ),
    Be = useMemo(() => new Set(d.map((y) => obraKey(y.cliente, y.obra))), [d]),
    Le = useMemo(() => {
      const y = {};
      return (
        d.forEach((G) => {
          y[G.cliente + "|" + G.obra] = G.anio || /* @__PURE__ */ new Date().getFullYear();
        }),
        y
      );
    }, [d]),
    Lt = (y) => Le[y.cliente + "|" + y.obra],
    nt = useMemo(() => {
      const y = ye.trim().toLowerCase(),
        G = n.filter(
          (te) =>
            (f === "TODOS" || te.cliente === f) &&
            (A === "TODOS" || te.status === A) &&
            // Sección 150: con un mes elegido manda la fecha de la factura (el mes ya trae su año), así la
            // tabla suma lo mismo que la barra del gráfico.
            (mesFact ? fechaEnMes(te.fecha, mesFact) : L === "TODOS" || Lt(te) === L) &&
            (!y || te.cliente.toLowerCase().includes(y) || te.obra.toLowerCase().includes(y)),
        );
      return ve
        ? [...G].sort((te, V) => {
            let ut = te[ve.key],
              At = V[ve.key];
            return (
              typeof ut == "string" && (ut = ut.toLowerCase()),
              typeof At == "string" && (At = At.toLowerCase()),
              ut == null
                ? 1
                : At == null
                  ? -1
                  : ut < At
                    ? ve.dir === "asc"
                      ? -1
                      : 1
                    : ut > At
                      ? ve.dir === "asc"
                        ? 1
                        : -1
                      : 0
            );
          })
        : G;
    }, [n, f, A, L, ve, Le, ye, mesFact]);
  function H(y) {
    P((G) => ({ key: y, dir: G && G.key === y && G.dir === "asc" ? "desc" : "asc" }));
  }
  const Ee = { table: ve };
  function Nt() {
    const y = nt.map((V) => ({
        Cliente: V.cliente,
        Obra: V.obra,
        Concepto: V.concepto || "",
        Tipo: V.tipo || "",
        "N°": V.nro || "",
        Emision: V.fecha,
        Estado: V.status,
        Importe: V.importe,
        Pago: V.fechaPago || "",
        Forma: V.forma || "",
      })),
      G = XLSX.utils.json_to_sheet(y),
      te = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(te, G, "Facturas"), descargarLibroXlsx(te, "facturas.xlsx"));
  }
  const [qt, po] = useState(/* @__PURE__ */ new Date().getMonth()),
    [oo, Eo] = useState(/* @__PURE__ */ new Date().getFullYear()),
    [Oo, Bo] = useState(false),
    w = useMemo(() => {
      const y = /* @__PURE__ */ new Set([/* @__PURE__ */ new Date().getFullYear()]);
      return (
        n.forEach((G) => {
          const te = String(G.fecha || "").split("/");
          if (te.length === 3) {
            const V = parseInt(te[2], 10);
            isNaN(V) || y.add(V);
          }
        }),
        Array.from(y).sort((G, te) => te - G)
      );
    }, [n]);
  function Ne() {
    const y = n.filter((Jt) => {
        const ht = String(Jt.fecha || "").split("/");
        return ht.length !== 3 ? false : parseInt(ht[1], 10) - 1 === qt && parseInt(ht[2], 10) === oo;
      }),
      G = [
        "CLIENTE",
        "OBRA",
        "CONCEPTO",
        "TIPO DE DOCUMENTO",
        "NRO FACTURA",
        "FECHA EMISION",
        "STATUS",
        "IMPORTE",
        "FECHA DE PAGO",
        "FORMA DE PAGO",
      ],
      te = y.map((Jt) => [
        Jt.cliente,
        Jt.obra,
        Jt.concepto || "",
        Jt.tipo || "",
        Jt.nro || "",
        Jt.fecha,
        Jt.status,
        Jt.importe || 0,
        Jt.fechaPago || "",
        Jt.forma || "",
      ]),
      V = y.reduce((Jt, ht) => Jt + (ht.importe || 0), 0),
      ut = V * 0.01,
      At = MESES[qt].charAt(0) + MESES[qt].slice(1).toLowerCase(),
      go = XLSX.utils.aoa_to_sheet([
        G,
        ...te,
        [],
        ["TOTAL FACTURADO", "", "", "", "", "", "", V],
        ["REGALIAS " + At.toUpperCase() + " " + oo, "", "", "", "", "", "", ut],
      ]),
      No = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(No, go, "Regalias"),
      descargarLibroXlsx(No, "regalias_" + At.toLowerCase() + "_" + oo + ".xlsx"));
  }
  const Re = useMemo(
      () =>
        d.filter(
          (y) =>
            (f === "TODOS" || y.cliente === f) &&
            (L === "TODOS" || (y.anio || /* @__PURE__ */ new Date().getFullYear()) === L),
        ),
      [d, f, L],
    ),
    at = useMemo(
      () => n.filter((y) => (f === "TODOS" || y.cliente === f) && (L === "TODOS" || Lt(y) === L)),
      [n, f, L, Le],
    ),
    // Sección 150: facturas del mes elegido en el gráfico (mismo criterio que la tabla). Sin mes, igual que `at`.
    atMes = useMemo(
      () => (mesFact ? n.filter((y) => (f === "TODOS" || y.cliente === f) && fechaEnMes(y.fecha, mesFact)) : at),
      [n, f, at, mesFact],
    ),
    dt = useMemo(() => {
      const suma = (arr, est, fn) => arr.filter((St) => St.status === est).reduce((St, zt) => St + fn(zt), 0),
        ars = (zt) => zt.importe || 0,
        usd = (zt) => aUsd(zt.importe, zt.tc),
        // Facturado / cobrado / adeudado siguen el mes elegido; el pendiente por facturar es de toda la obra.
        y = suma(atMes, "PAGADA", ars),
        G = suma(atMes, "ADEUDA", ars),
        te = y + G,
        V = suma(atMes, "PAGADA", usd),
        ut = suma(atMes, "ADEUDA", usd),
        At = V + ut,
        go = Re.reduce((St, zt) => St + zt.ventaFinal, 0),
        No = Re.reduce((St, zt) => St + (zt.ventaFinalUSD || 0), 0),
        Jt = go - (suma(at, "PAGADA", ars) + suma(at, "ADEUDA", ars)),
        ht = No - (suma(at, "PAGADA", usd) + suma(at, "ADEUDA", usd));
      return {
        pagado: y,
        adeuda: G,
        total: te,
        ventaTotal: go,
        pendienteFacturar: Jt,
        count: at.length,
        pagadoUSD: V,
        adeudaUSD: ut,
        totalUSD: At,
        ventaTotalUSD: No,
        pendienteFacturarUSD: ht,
      };
    }, [at, atMes, Re]),
    Gt = useMemo(() => {
      const y = /* @__PURE__ */ new Map(),
        G = (te, V) => obraKey(te, V);
      return (
        Re.forEach((te) => {
          const V = G(te.cliente, te.obra);
          (y.has(V) ||
            y.set(V, {
              cliente: te.cliente,
              obra: te.obra,
              ventaTotal: 0,
              ventaTotalUSD: 0,
              facturado: 0,
              facturadoUSD: 0,
              pendienteCobro: 0,
              pendienteCobroUSD: 0,
            }),
            (y.get(V).ventaTotal += te.ventaFinal),
            (y.get(V).ventaTotalUSD += te.ventaFinalUSD || 0));
        }),
        at.forEach((te) => {
          const V = G(te.cliente, te.obra);
          y.has(V) ||
            y.set(V, {
              cliente: te.cliente,
              obra: te.obra,
              ventaTotal: 0,
              ventaTotalUSD: 0,
              facturado: 0,
              facturadoUSD: 0,
              pendienteCobro: 0,
              pendienteCobroUSD: 0,
            });
          const ut = y.get(V),
            At = aUsd(te.importe, te.tc);
          ((ut.facturado += te.importe || 0),
            (ut.facturadoUSD += At),
            te.status === "ADEUDA" && ((ut.pendienteCobro += te.importe || 0), (ut.pendienteCobroUSD += At)));
        }),
        Array.from(y.values())
          .map((te) => ({
            ...te,
            pendienteFacturar: te.ventaTotal - te.facturado,
            pendienteFacturarUSD: te.ventaTotalUSD - te.facturadoUSD,
          }))
          .sort((te, V) => V.ventaTotal - te.ventaTotal)
      );
    }, [Re, at]);
  function vt() {
    const y = Gt.filter((V) => Math.abs(V.pendienteFacturar) >= 1).map((V) => ({
        Cliente: V.cliente,
        Obra: V.obra,
        "Venta Total (ARS)": V.ventaTotal,
        "Venta Total (USD)": Number(V.ventaTotalUSD.toFixed(2)),
        "Facturado (ARS)": V.facturado,
        "Facturado (USD)": Number(V.facturadoUSD.toFixed(2)),
        "Pendiente de Cobro (ARS)": V.pendienteCobro,
        "Pendiente de Cobro (USD)": Number(V.pendienteCobroUSD.toFixed(2)),
        "Pendiente de Facturar (ARS)": V.pendienteFacturar,
        "Pendiente de Facturar (USD)": Number(V.pendienteFacturarUSD.toFixed(2)),
      })),
      G = XLSX.utils.json_to_sheet(y),
      te = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(te, G, "Pendiente de facturar"),
      descargarLibroXlsx(te, "pendiente_de_facturar.xlsx"));
  }
  return React.createElement(
    "div",
    { style: { padding: "22px 28px" } },
    React.createElement(
      "div",
      { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", columnGap: 14, gap: 14, marginBottom: 18 } },
      React.createElement(SummaryCard, {
        label: "TOTAL FACTURADO",
        value: fmtSmart(dt.total, dt.totalUSD),
        color: NAVY,
      }),
      React.createElement(SummaryCard, {
        label: "COBRADO / PAGADO",
        value: fmtSmart(dt.pagado, dt.pagadoUSD),
        color: GREEN,
      }),
      React.createElement(SummaryCard, { label: "ADEUDADO", value: fmtSmart(dt.adeuda, dt.adeudaUSD), color: RED }),
      React.createElement(
        "div",
        { onClick: () => Pe((y) => !y), style: { cursor: "pointer" } },
        React.createElement(SummaryCard, {
          label: "PENDIENTE POR FACTURAR " + (M ? "▲" : "▼"),
          value: fmtSmart(dt.pendienteFacturar, dt.pendienteFacturarUSD),
          color: GOLD,
        }),
      ),
    ),
    // El gráfico compara años por fecha de factura: sigue el filtro de Cliente, no el de año de la obra.
    React.createElement(GraficoPorMes, { titulo: "FACTURACIÓN POR MES", verbo: "facturado", items: f === "TODOS" ? n : n.filter((y) => y.cliente === f), mesElegido: mesFact, onElegirMes: setMesFact }),
    M &&
      React.createElement(
        "div",
        {
          style: {
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            overflow: "hidden",
            marginBottom: 18,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px 16px",
              borderBottom: "1px solid " + BORDER,
            },
          },
          React.createElement(
            "button",
            { onClick: vt, style: smallBtnGhost },
            React.createElement(Download, { size: 13 }),
            " Descargar pendiente de facturar",
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "1.3fr 1.3fr 1fr 1fr 1.15fr 1.15fr",
              columnGap: 10,
              padding: "10px 16px",
              fontSize: 11,
              fontWeight: 700,
              background: "#EFEDE7",
              borderBottom: "1px solid " + BORDER,
            },
          },
          React.createElement("div", null, "CLIENTE"),
          React.createElement("div", null, "OBRA"),
          React.createElement("div", { style: { textAlign: "right" } }, "VENTA TOTAL"),
          React.createElement("div", { style: { textAlign: "right" } }, "FACTURADO"),
          React.createElement("div", { style: { textAlign: "right" } }, "PENDIENTE DE COBRO"),
          React.createElement("div", { style: { textAlign: "right" } }, "PENDIENTE DE FACTURAR"),
        ),
        Gt.filter((y) => Math.abs(y.pendienteFacturar) >= 1).map((y, G) => {
          const te = Be.has(obraKey(y.cliente, y.obra));
          return React.createElement(
            "div",
            {
              key: obraKey(y.cliente, y.obra),
              onClick: te ? () => S(y.cliente, y.obra) : void 0,
              title: te ? "Ir a la obra " + y.obra + " (" + y.cliente + ")" : void 0,
              style: {
                display: "grid",
                gridTemplateColumns: "1.3fr 1.3fr 1fr 1fr 1.15fr 1.15fr",
                columnGap: 10,
                padding: "9px 16px",
                fontSize: 12.5,
                alignItems: "center",
                cursor: te ? "pointer" : "default",
                background: G % 2 === 0 ? "#fff" : "#F5F4F0",
                borderBottom: "1px solid " + BORDER,
              },
              onMouseEnter: (V) => {
                te && (V.currentTarget.style.background = "#EFEDE7");
              },
              onMouseLeave: (V) => {
                V.currentTarget.style.background = G % 2 === 0 ? "#fff" : "#F5F4F0";
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  fontWeight: 600,
                  color: te ? NAVY : TEXT,
                  textDecoration: te ? "underline" : "none",
                  textDecorationColor: BORDER,
                },
              },
              y.cliente,
            ),
            React.createElement("div", { style: { color: MUTED } }, y.obra),
            React.createElement("div", { style: { textAlign: "right" } }, fmtSmart(y.ventaTotal, y.ventaTotalUSD)),
            React.createElement(
              "div",
              { style: { textAlign: "right", color: GREEN } },
              fmtSmart(y.facturado, y.facturadoUSD),
            ),
            React.createElement(
              "div",
              { style: { textAlign: "right", color: y.pendienteCobro > 0 ? RED : MUTED } },
              fmtSmart(y.pendienteCobro, y.pendienteCobroUSD),
            ),
            React.createElement(
              "div",
              { style: { textAlign: "right", color: y.pendienteFacturar > 0 ? GOLD : MUTED, fontWeight: 600 } },
              fmtSmart(y.pendienteFacturar, y.pendienteFacturarUSD),
            ),
          );
        }),
        Gt.filter((y) => Math.abs(y.pendienteFacturar) >= 1).length === 0 &&
          React.createElement(
            "div",
            { style: { padding: 16, fontSize: 12.5, color: MUTED } },
            "No hay obras con venta pendiente de facturar.",
          ),
      ),
    (() => {
      const y = {},
        // Sección 150: con un mes elegido, la torta muestra lo facturado en ese mes por cliente.
        mesTxt = mesFact ? MESES[mesFact.mesIdx] + " " + mesFact.anio : "",
        elegir = (nom) =>
          mesFact
            ? F(f === nom ? "TODOS" : nom)
            : f === nom && A === "ADEUDA"
              ? (F("TODOS"), k("TODOS"))
              : (F(nom), k("ADEUDA")),
        marcado = (nom) => f === nom && (mesFact || A === "ADEUDA");
      (mesFact ? atMes : at.filter((V) => V.status === "ADEUDA")).forEach((V) => {
        y[V.cliente] = (y[V.cliente] || 0) + (V.importe || 0);
      });
      const G = Object.entries(y)
          .map(([V, ut]) => ({ name: V, value: ut }))
          .sort((V, ut) => ut.value - V.value),
        te = G.reduce((V, ut) => V + ut.value, 0);
      return G.length === 0
        ? null
        : React.createElement(
            "div",
            {
              style: {
                background: "#fff",
                borderRadius: 12,
                border: "1px solid " + BORDER,
                boxShadow: CARD_SHADOW,
                padding: "14px 18px",
                marginBottom: 18,
                display: "flex",
                gap: 18,
                alignItems: "center",
              },
            },
            React.createElement(
              "div",
              { style: { width: 140, height: 130, flexShrink: 0 } },
              React.createElement(
                ResponsiveContainer,
                null,
                React.createElement(
                  PieChart,
                  null,
                  React.createElement(
                    Pie,
                    {
                      data: G,
                      dataKey: "value",
                      nameKey: "name",
                      cx: "50%",
                      cy: "50%",
                      outerRadius: 55,
                      onClick: (V) => elegir(V.name),
                      style: { cursor: "pointer" },
                    },
                    G.map((V, ut) => React.createElement(Cell, { key: ut, fill: PIE_COLORS[ut % PIE_COLORS.length] })),
                  ),
                  React.createElement(Tooltip, { formatter: (V) => fmt(V) }),
                ),
              ),
            ),
            React.createElement(
              "div",
              null,
              React.createElement(
                "div",
                { style: { fontSize: 10.5, fontWeight: 700, color: MUTED, marginBottom: 6, letterSpacing: 0.3 } },
                mesFact ? "FACTURADO EN " + mesTxt + " POR CLIENTE" : "PORCENTAJE FACTURADO Y PRÓXIMO A COBRAR DE CADA CLIENTE",
              ),
              React.createElement(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: 10,
                    gap: "3px 16px",
                    fontSize: 11.5,
                  },
                },
                G.map((V, ut) =>
                  React.createElement(
                    "div",
                    {
                      key: V.name,
                      onClick: () => elegir(V.name),
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                        background: marcado(V.name) ? "#F1E9D2" : "transparent",
                        borderRadius: 5,
                        padding: "2px 4px",
                      },
                    },
                    React.createElement("span", {
                      style: {
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: PIE_COLORS[ut % PIE_COLORS.length],
                        flexShrink: 0,
                      },
                    }),
                    React.createElement("span", { style: { fontWeight: 600 } }, V.name),
                    React.createElement(
                      "span",
                      { style: { color: MUTED } },
                      ((V.value / te) * 100).toFixed(0),
                      "% · ",
                      fmt(V.value),
                    ),
                  ),
                ),
              ),
              React.createElement(
                "div",
                { style: { fontSize: 10, color: MUTED, marginTop: 6 } },
                mesFact ? "Click en un cliente para ver sus facturas de " + mesTxt.toLowerCase() : "Click en un cliente para ver el detalle de lo que debe",
              ),
            ),
          );
    })(),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 10, marginBottom: 12 } },
      React.createElement(
        "select",
        { value: f, onChange: (y) => F(y.target.value), style: selectStyle },
        lt.map((y) => React.createElement("option", { key: y, value: y }, y === "TODOS" ? "Todos los clientes" : y)),
      ),
      React.createElement(
        "select",
        { value: A, onChange: (y) => k(y.target.value), style: selectStyle },
        React.createElement("option", { value: "TODOS" }, "Todos los estados"),
        React.createElement("option", { value: "PAGADA" }, "Pagada"),
        React.createElement("option", { value: "ADEUDA" }, "Adeuda"),
      ),
      React.createElement(
        "select",
        {
          value: L,
          onChange: (y) => oe(y.target.value === "TODOS" ? "TODOS" : Number(y.target.value)),
          style: selectStyle,
        },
        ne.map((y) => React.createElement("option", { key: y, value: y }, y === "TODOS" ? "Todos los años" : y)),
      ),
      g &&
        L !== "TODOS" &&
        React.createElement(
          "button",
          {
            onClick: () => {
              (ee("Procesando..."),
                p(L).then((y) => {
                  ee(
                    y > 0
                      ? "Se completaron " + y + " obra(s) del " + L + " a 100% facturado y cobrado."
                      : "Las obras del " + L + " ya estaban 100% facturadas.",
                  );
                }));
            },
            style: smallBtnGhost,
          },
          "Marcar ",
          L,
          " 100% facturado y cobrado",
        ),
      React.createElement("input", {
        placeholder: "Buscar por cliente o centro de costo...",
        value: ye,
        onChange: (y) => Z(y.target.value),
        style: { ...inputStyle, width: 260 },
      }),
      (f !== "TODOS" || A !== "TODOS" || L !== "TODOS" || ye) &&
        React.createElement(
          "button",
          {
            onClick: () => {
              (F("TODOS"), k("TODOS"), oe("TODOS"), Z(""));
            },
            style: smallBtnGhost,
          },
          React.createElement(X, { size: 13 }),
          " Ver todos",
        ),
      React.createElement(
        "div",
        { style: { fontSize: 12.5, color: MUTED, alignSelf: "center", marginLeft: 4 } },
        nt.length,
        " facturas",
      ),
      C &&
        React.createElement(
          "div",
          { style: { position: "relative", marginLeft: "auto" } },
          React.createElement(
            "button",
            { onClick: () => Bo((y) => !y), style: smallBtnGhost },
            React.createElement(Download, { size: 13 }),
            " Descargar regalías",
          ),
          Oo &&
            React.createElement(
              "div",
              {
                style: {
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  zIndex: 20,
                  background: "#fff",
                  border: "1px solid " + BORDER,
                  borderRadius: 10,
                  boxShadow: CARD_SHADOW,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  width: 220,
                },
              },
              React.createElement(
                "div",
                { style: { fontSize: 11.5, fontWeight: 700, color: NAVY } },
                "¿Facturas emitidas en qué mes?",
              ),
              React.createElement(
                "div",
                { style: { display: "flex", gap: 6 } },
                React.createElement(
                  "select",
                  { value: qt, onChange: (y) => po(Number(y.target.value)), style: { ...selectStyle, flex: 1.4 } },
                  MESES.map((y, G) =>
                    React.createElement("option", { key: y, value: G }, y.charAt(0) + y.slice(1).toLowerCase()),
                  ),
                ),
                React.createElement(
                  "select",
                  { value: oo, onChange: (y) => Eo(Number(y.target.value)), style: { ...selectStyle, flex: 1 } },
                  w.map((y) => React.createElement("option", { key: y, value: y }, y)),
                ),
              ),
              React.createElement(
                "div",
                { style: { display: "flex", gap: 6, justifyContent: "flex-end" } },
                React.createElement(
                  "button",
                  { onClick: () => Bo(false), style: { ...smallBtnGhost, color: MUTED } },
                  "Cancelar",
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (Ne(), Bo(false));
                    },
                    style: smallBtnPrimary,
                  },
                  "Descargar",
                ),
              ),
            ),
        ),
      React.createElement(
        "button",
        { onClick: Nt, style: { ...smallBtnGhost, marginLeft: C ? 8 : "auto" } },
        React.createElement(Download, { size: 13 }),
        " Descargar facturas",
      ),
    ),
    Ye && React.createElement("div", { style: { fontSize: 11.5, color: MUTED, marginTop: -6, marginBottom: 14 } }, Ye),
    React.createElement(
      "div",
      {
        style: {
          background: "#fff",
          borderRadius: 12,
          border: "1px solid " + BORDER,
          boxShadow: CARD_SHADOW,
          overflow: "hidden",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1.3fr 1.3fr 1.6fr 0.7fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.6fr",
            columnGap: 10,
            padding: "10px 16px",
            fontSize: 11,
            fontWeight: 700,
            background: "#EFEDE7",
            borderBottom: "1px solid " + BORDER,
          },
        },
        React.createElement(SortHeader, {
          label: "CLIENTE",
          tableId: "table",
          sortKey: "cliente",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement(SortHeader, {
          label: "OBRA",
          tableId: "table",
          sortKey: "obra",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement(SortHeader, {
          label: "CONCEPTO",
          tableId: "table",
          sortKey: "concepto",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement(SortHeader, {
          label: "TIPO",
          tableId: "table",
          sortKey: "tipo",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement(SortHeader, {
          label: "N°",
          tableId: "table",
          sortKey: "nro",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement(SortHeader, {
          label: "EMISION",
          tableId: "table",
          sortKey: "fecha",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement(SortHeader, {
          label: "ESTADO",
          tableId: "table",
          sortKey: "status",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement(SortHeader, {
          label: "IMPORTE",
          tableId: "table",
          sortKey: "importe",
          sortState: Ee,
          onSort: (y, G) => H(G),
          align: "right",
        }),
        React.createElement(SortHeader, {
          label: "PAGO",
          tableId: "table",
          sortKey: "fechaPago",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement(SortHeader, {
          label: "FORMA",
          tableId: "table",
          sortKey: "forma",
          sortState: Ee,
          onSort: (y, G) => H(G),
        }),
        React.createElement("div", { style: { textAlign: "center" } }, "PDF"),
      ),
      React.createElement(
        "div",
        { style: { maxHeight: 520, overflowY: "auto" } },
        nt.map((y, G) => {
          const te = Be.has(obraKey(y.cliente, y.obra));
          return React.createElement(
            "div",
            {
              key: G,
              onClick: te ? () => S(y.cliente, y.obra) : void 0,
              title: te ? "Ir a la obra " + y.obra + " (" + y.cliente + ")" : void 0,
              style: {
                display: "grid",
                gridTemplateColumns: "1.3fr 1.3fr 1.6fr 0.7fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.6fr",
                columnGap: 10,
                padding: "8px 16px",
                fontSize: 12.5,
                alignItems: "center",
                background: G % 2 === 0 ? "#fff" : "#F5F4F0",
                borderBottom: "1px solid " + BORDER,
                cursor: te ? "pointer" : "default",
              },
              onMouseEnter: (V) => {
                te && (V.currentTarget.style.background = "#EFEDE7");
              },
              onMouseLeave: (V) => {
                V.currentTarget.style.background = G % 2 === 0 ? "#fff" : "#F5F4F0";
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  fontWeight: 600,
                  color: te ? NAVY : TEXT,
                  textDecoration: te ? "underline" : "none",
                  textDecorationColor: te ? BORDER : "transparent",
                },
              },
              y.cliente,
            ),
            React.createElement("div", null, y.obra),
            React.createElement(
              "div",
              { style: { color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
              y.concepto || "—",
            ),
            React.createElement("div", null, y.tipo || "—"),
            React.createElement("div", null, y.nro || "—"),
            React.createElement("div", null, normalizarFecha(y.fecha)),
            React.createElement(
              "div",
              null,
              React.createElement(StatusBadge, { status: y.status === "PAGADA" ? "FINALIZADA" : "EN PROCESO" }),
            ),
            React.createElement(
              "div",
              { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
              fmt(y.importe, y.tc),
            ),
            React.createElement("div", { style: { color: MUTED } }, y.fechaPago ? normalizarFecha(y.fechaPago) : "—"),
            React.createElement("div", { style: { color: MUTED } }, y.forma || "—"),
            React.createElement(
              "div",
              { style: { display: "flex", gap: 4, justifyContent: "center" } },
              y.pdfData
                ? React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                      "button",
                      {
                        onClick: (V) => {
                          (V.stopPropagation(),
                            c({ name: y.pdfName, data: dataUrlToBlobUrl(y.pdfData), rawData: y.pdfData }));
                        },
                        title: "Ver PDF",
                        style: { border: "none", background: "none", cursor: "pointer", color: NAVY },
                      },
                      React.createElement(Eye, { size: 13 }),
                    ),
                    React.createElement(
                      "button",
                      {
                        onClick: (V) => {
                          (V.stopPropagation(), ofrecerDescarga(y.pdfName || "factura.pdf", dataUrlToBlob(y.pdfData)));
                        },
                        title: "Descargar",
                        style: { border: "none", background: "none", cursor: "pointer", color: MUTED, display: "flex" },
                      },
                      React.createElement(Download, { size: 13 }),
                    ),
                  )
                : React.createElement("span", { style: { color: "#CCCFD9", fontSize: 11 } }, "—"),
            ),
          );
        }),
      ),
    ),
    React.createElement(
      "div",
      { style: { fontSize: 11, color: MUTED, marginTop: 10, marginBottom: 20 } },
      'Los totales toman el campo Importe de cada comprobante (facturas y anticipos con monto propio cargado). "Pendiente por facturar" = Venta Total de las obras en alcance menos lo ya facturado.',
    ),
  );
}
function SummaryCard({ label: n, value: d, color: c }) {
  return React.createElement(
    "div",
    {
      style: {
        background: "#fff",
        border: "1px solid " + BORDER,
        borderRadius: 12,
        boxShadow: CARD_SHADOW,
        padding: "14px 18px",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          fontSize: 10.5,
          fontWeight: 700,
          color: MUTED,
          marginBottom: 7,
          letterSpacing: 0.4,
          textTransform: "uppercase",
        },
      },
      n,
    ),
    React.createElement("div", { style: { fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: c } }, d),
  );
}
