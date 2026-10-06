// (Continúa la función App: lo que se dibuja en pantalla.)
  return ct === "operaciones"
    ? React.createElement(PinGateScreen, {
        pinInput: cn,
        onChangePin: (e) => {
          (on(e), kn(false));
        },
        onSubmit: rr,
        error: En,
      })
    : React.createElement(
        "div",
        {
          style: {
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            background: BG,
            minHeight: "100vh",
            color: TEXT,
          },
        },
        errorGuardado &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.55)",
                zIndex: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              },
            },
            React.createElement(
              "div",
              {
                role: "alertdialog",
                style: {
                  background: "#fff",
                  borderRadius: 14,
                  padding: "22px 26px",
                  maxWidth: 470,
                  width: "100%",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  borderTop: "5px solid " + RED,
                },
              },
              React.createElement(
                "div",
                { style: { fontSize: 17, fontWeight: 700, color: RED, marginBottom: 10 } },
                "⚠ No se guardaron los cambios",
              ),
              React.createElement(
                "div",
                { style: { fontSize: 13.5, color: TEXT, lineHeight: 1.5, marginBottom: 8 } },
                "Los últimos cambios que hiciste NO se guardaron en la base de datos. No cierres ni recargues la página y contactá al administrador.",
              ),
              React.createElement(
                "div",
                { style: { fontSize: 11.5, color: MUTED, marginBottom: 18 } },
                "Detalle: ",
                errorGuardado.motivo,
              ),
              React.createElement(
                "div",
                { style: { display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" } },
                React.createElement(
                  "button",
                  { onClick: () => setErrorGuardado(null), style: smallBtnGhost },
                  "Cerrar",
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (setErrorGuardado(null), setReintentoGuardado((n) => n + 1));
                    },
                    style: smallBtnPrimary,
                  },
                  "Reintentar guardar",
                ),
              ),
            ),
          ),
        avisoDescartado &&
          avisoDescartado.length > 0 &&
          React.createElement(
            "div",
            { role: "alert", style: { background: "#7A1F1F", color: "#fff", fontSize: 13, padding: "10px 20px", display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap" } },
            React.createElement(
              "div",
              { style: { maxWidth: 900 } },
              React.createElement("strong", null, "⚠ No se guardó tu cambio en: "),
              avisoDescartado.slice(0, 6).join(" · "),
              avisoDescartado.length > 6 ? " y " + (avisoDescartado.length - 6) + " más" : "",
              ". Otra pantalla ya lo había cambiado o borrado (por ejemplo, le cambió el nombre) y tu pantalla tenía los datos viejos. Revisalo y, si hace falta, volvé a hacer el cambio.",
            ),
            React.createElement(
              "button",
              { onClick: () => setAvisoDescartado(null), style: { ...smallBtnGhost, background: "#fff", color: "#7A1F1F", padding: "3px 10px" } },
              "Entendido",
            ),
          ),
        avisoPisado &&
          avisoPisado.length > 0 &&
          React.createElement(
            "div",
            { role: "alert", style: { background: "#7A1F1F", color: "#fff", fontSize: 13, padding: "10px 20px", display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap" } },
            React.createElement(
              "div",
              { style: { maxWidth: 900 } },
              React.createElement("strong", null, "⚠ Otra pantalla cambió cosas que vos habías guardado recién: "),
              avisoPisado.slice(0, 6).join(" · "),
              avisoPisado.length > 6 ? " y " + (avisoPisado.length - 6) + " más" : "",
              ". Revisalas y, si hace falta, volvé a cargarlas. Fijate en Herramientas → Historial quién hizo el cambio.",
            ),
            React.createElement(
              "button",
              { onClick: () => setAvisoPisado(null), style: { ...smallBtnGhost, background: "#fff", color: "#7A1F1F", padding: "3px 10px" } },
              "Entendido",
            ),
          ),
        versionNueva &&
          React.createElement(
            "div",
            { style: { background: "#7A1F1F", color: "#fff", fontSize: 13, padding: "8px 20px", textAlign: "center", display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" } },
            "Hay una versión nueva de MIA. Recargá la página para seguir trabajando con la última versión.",
            React.createElement(
              "button",
              { onClick: () => window.location.reload(), style: { ...smallBtnGhost, background: "#fff", color: "#7A1F1F", padding: "3px 10px" } },
              "Recargar",
            ),
          ),
        otraPestana &&
          React.createElement(
            "div",
            { style: { background: "#4A3B12", color: "#F5E9C8", fontSize: 12.5, padding: "8px 20px", textAlign: "center" } },
            "MIA está abierta en otra pestaña de este navegador. Usá una sola, así los cambios de una no pisan los de la otra.",
          ),
        (estadoConexion === "unavailable" || estadoConexion === "error" || avisoGuardado) &&
          React.createElement(
            "div",
            {
              style: {
                background: estadoConexion === "unavailable" || estadoConexion === "error" ? "#3A2323" : "#4A3B12",
                color: "#F5E9C8",
                fontSize: 12.5,
                padding: "8px 20px",
                textAlign: "center",
              },
            },
            estadoConexion === "unavailable"
              ? "No se pudo conectar al almacenamiento compartido. Los cambios que hagas ahora no se van a guardar."
              : estadoConexion === "error"
                ? "Hubo un problema al conectar con el almacenamiento compartido. Probá recargar la página."
                : avisoGuardado,
          ),
        moneda === "USD" &&
          !tipoCambio &&
          React.createElement(
            "div",
            {
              style: {
                background: "#4A3B12",
                color: "#F5E9C8",
                fontSize: 12.5,
                padding: "8px 20px",
                textAlign: "center",
              },
            },
            Sn
              ? 'Todavía no fijaste un tipo de cambio, así que no se pueden mostrar los montos en dólares. Hacé clic en "Dólar: sin fijar" arriba a la derecha para cargarlo.'
              : "Todavía no hay un tipo de cambio cargado, así que no se pueden mostrar los montos en dólares.",
          ),
        React.createElement(
          "div",
          {
            ref: ht,
            style: {
              background: HEADER_BG,
              padding: "18px 28px",
              display: "flex",
              justifyContent: "flex-start",
              columnGap: 40,
              alignItems: "flex-start",
              flexWrap: "wrap",
              rowGap: 14,
              borderBottom: "3px solid " + GOLD,
              position: "sticky",
              top: 0,
              zIndex: 40,
            },
          },
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 12 } },
              // Sección 95: el logo (blanco) en lugar del texto "MZ LATAM".
              React.createElement("img", {
                src: LOGO_MZLATAM_TRANSPARENTE,
                alt: "MZ LATAM",
                style: { height: 34, width: "auto", display: "block", marginRight: 8 },
              }),
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 7,
                    padding: 2,
                    border: "1px solid rgba(255,255,255,0.15)",
                  },
                },
                ["ARS", "USD"].map((e) =>
                  React.createElement(
                    "button",
                    {
                      key: e,
                      onClick: () => setMoneda(e),
                      title:
                        e === "USD"
                          ? "Ver todos los montos convertidos a dólares (al tipo de cambio vigente de cada registro)"
                          : "Ver todos los montos en pesos",
                      style: {
                        border: "none",
                        padding: "4px 10px",
                        borderRadius: 5,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: moneda === e ? GOLD : "transparent",
                        color: moneda === e ? NAVY : "rgba(255,255,255,0.7)",
                        letterSpacing: 0.2,
                      },
                    },
                    e === "ARS" ? "$ Pesos" : "US$ Dólares",
                  ),
                ),
              ),
              Ve
                ? React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: 4 } },
                    React.createElement("input", {
                      type: "number",
                      autoFocus: true,
                      placeholder: "Ej: 1450",
                      value: l,
                      onChange: (e) => I(e.target.value),
                      onKeyDown: (e) => {
                        (e.key === "Enter" && (setTipoCambio(Number(l) || 0), bo(false)), e.key === "Escape" && bo(false));
                      },
                      style: { ...inputStyle, width: 80 },
                    }),
                    React.createElement(
                      "button",
                      {
                        onClick: () => {
                          (setTipoCambio(Number(l) || 0), bo(false));
                        },
                        style: {
                          border: "none",
                          background: GOLD,
                          color: NAVY,
                          borderRadius: 6,
                          padding: "5px 8px",
                          cursor: "pointer",
                          fontWeight: 700,
                        },
                      },
                      "✓",
                    ),
                    React.createElement(
                      "button",
                      {
                        onClick: () => bo(false),
                        style: {
                          border: "1px solid rgba(255,255,255,0.25)",
                          background: "transparent",
                          color: "rgba(255,255,255,0.7)",
                          borderRadius: 6,
                          padding: "5px 8px",
                          cursor: "pointer",
                        },
                      },
                      "✕",
                    ),
                  )
                : React.createElement(
                    "button",
                    {
                      onClick: Sn
                        ? () => {
                            (I(tipoCambio ? String(tipoCambio) : ""), bo(true));
                          }
                        : void 0,
                      title: Sn
                        ? "Tipo de cambio vigente: se graba en cada monto nuevo que se cargue de acá en adelante, y no se borra hasta que lo modifiques."
                        : "Tipo de cambio vigente (usado para mostrar los montos en dólares)",
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        border: "1px solid rgba(255,255,255,0.25)",
                        background: "transparent",
                        color: "rgba(255,255,255,0.85)",
                        padding: "5px 9px",
                        borderRadius: 8,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        cursor: Sn ? "pointer" : "default",
                      },
                    },
                    "Dólar: ",
                    tipoCambio ? "$" + Number(tipoCambio).toLocaleString("de-DE") : "sin fijar",
                    Sn && React.createElement(Pencil, { size: 11 }),
                  ),
            ),
            React.createElement(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 10 } },
              un.length > 1
                ? React.createElement(
                    React.Fragment,
                    null,
                    un.map((e) =>
                      React.createElement(
                        "div",
                        {
                          key: e.anio,
                          style: {
                            display: "grid",
                            gridTemplateColumns: "48px 119px 106px 212px 99px",
                            alignItems: "center",
                            columnGap: 14,
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: 0.4 } },
                          e.anio,
                        ),
                        React.createElement(
                          "div",
                          { style: { whiteSpace: "nowrap" } },
                          React.createElement(
                            "span",
                            { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" } },
                            e.clientCount,
                          ),
                          React.createElement(
                            "span",
                            { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                            "CLIENTES",
                          ),
                        ),
                        React.createElement(
                          "div",
                          { style: { whiteSpace: "nowrap" } },
                          React.createElement(
                            "span",
                            { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" } },
                            e.count,
                          ),
                          React.createElement(
                            "span",
                            { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                            "OBRAS",
                          ),
                        ),
                        React.createElement(
                          "div",
                          {
                            style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
                            title: fmtSmart(e.venta, e.ventaUSD),
                          },
                          React.createElement(
                            "span",
                            { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" } },
                            fmtSmart(e.venta, e.ventaUSD),
                          ),
                          React.createElement(
                            "span",
                            { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                            "VENTA",
                          ),
                        ),
                        React.createElement(
                          "div",
                          { style: { whiteSpace: "nowrap" } },
                          React.createElement(
                            "span",
                            { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" } },
                            pctMkSmart(e.mb, e.mbUSD),
                          ),
                          React.createElement(
                            "span",
                            { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                            "MB / MARKUP",
                          ),
                        ),
                      ),
                    ),
                    React.createElement("div", {
                      style: { height: 1, background: "rgba(255,255,255,0.25)", margin: "2px 0" },
                    }),
                    React.createElement(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "48px 119px 106px 212px 99px 1fr",
                          alignItems: "center",
                          columnGap: 14,
                        },
                      },
                      React.createElement(
                        "div",
                        { style: { fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 0.4 } },
                        "TOTAL",
                      ),
                      React.createElement(
                        "div",
                        { style: { whiteSpace: "nowrap" } },
                        React.createElement(
                          "span",
                          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD } },
                          ro.clientCount,
                        ),
                        React.createElement(
                          "span",
                          { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                          "CLIENTES",
                        ),
                      ),
                      React.createElement(
                        "div",
                        { style: { whiteSpace: "nowrap" } },
                        React.createElement(
                          "span",
                          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD } },
                          ro.count,
                        ),
                        React.createElement(
                          "span",
                          { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                          "OBRAS",
                        ),
                      ),
                      React.createElement(
                        "div",
                        {
                          style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
                          title: fmtSmart(ro.venta, ro.ventaUSD),
                        },
                        React.createElement(
                          "span",
                          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD } },
                          fmtSmart(ro.venta, ro.ventaUSD),
                        ),
                        React.createElement(
                          "span",
                          { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                          "VENTA",
                        ),
                      ),
                      React.createElement(
                        "div",
                        { style: { whiteSpace: "nowrap" } },
                        React.createElement(
                          "span",
                          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD } },
                          pctMkSmart(ro.mb, ro.mbUSD),
                        ),
                        React.createElement(
                          "span",
                          { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                          "MB / MARKUP",
                        ),
                      ),
                    ),
                  )
                : React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", rowGap: 6 } },
                    React.createElement(
                      "div",
                      { style: { whiteSpace: "nowrap" } },
                      React.createElement(
                        "span",
                        { style: { fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" } },
                        ro.clientCount,
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 },
                        },
                        "CLIENTES",
                      ),
                    ),
                    React.createElement("div", {
                      style: { width: 1, height: 14, background: "rgba(255,255,255,0.18)" },
                    }),
                    React.createElement(
                      "div",
                      { style: { whiteSpace: "nowrap" } },
                      React.createElement(
                        "span",
                        { style: { fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" } },
                        ro.count,
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 },
                        },
                        "OBRAS",
                      ),
                    ),
                    React.createElement("div", {
                      style: { width: 1, height: 14, background: "rgba(255,255,255,0.18)" },
                    }),
                    React.createElement(
                      "div",
                      { style: { whiteSpace: "nowrap" } },
                      React.createElement(
                        "span",
                        { style: { fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: GOLD } },
                        fmtSmart(ro.venta, ro.ventaUSD),
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 },
                        },
                        "VENTA TOTAL",
                      ),
                    ),
                    React.createElement("div", {
                      style: { width: 1, height: 14, background: "rgba(255,255,255,0.18)" },
                    }),
                    React.createElement(
                      "div",
                      { style: { whiteSpace: "nowrap" } },
                      React.createElement(
                        "span",
                        { style: { fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" } },
                        pctMkSmart(ro.mb, ro.mbUSD),
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 },
                        },
                        "MARGEN BRUTO / MARKUP",
                      ),
                    ),
                  ),
              vista === "obras" &&
                xn.length > 1 &&
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 5, marginTop: 2 } },
                  xn.map((e, t) => {
                    const o = pt[e] === true;
                    return React.createElement(
                      "button",
                      {
                        key: e,
                        onClick: () => Io((a) => ({ ...a, [e]: !o })),
                        style: {
                          border: "1px solid " + (o ? PIE_COLORS[t % PIE_COLORS.length] : "rgba(255,255,255,0.25)"),
                          background: o ? PIE_COLORS[t % PIE_COLORS.length] : "transparent",
                          color: o ? "#fff" : "rgba(255,255,255,0.75)",
                          borderRadius: 20,
                          padding: "4px 9px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        },
                      },
                      e,
                    );
                  }),
                ),
            ),
          ),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, marginLeft: "auto" } },
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" } },
              React.createElement(
                "div",
                {
                  role: "tablist",
                  style: { display: "flex", gap: 2, flexWrap: "wrap" },
                },
                ["obras", "facturacion", "proveedores", "cashflow", "pagos", "eerr", "operaciones", "veronica"]
                  .filter((e) => Jn[e])
                  .map((e) =>
                    React.createElement(
                      "button",
                      {
                        key: e,
                        onClick: () => {
                          (setVista(e), lo(false), e === "obras" && (be(null), no(null), it(null)));
                        },
                        role: "tab",
                        "aria-selected": vista === e,
                        className: "pestana-principal",
                        style: {
                          border: "none",
                          borderBottom: "2px solid " + (vista === e ? GOLD : "transparent"),
                          padding: "7px 12px 6px",
                          borderRadius: 0,
                          fontSize: 13.5,
                          fontWeight: vista === e ? 700 : 500,
                          cursor: "pointer",
                          background: "transparent",
                          color: vista === e ? "#fff" : "rgba(255,255,255,0.68)",
                          transition: "color 0.15s, border-color 0.15s",
                        },
                      },
                      e === "obras"
                        ? "Obras"
                        : e === "facturacion"
                          ? "Facturación"
                          : e === "proveedores"
                            ? "Proveedores"
                            : e === "cashflow"
                              ? "Cashflow"
                              : e === "pagos"
                                ? "Pagos"
                                : e === "eerr"
                                  ? "EERR"
                                  : e === "veronica"
                                    ? "Verónica"
                                    : "Operaciones",
                    ),
                  ),
              ),
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center" } },
                React.createElement(
                  "button",
                  {
                    onClick: Ia,
                    title: "Cerrar sesión",
                    style: {
                      border: "1px solid " + GOLD,
                      background: "transparent",
                      color: GOLD,
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  ct === "admin" ? "Admin ✓" : ct === "comercial" ? "Comercial ✓" : (so ? so.nombre : "Rol") + " ✓",
                ),
              ),
            ),
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
              vista === "obras" &&
                Rt &&
                React.createElement(
                  "button",
                  {
                    onClick: () => ln(true),
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: GOLD,
                      color: NAVY,
                      border: "none",
                      padding: "7px 13px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13.5,
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                      letterSpacing: 0.15,
                    },
                  },
                  React.createElement(Plus, { size: 15 }),
                  " Nueva obra",
                ),
              Zn("obras") === "editar" &&
                React.createElement(
                  "button",
                  {
                    onClick: deshacerUltimoCambio,
                    disabled: historialDeshacer.length === 0,
                    title:
                      historialDeshacer.length === 0
                        ? "No hay cambios para deshacer"
                        : "Vuelve al estado de antes del último cambio guardado (podés hacer clic varias veces para retroceder más)",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: historialDeshacer.length === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: historialDeshacer.length === 0 ? "default" : "pointer",
                    },
                  },
                  React.createElement(ArrowLeft, { size: 12 }),
                  " Deshacer",
                  historialDeshacer.length > 0 ? " (" + historialDeshacer.length + ")" : "",
                ),
              Zn("obras") === "editar" &&
                historialRehacer.length > 0 &&
                React.createElement(
                  "button",
                  {
                    onClick: rehacerUltimoCambio,
                    title: "Vuelve a aplicar lo último que deshiciste (se puede mientras no hagas otro cambio)",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.85)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Rehacer",
                  " (" + historialRehacer.length + ")",
                  React.createElement(ArrowLeft, { size: 12, style: { transform: "scaleX(-1)" } }),
                ),
              React.createElement(
                MenuHerramientas,
                null,
              Zn("obras") === "editar" &&
                React.createElement(
                  "button",
                  {
                    onClick: $r,
                    title: "Facturas borradas: se pueden restaurar desde acá",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.85)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  React.createElement(Trash2, { size: 12 }),
                  " Papelera de facturas",
                ),
              fn &&
                React.createElement(
                  "button",
                  {
                    onClick: () => fa(true),
                    title: "Crear roles con PIN propio: qué pueden editar y qué secciones ven",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Roles",
                ),
              In("descargarBackup") &&
                React.createElement(
                  "button",
                  {
                    onClick: dr,
                    title:
                      "Descarga un archivo con TODOS los datos de la app, para restaurarlos en otro link publicado",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Descargar backup",
                ),
              In("verBackupTexto") &&
                React.createElement(
                  "button",
                  {
                    onClick: () => $o(na()),
                    title: "Si la descarga se bloquea, mostrá el backup como texto para copiarlo a mano",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.6)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Ver backup como texto",
                ),
              ct === "admin" &&
                estadoConexion !== "unavailable" &&
                React.createElement(
                  "button",
                  {
                    onClick: recargarTodasLasPantallas,
                    title: "Recarga MIA en todas las pantallas abiertas (de todos los usuarios), para que todas usen la última versión",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Recargar MIA en todas las pantallas",
                ),
              In("registros") &&
                React.createElement(
                  "button",
                  {
                    onClick: () => va(true),
                    title: "Bitácora de cambios de los últimos 3 días: qué se cambió y qué rol lo hizo",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Registros",
                ),
              In("auditoriaVentaCosto") &&
                React.createElement(
                  "button",
                  {
                    onClick: () => ya(true),
                    title:
                      "Cada vez que cambia la Venta Total, el Costo Real o el MB de una obra: fecha, cliente, centro de costo y qué cambió (proveedor o adicional nuevo, eliminado, o cambio de monto). Se guarda solo las últimas 48hs y se puede descargar en Excel.",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Auditoría Venta/Costo/MB",
                ),
              In("historial") &&
                React.createElement(
                  "button",
                  {
                    onClick: () => ma(true),
                    title:
                      "Foto diaria de Obras, Facturación, Pagos y Cashflow, guardada sola todos los días (últimos 90 días)",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Historial",
                ),
              In("restaurarBackup") &&
                React.createElement(
                  "label",
                  {
                    title: "Restaura todos los datos desde un archivo de backup descargado antes",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Restaurar backup",
                  React.createElement("input", {
                    type: "file",
                    accept: "application/json",
                    style: { display: "none" },
                    onChange: async (e) => {
                      const t = e.target.files[0];
                      if (t) {
                        try {
                          (await gr(t), ho("Backup restaurado correctamente."));
                        } catch {
                          ho("No se pudo leer el archivo de backup.");
                        }
                        e.target.value = "";
                      }
                    },
                  }),
                ),
              ),
            ),
          ),
        ),
        Dt &&
          React.createElement(
            "div",
            {
              style: {
                background: GOLD,
                color: NAVY,
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 32px",
                textAlign: "center",
              },
            },
            Dt,
          ),
        avisoDeshacer &&
          React.createElement(
            "div",
            {
              style: {
                background: "#E6EEE9",
                color: GREEN,
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 32px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
              },
            },
            avisoDeshacer,
            React.createElement(
              "button",
              {
                onClick: () => setAvisoDeshacer(null),
                style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
              },
              React.createElement(X, { size: 14 }),
            ),
          ),
        me &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: 340,
                  maxWidth: "90%",
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                },
              },
              React.createElement(
                "div",
                { style: { fontWeight: 700, color: NAVY, fontSize: 15 } },
                "Tipo de cambio de hoy",
              ),
              React.createElement(
                "div",
                { style: { fontSize: 12.5, color: MUTED, lineHeight: 1.4 } },
                "Antes de seguir, confirmá el tipo de cambio con el que se va a trabajar hoy. Se usa para mostrar los montos en dólares y queda fijo en cada carga nueva hasta que se vuelva a modificar.",
              ),
              React.createElement("input", {
                type: "number",
                autoFocus: true,
                placeholder: "Ej: 1450",
                value: Ke,
                onChange: (e) => Y(e.target.value),
                onKeyDown: (e) => {
                  e.key === "Enter" && Pa();
                },
                style: { ...inputStyle, width: "100%", fontSize: 15, padding: "8px 10px" },
              }),
              React.createElement(
                "button",
                {
                  onClick: Pa,
                  disabled: !Number(Ke) || Number(Ke) <= 0,
                  style: {
                    border: "none",
                    background: !Number(Ke) || Number(Ke) <= 0 ? "#ccc" : GOLD,
                    color: NAVY,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: !Number(Ke) || Number(Ke) <= 0 ? "default" : "pointer",
                  },
                },
                "Confirmar y continuar",
              ),
            ),
          ),
        Wo && React.createElement(NewObraForm, { onCancel: () => ln(false), onSave: La }),
        Qa &&
          React.createElement(RolesAdminPanel, {
            onClose: () => fa(false),
            roles: roles,
            obras: co,
            onSave: ir,
            onDelete: sr,
            presencia: er,
          }),
        $a && React.createElement(HistorialPanel, { onClose: () => ma(false), db: dbRef.current }),
        Go &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "80%",
                  height: "80%",
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
                    padding: "12px 18px",
                    borderBottom: "1px solid " + BORDER,
                  },
                },
                React.createElement(
                  "div",
                  { style: { fontWeight: 700, color: NAVY, fontSize: 13 } },
                  "Backup completo (texto) — copiá todo y guardalo en un archivo .json",
                ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 10, alignItems: "center" } },
                  React.createElement(
                    "button",
                    {
                      onClick: async () => {
                        try {
                          (await navigator.clipboard.writeText(Go), ho("Backup copiado al portapapeles."));
                        } catch {
                          ho("No se pudo copiar automáticamente. Seleccioná el texto a mano.");
                        }
                      },
                      style: smallBtnPrimary,
                    },
                    "Copiar todo",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => $o(null),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(X, { size: 18 }),
                  ),
                ),
              ),
              React.createElement("textarea", {
                readOnly: true,
                value: Go,
                onClick: (e) => e.target.select(),
                style: {
                  flex: 1,
                  border: "none",
                  padding: 16,
                  fontFamily: "monospace",
                  fontSize: 11.5,
                  resize: "none",
                  outline: "none",
                },
              }),
            ),
          ),
        or &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "70%",
                  maxWidth: 760,
                  height: "80%",
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
                    padding: "12px 18px",
                    borderBottom: "1px solid " + BORDER,
                  },
                },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    { style: { fontWeight: 700, color: NAVY, fontSize: 13 } },
                    "Registros — cambios de los últimos 3 días",
                  ),
                  React.createElement(
                    "div",
                    { style: { fontSize: 11, color: MUTED, marginTop: 2 } },
                    "Se guardan solo los últimos 3 días; los más viejos se descartan solos.",
                  ),
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => va(false),
                    style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                  },
                  React.createElement(X, { size: 18 }),
                ),
              ),
              React.createElement(
                "div",
                { style: { flex: 1, overflowY: "auto", padding: "8px 18px" } },
                fallasGuardado.length > 0 &&
                  React.createElement(
                    "div",
                    {
                      style: {
                        border: "1px solid #EAC7BE",
                        background: "#FBEAE7",
                        borderRadius: 10,
                        padding: "10px 12px",
                        margin: "6px 0 12px",
                      },
                    },
                    React.createElement(
                      "div",
                      { style: { fontWeight: 700, color: RED, fontSize: 12.5, marginBottom: 6 } },
                      "⚠ Fallas de guardado (" + fallasGuardado.length + ")",
                    ),
                    fallasGuardado.map((e, t) =>
                      React.createElement(
                        "div",
                        {
                          key: t,
                          style: {
                            display: "flex",
                            gap: 12,
                            padding: "5px 0",
                            borderTop: t ? "1px solid #F1D5CF" : "none",
                            fontSize: 12,
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { color: MUTED, minWidth: 128, flexShrink: 0 } },
                          new Date(e.fecha).toLocaleDateString("es-AR"),
                          " ",
                          new Date(e.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
                        ),
                        React.createElement(
                          "div",
                          { style: { minWidth: 90, flexShrink: 0, fontWeight: 700, color: NAVY } },
                          e.rol,
                        ),
                        React.createElement("div", { style: { color: "#333" } }, e.motivo),
                      ),
                    ),
                  ),
                registros.length === 0
                  ? React.createElement(
                      "div",
                      { style: { color: MUTED, fontSize: 13, padding: "20px 0", textAlign: "center" } },
                      "Todavía no hay cambios registrados.",
                    )
                  : [...registros]
                      .sort((e, t) => t.fecha - e.fecha)
                      .map((e, t) =>
                        React.createElement(
                          "div",
                          {
                            key: t,
                            style: {
                              display: "flex",
                              gap: 12,
                              padding: "8px 0",
                              borderBottom: "1px solid " + BORDER,
                              fontSize: 12.5,
                            },
                          },
                          React.createElement(
                            "div",
                            { style: { color: MUTED, minWidth: 128, flexShrink: 0 } },
                            new Date(e.fecha).toLocaleDateString("es-AR"),
                            " ",
                            new Date(e.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
                          ),
                          React.createElement(
                            "div",
                            { style: { minWidth: 90, flexShrink: 0, fontWeight: 700, color: NAVY } },
                            e.rol,
                          ),
                          React.createElement("div", { style: { color: "#333" } }, e.descripcion),
                        ),
                      ),
              ),
            ),
          ),
        nr &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "70%",
                  maxWidth: 760,
                  height: "80%",
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
                    padding: "12px 18px",
                    borderBottom: "1px solid " + BORDER,
                  },
                },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    { style: { fontWeight: 700, color: NAVY, fontSize: 13 } },
                    "Auditoría Venta/Costo/MB — cambios de las últimas 48hs",
                  ),
                  React.createElement(
                    "div",
                    { style: { fontSize: 11, color: MUTED, marginTop: 2 } },
                    "Cada vez que cambia la Venta Total, el Costo Real o el MB de una obra, con el detalle puntual (proveedor o adicional nuevo, eliminado, o cambio de monto). Se guardan solo las últimas 48hs; los más viejos se descartan solos.",
                  ),
                ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 10, alignItems: "center" } },
                  React.createElement(
                    "button",
                    { onClick: fr, style: smallBtnGhost },
                    React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
                    " Descargar Excel",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => ya(false),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(X, { size: 18 }),
                  ),
                ),
              ),
              React.createElement(
                "div",
                { style: { flex: 1, overflowY: "auto", padding: "8px 18px" } },
                cambiosFinancieros.length === 0
                  ? React.createElement(
                      "div",
                      { style: { color: MUTED, fontSize: 13, padding: "20px 0", textAlign: "center" } },
                      "Todavía no hay cambios registrados en las últimas 48hs.",
                    )
                  : [...cambiosFinancieros]
                      .sort((e, t) => t.fecha - e.fecha)
                      .map((e, t) =>
                        React.createElement(
                          "div",
                          {
                            key: t,
                            style: {
                              display: "flex",
                              gap: 12,
                              padding: "8px 0",
                              borderBottom: "1px solid " + BORDER,
                              fontSize: 12.5,
                            },
                          },
                          React.createElement(
                            "div",
                            { style: { color: MUTED, minWidth: 128, flexShrink: 0 } },
                            new Date(e.fecha).toLocaleDateString("es-AR"),
                            " ",
                            new Date(e.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
                          ),
                          React.createElement(
                            "div",
                            { style: { minWidth: 90, flexShrink: 0, fontWeight: 700, color: NAVY } },
                            e.cliente,
                          ),
                          React.createElement(
                            "div",
                            { style: { minWidth: 140, flexShrink: 0, color: "#555" } },
                            e.centroCosto,
                          ),
                          React.createElement("div", { style: { color: "#333" } }, e.descripcion),
                        ),
                      ),
              ),
            ),
          ),
        et &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "80%",
                  height: "85%",
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
                    padding: "12px 18px",
                    borderBottom: "1px solid " + BORDER,
                  },
                },
                React.createElement("div", { style: { fontWeight: 700, color: NAVY, fontSize: 13 } }, et.name),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 10, alignItems: "center" } },
                  React.createElement(
                    "button",
                    {
                      onClick: () => ofrecerDescarga(et.name || "factura.pdf", dataUrlToBlob(et.rawData)),
                      style: { ...smallBtnGhost, textDecoration: "none" },
                    },
                    React.createElement(Download, { size: 13 }),
                    " Descargar",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => {
                        (et.data.startsWith("blob:") && URL.revokeObjectURL(et.data), gt(null));
                      },
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(X, { size: 18 }),
                  ),
                ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    padding: 24,
                    background: BG,
                  },
                },
                React.createElement(
                  "div",
                  { style: { color: MUTED, fontSize: 13, textAlign: "center", maxWidth: 380 } },
                  "Por una restricción del navegador, el PDF no se puede previsualizar embebido acá adentro. Abrilo en una pestaña nueva o descargalo con los botones de arriba.",
                ),
                React.createElement(
                  "button",
                  { onClick: () => window.open(et.data, "_blank"), style: smallBtnPrimary },
                  React.createElement(Eye, { size: 14, style: { verticalAlign: "-2px" } }),
                  " Abrir PDF en pestaña nueva",
                ),
              ),
            ),
          ),
        Zo &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 60,
              },
              onClick: () => s(null),
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "90%",
                  maxWidth: 560,
                  maxHeight: "80%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                },
                onClick: (e) => e.stopPropagation(),
              },
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 18px",
                    borderBottom: "1px solid " + BORDER,
                  },
                },
                React.createElement(
                  "div",
                  { style: { fontWeight: 700, color: NAVY, fontSize: 14 } },
                  "Orden de Compra ",
                  Zo.ocTexto,
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => s(null),
                    style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                  },
                  React.createElement(X, { size: 18 }),
                ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    columnGap: 10,
                    padding: "12px 18px",
                    background: "#F1E9D2",
                  },
                },
                React.createElement(
                  "div",
                  null,
                  React.createElement("div", { style: labelStyle }, "VENTA"),
                  React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: NAVY } }, fmt(Zo.venta)),
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement("div", { style: labelStyle }, "SALDO A FACTURAR"),
                  React.createElement(
                    "div",
                    { style: { fontSize: 14, fontWeight: 700, color: Zo.saldoAFacturar > 0 ? RED : MUTED } },
                    fmt(Zo.saldoAFacturar),
                  ),
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement("div", { style: labelStyle }, "MB PROMEDIO / MARKUP"),
                  React.createElement(
                    "div",
                    {
                      style: {
                        fontSize: 14,
                        fontWeight: 700,
                        color: Zo.tieneLigadas ? (Zo.mbPromedio < 0 ? RED : GREEN) : MUTED,
                      },
                    },
                    Zo.tieneLigadas ? pctMk(Zo.mbPromedio) : "—",
                  ),
                ),
              ),
              React.createElement(
                "div",
                { style: { padding: "10px 18px 18px", overflowY: "auto" } },
                Zo.subObras.length === 0
                  ? React.createElement(
                      "div",
                      { style: { fontSize: 12.5, color: MUTED, padding: "10px 0" } },
                      "Ninguna sub obra de Costos tiene cargada esta Orden de Compra todavía (cargala desde la solapa Costos, en cada sub obra).",
                    )
                  : React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(
                        "div",
                        {
                          style: {
                            display: "grid",
                            gridTemplateColumns: "1.6fr 1fr 0.8fr",
                            columnGap: 8,
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: MUTED,
                            padding: "6px 4px",
                          },
                        },
                        React.createElement("div", null, "SUB OBRA"),
                        React.createElement("div", null, "ESTADO"),
                        React.createElement("div", { style: { textAlign: "right" } }, "MB / MARKUP"),
                      ),
                      Zo.subObras.map((e, t) =>
                        React.createElement(
                          "div",
                          {
                            key: t,
                            style: {
                              display: "grid",
                              gridTemplateColumns: "1.6fr 1fr 0.8fr",
                              columnGap: 8,
                              fontSize: 12.5,
                              padding: "6px 4px",
                              alignItems: "center",
                              borderTop: "1px solid " + BORDER,
                            },
                          },
                          React.createElement("div", null, e.nombre),
                          React.createElement(
                            "div",
                            null,
                            React.createElement(StatusBadge, {
                              status: e.status || "EN PROCESO",
                              onClick: Rt ? () => alternarEstadoSubObraDesdePopup(e.idx) : void 0,
                            }),
                          ),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right", color: e.mb < 0 ? RED : GREEN, fontWeight: 600 } },
                            pctMk(e.mb),
                          ),
                        ),
                      ),
                    ),
              ),
            ),
          ),
        Jr &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "78%",
                  maxWidth: 900,
                  height: "78%",
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
                    padding: "12px 18px",
                    borderBottom: "1px solid " + BORDER,
                  },
                },
                React.createElement(
                  "div",
                  { style: { fontWeight: 700, color: NAVY, fontSize: 14 } },
                  "Papelera y cambios de facturas",
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (Va(false), rn(null));
                    },
                    style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                  },
                  React.createElement(X, { size: 18 }),
                ),
              ),
              React.createElement(
                "div",
                { style: { display: "flex", gap: 6, padding: "10px 18px 0" } },
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (Xa("borradas"), rn(null));
                    },
                    style: {
                      border: "none",
                      padding: "7px 14px",
                      borderRadius: "7px 7px 0 0",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: hn === "borradas" ? "#F5F4F0" : "transparent",
                      color: hn === "borradas" ? NAVY : MUTED,
                    },
                  },
                  "Borradas (",
                  Pn.length,
                  ")",
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (Xa("ediciones"), rn(null));
                    },
                    style: {
                      border: "none",
                      padding: "7px 14px",
                      borderRadius: "7px 7px 0 0",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: hn === "ediciones" ? "#F5F4F0" : "transparent",
                      color: hn === "ediciones" ? NAVY : MUTED,
                    },
                  },
                  "Ediciones (",
                  wn.length,
                  ")",
                ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 18px",
                    borderBottom: "1px solid " + BORDER,
                  },
                },
                React.createElement(
                  "div",
                  { style: { fontSize: 11.5, color: MUTED } },
                  hn === "borradas"
                    ? "Facturas borradas recientemente (se guardan las últimas " +
                        Bn +
                        "). Restaurar la devuelve a la lista de facturas de esa obra."
                    : "Cómo estaba cada factura ANTES de su última edición (se guardan las últimas " +
                        Bn +
                        "). Restaurar vuelve todos sus campos a como estaban en ese momento.",
                ),
                (hn === "borradas" ? Pn.length > 0 : wn.length > 0) &&
                  (ua === "__vaciar__"
                    ? React.createElement(
                        "div",
                        { style: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0, fontSize: 11.5 } },
                        React.createElement("span", { style: { color: RED, fontWeight: 700 } }, "¿Vaciar todo?"),
                        React.createElement(
                          "button",
                          {
                            onClick: () => (hn === "borradas" ? ai() : ri()),
                            style: {
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: RED,
                              fontWeight: 700,
                            },
                          },
                          "Sí",
                        ),
                        React.createElement(
                          "button",
                          {
                            onClick: () => rn(null),
                            style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                          },
                          "No",
                        ),
                      )
                    : React.createElement(
                        "button",
                        { onClick: () => rn("__vaciar__"), style: { ...smallBtnGhost, flexShrink: 0, color: RED } },
                        "Vaciar",
                      )),
              ),
              React.createElement(
                "div",
                { style: { flex: 1, overflowY: "auto", padding: "8px 18px" } },
                Qr
                  ? React.createElement("div", { style: { padding: 20, fontSize: 12.5, color: MUTED } }, "Cargando...")
                  : hn === "borradas"
                    ? Pn.length === 0
                      ? React.createElement(
                          "div",
                          { style: { padding: 20, fontSize: 12.5, color: MUTED } },
                          "No hay facturas borradas.",
                        )
                      : React.createElement(
                          "div",
                          { style: { display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 } },
                          Pn.map((e) =>
                            React.createElement(
                              "div",
                              {
                                key: e.id,
                                style: {
                                  display: "grid",
                                  gridTemplateColumns: "1.2fr 1.3fr 1fr 1fr 1fr 1.3fr 100px 100px",
                                  columnGap: 10,
                                  alignItems: "center",
                                  fontSize: 12.5,
                                  padding: "8px 10px",
                                  borderRadius: 6,
                                  background: "#F5F4F0",
                                },
                              },
                              React.createElement("div", { style: { fontWeight: 700, color: NAVY } }, e.cliente),
                              React.createElement("div", null, e.obra),
                              React.createElement("div", null, e.concepto || "—"),
                              React.createElement(
                                "div",
                                { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                fmt(e.importe, e.tc),
                              ),
                              React.createElement("div", null, e.fecha || "—"),
                              React.createElement(
                                "div",
                                { style: { color: MUTED, fontSize: 11 } },
                                "Borrada: ",
                                e.eliminadaEn ? new Date(e.eliminadaEn).toLocaleString("es-AR") : "—",
                              ),
                              React.createElement(
                                "button",
                                { onClick: () => ei(e), style: smallBtnPrimary },
                                "Restaurar",
                              ),
                              ua === e.id
                                ? React.createElement(
                                    "div",
                                    { style: { display: "flex", gap: 4, alignItems: "center", fontSize: 11.5 } },
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => oi(e.id),
                                        style: {
                                          border: "none",
                                          background: "none",
                                          cursor: "pointer",
                                          color: RED,
                                          fontWeight: 700,
                                        },
                                      },
                                      "Sí",
                                    ),
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => rn(null),
                                        style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                                      },
                                      "No",
                                    ),
                                  )
                                : React.createElement(
                                    "button",
                                    {
                                      onClick: () => rn(e.id),
                                      style: {
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        color: RED,
                                        fontSize: 11.5,
                                        textAlign: "left",
                                      },
                                    },
                                    "Eliminar",
                                  ),
                            ),
                          ),
                        )
                    : wn.length === 0
                      ? React.createElement(
                          "div",
                          { style: { padding: 20, fontSize: 12.5, color: MUTED } },
                          "No hay ediciones registradas.",
                        )
                      : React.createElement(
                          "div",
                          { style: { display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 } },
                          wn.map((e) =>
                            React.createElement(
                              "div",
                              {
                                key: e.id,
                                style: {
                                  display: "grid",
                                  gridTemplateColumns: "1.2fr 1.3fr 1fr 1fr 1fr 1.3fr 100px 100px",
                                  columnGap: 10,
                                  alignItems: "center",
                                  fontSize: 12.5,
                                  padding: "8px 10px",
                                  borderRadius: 6,
                                  background: "#F5F4F0",
                                },
                              },
                              React.createElement("div", { style: { fontWeight: 700, color: NAVY } }, e.cliente),
                              React.createElement("div", null, e.obra),
                              React.createElement("div", null, e.concepto || "—"),
                              React.createElement(
                                "div",
                                {
                                  style: { textAlign: "right", fontVariantNumeric: "tabular-nums" },
                                  title: "Importe que tenía antes de esta edición",
                                },
                                fmt(e.importe, e.tc),
                              ),
                              React.createElement("div", null, e.fecha || "—"),
                              React.createElement(
                                "div",
                                { style: { color: MUTED, fontSize: 11 } },
                                "Editada: ",
                                e.modificadaEn ? new Date(e.modificadaEn).toLocaleString("es-AR") : "—",
                              ),
                              React.createElement(
                                "button",
                                { onClick: () => ti(e), style: smallBtnPrimary },
                                "Restaurar",
                              ),
                              ua === e.id
                                ? React.createElement(
                                    "div",
                                    { style: { display: "flex", gap: 4, alignItems: "center", fontSize: 11.5 } },
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => ni(e.id),
                                        style: {
                                          border: "none",
                                          background: "none",
                                          cursor: "pointer",
                                          color: RED,
                                          fontWeight: 700,
                                        },
                                      },
                                      "Sí",
                                    ),
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => rn(null),
                                        style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                                      },
                                      "No",
                                    ),
                                  )
                                : React.createElement(
                                    "button",
                                    {
                                      onClick: () => rn(e.id),
                                      style: {
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        color: RED,
                                        fontSize: 11.5,
                                        textAlign: "left",
                                      },
                                    },
                                    "Eliminar",
                                  ),
                            ),
                          ),
                        ),
              ),
            ),
          ),
        vista === "pagos"
          ? React.createElement(PagosView, {
              rows: pagosSemanales,
              obras: co,
              proveedoresMap: proveedoresMap,
              costoSubobrasMap: costoSubobrasMap,
              subCostoProveedoresMap: subCostoProveedoresMap,
              pagosMap: pagosMap,
              subCostoPagosMap: subCostoPagosMap,
              proveedoresInfo: proveedoresInfoMap,
              onProveedorInfoChange: Ir,
              reglasProveedoresPago: reglasProveedoresPago,
              onReglasProveedoresPagoChange: setReglasProveedoresPago,
              correccionesAprendidas: correccionesAprendidas,
              onCorreccionesAprendidasChange: setCorreccionesAprendidas,
              onCrearCentroCosto: Dr,
              onCrearSubObra: Rr,
              onCrearProveedor: Pr,
              onAdd: Er,
              onAddMasivo: Or,
              onUpdate: zn,
              onDelete: Fr,
              onSetFechaPagado: wr,
              onReintentar: Nr,
              canEdit: Rt,
              isAdmin: fn,
            })
          : vista === "facturacion"
            ? React.createElement(FacturacionView, {
                facturas: g,
                obras: co,
                onViewPdf: gt,
                onMarcarAnio: Ei,
                isAdmin: fn,
                isComercial: verRegaliasPresentacion,
                onGoToObra: (e, t) => {
                  (setVista("obras"), be(e), no(obraKey(e, t)), ae("facturas"), lo(false));
                },
              })
            : vista === "proveedores"
              ? React.createElement(ProveedoresView, {
                  proveedoresMap: proveedoresMap,
                  pagosMap: pagosMap,
                  obras: co,
                  costoSubobrasMap: costoSubobrasMap,
                  subCostoProveedoresMap: subCostoProveedoresMap,
                  subCostoPagosMap: subCostoPagosMap,
                  onRename: di,
                  onImportPagos: hr,
                  onReintentarPago: Ba,
                  canEdit: Rt,
                })
              : vista === "cashflow"
                ? React.createElement(CashflowView, {
                    obras: co,
                    facturas: g,
                    proveedoresMap: proveedoresMap,
                    pagosMap: pagosMap,
                    costoSubobrasMap: costoSubobrasMap,
                    subCostoProveedoresMap: subCostoProveedoresMap,
                    subCostoPagosMap: subCostoPagosMap,
                    canEdit: Rt,
                    cfIngresosValores: cfIngresosValores,
                    setCfIngresosValores: setCfIngresosValores,
                    cfIngresosComentarios: cfIngresosComentarios,
                    setCfIngresosComentarios: setCfIngresosComentarios,
                    cfIngresosCategorias: cfIngresosCategorias,
                    setCfIngresosCategorias: setCfIngresosCategorias,
                    cfIngresosCategoriasValores: cfIngresosCategoriasValores,
                    setCfIngresosCategoriasValores: setCfIngresosCategoriasValores,
                    cfIngresosCategoriasComentarios: cfIngresosCategoriasComentarios,
                    setCfIngresosCategoriasComentarios: setCfIngresosCategoriasComentarios,
                    cfEgresosCategorias: cfEgresosCategorias,
                    setCfEgresosCategorias: setCfEgresosCategorias,
                    cfEgresosValores: cfEgresosValores,
                    setCfEgresosValores: setCfEgresosValores,
                    cfEgresosComentarios: cfEgresosComentarios,
                    setCfEgresosComentarios: setCfEgresosComentarios,
                    cfSalidasValores: cfSalidasValores,
                    setCfSalidasValores: setCfSalidasValores,
                    cfSaldoInicial: cfSaldoInicial,
                    setCfSaldoInicial: setCfSaldoInicial,
                    cfBancos: cfBancos,
                    setCfBancos: setCfBancos,
                    cfSimulacionLineas: cfSimulacionLineas,
                    setCfSimulacionLineas: setCfSimulacionLineas,
                    cfSemanaInicio: gn,
                    setCfSemanaInicio: bn,
                    cfDiasPagoCliente: cfDiasPagoCliente,
                    setCfDiasPagoCliente: setCfDiasPagoCliente,
                    cfRegaliasPagadas: cfRegPag,
                    setCfRegaliasPagadas: setCfRegPag,
                    navBarHeight: St,
                    onGoToObra: (e, t) => {
                      (setVista("obras"), be(e), no(obraKey(e, t)), ae("facturas"), lo(true));
                    },
                  })
                : vista === "eerr"
                  ? React.createElement(EerrView, { eerrMensual: eerrMensual, setEerrMensual: setEerrMensual, canEdit: Rt })
                  : vista === "veronica"
                    ? React.createElement(VeronicaView, { canEdit: Rt })
                  : vista === "operaciones"
                    ? React.createElement(OperacionesView, {
                        obras: co,
                        onGoToObra: (e, t) => {
                          (setVista("obras"), be(e), no(obraKey(e, t)), ae("facturas"), lo(false));
                        },
                        onReasignar: Rt ? qa : void 0,
                        onQuitarAsignacion: Rt
                          ? (e, t, o) => qa(e, t, o, "", 'con el botón "Eliminar" en Operaciones')
                          : void 0,
                        onAsignar: Rt ? li : void 0,
                        pmCatalogo: pmCatalogo,
                        ddoCatalogo: ddoCatalogo,
                        canEdit: Rt,
                      })
                    : React.createElement(
                        "div",
                        { style: { padding: "22px 28px" } },
                        se === null
                          ? React.createElement(
                              React.Fragment,
                              null,
                              fn &&
                                // Sección 95: la importación de obras queda plegada (se usa poco y ocupaba el principio de la pantalla).
                                React.createElement(
                                  "details",
                                  {
                                    style: {
                                      background: "#fff",
                                      borderRadius: 12,
                                      border: "1px solid " + BORDER,
                                      padding: "10px 18px",
                                      marginBottom: 16,
                                    },
                                  },
                                  React.createElement(
                                    "summary",
                                    { style: { fontSize: 13, fontWeight: 600, color: NAVY, cursor: "pointer", padding: "2px 0" } },
                                    "Importar obras desde Excel",
                                  ),
                                  React.createElement("div", { style: { height: 8 } }),
                                  React.createElement(
                                    "div",
                                    { style: { fontSize: 11.5, color: MUTED, marginBottom: 8 } },
                                    "Columnas: Cliente, Centro de Costo, Venta Total, Costo Real, Mes, Año. Sin proveedores ni facturas — el MB se calcula solo. Se omiten filas cuyo Cliente + Centro de Costo ya exista (un mismo centro de costo puede repetirse para clientes distintos, sin problema).",
                                  ),
                                  React.createElement(
                                    "div",
                                    { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },
                                    React.createElement(
                                      "label",
                                      { style: smallBtnPrimary },
                                      React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
                                      " Importar obras (Excel)",
                                      React.createElement("input", {
                                        type: "file",
                                        accept: ".xlsx,.xls,.csv",
                                        style: { display: "none" },
                                        onChange: async (e) => {
                                          const t = e.target.files[0];
                                          if (t) {
                                            try {
                                              const o = await t.arrayBuffer(),
                                                a = XLSX.read(o, { type: "array" }),
                                                r = a.Sheets[a.SheetNames[0]],
                                                i = XLSX.utils.sheet_to_json(r, { defval: null }),
                                                u = (D, T) => {
                                                  for (const O of Object.keys(D))
                                                    if (T.includes(O.toString().trim().toLowerCase())) return D[O];
                                                  return null;
                                                },
                                                m = i
                                                  .map((D) => {
                                                    const T = String(u(D, ["mes"]) || "")
                                                        .toUpperCase()
                                                        .trim(),
                                                      O =
                                                        MESES.find((_) => _ === T || _.startsWith(T.slice(0, 3))) ||
                                                        null;
                                                    return {
                                                      cliente: String(u(D, ["cliente"]) || "")
                                                        .toUpperCase()
                                                        .trim(),
                                                      obra: String(u(D, ["centro de costo", "obra"]) || "")
                                                        .toUpperCase()
                                                        .trim(),
                                                      ventaTotal: Number(u(D, ["venta total", "venta"])) || 0,
                                                      costoReal: Number(u(D, ["costo real", "costo"])) || 0,
                                                      mes: O,
                                                      anio: Number(u(D, ["año", "anio", "ano"])) || null,
                                                    };
                                                  })
                                                  .filter((D) => D.cliente && D.obra),
                                                x = Ci(m, Number(J) || 2025, ke);
                                              It(
                                                x.agregadasCount +
                                                  " obra(s) agregada(s)" +
                                                  (x.omitidasCount > 0
                                                    ? ", " + x.omitidasCount + " omitida(s) (ya existían)"
                                                    : "") +
                                                  " — el mes/año se toma de la planilla; si alguna fila no lo traía, se usó Enero " +
                                                  (Number(J) || 2025) +
                                                  " por defecto." +
                                                  (ke
                                                    ? " Se cargó además una factura por el total de cada obra, marcada como pagada."
                                                    : ""),
                                              );
                                            } catch {
                                              It("No se pudo leer el archivo.");
                                            }
                                            e.target.value = "";
                                          }
                                        },
                                      }),
                                    ),
                                    React.createElement(
                                      "div",
                                      { style: { display: "flex", alignItems: "center", gap: 6 } },
                                      React.createElement(
                                        "label",
                                        { style: { fontSize: 11.5, color: MUTED } },
                                        "Año por defecto:",
                                      ),
                                      React.createElement("input", {
                                        type: "number",
                                        value: J,
                                        onChange: (e) => fe(e.target.value),
                                        style: { ...inputStyle, width: 80 },
                                      }),
                                    ),
                                    React.createElement(
                                      "label",
                                      {
                                        style: {
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 6,
                                          fontSize: 11.5,
                                          color: MUTED,
                                          cursor: "pointer",
                                        },
                                      },
                                      React.createElement("input", {
                                        type: "checkbox",
                                        checked: ke,
                                        onChange: (e) => We(e.target.checked),
                                      }),
                                      "Marcar 100% facturado y cobrado",
                                    ),
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => {
                                          const e = XLSX.utils.aoa_to_sheet([
                                              ["Cliente", "Centro de Costo", "Venta Total", "Costo Real", "Mes", "Año"],
                                              ["PANDORA", "UNICENTER", 1e8, 7e7, "Marzo", 2025],
                                            ]),
                                            t = XLSX.utils.book_new();
                                          (XLSX.utils.book_append_sheet(t, e, "Obras"),
                                            descargarLibroXlsx(t, "plantilla_obras.xlsx"));
                                        },
                                        style: { ...smallBtnGhost, color: MUTED },
                                      },
                                      "Plantilla de ejemplo",
                                    ),
                                  ),
                                  wt &&
                                    React.createElement(
                                      "div",
                                      { style: { fontSize: 11.5, color: MUTED, marginTop: 8 } },
                                      wt,
                                    ),
                                ),
                              React.createElement(
                                "div",
                                { style: { display: "flex", gap: 16, marginBottom: 16, alignItems: "stretch" } },
                                React.createElement(
                                  "div",
                                  {
                                    style: {
                                      flex: 1,
                                      background: "#fff",
                                      borderRadius: 12,
                                      border: "1px solid " + BORDER,
                                      boxShadow: CARD_SHADOW,
                                      padding: "18px 20px",
                                    },
                                  },
                                  React.createElement(
                                    "div",
                                    {
                                      style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 4,
                                        flexWrap: "wrap",
                                        gap: 8,
                                      },
                                    },
                                    React.createElement(
                                      "div",
                                      { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } },
                                      React.createElement(
                                        "div",
                                        {
                                          style: { fontSize: 11.5, fontWeight: 700, color: MUTED, letterSpacing: 0.3 },
                                        },
                                        "VENTA CONSOLIDADA POR MES",
                                      ),
                                      Ao.anterior > 0 &&
                                        React.createElement(
                                          "div",
                                          {
                                            title:
                                              "Acumulado " +
                                              Ao.currentYear +
                                              " vs " +
                                              Ao.previousYear +
                                              " (Ene–" +
                                              Dn(Ao.currentMonthIdx) +
                                              ")",
                                            style: {
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 5,
                                              fontSize: 11,
                                              fontWeight: 700,
                                              color: valSmart(Ao.delta, Ao.deltaUSD) >= 0 ? GREEN : RED,
                                              background: valSmart(Ao.delta, Ao.deltaUSD) >= 0 ? "#E6EEE9" : "#F7E6E3",
                                              border:
                                                "1px solid " +
                                                (valSmart(Ao.delta, Ao.deltaUSD) >= 0 ? "#CFE0D5" : "#EAC7BE"),
                                              borderRadius: 20,
                                              padding: "3px 10px",
                                              cursor: "default",
                                            },
                                          },
                                          React.createElement(
                                            "span",
                                            null,
                                            valSmart(Ao.delta, Ao.deltaUSD) >= 0 ? "▲" : "▼",
                                          ),
                                          React.createElement(
                                            "span",
                                            null,
                                            fmtSmart(Math.abs(Ao.delta), Math.abs(Ao.deltaUSD)),
                                          ),
                                          React.createElement(
                                            "span",
                                            null,
                                            "(",
                                            pctSmart(Math.abs(Ao.deltaPct), Math.abs(Ao.deltaPctUSD)),
                                            ")",
                                          ),
                                        ),
                                    ),
                                  ),
                                  Ao.anterior > 0 &&
                                    React.createElement(
                                      "div",
                                      { style: { fontSize: 10, color: MUTED, marginBottom: 8 } },
                                      "vs ",
                                      Ao.previousYear,
                                      ": ",
                                      fmtSmart(Ao.anterior, Ao.anteriorUSD),
                                      " (Ene–",
                                      Dn(Ao.currentMonthIdx),
                                      ")",
                                    ),
                                  React.createElement(
                                    "div",
                                    { style: { width: "100%", height: 220 } },
                                    React.createElement(
                                      ResponsiveContainer,
                                      null,
                                      React.createElement(
                                        BarChart,
                                        { data: mr, margin: { top: 5, right: 10, left: 0, bottom: 0 } },
                                        React.createElement(CartesianGrid, {
                                          strokeDasharray: "3 3",
                                          stroke: BORDER,
                                          vertical: false,
                                        }),
                                        React.createElement(XAxis, {
                                          dataKey: "label",
                                          tick: { fontSize: 11, fill: MUTED },
                                          axisLine: { stroke: BORDER },
                                          tickLine: false,
                                        }),
                                        React.createElement(YAxis, {
                                          tick: { fontSize: 10, fill: MUTED },
                                          axisLine: false,
                                          tickLine: false,
                                          tickFormatter: (e) => (e / 1e6).toFixed(0) + "M",
                                        }),
                                        React.createElement(Tooltip, { formatter: (e) => fmt(e) }),
                                        Ro.map((e, t) =>
                                          React.createElement(Bar, {
                                            key: e,
                                            dataKey: e,
                                            name: String(e),
                                            fill: PIE_COLORS[xn.indexOf(e) % PIE_COLORS.length],
                                            radius: [4, 4, 0, 0],
                                            cursor: "pointer",
                                            onClick: (o) => {
                                              const a = o.payload || o;
                                              it({ anio: e, mesIdx: a.mesIdx, label: Dn(a.mesIdx) + " " + e });
                                            },
                                          }),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                React.createElement(
                                  "div",
                                  {
                                    style: {
                                      flex: 1,
                                      background: "#fff",
                                      borderRadius: 12,
                                      border: "1px solid " + BORDER,
                                      boxShadow: CARD_SHADOW,
                                      padding: "18px 20px",
                                    },
                                  },
                                  React.createElement(
                                    "div",
                                    {
                                      style: {
                                        fontSize: 11.5,
                                        fontWeight: 700,
                                        color: MUTED,
                                        marginBottom: 8,
                                        letterSpacing: 0.3,
                                      },
                                    },
                                    "VENTA POR CLIENTE",
                                  ),
                                  Ro.length > 1
                                    ? React.createElement(
                                        "div",
                                        { style: { width: "100%", height: Math.max(200, Ta.length * 30) + 30 } },
                                        Rn.length > 8 &&
                                          React.createElement(
                                            "div",
                                            { style: { fontSize: 10, color: MUTED, marginBottom: 4 } },
                                            'Top 8 clientes por venta total; el resto agrupado en "OTROS"',
                                          ),
                                        React.createElement(
                                          ResponsiveContainer,
                                          null,
                                          React.createElement(
                                            BarChart,
                                            {
                                              data: Ta,
                                              layout: "vertical",
                                              margin: { top: 5, right: 36, left: 10, bottom: 0 },
                                            },
                                            React.createElement(CartesianGrid, {
                                              strokeDasharray: "3 3",
                                              stroke: BORDER,
                                              horizontal: false,
                                            }),
                                            React.createElement(XAxis, {
                                              type: "number",
                                              tick: { fontSize: 10, fill: MUTED },
                                              axisLine: false,
                                              tickLine: false,
                                              tickFormatter: (e) => (e / 1e6).toFixed(0) + "M",
                                            }),
                                            React.createElement(YAxis, {
                                              type: "category",
                                              dataKey: "cliente",
                                              tick: { fontSize: 11, fill: TEXT },
                                              axisLine: { stroke: BORDER },
                                              tickLine: false,
                                              width: 110,
                                            }),
                                            React.createElement(Tooltip, { formatter: (e) => fmt(e) }),
                                            React.createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
                                            Ro.map((e) => {
                                              const t = un.find((o) => o.anio === e)?.venta || 0;
                                              return React.createElement(
                                                Bar,
                                                {
                                                  key: e,
                                                  dataKey: e,
                                                  name: String(e),
                                                  fill: PIE_COLORS[xn.indexOf(e) % PIE_COLORS.length],
                                                  radius: [0, 4, 4, 0],
                                                  cursor: "pointer",
                                                  onClick: (o) => {
                                                    const a = o.payload || o;
                                                    ka[a.cliente] && be(a.cliente);
                                                  },
                                                },
                                                React.createElement(LabelList, {
                                                  dataKey: e,
                                                  position: "right",
                                                  formatter: (o) => (t ? ((o / t) * 100).toFixed(0) + "%" : ""),
                                                  style: { fontSize: 10, fill: MUTED },
                                                }),
                                              );
                                            }),
                                          ),
                                        ),
                                      )
                                    : React.createElement(
                                        "div",
                                        { style: { display: "flex", gap: 20, alignItems: "center" } },
                                        React.createElement(
                                          "div",
                                          { style: { width: 190, height: 190, flexShrink: 0 } },
                                          React.createElement(
                                            ResponsiveContainer,
                                            null,
                                            React.createElement(
                                              PieChart,
                                              null,
                                              React.createElement(
                                                Pie,
                                                {
                                                  data: ra,
                                                  dataKey: "value",
                                                  nameKey: "name",
                                                  cx: "50%",
                                                  cy: "50%",
                                                  outerRadius: 78,
                                                  onClick: (e) => be(e.name),
                                                  style: { cursor: "pointer" },
                                                },
                                                ra.map((e, t) =>
                                                  React.createElement(Cell, {
                                                    key: t,
                                                    fill: PIE_COLORS[t % PIE_COLORS.length],
                                                    opacity: !b.home || b.home === e.name ? 1 : 0.3,
                                                  }),
                                                ),
                                              ),
                                              React.createElement(Tooltip, { formatter: (e) => fmt(e) }),
                                            ),
                                          ),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { minWidth: 0 } },
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 4,
                                                fontSize: 12,
                                                maxHeight: 150,
                                                overflowY: "auto",
                                              },
                                            },
                                            ra.map((e, t) =>
                                              React.createElement(
                                                "div",
                                                {
                                                  key: e.name,
                                                  onClick: () => be(e.name),
                                                  onMouseEnter: () => R((o) => ({ ...o, home: e.name })),
                                                  onMouseLeave: () => R((o) => ({ ...o, home: null })),
                                                  style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    cursor: "pointer",
                                                  },
                                                },
                                                React.createElement("span", {
                                                  style: {
                                                    width: 9,
                                                    height: 9,
                                                    borderRadius: 2,
                                                    background: PIE_COLORS[t % PIE_COLORS.length],
                                                    flexShrink: 0,
                                                  },
                                                }),
                                                React.createElement(
                                                  "span",
                                                  {
                                                    style: {
                                                      fontWeight: 600,
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                    },
                                                  },
                                                  e.name,
                                                ),
                                                React.createElement(
                                                  "span",
                                                  { style: { color: MUTED } },
                                                  ((e.value / ro.venta) * 100).toFixed(0),
                                                  "%",
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                ),
                              ),
                              Ue
                                ? (() => {
                                    const t = An.filter((i) => i.anio === Ue.anio && i.mesIdx === Ue.mesIdx),
                                      ventaMesPorCC = {};
                                    t.forEach((i) => {
                                      const g = ventaMesPorCC[i.key] || (ventaMesPorCC[i.key] = { monto: 0, montoUSD: 0 });
                                      ((g.monto += i.monto), (g.montoUSD += i.montoUSD || 0));
                                    });
                                    const e = co
                                        .map((i) => {
                                          const g = ventaMesPorCC[obraKey(i.cliente, i.obra)];
                                          return g ? { ...i, ventaMes: g.monto, ventaMesUSD: g.montoUSD } : null;
                                        })
                                        .filter((i) => i && i.ventaMes !== 0)
                                        .sort((i, u) => u.ventaMes - i.ventaMes),
                                      o = {};
                                    t.forEach((i) => {
                                      o[i.cliente] = (o[i.cliente] || 0) + i.monto;
                                    });
                                    const a = Object.entries(o)
                                        .map(([i, u]) => ({ name: i, value: u }))
                                        .filter((i) => i.value !== 0)
                                        .sort((i, u) => u.value - i.value),
                                      r = a.reduce((i, u) => i + u.value, 0);
                                    return React.createElement(
                                      React.Fragment,
                                      null,
                                      React.createElement(
                                        "button",
                                        { onClick: () => it(null), style: { ...smallBtnGhost, marginBottom: 14 } },
                                        React.createElement(ArrowLeft, { size: 14 }),
                                        " Volver a todos los meses",
                                      ),
                                      React.createElement(
                                        "div",
                                        {
                                          style: {
                                            background: "#fff",
                                            borderRadius: 12,
                                            border: "1px solid " + BORDER,
                                            boxShadow: CARD_SHADOW,
                                            padding: "18px 20px",
                                            marginBottom: 16,
                                            display: "flex",
                                            gap: 24,
                                            alignItems: "center",
                                          },
                                        },
                                        React.createElement(
                                          "div",
                                          { style: { width: 200, height: 190, flexShrink: 0 } },
                                          React.createElement(
                                            ResponsiveContainer,
                                            null,
                                            React.createElement(
                                              PieChart,
                                              null,
                                              React.createElement(
                                                Pie,
                                                {
                                                  data: a,
                                                  dataKey: "value",
                                                  nameKey: "name",
                                                  cx: "50%",
                                                  cy: "50%",
                                                  outerRadius: 78,
                                                },
                                                a.map((i, u) =>
                                                  React.createElement(Cell, {
                                                    key: u,
                                                    fill: PIE_COLORS[u % PIE_COLORS.length],
                                                  }),
                                                ),
                                              ),
                                              React.createElement(Tooltip, { formatter: (i) => fmt(i) }),
                                            ),
                                          ),
                                        ),
                                        React.createElement(
                                          "div",
                                          null,
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                fontFamily: "Georgia, serif",
                                                fontSize: 18,
                                                fontWeight: 700,
                                                color: NAVY,
                                                marginBottom: 8,
                                              },
                                            },
                                            Ue.label,
                                            " — ",
                                            fmt(r),
                                          ),
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                columnGap: 10,
                                                gap: "4px 18px",
                                                fontSize: 12.5,
                                              },
                                            },
                                            a.map((i, u) =>
                                              React.createElement(
                                                "div",
                                                {
                                                  key: i.name,
                                                  style: { display: "flex", alignItems: "center", gap: 7 },
                                                },
                                                React.createElement("span", {
                                                  style: {
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: 3,
                                                    background: PIE_COLORS[u % PIE_COLORS.length],
                                                    flexShrink: 0,
                                                  },
                                                }),
                                                React.createElement("span", { style: { fontWeight: 600 } }, i.name),
                                                React.createElement(
                                                  "span",
                                                  { style: { color: MUTED } },
                                                  ((i.value / r) * 100).toFixed(0),
                                                  "%",
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                      React.createElement(
                                        "div",
                                        { style: { fontSize: 11.5, fontWeight: 600, color: MUTED, marginBottom: 6 } },
                                        "Centros de costo con venta en ",
                                        Ue.label,
                                        " (venta del mes, incluye órdenes de compra por su fecha; costo y MB son de la obra completa)",
                                      ),
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
                                              gridTemplateColumns: "1.6fr 1.6fr 1fr 1.1fr 1.1fr 0.8fr 0.8fr",
                                              columnGap: 10,
                                              padding: "11px 18px",
                                              fontSize: 11.5,
                                              fontWeight: 700,
                                              background: "#EFEDE7",
                                              borderBottom: "1px solid " + BORDER,
                                              letterSpacing: 0.3,
                                            },
                                          },
                                          React.createElement("div", null, "CLIENTE"),
                                          React.createElement("div", null, "CENTRO DE COSTO"),
                                          React.createElement("div", null, "ESTADO"),
                                          React.createElement("div", { style: { textAlign: "right" } }, "VENTA DEL MES"),
                                          React.createElement("div", { style: { textAlign: "right" } }, "COSTO OBRA"),
                                          React.createElement("div", { style: { textAlign: "right" } }, "MB INICIAL / MARKUP"),
                                          React.createElement("div", { style: { textAlign: "right" } }, "MB FINAL / MARKUP"),
                                        ),
                                        e.length === 0
                                          ? React.createElement(
                                              "div",
                                              { style: { padding: 20, fontSize: 12.5, color: MUTED } },
                                              "No hay ventas en este mes.",
                                            )
                                          : e.map((i) => {
                                              const u = obraKey(i.cliente, i.obra);
                                              return React.createElement(
                                                "div",
                                                {
                                                  key: u,
                                                  onClick: () => {
                                                    (be(i.cliente), no(u), ae("facturas"));
                                                  },
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "1.6fr 1.6fr 1fr 1.1fr 1.1fr 0.8fr 0.8fr",
                                                    columnGap: 10,
                                                    padding: "10px 18px",
                                                    fontSize: 13,
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid " + BORDER,
                                                  },
                                                },
                                                React.createElement(
                                                  "div",
                                                  { style: { fontWeight: 700, color: NAVY } },
                                                  i.cliente,
                                                ),
                                                React.createElement("div", null, i.obra),
                                                React.createElement(
                                                  "div",
                                                  null,
                                                  React.createElement(StatusBadge, { status: i.status }),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                                  fmtSmart(i.ventaMes, i.ventaMesUSD),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      textAlign: "right",
                                                      fontVariantNumeric: "tabular-nums",
                                                      color: MUTED,
                                                    },
                                                  },
                                                  fmtSmart(i.costoFinal, i.costoFinalUSD),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right" } },
                                                  React.createElement(MBValue, {
                                                    v: valSmart(i.mbInicial, i.mbInicialUSD),
                                                  }),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right" } },
                                                  React.createElement(MBValue, {
                                                    v: valSmart(i.mbFinal, i.mbFinalUSD),
                                                  }),
                                                ),
                                              );
                                            }),
                                        e.length > 0 &&
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "grid",
                                                gridTemplateColumns: "1.6fr 1.6fr 1fr 1.1fr 1.1fr 0.8fr 0.8fr",
                                                columnGap: 10,
                                                padding: "10px 18px",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                background: "#F1E9D2",
                                              },
                                            },
                                            React.createElement("div", { style: { color: NAVY } }, "TOTAL"),
                                            React.createElement("div", null),
                                            React.createElement("div", null),
                                            React.createElement(
                                              "div",
                                              { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                              fmtSmart(
                                                e.reduce((i, u) => i + u.ventaMes, 0),
                                                e.reduce((i, u) => i + (u.ventaMesUSD || 0), 0),
                                              ),
                                            ),
                                            React.createElement("div", null),
                                            React.createElement("div", null),
                                            React.createElement("div", null),
                                          ),
                                      ),
                                    );
                                  })()
                                : React.createElement(
                                    React.Fragment,
                                    null,
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          gap: 12,
                                          marginBottom: 10,
                                        },
                                      },
                                      React.createElement("input", {
                                        placeholder: "Buscar por cliente o centro de costo...",
                                        value: j,
                                        onChange: (e) => Q(e.target.value),
                                        style: { ...inputStyle, width: 320 },
                                      }),
                                      React.createElement(
                                        "button",
                                        { onClick: Ai, style: smallBtnGhost },
                                        "Descargar resumen de todas las obras",
                                      ),
                                    ),
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
                                            gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1.1fr 1fr 32px",
                                            columnGap: 10,
                                            padding: "11px 18px",
                                            fontSize: 11.5,
                                            fontWeight: 700,
                                            background: "#EFEDE7",
                                            borderBottom: "1px solid " + BORDER,
                                            letterSpacing: 0.3,
                                          },
                                        },
                                        React.createElement(SortHeader, {
                                          label: "CLIENTE",
                                          tableId: "clientList",
                                          sortKey: "cliente",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "OBRAS",
                                          tableId: "clientList",
                                          sortKey: "count",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "VENTA",
                                          tableId: "clientList",
                                          sortKey: "venta",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "COSTO FINAL",
                                          tableId: "clientList",
                                          sortKey: "costo",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "SALDO A PAGAR",
                                          tableId: "clientList",
                                          sortKey: "saldo",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "PRECIO X M2",
                                          tableId: "clientList",
                                          sortKey: "precioM2",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "MB / MARKUP",
                                          tableId: "clientList",
                                          sortKey: "mb",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement("div", null),
                                      ),
                                      So(
                                        "clientList",
                                        Object.entries(ka)
                                          .filter(([e, t]) => {
                                            const o = j.trim().toLowerCase();
                                            return o
                                              ? e.toLowerCase().includes(o) ||
                                                  t.some((a) => a.obra.toLowerCase().includes(o))
                                              : true;
                                          })
                                          .map(([e, t]) => {
                                            const o = t.reduce((le, ft) => le + ft.ventaFinal, 0),
                                              a = t.reduce((le, ft) => le + ft.costoFinal, 0),
                                              r = t.reduce((le, ft) => le + (ft.ventaFinalUSD || 0), 0),
                                              i = t.reduce((le, ft) => le + (ft.costoFinalUSD || 0), 0),
                                              u = t.reduce((le, ft) => le + (ft.saldoProveedores || 0), 0),
                                              m = t.reduce((le, ft) => le + (ft.saldoProveedoresUSD || 0), 0),
                                              x = o ? ((o - a) / o) * 100 : 0,
                                              D = r ? ((r - i) / r) * 100 : 0,
                                              T = Ro.map((le) => {
                                                const ft = t.filter(
                                                  (to) => (to.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                );
                                                return {
                                                  anio: le,
                                                  venta: ft.reduce((to, h) => to + h.ventaFinal, 0),
                                                  ventaUSD: ft.reduce((to, h) => to + (h.ventaFinalUSD || 0), 0),
                                                };
                                              }).filter((le) => le.venta > 0),
                                              O = Ro.map((le) => {
                                                const ft = t.filter(
                                                  (to) => (to.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                );
                                                return {
                                                  anio: le,
                                                  costo: ft.reduce((to, h) => to + h.costoFinal, 0),
                                                  costoUSD: ft.reduce((to, h) => to + (h.costoFinalUSD || 0), 0),
                                                };
                                              }).filter((le) => le.costo > 0),
                                              _ = Ro.map((le) => ({
                                                anio: le,
                                                count: t.filter(
                                                  (ft) => (ft.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                ).length,
                                              })).filter((le) => le.count > 0),
                                              xe = Ro.map((le) => {
                                                const ft = t.filter(
                                                    (Ce) =>
                                                      (Ce.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                  ),
                                                  to = ft.reduce((Ce, ie) => Ce + ie.ventaFinal, 0),
                                                  h = ft.reduce((Ce, ie) => Ce + ie.costoFinal, 0),
                                                  N = ft.reduce((Ce, ie) => Ce + (ie.ventaFinalUSD || 0), 0),
                                                  De = ft.reduce((Ce, ie) => Ce + (ie.costoFinalUSD || 0), 0);
                                                return {
                                                  anio: le,
                                                  venta: to,
                                                  mb: to ? ((to - h) / to) * 100 : 0,
                                                  mbUSD: N ? ((N - De) / N) * 100 : 0,
                                                };
                                              }).filter((le) => le.venta > 0),
                                              Ie = t.reduce((le, ft) => le + Ln(ft), 0),
                                              Te = Ie > 0 ? o / Ie : null,
                                              Ge = Ro.map((le) => {
                                                const ft = t.filter(
                                                    (N) => (N.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                  ),
                                                  to = ft.reduce((N, De) => N + De.ventaFinal, 0),
                                                  h = ft.reduce((N, De) => N + Ln(De), 0);
                                                return { anio: le, precioM2: h > 0 ? to / h : null };
                                              }).filter((le) => le.precioM2 != null),
                                              Ze = t.reduce(
                                                (le, ft) => le + (costoSubobrasMap[obraKey(ft.cliente, ft.obra)] || []).length,
                                                0,
                                              );
                                            return {
                                              cliente: e,
                                              list: t,
                                              count: t.length,
                                              venta: o,
                                              costo: a,
                                              saldo: u,
                                              saldoUSD: m,
                                              mb: x,
                                              ventaUSD: r,
                                              costoUSD: i,
                                              mbUSD: D,
                                              ventaPorAnio: T,
                                              costoPorAnio: O,
                                              obrasPorAnio: _,
                                              mbPorAnio: xe,
                                              precioM2: Te,
                                              precioM2PorAnio: Ge,
                                              subObrasCostosCount: Ze,
                                            };
                                          }),
                                      ).map(
                                        ({
                                          cliente: e,
                                          list: t,
                                          count: o,
                                          venta: a,
                                          costo: r,
                                          saldo: i,
                                          saldoUSD: u,
                                          mb: m,
                                          ventaUSD: x,
                                          costoUSD: D,
                                          mbUSD: T,
                                          ventaPorAnio: O,
                                          costoPorAnio: _,
                                          obrasPorAnio: xe,
                                          mbPorAnio: Ie,
                                          precioM2: Te,
                                          precioM2PorAnio: Ge,
                                          subObrasCostosCount: Ze,
                                        }) =>
                                          React.createElement(
                                            "div",
                                            {
                                              key: e,
                                              onClick: () => be(e),
                                              style: {
                                                display: "grid",
                                                gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1.1fr 1fr 32px",
                                                columnGap: 10,
                                                padding: "12px 18px",
                                                fontSize: 13.5,
                                                alignItems: "center",
                                                cursor: "pointer",
                                                borderBottom: "1px solid " + BORDER,
                                              },
                                            },
                                            React.createElement("div", { style: { fontWeight: 700, color: NAVY } }, e),
                                            React.createElement(
                                              "div",
                                              { style: { textAlign: "right", color: MUTED } },
                                              xe.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                    xe.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        { key: le.anio, style: { fontSize: 11.5 } },
                                                        React.createElement(
                                                          "span",
                                                          { style: { fontWeight: 400 } },
                                                          le.anio,
                                                          ": ",
                                                        ),
                                                        le.count,
                                                      ),
                                                    ),
                                                  )
                                                : React.createElement(
                                                    React.Fragment,
                                                    null,
                                                    o,
                                                    e === "WU" && Ze > 0 ? " (" + Ze + ")" : "",
                                                  ),
                                            ),
                                            React.createElement(
                                              "div",
                                              { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                              O.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                    O.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        { key: le.anio, style: { fontSize: 11.5 } },
                                                        React.createElement(
                                                          "span",
                                                          { style: { color: MUTED, fontWeight: 400 } },
                                                          le.anio,
                                                          ": ",
                                                        ),
                                                        fmtSmart(le.venta, le.ventaUSD),
                                                      ),
                                                    ),
                                                  )
                                                : fmtSmart(a, x),
                                            ),
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  textAlign: "right",
                                                  fontVariantNumeric: "tabular-nums",
                                                  color: MUTED,
                                                },
                                              },
                                              _.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                    _.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        { key: le.anio, style: { fontSize: 11.5 } },
                                                        React.createElement(
                                                          "span",
                                                          { style: { fontWeight: 400 } },
                                                          le.anio,
                                                          ": ",
                                                        ),
                                                        fmtSmart(le.costo, le.costoUSD),
                                                      ),
                                                    ),
                                                  )
                                                : fmtSmart(r, D),
                                            ),
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  textAlign: "right",
                                                  fontVariantNumeric: "tabular-nums",
                                                  color: i > 0 ? RED : MUTED,
                                                },
                                              },
                                              fmtSmart(i, u),
                                            ),
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  textAlign: "right",
                                                  fontVariantNumeric: "tabular-nums",
                                                  color: MUTED,
                                                },
                                              },
                                              Ge.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                    Ge.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        { key: le.anio, style: { fontSize: 11.5 } },
                                                        React.createElement(
                                                          "span",
                                                          { style: { fontWeight: 400 } },
                                                          le.anio,
                                                          ": ",
                                                        ),
                                                        fmt(le.precioM2),
                                                      ),
                                                    ),
                                                  )
                                                : Te != null
                                                  ? fmt(Te)
                                                  : "—",
                                            ),
                                            React.createElement(
                                              "div",
                                              { style: { textAlign: "right" } },
                                              Ie.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    {
                                                      style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 1,
                                                        alignItems: "flex-end",
                                                      },
                                                    },
                                                    Ie.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        {
                                                          key: le.anio,
                                                          style: {
                                                            fontSize: 11.5,
                                                            display: "flex",
                                                            gap: 4,
                                                            alignItems: "baseline",
                                                          },
                                                        },
                                                        React.createElement(
                                                          "span",
                                                          { style: { color: MUTED, fontWeight: 400 } },
                                                          le.anio,
                                                          ":",
                                                        ),
                                                        React.createElement(MBValue, { v: valSmart(le.mb, le.mbUSD) }),
                                                      ),
                                                    ),
                                                  )
                                                : React.createElement(MBValue, { v: valSmart(m, T) }),
                                            ),
                                            React.createElement(
                                              "div",
                                              { style: { display: "flex", justifyContent: "center", color: MUTED } },
                                              React.createElement(ChevronRight, { size: 16 }),
                                            ),
                                          ),
                                      ),
                                      React.createElement(
                                        "div",
                                        {
                                          style: {
                                            display: "grid",
                                            gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1.1fr 1fr 32px",
                                            columnGap: 10,
                                            padding: "12px 18px",
                                            fontSize: 13.5,
                                            fontWeight: 700,
                                            background: "#F1E9D2",
                                          },
                                        },
                                        React.createElement("div", { style: { color: NAVY } }, "TOTAL"),
                                        React.createElement("div", { style: { textAlign: "right" } }, ro.count),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                          un.length > 1
                                            ? React.createElement(
                                                "div",
                                                { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                un.map((e) =>
                                                  React.createElement(
                                                    "div",
                                                    { key: e.anio, style: { fontSize: 12 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { color: MUTED, fontWeight: 400 } },
                                                      e.anio,
                                                      ": ",
                                                    ),
                                                    fmtSmart(e.venta, e.ventaUSD),
                                                  ),
                                                ),
                                              )
                                            : fmtSmart(ro.venta, ro.ventaUSD),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                          un.length > 1
                                            ? React.createElement(
                                                "div",
                                                { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                un.map((e) =>
                                                  React.createElement(
                                                    "div",
                                                    { key: e.anio, style: { fontSize: 12 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { color: MUTED, fontWeight: 400 } },
                                                      e.anio,
                                                      ": ",
                                                    ),
                                                    fmtSmart(e.costo, e.costoUSD),
                                                  ),
                                                ),
                                              )
                                            : fmtSmart(ro.costo, ro.costoUSD),
                                        ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              textAlign: "right",
                                              fontVariantNumeric: "tabular-nums",
                                              color: ro.saldo > 0 ? RED : NAVY,
                                            },
                                          },
                                          fmtSmart(ro.saldo, ro.saldoUSD),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                          un.length > 1
                                            ? React.createElement(
                                                "div",
                                                { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                un.map((e) =>
                                                  React.createElement(
                                                    "div",
                                                    { key: e.anio, style: { fontSize: 12 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { color: MUTED, fontWeight: 400 } },
                                                      e.anio,
                                                      ": ",
                                                    ),
                                                    e.precioM2 != null ? fmt(e.precioM2) : "—",
                                                  ),
                                                ),
                                              )
                                            : ro.precioM2 != null
                                              ? fmt(ro.precioM2)
                                              : "—",
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right" } },
                                          un.length > 1
                                            ? React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1,
                                                    alignItems: "flex-end",
                                                  },
                                                },
                                                un.map((e) =>
                                                  React.createElement(
                                                    "div",
                                                    {
                                                      key: e.anio,
                                                      style: {
                                                        fontSize: 12,
                                                        display: "flex",
                                                        gap: 4,
                                                        alignItems: "baseline",
                                                      },
                                                    },
                                                    React.createElement(
                                                      "span",
                                                      { style: { color: MUTED, fontWeight: 400 } },
                                                      e.anio,
                                                      ":",
                                                    ),
                                                    React.createElement(MBValue, { v: valSmart(e.mb, e.mbUSD) }),
                                                  ),
                                                ),
                                              )
                                            : React.createElement(MBValue, { v: valSmart(ro.mb, ro.mbUSD) }),
                                        ),
                                        React.createElement("div", null),
                                      ),
                                    ),
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          marginTop: 24,
                                          marginBottom: 10,
                                          fontSize: 13,
                                          fontWeight: 700,
                                          color: NAVY,
                                          display: "flex",
                                          alignItems: "baseline",
                                          gap: 8,
                                        },
                                      },
                                      "Todos los centros de costo",
                                      React.createElement(
                                        "span",
                                        { style: { fontSize: 11.5, fontWeight: 600, color: MUTED } },
                                        "(",
                                        jo.filter((e) => e.status !== "FINALIZADA").length,
                                        " en proceso)",
                                      ),
                                    ),
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
                                            gridTemplateColumns: "1.6fr 1.6fr 1fr 1fr 1fr",
                                            columnGap: 10,
                                            padding: "11px 18px",
                                            fontSize: 11.5,
                                            fontWeight: 700,
                                            background: "#EFEDE7",
                                            borderBottom: "1px solid " + BORDER,
                                            letterSpacing: 0.3,
                                          },
                                        },
                                        React.createElement(SortHeader, {
                                          label: "CLIENTE",
                                          tableId: "allObrasList",
                                          sortKey: "cliente",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "CENTRO DE COSTO",
                                          tableId: "allObrasList",
                                          sortKey: "obra",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "ESTADO",
                                          tableId: "allObrasList",
                                          sortKey: "status",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "PRECIO X M2",
                                          tableId: "allObrasList",
                                          sortKey: "precioM2",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "MB / MARKUP",
                                          tableId: "allObrasList",
                                          sortKey: "mbFinal",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                      ),
                                      (() => {
                                        const e = j.trim().toLowerCase(),
                                          t = jo
                                            .filter(
                                              (o) =>
                                                !e ||
                                                o.cliente.toLowerCase().includes(e) ||
                                                o.obra.toLowerCase().includes(e),
                                            )
                                            .map((o) => {
                                              const a = Ln(o);
                                              return { ...o, precioM2: a > 0 ? o.ventaFinal / a : null };
                                            });
                                        return t.length === 0
                                          ? React.createElement(
                                              "div",
                                              { style: { padding: 20, fontSize: 12.5, color: MUTED } },
                                              "No hay centros de costo cargados.",
                                            )
                                          : So("allObrasList", t).map((o) => {
                                              const a = obraKey(o.cliente, o.obra);
                                              return React.createElement(
                                                "div",
                                                {
                                                  key: a,
                                                  onClick: () => {
                                                    (be(o.cliente), no(a), ae("facturas"));
                                                  },
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "1.6fr 1.6fr 1fr 1fr 1fr",
                                                    columnGap: 10,
                                                    padding: "10px 18px",
                                                    fontSize: 13,
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid " + BORDER,
                                                  },
                                                },
                                                React.createElement(
                                                  "div",
                                                  { style: { fontWeight: 700, color: NAVY } },
                                                  o.cliente,
                                                ),
                                                React.createElement("div", null, o.obra),
                                                React.createElement(
                                                  "div",
                                                  null,
                                                  React.createElement(StatusBadge, { status: o.status }),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      textAlign: "right",
                                                      fontVariantNumeric: "tabular-nums",
                                                      color: MUTED,
                                                    },
                                                  },
                                                  o.precioM2 != null ? fmt(o.precioM2) : "—",
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right" } },
                                                  React.createElement(MBValue, {
                                                    v: valSmart(o.mbFinal, o.mbFinalUSD),
                                                  }),
                                                ),
                                              );
                                            });
                                      })(),
                                    ),
                                  ),
                            )
                          : Ot
                            ? (() => {
                                const e = (Tn[se] || []).find((h) => obraKey(h.cliente, h.obra) === Ot);
                                if (!e) return null;
                                const t = Ot,
                                  o = proveedoresMap[t] || [],
                                  a = pagosMap[t] || [],
                                  r = (Do[t] || "").trim().toLowerCase(),
                                  i = a
                                    .map((h, N) => ({ ...h, _idx: N }))
                                    .filter((h) => !r || h.proveedor.toLowerCase().includes(r)),
                                  u = Jo[t],
                                  m = Vt[t],
                                  x = e.cliente !== "WU",
                                  D = (x && Number(e.m2)) || 0,
                                  T = x ? "1.7fr 1fr 1fr 1fr 1fr 1fr 1.2fr 50px" : "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px",
                                  O = o.map((h, N) => {
                                    const De = a
                                        .filter((Qe) => Qe.proveedor === h.proveedor)
                                        .reduce((Qe, z) => Qe + z.monto, 0),
                                      Ce = presupuestoEfectivo(h.presupuesto, De),
                                      ie = (Ce || 0) - (h.presupuestoOriginal || 0),
                                      Fe = h.presupuestoOriginal ? (ie / h.presupuestoOriginal) * 100 : 0,
                                      qe = x && D > 0 ? Ce / D : null;
                                    return {
                                      ...h,
                                      presupuesto: Ce,
                                      pagado: De,
                                      resta: Ce - De,
                                      desvio: ie,
                                      desvioPct: Fe,
                                      precioM2: qe,
                                      _idx: N,
                                    };
                                  }),
                                  _ = Fa(t, e.cliente, e.ventaFinal, e.ventaFinalUSD, e.status),
                                  xe = _
                                    ? [
                                        ...O,
                                        { ..._, pagado: 0, resta: _.presupuesto, desvio: 0, desvioPct: 0, _idx: -1 },
                                      ]
                                    : O,
                                  Ie = O.reduce((h, N) => h + N.desvio, 0),
                                  Te = O.reduce((h, N) => h + (N.presupuestoOriginal || 0), 0),
                                  Ge = Te ? (Ie / Te) * 100 : 0,
                                  Ze = g.filter((h) => h.cliente === e.cliente && h.obra === e.obra),
                                  le = Ze.reduce((h, N) => h + (N.importe || 0), 0),
                                  ft = Ze.filter((h) => h.status === "PAGADA").reduce(
                                    (h, N) => h + (N.importe || 0),
                                    0,
                                  ),
                                  to = e.ventaFinal - le;
                                return React.createElement(
                                  React.Fragment,
                                  null,
                                  Qt &&
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => {
                                          (lo(false), setVista("cashflow"));
                                        },
                                        style: { ...smallBtnGhost, marginBottom: 14, marginRight: 8 },
                                      },
                                      React.createElement(ArrowLeft, { size: 14 }),
                                      " Volver a Cashflow",
                                    ),
                                  React.createElement(
                                    "button",
                                    {
                                      onClick: () => {
                                        (lo(false), no(null), ot(false), $t(null), vo(false), ao(null));
                                      },
                                      style: { ...smallBtnGhost, marginBottom: 14 },
                                    },
                                    React.createElement(ArrowLeft, { size: 14 }),
                                    " Volver a ",
                                    se,
                                  ),
                                  React.createElement(
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
                                      {
                                        style: {
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "flex-start",
                                          marginBottom: 6,
                                        },
                                      },
                                      React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              fontFamily: "Georgia, serif",
                                              fontSize: 20,
                                              fontWeight: 700,
                                              color: NAVY,
                                            },
                                          },
                                          e.obra,
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { fontSize: 12.5, color: MUTED, marginTop: 2 } },
                                          e.cliente,
                                          " · ",
                                          e.mes ? e.mes.charAt(0) + e.mes.slice(1).toLowerCase() : "—",
                                          " ",
                                          e.anio || "",
                                        ),
                                      ),
                                      React.createElement(
                                        "div",
                                        { style: { display: "flex", alignItems: "center", gap: 10 } },
                                        React.createElement(StatusBadge, {
                                          status: e.status,
                                          onClick: Rt ? () => Ha(e) : void 0,
                                        }),
                                        Rt &&
                                          React.createElement(
                                            "button",
                                            { onClick: () => tn(true), style: smallBtnGhost },
                                            React.createElement(Pencil, { size: 13 }),
                                            " Editar",
                                          ),
                                        fn &&
                                          React.createElement(
                                            "button",
                                            {
                                              onClick: () => {
                                                const h = g.filter(
                                                    (Ce) => Ce.cliente === e.cliente && Ce.obra === e.obra,
                                                  ).length,
                                                  N = (Tn[e.cliente] || []).length <= 1,
                                                  De =
                                                    '¿Seguro que querés BORRAR la obra "' +
                                                    e.obra +
                                                    '" de ' +
                                                    e.cliente +
                                                    `?

Se borran también todos sus proveedores, pagos y adicionales` +
                                                    (e.cliente === "WU"
                                                      ? ", órdenes de compra y sub obras de Costos"
                                                      : "") +
                                                    "." +
                                                    (h > 0
                                                      ? " Las " +
                                                        h +
                                                        " factura(s) de esta obra se mueven a la Papelera de facturas (se pueden recuperar desde ahí)."
                                                      : "") +
                                                    (N
                                                      ? `

Es la única obra de ` +
                                                        e.cliente +
                                                        ": el cliente también va a desaparecer de la lista."
                                                      : "") +
                                                    `

Esta acción se puede deshacer con el botón "Deshacer" del menú (salvo las facturas, que quedan en la Papelera).`;
                                                window.confirm(De) &&
                                                  (si(e.cliente, e.obra),
                                                  lo(false),
                                                  no(null),
                                                  ot(false),
                                                  $t(null),
                                                  vo(false),
                                                  ao(null),
                                                  N && be(null));
                                              },
                                              style: { ...smallBtnGhost, color: RED, borderColor: RED },
                                            },
                                            React.createElement(Trash2, { size: 13 }),
                                            " Eliminar obra",
                                          ),
                                      ),
                                    ),
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          display: "grid",
                                          gridTemplateColumns: e.cliente === "WU" ? "repeat(5, 1fr)" : "repeat(4, 1fr)",
                                          columnGap: 10,
                                          gap: 12,
                                          marginTop: 14,
                                        },
                                      },
                                      React.createElement(MiniStat, {
                                        label: e.totalSubobras > 0 ? "VENTA ORIGINAL (AUTO)" : "VENTA ORIGINAL",
                                        value: fmt(e.ventaOriginal, e.tc),
                                      }),
                                      React.createElement(
                                        "div",
                                        { onClick: () => ot((h) => !h), style: { cursor: "pointer" } },
                                        React.createElement(MiniStat, {
                                          label: "ADICIONALES " + (re ? "▲" : "▼"),
                                          value: fmt(e.totalAdicionales),
                                          color: e.totalAdicionales > 0 ? GOLD : MUTED,
                                        }),
                                      ),
                                      e.cliente === "WU" &&
                                        React.createElement(
                                          "div",
                                          { onClick: () => vo((h) => !h), style: { cursor: "pointer" } },
                                          React.createElement(MiniStat, {
                                            label: "ÓRDENES DE COMPRA " + (eo ? "▲" : "▼"),
                                            value: fmt(e.totalSubobras),
                                            color: e.totalSubobras > 0 ? GOLD : MUTED,
                                          }),
                                        ),
                                      React.createElement(MiniStat, {
                                        label: "VENTA TOTAL",
                                        value: fmtSmart(e.ventaFinal, e.ventaFinalUSD),
                                        color: NAVY,
                                      }),
                                      React.createElement(MiniStat, {
                                        label: "COSTO INICIAL",
                                        value: fmt(e.costoInicial, e.tc),
                                      }),
                                    ),
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          display: "grid",
                                          gridTemplateColumns: "repeat(4, 1fr)",
                                          columnGap: 10,
                                          gap: 12,
                                          marginTop: 12,
                                        },
                                      },
                                      React.createElement(MiniStat, {
                                        label: "COSTO REAL",
                                        value: fmtSmart(e.costoFinal, e.costoFinalUSD),
                                      }),
                                      React.createElement(MiniStat, {
                                        label: "MB INICIAL / MARKUP",
                                        value: pctMkSmart(e.mbInicial, e.mbInicialUSD),
                                        color:
                                          valSmart(e.mbInicial, e.mbInicialUSD) < 15
                                            ? RED
                                            : valSmart(e.mbInicial, e.mbInicialUSD) >= 30
                                              ? GREEN
                                              : NAVY,
                                      }),
                                      React.createElement(MiniStat, {
                                        label: "MB FINAL / MARKUP",
                                        value: pctMkSmart(e.mbFinal, e.mbFinalUSD),
                                        color:
                                          valSmart(e.mbFinal, e.mbFinalUSD) < 15
                                            ? RED
                                            : valSmart(e.mbFinal, e.mbFinalUSD) >= 30
                                              ? GREEN
                                              : NAVY,
                                      }),
                                      React.createElement(MiniStat, {
                                        label: "DESVÍO TOTAL vs. PRESUPUESTO",
                                        value: fmt(Ie) + " (" + (Ge >= 0 ? "+" : "") + Ge.toFixed(1) + "%)",
                                        color: Ie > 0 ? RED : Ie < 0 ? GREEN : MUTED,
                                      }),
                                    ),
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          display: "grid",
                                          gridTemplateColumns: x ? "repeat(5, 1fr)" : "repeat(4, 1fr)",
                                          columnGap: 10,
                                          gap: 12,
                                          marginTop: 12,
                                          paddingTop: 12,
                                          borderTop: "1px solid " + BORDER,
                                        },
                                      },
                                      React.createElement(
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
                                          "DÍAS DE OBRA",
                                        ),
                                        Rt
                                          ? React.createElement("input", {
                                              type: "number",
                                              placeholder: "—",
                                              style: {
                                                ...inputStyle,
                                                width: "100%",
                                                maxWidth: 110,
                                                boxSizing: "border-box",
                                                fontFamily: "Georgia, serif",
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: NAVY,
                                              },
                                              value: e.diasObra ?? "",
                                              onChange: (h) => Nn(t, "diasObra", h.target.value),
                                              onBlur: (h) => {
                                                h.target.value !== "" &&
                                                  _t(
                                                    "Días de obra de " +
                                                      e.cliente +
                                                      " - " +
                                                      e.obra +
                                                      ": " +
                                                      h.target.value,
                                                  );
                                              },
                                            })
                                          : React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  fontFamily: "Georgia, serif",
                                                  fontSize: 17,
                                                  fontWeight: 700,
                                                  color: NAVY,
                                                },
                                              },
                                              e.diasObra || "—",
                                            ),
                                      ),
                                      x &&
                                        React.createElement(
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
                                            "M2",
                                          ),
                                          Rt
                                            ? React.createElement("input", {
                                                type: "number",
                                                placeholder: "—",
                                                style: {
                                                  ...inputStyle,
                                                  width: "100%",
                                                  maxWidth: 110,
                                                  boxSizing: "border-box",
                                                  fontFamily: "Georgia, serif",
                                                  fontSize: 15,
                                                  fontWeight: 700,
                                                  color: NAVY,
                                                },
                                                value: e.m2 ?? "",
                                                onChange: (h) => Nn(t, "m2", h.target.value),
                                                onBlur: (h) => {
                                                  h.target.value !== "" &&
                                                    _t("M2 de " + e.cliente + " - " + e.obra + ": " + h.target.value);
                                                },
                                              })
                                            : React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    fontFamily: "Georgia, serif",
                                                    fontSize: 17,
                                                    fontWeight: 700,
                                                    color: NAVY,
                                                  },
                                                },
                                                e.m2 || "—",
                                              ),
                                        ),
                                      React.createElement(
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
                                          "PM",
                                        ),
                                        React.createElement(CascadingSelect, {
                                          value: e.pm || "",
                                          options: pmCatalogo,
                                          disabled: !Rt,
                                          emptyLabel: "Elegí un PM",
                                          newLabel: "+ Agregar nuevo PM",
                                          style: {
                                            ...inputStyle,
                                            width: "100%",
                                            boxSizing: "border-box",
                                            fontFamily: "Georgia, serif",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: NAVY,
                                          },
                                          onCommit: (h) => {
                                            const N = h.trim().toUpperCase();
                                            (setPmCatalogo((De) => (De.includes(N) ? De : [...De, N].sort())),
                                              Nn(t, "pm", N),
                                              _t("Asignó PM " + N + " a " + e.cliente + " - " + e.obra));
                                          },
                                        }),
                                      ),
                                      React.createElement(
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
                                          "DDO",
                                        ),
                                        React.createElement(CascadingSelect, {
                                          value: e.ddo || "",
                                          options: ddoCatalogo,
                                          disabled: !Rt,
                                          emptyLabel: "Elegí un DDO",
                                          newLabel: "+ Agregar nuevo DDO",
                                          style: {
                                            ...inputStyle,
                                            width: "100%",
                                            boxSizing: "border-box",
                                            fontFamily: "Georgia, serif",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: NAVY,
                                          },
                                          onCommit: (h) => {
                                            const N = h.trim().toUpperCase();
                                            (setDdoCatalogo((De) => (De.includes(N) ? De : [...De, N].sort())),
                                              Nn(t, "ddo", N),
                                              _t("Asignó DDO " + N + " a " + e.cliente + " - " + e.obra));
                                          },
                                        }),
                                      ),
                                      React.createElement("div", null),
                                    ),
                                    e.cliente === "WU" &&
                                      eo &&
                                      (() => {
                                        const h = ordenesCompraMap[t] || [],
                                          N = qo,
                                          De = costoSubobrasMap[t] || [],
                                          adicLista = adicionalesPorOC(De, h.map((ie) => ie.ordenCompra)),
                                          adicUsadosLista = new Set(),
                                          Ce = h.map((ie, Fe) => {
                                            const qe = (ie.ordenCompra || "").trim(),
                                              Qe = qe
                                                ? De.map((yt, uo) => ({ ...yt, _idx: uo })).filter((yt) =>
                                                    ordenCompraIncluye(yt.ordenCompra, qe),
                                                  )
                                                : [],
                                              z = Qe.map((yt) => {
                                                const uo = subCostoKey(t, yt.id),
                                                  Xo = subCostoProveedoresMap[uo] || [],
                                                  He = subCostoPagosMap[uo] || [],
                                                  Je = Xo.reduce(
                                                    (Co, $) =>
                                                      Co +
                                                      presupuestoEfectivo(
                                                        $.presupuesto,
                                                        pagadoDeProveedor(He, $.proveedor),
                                                      ),
                                                    0,
                                                  ),
                                                  bt = (yt.adicionales || []).reduce((Co, $) => Co + ($.monto || 0), 0),
                                                  Et = montoDeSubCostoParaOC(yt, qe) + bt,
                                                  Po = Et ? ((Et - Je) / Et) * 100 : 0;
                                                return {
                                                  sc: yt,
                                                  scCosto: Je,
                                                  scAdicionalTotal: bt,
                                                  scVentaEfectiva: Et,
                                                  scMB: Po,
                                                };
                                              }),
                                              he = z.reduce((yt, uo) => yt + uo.scVentaEfectiva, 0),
                                              Se = z.reduce((yt, uo) => yt + uo.scCosto, 0),
                                              je = he ? ((he - Se) / he) * 100 : 0,
                                              $e = (
                                                qe
                                                  ? Ze.filter(
                                                      (yt) => normalizarTexto(yt.ordenCompra) === normalizarTexto(qe),
                                                    )
                                                  : []
                                              ).reduce((yt, uo) => yt + (uo.importe || 0), 0),
                                              adicRow = !adicUsadosLista.has(normOC(qe)) && adicLista[normOC(qe)],
                                              adicMonto = adicRow ? adicRow.monto : 0,
                                              tt = (ie.venta || 0) + adicMonto - $e;
                                            return (
                                              adicRow && adicUsadosLista.add(normOC(qe)),
                                              {
                                                s: ie,
                                                i: Fe,
                                                ocTexto: qe,
                                                ligadas: Qe,
                                                ligadasConDatos: z,
                                                mbPromedio: je,
                                                saldoAFacturar: tt,
                                                adicional: adicRow || null,
                                              }
                                            );
                                          }),
                                          ocsAdicionalesNuevas = Object.values(adicLista)
                                            .filter((ie) => !ie.existente)
                                            .map((ie) => {
                                              const Fe = Ze.filter(
                                                (qe) => normalizarTexto(qe.ordenCompra) === normalizarTexto(ie.oc),
                                              ).reduce((qe, Qe) => qe + (Qe.importe || 0), 0);
                                              return { ...ie, saldoAFacturar: ie.monto - Fe };
                                            });
                                        return React.createElement(
                                          "div",
                                          {
                                            style: { marginTop: 14, borderTop: "1px solid " + BORDER, paddingTop: 12 },
                                          },
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 10,
                                                marginBottom: 6,
                                                flexWrap: "wrap",
                                              },
                                            },
                                            React.createElement(
                                              "div",
                                              { style: { fontSize: 11, fontWeight: 700, color: MUTED } },
                                              "ÓRDENES DE COMPRA",
                                            ),
                                            (h.length > 0 || ocsAdicionalesNuevas.length > 0) &&
                                              React.createElement(
                                                "button",
                                                {
                                                  onClick: () => {
                                                    const ie = [];
                                                    Ce.forEach(
                                                      ({
                                                        s: qe,
                                                        ocTexto: Qe,
                                                        ligadasConDatos: z,
                                                        saldoAFacturar: he,
                                                        adicional: adicX,
                                                      }) => {
                                                        if (z.length === 0) {
                                                          ie.push({
                                                            "Orden de Compra": Qe || "—",
                                                            Fecha: qe.fecha || "—",
                                                            "Sub Obra": "—",
                                                            Estado: "—",
                                                            Venta: qe.venta || 0,
                                                            Adicionales: adicX ? adicX.monto : 0,
                                                            MB: "",
                                                            "Saldo a Facturar": he,
                                                          });
                                                          return;
                                                        }
                                                        const Se = z.reduce((mt, $e) => mt + $e.scVentaEfectiva, 0),
                                                          je = (qe.venta || 0) + (adicX ? adicX.monto : 0) - he;
                                                        z.forEach(
                                                          ({
                                                            sc: mt,
                                                            scAdicionalTotal: $e,
                                                            scMB: tt,
                                                            scVentaEfectiva: yt,
                                                          }) => {
                                                            const uo = Se > 0 ? je * (yt / Se) : 0;
                                                            ie.push({
                                                              "Orden de Compra": Qe || "—",
                                                              Fecha: qe.fecha || "—",
                                                              "Sub Obra": mt.nombre,
                                                              Estado:
                                                                mt.status === "FINALIZADA"
                                                                  ? "Finalizada"
                                                                  : "En proceso",
                                                              Venta: mt.venta || 0,
                                                              Adicionales: $e,
                                                              MB: Number(tt.toFixed(1)),
                                                              Markup: markupDeMb(tt) == null ? "" : Number(markupDeMb(tt).toFixed(1)),
                                                              "Saldo a Facturar": Math.round(yt - uo),
                                                            });
                                                          },
                                                        );
                                                      },
                                                    );
                                                    ocsAdicionalesNuevas.forEach((qe) =>
                                                      ie.push({
                                                        "Orden de Compra": qe.oc,
                                                        Fecha: "—",
                                                        "Sub Obra": "Adicional de " + qe.subObras.join(", "),
                                                        Estado: "—",
                                                        Venta: qe.monto,
                                                        Adicionales: 0,
                                                        MB: "",
                                                        "Saldo a Facturar": qe.saldoAFacturar,
                                                      }),
                                                    );
                                                    const Fe = XLSX.utils.book_new();
                                                    (XLSX.utils.book_append_sheet(
                                                      Fe,
                                                      XLSX.utils.json_to_sheet(ie),
                                                      "Ordenes de Compra",
                                                    ),
                                                      descargarLibroXlsx(
                                                        Fe,
                                                        "ordenes_de_compra_" + t.replace(/[^a-z0-9]+/gi, "_") + ".xlsx",
                                                      ));
                                                  },
                                                  style: { ...smallBtnGhost, color: MUTED },
                                                },
                                                React.createElement(Download, { size: 13 }),
                                                " Descargar",
                                              ),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { fontSize: 11.5, color: MUTED, marginBottom: 8 } },
                                            'Cada orden de compra suma a la Venta Total y, según su fecha, se refleja en ese mes puntual en el gráfico de "Venta Consolidada por Mes" (no en el mes de la obra). El Saldo a Facturar resta las facturas de Facturación que tengan asignada esta misma Orden de Compra. Un adicional de sub obra cuya descripción es un número de orden de compra se suma a esa orden de compra (Venta y Saldo a Facturar); si el número es nuevo, aparece como una línea aparte con MB "—", porque su margen ya se cuenta en la orden de compra de la sub obra.',
                                          ),
                                          h.length === 0 && ocsAdicionalesNuevas.length === 0
                                            ? React.createElement(
                                                "div",
                                                { style: { fontSize: 12.5, color: MUTED, marginBottom: 8 } },
                                                "Todavía no cargaste órdenes de compra para esta obra.",
                                              )
                                            : React.createElement(
                                                React.Fragment,
                                                null,
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "grid",
                                                      gridTemplateColumns: "1fr 0.8fr 0.9fr 1.1fr 0.9fr 0.8fr 1.3fr 50px",
                                                      columnGap: 10,
                                                      fontSize: 11,
                                                      fontWeight: 700,
                                                      color: MUTED,
                                                      padding: "4px 8px",
                                                    },
                                                  },
                                                  React.createElement("div", null, "ORDEN DE COMPRA"),
                                                  React.createElement("div", null, "FECHA"),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "VENTA",
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "SALDO A FACTURAR",
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "MB PROMEDIO / MARKUP",
                                                  ),
                                                  React.createElement("div", null, "PDF"),
                                                  React.createElement("div", null),
                                                  React.createElement("div", null),
                                                ),
                                                Ce.map(
                                                  ({
                                                    s: ie,
                                                    i: Fe,
                                                    ocTexto: qe,
                                                    ligadas: Qe,
                                                    ligadasConDatos: z,
                                                    mbPromedio: he,
                                                    saldoAFacturar: Se,
                                                    adicional: adicRow,
                                                  }) =>
                                                    React.createElement(SubobraRow, {
                                                      key: Fe,
                                                      s: ie,
                                                      adicional: adicRow,
                                                      obraKey: t,
                                                      onSave: (je) => editarOrdenCompra(t, Fe, je),
                                                      onDelete: () => borrarOrdenCompra(t, Fe),
                                                      readOnly: !Rt,
                                                      saldoAFacturar: Se,
                                                      mbPromedio: he,
                                                      tieneLigadas: Qe.length > 0,
                                                      ligadasCount: Qe.length,
                                                      onVerSubObras: () =>
                                                        s({
                                                          k: t,
                                                          ocTexto: qe || "(sin número)",
                                                          venta: (ie.venta || 0) + (adicRow ? adicRow.monto : 0),
                                                          saldoAFacturar: Se,
                                                          mbPromedio: he,
                                                          tieneLigadas: Qe.length > 0,
                                                          subObras: z.map((je) => ({
                                                            nombre: je.sc.nombre,
                                                            status: je.sc.status || "EN PROCESO",
                                                            mb: je.scMB,
                                                            idx: je.sc._idx,
                                                          })),
                                                        }),
                                                    }),
                                                ),
                                                ocsAdicionalesNuevas.map((ie) =>
                                                  React.createElement(SubobraRow, {
                                                    key: "adic-" + ie.oc,
                                                    s: { ordenCompra: ie.oc, venta: ie.monto, fecha: "" },
                                                    esAdicionalNuevo: true,
                                                    adicional: ie,
                                                    readOnly: true,
                                                    saldoAFacturar: ie.saldoAFacturar,
                                                    mbPromedio: 0,
                                                    tieneLigadas: false,
                                                  }),
                                                ),
                                              ),
                                          Rt &&
                                            (N
                                              ? React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 6,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                      marginTop: 8,
                                                    },
                                                  },
                                                  React.createElement("input", {
                                                    placeholder: "Orden de compra",
                                                    style: inputStyle,
                                                    onChange: (ie) =>
                                                      ao((Fe) => ({ ...Fe, ordenCompra: ie.target.value })),
                                                  }),
                                                  React.createElement("input", {
                                                    placeholder: "Venta",
                                                    type: "number",
                                                    style: { ...inputStyle, width: 130 },
                                                    onChange: (ie) => ao((Fe) => ({ ...Fe, venta: ie.target.value })),
                                                  }),
                                                  React.createElement("input", {
                                                    placeholder: "Fecha (cualquier formato)",
                                                    style: { ...inputStyle, width: 150 },
                                                    onChange: (ie) => ao((Fe) => ({ ...Fe, fecha: ie.target.value })),
                                                  }),
                                                  React.createElement("input", {
                                                    placeholder: "Observaciones",
                                                    style: { ...inputStyle, width: 200 },
                                                    onChange: (ie) =>
                                                      ao((Fe) => ({ ...Fe, observaciones: ie.target.value })),
                                                  }),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => agregarOrdenCompra(t, N), style: smallBtnPrimary },
                                                    "Guardar",
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => ao(null), style: smallBtnGhost },
                                                    React.createElement(X, { size: 13 }),
                                                  ),
                                                )
                                              : React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 8,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                      marginTop: 8,
                                                    },
                                                  },
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => ao({ ordenCompra: "" }), style: smallBtnGhost },
                                                    React.createElement(Plus, { size: 13 }),
                                                    " Agregar orden de compra",
                                                  ),
                                                  React.createElement(
                                                    "label",
                                                    { style: smallBtnGhost },
                                                    React.createElement(Upload, { size: 13 }),
                                                    " Importar órdenes de compra (Excel)",
                                                    React.createElement("input", {
                                                      type: "file",
                                                      accept: ".xlsx,.xls,.csv",
                                                      style: { display: "none" },
                                                      onChange: async (ie) => {
                                                        const Fe = ie.target.files[0];
                                                        if (Fe) {
                                                          try {
                                                            const qe = await Fe.arrayBuffer(),
                                                              Qe = XLSX.read(qe, { type: "array" }),
                                                              z = Qe.Sheets[Qe.SheetNames[0]],
                                                              he = XLSX.utils.sheet_to_json(z, { defval: null }),
                                                              Se = ($e, tt) => {
                                                                for (const yt of Object.keys($e))
                                                                  if (tt.includes(yt.toString().trim().toLowerCase()))
                                                                    return $e[yt];
                                                                return null;
                                                              },
                                                              je = he.map(($e) => {
                                                                let tt = Se($e, ["fecha"]);
                                                                if (typeof tt == "number" && XLSX.SSF) {
                                                                  const yt = XLSX.SSF.parse_date_code(tt);
                                                                  tt = yt
                                                                    ? String(yt.d).padStart(2, "0") +
                                                                      "/" +
                                                                      String(yt.m).padStart(2, "0") +
                                                                      "/" +
                                                                      yt.y
                                                                    : String(tt);
                                                                }
                                                                return {
                                                                  ordenCompra: String(
                                                                    Se($e, ["orden de compra", "orden compra", "oc"]) ||
                                                                      "",
                                                                  ).trim(),
                                                                  venta: Number(Se($e, ["venta", "importe"])) || 0,
                                                                  fecha: tt ? String(tt) : null,
                                                                  observaciones: String(
                                                                    Se($e, ["observaciones"]) || "",
                                                                  ).trim(),
                                                                };
                                                              }),
                                                              mt = importarOrdenesCompraExcel(t, je);
                                                            zo(mt + " orden(es) de compra cargada(s).");
                                                          } catch {
                                                            zo("No se pudo leer el archivo.");
                                                          }
                                                          ie.target.value = "";
                                                        }
                                                      },
                                                    }),
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => {
                                                        const ie = XLSX.utils.aoa_to_sheet([
                                                            ["Orden de Compra", "Venta", "Fecha"],
                                                            ["OC-1234", 5e6, "15/03/2026"],
                                                          ]),
                                                          Fe = XLSX.utils.book_new();
                                                        (XLSX.utils.book_append_sheet(Fe, ie, "Ordenes de compra"),
                                                          descargarLibroXlsx(Fe, "plantilla_ordenes_compra.xlsx"));
                                                      },
                                                      style: { ...smallBtnGhost, color: MUTED },
                                                    },
                                                    "Plantilla de ejemplo",
                                                  ),
                                                  React.createElement(
                                                    "label",
                                                    { style: smallBtnGhost },
                                                    React.createElement(Upload, { size: 13 }),
                                                    " Cargar orden de compra con PDF",
                                                    React.createElement("input", {
                                                      type: "file",
                                                      accept: "application/pdf",
                                                      style: { display: "none" },
                                                      onChange: async (ie) => {
                                                        const Fe = ie.target.files[0];
                                                        if (((ie.target.value = ""), !!Fe)) {
                                                          OC_PDF_ST.pendientes[t] = Fe;
                                                          Uo((qe) => ({ ...qe, [t]: { status: "loading" } }));
                                                          try {
                                                            const {
                                                              ocNumero: qe,
                                                              total: Qe,
                                                              fechaPedido: z,
                                                              lineas: he,
                                                              sumaLineas: Se,
                                                            } = await extraerOrdenDeCompraDePdf(Fe);
                                                            if (!he.length)
                                                              throw new Error("No se encontraron líneas en el PDF.");
                                                            const je = costoSubobrasMap[t] || [],
                                                              mt = he.map(($e) => {
                                                                let tt = null;
                                                                if ($e.nombreExtraido) {
                                                                  const yt = je.map((Xo) => Xo.nombre),
                                                                    uo = resolverConCoincidencia(
                                                                      $e.nombreExtraido,
                                                                      yt,
                                                                      (correccionesAprendidas || {}).subObra,
                                                                    );
                                                                  if (uo.valor) {
                                                                    const Xo = je.findIndex(
                                                                      (He) =>
                                                                        normalizarTexto(He.nombre) ===
                                                                        normalizarTexto(uo.valor),
                                                                    );
                                                                    Xo >= 0 && (tt = Xo);
                                                                  }
                                                                  if (tt === null) {
                                                                    const Xo = je.findIndex((He) =>
                                                                      nombresSubobraCoinciden(
                                                                        He.nombre,
                                                                        $e.nombreExtraido,
                                                                      ),
                                                                    );
                                                                    Xo >= 0 && (tt = Xo);
                                                                  }
                                                                }
                                                                return {
                                                                  descripcion: $e.descripcion,
                                                                  monto: $e.monto,
                                                                  nombreExtraido: $e.nombreExtraido,
                                                                  target: tt !== null ? String(tt) : "nueva",
                                                                  nombreNueva:
                                                                    tt !== null
                                                                      ? je[tt].nombre
                                                                      : $e.nombreExtraido || "VARIOS",
                                                                };
                                                              });
                                                            Uo(($e) => ({
                                                              ...$e,
                                                              [t]: {
                                                                status: "review",
                                                                ocNumero: qe || "",
                                                                total: Qe,
                                                                sumaLineas: Se,
                                                                lineas: mt,
                                                                fechaPedido: z || "",
                                                              },
                                                            }));
                                                          } catch (qe) {
                                                            Uo((Qe) => ({
                                                              ...Qe,
                                                              [t]: {
                                                                status: "error",
                                                                error:
                                                                  "No se pudo leer el PDF (" +
                                                                  (qe.message || "error desconocido") +
                                                                  "). Podés cargar la orden a mano.",
                                                              },
                                                            }));
                                                          }
                                                        }
                                                      },
                                                    }),
                                                  ),
                                                )),
                                          Fo &&
                                            React.createElement(
                                              "div",
                                              { style: { fontSize: 11.5, color: MUTED, marginTop: 6 } },
                                              Fo,
                                            ),
                                          Zt[t] &&
                                            Zt[t].status === "loading" &&
                                            React.createElement(
                                              "div",
                                              { style: { fontSize: 12.5, color: MUTED, marginTop: 10 } },
                                              "Leyendo el PDF...",
                                            ),
                                          Zt[t] &&
                                            Zt[t].status === "error" &&
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 8,
                                                  fontSize: 12.5,
                                                  color: RED,
                                                  marginTop: 10,
                                                },
                                              },
                                              Zt[t].error,
                                              React.createElement(
                                                "button",
                                                {
                                                  onClick: () => Uo((ie) => ({ ...ie, [t]: null })),
                                                  style: { ...smallBtnGhost, padding: "3px 8px" },
                                                },
                                                React.createElement(X, { size: 12 }),
                                              ),
                                            ),
                                          Zt[t] &&
                                            Zt[t].status === "review" &&
                                            (() => {
                                              const ie = Zt[t],
                                                Fe = costoSubobrasMap[t] || [],
                                                qe = (he, Se) =>
                                                  Uo((je) => ({
                                                    ...je,
                                                    [t]: {
                                                      ...je[t],
                                                      lineas: je[t].lineas.map((mt, $e) =>
                                                        $e !== he ? mt : { ...mt, ...Se },
                                                      ),
                                                    },
                                                  })),
                                                Qe = ie.lineas.reduce((he, Se) => he + (Number(Se.monto) || 0), 0),
                                                z = ie.total !== null && Math.abs(Qe - ie.total) < 1;
                                              return React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    marginTop: 12,
                                                    border: "1px solid " + BORDER,
                                                    borderRadius: 10,
                                                    padding: 12,
                                                    background: "#FAF8F3",
                                                  },
                                                },
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      fontSize: 12,
                                                      fontWeight: 700,
                                                      color: NAVY,
                                                      marginBottom: 8,
                                                    },
                                                  },
                                                  "Revisá lo que se leyó del PDF antes de confirmar",
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 16,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                      marginBottom: 10,
                                                    },
                                                  },
                                                  React.createElement(
                                                    "div",
                                                    { style: { display: "flex", alignItems: "center", gap: 6 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { fontSize: 11.5, color: MUTED } },
                                                      "Orden de compra:",
                                                    ),
                                                    React.createElement("input", {
                                                      value: ie.ocNumero,
                                                      onChange: (he) =>
                                                        Uo((Se) => ({
                                                          ...Se,
                                                          [t]: { ...Se[t], ocNumero: he.target.value },
                                                        })),
                                                      style: { ...inputStyle, width: 150 },
                                                    }),
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    { style: { display: "flex", alignItems: "center", gap: 6 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { fontSize: 11.5, color: MUTED } },
                                                      "Fecha del pedido:",
                                                    ),
                                                    React.createElement("input", {
                                                      value: ie.fechaPedido || "",
                                                      placeholder: "dd/mm/aaaa",
                                                      onChange: (he) =>
                                                        Uo((Se) => ({
                                                          ...Se,
                                                          [t]: { ...Se[t], fechaPedido: he.target.value },
                                                        })),
                                                      style: {
                                                        ...inputStyle,
                                                        width: 100,
                                                        ...(ie.fechaPedido ? {} : { borderColor: RED }),
                                                      },
                                                    }),
                                                    !ie.fechaPedido &&
                                                      React.createElement(
                                                        "span",
                                                        { style: { fontSize: 11, color: RED } },
                                                        "no encontrada en el PDF, completala",
                                                      ),
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    { style: { fontSize: 11.5, color: MUTED } },
                                                    "Total del PDF: ",
                                                    React.createElement(
                                                      "b",
                                                      { style: { color: NAVY } },
                                                      ie.total !== null ? fmt(ie.total) : "no encontrado",
                                                    ),
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    {
                                                      style: {
                                                        fontSize: 11.5,
                                                        color: z ? GREEN : RED,
                                                        fontWeight: 600,
                                                      },
                                                    },
                                                    "Suma de líneas: ",
                                                    fmt(Qe),
                                                    " ",
                                                    ie.total !== null &&
                                                      (z
                                                        ? "✓ coincide con el total"
                                                        : "— no coincide con el total del PDF, revisá los montos"),
                                                  ),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "grid",
                                                      gridTemplateColumns: "2fr 1.6fr 1fr",
                                                      columnGap: 10,
                                                      fontSize: 11,
                                                      fontWeight: 700,
                                                      color: MUTED,
                                                      padding: "4px 8px",
                                                    },
                                                  },
                                                  React.createElement("div", null, "LÍNEA DEL PDF"),
                                                  React.createElement("div", null, "ASIGNAR A"),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "MONTO",
                                                  ),
                                                ),
                                                ie.lineas.map((he, Se) =>
                                                  React.createElement(
                                                    "div",
                                                    {
                                                      key: Se,
                                                      style: {
                                                        display: "grid",
                                                        gridTemplateColumns: "2fr 1.6fr 1fr",
                                                        columnGap: 10,
                                                        fontSize: 12,
                                                        padding: "5px 8px",
                                                        alignItems: "center",
                                                      },
                                                    },
                                                    React.createElement(
                                                      "div",
                                                      { style: { color: MUTED, fontSize: 11 }, title: he.descripcion },
                                                      he.nombreExtraido || "(sin sub obra marcada — VARIOS)",
                                                    ),
                                                    React.createElement(
                                                      "div",
                                                      { style: { display: "flex", gap: 6, alignItems: "center" } },
                                                      React.createElement(
                                                        "select",
                                                        {
                                                          value: he.target,
                                                          onChange: (je) => qe(Se, { target: je.target.value }),
                                                          style: { ...inputStyle, width: "100%" },
                                                        },
                                                        React.createElement(
                                                          "option",
                                                          { value: "nueva" },
                                                          "— Nueva sub obra —",
                                                        ),
                                                        Fe.map((je, mt) =>
                                                          React.createElement(
                                                            "option",
                                                            { key: mt, value: String(mt) },
                                                            je.nombre,
                                                          ),
                                                        ),
                                                      ),
                                                      he.target === "nueva" &&
                                                        React.createElement("input", {
                                                          value: he.nombreNueva,
                                                          onChange: (je) => qe(Se, { nombreNueva: je.target.value }),
                                                          placeholder: "Nombre de la sub obra",
                                                          style: { ...inputStyle, width: 160 },
                                                        }),
                                                    ),
                                                    React.createElement("input", {
                                                      type: "number",
                                                      value: he.monto,
                                                      onChange: (je) => qe(Se, { monto: Number(je.target.value) || 0 }),
                                                      style: { ...inputStyle, width: "100%", textAlign: "right" },
                                                    }),
                                                  ),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { display: "flex", gap: 8, marginTop: 10 } },
                                                  React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => {
                                                        const he = ie.lineas.map((Se) =>
                                                          Se.target === "nueva"
                                                            ? {
                                                                targetIdx: null,
                                                                nombreNueva: (Se.nombreNueva || "VARIOS").toUpperCase(),
                                                                monto: Number(Se.monto) || 0,
                                                              }
                                                            : {
                                                                targetIdx: Number(Se.target),
                                                                monto: Number(Se.monto) || 0,
                                                              },
                                                        );
                                                        (ie.lineas.forEach((Se) => {
                                                          if (!Se.nombreExtraido) return;
                                                          const je =
                                                            Se.target === "nueva"
                                                              ? (Se.nombreNueva || "VARIOS").toUpperCase()
                                                              : (Fe[Number(Se.target)] || {}).nombre;
                                                          je && aprenderNombreSubObra(Se.nombreExtraido, je);
                                                        }),
                                                          ((ocImp) => {
                                                            importarOrdenCompraPdf(t, ocImp, ie.total || Qe, he, ie.fechaPedido);
                                                            const archivo = OC_PDF_ST.pendientes[t];
                                                            delete OC_PDF_ST.pendientes[t];
                                                            archivo &&
                                                              ocPdfGuardar(t, ocImp, archivo).catch((e) =>
                                                                window.alert(
                                                                  "La orden de compra se importó, pero no se pudo guardar el PDF: " +
                                                                    ((e && e.message) || e),
                                                                ),
                                                              );
                                                          })(ie.ocNumero || "PDF-" + Date.now()),
                                                          Uo((Se) => ({ ...Se, [t]: null })),
                                                          zo(
                                                            "Orden de compra importada desde PDF: " +
                                                              he.length +
                                                              " sub obra(s) actualizada(s).",
                                                          ));
                                                      },
                                                      style: smallBtnPrimary,
                                                    },
                                                    "Confirmar e importar",
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => Uo((he) => ({ ...he, [t]: null })),
                                                      style: smallBtnGhost,
                                                    },
                                                    "Cancelar",
                                                  ),
                                                ),
                                              );
                                            })(),
                                        );
                                      })(),
                                    re &&
                                      (() => {
                                        const h = adicionalesMap[t] || [],
                                          N = Ht;
                                        return React.createElement(
                                          "div",
                                          {
                                            style: { marginTop: 14, borderTop: "1px solid " + BORDER, paddingTop: 12 },
                                          },
                                          React.createElement(
                                            "div",
                                            { style: { fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 } },
                                            "ADICIONALES",
                                          ),
                                          h.length === 0
                                            ? React.createElement(
                                                "div",
                                                { style: { fontSize: 12.5, color: MUTED, marginBottom: 8 } },
                                                "Todavía no cargaste adicionales para esta obra.",
                                              )
                                            : React.createElement(
                                                React.Fragment,
                                                null,
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "grid",
                                                      gridTemplateColumns: "2fr 1fr 50px",
                                                      columnGap: 10,
                                                      fontSize: 11,
                                                      fontWeight: 700,
                                                      color: MUTED,
                                                      padding: "4px 8px",
                                                    },
                                                  },
                                                  React.createElement("div", null, "CONCEPTO"),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "MONTO",
                                                  ),
                                                  React.createElement("div", null),
                                                ),
                                                h.map((De, Ce) =>
                                                  React.createElement(AdicionalRow, {
                                                    key: Ce,
                                                    a: De,
                                                    onSave: (ie) => ui(t, Ce, ie),
                                                    onDelete: () => borrarAdicionalObra(t, Ce),
                                                    readOnly: !Rt,
                                                  }),
                                                ),
                                              ),
                                          e.cliente === "WU"
                                            ? React.createElement(
                                                "div",
                                                { style: { fontSize: 11.5, color: MUTED, marginTop: 8 } },
                                                "En WU, los adicionales nuevos se cargan dentro de cada sub obra (solapa Costos, más abajo) — los de acá arriba quedan como quedaron cargados antes.",
                                              )
                                            : Rt &&
                                                (N
                                                  ? React.createElement(
                                                      "div",
                                                      {
                                                        style: {
                                                          display: "flex",
                                                          gap: 6,
                                                          alignItems: "center",
                                                          flexWrap: "wrap",
                                                          marginTop: 8,
                                                        },
                                                      },
                                                      React.createElement("input", {
                                                        placeholder: "Concepto",
                                                        style: inputStyle,
                                                        onChange: (De) =>
                                                          $t((Ce) => ({ ...Ce, concepto: De.target.value })),
                                                      }),
                                                      React.createElement("input", {
                                                        placeholder: "Monto",
                                                        type: "number",
                                                        style: { ...inputStyle, width: 130 },
                                                        onChange: (De) =>
                                                          $t((Ce) => ({ ...Ce, monto: De.target.value })),
                                                      }),
                                                      React.createElement(
                                                        "button",
                                                        { onClick: () => ci(t, N), style: smallBtnPrimary },
                                                        "Guardar",
                                                      ),
                                                      React.createElement(
                                                        "button",
                                                        { onClick: () => $t(null), style: smallBtnGhost },
                                                        React.createElement(X, { size: 13 }),
                                                      ),
                                                    )
                                                  : React.createElement(
                                                      "button",
                                                      {
                                                        onClick: () => $t({ concepto: "" }),
                                                        style: { ...smallBtnGhost, marginTop: 8 },
                                                      },
                                                      React.createElement(Plus, { size: 13 }),
                                                      " Agregar adicional",
                                                    )),
                                        );
                                      })(),
                                  ),
                                  Wt &&
                                    React.createElement(EditObraForm, {
                                      obra: e,
                                      onCancel: () => tn(false),
                                      onSave: (h) => ii(t, h),
                                    }),
                                  React.createElement(
                                    "div",
                                    {
                                      style: {
                                        display: "flex",
                                        background: "#EDEAE1",
                                        borderRadius: 8,
                                        padding: 3,
                                        marginBottom: 16,
                                        width: "fit-content",
                                      },
                                    },
                                    ["facturas", "costos"].map((h) =>
                                      React.createElement(
                                        "button",
                                        {
                                          key: h,
                                          onClick: () => ae(h),
                                          style: {
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: 6,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            background: Kt === h ? "#fff" : "transparent",
                                            color: Kt === h ? NAVY : MUTED,
                                            boxShadow: Kt === h ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                                          },
                                        },
                                        h === "facturas" ? "Facturación" : "Costos",
                                      ),
                                    ),
                                  ),
                                  Kt === "facturas"
                                    ? React.createElement(
                                        React.Fragment,
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              display: "grid",
                                              gridTemplateColumns: "repeat(3, 1fr)",
                                              columnGap: 10,
                                              gap: 14,
                                              marginBottom: 16,
                                            },
                                          },
                                          React.createElement(SummaryCard, {
                                            label: "FACTURADO",
                                            value: fmt(le),
                                            color: NAVY,
                                          }),
                                          React.createElement(SummaryCard, {
                                            label: "PAGADO",
                                            value: fmt(ft),
                                            color: GREEN,
                                          }),
                                          React.createElement(SummaryCard, {
                                            label: "ADEUDADO (VENTA - FACTURADO)",
                                            value: fmt(to),
                                            color: RED,
                                          }),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { display: "flex", gap: 8, marginBottom: 12 } },
                                          Rt &&
                                            React.createElement(
                                              "button",
                                              { onClick: () => B({ status: "ADEUDA" }), style: smallBtnPrimary },
                                              React.createElement(Plus, { size: 13, style: { verticalAlign: "-2px" } }),
                                              " Cargar factura",
                                            ),
                                          fn &&
                                            to > 1 &&
                                            React.createElement(
                                              "button",
                                              { onClick: () => Oi(e), style: smallBtnGhost },
                                              "Marcar 100% facturado y cobrado",
                                            ),
                                          React.createElement(
                                            "button",
                                            { onClick: () => Ii(e), style: smallBtnGhost },
                                            "Descargar información de la obra",
                                          ),
                                        ),
                                        Lo &&
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                background: "#fff",
                                                border: "1px solid " + BORDER,
                                                borderRadius: 12,
                                                boxShadow: CARD_SHADOW,
                                                padding: 16,
                                                marginBottom: 14,
                                                display: "flex",
                                                gap: 8,
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                              },
                                            },
                                            React.createElement("input", {
                                              placeholder: "Concepto",
                                              style: inputStyle,
                                              onChange: (h) => B((N) => ({ ...N, concepto: h.target.value })),
                                            }),
                                            React.createElement("input", {
                                              placeholder: "Tipo (FC, S/F...)",
                                              style: { ...inputStyle, width: 100 },
                                              onChange: (h) => B((N) => ({ ...N, tipo: h.target.value })),
                                            }),
                                            React.createElement("input", {
                                              placeholder: "N°",
                                              style: { ...inputStyle, width: 80 },
                                              onChange: (h) => B((N) => ({ ...N, nro: h.target.value })),
                                            }),
                                            e.cliente === "WU" &&
                                              React.createElement("input", {
                                                placeholder: "Orden de Compra",
                                                list: "ocs-sugeridas-" + t,
                                                style: { ...inputStyle, width: 140 },
                                                onChange: (h) => B((N) => ({ ...N, ordenCompra: h.target.value })),
                                              }),
                                            React.createElement("input", {
                                              placeholder: "Fecha emisión (dd/mm/aaaa)",
                                              style: { ...inputStyle, width: 150 },
                                              value: Lo.fecha || "",
                                              onChange: (h) => B((N) => ({ ...N, fecha: h.target.value })),
                                              onBlur: (h) =>
                                                B((N) => ({ ...N, fecha: normalizarFecha(h.target.value) })),
                                            }),
                                            React.createElement(
                                              "select",
                                              {
                                                style: { ...selectStyle, width: 120 },
                                                value: Lo.status,
                                                onChange: (h) => B((N) => ({ ...N, status: h.target.value })),
                                              },
                                              React.createElement("option", { value: "ADEUDA" }, "Adeuda"),
                                              React.createElement("option", { value: "PAGADA" }, "Pagada"),
                                            ),
                                            React.createElement("input", {
                                              placeholder: "Importe",
                                              type: "number",
                                              style: { ...inputStyle, width: 110 },
                                              onChange: (h) => B((N) => ({ ...N, importe: h.target.value })),
                                            }),
                                            React.createElement("input", {
                                              placeholder: "Fecha de pago",
                                              style: { ...inputStyle, width: 130 },
                                              onChange: (h) => B((N) => ({ ...N, fechaPago: h.target.value })),
                                            }),
                                            React.createElement("input", {
                                              placeholder: "Forma de pago",
                                              style: { ...inputStyle, width: 130 },
                                              onChange: (h) => B((N) => ({ ...N, forma: h.target.value })),
                                            }),
                                            React.createElement(
                                              "label",
                                              { style: smallBtnGhost },
                                              React.createElement(Paperclip, { size: 13 }),
                                              " ",
                                              Lo.pdfName || "Adjuntar PDF",
                                              React.createElement("input", {
                                                type: "file",
                                                accept: "application/pdf",
                                                style: { display: "none" },
                                                onChange: async (h) => {
                                                  const N = h.target.files[0];
                                                  if (!N) return;
                                                  if (N.size > PDF_MAX_BYTES) {
                                                    alert(
                                                      "El PDF pesa demasiado (máx. 180 KB). Comprimilo o subilo a Drive y pegá el link en el concepto.",
                                                    );
                                                    return;
                                                  }
                                                  const De = await vi(N);
                                                  B((Ce) => ({ ...Ce, pdfData: De, pdfName: N.name }));
                                                },
                                              }),
                                            ),
                                            Lo.pdfName &&
                                              React.createElement(
                                                "button",
                                                {
                                                  onClick: () => B((h) => ({ ...h, pdfData: null, pdfName: null })),
                                                  title: "Quitar PDF adjunto",
                                                  style: {
                                                    border: "none",
                                                    background: "none",
                                                    cursor: "pointer",
                                                    color: RED,
                                                    display: "flex",
                                                  },
                                                },
                                                React.createElement(Trash2, { size: 13 }),
                                              ),
                                            React.createElement(
                                              "button",
                                              {
                                                onClick: () => {
                                                  (Yr(e.cliente, e.obra, Lo), B(null));
                                                },
                                                style: smallBtnPrimary,
                                              },
                                              "Guardar factura",
                                            ),
                                            React.createElement(
                                              "button",
                                              { onClick: () => B(null), style: smallBtnGhost },
                                              React.createElement(X, { size: 13 }),
                                            ),
                                          ),
                                        e.cliente === "WU" &&
                                          React.createElement(
                                            "datalist",
                                            { id: "ocs-sugeridas-" + t },
                                            Array.from(
                                              new Set(
                                                [
                                                  ...(ordenesCompraMap[t] || []).map((h) => (h.ordenCompra || "").trim()),
                                                  ...Object.keys(
                                                    adicionalesPorOC(
                                                      costoSubobrasMap[t],
                                                      (ordenesCompraMap[t] || []).map((h) => h.ordenCompra),
                                                    ),
                                                  ),
                                                ].filter(Boolean),
                                              ),
                                            ).map((h) => React.createElement("option", { key: h, value: h })),
                                          ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: { display: "flex", gap: 10, marginBottom: 10, alignItems: "center" },
                                          },
                                          React.createElement(
                                            "select",
                                            {
                                              style: selectStyle,
                                              value: Yo[t] || "TODAS",
                                              onChange: (h) => yo((N) => ({ ...N, [t]: h.target.value })),
                                            },
                                            React.createElement("option", { value: "TODAS" }, "Todos los estados"),
                                            React.createElement("option", { value: "PAGADA" }, "Pagada"),
                                            React.createElement("option", { value: "ADEUDA" }, "Adeuda"),
                                          ),
                                        ),
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
                                                gridTemplateColumns:
                                                  e.cliente === "WU"
                                                    ? "1.5fr 0.7fr 0.8fr 1fr 1fr 0.9fr 1.1fr 0.9fr 0.7fr 50px"
                                                    : "1.8fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.7fr 50px",
                                                columnGap: 10,
                                                padding: "10px 16px",
                                                fontSize: 11,
                                                fontWeight: 700,
                                                background: "#EFEDE7",
                                                borderBottom: "1px solid " + BORDER,
                                              },
                                            },
                                            React.createElement(SortHeader, {
                                              label: "CONCEPTO",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "concepto",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "TIPO",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "tipo",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "N°",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "nro",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            e.cliente === "WU" &&
                                              React.createElement(SortHeader, {
                                                label: "ORDEN DE COMPRA",
                                                tableId: "obraFacturas:" + t,
                                                sortKey: "ordenCompra",
                                                sortState: we,
                                                onSort: ue,
                                              }),
                                            React.createElement(SortHeader, {
                                              label: "EMISION",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "fecha",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "ESTADO",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "status",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "IMPORTE",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "importe",
                                              sortState: we,
                                              onSort: ue,
                                              align: "right",
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "PAGO",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "fechaPago",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement("div", { style: { textAlign: "center" } }, "PDF"),
                                            React.createElement("div", null),
                                          ),
                                          (() => {
                                            const h = Yo[t] || "TODAS",
                                              N = Ze.filter((De) => h === "TODAS" || De.status === h);
                                            return N.length === 0
                                              ? React.createElement(
                                                  "div",
                                                  { style: { padding: 18, fontSize: 12.5, color: MUTED } },
                                                  "Todavia no se cargaron facturas para esta obra.",
                                                )
                                              : So("obraFacturas:" + t, N).map((De) =>
                                                  React.createElement(FacturaRow, {
                                                    key: De.id,
                                                    f: De,
                                                    onSave: (Ce) => Kr(De.id, Ce),
                                                    onDelete: () => Zr(De.id),
                                                    onView: () =>
                                                      gt({
                                                        name: De.pdfName,
                                                        data: dataUrlToBlobUrl(De.pdfData),
                                                        rawData: De.pdfData,
                                                      }),
                                                    readOnly: !Rt,
                                                    mostrarOC: e.cliente === "WU",
                                                    ocListId: "ocs-sugeridas-" + t,
                                                  }),
                                                );
                                          })(),
                                        ),
                                      )
                                    : React.createElement(
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
                                        xe.length === 0
                                          ? React.createElement(
                                              "div",
                                              { style: { fontSize: 12.5, color: MUTED, marginBottom: 10 } },
                                              "Todavia no cargaste el detalle de costos de esta obra.",
                                            )
                                          : React.createElement(
                                              React.Fragment,
                                              null,
                                              (() => {
                                                const h = xe.reduce((N, De) => N + De.presupuesto, 0);
                                                return React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 24,
                                                      alignItems: "center",
                                                      marginBottom: 18,
                                                    },
                                                  },
                                                  React.createElement(
                                                    "div",
                                                    { style: { width: 260, height: 230, flexShrink: 0 } },
                                                    React.createElement(
                                                      ResponsiveContainer,
                                                      null,
                                                      React.createElement(
                                                        PieChart,
                                                        null,
                                                        React.createElement(
                                                          Pie,
                                                          {
                                                            data: xe.map((N) => ({
                                                              name: N.proveedor,
                                                              value: N.presupuesto,
                                                              pct: h ? (N.presupuesto / h) * 100 : 0,
                                                            })),
                                                            dataKey: "value",
                                                            nameKey: "name",
                                                            cx: "50%",
                                                            cy: "50%",
                                                            outerRadius: 78,
                                                          },
                                                          xe.map((N, De) =>
                                                            React.createElement(Cell, {
                                                              key: De,
                                                              fill: PIE_COLORS[De % PIE_COLORS.length],
                                                              opacity:
                                                                !b["proveedores:" + t] ||
                                                                b["proveedores:" + t] === N.proveedor
                                                                  ? 1
                                                                  : 0.3,
                                                            }),
                                                          ),
                                                        ),
                                                        React.createElement(Tooltip, {
                                                          formatter: (N, De, Ce) => [
                                                            fmt(N) + " (" + Ce.payload.pct.toFixed(1) + "%)",
                                                            De,
                                                          ],
                                                        }),
                                                      ),
                                                    ),
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    null,
                                                    React.createElement(
                                                      "div",
                                                      {
                                                        style: {
                                                          fontSize: 11,
                                                          fontWeight: 700,
                                                          color: MUTED,
                                                          marginBottom: 6,
                                                        },
                                                      },
                                                      "PARTICIPACIÓN POR PROVEEDOR (PRESUPUESTO REAL)",
                                                    ),
                                                    React.createElement(
                                                      "div",
                                                      {
                                                        style: {
                                                          display: "grid",
                                                          gridTemplateColumns: "1fr 1fr",
                                                          columnGap: 10,
                                                          gap: "3px 16px",
                                                          fontSize: 12,
                                                          maxHeight: 130,
                                                          overflowY: "auto",
                                                        },
                                                      },
                                                      xe.map((N, De) => {
                                                        const Ce = b["proveedores:" + t] === N.proveedor,
                                                          ie = h ? (N.presupuesto / h) * 100 : 0;
                                                        return React.createElement(
                                                          "div",
                                                          {
                                                            key: De,
                                                            onMouseEnter: () =>
                                                              R((Fe) => ({ ...Fe, ["proveedores:" + t]: N.proveedor })),
                                                            onMouseLeave: () =>
                                                              R((Fe) => ({ ...Fe, ["proveedores:" + t]: null })),
                                                            style: {
                                                              display: "flex",
                                                              alignItems: "center",
                                                              gap: 6,
                                                              cursor: "default",
                                                              padding: "2px 5px",
                                                              borderRadius: 5,
                                                              background: Ce ? "#F1E9D2" : "transparent",
                                                            },
                                                          },
                                                          React.createElement("span", {
                                                            style: {
                                                              width: 9,
                                                              height: 9,
                                                              borderRadius: 2,
                                                              background: PIE_COLORS[De % PIE_COLORS.length],
                                                              flexShrink: 0,
                                                            },
                                                          }),
                                                          React.createElement(
                                                            "span",
                                                            {
                                                              style: {
                                                                fontWeight: Ce ? 700 : 600,
                                                                color: Ce ? NAVY : TEXT,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                              },
                                                            },
                                                            N.proveedor,
                                                          ),
                                                          React.createElement(
                                                            "span",
                                                            {
                                                              style: {
                                                                color: MUTED,
                                                                marginLeft: "auto",
                                                                flexShrink: 0,
                                                              },
                                                            },
                                                            ie.toFixed(0),
                                                            "%",
                                                          ),
                                                        );
                                                      }),
                                                    ),
                                                  ),
                                                );
                                              })(),
                                              React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: T,
                                                    columnGap: 10,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    padding: "4px 8px",
                                                  },
                                                },
                                                React.createElement(SortHeader, {
                                                  label: "PROVEEDOR",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "proveedor",
                                                  sortState: we,
                                                  onSort: ue,
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "PRESUPUESTO ORIGINAL",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "presupuestoOriginal",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "PRESUPUESTO REAL",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "presupuesto",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "PAGADO",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "pagado",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "SALDO A PAGAR",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "resta",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                x &&
                                                  React.createElement(SortHeader, {
                                                    label: "$/M2",
                                                    tableId: "proveedores:" + t,
                                                    sortKey: "precioM2",
                                                    sortState: we,
                                                    onSort: ue,
                                                    align: "right",
                                                  }),
                                                React.createElement(SortHeader, {
                                                  label: "DESVÍO",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "desvioPct",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement("div", null),
                                              ),
                                              So("proveedores:" + t, xe).map((h, N) =>
                                                React.createElement(ProveedorRow, {
                                                  key: h.esVirtualMzLatam ? "mz-latam-virtual" : h._idx,
                                                  p: h,
                                                  index: N,
                                                  onSave: h.esVirtualMzLatam ? () => {} : (De) => yr(t, h._idx, De),
                                                  onDelete: h.esVirtualMzLatam ? () => xr(t) : () => Sr(t, h._idx),
                                                  readOnly: !Rt,
                                                  soloEliminar: h.esVirtualMzLatam,
                                                  m2: x ? D : null,
                                                }),
                                              ),
                                              React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: T.replace("50px", "28px"),
                                                    columnGap: 10,
                                                    fontSize: 12.5,
                                                    fontWeight: 700,
                                                    padding: "8px 8px",
                                                    background: "#F1E9D2",
                                                    borderRadius: 4,
                                                    marginTop: 4,
                                                  },
                                                },
                                                React.createElement("div", { style: { color: NAVY } }, "TOTAL"),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right", color: MUTED } },
                                                  fmt(xe.reduce((h, N) => h + N.presupuestoOriginal, 0)),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right" } },
                                                  fmt(xe.reduce((h, N) => h + N.presupuesto, 0)),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right", color: GREEN } },
                                                  fmt(xe.reduce((h, N) => h + N.pagado, 0)),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right", color: RED } },
                                                  fmt(xe.reduce((h, N) => h + N.resta, 0)),
                                                ),
                                                x &&
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    D > 0 ? fmt(xe.reduce((h, N) => h + N.presupuesto, 0) / D) : "—",
                                                  ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      textAlign: "right",
                                                      color: Ie > 0 ? RED : Ie < 0 ? GREEN : MUTED,
                                                    },
                                                  },
                                                  fmt(Ie),
                                                  " (",
                                                  Ge >= 0 ? "+" : "",
                                                  Ge.toFixed(1),
                                                  "%)",
                                                ),
                                                React.createElement("div", null),
                                              ),
                                            ),
                                        Rt &&
                                          e.cliente !== "WU" &&
                                          React.createElement(
                                            "div",
                                            { style: { display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" } },
                                            u
                                              ? React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 6,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                    },
                                                  },
                                                  React.createElement("input", {
                                                    placeholder: "Proveedor",
                                                    list: "proveedores-sugeridos",
                                                    style: inputStyle,
                                                    onChange: (h) =>
                                                      xo((N) => ({
                                                        ...N,
                                                        [t]: { ...N[t], proveedor: h.target.value },
                                                      })),
                                                  }),
                                                  React.createElement(
                                                    "datalist",
                                                    { id: "proveedores-sugeridos" },
                                                    proveedoresCatalogo.map((h) => React.createElement("option", { key: h, value: h })),
                                                  ),
                                                  React.createElement("input", {
                                                    placeholder: "Presupuesto original",
                                                    type: "number",
                                                    style: { ...inputStyle, width: 130 },
                                                    onChange: (h) =>
                                                      xo((N) => ({
                                                        ...N,
                                                        [t]: { ...N[t], presupuestoOriginal: h.target.value },
                                                      })),
                                                  }),
                                                  React.createElement("input", {
                                                    placeholder: "Presupuesto real",
                                                    type: "number",
                                                    style: { ...inputStyle, width: 120 },
                                                    onChange: (h) =>
                                                      xo((N) => ({
                                                        ...N,
                                                        [t]: { ...N[t], presupuesto: h.target.value },
                                                      })),
                                                  }),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => sa(t, u), style: smallBtnPrimary },
                                                    "Guardar",
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => xo((h) => ({ ...h, [t]: null })),
                                                      style: smallBtnGhost,
                                                    },
                                                    React.createElement(X, { size: 13 }),
                                                  ),
                                                )
                                              : React.createElement(
                                                  "button",
                                                  {
                                                    onClick: () => xo((h) => ({ ...h, [t]: { proveedor: "" } })),
                                                    style: smallBtnGhost,
                                                  },
                                                  React.createElement(Plus, { size: 13 }),
                                                  " Nuevo proveedor",
                                                ),
                                            xe.length > 0 &&
                                              (m
                                                ? React.createElement(
                                                    "div",
                                                    {
                                                      style: {
                                                        display: "flex",
                                                        gap: 6,
                                                        alignItems: "center",
                                                        flexWrap: "wrap",
                                                      },
                                                    },
                                                    React.createElement(ProveedorPicker, {
                                                      value: m.proveedor || "",
                                                      options: xe.map((h) => h.proveedor),
                                                      placeholder: "Proveedor...",
                                                      style: { width: 160 },
                                                      onChange: (h) =>
                                                        st((N) => ({ ...N, [t]: { ...N[t], proveedor: h } })),
                                                    }),
                                                    React.createElement("input", {
                                                      placeholder: "Monto",
                                                      type: "number",
                                                      style: { ...inputStyle, width: 100 },
                                                      onChange: (h) =>
                                                        st((N) => ({ ...N, [t]: { ...N[t], monto: h.target.value } })),
                                                    }),
                                                    React.createElement("input", {
                                                      placeholder: "Fecha (dd/mm/aaaa)",
                                                      style: { ...inputStyle, width: 130 },
                                                      onChange: (h) =>
                                                        st((N) => ({ ...N, [t]: { ...N[t], fecha: h.target.value } })),
                                                    }),
                                                    React.createElement("input", {
                                                      placeholder: "N° FC",
                                                      style: { ...inputStyle, width: 90 },
                                                      onChange: (h) =>
                                                        st((N) => ({ ...N, [t]: { ...N[t], fc: h.target.value } })),
                                                    }),
                                                    React.createElement("input", {
                                                      placeholder: "Observaciones",
                                                      style: { ...inputStyle, width: 160 },
                                                      onChange: (h) =>
                                                        st((N) => ({
                                                          ...N,
                                                          [t]: { ...N[t], observaciones: h.target.value },
                                                        })),
                                                    }),
                                                    React.createElement(
                                                      "button",
                                                      {
                                                        onClick: () => m.proveedor && br(t, m),
                                                        style: smallBtnPrimary,
                                                      },
                                                      "Registrar pago",
                                                    ),
                                                    React.createElement(
                                                      "button",
                                                      {
                                                        onClick: () => st((h) => ({ ...h, [t]: null })),
                                                        style: smallBtnGhost,
                                                      },
                                                      React.createElement(X, { size: 13 }),
                                                    ),
                                                  )
                                                : React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => st((h) => ({ ...h, [t]: { proveedor: "" } })),
                                                      style: smallBtnGhost,
                                                    },
                                                    React.createElement(Plus, { size: 13 }),
                                                    " Registrar pago semanal",
                                                  )),
                                            React.createElement(
                                              "label",
                                              { style: { ...smallBtnGhost, marginLeft: "auto" } },
                                              React.createElement(Upload, { size: 13 }),
                                              " Importar planilla de costos",
                                              React.createElement("input", {
                                                type: "file",
                                                accept: ".xlsx,.xls,.csv",
                                                style: { display: "none" },
                                                onChange: (h) => hi(t, h.target.files[0]),
                                              }),
                                            ),
                                            React.createElement(
                                              "button",
                                              {
                                                onClick: () => Ya("costos", t),
                                                style: { ...smallBtnGhost, color: MUTED },
                                              },
                                              "Plantilla de ejemplo",
                                            ),
                                            React.createElement(
                                              "label",
                                              { style: smallBtnGhost },
                                              React.createElement(Upload, { size: 13 }),
                                              " Importar planilla de pagos",
                                              React.createElement("input", {
                                                type: "file",
                                                accept: ".xlsx,.xls,.csv",
                                                style: { display: "none" },
                                                onChange: (h) => yi(t, h.target.files[0]),
                                              }),
                                            ),
                                            React.createElement(
                                              "button",
                                              {
                                                onClick: () => Ya("pagos", t),
                                                style: { ...smallBtnGhost, color: MUTED },
                                              },
                                              "Plantilla de ejemplo",
                                            ),
                                          ),
                                        a.length > 0 &&
                                          React.createElement(
                                            React.Fragment,
                                            null,
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                  alignItems: "center",
                                                  flexWrap: "wrap",
                                                  gap: 8,
                                                  margin: "16px 0 6px",
                                                },
                                              },
                                              React.createElement(
                                                "div",
                                                { style: { fontSize: 11.5, fontWeight: 700, color: MUTED } },
                                                "HISTORIAL DE PAGOS",
                                              ),
                                              React.createElement(
                                                "div",
                                                { style: { display: "flex", gap: 8, alignItems: "center" } },
                                                React.createElement("input", {
                                                  placeholder: "Buscar proveedor...",
                                                  value: Do[t] || "",
                                                  onChange: (h) => dn((N) => ({ ...N, [t]: h.target.value })),
                                                  style: { ...inputStyle, width: 160 },
                                                }),
                                                React.createElement(
                                                  "button",
                                                  {
                                                    onClick: () =>
                                                      Za(i, "pagos_" + t.replace(/[^a-z0-9]+/gi, "_") + ".xlsx"),
                                                    style: { ...smallBtnGhost, color: MUTED },
                                                  },
                                                  React.createElement(Download, { size: 13 }),
                                                  " Descargar",
                                                ),
                                              ),
                                            ),
                                            React.createElement(
                                              "div",
                                              { style: { maxHeight: 200, overflowY: "auto" } },
                                              React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px",
                                                    columnGap: 10,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    padding: "4px 8px",
                                                  },
                                                },
                                                React.createElement(SortHeader, {
                                                  label: "PROVEEDOR",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "proveedor",
                                                  sortState: we,
                                                  onSort: ue,
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "PAGO",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "monto",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "FECHA",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "fecha",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "N° FC",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "fc",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "OBSERVACIONES",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "observaciones",
                                                  sortState: we,
                                                  onSort: ue,
                                                }),
                                                React.createElement("div", null),
                                              ),
                                              i.length === 0
                                                ? React.createElement(
                                                    "div",
                                                    { style: { padding: "10px 8px", fontSize: 12, color: MUTED } },
                                                    "Ningún pago coincide con la búsqueda.",
                                                  )
                                                : So("pagos:" + t, i).map((h) =>
                                                    React.createElement(PagoRow, {
                                                      key: h._idx,
                                                      p: h,
                                                      onSave: (N) => Ar(t, h._idx, N),
                                                      onDelete: () => Cr(t, h._idx),
                                                      readOnly: !Rt,
                                                    }),
                                                  ),
                                            ),
                                          ),
                                      ),
                                  e.cliente === "WU" &&
                                    Kt === "costos" &&
                                    (() => {
                                      const h = costoSubobrasMap[t] || [],
                                        N = h.map((Ce, ie) => {
                                          const Fe = subCostoKey(t, Ce.id),
                                            qe = subCostoProveedoresMap[Fe] || [],
                                            Qe = subCostoPagosMap[Fe] || [],
                                            z = qe.map((he, Se) => {
                                              const je = Qe.filter((yt) => yt.proveedor === he.proveedor).reduce(
                                                  (yt, uo) => yt + uo.monto,
                                                  0,
                                                ),
                                                mt = presupuestoEfectivo(he.presupuesto, je),
                                                $e = (mt || 0) - (he.presupuestoOriginal || 0),
                                                tt = he.presupuestoOriginal ? ($e / he.presupuestoOriginal) * 100 : 0;
                                              return {
                                                ...he,
                                                presupuesto: mt,
                                                pagado: je,
                                                resta: mt - je,
                                                desvio: $e,
                                                desvioPct: tt,
                                                _idx: Se,
                                              };
                                            });
                                          return { sub: Ce, idx: ie, subK: Fe, subPagos: Qe, subProvsConDatos: z };
                                        }),
                                        De = N.reduce(
                                          (Ce, ie) => (
                                            ie.subProvsConDatos.forEach((Fe) => {
                                              ((Ce.presupuestoOriginal += Fe.presupuestoOriginal || 0),
                                                (Ce.presupuesto += Fe.presupuesto || 0),
                                                (Ce.pagado += Fe.pagado));
                                            }),
                                            Ce
                                          ),
                                          { presupuestoOriginal: 0, presupuesto: 0, pagado: 0 },
                                        );
                                      return (
                                        (De.resta = De.presupuesto - De.pagado),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              background: "#fff",
                                              borderRadius: 12,
                                              border: "1px solid " + BORDER,
                                              boxShadow: CARD_SHADOW,
                                              padding: "18px 20px",
                                              marginTop: 16,
                                            },
                                          },
                                          React.createElement(
                                            "datalist",
                                            { id: "proveedores-sugeridos-subcosto" },
                                            proveedoresCatalogo.map((Ce) => React.createElement("option", { key: Ce, value: Ce })),
                                          ),
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 10,
                                                marginBottom: 6,
                                                flexWrap: "wrap",
                                              },
                                            },
                                            React.createElement(
                                              "div",
                                              { style: { fontSize: 11, fontWeight: 700, color: MUTED } },
                                              "SUB OBRAS (COSTOS)",
                                            ),
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "flex",
                                                  gap: 8,
                                                  alignItems: "center",
                                                  flexWrap: "wrap",
                                                },
                                              },
                                              h.length > 0 &&
                                                React.createElement(
                                                  "button",
                                                  {
                                                    onClick: () => {
                                                      const Ce = N.map(({ sub: qe, subProvsConDatos: Qe }) => {
                                                          const z = Qe.reduce(
                                                              ($e, tt) => $e + (tt.presupuesto || 0),
                                                              0,
                                                            ),
                                                            he = Qe.reduce(($e, tt) => $e + tt.pagado, 0),
                                                            Se = (qe.adicionales || []).reduce(
                                                              ($e, tt) => $e + (tt.monto || 0),
                                                              0,
                                                            ),
                                                            je = (qe.venta || 0) + Se,
                                                            mt = je ? ((je - z) / je) * 100 : null;
                                                          return {
                                                            "Sub Obra": qe.nombre,
                                                            Estado:
                                                              qe.status === "FINALIZADA" ? "Finalizada" : "En proceso",
                                                            Venta: je,
                                                            Proveedores: Qe.length,
                                                            "Ppto. Real": z,
                                                            Pagado: he,
                                                            Saldo: z - he,
                                                            "Costo Real": z,
                                                            "Margen Bruto": mt === null ? "" : Math.round(mt * 10) / 10,
                                                            Markup: mt === null || markupDeMb(mt) == null ? "" : Math.round(markupDeMb(mt) * 10) / 10,
                                                          };
                                                        }),
                                                        ie = [];
                                                      N.forEach(({ sub: qe, subProvsConDatos: Qe }) => {
                                                        Qe.forEach((z) => {
                                                          ie.push({
                                                            "Sub Obra": qe.nombre,
                                                            Proveedor: z.proveedor,
                                                            "Costo Inicial": z.presupuestoOriginal || 0,
                                                            "Costo Real": z.presupuesto || 0,
                                                            Saldo: z.resta,
                                                          });
                                                        });
                                                      });
                                                      const Fe = XLSX.utils.book_new();
                                                      (XLSX.utils.book_append_sheet(
                                                        Fe,
                                                        XLSX.utils.json_to_sheet(Ce),
                                                        "Resumenes",
                                                      ),
                                                        XLSX.utils.book_append_sheet(
                                                          Fe,
                                                          XLSX.utils.json_to_sheet(ie),
                                                          "Proveedores",
                                                        ),
                                                        descargarLibroXlsx(
                                                          Fe,
                                                          "sub_obras_" + t.replace(/[^a-z0-9]+/gi, "_") + ".xlsx",
                                                        ));
                                                    },
                                                    style: { ...smallBtnGhost, color: MUTED },
                                                  },
                                                  React.createElement(Download, { size: 13 }),
                                                  " Descargar sub obras",
                                                ),
                                            ),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { fontSize: 11.5, color: MUTED, marginBottom: 14 } },
                                            "Agrupá proveedores en sub obras dentro de esta obra, independiente de las Órdenes de Compra. El Costo Real de la obra suma esto más los proveedores generales de Costos.",
                                          ),
                                          h.length > 0 &&
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "flex",
                                                  gap: 8,
                                                  alignItems: "center",
                                                  flexWrap: "wrap",
                                                  marginBottom: 14,
                                                },
                                              },
                                              React.createElement(
                                                "select",
                                                {
                                                  value: vn[t] || "TODOS",
                                                  onChange: (Ce) => Wn((ie) => ({ ...ie, [t]: Ce.target.value })),
                                                  style: selectStyle,
                                                },
                                                React.createElement("option", { value: "TODOS" }, "Todos los estados"),
                                                React.createElement("option", { value: "EN PROCESO" }, "En proceso"),
                                                React.createElement("option", { value: "FINALIZADA" }, "Finalizada"),
                                              ),
                                              React.createElement("input", {
                                                placeholder: "Buscar sub obra...",
                                                value: Fn[t] || "",
                                                onChange: (Ce) => Yn((ie) => ({ ...ie, [t]: Ce.target.value })),
                                                style: { ...inputStyle, width: 170 },
                                              }),
                                            ),
                                          h.length > 0 &&
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "grid",
                                                  gridTemplateColumns: "repeat(4, 1fr)",
                                                  columnGap: 10,
                                                  padding: "10px 14px",
                                                  background: "#F1E9D2",
                                                  borderRadius: 8,
                                                  marginBottom: 14,
                                                },
                                              },
                                              React.createElement(
                                                "div",
                                                null,
                                                React.createElement(
                                                  "div",
                                                  { style: labelStyle },
                                                  "PPTO. ORIGINAL (TODAS)",
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { fontSize: 15, fontWeight: 700, color: NAVY } },
                                                  fmt(De.presupuestoOriginal),
                                                ),
                                              ),
                                              React.createElement(
                                                "div",
                                                null,
                                                React.createElement("div", { style: labelStyle }, "PPTO. REAL (TODAS)"),
                                                React.createElement(
                                                  "div",
                                                  { style: { fontSize: 15, fontWeight: 700, color: NAVY } },
                                                  fmt(De.presupuesto),
                                                ),
                                              ),
                                              React.createElement(
                                                "div",
                                                null,
                                                React.createElement("div", { style: labelStyle }, "PAGADO (TODAS)"),
                                                React.createElement(
                                                  "div",
                                                  { style: { fontSize: 15, fontWeight: 700, color: GREEN } },
                                                  fmt(De.pagado),
                                                ),
                                              ),
                                              React.createElement(
                                                "div",
                                                null,
                                                React.createElement(
                                                  "div",
                                                  { style: labelStyle },
                                                  "SALDO A PAGAR (TODAS)",
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      fontSize: 15,
                                                      fontWeight: 700,
                                                      color: De.resta > 0 ? RED : MUTED,
                                                    },
                                                  },
                                                  fmt(De.resta),
                                                ),
                                              ),
                                            ),
                                          (() => {
                                            const Ce = normalizarTexto(Fn[t] || ""),
                                              ie = vn[t] || "TODOS",
                                              Fe = N.filter(
                                                ({ sub: qe }) => !Ce || normalizarTexto(qe.nombre).includes(Ce),
                                              ).filter(
                                                ({ sub: qe }) => ie === "TODOS" || (qe.status || "EN PROCESO") === ie,
                                              );
                                            return h.length === 0
                                              ? React.createElement(
                                                  "div",
                                                  { style: { fontSize: 12.5, color: MUTED, marginBottom: 8 } },
                                                  "Todavía no creaste sub obras de costo para esta obra.",
                                                )
                                              : Fe.length === 0
                                                ? React.createElement(
                                                    "div",
                                                    { style: { fontSize: 12.5, color: MUTED, marginBottom: 8 } },
                                                    "Ninguna sub obra coincide",
                                                    Ce ? ' con "' + Fn[t] + '"' : "",
                                                    ie !== "TODOS" ? " con el estado seleccionado" : "",
                                                    ".",
                                                  )
                                                : React.createElement(
                                                    "div",
                                                    {
                                                      style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 8,
                                                        marginBottom: 8,
                                                      },
                                                    },
                                                    Fe.map(
                                                      ({
                                                        sub: qe,
                                                        idx: Qe,
                                                        subK: z,
                                                        subPagos: he,
                                                        subProvsConDatos: Se,
                                                      }) => {
                                                        const je = !!pn[z],
                                                          mt = Jo[z],
                                                          $e = Vt[z],
                                                          tt = Se.reduce(($, ze) => $ + (ze.presupuesto || 0), 0),
                                                          yt = Se.reduce(($, ze) => $ + ze.pagado, 0),
                                                          uo = Se.reduce(($, ze) => $ + ze.resta, 0),
                                                          Xo = qe.adicionales || [],
                                                          He = Xo.reduce(($, ze) => $ + (ze.monto || 0), 0),
                                                          Je = (qe.venta || 0) + He,
                                                          bt = Je ? ((Je - tt) / Je) * 100 : 0,
                                                          Et = _e[z],
                                                          Po = (Do[z] || "").trim().toLowerCase(),
                                                          Co = he
                                                            .map(($, ze) => ({ ...$, _idx: ze }))
                                                            .filter(
                                                              ($) => !Po || $.proveedor.toLowerCase().includes(Po),
                                                            );
                                                        return React.createElement(
                                                          "div",
                                                          {
                                                            key: z,
                                                            style: {
                                                              border: "1px solid " + BORDER,
                                                              borderRadius: 8,
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
                                                                padding: "8px 12px",
                                                                background: "#FAFAF7",
                                                                gap: 8,
                                                              },
                                                            },
                                                            React.createElement(
                                                              "div",
                                                              {
                                                                style: {
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  gap: 8,
                                                                  minWidth: 0,
                                                                },
                                                              },
                                                              React.createElement(SubCostoNombre, {
                                                                nombre: qe.nombre,
                                                                onSave: ($) => kr(t, Qe, $),
                                                                readOnly: !Rt,
                                                              }),
                                                              React.createElement(StatusBadge, {
                                                                status: qe.status || "EN PROCESO",
                                                                onClick: Rt ? () => alternarEstadoSubObra(t, Qe) : void 0,
                                                              }),
                                                            ),
                                                            Rt &&
                                                              React.createElement(
                                                                "button",
                                                                {
                                                                  onClick: () => borrarSubObra(t, Qe),
                                                                  style: {
                                                                    border: "none",
                                                                    background: "none",
                                                                    cursor: "pointer",
                                                                    color: RED,
                                                                    flexShrink: 0,
                                                                  },
                                                                },
                                                                React.createElement(Trash2, { size: 13 }),
                                                              ),
                                                          ),
                                                          React.createElement(
                                                            "div",
                                                            {
                                                              style: {
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                padding: "6px 12px",
                                                                borderTop: "1px solid " + BORDER,
                                                                fontSize: 11.5,
                                                                flexWrap: "wrap",
                                                                gap: 6,
                                                                background: "#fff",
                                                              },
                                                            },
                                                            React.createElement(SubCostoVentaOC, {
                                                              venta: qe.venta,
                                                              ordenCompra: qe.ordenCompra,
                                                              onSave: ($) => editarVentaSubObra(t, Qe, $),
                                                              readOnly: !Rt,
                                                            }),
                                                            React.createElement(
                                                              "span",
                                                              { style: { color: MUTED } },
                                                              "Adicional: ",
                                                              React.createElement(
                                                                "b",
                                                                { style: { color: TEXT } },
                                                                fmt(He),
                                                              ),
                                                              " · ",
                                                              "Costo real: ",
                                                              React.createElement(
                                                                "b",
                                                                { style: { color: TEXT } },
                                                                fmt(tt),
                                                              ),
                                                              " · ",
                                                              "MB / Markup: ",
                                                              React.createElement(
                                                                "b",
                                                                { style: { color: bt < 0 ? RED : GREEN } },
                                                                pctMk(bt),
                                                              ),
                                                            ),
                                                          ),
                                                          React.createElement(
                                                            "div",
                                                            {
                                                              onClick: () => yn(($) => ({ ...$, [z]: !$[z] })),
                                                              style: {
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                padding: "7px 12px",
                                                                borderTop: "1px solid " + BORDER,
                                                                cursor: "pointer",
                                                                fontSize: 11.5,
                                                              },
                                                            },
                                                            React.createElement(
                                                              "span",
                                                              { style: { color: NAVY, fontWeight: 700 } },
                                                              React.createElement(
                                                                "span",
                                                                {
                                                                  style: {
                                                                    display: "inline-block",
                                                                    transform: je ? "rotate(90deg)" : "rotate(0deg)",
                                                                    transition: "transform 0.15s",
                                                                    marginRight: 6,
                                                                    fontSize: 10,
                                                                  },
                                                                },
                                                                "▶",
                                                              ),
                                                              "Proveedores",
                                                              Se.length > 0 ? " (" + Se.length + ")" : "",
                                                            ),
                                                            !je &&
                                                              React.createElement(
                                                                "span",
                                                                { style: { color: MUTED } },
                                                                "Ppto. real: ",
                                                                React.createElement(
                                                                  "b",
                                                                  { style: { color: TEXT } },
                                                                  fmt(tt),
                                                                ),
                                                                " · ",
                                                                "Pagado: ",
                                                                React.createElement(
                                                                  "b",
                                                                  { style: { color: GREEN } },
                                                                  fmt(yt),
                                                                ),
                                                                " · ",
                                                                "Saldo: ",
                                                                React.createElement(
                                                                  "b",
                                                                  { style: { color: uo > 0 ? RED : MUTED } },
                                                                  fmt(uo),
                                                                ),
                                                              ),
                                                          ),
                                                          je &&
                                                            React.createElement(
                                                              "div",
                                                              { style: { padding: "10px 12px 14px" } },
                                                              Se.length === 0
                                                                ? React.createElement(
                                                                    "div",
                                                                    {
                                                                      style: {
                                                                        fontSize: 12,
                                                                        color: MUTED,
                                                                        marginBottom: 8,
                                                                      },
                                                                    },
                                                                    "Todavía no cargaste proveedores para esta sub obra.",
                                                                  )
                                                                : React.createElement(
                                                                    React.Fragment,
                                                                    null,
                                                                    React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          display: "grid",
                                                                          gridTemplateColumns:
                                                                            "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px",
                                                                          columnGap: 8,
                                                                          fontSize: 10.5,
                                                                          fontWeight: 700,
                                                                          padding: "4px 6px",
                                                                        },
                                                                      },
                                                                      React.createElement(SortHeader, {
                                                                        label: "PROVEEDOR",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "proveedor",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "PPTO. ORIGINAL",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "presupuestoOriginal",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "PPTO. REAL",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "presupuesto",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "PAGADO",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "pagado",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "SALDO",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "resta",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "DESVÍO",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "desvioPct",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement("div", null),
                                                                    ),
                                                                    So("subCosto:" + z, Se).map(($) =>
                                                                      React.createElement(ProveedorRow, {
                                                                        key: $._idx,
                                                                        p: $,
                                                                        index: $._idx,
                                                                        onSave: (ze) => editarProveedorSubObra(z, $._idx, ze),
                                                                        onDelete: () => borrarProveedorSubObra(z, $._idx),
                                                                        readOnly: !Rt,
                                                                      }),
                                                                    ),
                                                                    React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          display: "grid",
                                                                          gridTemplateColumns:
                                                                            "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px",
                                                                          columnGap: 8,
                                                                          fontSize: 11.5,
                                                                          fontWeight: 700,
                                                                          padding: "6px 6px",
                                                                          background: "#F1E9D2",
                                                                          borderRadius: 4,
                                                                          marginTop: 4,
                                                                        },
                                                                      },
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { color: NAVY } },
                                                                        "TOTAL",
                                                                      ),
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { textAlign: "right", color: MUTED } },
                                                                        fmt(
                                                                          Se.reduce(
                                                                            ($, ze) =>
                                                                              $ + (ze.presupuestoOriginal || 0),
                                                                            0,
                                                                          ),
                                                                        ),
                                                                      ),
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { textAlign: "right" } },
                                                                        fmt(tt),
                                                                      ),
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { textAlign: "right", color: GREEN } },
                                                                        fmt(yt),
                                                                      ),
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { textAlign: "right", color: RED } },
                                                                        fmt(uo),
                                                                      ),
                                                                      React.createElement("div", null),
                                                                      React.createElement("div", null),
                                                                    ),
                                                                  ),
                                                              React.createElement(
                                                                "div",
                                                                {
                                                                  style: {
                                                                    marginTop: 14,
                                                                    borderTop: "1px solid " + BORDER,
                                                                    paddingTop: 10,
                                                                  },
                                                                },
                                                                React.createElement(
                                                                  "div",
                                                                  {
                                                                    style: {
                                                                      fontSize: 10.5,
                                                                      fontWeight: 700,
                                                                      color: MUTED,
                                                                      marginBottom: 6,
                                                                    },
                                                                  },
                                                                  "ADICIONALES DE LA SUB OBRA",
                                                                ),
                                                                Xo.length === 0
                                                                  ? React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          fontSize: 12,
                                                                          color: MUTED,
                                                                          marginBottom: 6,
                                                                        },
                                                                      },
                                                                      "Todavía no cargaste adicionales para esta sub obra.",
                                                                    )
                                                                  : React.createElement(
                                                                      React.Fragment,
                                                                      null,
                                                                      React.createElement(
                                                                        "div",
                                                                        {
                                                                          style: {
                                                                            display: "grid",
                                                                            gridTemplateColumns: "2fr 1fr 50px",
                                                                            columnGap: 10,
                                                                            fontSize: 10.5,
                                                                            fontWeight: 700,
                                                                            color: MUTED,
                                                                            padding: "4px 6px",
                                                                          },
                                                                        },
                                                                        React.createElement("div", null, "CONCEPTO"),
                                                                        React.createElement(
                                                                          "div",
                                                                          { style: { textAlign: "right" } },
                                                                          "MONTO",
                                                                        ),
                                                                        React.createElement("div", null),
                                                                      ),
                                                                      Xo.map(($, ze) =>
                                                                        React.createElement(AdicionalRow, {
                                                                          key: ze,
                                                                          a: $,
                                                                          onSave: (pa) => editarAdicionalSubObra(t, Qe, ze, pa),
                                                                          onDelete: () => borrarAdicionalSubObra(t, Qe, ze),
                                                                          readOnly: !Rt,
                                                                        }),
                                                                      ),
                                                                    ),
                                                                Rt &&
                                                                  (Et
                                                                    ? React.createElement(
                                                                        "div",
                                                                        {
                                                                          style: {
                                                                            display: "flex",
                                                                            gap: 6,
                                                                            alignItems: "center",
                                                                            flexWrap: "wrap",
                                                                            marginTop: 6,
                                                                          },
                                                                        },
                                                                        React.createElement("input", {
                                                                          placeholder: "Concepto",
                                                                          style: inputStyle,
                                                                          onChange: ($) =>
                                                                            xt((ze) => ({
                                                                              ...ze,
                                                                              [z]: {
                                                                                ...ze[z],
                                                                                concepto: $.target.value,
                                                                              },
                                                                            })),
                                                                        }),
                                                                        React.createElement("input", {
                                                                          placeholder: "Monto",
                                                                          type: "number",
                                                                          style: { ...inputStyle, width: 130 },
                                                                          onChange: ($) =>
                                                                            xt((ze) => ({
                                                                              ...ze,
                                                                              [z]: { ...ze[z], monto: $.target.value },
                                                                            })),
                                                                        }),
                                                                        React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () => agregarAdicionalSubObra(t, Qe, Et),
                                                                            style: smallBtnPrimary,
                                                                          },
                                                                          "Guardar",
                                                                        ),
                                                                        React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () =>
                                                                              xt(($) => ({ ...$, [z]: null })),
                                                                            style: smallBtnGhost,
                                                                          },
                                                                          React.createElement(X, { size: 13 }),
                                                                        ),
                                                                      )
                                                                    : React.createElement(
                                                                        "button",
                                                                        {
                                                                          onClick: () =>
                                                                            xt(($) => ({
                                                                              ...$,
                                                                              [z]: { concepto: "" },
                                                                            })),
                                                                          style: { ...smallBtnGhost, marginTop: 6 },
                                                                        },
                                                                        React.createElement(Plus, { size: 13 }),
                                                                        " Agregar adicional",
                                                                      )),
                                                              ),
                                                              Rt &&
                                                                React.createElement(
                                                                  "div",
                                                                  {
                                                                    style: {
                                                                      display: "flex",
                                                                      gap: 6,
                                                                      marginTop: 10,
                                                                      flexWrap: "wrap",
                                                                    },
                                                                  },
                                                                  mt
                                                                    ? React.createElement(
                                                                        "div",
                                                                        {
                                                                          style: {
                                                                            display: "flex",
                                                                            gap: 6,
                                                                            alignItems: "center",
                                                                            flexWrap: "wrap",
                                                                          },
                                                                        },
                                                                        React.createElement("input", {
                                                                          placeholder: "Proveedor",
                                                                          list: "proveedores-sugeridos-subcosto",
                                                                          style: inputStyle,
                                                                          onChange: ($) =>
                                                                            xo((ze) => ({
                                                                              ...ze,
                                                                              [z]: {
                                                                                ...ze[z],
                                                                                proveedor: $.target.value,
                                                                              },
                                                                            })),
                                                                        }),
                                                                        React.createElement("input", {
                                                                          placeholder: "Presupuesto original",
                                                                          type: "number",
                                                                          style: { ...inputStyle, width: 130 },
                                                                          onChange: ($) =>
                                                                            xo((ze) => ({
                                                                              ...ze,
                                                                              [z]: {
                                                                                ...ze[z],
                                                                                presupuestoOriginal: $.target.value,
                                                                              },
                                                                            })),
                                                                        }),
                                                                        React.createElement("input", {
                                                                          placeholder: "Presupuesto real",
                                                                          type: "number",
                                                                          style: { ...inputStyle, width: 120 },
                                                                          onChange: ($) =>
                                                                            xo((ze) => ({
                                                                              ...ze,
                                                                              [z]: {
                                                                                ...ze[z],
                                                                                presupuesto: $.target.value,
                                                                              },
                                                                            })),
                                                                        }),
                                                                        React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () => agregarProveedorSubObra(z, mt),
                                                                            style: smallBtnPrimary,
                                                                          },
                                                                          "Guardar",
                                                                        ),
                                                                        React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () =>
                                                                              xo(($) => ({ ...$, [z]: null })),
                                                                            style: smallBtnGhost,
                                                                          },
                                                                          React.createElement(X, { size: 13 }),
                                                                        ),
                                                                      )
                                                                    : React.createElement(
                                                                        "button",
                                                                        {
                                                                          onClick: () =>
                                                                            xo(($) => ({
                                                                              ...$,
                                                                              [z]: { proveedor: "" },
                                                                            })),
                                                                          style: smallBtnGhost,
                                                                        },
                                                                        React.createElement(Plus, { size: 13 }),
                                                                        " Nuevo proveedor",
                                                                      ),
                                                                  Se.length > 0 &&
                                                                    ($e
                                                                      ? React.createElement(
                                                                          "div",
                                                                          {
                                                                            style: {
                                                                              display: "flex",
                                                                              gap: 6,
                                                                              alignItems: "center",
                                                                              flexWrap: "wrap",
                                                                            },
                                                                          },
                                                                          React.createElement(ProveedorPicker, {
                                                                            value: $e.proveedor || "",
                                                                            options: Se.map(($) => $.proveedor),
                                                                            placeholder: "Proveedor...",
                                                                            style: { width: 160 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: { ...ze[z], proveedor: $ },
                                                                              })),
                                                                          }),
                                                                          React.createElement("input", {
                                                                            placeholder: "Monto",
                                                                            type: "number",
                                                                            style: { ...inputStyle, width: 100 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: {
                                                                                  ...ze[z],
                                                                                  monto: $.target.value,
                                                                                },
                                                                              })),
                                                                          }),
                                                                          React.createElement("input", {
                                                                            placeholder: "Fecha (dd/mm/aaaa)",
                                                                            style: { ...inputStyle, width: 130 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: {
                                                                                  ...ze[z],
                                                                                  fecha: $.target.value,
                                                                                },
                                                                              })),
                                                                          }),
                                                                          React.createElement("input", {
                                                                            placeholder: "N° FC",
                                                                            style: { ...inputStyle, width: 90 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: { ...ze[z], fc: $.target.value },
                                                                              })),
                                                                          }),
                                                                          React.createElement("input", {
                                                                            placeholder: "Observaciones",
                                                                            style: { ...inputStyle, width: 150 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: {
                                                                                  ...ze[z],
                                                                                  observaciones: $.target.value,
                                                                                },
                                                                              })),
                                                                          }),
                                                                          React.createElement(
                                                                            "button",
                                                                            {
                                                                              onClick: () => $e.proveedor && agregarPagoSubObra(z, $e),
                                                                              style: smallBtnPrimary,
                                                                            },
                                                                            "Registrar pago",
                                                                          ),
                                                                          React.createElement(
                                                                            "button",
                                                                            {
                                                                              onClick: () =>
                                                                                st(($) => ({ ...$, [z]: null })),
                                                                              style: smallBtnGhost,
                                                                            },
                                                                            React.createElement(X, { size: 13 }),
                                                                          ),
                                                                        )
                                                                      : React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () =>
                                                                              st(($) => ({
                                                                                ...$,
                                                                                [z]: { proveedor: "" },
                                                                              })),
                                                                            style: smallBtnGhost,
                                                                          },
                                                                          React.createElement(Plus, { size: 13 }),
                                                                          " Registrar pago",
                                                                        )),
                                                                  React.createElement(
                                                                    "label",
                                                                    { style: { ...smallBtnGhost, marginLeft: "auto" } },
                                                                    React.createElement(Upload, { size: 13 }),
                                                                    " Importar planilla de costos",
                                                                    React.createElement("input", {
                                                                      type: "file",
                                                                      accept: ".xlsx,.xls,.csv",
                                                                      style: { display: "none" },
                                                                      onChange: ($) => Si(z, $.target.files[0]),
                                                                    }),
                                                                  ),
                                                                  React.createElement(
                                                                    "button",
                                                                    {
                                                                      onClick: () => Ka("costos", z),
                                                                      style: { ...smallBtnGhost, color: MUTED },
                                                                    },
                                                                    "Plantilla de ejemplo",
                                                                  ),
                                                                  React.createElement(
                                                                    "label",
                                                                    { style: smallBtnGhost },
                                                                    React.createElement(Upload, { size: 13 }),
                                                                    " Importar planilla de pagos",
                                                                    React.createElement("input", {
                                                                      type: "file",
                                                                      accept: ".xlsx,.xls,.csv",
                                                                      style: { display: "none" },
                                                                      onChange: ($) => xi(z, $.target.files[0]),
                                                                    }),
                                                                  ),
                                                                  React.createElement(
                                                                    "button",
                                                                    {
                                                                      onClick: () => Ka("pagos", z),
                                                                      style: { ...smallBtnGhost, color: MUTED },
                                                                    },
                                                                    "Plantilla de ejemplo",
                                                                  ),
                                                                ),
                                                              he.length > 0 &&
                                                                React.createElement(
                                                                  React.Fragment,
                                                                  null,
                                                                  React.createElement(
                                                                    "div",
                                                                    {
                                                                      style: {
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "center",
                                                                        flexWrap: "wrap",
                                                                        gap: 6,
                                                                        margin: "12px 0 4px",
                                                                      },
                                                                    },
                                                                    React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          fontSize: 10.5,
                                                                          fontWeight: 700,
                                                                          color: MUTED,
                                                                        },
                                                                      },
                                                                      "HISTORIAL DE PAGOS",
                                                                    ),
                                                                    React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          display: "flex",
                                                                          gap: 6,
                                                                          alignItems: "center",
                                                                        },
                                                                      },
                                                                      React.createElement("input", {
                                                                        placeholder: "Buscar proveedor...",
                                                                        value: Do[z] || "",
                                                                        onChange: ($) =>
                                                                          dn((ze) => ({ ...ze, [z]: $.target.value })),
                                                                        style: {
                                                                          ...inputStyle,
                                                                          width: 140,
                                                                          fontSize: 11.5,
                                                                        },
                                                                      }),
                                                                      React.createElement(
                                                                        "button",
                                                                        {
                                                                          onClick: () =>
                                                                            Za(
                                                                              Co,
                                                                              "pagos_" +
                                                                                z.replace(/[^a-z0-9]+/gi, "_") +
                                                                                ".xlsx",
                                                                            ),
                                                                          style: {
                                                                            ...smallBtnGhost,
                                                                            color: MUTED,
                                                                            fontSize: 11,
                                                                          },
                                                                        },
                                                                        React.createElement(Download, { size: 12 }),
                                                                        " Descargar",
                                                                      ),
                                                                    ),
                                                                  ),
                                                                  React.createElement(
                                                                    "div",
                                                                    {
                                                                      style: {
                                                                        display: "grid",
                                                                        gridTemplateColumns:
                                                                          "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px",
                                                                        columnGap: 8,
                                                                        fontSize: 10.5,
                                                                        fontWeight: 700,
                                                                        padding: "4px 6px",
                                                                      },
                                                                    },
                                                                    React.createElement(SortHeader, {
                                                                      label: "PROVEEDOR",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "proveedor",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                    }),
                                                                    React.createElement(SortHeader, {
                                                                      label: "PAGO",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "monto",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                      align: "right",
                                                                    }),
                                                                    React.createElement(SortHeader, {
                                                                      label: "FECHA",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "fecha",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                      align: "right",
                                                                    }),
                                                                    React.createElement(SortHeader, {
                                                                      label: "N° FC",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "fc",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                      align: "right",
                                                                    }),
                                                                    React.createElement(SortHeader, {
                                                                      label: "OBSERVACIONES",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "observaciones",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                    }),
                                                                    React.createElement("div", null),
                                                                  ),
                                                                  Co.length === 0
                                                                    ? React.createElement(
                                                                        "div",
                                                                        {
                                                                          style: {
                                                                            padding: "8px 6px",
                                                                            fontSize: 11.5,
                                                                            color: MUTED,
                                                                          },
                                                                        },
                                                                        "Ningún pago coincide con la búsqueda.",
                                                                      )
                                                                    : So("subCostoPagos:" + z, Co).map(($) =>
                                                                        React.createElement(PagoRow, {
                                                                          key: $._idx,
                                                                          p: $,
                                                                          onSave: (ze) => editarPagoSubObra(z, $._idx, ze),
                                                                          onDelete: () => borrarPagoSubObra(z, $._idx),
                                                                          readOnly: !Rt,
                                                                        }),
                                                                      ),
                                                                ),
                                                            ),
                                                        );
                                                      },
                                                    ),
                                                  );
                                          })(),
                                          Rt &&
                                            (Ho !== null
                                              ? React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 6,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                      marginTop: 8,
                                                    },
                                                  },
                                                  React.createElement("input", {
                                                    placeholder: "Nombre de la sub obra",
                                                    style: inputStyle,
                                                    onChange: (Ce) => nn(Ce.target.value),
                                                  }),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => Wa(t, Ho), style: smallBtnPrimary },
                                                    "Guardar",
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => nn(null), style: smallBtnGhost },
                                                    React.createElement(X, { size: 13 }),
                                                  ),
                                                )
                                              : React.createElement(
                                                  "button",
                                                  { onClick: () => nn(""), style: smallBtnGhost },
                                                  React.createElement(Plus, { size: 13 }),
                                                  " Agregar sub obra",
                                                )),
                                        )
                                      );
                                    })(),
                                );
                              })()
                            : React.createElement(
                                React.Fragment,
                                null,
                                React.createElement(
                                  "button",
                                  { onClick: () => be(null), style: { ...smallBtnGhost, marginBottom: 14 } },
                                  React.createElement(ArrowLeft, { size: 14 }),
                                  " Volver a clientes",
                                ),
                                (() => {
                                  const e = (Tn[se] || []).filter((o) =>
                                      Ro.includes(o.anio || /* @__PURE__ */ new Date().getFullYear()),
                                    ),
                                    t = e.reduce((o, a) => o + a.ventaFinal, 0);
                                  return React.createElement(
                                    React.Fragment,
                                    null,
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          background: "#fff",
                                          borderRadius: 12,
                                          border: "1px solid " + BORDER,
                                          boxShadow: CARD_SHADOW,
                                          padding: "18px 20px",
                                          marginBottom: 16,
                                          display: "flex",
                                          gap: 24,
                                          alignItems: "center",
                                        },
                                      },
                                      React.createElement(
                                        "div",
                                        { style: { width: 260, height: 230, flexShrink: 0 } },
                                        React.createElement(
                                          ResponsiveContainer,
                                          null,
                                          React.createElement(
                                            PieChart,
                                            null,
                                            React.createElement(
                                              Pie,
                                              {
                                                data: e.map((o) => ({ name: o.obra, value: o.ventaFinal })),
                                                dataKey: "value",
                                                nameKey: "name",
                                                cx: "50%",
                                                cy: "50%",
                                                outerRadius: 85,
                                              },
                                              e.map((o, a) =>
                                                React.createElement(Cell, {
                                                  key: a,
                                                  fill: PIE_COLORS[a % PIE_COLORS.length],
                                                  opacity:
                                                    !b["centroCosto:" + se] || b["centroCosto:" + se] === o.obra
                                                      ? 1
                                                      : 0.3,
                                                }),
                                              ),
                                            ),
                                            React.createElement(Tooltip, { formatter: (o) => fmt(o) }),
                                          ),
                                        ),
                                      ),
                                      React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              fontFamily: "Georgia, serif",
                                              fontSize: 20,
                                              fontWeight: 700,
                                              color: NAVY,
                                              marginBottom: 8,
                                            },
                                          },
                                          se,
                                        ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              display: "grid",
                                              gridTemplateColumns: "1fr 1fr",
                                              columnGap: 10,
                                              gap: "4px 18px",
                                              fontSize: 12.5,
                                            },
                                          },
                                          e.map((o, a) => {
                                            const r = b["centroCosto:" + se] === o.obra;
                                            return React.createElement(
                                              "div",
                                              {
                                                key: a,
                                                onMouseEnter: () => R((i) => ({ ...i, ["centroCosto:" + se]: o.obra })),
                                                onMouseLeave: () => R((i) => ({ ...i, ["centroCosto:" + se]: null })),
                                                style: {
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 7,
                                                  cursor: "default",
                                                  padding: "3px 6px",
                                                  borderRadius: 6,
                                                  background: r ? "#F1E9D2" : "transparent",
                                                },
                                              },
                                              React.createElement("span", {
                                                style: {
                                                  width: 10,
                                                  height: 10,
                                                  borderRadius: 3,
                                                  background: PIE_COLORS[a % PIE_COLORS.length],
                                                  flexShrink: 0,
                                                },
                                              }),
                                              React.createElement(
                                                "span",
                                                { style: { fontWeight: r ? 700 : 600, color: r ? NAVY : TEXT } },
                                                o.obra,
                                              ),
                                              React.createElement(
                                                "span",
                                                { style: { color: MUTED } },
                                                ((o.ventaFinal / t) * 100).toFixed(0),
                                                "%",
                                              ),
                                            );
                                          }),
                                        ),
                                      ),
                                    ),
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
                                            gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 1fr 0.8fr 0.8fr 32px",
                                            columnGap: 10,
                                            padding: "11px 18px",
                                            fontSize: 11.5,
                                            fontWeight: 700,
                                            background: "#EFEDE7",
                                            borderBottom: "1px solid " + BORDER,
                                            letterSpacing: 0.3,
                                          },
                                        },
                                        React.createElement(SortHeader, {
                                          label: "CENTRO DE COSTO",
                                          tableId: "obraList",
                                          sortKey: "obra",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "ESTADO",
                                          tableId: "obraList",
                                          sortKey: "status",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "VENTA",
                                          tableId: "obraList",
                                          sortKey: "ventaFinal",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "COSTO",
                                          tableId: "obraList",
                                          sortKey: "costoFinal",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "SALDO A PAGAR",
                                          tableId: "obraList",
                                          sortKey: "saldoProveedores",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "PRECIO X M2",
                                          tableId: "obraList",
                                          sortKey: "precioM2",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "MB INICIAL / MARKUP",
                                          tableId: "obraList",
                                          sortKey: "mbInicial",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "MB FINAL / MARKUP",
                                          tableId: "obraList",
                                          sortKey: "mbFinal",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement("div", null),
                                      ),
                                      So("obraList", e.map((o) => { const m = Ln(o); return { ...o, precioM2: m > 0 ? o.ventaFinal / m : null }; })).map((o) => {
                                        const a = obraKey(o.cliente, o.obra);
                                        return React.createElement(
                                          "div",
                                          {
                                            key: a,
                                            onClick: () => {
                                              (no(a), ae("facturas"), ot(false), $t(null), vo(false), ao(null));
                                            },
                                            style: {
                                              display: "grid",
                                              gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 1fr 0.8fr 0.8fr 32px",
                                              columnGap: 10,
                                              padding: "10px 18px",
                                              fontSize: 13,
                                              alignItems: "center",
                                              cursor: "pointer",
                                              borderBottom: "1px solid " + BORDER,
                                            },
                                          },
                                          React.createElement("div", { style: { fontWeight: 500 } }, o.obra),
                                          React.createElement(
                                            "div",
                                            null,
                                            React.createElement(StatusBadge, {
                                              status: o.status,
                                              onClick: Rt
                                                ? (r) => {
                                                    (r.stopPropagation(), Ha(o));
                                                  }
                                                : void 0,
                                            }),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                            fmtSmart(o.ventaFinal, o.ventaFinalUSD),
                                          ),
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                textAlign: "right",
                                                fontVariantNumeric: "tabular-nums",
                                                color: MUTED,
                                              },
                                            },
                                            fmtSmart(o.costoFinal, o.costoFinalUSD),
                                          ),
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                textAlign: "right",
                                                fontVariantNumeric: "tabular-nums",
                                                color: o.saldoProveedores > 0 ? RED : MUTED,
                                              },
                                            },
                                            fmtSmart(o.saldoProveedores, o.saldoProveedoresUSD),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED } },
                                            o.precioM2 != null ? fmt(o.precioM2) : "—",
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { textAlign: "right" } },
                                            React.createElement(MBValue, { v: valSmart(o.mbInicial, o.mbInicialUSD) }),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { textAlign: "right" } },
                                            React.createElement(MBValue, { v: valSmart(o.mbFinal, o.mbFinalUSD) }),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { display: "flex", justifyContent: "center", color: MUTED } },
                                            React.createElement(ChevronRight, { size: 16 }),
                                          ),
                                        );
                                      }),
                                      React.createElement(
                                        "div",
                                        {
                                          style: {
                                            display: "grid",
                                            gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 1fr 0.8fr 0.8fr 32px",
                                            columnGap: 10,
                                            padding: "10px 18px",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            background: "#F1E9D2",
                                          },
                                        },
                                        React.createElement("div", { style: { color: NAVY } }, "TOTAL"),
                                        React.createElement("div", null),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                          fmt(t),
                                        ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              textAlign: "right",
                                              fontVariantNumeric: "tabular-nums",
                                              color: MUTED,
                                            },
                                          },
                                          fmt(e.reduce((o, a) => o + a.costoFinal, 0)),
                                        ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              textAlign: "right",
                                              fontVariantNumeric: "tabular-nums",
                                              color: RED,
                                            },
                                          },
                                          fmt(e.reduce((o, a) => o + (a.saldoProveedores || 0), 0)),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED } },
                                          (() => {
                                            const m = e.reduce((o, a) => o + Ln(a), 0);
                                            return m > 0 ? fmt(t / m) : "—";
                                          })(),
                                        ),
                                        React.createElement("div", null),
                                        React.createElement("div", null),
                                        React.createElement("div", null),
                                      ),
                                    ),
                                  );
                                })(),
                              ),
                        verRegaliasPresentacion &&
                          React.createElement(
                            React.Fragment,
                            null,
                            React.createElement(PresentacionSlides, { data: ia, refs: Tt }),
                            React.createElement(
                              "div",
                              { style: { display: "flex", justifyContent: "flex-end", marginTop: 24 } },
                              React.createElement(
                                "button",
                                {
                                  onClick: ur,
                                  disabled: Ut,
                                  style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    background: NAVY,
                                    color: "#fff",
                                    border: "1px solid " + GOLD,
                                    padding: "12px 20px",
                                    borderRadius: 30,
                                    fontWeight: 700,
                                    fontSize: 13,
                                    cursor: Ut ? "default" : "pointer",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    opacity: Ut ? 0.7 : 1,
                                  },
                                },
                                React.createElement(Download, { size: 15 }),
                                " ",
                                Ut ? "Generando presentación..." : "Hacer presentación",
                              ),
                            ),
                          ),
                      ),
      );
}
