const ACTIVIDAD_EN_LINEA_MS = 9e4;
function estadoDeActividad(n) {
  if (!n || !n.ultimaVez) return { online: false, texto: "Sin actividad registrada" };
  if (Date.now() - n.ultimaVez < ACTIVIDAD_EN_LINEA_MS) return { online: true, texto: "En línea ahora" };
  const c = new Date(n.ultimaVez);
  return {
    online: false,
    texto:
      "Última vez: " +
      c.toLocaleDateString("es-AR") +
      " " +
      c.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
  };
}
function RolesAdminPanel({ onClose: n, roles: d, obras: c, onSave: p, onDelete: g, presencia: C }) {
  const S = useMemo(() => {
      const w = {};
      return (
        c.forEach((Ne) => {
          (w[Ne.cliente] || (w[Ne.cliente] = []), w[Ne.cliente].push(Ne.obra));
        }),
        w
      );
    }, [c]),
    f = ["obras", "facturacion", "proveedores", "cashflow", "pagos", "eerr", "operaciones", "veronica"];
  function F(w) {
    return w === "obras"
      ? "Obras"
      : w === "facturacion"
        ? "Facturación"
        : w === "proveedores"
          ? "Proveedores"
          : w === "cashflow"
            ? "Cashflow"
            : w === "pagos"
              ? "Pagos"
              : w === "eerr"
                ? "EERR"
                : w === "veronica"
                  ? "Verónica"
                  : "Operaciones";
  }
  function A(w, Ne) {
    return (w.permisosPorSeccion && w.permisosPorSeccion[Ne]) || w.permiso || "lectura";
  }
  const k = ["descargarBackup", "verBackupTexto", "registros", "auditoriaVentaCosto", "historial", "restaurarBackup"];
  function L(w) {
    return w === "descargarBackup"
      ? "Descargar backup"
      : w === "verBackupTexto"
        ? "Ver backup como texto"
        : w === "registros"
          ? "Registros"
          : w === "auditoriaVentaCosto"
            ? "Auditoría Venta/Costo/MB"
            : w === "historial"
              ? "Historial"
              : "Restaurar backup";
  }
  const oe = Object.fromEntries(k.map((w) => [w, false])),
    ve = {
      nombre: "",
      pin: "",
      secciones: {
        obras: false,
        facturacion: false,
        proveedores: false,
        cashflow: false,
        pagos: false,
        eerr: false,
        operaciones: false,
        veronica: false,
      },
      permisosPorSeccion: {
        obras: "lectura",
        facturacion: "lectura",
        proveedores: "lectura",
        cashflow: "lectura",
        pagos: "lectura",
        eerr: "lectura",
        operaciones: "lectura",
        veronica: "lectura",
      },
      obrasScope: { modo: "todos", items: [] },
      puedeFijarTipoCambio: false,
      puedeRegaliasPresentacion: false,
      herramientasAdmin: oe,
    },
    [P, M] = useState(ve),
    [Pe, ye] = useState(false),
    [Z, Ye] = useState(""),
    [ee, lt] = useState(null),
    [ne, Be] = useState("");
  function Le() {
    const w = d.map((Re) => {
        const dt = Object.entries(Re.secciones || {})
            .filter(([, y]) => y)
            .map(([y]) => y)
            .map((y) => F(y) + " (" + (A(Re, y) === "editar" ? "editar" : "lectura") + ")")
            .join(", "),
          Gt =
            Re.secciones && Re.secciones.obras
              ? Re.obrasScope && Re.obrasScope.modo === "filtrado"
                ? (Re.obrasScope.items || []).map((y) => y.cliente + " - " + y.obra).join(" | ")
                : "Todos los clientes"
              : "",
          vt = k.filter((y) => Re.herramientasAdmin && Re.herramientasAdmin[y]).map(L);
        return {
          Rol: Re.nombre,
          PIN: Re.pin,
          "Secciones y permiso": dt || "—",
          "Alcance en Obras": Gt || "—",
          "Tipo de Cambio": Re.puedeFijarTipoCambio ? "Puede fijar" : "No",
          "Regalías y Presentación": Re.puedeRegaliasPresentacion ? "Sí" : "No",
          "Herramientas de Admin": vt.length ? vt.join(", ") : "—",
        };
      }),
      Ne = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(Ne, XLSX.utils.json_to_sheet(w), "Roles"),
      descargarLibroXlsx(Ne, "roles_de_acceso_" + /* @__PURE__ */ new Date().toISOString().slice(0, 10) + ".xlsx"));
  }
  function Lt(w) {
    lt(w.id);
    const Ne = w.permiso || "lectura";
    (M({
      nombre: w.nombre || "",
      pin: w.pin || "",
      secciones: {
        obras: false,
        facturacion: false,
        proveedores: false,
        cashflow: false,
        pagos: false,
        eerr: false,
        operaciones: false,
        ...(w.secciones || {}),
      },
      permisosPorSeccion: {
        obras: Ne,
        facturacion: Ne,
        proveedores: Ne,
        cashflow: Ne,
        pagos: Ne,
        eerr: Ne,
        operaciones: Ne,
        veronica: Ne,
        ...(w.permisosPorSeccion || {}),
      },
      obrasScope: {
        modo: (w.obrasScope && w.obrasScope.modo) || "todos",
        items: (w.obrasScope && w.obrasScope.items) || [],
      },
      puedeFijarTipoCambio: !!w.puedeFijarTipoCambio,
      puedeRegaliasPresentacion: !!w.puedeRegaliasPresentacion,
      herramientasAdmin: { ...oe, ...(w.herramientasAdmin || {}) },
    }),
      Ye(""));
  }
  function nt() {
    (lt(null), M(ve), Ye(""));
  }
  function H(w) {
    M((Ne) => ({ ...Ne, secciones: { ...Ne.secciones, [w]: !Ne.secciones[w] } }));
  }
  function Ee(w, Ne) {
    M((Re) => ({ ...Re, permisosPorSeccion: { ...Re.permisosPorSeccion, [w]: Ne } }));
  }
  function Nt(w) {
    M((Ne) => ({ ...Ne, permisosPorSeccion: Object.fromEntries(f.map((Re) => [Re, w])) }));
  }
  function qt(w) {
    M((Ne) => ({ ...Ne, obrasScope: { ...Ne.obrasScope, modo: w } }));
  }
  function po(w) {
    M((Ne) => ({ ...Ne, herramientasAdmin: { ...Ne.herramientasAdmin, [w]: !Ne.herramientasAdmin[w] } }));
  }
  function oo(w, Ne) {
    M((Re) => {
      const at = Re.obrasScope.items || [],
        Gt = at.some((vt) => vt.cliente === w && vt.obra === Ne)
          ? at.filter((vt) => !(vt.cliente === w && vt.obra === Ne))
          : [...at, { cliente: w, obra: Ne }];
      return { ...Re, obrasScope: { ...Re.obrasScope, items: Gt } };
    });
  }
  function Eo(w, Ne) {
    M((Re) => {
      const at = Re.obrasScope.items || [],
        dt = Ne.every((y) => at.some((G) => G.cliente === w && G.obra === y)),
        Gt = at.filter((y) => y.cliente !== w),
        vt = dt ? Gt : [...Gt, ...Ne.map((y) => ({ cliente: w, obra: y }))];
      return { ...Re, obrasScope: { ...Re.obrasScope, items: vt } };
    });
  }
  async function Oo() {
    if (!P.nombre.trim() || !P.pin.trim()) {
      Ye("Completá nombre del rol y PIN.");
      return;
    }
    if (d.some((w) => w.pin === P.pin.trim() && w.id !== ee)) {
      Ye("Ya existe un rol con ese PIN. Usá uno distinto.");
      return;
    }
    if (!Object.values(P.secciones).some(Boolean)) {
      Ye("Tildá al menos una sección a ver.");
      return;
    }
    (Ye(""), ye(true));
    try {
      (await p({
        id: ee || void 0,
        nombre: P.nombre.trim(),
        pin: P.pin.trim(),
        secciones: P.secciones,
        permisosPorSeccion: P.permisosPorSeccion,
        obrasScope: P.obrasScope,
        puedeFijarTipoCambio: P.puedeFijarTipoCambio,
        puedeRegaliasPresentacion: !!P.puedeRegaliasPresentacion,
        herramientasAdmin: P.herramientasAdmin,
      }),
        M(ve),
        lt(null));
    } finally {
      ye(false);
    }
  }
  const Bo = P.obrasScope.items || [];
  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(20,20,20,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 70,
      },
    },
    React.createElement(
      "div",
      {
        style: {
          background: "#fff",
          borderRadius: 12,
          width: "90%",
          maxWidth: 920,
          height: "88%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
            borderBottom: "1px solid " + BORDER,
          },
        },
        React.createElement(
          "div",
          { style: { fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: NAVY } },
          "Roles de acceso",
        ),
        React.createElement(
          "button",
          { onClick: n, style: { border: "none", background: "none", cursor: "pointer", color: MUTED } },
          React.createElement(X, { size: 18 }),
        ),
      ),
      React.createElement(
        "div",
        { style: { flex: 1, display: "flex", overflow: "hidden" } },
        React.createElement(
          "div",
          { style: { width: 380, borderRight: "1px solid " + BORDER, padding: 18, overflowY: "auto" } },
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } },
            React.createElement(
              "div",
              { style: { fontWeight: 700, color: NAVY, fontSize: 14 } },
              ee ? "Editar rol" : "Crear rol",
            ),
            ee &&
              React.createElement(
                "button",
                {
                  onClick: nt,
                  style: {
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: MUTED,
                    fontSize: 12,
                    textDecoration: "underline",
                  },
                },
                "Cancelar",
              ),
          ),
          React.createElement("label", { style: labelStyle }, "Nombre del rol"),
          React.createElement("input", {
            style: { ...inputStyle, width: "100%", marginBottom: 10 },
            value: P.nombre,
            onChange: (w) => M({ ...P, nombre: w.target.value }),
            placeholder: "Ej: Contador",
          }),
          React.createElement("label", { style: labelStyle }, "PIN"),
          React.createElement("input", {
            style: { ...inputStyle, width: "100%", marginBottom: 14 },
            value: P.pin,
            onChange: (w) => M({ ...P, pin: w.target.value }),
            placeholder: "Ej: 7788",
          }),
          React.createElement("label", { style: labelStyle }, "Permisos adicionales"),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 } },
            React.createElement(
              "label",
              { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" } },
              React.createElement("input", {
                type: "checkbox",
                checked: !!P.puedeFijarTipoCambio,
                onChange: () => M((w) => ({ ...w, puedeFijarTipoCambio: !w.puedeFijarTipoCambio })),
              }),
              " Tipo de Cambio (puede fijar el tipo de cambio, como Comercial y Admin)",
            ),
            React.createElement(
              "label",
              { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" } },
              React.createElement("input", {
                type: "checkbox",
                checked: !!P.puedeRegaliasPresentacion,
                onChange: () => M((w) => ({ ...w, puedeRegaliasPresentacion: !w.puedeRegaliasPresentacion })),
              }),
              ' Regalías y Presentación (ve "Descargar regalías" en Facturación y "Hacer presentación" en Obras, como Comercial y Admin)',
            ),
          ),
          React.createElement("label", { style: labelStyle }, "Herramientas de Admin que este rol también puede usar"),
          React.createElement(
            "div",
            { style: { fontSize: 11.5, color: MUTED, marginBottom: 8 } },
            'Son botones que normalmente solo ve Admin (arriba a la derecha, junto a "Nueva obra"). Tildá los que quieras habilitarle a este rol puntual. "Roles" (crear o editar roles) no está en esta lista: eso sigue siendo exclusivo de Admin.',
          ),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 } },
            k.map((w) =>
              React.createElement(
                "label",
                { key: w, style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" } },
                React.createElement("input", {
                  type: "checkbox",
                  checked: !!P.herramientasAdmin[w],
                  onChange: () => po(w),
                }),
                " ",
                L(w),
              ),
            ),
          ),
          React.createElement("label", { style: labelStyle }, "Secciones a ver y permiso en cada una"),
          React.createElement(
            "div",
            { style: { display: "flex", gap: 8, marginBottom: 8 } },
            React.createElement(
              "button",
              { type: "button", onClick: () => Nt("editar"), style: smallBtnGhost },
              "Editar en todas",
            ),
            React.createElement(
              "button",
              { type: "button", onClick: () => Nt("lectura"), style: smallBtnGhost },
              "Solo lectura en todas",
            ),
          ),
          React.createElement(
            "div",
            { style: { fontSize: 11.5, color: MUTED, marginBottom: 10 } },
            "Son atajos para completar rápido: después podés dejar una sección distinta a las demás (por ejemplo, todo en solo lectura salvo Operaciones en editar).",
          ),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 } },
            f.map((w) =>
              React.createElement(
                "div",
                { key: w },
                React.createElement(
                  "label",
                  { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" } },
                  React.createElement("input", { type: "checkbox", checked: !!P.secciones[w], onChange: () => H(w) }),
                  " ",
                  F(w),
                ),
                P.secciones[w] &&
                  React.createElement(
                    "div",
                    { style: { display: "flex", gap: 12, marginLeft: 24, marginTop: 3 } },
                    React.createElement(
                      "label",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          color: MUTED,
                          cursor: "pointer",
                        },
                      },
                      React.createElement("input", {
                        type: "radio",
                        name: "permiso_" + w,
                        checked: P.permisosPorSeccion[w] === "editar",
                        onChange: () => Ee(w, "editar"),
                      }),
                      " Editar",
                    ),
                    React.createElement(
                      "label",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          color: MUTED,
                          cursor: "pointer",
                        },
                      },
                      React.createElement("input", {
                        type: "radio",
                        name: "permiso_" + w,
                        checked: P.permisosPorSeccion[w] !== "editar",
                        onChange: () => Ee(w, "lectura"),
                      }),
                      " Solo lectura",
                    ),
                  ),
              ),
            ),
          ),
          P.secciones.obras &&
            React.createElement(
              "div",
              { style: { background: BG, borderRadius: 8, padding: 12, marginBottom: 14 } },
              React.createElement(
                "div",
                { style: { fontSize: 12.5, fontWeight: 700, color: NAVY, marginBottom: 8 } },
                "Alcance dentro de Obras",
              ),
              React.createElement(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 } },
                React.createElement(
                  "label",
                  { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" } },
                  React.createElement("input", {
                    type: "radio",
                    checked: P.obrasScope.modo === "todos",
                    onChange: () => qt("todos"),
                  }),
                  " Todos los clientes",
                ),
                React.createElement(
                  "label",
                  { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" } },
                  React.createElement("input", {
                    type: "radio",
                    checked: P.obrasScope.modo === "filtrado",
                    onChange: () => qt("filtrado"),
                  }),
                  " Por cliente y centro de costo",
                ),
              ),
              P.obrasScope.modo === "filtrado" &&
                React.createElement(
                  React.Fragment,
                  null,
                  React.createElement("input", {
                    style: { ...inputStyle, width: "100%", marginBottom: 8 },
                    value: ne,
                    onChange: (w) => Be(w.target.value),
                    placeholder: "Buscar cliente o centro de costo...",
                  }),
                  React.createElement(
                    "div",
                    {
                      style: {
                        maxHeight: 260,
                        overflowY: "auto",
                        background: "#fff",
                        border: "1px solid " + BORDER,
                        borderRadius: 8,
                        padding: 8,
                      },
                    },
                    (() => {
                      const w = ne.trim().toLowerCase(),
                        Ne = Object.keys(S)
                          .sort()
                          .map((Re) => {
                            const at = S[Re],
                              dt = w
                                ? at.filter((Gt) => Re.toLowerCase().includes(w) || Gt.toLowerCase().includes(w))
                                : at;
                            return { cliente: Re, listaObras: at, obrasFiltradas: dt };
                          })
                          .filter((Re) => Re.obrasFiltradas.length > 0);
                      return Ne.length === 0
                        ? React.createElement(
                            "div",
                            { style: { fontSize: 12, color: MUTED, padding: 6 } },
                            Object.keys(S).length === 0
                              ? "Todavía no hay obras cargadas."
                              : "Sin resultados para la búsqueda.",
                          )
                        : Ne.map(({ cliente: Re, listaObras: at, obrasFiltradas: dt }) => {
                            const Gt = at.every((vt) => Bo.some((y) => y.cliente === Re && y.obra === vt));
                            return React.createElement(
                              "div",
                              { key: Re, style: { marginBottom: 8 } },
                              React.createElement(
                                "label",
                                {
                                  style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    color: NAVY,
                                    cursor: "pointer",
                                  },
                                },
                                React.createElement("input", {
                                  type: "checkbox",
                                  checked: Gt,
                                  onChange: () => Eo(Re, at),
                                }),
                                " ",
                                Re,
                              ),
                              React.createElement(
                                "div",
                                {
                                  style: {
                                    marginLeft: 22,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 3,
                                    marginTop: 3,
                                  },
                                },
                                dt.map((vt) =>
                                  React.createElement(
                                    "label",
                                    {
                                      key: vt,
                                      style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontSize: 12,
                                        color: MUTED,
                                        cursor: "pointer",
                                      },
                                    },
                                    React.createElement("input", {
                                      type: "checkbox",
                                      checked: Bo.some((y) => y.cliente === Re && y.obra === vt),
                                      onChange: () => oo(Re, vt),
                                    }),
                                    " ",
                                    vt,
                                  ),
                                ),
                              ),
                            );
                          });
                    })(),
                  ),
                ),
            ),
          Z && React.createElement("div", { style: { color: RED, fontSize: 12, marginBottom: 10 } }, Z),
          React.createElement(
            "button",
            { onClick: Oo, disabled: Pe, style: { ...smallBtnPrimary, width: "100%" } },
            Pe ? "Guardando..." : ee ? "Guardar cambios" : "Crear rol",
          ),
        ),
        React.createElement(
          "div",
          { style: { flex: 1, padding: 18, overflowY: "auto" } },
          React.createElement(
            "div",
            { style: { fontWeight: 700, color: NAVY, fontSize: 14, marginBottom: 8 } },
            "Actividad",
          ),
          React.createElement(
            "div",
            {
              style: {
                background: BG,
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 18,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              },
            },
            [
              { key: "admin", nombre: "Admin" },
              { key: "comercial", nombre: "Comercial" },
              ...d.map((w) => ({ key: "custom_" + w.id, nombre: w.nombre })),
            ].map((w) => {
              const Ne = estadoDeActividad((C || {})[w.key]);
              return React.createElement(
                "div",
                {
                  key: w.key,
                  style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 },
                },
                React.createElement(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: 8 } },
                  React.createElement("span", {
                    style: {
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: Ne.online ? "#3CB371" : "#C9C4B8",
                      flexShrink: 0,
                      display: "inline-block",
                    },
                  }),
                  React.createElement("span", { style: { fontWeight: 600, color: NAVY } }, w.nombre),
                ),
                React.createElement("span", { style: { color: MUTED } }, Ne.texto),
              );
            }),
          ),
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } },
            React.createElement(
              "div",
              { style: { fontWeight: 700, color: NAVY, fontSize: 14 } },
              "Roles creados (",
              d.length,
              ")",
            ),
            d.length > 0 &&
              React.createElement(
                "button",
                { onClick: Le, style: smallBtnGhost },
                React.createElement(Download, { size: 13 }),
                " Descargar roles",
              ),
          ),
          d.length === 0 &&
            React.createElement(
              "div",
              { style: { fontSize: 13, color: MUTED } },
              "Todavía no creaste ningún rol personalizado.",
            ),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: 10 } },
            d.map((w) => {
              const Re = Object.entries(w.secciones || {})
                  .filter(([, Gt]) => Gt)
                  .map(([Gt]) => Gt)
                  .map((Gt) => F(Gt) + " (" + (A(w, Gt) === "editar" ? "editar" : "lectura") + ")"),
                at =
                  w.secciones && w.secciones.obras
                    ? w.obrasScope && w.obrasScope.modo === "filtrado"
                      ? `${(w.obrasScope.items || []).length} centro(s) de costo seleccionados`
                      : "Todos los clientes"
                    : null,
                dt = k.filter((Gt) => w.herramientasAdmin && w.herramientasAdmin[Gt]).map(L);
              return React.createElement(
                "div",
                {
                  key: w.id,
                  style: {
                    border: "1px solid " + (ee === w.id ? GOLD : BORDER),
                    background: ee === w.id ? "#FCF8EC" : "transparent",
                    borderRadius: 10,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 10,
                  },
                },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    { style: { fontWeight: 700, color: NAVY, fontSize: 13.5 } },
                    w.nombre,
                    " ",
                    React.createElement(
                      "span",
                      { style: { color: MUTED, fontWeight: 400, fontSize: 12 } },
                      "· PIN ",
                      w.pin,
                    ),
                  ),
                  React.createElement(
                    "div",
                    { style: { fontSize: 12, color: MUTED, marginTop: 3 } },
                    "Ve: ",
                    Re.length ? Re.join(", ") : "—",
                  ),
                  at &&
                    React.createElement("div", { style: { fontSize: 12, color: MUTED, marginTop: 3 } }, "Obras: ", at),
                  w.puedeFijarTipoCambio &&
                    React.createElement(
                      "div",
                      { style: { fontSize: 12, color: MUTED, marginTop: 3 } },
                      "Puede fijar el tipo de cambio",
                    ),
                  w.puedeRegaliasPresentacion &&
                    React.createElement(
                      "div",
                      { style: { fontSize: 12, color: MUTED, marginTop: 3 } },
                      "Ve Descargar regalías y Hacer presentación",
                    ),
                  dt.length > 0 &&
                    React.createElement(
                      "div",
                      { style: { fontSize: 12, color: MUTED, marginTop: 3 } },
                      "Herramientas de Admin: ",
                      dt.join(", "),
                    ),
                ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 10, flexShrink: 0 } },
                  React.createElement(
                    "button",
                    {
                      onClick: () => Lt(w),
                      title: "Editar rol",
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(Pencil, { size: 15 }),
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => {
                        (ee === w.id && nt(), g(w.id));
                      },
                      title: "Eliminar rol",
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(Trash2, { size: 16 }),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    ),
  );
}
function HistorialPanel({ onClose: n, db: d }) {
  const [c, p] = useState(null),
    [g, C] = useState(""),
    [S, f] = useState(null);
  useEffect(() => {
    let A = false;
    if (!d) {
      (C("No hay conexión con la base de datos."), p([]));
      return;
    }
    return (
      d
        .collection("historial")
        .get()
        .then((k) => {
          if (A) return;
          const L = k.docs.map((oe) => {
            const ve = oe.data() || {};
            return {
              id: oe.id,
              obras: (ve.obras || []).length,
              facturas: (ve.facturas || []).length,
              pagos: (ve.pagosSemanales || []).length,
              guardadoEl: ve.exportadoEl || null,
            };
          });
          (L.sort((oe, ve) => (oe.id < ve.id ? 1 : -1)), p(L));
        })
        .catch(() => {
          A || (C("No se pudo cargar el historial."), p([]));
        }),
      () => {
        A = true;
      }
    );
  }, [d]);
  async function F(A) {
    f(A);
    try {
      const k = await d.collection("historial").doc(A).get();
      if (!k.exists) {
        alert("Esa foto ya no está disponible.");
        return;
      }
      const L = k.data();
      await ofrecerDescarga("historial_" + A + ".json", JSON.stringify(L, null, 2));
    } catch {
      alert("No se pudo descargar la foto de " + A + ".");
    } finally {
      f(null);
    }
  }
  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(20,20,20,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 70,
      },
    },
    React.createElement(
      "div",
      {
        style: {
          background: "#fff",
          borderRadius: 12,
          width: "90%",
          maxWidth: 640,
          maxHeight: "82%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
            borderBottom: "1px solid " + BORDER,
          },
        },
        React.createElement(
          "div",
          { style: { fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: NAVY } },
          "Historial diario",
        ),
        React.createElement(
          "button",
          { onClick: n, style: { border: "none", background: "none", cursor: "pointer", color: MUTED } },
          React.createElement(X, { size: 18 }),
        ),
      ),
      React.createElement(
        "div",
        {
          style: {
            padding: "10px 20px",
            borderBottom: "1px solid " + BORDER,
            fontSize: 12,
            color: MUTED,
            lineHeight: 1.4,
          },
        },
        "Todos los días se guarda sola una foto de Obras, Facturación, Pagos y Cashflow (se pisa con lo más nuevo mientras avanza el día). Se conservan los últimos 90 días. Elegí un día para descargarlo como archivo.",
      ),
      React.createElement(
        "div",
        { style: { flex: 1, overflowY: "auto", padding: "8px 20px 18px" } },
        c === null
          ? React.createElement("div", { style: { padding: 16, fontSize: 12.5, color: MUTED } }, "Cargando...")
          : g
            ? React.createElement("div", { style: { padding: 16, fontSize: 12.5, color: RED } }, g)
            : c.length === 0
              ? React.createElement(
                  "div",
                  { style: { padding: 16, fontSize: 12.5, color: MUTED } },
                  "Todavía no hay ninguna foto guardada. La primera se guarda sola la próxima vez que alguien tenga la app abierta.",
                )
              : c.map((A) =>
                  React.createElement(
                    "div",
                    {
                      key: A.id,
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: "1px solid " + BORDER,
                      },
                    },
                    React.createElement(
                      "div",
                      null,
                      React.createElement("div", { style: { fontWeight: 700, color: NAVY, fontSize: 13.5 } }, A.id),
                      React.createElement(
                        "div",
                        { style: { fontSize: 11.5, color: MUTED } },
                        A.obras,
                        " obras · ",
                        A.facturas,
                        " facturas · ",
                        A.pagos,
                        " líneas de pagos",
                      ),
                    ),
                    React.createElement(
                      "button",
                      {
                        onClick: () => F(A.id),
                        disabled: S === A.id,
                        style: { ...smallBtnGhost, opacity: S === A.id ? 0.6 : 1 },
                      },
                      S === A.id ? "Descargando..." : "Descargar",
                    ),
                  ),
                ),
      ),
    ),
  );
}
