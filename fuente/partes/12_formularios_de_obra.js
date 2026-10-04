function EditObraForm({ obra: n, onCancel: d, onSave: c }) {
  const [p, g] = useState({
      cliente: n.cliente,
      obra: n.obra,
      venta: n.ventaOriginalManual !== void 0 ? n.ventaOriginalManual : n.ventaOriginal,
      costoInicial: n.costoInicialManual !== void 0 ? n.costoInicialManual : n.costoInicial,
      status: n.status || "EN PROCESO",
      mes: n.mes || "ENERO",
      anio: n.anio || /* @__PURE__ */ new Date().getFullYear(),
    }),
    C = Number(p.venta) || 0,
    S = n.cliente === "WU" && n.totalSubobras > 0,
    f = S ? n.costoInicial || 0 : Number(p.costoInicial) || 0,
    F = C ? ((C - f) / C) * 100 : null;
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
      { style: { fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12 } },
      "Editar obra",
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 12, marginBottom: 12 } },
      React.createElement(
        "div",
        { style: { flex: 1 } },
        React.createElement("label", { style: labelStyle }, "Cliente (solo afecta a esta obra)"),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          value: p.cliente,
          onChange: (A) => g({ ...p, cliente: A.target.value }),
        }),
      ),
      React.createElement(
        "div",
        { style: { flex: 1 } },
        React.createElement("label", { style: labelStyle }, "Centro de costo"),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          value: p.obra,
          onChange: (A) => g({ ...p, obra: A.target.value }),
        }),
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          columnGap: 10,
          gap: 12,
          marginBottom: 14,
        },
      },
      React.createElement(
        "div",
        null,
        React.createElement("label", { style: labelStyle }, "Venta Original"),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          type: "number",
          value: p.venta,
          onChange: (A) => g({ ...p, venta: A.target.value }),
        }),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { style: labelStyle }, "Costo inicial", S ? " (auto: Orden de Compra / 1,4)" : ""),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%", ...(S ? { background: BG, color: MUTED } : {}) },
          type: "number",
          value: S ? Math.round(n.costoInicial || 0) : p.costoInicial,
          onChange: (A) => g({ ...p, costoInicial: A.target.value }),
          disabled: S,
          title: S
            ? "Se calcula solo: Venta de Orden de Compra vigente / 1,4. Cambia únicamente si cambia esa Venta de Orden de Compra."
            : void 0,
        }),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { style: labelStyle }, "Estado"),
        React.createElement(
          "select",
          {
            style: { ...selectStyle, width: "100%" },
            value: p.status,
            onChange: (A) => g({ ...p, status: A.target.value }),
          },
          React.createElement("option", { value: "EN PROCESO" }, "En proceso"),
          React.createElement("option", { value: "FINALIZADA" }, "Finalizada"),
        ),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { style: labelStyle }, "Mes"),
        React.createElement(
          "select",
          { style: { ...selectStyle, width: "100%" }, value: p.mes, onChange: (A) => g({ ...p, mes: A.target.value }) },
          MESES.map((A) => React.createElement("option", { key: A, value: A }, A.charAt(0) + A.slice(1).toLowerCase())),
        ),
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", { style: labelStyle }, "Año"),
        React.createElement("input", {
          style: { ...inputStyle, width: "100%" },
          type: "number",
          value: p.anio,
          onChange: (A) => g({ ...p, anio: A.target.value }),
        }),
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          background: BG,
          borderRadius: 8,
          padding: "10px 12px",
          marginBottom: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      },
      React.createElement("span", { style: { fontSize: 12, color: MUTED, fontWeight: 700 } }, "MARGEN BRUTO INICIAL / MARKUP"),
      React.createElement(
        "span",
        { style: { fontSize: 16, fontWeight: 700, color: F === null ? MUTED : F < 15 ? RED : F >= 30 ? GREEN : NAVY } },
        F === null ? "—" : pctMk(F),
      ),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 8, justifyContent: "flex-end" } },
      React.createElement("button", { onClick: d, style: smallBtnGhost }, "Cancelar"),
      React.createElement("button", { onClick: () => c(p), style: smallBtnPrimary }, "Guardar cambios"),
    ),
  );
}
function NewObraForm({ onCancel: n, onSave: d }) {
  const [c, p] = useState({
      cliente: "",
      obra: "",
      venta: "",
      costoInicial: "",
      mes: "ENERO",
      anio: /* @__PURE__ */ new Date().getFullYear(),
    }),
    g = Number(c.venta) || 0,
    C = Number(c.costoInicial) || 0,
    S = g ? ((g - C) / g) * 100 : null;
  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(20,20,20,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      },
    },
    React.createElement(
      "div",
      { style: { background: "#fff", borderRadius: 12, padding: 24, width: 380 } },
      React.createElement(
        "div",
        { style: { fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 14 } },
        "Nueva obra",
      ),
      React.createElement("label", { style: labelStyle }, "Cliente"),
      React.createElement("input", {
        style: { ...inputStyle, width: "100%", marginBottom: 10 },
        value: c.cliente,
        onChange: (f) => p({ ...c, cliente: f.target.value }),
        placeholder: "Ej: PANDORA",
      }),
      React.createElement("label", { style: labelStyle }, "Centro de costo"),
      React.createElement("input", {
        style: { ...inputStyle, width: "100%", marginBottom: 10 },
        value: c.obra,
        onChange: (f) => p({ ...c, obra: f.target.value }),
        placeholder: "Ej: DOT 4",
      }),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 8, marginBottom: 10 } },
        React.createElement(
          "div",
          { style: { flex: 1 } },
          React.createElement("label", { style: labelStyle }, "Mes de ejecución"),
          React.createElement(
            "select",
            {
              style: { ...selectStyle, width: "100%" },
              value: c.mes,
              onChange: (f) => p({ ...c, mes: f.target.value }),
            },
            MESES.map((f) =>
              React.createElement("option", { key: f, value: f }, f.charAt(0) + f.slice(1).toLowerCase()),
            ),
          ),
        ),
        React.createElement(
          "div",
          { style: { width: 100 } },
          React.createElement("label", { style: labelStyle }, "Año"),
          React.createElement("input", {
            style: { ...inputStyle, width: "100%" },
            type: "number",
            value: c.anio,
            onChange: (f) => p({ ...c, anio: f.target.value }),
          }),
        ),
      ),
      React.createElement("label", { style: labelStyle }, "Venta Original"),
      React.createElement("input", {
        style: { ...inputStyle, width: "100%", marginBottom: 10 },
        type: "number",
        value: c.venta,
        onChange: (f) => p({ ...c, venta: f.target.value }),
        placeholder: "0",
      }),
      React.createElement("label", { style: labelStyle }, "Costo inicial"),
      React.createElement("input", {
        style: { ...inputStyle, width: "100%", marginBottom: 10 },
        type: "number",
        value: c.costoInicial,
        onChange: (f) => p({ ...c, costoInicial: f.target.value }),
        placeholder: "0",
      }),
      React.createElement(
        "div",
        {
          style: {
            background: BG,
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
        },
        React.createElement("span", { style: { fontSize: 12, color: MUTED, fontWeight: 700 } }, "MARGEN BRUTO INICIAL / MARKUP"),
        React.createElement(
          "span",
          {
            style: { fontSize: 16, fontWeight: 700, color: S === null ? MUTED : S < 15 ? RED : S >= 30 ? GREEN : NAVY },
          },
          S === null ? "—" : pctMk(S),
        ),
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 8, justifyContent: "flex-end" } },
        React.createElement("button", { onClick: n, style: smallBtnGhost }, "Cancelar"),
        React.createElement(
          "button",
          { onClick: () => c.cliente && c.obra && d(c), style: smallBtnPrimary },
          "Crear obra",
        ),
      ),
    ),
  );
}
