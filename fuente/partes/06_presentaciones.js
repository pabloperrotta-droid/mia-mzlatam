function PresentacionSlides({ data: n, refs: d }) {
  const { anioActual: c, anioAnterior: p, mesActualIdx: g } = n,
    C = capitalizar(MESES[g]),
    S = n.chartVentaMes.map((f, F) => [f.label.toUpperCase(), fmt(f[p]), F <= g ? fmt(f[c]) : "—"]);
  return React.createElement(
    "div",
    { style: { position: "fixed", top: 0, left: -2e4, zIndex: -1 } },
    React.createElement(
      "div",
      { ref: d[0], style: { ...slideFrame, background: NAVY_DEEP, color: "#fff" } },
      React.createElement("div", {
        style: { position: "absolute", top: 0, left: 0, right: 0, height: 6, background: GOLD },
      }),
      React.createElement(
        "div",
        { style: { position: "absolute", top: "38%", left: 0, right: 0, textAlign: "center" } },
        React.createElement(
          "div",
          { style: { fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: 4 } },
          "INFORME FINANCIERO",
        ),
        React.createElement(
          "div",
          { style: { fontSize: 46, fontWeight: 800, color: "#fff", marginTop: 14 } },
          C,
          " ",
          c,
        ),
        React.createElement(
          "div",
          { style: { fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 16 } },
          "Ventas · Facturación · Márgenes · Resultado del ejercicio",
        ),
      ),
      React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 34,
            textAlign: "center",
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 0.5,
          },
        },
        "MZ LATAM · DOCUMENTO CONFIDENCIAL DE USO INTERNO",
      ),
    ),
    React.createElement(
      "div",
      { ref: d[1], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "VENTA POR MES",
        subtitle: "Comparativo " + p + " (año completo) vs. " + c + " (a " + C.toLowerCase() + ")",
      }),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 24, padding: "20px 48px 0", height: 560, boxSizing: "border-box" } },
        React.createElement(
          "div",
          { style: { flex: 0.95 } },
          React.createElement(Tbl, {
            cols: ["MES", "VENTA " + p, "VENTA " + c],
            widths: ["1.3fr", "1fr", "1fr"],
            rows: S,
            totalRow: ["TOTAL", fmt(n.totalVentaAnterior), fmt(n.totalVentaActual)],
          }),
        ),
        React.createElement(
          "div",
          { style: { flex: 1, display: "flex", flexDirection: "column", gap: 12 } },
          React.createElement(
            "div",
            { style: { display: "flex", gap: 12 } },
            React.createElement(KpiCard, { label: "TOTAL " + p + " (AÑO COMPLETO)", value: fmt(n.totalVentaAnterior) }),
            React.createElement(KpiCard, {
              label: "TOTAL " + c + " (A " + C.toUpperCase() + ")",
              value: fmt(n.totalVentaActual),
              color: GOLD,
            }),
          ),
          React.createElement(
            "div",
            { style: { flex: 1, minHeight: 0 } },
            React.createElement(
              ResponsiveContainer,
              null,
              React.createElement(
                BarChart,
                { data: n.chartVentaMes, margin: { top: 10, right: 10, left: 0, bottom: 0 } },
                React.createElement(CartesianGrid, { vertical: false, stroke: BORDER }),
                React.createElement(XAxis, {
                  dataKey: "label",
                  tick: { fontSize: 9.5, fill: MUTED },
                  axisLine: false,
                  tickLine: false,
                }),
                React.createElement(YAxis, {
                  tick: { fontSize: 9.5, fill: MUTED },
                  axisLine: false,
                  tickLine: false,
                  tickFormatter: (f) => (f / 1e6).toFixed(0) + "M",
                }),
                React.createElement(Bar, { dataKey: p, fill: "#B8B2A0", radius: [3, 3, 0, 0] }),
                React.createElement(Bar, { dataKey: c, fill: GOLD, radius: [3, 3, 0, 0] }),
              ),
            ),
          ),
        ),
      ),
      React.createElement(SlideFooter, { n: 2 }),
    ),
    React.createElement(
      "div",
      { ref: d[2], style: slideFrame },
      React.createElement(SlideHeader, { title: "FACTURACIÓN", subtitle: "Venta vs. facturado, por año de obra" }),
      React.createElement(
        "div",
        { style: { padding: "20px 48px 0" } },
        React.createElement(Tbl, {
          cols: ["CONCEPTO", String(p), String(c)],
          widths: ["2fr", "1fr", "1fr"],
          rows: [
            ["Venta", fmt(n.ventaAnioAnterior), fmt(n.ventaAnioActual)],
            ["Facturado (pagado + adeudado)", fmt(n.facturadoAnioAnterior), fmt(n.facturadoAnioActual)],
            ["Resta por facturar", fmt(n.restaAnioAnterior), fmt(n.restaAnioActual)],
          ],
        }),
        React.createElement(
          "div",
          { style: { fontSize: 10, color: MUTED, marginTop: 8 } },
          "Los KPI de abajo son el total general (todas las obras, todos los años) — igual que en la pantalla de Facturación.",
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 14, marginTop: 14 } },
          React.createElement(KpiCard, {
            label: "TOTAL POR FACTURAR",
            value: fmt(n.totalPorFacturar),
            sub: "*detalle próxima lámina",
            color: GOLD,
          }),
          React.createElement(KpiCard, {
            label: "FACTURADO PEND. DE COBRO",
            value: fmt(n.facturadoPendCobro),
            sub: "*detalle próxima lámina",
            color: RED,
          }),
          React.createElement(KpiCard, {
            label: "TOTAL PENDIENTE DE INGRESOS",
            value: fmt(n.totalPendienteIngresos),
            color: NAVY,
          }),
        ),
      ),
      React.createElement(SlideFooter, { n: 3 }),
    ),
    React.createElement(
      "div",
      { ref: d[3], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "FACTURACIÓN " + c,
        subtitle: "Facturas emitidas por mes, hasta " + C.toLowerCase(),
      }),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 24, padding: "20px 48px 0", height: 560, boxSizing: "border-box" } },
        React.createElement(
          "div",
          { style: { flex: 0.8 } },
          React.createElement(Tbl, {
            cols: ["MES", "IMPORTE", "SHARE"],
            widths: ["1fr", "1.3fr", "0.8fr"],
            rows: n.facturacionMensualActual.map((f) => [
              f.mes.toUpperCase(),
              fmt(f.importe),
              n.facturadoAnioActual ? ((f.importe / n.facturadoAnioActual) * 100).toFixed(0) + "%" : "—",
            ]),
            totalRow: ["TOTAL", fmt(n.facturadoAnioActual), "100%"],
          }),
        ),
        React.createElement(
          "div",
          { style: { flex: 1, minHeight: 0 } },
          React.createElement(
            ResponsiveContainer,
            null,
            React.createElement(
              BarChart,
              { data: n.facturacionMensualActual, margin: { top: 10, right: 10, left: 0, bottom: 0 } },
              React.createElement(CartesianGrid, { vertical: false, stroke: BORDER }),
              React.createElement(XAxis, {
                dataKey: "mes",
                tick: { fontSize: 9.5, fill: MUTED },
                axisLine: false,
                tickLine: false,
              }),
              React.createElement(YAxis, {
                tick: { fontSize: 9.5, fill: MUTED },
                axisLine: false,
                tickLine: false,
                tickFormatter: (f) => (f / 1e6).toFixed(0) + "M",
              }),
              React.createElement(Bar, { dataKey: "importe", fill: NAVY, radius: [4, 4, 0, 0] }),
            ),
          ),
        ),
      ),
      React.createElement(SlideFooter, { n: 4 }),
    ),
    React.createElement(
      "div",
      { ref: d[4], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "DETALLE PENDIENTE DE INGRESOS",
        subtitle: "Facturado pendiente de cobro y deuda sin facturar, por cliente",
      }),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 24, padding: "20px 48px 0" } },
        React.createElement(
          "div",
          { style: { flex: 1 } },
          React.createElement(
            "div",
            { style: { fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 } },
            "FACTURADO PEND. DE COBRO",
          ),
          React.createElement(Tbl, {
            cols: ["CLIENTE", "IMPORTE"],
            widths: ["1.4fr", "1fr"],
            rows: n.pendCobroPorCliente.slice(0, 9).map((f) => [f.cliente, fmt(f.monto)]),
            totalRow: ["TOTAL GENERAL", fmt(n.facturadoPendCobro)],
          }),
        ),
        React.createElement(
          "div",
          { style: { flex: 1 } },
          React.createElement(
            "div",
            { style: { fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 } },
            "DEUDA SIN FACTURAR",
          ),
          React.createElement(Tbl, {
            cols: ["CLIENTE", "IMPORTE"],
            widths: ["1.4fr", "1fr"],
            rows: n.deudaSinFacturarPorCliente.slice(0, 9).map((f) => [f.cliente, fmt(f.monto)]),
            totalRow: ["TOTAL GENERAL", fmt(n.totalPorFacturar)],
          }),
        ),
      ),
      React.createElement(SlideFooter, { n: 5 }),
    ),
    React.createElement(
      "div",
      { ref: d[5], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "VENTA POR CLIENTE",
        subtitle: "Ranking " + c + " por participación sobre el total",
      }),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 24, padding: "20px 48px 0", height: 560, boxSizing: "border-box" } },
        React.createElement(
          "div",
          { style: { flex: 1, minHeight: 0 } },
          React.createElement(
            ResponsiveContainer,
            null,
            React.createElement(
              BarChart,
              { data: n.ventaPorClienteActual, layout: "vertical", margin: { top: 5, right: 30, left: 10, bottom: 5 } },
              React.createElement(CartesianGrid, { horizontal: false, stroke: BORDER }),
              React.createElement(XAxis, {
                type: "number",
                tick: { fontSize: 9.5, fill: MUTED },
                axisLine: false,
                tickLine: false,
                tickFormatter: (f) => (f / 1e6).toFixed(0) + "M",
              }),
              React.createElement(YAxis, {
                type: "category",
                dataKey: "cliente",
                width: 110,
                tick: { fontSize: 10, fill: TEXT },
                axisLine: false,
                tickLine: false,
              }),
              React.createElement(
                Bar,
                { dataKey: "venta", fill: GOLD, radius: [0, 4, 4, 0] },
                React.createElement(LabelList, {
                  dataKey: "venta",
                  position: "right",
                  formatter: (f) => (f / 1e6).toFixed(0) + "M",
                  style: { fontSize: 9.5, fill: NAVY },
                }),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          { style: { flex: 0.85 } },
          React.createElement(Tbl, {
            cols: ["CLIENTE", "VENTA", "SHARE"],
            widths: ["1.3fr", "1fr", "0.7fr"],
            rows: n.ventaPorClienteActual.map((f) => [
              f.cliente,
              fmt(f.venta),
              n.totalVentaClienteActual ? ((f.venta / n.totalVentaClienteActual) * 100).toFixed(1) + "%" : "—",
            ]),
            totalRow: ["TOTAL", fmt(n.totalVentaClienteActual), "100,0%"],
          }),
        ),
      ),
      React.createElement(SlideFooter, { n: 6 }),
    ),
    React.createElement(
      "div",
      { ref: d[6], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "MARGEN BRUTO / MARKUP " + c,
        subtitle: "Evolución del margen inicial a final por cliente",
      }),
      React.createElement(
        "div",
        { style: { padding: "20px 48px 0" } },
        React.createElement(Tbl, {
          cols: ["CLIENTE", "VENTA FINAL", "MB INICIAL / MARKUP", "MB FINAL / MARKUP", "VARIACIÓN"],
          widths: ["1.4fr", "1fr", "0.8fr", "0.8fr", "0.9fr"],
          rows: n.margenPorCliente.map((f) => [
            f.cliente,
            fmt(f.venta),
            pctMk(f.mbInicial),
            pctMk(f.mbFinal),
            (f.variacion >= 0 ? "+" : "") + f.variacion.toFixed(0) + " p.p.",
          ]),
          totalRow: [
            "TOTAL GENERAL",
            fmt(n.margenTotal.venta),
            pctMk(n.margenTotal.mbInicial),
            pctMk(n.margenTotal.mbFinal),
            (n.margenTotal.variacion >= 0 ? "+" : "") + n.margenTotal.variacion.toFixed(0) + " p.p.",
          ],
        }),
      ),
      React.createElement(SlideFooter, { n: 7 }),
    ),
    React.createElement(
      "div",
      { ref: d[7], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "CASH",
        subtitle: "Proyección semanal de ingresos, egresos y saldo — pantalla Cashflow",
      }),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 24, padding: "20px 48px 0", height: 560, boxSizing: "border-box" } },
        React.createElement(
          "div",
          { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 12 } },
          React.createElement(
            "div",
            { style: { display: "flex", gap: 12 } },
            React.createElement(KpiCard, { label: "SALDO INICIAL", value: fmt(n.saldoInicialCash) }),
            React.createElement(KpiCard, {
              label: "INGRESOS PROYECTADOS (12 SEM.)",
              value: fmt(n.totalIngresosCash),
              color: GREEN,
            }),
            React.createElement(KpiCard, {
              label: "EGRESOS PROYECTADOS (12 SEM.)",
              value: fmt(n.totalEgresosCash),
              color: RED,
            }),
            React.createElement(KpiCard, {
              label: "SALDO PROYECTADO A 12 SEMANAS",
              value: fmt(n.saldoProyectadoCash),
              color: n.saldoProyectadoCash >= 0 ? GOLD : RED,
            }),
          ),
          React.createElement(
            "div",
            { style: { flex: 1, minHeight: 0 } },
            React.createElement(
              ResponsiveContainer,
              null,
              React.createElement(
                BarChart,
                { data: n.cashChart, margin: { top: 10, right: 10, left: 0, bottom: 0 } },
                React.createElement(CartesianGrid, { vertical: false, stroke: BORDER }),
                React.createElement(XAxis, {
                  dataKey: "semana",
                  tick: { fontSize: 9.5, fill: MUTED },
                  axisLine: false,
                  tickLine: false,
                }),
                React.createElement(YAxis, {
                  tick: { fontSize: 9.5, fill: MUTED },
                  axisLine: false,
                  tickLine: false,
                  tickFormatter: (f) => (f / 1e6).toFixed(0) + "M",
                }),
                React.createElement(Bar, { dataKey: "saldo", fill: NAVY, radius: [3, 3, 0, 0] }),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          { style: { flex: 0.85 } },
          React.createElement(Tbl, {
            cols: ["SEMANA", "INGRESOS", "EGRESOS", "NETO", "SALDO ACUM."],
            widths: ["0.8fr", "1fr", "1fr", "1fr", "1fr"],
            rows: n.cashRows,
          }),
        ),
      ),
      React.createElement(SlideFooter, { n: 8 }),
    ),
  );
}
function CashSlides({ data: n, refs: d }) {
  const c = Math.ceil(n.filasSemanales.length / 2),
    p = [n.filasSemanales.slice(0, c), n.filasSemanales.slice(c)];
  return React.createElement(
    "div",
    { style: { position: "fixed", top: 0, left: -2e4, zIndex: -1 } },
    React.createElement(
      "div",
      { ref: d[0], style: { ...slideFrame, background: NAVY_DEEP, color: "#fff" } },
      React.createElement("div", {
        style: { position: "absolute", top: 0, left: 0, right: 0, height: 6, background: GOLD },
      }),
      React.createElement(
        "div",
        { style: { position: "absolute", top: "38%", left: 0, right: 0, textAlign: "center" } },
        React.createElement(
          "div",
          { style: { fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: 4 } },
          "PROYECCIÓN DE CAJA",
        ),
        React.createElement("div", { style: { fontSize: 46, fontWeight: 800, color: "#fff", marginTop: 14 } }, "CASH"),
        React.createElement(
          "div",
          { style: { fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 16 } },
          "Ingresos · Egresos · Salidas semanales · Bancos — generado el ",
          n.fechaGeneracion,
        ),
      ),
      React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 34,
            textAlign: "center",
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 0.5,
          },
        },
        "MZ LATAM · DOCUMENTO CONFIDENCIAL DE USO INTERNO",
      ),
    ),
    React.createElement(
      "div",
      { ref: d[1], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "RESUMEN",
        subtitle: "Proyección semanal de caja · " + n.semanas.length + " semanas desde el " + n.semanas[0],
      }),
      React.createElement(
        "div",
        {
          style: {
            padding: "20px 48px 0",
            height: 560,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          },
        },
        React.createElement(
          "div",
          { style: { display: "flex", gap: 12 } },
          React.createElement(KpiCard, { label: "SALDO INICIAL", value: fmt(n.saldoInicial) }),
          React.createElement(KpiCard, { label: "INGRESOS PROYECTADOS", value: fmt(n.totalIngresos), color: GREEN }),
          React.createElement(KpiCard, { label: "EGRESOS PROYECTADOS", value: fmt(n.totalEgresos), color: RED }),
          React.createElement(KpiCard, {
            label: "SALDO FINAL PROYECTADO",
            value: fmt(n.saldoFinal),
            color: n.saldoFinal >= 0 ? GOLD : RED,
          }),
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 12 } },
          React.createElement(KpiCard, {
            label: "PENDIENTE DE ASIGNAR (INGRESOS)",
            value: fmt(n.pendienteAsignarIngresos),
          }),
          React.createElement(KpiCard, {
            label: "PENDIENTE DE ASIGNAR (SALIDAS SEM.)",
            value: fmt(n.pendienteAsignarSalidas),
          }),
          React.createElement(KpiCard, {
            label: "ACUERDO BANCARIO DISPONIBLE",
            value: fmt(n.totalDisponibleBancos),
            color: n.totalDisponibleBancos >= 0 ? NAVY : RED,
          }),
        ),
        React.createElement(
          "div",
          { style: { flex: 1, minHeight: 0 } },
          React.createElement(
            ResponsiveContainer,
            null,
            React.createElement(
              BarChart,
              { data: n.chartSemanas, margin: { top: 10, right: 10, left: 0, bottom: 0 } },
              React.createElement(CartesianGrid, { vertical: false, stroke: BORDER }),
              React.createElement(XAxis, {
                dataKey: "semana",
                tick: { fontSize: 9.5, fill: MUTED },
                axisLine: false,
                tickLine: false,
              }),
              React.createElement(YAxis, {
                tick: { fontSize: 9.5, fill: MUTED },
                axisLine: false,
                tickLine: false,
                tickFormatter: (g) => (g / 1e6).toFixed(0) + "M",
              }),
              React.createElement(
                Bar,
                { dataKey: "saldo", radius: [3, 3, 0, 0] },
                n.chartSemanas.map((g, C) => React.createElement(Cell, { key: C, fill: g.saldo >= 0 ? NAVY : RED })),
              ),
            ),
          ),
        ),
      ),
      React.createElement(SlideFooter, { n: 2 }),
    ),
    React.createElement(
      "div",
      { ref: d[2], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "DETALLE SEMANAL",
        subtitle: "Ingresos, egresos, neto y saldo acumulado, semana a semana",
      }),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 20, padding: "20px 48px 0" } },
        p.map((g, C) =>
          React.createElement(
            "div",
            { key: C, style: { flex: 1 } },
            React.createElement(Tbl, {
              cols: ["SEMANA", "INGRESOS", "EGRESOS", "NETO", "SALDO ACUM."],
              widths: ["0.8fr", "1fr", "1fr", "0.9fr", "1fr"],
              rows: g.map((S) => [S.semana, fmt(S.ingresos), fmt(S.egresos), fmt(S.neto), fmt(S.saldoAcum)]),
            }),
          ),
        ),
      ),
      React.createElement(SlideFooter, { n: 3 }),
    ),
    React.createElement(
      "div",
      { ref: d[3], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "BANCOS",
        subtitle: "Acuerdos de crédito / descubierto y margen disponible",
      }),
      React.createElement(
        "div",
        { style: { padding: "20px 48px 0", display: "flex", flexDirection: "column", gap: 16 } },
        React.createElement(
          "div",
          { style: { display: "flex", gap: 12 } },
          React.createElement(KpiCard, { label: "ACUERDO TOTAL", value: fmt(n.totalAcuerdoBancos) }),
          React.createElement(KpiCard, { label: "UTILIZADO", value: fmt(n.totalUtilizadoBancos), color: RED }),
          React.createElement(KpiCard, {
            label: "DISPONIBLE",
            value: fmt(n.totalDisponibleBancos),
            color: n.totalDisponibleBancos >= 0 ? GOLD : RED,
          }),
        ),
        n.bancos.length === 0
          ? React.createElement("div", { style: { fontSize: 12.5, color: MUTED } }, "No hay bancos cargados.")
          : React.createElement(Tbl, {
              cols: ["BANCO", "ACUERDO", "UTILIZADO", "DISPONIBLE"],
              widths: ["1.4fr", "1fr", "1fr", "1fr"],
              rows: n.bancos.map((g) => [
                g.nombre || "(sin nombre)",
                fmt(g.acuerdo),
                fmt(g.utilizado),
                fmt(g.disponible),
              ]),
              totalRow: ["TOTAL", fmt(n.totalAcuerdoBancos), fmt(n.totalUtilizadoBancos), fmt(n.totalDisponibleBancos)],
            }),
      ),
      React.createElement(SlideFooter, { n: 4 }),
    ),
    React.createElement(
      "div",
      { ref: d[4], style: slideFrame },
      React.createElement(SlideHeader, {
        title: "PRINCIPALES PENDIENTES",
        subtitle: "Ingresos y salidas semanales con mayor saldo sin asignar",
      }),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 20, padding: "20px 48px 0" } },
        React.createElement(
          "div",
          { style: { flex: 1 } },
          React.createElement(
            "div",
            { style: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: 0.3 } },
            "INGRESOS PENDIENTES (TOP 10)",
          ),
          n.topIngresosPendientes.length === 0
            ? React.createElement("div", { style: { fontSize: 12, color: MUTED } }, "No hay pendientes.")
            : React.createElement(Tbl, {
                cols: ["CLIENTE / OBRA", "TIPO", "PENDIENTE"],
                widths: ["1.6fr", "1.1fr", "1fr"],
                rows: n.topIngresosPendientes.map((g) => [g.cliente + " · " + g.obra, g.tipo, fmt(g.resta)]),
              }),
        ),
        React.createElement(
          "div",
          { style: { flex: 1 } },
          React.createElement(
            "div",
            { style: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: 0.3 } },
            "SALIDAS SEMANALES PENDIENTES (TOP 10)",
          ),
          n.topSalidasPendientes.length === 0
            ? React.createElement("div", { style: { fontSize: 12, color: MUTED } }, "No hay pendientes.")
            : React.createElement(Tbl, {
                cols: ["CENTRO DE COSTO", "PENDIENTE"],
                widths: ["1.6fr", "1fr"],
                rows: n.topSalidasPendientes.map((g) => [g.cliente + " · " + g.obra, fmt(g.resta)]),
              }),
        ),
      ),
      React.createElement(SlideFooter, { n: 5 }),
    ),
  );
}
