function PinGateScreen({ pinInput: n, onChangePin: d, onSubmit: c, error: p }) {
  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "#2E2925",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        zIndex: 1e3,
        padding: 20,
      },
    },
    React.createElement("img", {
      src: LOGO_MZLATAM_DATA_URI,
      alt: "MZ LATAM",
      style: { width: 280, maxWidth: "80vw", height: "auto", display: "block" },
    }),
    React.createElement(
      "div",
      {
        style: {
          fontFamily: "Georgia, serif",
          fontSize: 18,
          fontWeight: 500,
          color: "#fff",
          letterSpacing: 3,
          marginTop: 12,
          marginBottom: 40,
        },
      },
      "MIA",
    ),
    React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 } },
      React.createElement("input", {
        type: "password",
        placeholder: "PIN",
        value: n,
        onChange: (g) => d(g.target.value),
        onKeyDown: (g) => {
          g.key === "Enter" && c();
        },
        autoFocus: true,
        style: {
          width: 160,
          textAlign: "center",
          fontSize: 16,
          letterSpacing: 2,
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          outline: "none",
        },
      }),
      React.createElement(
        "button",
        {
          onClick: c,
          style: {
            width: 160,
            border: "none",
            background: GOLD,
            color: "#1A1A1A",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.3,
          },
        },
        "Entrar",
      ),
      p && React.createElement("span", { style: { fontSize: 12.5, color: "#F5A3A3", marginTop: 2 } }, "PIN incorrecto"),
    ),
  );
}
