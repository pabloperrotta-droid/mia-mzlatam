const pieLabel = ({ name: n, percent: d }) => n + " " + (d * 100).toFixed(0) + "%";
function StatusBadge({ status: n, onClick: d }) {
  if (!n) return null;
  const c = n === "FINALIZADA";
  return React.createElement(
    "span",
    {
      onClick: d,
      style: {
        fontSize: 10.5,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 20,
        background: c ? "#E6EEE9" : "#F7ECD3",
        color: c ? GREEN : "#8A6A1E",
        border: "1px solid " + (c ? "#CFE0D5" : "#E9D8A8"),
        whiteSpace: "nowrap",
        letterSpacing: 0.3,
        textTransform: "uppercase",
        cursor: d ? "pointer" : "default",
      },
    },
    c ? "Finalizada" : "En proceso",
  );
}
function MBValue({ v: n }) {
  const d = n < 15 ? RED : n >= 30 ? GREEN : TEXT,
    m = markupDeMb(n);
  return React.createElement(
    "span",
    { style: { color: d, fontWeight: 600, whiteSpace: "nowrap" }, title: "Margen bruto / Markup" },
    pct(n),
    React.createElement("span", { style: { color: MUTED, fontWeight: 400 } }, " / "),
    m == null ? "—" : m.toFixed(1) + "%",
  );
}
const inputStyle = {
    border: "1px solid " + BORDER,
    borderRadius: 7,
    padding: "7px 10px",
    fontSize: 12.5,
    width: 130,
    background: "#fff",
    color: TEXT,
    outline: "none",
  },
  selectStyle = {
    border: "1px solid " + BORDER,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12.5,
    background: "#fff",
    color: TEXT,
    outline: "none",
  },
  smallBtnPrimary = {
    background: NAVY,
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "7px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(20,20,20,0.15)",
    letterSpacing: 0.1,
  },
  smallBtnGhost = {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#fff",
    color: NAVY,
    border: "1px solid " + BORDER,
    borderRadius: 7,
    padding: "7px 12px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  labelStyle = {
    display: "block",
    fontSize: 10.5,
    fontWeight: 700,
    color: MUTED,
    marginBottom: 4,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  SLIDE_W = 1280,
  SLIDE_H = 720,
  slideFrame = {
    width: SLIDE_W,
    height: SLIDE_H,
    background: "#fff",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
    color: TEXT,
  };
function SlideHeader({ title: n, subtitle: d }) {
  return React.createElement(
    "div",
    { style: { padding: "34px 48px 0" } },
    React.createElement("div", { style: { fontSize: 26, fontWeight: 800, color: NAVY, letterSpacing: 0.2 } }, n),
    React.createElement("div", { style: { fontSize: 13, color: MUTED, marginTop: 3 } }, d),
    React.createElement("div", { style: { height: 3, width: 54, background: GOLD, marginTop: 14, borderRadius: 2 } }),
  );
}
function SlideFooter({ n }) {
  return React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        left: 48,
        right: 48,
        bottom: 20,
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10,
        color: MUTED,
      },
    },
    React.createElement("div", null, "MZ LATAM · DOCUMENTO CONFIDENCIAL DE USO INTERNO"),
    React.createElement("div", null, n),
  );
}
function KpiCard({ label: n, value: d, sub: c, color: p }) {
  return React.createElement(
    "div",
    {
      style: { flex: 1, background: "#F7F6F3", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px" },
    },
    React.createElement(
      "div",
      { style: { fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 0.3, marginBottom: 6 } },
      n,
    ),
    React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: p || NAVY } }, d),
    c && React.createElement("div", { style: { fontSize: 9.5, color: MUTED, marginTop: 3 } }, c),
  );
}
function Tbl({ cols: n, rows: d, totalRow: c, widths: p }) {
  const g = p ? p.join(" ") : n.map(() => "1fr").join(" ");
  return React.createElement(
    "div",
    { style: { border: "1px solid " + BORDER, borderRadius: 8, overflow: "hidden" } },
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: g,
          columnGap: 8,
          padding: "7px 12px",
          background: "#EFEDE7",
          fontSize: 10,
          fontWeight: 700,
          color: NAVY,
        },
      },
      n.map((C, S) => React.createElement("div", { key: S, style: { textAlign: S === 0 ? "left" : "right" } }, C)),
    ),
    d.map((C, S) =>
      React.createElement(
        "div",
        {
          key: S,
          style: {
            display: "grid",
            gridTemplateColumns: g,
            columnGap: 8,
            padding: "5.5px 12px",
            fontSize: 11,
            background: S % 2 === 0 ? "#fff" : "#F7F6F3",
            borderTop: "1px solid " + BORDER,
          },
        },
        C.map((f, F) =>
          React.createElement(
            "div",
            { key: F, style: { textAlign: F === 0 ? "left" : "right", color: TEXT, fontWeight: F === 0 ? 500 : 400 } },
            f,
          ),
        ),
      ),
    ),
    c &&
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: g,
            columnGap: 8,
            padding: "7px 12px",
            fontSize: 11,
            fontWeight: 800,
            background: "#F1E9D2",
            borderTop: "1px solid " + BORDER,
            color: NAVY,
          },
        },
        c.map((C, S) => React.createElement("div", { key: S, style: { textAlign: S === 0 ? "left" : "right" } }, C)),
      ),
  );
}
