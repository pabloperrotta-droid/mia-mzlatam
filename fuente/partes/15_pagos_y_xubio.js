function calcularRetencionGananciasProveedor(n) {
  const d = n.filter((A) => A.facturaA),
    c = d.filter((A) => A.mat && !A.mo).reduce((A, k) => A + (Number(k.importeBruto) || 0), 0),
    p = d.filter((A) => A.mo && !A.mat).reduce((A, k) => A + (Number(k.importeBruto) || 0), 0),
    g = c > 224e3 ? (c - 224e3) * 0.02 : 0,
    C = p > 67170 ? (p - 67170) * 0.02 : 0,
    S = g + C,
    f = d.reduce((A, k) => A + (Number(k.echeq) || 0), 0),
    F = d.reduce((A, k) => A + (Number(k.transferencia) || 0), 0);
  return f > 0
    ? { retGanTransf: 0, retGanChe: S }
    : F > 0
      ? { retGanTransf: S, retGanChe: 0 }
      : { retGanTransf: 0, retGanChe: 0 };
}
const XUBIO_ST = { estados: {}, centros: [], ops: {}, opCfg: {}, echeqsCargados: new Set(), subs: new Set(), iniciado: false };
function xubioDb() {
  try {
    return typeof firebase < "u" && firebase.apps && firebase.apps.length ? scopedDb(firebase.firestore()) : null;
  } catch {
    return null;
  }
}
function xubioAvisar() {
  XUBIO_ST.subs.forEach((f) => f());
}
function xubioIniciar() {
  if (XUBIO_ST.iniciado) return;
  const db = xubioDb();
  if (!db) {
    setTimeout(xubioIniciar, 2000);
    return;
  }
  XUBIO_ST.iniciado = true;
  db.collection("xubioEstado").onSnapshot(
    (s) => {
      const m = {};
      s.docs.forEach((d) => (m[d.id] = d.data()));
      XUBIO_ST.estados = m;
      xubioAvisar();
    },
    () => {},
  );
  db.collection("xubioOP").onSnapshot(
    (s) => {
      const m = {};
      s.docs.forEach((d) => (m[d.id] = d.data()));
      XUBIO_ST.ops = m;
      xubioAvisar();
    },
    () => {},
  );
  db.doc("xubioConfig/op").onSnapshot(
    (s) => {
      XUBIO_ST.opCfg = (s.exists && s.data()) || {};
      xubioAvisar();
    },
    () => {},
  );
  db.collection("echeqs").onSnapshot(
    (s) => {
      XUBIO_ST.echeqsCargados = new Set(s.docs.map((d) => d.id));
      xubioAvisar();
    },
    () => {},
  );
  db.doc("xubioConfig/centros").onSnapshot(
    (s) => {
      XUBIO_ST.centros = (s.exists && s.data().nombres) || [];
      xubioAvisar();
    },
    () => {},
  );
}
function useXubio() {
  const [, f] = React.useState(0);
  React.useEffect(() => {
    xubioIniciar();
    const g = () => f((x) => x + 1);
    return XUBIO_ST.subs.add(g), () => XUBIO_ST.subs.delete(g);
  }, []);
  return XUBIO_ST;
}
// Debe ser idéntica a firma() en xubio/procesar.js: si cambia algo de esto, la línea se vuelve a mandar a Xubio.
function xubioFirma(l) {
  const t = (s) => String(s || "").trim();
  return [
    String(l.cuit || "").replace(/\D/g, ""),
    t(l.factura),
    t(l.cliente).toUpperCase(),
    t(l.centroCosto).toUpperCase(),
    t(l.subObra).toUpperCase(),
    t(l.centroCostoXubio),
    String(Number(l.importe) || 0),
  ].join("|");
}
const XUBIO_TEXTOS = {
  ok: "Centro de costo puesto en Xubio",
  ya_estaba: "En Xubio ya tenía el centro de costo",
  otro_centro: "En Xubio tiene otro centro de costo",
  centro_no_encontrado: "El centro de costo no existe en Xubio",
  factura_no_encontrada: "La factura no está en Xubio (se reintenta sola)",
  proveedor_no_encontrado: "El proveedor (CUIT) no está en Xubio (se reintenta solo)",
  varias_facturas: "Hay varias facturas iguales en Xubio",
  sin_renglones: "La factura en Xubio no tiene renglones",
  no_verificado: "Revisar la factura en Xubio",
  error: "No se pudo conectar con Xubio (se reintenta sola)",
  bloqueada: "Orden de pago aplicada",
  simulacion: "Prueba QA: en Producción se pondría este centro (QA no cambia Xubio)",
  importe_no_coincide: "Importe no coincide",
  rechazada: "Xubio rechazó el cambio: poner el centro a mano en Xubio",
  repartida: "Factura repartida en varias líneas con distintos centros",
};
const XUBIO_LENTOS = ["rechazada", "bloqueada", "repartida", "centro_no_encontrado", "varias_facturas", "importe_no_coincide"];
function xubioCuando(t) {
  return t
    ? new Date(t).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    : "";
}
function XubioEstadoCelda({ linea: l, puedeEditar, onElegirCentro }) {
  const st = useXubio(),
    [abierto, setAbierto] = React.useState(false),
    e = st.estados[l.id],
    falta = !String(l.cuit || "").replace(/\D/g, "")
      ? "Falta el CUIT"
      : !String(l.factura || "").trim()
        ? "Falta el número de factura"
        : "",
    yaBien = !!e && (e.estado === "ok" || e.estado === "ya_estaba"),
    vigente = !!e && (yaBien || e.firma === xubioFirma(l)),
    bien = vigente && yaBien && !e.forzar,
    espera = !falta && (!vigente || e.forzar),
    aviso = vigente && !espera && ["otro_centro", "bloqueada", "rechazada", "importe_no_coincide"].includes(e.estado),
    icono = falta ? "–" : espera ? "⏳" : bien ? "✅" : aviso ? "⚠️" : e.estado === "simulacion" ? "🧪" : "❌",
    opTodo = l.fechaPagado ? st.ops[xubioClaveOP(l)] : null,
    op = opTodo && opTodo.estado !== "anterior" ? opTodo : null,
    opInfo = op ? XUBIO_OP_ESTADOS[op.estado] || ["•", op.estado, MUTED] : null,
    titulo = falta
      ? falta + ": no se manda a Xubio"
      : espera
        ? "Se manda a Xubio en unos minutos"
        : (XUBIO_TEXTOS[e.estado] || e.estado) + (bien && e.centroMia ? ": " + e.centroMia : ""),
    reintentar = () => {
      const db = xubioDb();
      db &&
        db
          .collection("xubioEstado")
          .doc(l.id)
          .set({ forzar: true }, { merge: true })
          .catch((x) => window.alert("No se pudo pedir el reintento: " + ((x && x.message) || x)));
    },
    fila = (k, v) =>
      v
        ? React.createElement(
            "div",
            { style: { marginTop: 3 } },
            React.createElement("span", { style: { color: MUTED } }, k + ": "),
            v,
          )
        : null;
  return React.createElement(
    "div",
    { style: { position: "relative", textAlign: "center" } },
    React.createElement(
      "button",
      {
        onClick: () => !falta && setAbierto((x) => !x),
        title:
          titulo +
          (vigente && !espera && !bien && e.mensaje ? "\n" + e.mensaje : "") +
          (falta ? "" : "\n(clic para ver el detalle)"),
        style: {
          border: "none",
          background: "none",
          cursor: falta ? "default" : "pointer",
          fontSize: 15,
          lineHeight: 1,
          padding: "2px 4px",
          color: falta ? MUTED : undefined,
        },
      },
      icono,
    ),
    opInfo &&
      React.createElement(
        "button",
        {
          onClick: () => setAbierto((x) => !x),
          title: opInfo[1] + (op.opNumero ? ": " + op.opNumero : "") + (op.mensaje ? "\n" + op.mensaje : "") + "\n(clic para ver el detalle)",
          style: {
            display: "block",
            margin: "1px auto 0",
            border: "1px solid " + opInfo[2],
            color: opInfo[2],
            background: "#fff",
            borderRadius: 4,
            fontSize: 9.5,
            fontWeight: 700,
            lineHeight: 1.2,
            padding: "0 4px",
            cursor: "pointer",
          },
        },
        op.estado === "creada" || op.estado === "ya_existia" ? "OP ✓" : op.estado === "lista" ? "OP" : "OP " + opInfo[0],
      ),
    abierto &&
      React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 60,
            width: 300,
            background: "#fff",
            border: "1px solid " + BORDER,
            borderRadius: 8,
            boxShadow: "0 6px 20px rgba(0,0,0,.18)",
            padding: "10px 12px",
            textAlign: "left",
            fontSize: 12,
            lineHeight: 1.4,
            color: TEXT,
            whiteSpace: "normal",
          },
        },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 } },
          React.createElement("div", { style: { fontWeight: 700 } }, icono + " " + titulo),
          React.createElement(
            "button",
            {
              onClick: () => setAbierto(false),
              style: { border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 14, lineHeight: 1 },
              title: "Cerrar",
            },
            "✕",
          ),
        ),
        vigente && !espera && e.mensaje && React.createElement("div", { style: { marginTop: 4 } }, e.mensaje),
        vigente && fila("Factura en Xubio", e.facturaXubio && e.facturaXubio + (e.proveedorXubio ? " · " + e.proveedorXubio : "")),
        vigente && !espera && fila("Último intento", xubioCuando(e.intento) + (e.intentos > 1 ? " (intento " + e.intentos + ")" : "")),
        vigente &&
          !espera &&
          !bien &&
          fila(
            "Próximo intento",
            e.intento ? xubioCuando(e.intento + (XUBIO_LENTOS.includes(e.estado) ? 24 : 3) * 3600 * 1000) + " aprox." : "",
          ),
        puedeEditar &&
          (l.centroCostoXubio || (vigente && !bien)) &&
          React.createElement(
            "div",
            { style: { marginTop: 8 } },
            React.createElement(
              "div",
              { style: { color: MUTED, fontSize: 11, marginBottom: 2 } },
              "Centro de costo en Xubio para esta línea (se usa este en lugar del de MIA):",
            ),
            React.createElement(
              "select",
              {
                value: l.centroCostoXubio || "",
                onChange: (x) => onElegirCentro(x.target.value),
                style: {
                  width: "100%",
                  fontSize: 12,
                  padding: "4px",
                  border: "1px solid #D0D0D0",
                  borderRadius: 4,
                  background: "#fff",
                  color: TEXT,
                },
              },
              React.createElement("option", { value: "" }, st.centros.length ? "(el que corresponde según MIA)" : "Cargando centros de Xubio…"),
              st.centros.map((c) => React.createElement("option", { key: c, value: c }, c)),
            ),
          ),
        puedeEditar &&
          vigente &&
          !espera &&
          React.createElement(
            "button",
            {
              onClick: reintentar,
              style: {
                marginTop: 8,
                border: "1px solid #0969DA",
                background: "#fff",
                color: "#0969DA",
                borderRadius: 4,
                padding: "3px 10px",
                fontSize: 12,
                cursor: "pointer",
              },
            },
            bien ? "Volver a mandar a Xubio" : "Reintentar ahora",
          ),
        op && React.createElement(XubioDetalleOP, { op }),
      ),
  );
}
// ---------- Órdenes de pago en Xubio (ver xubio/ordenesPago.js) ----------
function xubioFechaISO(s) {
  const m = String(s || "").match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  return m ? m[3] + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0") : "";
}
function xubioClaveOP(l) {
  return String(l.cuit || "").replace(/\D/g, "") + "_" + xubioFechaISO(l.fechaPagado);
}
const XUBIO_OP_ESTADOS = {
  creada: ["🧾", "OP creada en Xubio", "#1A7F37"],
  anterior: ["–", "OP hecha a mano (ya estaba pagada al activar la integración)", MUTED],
  ya_existia: ["🧾", "OP ya estaba en Xubio", "#1A7F37"],
  creando: ["⏳", "Creando la OP…", "#9A6700"],
  lista: ["🧾", "OP lista", "#0969DA"],
  esperando_centro: ["⏳", "OP: esperando el centro de costo", "#9A6700"],
  faltan_cheques: ["⏳", "OP: faltan los e-cheqs del banco", "#9A6700"],
  no_coincide: ["❌", "OP: los cheques no coinciden", "#CF222E"],
  falta_factura: ["❌", "OP: falta la factura en Xubio", "#CF222E"],
  falta_proveedor: ["❌", "OP: falta el proveedor en Xubio", "#CF222E"],
  sin_valores: ["❌", "OP: sin E-Cheq, transferencia ni efectivo", "#CF222E"],
  error: ["❌", "OP: error", "#CF222E"],
};
function xubioPlata(v) {
  return "$" + (Number(v) || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function xubioFechaCorta(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[3] + "/" + m[2] + "/" + m[1] : iso || "";
}
function XubioDetalleOP({ op }) {
  const i = XUBIO_OP_ESTADOS[op.estado] || ["•", op.estado, MUTED],
    imp = op.importes || {},
    renglon = (a, b, fuerte) =>
      React.createElement(
        "div",
        { style: { display: "flex", justifyContent: "space-between", gap: 8, fontWeight: fuerte ? 700 : 400 } },
        React.createElement("span", { style: { color: fuerte ? TEXT : MUTED } }, a),
        React.createElement("span", null, b),
      );
  return React.createElement(
    "div",
    { style: { marginTop: 10, paddingTop: 8, borderTop: "1px solid " + BORDER } },
    React.createElement(
      "div",
      { style: { fontWeight: 700, color: i[2] } },
      i[0] + " " + i[1] + (op.opNumero ? ": " + op.opNumero : "") + (op.estado === "lista" && op.modo !== "crear" ? " (vista previa)" : ""),
    ),
    op.mensaje && React.createElement("div", { style: { marginTop: 3 } }, op.mensaje),
    op.estado === "lista" &&
      op.modo !== "crear" &&
      React.createElement(
        "div",
        { style: { marginTop: 3, color: MUTED, fontSize: 11 } },
        APP_ENV === "qa"
          ? "En QA solo se muestra cómo quedaría: nunca se crea en Xubio."
          : "Se crea en Xubio en unos minutos.",
      ),
    op.aviso && React.createElement("div", { style: { marginTop: 3, color: "#9A6700" } }, op.aviso),
    React.createElement(
      "div",
      { style: { marginTop: 6 } },
      op.proveedorXubio && renglon("Proveedor", op.proveedorXubio),
      op.fecha && renglon("Fecha", xubioFechaCorta(op.fecha)),
      (op.facturas || []).length > 0 && renglon("Facturas", op.facturas.map((f) => f.numero).join(", ")),
    ),
    (op.cheques || []).length > 0 &&
      React.createElement(
        "div",
        { style: { marginTop: 6 } },
        React.createElement("div", { style: { color: MUTED } }, "E-cheqs (Santander):"),
        op.cheques.map((c) =>
          React.createElement(
            "div",
            { key: c.numero, style: { display: "flex", justifyContent: "space-between", gap: 8 } },
            React.createElement("span", null, "Nº " + String(c.numero).replace(/^0+/, "") + " · vto " + xubioFechaCorta(c.vencimiento)),
            React.createElement("span", null, xubioPlata(c.importe)),
          ),
        ),
      ),
    React.createElement(
      "div",
      { style: { marginTop: 6 } },
      imp.chequesEsperado > 0 && renglon("Cheques según MIA (E-Cheq − retención)", xubioPlata(imp.chequesEsperado)),
      imp.chequesEsperado > 0 && renglon("Cheques del banco", xubioPlata(imp.chequesBanco)),
      imp.transferencia > 0 && renglon("Transferencia", xubioPlata(imp.transferencia)),
      imp.efectivo > 0 && renglon("Efectivo", xubioPlata(imp.efectivo)),
      (op.retenciones || []).map((r) =>
        React.createElement(
          "div",
          { key: r.concepto },
          renglon("Retención Ganancias · " + r.concepto + " (base " + xubioPlata(r.base) + ")", xubioPlata(r.importe)),
        ),
      ),
      imp.totalFacturas > 0 && renglon("Total facturas", xubioPlata(imp.totalFacturas), true),
    ),
    (op.estado === "creada" || op.estado === "ya_existia") &&
      React.createElement(
        "div",
        { style: { marginTop: 6, color: "#9A6700" } },
        "Falta aplicarla a las facturas a mano en Xubio.",
      ),
  );
}
function xubioLeerEcheqs(archivo) {
  return new Promise((ok, mal) => {
    const lector = new FileReader();
    lector.onerror = () => mal(new Error("No se pudo leer el archivo"));
    lector.onload = () => {
      try {
        const libro = XLSX.read(new Uint8Array(lector.result), { type: "array" }),
          filas = XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]], { header: 1, raw: true, defval: "" }),
          norm = (s) =>
            String(s || "")
              .normalize("NFD")
              .replace(/[̀-ͯ]/g, "")
              .toLowerCase()
              .replace(/[^a-z]/g, ""),
          iEnc = filas.findIndex((f) => f.some((c) => norm(c) === "numerodecheque"));
        if (iEnc < 0) throw new Error('No encontré la columna "Número de Cheque". ¿Es el Excel de e-cheqs emitidos del banco?');
        const enc = filas[iEnc].map(norm),
          col = (...n) => enc.findIndex((c) => n.includes(c)),
          C = {
            numero: col("numerodecheque"),
            id: col("idcheque"),
            estado: col("estadodelcheque"),
            cuenta: col("cuentadebito"),
            cuit: col("cuitcuilbeneficiario", "cuitbeneficiario"),
            nombre: col("nombreorazonsocialbeneficiario"),
            emision: col("fechaemision"),
            pago: col("fechapago"),
            importe: col("importe"),
          };
        if ([C.numero, C.cuit, C.emision, C.pago, C.importe].some((x) => x < 0))
          throw new Error("Faltan columnas: se necesitan Número de Cheque, CUIT Beneficiario, Fecha Emisión, Fecha Pago e Importe.");
        const fecha = (v) => {
            if (typeof v === "number") {
              const d = XLSX.SSF.parse_date_code(v);
              return d ? d.y + "-" + String(d.m).padStart(2, "0") + "-" + String(d.d).padStart(2, "0") : "";
            }
            if (v instanceof Date) return v.toISOString().slice(0, 10);
            const m = String(v).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (!m) return "";
            // El banco exporta MM/DD/AAAA; si el primero pasa de 12 es DD/MM/AAAA.
            const [a, b] = Number(m[1]) > 12 ? [m[2], m[1]] : [m[1], m[2]];
            return m[3] + "-" + a.padStart(2, "0") + "-" + b.padStart(2, "0");
          },
          plata = (v) =>
            typeof v === "number"
              ? v
              : Number(String(v).replace(/[^\d,.\-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".")) || 0;
        ok(
          filas
            .slice(iEnc + 1)
            .filter((f) => String(f[C.numero] || "").trim())
            .map((f) => ({
              numero: String(f[C.numero]).trim().replace(/^0+/, ""),
              idCheque: C.id >= 0 ? String(f[C.id] || "") : "",
              estadoBanco: C.estado >= 0 ? String(f[C.estado] || "") : "",
              cuentaDebito: C.cuenta >= 0 ? String(f[C.cuenta] || "") : "",
              cuit: String(f[C.cuit] || "").replace(/\D/g, ""),
              nombre: C.nombre >= 0 ? String(f[C.nombre] || "").replace(/\s+/g, " ").trim() : "",
              fechaEmision: fecha(f[C.emision]),
              fechaPago: fecha(f[C.pago]),
              importe: plata(f[C.importe]),
            }))
            .filter((c) => c.numero && c.cuit && c.importe > 0),
        );
      } catch (e) {
        mal(e);
      }
    };
    lector.readAsArrayBuffer(archivo);
  });
}
function XubioBotonesOP({ esAdmin, puedeEditar }) {
  const st = useXubio(),
    ref = React.useRef(null),
    [subiendo, setSubiendo] = React.useState(false),
    subir = async (ev) => {
      const archivo = ev.target.files && ev.target.files[0];
      ev.target.value = "";
      if (!archivo) return;
      setSubiendo(true);
      try {
        const cheques = await xubioLeerEcheqs(archivo),
          anulados = cheques.filter((c) => /anulad|rechaz/i.test(c.estadoBanco)),
          validos = cheques.filter((c) => !/anulad|rechaz/i.test(c.estadoBanco));
        if (!validos.length) throw new Error("El archivo no tiene e-cheqs para cargar.");
        const db = xubioDb();
        if (!db) throw new Error("Sin conexión con la base de datos");
        let nuevos = 0;
        for (let i = 0; i < validos.length; i += 400) {
          const lote = firebase.firestore().batch();
          validos.slice(i, i + 400).forEach((c) => {
            st.echeqsCargados.has(c.numero) || nuevos++;
            lote.set(db.collection("echeqs").doc(c.numero), { ...c, cargado: Date.now(), archivo: archivo.name }, { merge: true });
          });
          await lote.commit();
        }
        const total = validos.reduce((s, c) => s + c.importe, 0),
          provs = new Set(validos.map((c) => c.cuit)).size;
        window.alert(
          "Se cargaron " + validos.length + " e-cheqs (" + nuevos + " nuevos) de " + provs + " proveedores, por " + xubioPlata(total) + "." +
            (anulados.length ? "\n" + anulados.length + " anulados/rechazados no se cargaron." : "") +
            "\n\nCuando tildes las líneas como pagadas, se arma la OP de cada proveedor con estos cheques.",
        );
      } catch (e) {
        window.alert("No se pudo cargar el Excel de e-cheqs: " + ((e && e.message) || e));
      }
      setSubiendo(false);
    };
  return React.createElement(
    React.Fragment,
    null,
    puedeEditar &&
      React.createElement("input", { ref, type: "file", accept: ".xls,.xlsx,.csv", style: { display: "none" }, onChange: subir }),
    puedeEditar &&
      React.createElement(
        "button",
        {
          onClick: () => ref.current && ref.current.click(),
          disabled: subiendo,
          style: smallBtnGhost,
          title:
            "Subí el Excel de e-cheqs emitidos del banco (Consulta de E-cheques emitidos). Con esos cheques se arma la orden de pago de Xubio de cada proveedor cuando tildás la línea como pagada.",
        },
        subiendo ? "Cargando…" : "Subir e-cheqs del banco" + (st.echeqsCargados.size ? " (" + st.echeqsCargados.size + ")" : ""),
      ),
    APP_ENV === "qa" &&
      React.createElement(
        "span",
        { style: { fontSize: 11.5, color: MUTED }, title: "QA usa el mismo Xubio que Producción: por eso acá nunca se crean órdenes de pago." },
        "OP Xubio: solo vista previa en QA",
      ),
  );
}
function PagosView({
  rows: n,
  obras: d,
  proveedoresMap: c,
  costoSubobrasMap: p,
  subCostoProveedoresMap: g,
  pagosMap: C,
  subCostoPagosMap: S,
  proveedoresInfo: f,
  onProveedorInfoChange: F,
  reglasProveedoresPago: A,
  onReglasProveedoresPagoChange: k,
  correccionesAprendidas: L,
  onCorreccionesAprendidasChange: oe,
  onCrearCentroCosto: ve,
  onCrearSubObra: P,
  onCrearProveedor: M,
  onAdd: Pe,
  onAddMasivo: ye,
  onUpdate: Z,
  onDelete: Ye,
  onSetFechaPagado: ee,
  onReintentar: lt,
  canEdit: ne,
  isAdmin: Be,
}) {
  const Le = (l) => l.registradoEnCostos && !Be,
    Lt = (l) => {
      const I = (l.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS;
      return (l.cliente || "").trim()
        ? (l.centroCosto || "").trim()
          ? !I && !(l.proveedor || "").trim()
            ? "Imputación"
            : Number(l.importeBruto) > 0
              ? null
              : "Importe Bruto"
          : "Centro de Costo"
        : "Cliente";
    },
    [nt, H] = useState("vacias"),
    [Ee, Nt] = useState(""),
    [qt, po] = useState(false),
    [oo, Eo] = useState(false),
    [Oo, Bo] = useState(null),
    [w, Ne] = useState(null),
    [ordPag, setOrdPag] = useState(null),
    [busqPag, setBusqPag] = useState(""),
    [Re, at] = useState(null),
    dt = useMemo(
      () => Array.from(/* @__PURE__ */ new Set([CLIENTE_GASTOS_INTERNOS, ...d.map((l) => l.cliente)])).sort(),
      [d],
    ),
    Gt = useMemo(() => {
      const l = {};
      return (
        n.forEach((I) => {
          const U = (I.proveedorPago || I.proveedor || "").trim().toUpperCase();
          if (!U) return;
          const ce = l[U] || {};
          l[U] = {
            cuit: I.cuit || ce.cuit || "",
            razonSocial: I.razonSocial || ce.razonSocial || "",
            cbu: I.cbu || ce.cbu || "",
          };
        }),
        l
      );
    }, [n]),
    [vt, y] = useState(false),
    G = useMemo(() => {
      const l = {};
      return (
        (A || []).forEach((I) => {
          const U = (I.proveedor || "").trim().toUpperCase();
          U && (l[U] = I);
        }),
        l
      );
    }, [A]);
  function te(l, I, U) {
    const ce = String(I || "").trim(),
      me = String(U || "").trim();
    if (!ce || !me || ce.length < 5 || normalizarTexto(ce) === normalizarTexto(me)) return;
    const ge = L || {},
      Ke = { ...(ge[l] || {}) };
    ((Ke[normalizarTexto(ce)] = me), oe({ ...ge, [l]: Ke }));
  }
  const V = useMemo(() => {
    const l = /* @__PURE__ */ new Set();
    return (
      Object.values(c || {}).forEach((I) =>
        (I || []).forEach((U) => {
          U.proveedor && l.add(U.proveedor);
        }),
      ),
      Object.values(g || {}).forEach((I) =>
        (I || []).forEach((U) => {
          U.proveedor && l.add(U.proveedor);
        }),
      ),
      Array.from(l).sort()
    );
  }, [c, g]);
  function ut() {
    k([...(A || []), { proveedor: "", actividad: "", factura: "", cuit: "", razonSocial: "", cbu: "" }]);
  }
  function At(l, I) {
    k((A || []).map((U, ce) => (ce === l ? { ...U, ...I } : U)));
  }
  function go(l, I) {
    const U = (l || "").trim().toUpperCase();
    if (!U) return;
    const ce = (A || []).findIndex((me) => (me.proveedor || "").trim().toUpperCase() === U);
    ce >= 0
      ? At(ce, I)
      : k([...(A || []), { proveedor: U, actividad: "", factura: "", cuit: "", razonSocial: "", cbu: "", ...I }]);
  }
  function No(l) {
    k((A || []).filter((I, U) => U !== l));
  }
  function Jt() {
    const l = new Set((A || []).map((U) => (U.proveedor || "").trim().toUpperCase())),
      I = V.filter((U) => !l.has(U.trim().toUpperCase()));
    if (I.length === 0) {
      alert("No hay proveedores nuevos para traer: ya están todos en la tabla.");
      return;
    }
    k([
      ...(A || []),
      ...I.map((U) => ({ proveedor: U, actividad: "", factura: "", cuit: "", razonSocial: "", cbu: "" })),
    ]);
  }
  function ht() {
    if (!ne) return;
    const l = n.filter((U) => !Le(U) && (U.proveedorPago || U.proveedor || "").trim());
    if (l.length === 0) {
      alert("No hay líneas de Pagos para actualizar.");
      return;
    }
    if (
      !window.confirm(
        "Esto va a revisar las " +
          l.length +
          " línea(s) de Pagos con Proveedor cargado y actualizar MAT/MO, Factura A, CUIT, Razón Social y CBU según la tabla de Proveedores. Las líneas ya imputadas en Costos (bloqueadas) no se tocan. ¿Confirmás?",
      )
    )
      return;
    let I = 0;
    (l.forEach((U) => {
      const ce = (U.proveedorPago || U.proveedor || "").trim().toUpperCase(),
        me = G[ce];
      if (!me) return;
      const ge = {},
        Ke = (me.actividad || "").trim().toUpperCase(),
        Y = (me.factura || "").trim().toUpperCase();
      if (Ke) {
        const se = Ke === "MAT",
          be = Ke === "MO";
        (U.mat !== se && (ge.mat = se), U.mo !== be && (ge.mo = be));
      }
      if (Y) {
        const se = Y === "A";
        U.facturaA !== se && (ge.facturaA = se);
      }
      (me.cuit && me.cuit !== U.cuit && (ge.cuit = me.cuit),
        me.razonSocial && me.razonSocial !== U.razonSocial && (ge.razonSocial = me.razonSocial),
        me.cbu && me.cbu !== U.cbu && (ge.cbu = me.cbu),
        Object.keys(ge).length > 0 && (Z(U.id, ge), I++));
    }),
      alert(
        I > 0
          ? "Se actualizaron " + I + " línea(s) de Pagos."
          : "Ya estaban todas al día: ninguna línea tenía datos distintos a los de la tabla.",
      ));
  }
  function St() {
    const l = XLSX.utils.aoa_to_sheet([
        ["Proveedor", "Actividad", "Factura", "CUIT", "Razón Social", "CBU"],
        ...(A || []).map((U) => [
          U.proveedor || "",
          U.actividad || "",
          U.factura || "",
          U.cuit || "",
          U.razonSocial || "",
          U.cbu || "",
        ]),
      ]),
      I = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(I, l, "Proveedores"),
      descargarLibroXlsx(
        I,
        "proveedores_mat_mo_facturaA_" + /* @__PURE__ */ new Date().toISOString().slice(0, 10) + ".xlsx",
      ));
  }
  async function zt(l) {
    if (l)
      try {
        const I = await l.arrayBuffer(),
          U = XLSX.read(I, { type: "array" }),
          ce = U.Sheets[U.SheetNames[0]],
          me = XLSX.utils.sheet_to_json(ce, { defval: null }),
          ge = (Ue, it) => {
            for (const pt of Object.keys(Ue)) if (it.includes(pt.toString().trim().toLowerCase())) return Ue[pt];
            return null;
          },
          Ke = me
            .map((Ue) => ({
              proveedor: String(ge(Ue, ["proveedor"]) || "")
                .toUpperCase()
                .trim(),
              actividad: String(ge(Ue, ["actividad"]) || "")
                .toUpperCase()
                .trim(),
              factura: String(ge(Ue, ["factura"]) || "")
                .toUpperCase()
                .trim(),
              cuit: String(ge(Ue, ["cuit"]) || "").trim(),
              razonSocial: String(ge(Ue, ["razón social", "razon social", "razonsocial"]) || "").trim(),
              cbu: String(ge(Ue, ["cbu"]) || "").trim(),
            }))
            .filter((Ue) => Ue.proveedor),
          Y = {};
        Ke.forEach((Ue) => {
          Y[Ue.proveedor] = Ue;
        });
        const se = [...(A || [])],
          be = {};
        (se.forEach((Ue, it) => {
          be[(Ue.proveedor || "").trim().toUpperCase()] = it;
        }),
          Object.values(Y).forEach((Ue) => {
            const it = be[Ue.proveedor];
            it !== void 0 ? (se[it] = { ...se[it], ...Ue }) : se.push(Ue);
          }),
          k(se),
          alert("Se importaron " + Object.keys(Y).length + " proveedor(es)."));
      } catch {
        alert("No se pudo leer el archivo.");
      }
  }
  function gn() {
    const l = dt[0] || "NOMBRE DE UN CLIENTE YA CARGADO",
      U =
        (l ? Array.from(new Set(d.filter((it) => it.cliente === l).map((it) => it.obra))).sort() : [])[0] ||
        "NOMBRE DE UN CENTRO DE COSTO YA CARGADO",
      ce = obraKey(l, U),
      ge = (c[ce] || []).map((it) => it.proveedor)[0] || "PROVEEDOR YA CARGADO EN COSTOS PARA ESE CENTRO",
      Ke = Object.keys(G)[0] || "PROVEEDOR YA CARGADO EN LA TABLA DE PROVEEDORES",
      Y = [
        "Se Paga",
        "Cliente",
        "Centro de Costo",
        "Sub Obra",
        "Imputación",
        "Proveedor",
        "Factura",
        "Importe Final",
        "Importe Bruto",
        "Diego Levy",
        "Efectivo",
        "Transferencia",
        "E-Cheq",
        "Observaciones",
      ],
      se = XLSX.utils.aoa_to_sheet([
        Y,
        ["SI", l, U, "", ge, Ke, "A-0001", 1e5, 121e3, 0, 0, 1e5, 0, "Ejemplo — reemplazá esta fila por tus datos"],
      ]);
    se["!cols"] = Y.map((it) => ({ wch: Math.max(12, it.length + 2) }));
    const be = XLSX.utils.aoa_to_sheet([
      ["Cómo completar la Carga Masiva de Pagos"],
      [""],
      ["- Se Paga: SI o NO (si se deja vacío, se toma SI)."],
      [
        "- Cliente, Centro de Costo, Sub Obra, Imputación, Proveedor: tienen que coincidir con algo ya cargado en la app.",
      ],
      [
        "  Si escribís un nombre incompleto o con algún error de tipeo, la app intenta corregirlo sola SOLO si hay una única",
      ],
      [
        '  opción razonable entre lo ya cargado (ej. "CASAS" se corrige a "ARIEL CASAS" si ese es el único proveedor que',
      ],
      ['  contiene "CASAS"). Si hay más de una opción posible, o ninguna, esa línea se agrega igual pero con el dato'],
      [
        "  marcado en rojo fuerte en la grilla de Pagos, para que lo corrijas a mano eligiéndolo del desplegable — y no se",
      ],
      ["  puede poner Fecha Pagado en esa línea hasta corregir todo, para que el pago se impute bien en Costos."],
      ["- Sub Obra: se puede dejar vacío si el Centro de Costo no usa sub obras."],
      ["- Factura, Observaciones: texto libre."],
      [
        "- Importe Final, Importe Bruto, Diego Levy, Efectivo, Transferencia, E-Cheq: números (podés usar punto de miles y coma decimal, ej. 1.234.567,89).",
      ],
      [
        "- El resto (MAT, MO, Factura A, CUIT, Razón Social, CBU) se completa solo según la tabla de Proveedores (Actividad y Factura) de Pagos.",
      ],
    ]);
    be["!cols"] = [{ wch: 100 }];
    const Ue = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(Ue, se, "Carga masiva"),
      XLSX.utils.book_append_sheet(Ue, be, "Instrucciones"),
      descargarLibroXlsx(Ue, "plantilla_carga_masiva_pagos.xlsx"));
  }
  async function bn(l) {
    if (l)
      try {
        const I = await l.arrayBuffer(),
          U = XLSX.read(I, { type: "array" }),
          ce = U.Sheets[U.SheetNames[0]],
          me = XLSX.utils.sheet_to_json(ce, { defval: null });
        if (me.length === 0) {
          alert("El archivo no tiene filas para importar.");
          return;
        }
        const ge = (be, Ue) => {
            for (const it of Object.keys(be)) if (Ue.includes(it.toString().trim().toLowerCase())) return be[it];
            return null;
          },
          Ke = (be) => {
            if (be == null || be === "") return 0;
            if (typeof be == "number") return be;
            const Ue = String(be).trim();
            if (Ue.startsWith("=") && /^[-+*/().\d\s]+$/.test(Ue.slice(1).trim()) && /[-+*/]/.test(Ue.slice(1))) {
              const Io = Ue.slice(1).trim();
              try {
                const Ot = Function('"use strict"; return (' + Io + ")")();
                if (typeof Ot == "number" && isFinite(Ot)) return Math.round(Ot * 100) / 100;
              } catch {}
            }
            const it = Ue.replace(/\./g, "").replace(",", "."),
              pt = Number(it);
            return isNaN(pt) ? Number(be) || 0 : pt;
          },
          Y = [];
        let se = 0;
        if (
          (me.forEach((be) => {
            const Ue =
                String(ge(be, ["se paga"]) || "SI")
                  .trim()
                  .toUpperCase() === "NO"
                  ? "NO"
                  : "SI",
              it = String(ge(be, ["cliente"]) || "")
                .trim()
                .toUpperCase(),
              pt = String(ge(be, ["centro de costo"]) || "")
                .trim()
                .toUpperCase(),
              Io = String(ge(be, ["sub obra"]) || "")
                .trim()
                .toUpperCase(),
              Ot = String(ge(be, ["imputación", "imputacion"]) || "")
                .trim()
                .toUpperCase(),
              no = String(ge(be, ["proveedor"]) || "")
                .trim()
                .toUpperCase(),
              Kt = String(ge(be, ["factura"]) || "").trim(),
              ae = Ke(ge(be, ["importe final", "importe"])),
              Qt = Ke(ge(be, ["importe bruto"])),
              lo = Ke(ge(be, ["diego levy", "levy"])),
              Wt = Ke(ge(be, ["efectivo"])),
              tn = Ke(ge(be, ["transferencia", "depósito transfer", "deposito transfer"])),
              Lo = Ke(ge(be, ["e-cheq", "echeq"])),
              B = String(ge(be, ["observaciones"]) || "").trim();
            if (!it && !pt && !Ot && !no && !ae && !Qt) return;
            const re = L || {},
              ot = resolverConCoincidencia(it, dt, re.cliente),
              Ht = ot.valor,
              $t = Ht ? Array.from(new Set(d.filter((Do) => Do.cliente === Ht).map((Do) => Do.obra))).sort() : [],
              eo = resolverConCoincidencia(pt, $t, re.centroCosto),
              vo = eo.valor,
              qo = obraKey(Ht, vo),
              ao = p[qo] || [],
              Fo = ao.map((Do) => Do.nombre),
              zo = Io ? resolverConCoincidencia(Io, Fo, re.subObra) : { valor: "", corregido: false },
              Ho = zo.valor,
              nn = Fo.findIndex((Do) => normalizarTexto(Do) === normalizarTexto(Ho)),
              Zt = nn >= 0 ? subCostoKey(qo, ao[nn].id) : null,
              Uo = (Ho && Zt ? g[Zt] || [] : c[qo] || []).map((Do) => Do.proveedor),
              pn = resolverConCoincidencia(Ot, Uo, re.imputacion),
              yn = pn.valor,
              _e = resolverConCoincidencia(no, Object.keys(G), re.proveedor),
              xt = _e.valor;
            (ot.corregido || eo.corregido || zo.corregido || pn.corregido || _e.corregido) && se++;
            const we = G[xt] || {},
              Mo = (f || {})[xt] || {},
              Yo = (we.actividad || "").trim().toUpperCase(),
              yo = (we.factura || "").trim().toUpperCase();
            Y.push({
              sePaga: Ue,
              cliente: Ht,
              centroCosto: vo,
              subObra: Ho,
              proveedor: yn,
              proveedorPago: xt,
              factura: Kt,
              importe: ae,
              importeBruto: Qt,
              diegoLevy: lo,
              efectivo: Wt,
              transferencia: tn,
              echeq: Lo,
              observaciones: B,
              mat: Yo === "MAT",
              mo: Yo === "MO",
              facturaA: yo === "A",
              cuit: we.cuit || Mo.cuit || "",
              razonSocial: we.razonSocial || Mo.razonSocial || "",
              cbu: we.cbu || Mo.cbu || "",
            });
          }),
          Y.length === 0)
        ) {
          alert("No se encontraron filas válidas para importar.");
          return;
        }
        (ye(Y),
          alert(
            "Se importaron " +
              Y.length +
              " línea(s) de Pagos" +
              (se > 0 ? " (" + se + " con algún dato corregido automáticamente)." : ".") +
              `

Revisá las que hayan quedado marcadas en rojo fuerte (Cliente, Centro de Costo, Sub Obra, Imputación o Proveedor): esos datos no coinciden con algo ya cargado ni se pudieron corregir solos sin ambigüedad, y hay que corregirlos a mano (eligiendo del desplegable) antes de poder ponerles Fecha Pagado.`,
          ));
      } catch {
        alert("No se pudo leer el archivo.");
      }
  }
  const sn = useMemo(() => {
      const l = /* @__PURE__ */ new Map();
      return (
        n.forEach((I) => {
          if (!I.fechaPagado) return;
          const U = anioDeFecha(I.fechaPagado),
            ce = mesIdxDeFecha(I.fechaPagado);
          if (U == null || ce == null) return;
          const me = U + "-" + String(ce + 1).padStart(2, "0");
          (l.has(me) || l.set(me, { anio: U, mesIdx: ce, fechas: /* @__PURE__ */ new Set() }),
            l.get(me).fechas.add(I.fechaPagado));
        }),
        Array.from(l.entries())
          .sort((I, U) => I[0].localeCompare(U[0]))
          .map(([I, U]) => ({
            key: I,
            label: capitalizar(MESES[U.mesIdx].toLowerCase()) + " " + U.anio,
            fechas: Array.from(U.fechas).sort((ce, me) => (fechaAObjetoDate(ce) || 0) - (fechaAObjetoDate(me) || 0)),
          }))
      );
    }, [n]),
    fo = useMemo(() => {
      let l;
      return (
        nt === "semana"
          ? (l = n.filter((I) => !I.fechaPagado && I.sePaga === "NO"))
          : nt === "vacias"
            ? (l = n.filter((I) => !I.fechaPagado && I.sePaga === "SI"))
            : nt === "fecha"
              ? (l = Ee ? n.filter((I) => I.fechaPagado === Ee) : [])
              : (l = n),
        busqPag.trim() &&
          (l = l.filter((I) => {
            const q = normalizarTexto(busqPag);
            return normalizarTexto(I.proveedorPago).includes(q) || normalizarTexto(I.proveedor).includes(q);
          })),
        ordPag
          ? (l = [...l].sort((I, U) => compararOrdenPago(I, U, ordPag)))
          : Oo
          ? (l = [...l].sort((I, U) => {
              const ce = (I.proveedorPago || I.proveedor || "").trim().toUpperCase(),
                me = (U.proveedorPago || U.proveedor || "").trim().toUpperCase(),
                ge = ce.localeCompare(me, "es");
              return Oo === "asc" ? ge : -ge;
            }))
          : w &&
            (l = [...l].sort((I, U) => {
              const ce = (I.cliente || "").trim().toUpperCase(),
                me = (U.cliente || "").trim().toUpperCase(),
                ge = ce.localeCompare(me, "es");
              return w === "asc" ? ge : -ge;
            })),
        l
      );
    }, [n, nt, Ee, Oo, w, ordPag, busqPag]),
    v = useMemo(() => {
      const l = n.filter((me) => !me.fechaPagado && me.sePaga === "SI" && (me.cliente || "").trim()),
        I = /* @__PURE__ */ new Map();
      l.forEach((me) => {
        const ge = me.cliente.trim(),
          Ke = (me.centroCosto || "").trim() || "(Sin centro de costo)";
        I.has(ge) || I.set(ge, /* @__PURE__ */ new Map());
        const Y = I.get(ge);
        Y.set(Ke, (Y.get(Ke) || 0) + (Number(me.importe) || 0));
      });
      const U = Array.from(I.entries())
          .map(([me, ge]) => {
            const Ke = Array.from(ge.entries())
                .map(([se, be]) => ({ centro: se, monto: be }))
                .sort((se, be) => be.monto - se.monto),
              Y = Ke.reduce((se, be) => se + be.monto, 0);
            return { cliente: me, total: Y, centros: Ke };
          })
          .sort((me, ge) => ge.total - me.total),
        ce = U.reduce((me, ge) => me + ge.total, 0);
      return { clientes: U, totalGeneral: ce };
    }, [n]),
    E = fo.reduce((l, I) => l + (Number(I.importe) || 0), 0),
    K = fo.reduce((l, I) => l + (Number(I.importeBruto) || 0), 0),
    de = fo.reduce((l, I) => l + (Number(I.diegoLevy) || 0), 0),
    Bt = fo.reduce((l, I) => l + (Number(I.efectivo) || 0), 0),
    Ft = fo.reduce((l, I) => l + (Number(I.transferencia) || 0), 0),
    Xe = fo.reduce((l, I) => l + (Number(I.echeq) || 0), 0),
    rt = Bt + Ft + de,
    Ct = Bt + Ft + Xe + de;
  function kt() {
    const l = [
        "FECHA PAGADO",
        "SE PAGA",
        "Cliente",
        "Centro de Costo",
        "Sub Obra",
        "Imputación",
        "Proveedor",
        "MO",
        "MAT",
        "Factura",
        "FACTURA A",
        "IMPORTE FINAL",
        "IMPORTE BRUTO",
        "DIEGO LEVY",
        "EFECTIVO",
        "DEPOSITO TRANSFER",
        "E-CHEQ",
        "Observaciones",
        "CBU",
        "CUIT",
        "Razón Social",
      ],
      I = fo.map((Y) => [
        fechaConGuiones(Y.fechaPagado) || "",
        Y.sePaga || "",
        Y.cliente || "",
        Y.centroCosto || "",
        Y.subObra || "",
        Y.proveedor || "",
        Y.proveedorPago || "",
        Y.mo ? "SI" : "NO",
        Y.mat ? "SI" : "NO",
        Y.factura || "",
        Y.facturaA ? "SI" : "NO",
        Number(Y.importe) || 0,
        Number(Y.importeBruto) || 0,
        Number(Y.diegoLevy) || 0,
        Number(Y.efectivo) || 0,
        Number(Y.transferencia) || 0,
        Number(Y.echeq) || 0,
        Y.observaciones || "",
        Y.cbu || "",
        Y.cuit || "",
        Y.razonSocial || "",
      ]),
      U = ["", "", "", "", "", "", "", "", "", "", "", E, K, de, Bt, Ft, Xe, "", "", "", ""],
      ce = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", rt, "", "", "TOTALES EFVO+TRA", "", "", ""],
      me = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", Ct, "", "", "TOTALES", "", "", ""],
      ge = XLSX.utils.aoa_to_sheet([l, ...I, U, ce, me]),
      Ke = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(Ke, ge, "Pagos"),
      descargarLibroXlsx(Ke, "pagos_semanales_" + /* @__PURE__ */ new Date().toISOString().slice(0, 10) + ".xlsx"));
  }
  async function Oe() {
    if (!(window.html2canvas && window.jspdf)) {
      alert("No se pudo cargar el generador de PDF. Probá recargar la página.");
      return;
    }
    const l = n
      .filter((I) => !I.fechaPagado && I.sePaga === "SI")
      .sort((I, U) => {
        const ce = (I.proveedorPago || I.proveedor || "").trim().toUpperCase(),
          me = (U.proveedorPago || U.proveedor || "").trim().toUpperCase();
        return ce.localeCompare(me, "es");
      });
    if (l.length === 0) {
      alert("No hay pagos sin fecha pagado para exportar.");
      return;
    }
    po(true);
    try {
      await new Promise((_e) => setTimeout(_e, 30));
      const I = (_e) =>
          String(_e ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;"),
        U = [
          "Proveedor",
          "Cliente",
          "Centro de Costo",
          "Factura",
          "Importe",
          "Levy",
          "Efectivo",
          "Transferencia",
          "E-Cheq",
          "Observaciones",
        ],
        ce = ["15%", "11%", "13%", "8%", "9%", "8%", "8%", "9%", "8%", "11%"],
        me = /* @__PURE__ */ new Set(["Importe", "Levy", "Efectivo", "Transferencia", "E-Cheq"]),
        ge = l.reduce((_e, xt) => _e + (Number(xt.importe) || 0), 0),
        Ke = l.reduce((_e, xt) => _e + (Number(xt.diegoLevy) || 0), 0),
        Y = l.reduce((_e, xt) => _e + (Number(xt.efectivo) || 0), 0),
        se = l.reduce((_e, xt) => _e + (Number(xt.transferencia) || 0), 0),
        be = l.reduce((_e, xt) => _e + (Number(xt.echeq) || 0), 0),
        Ue = Y + se + Ke,
        it = Y + se + be + Ke,
        pt = document.createElement("div");
      ((pt.style.position = "fixed"),
        (pt.style.left = "-99999px"),
        (pt.style.top = "0"),
        (pt.style.width = "1000px"),
        (pt.style.background = "#ffffff"),
        (pt.style.padding = "26px"),
        (pt.style.fontFamily = "Arial, Helvetica, sans-serif"),
        (pt.style.color = "#1a1a1a"));
      const Io = (_e) =>
          '<th style="text-align:' +
          (me.has(_e) ? "right" : "left") +
          ";padding:6px 8px;border-bottom:2px solid " +
          NAVY +
          ';border-right:1px solid #e2e0da;background:#F5F4F0;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;color:#555;white-space:nowrap;">' +
          I(_e) +
          "</th>",
        Ot = (_e, xt) =>
          '<td style="padding:5px 8px;border-bottom:1px solid #eee;border-right:1px solid #eee;text-align:' +
          (xt ? "right" : "left") +
          ';font-size:11px;word-break:break-word;">' +
          I(_e) +
          "</td>",
        no = (_e) =>
          (_e.cliente || "").trim().toUpperCase() === "WU" && (_e.subObra || "").trim()
            ? _e.subObra
            : _e.centroCosto || "",
        Kt = l
          .map(
            (_e, xt) =>
              '<tr style="background:' +
              (xt % 2 === 0 ? "#fff" : "#F7F6F3") +
              ';">' +
              Ot(_e.proveedorPago || _e.proveedor || "", false) +
              Ot(_e.cliente || "", false) +
              Ot(no(_e), false) +
              Ot(_e.factura || "", false) +
              Ot(fmt(Number(_e.importe) || 0), true) +
              Ot(fmt(Number(_e.diegoLevy) || 0), true) +
              Ot(fmt(Number(_e.efectivo) || 0), true) +
              Ot(fmt(Number(_e.transferencia) || 0), true) +
              Ot(fmt(Number(_e.echeq) || 0), true) +
              Ot(_e.observaciones || "", false) +
              "</tr>",
          )
          .join(""),
        ae = "<colgroup>" + ce.map((_e) => '<col style="width:' + _e + ';">').join("") + "</colgroup>",
        Qt =
          v.clientes.length === 0
            ? ""
            : '<div id="resumenBloquePdf"><div style="font-size:15px;font-weight:bold;color:' +
              NAVY +
              ';margin:22px 0 8px;">Resumen — Importe Final por Cliente y Centro de Costo</div><table style="border-collapse:collapse;width:60%;"><thead><tr><th style="text-align:left;padding:6px 8px;border-bottom:2px solid ' +
              NAVY +
              ';border-right:1px solid #e2e0da;background:#F5F4F0;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;color:#555;">Cliente / Centro de Costo</th><th style="text-align:right;padding:6px 8px;border-bottom:2px solid ' +
              NAVY +
              ';background:#F5F4F0;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;color:#555;">Importe Final</th></tr></thead><tbody>' +
              v.clientes
                .map(
                  (_e) =>
                    '<tr style="background:#F5F4F0;"><td style="padding:5px 8px;border-bottom:1px solid #eee;border-right:1px solid #eee;font-size:11px;font-weight:700;color:' +
                    NAVY +
                    ';">' +
                    I(_e.cliente) +
                    '</td><td style="padding:5px 8px;border-bottom:1px solid #eee;text-align:right;font-size:11px;font-weight:700;color:' +
                    NAVY +
                    ';">' +
                    I(fmt(_e.total)) +
                    "</td></tr>" +
                    _e.centros
                      .map(
                        (xt) =>
                          '<tr><td style="padding:5px 8px 5px 22px;border-bottom:1px solid #eee;border-right:1px solid #eee;font-size:11px;color:#666;">' +
                          I(xt.centro) +
                          '</td><td style="padding:5px 8px;border-bottom:1px solid #eee;text-align:right;font-size:11px;">' +
                          I(fmt(xt.monto)) +
                          "</td></tr>",
                      )
                      .join(""),
                )
                .join("") +
              '<tr style="background:#F1E9D2;font-weight:700;"><td style="padding:7px 8px;border-top:2px solid ' +
              NAVY +
              ';border-right:1px solid #e6dcb8;font-size:11px;">TOTAL GENERAL</td><td style="padding:7px 8px;border-top:2px solid ' +
              NAVY +
              ";text-align:right;font-size:11px;color:" +
              NAVY +
              ';">' +
              I(fmt(v.totalGeneral)) +
              "</td></tr></tbody></table></div>",
        lo = "Pagos Semana " + numeroSemanaISO(/* @__PURE__ */ new Date());
      ((pt.innerHTML =
        '<div style="font-size:18px;font-weight:bold;color:' +
        NAVY +
        ';margin-bottom:2px;">' +
        I(lo) +
        '</div><div style="font-size:11px;color:#777;margin-bottom:16px;">Generado el ' +
        fechaConGuiones(dateAFechaStr(/* @__PURE__ */ new Date())) +
        " — " +
        l.length +
        " línea" +
        (l.length === 1 ? "" : "s") +
        '</div><table style="border-collapse:collapse;width:100%;table-layout:fixed;">' +
        ae +
        "<thead><tr>" +
        U.map(Io).join("") +
        "</tr></thead><tbody>" +
        Kt +
        '<tr style="font-weight:700;background:#F1E9D2;"><td colspan="4" style="padding:7px 8px;border-top:2px solid ' +
        NAVY +
        ';border-right:1px solid #e6dcb8;font-size:11px;">TOTALES</td><td style="padding:7px 8px;border-top:2px solid ' +
        NAVY +
        ';border-right:1px solid #e6dcb8;text-align:right;font-size:11px;">' +
        I(fmt(ge)) +
        '</td><td style="padding:7px 8px;border-top:2px solid ' +
        NAVY +
        ';border-right:1px solid #e6dcb8;text-align:right;font-size:11px;">' +
        I(fmt(Ke)) +
        '</td><td style="padding:7px 8px;border-top:2px solid ' +
        NAVY +
        ';border-right:1px solid #e6dcb8;text-align:right;font-size:11px;">' +
        I(fmt(Y)) +
        '</td><td style="padding:7px 8px;border-top:2px solid ' +
        NAVY +
        ';border-right:1px solid #e6dcb8;text-align:right;font-size:11px;">' +
        I(fmt(se)) +
        '</td><td style="padding:7px 8px;border-top:2px solid ' +
        NAVY +
        ';border-right:1px solid #e6dcb8;text-align:right;font-size:11px;">' +
        I(fmt(be)) +
        '</td><td style="padding:7px 8px;border-top:2px solid ' +
        NAVY +
        ';"></td></tr><tr><td colspan="6" style="padding:5px 8px;text-align:right;font-size:10.5px;color:#777;">TOTALES EFVO+TRA</td><td style="padding:5px 8px;text-align:right;font-size:10.5px;font-weight:700;">' +
        I(fmt(Ue)) +
        '</td><td colspan="3"></td></tr><tr><td colspan="6" style="padding:5px 8px;text-align:right;font-size:11px;font-weight:700;color:' +
        NAVY +
        ';">TOTALES</td><td style="padding:5px 8px;text-align:right;font-size:11px;font-weight:700;color:' +
        NAVY +
        ';">' +
        I(fmt(it)) +
        '</td><td colspan="3"></td></tr></tbody></table>' +
        Qt),
        document.body.appendChild(pt),
        await new Promise((_e) => setTimeout(_e, 30)));
      const Wt = pt.querySelector("#resumenBloquePdf"),
        tn = Wt ? Wt.offsetTop : null,
        Lo = 2,
        B = await window.html2canvas(pt, { scale: Lo, backgroundColor: "#ffffff", logging: false });
      document.body.removeChild(pt);
      const re = tn != null ? Math.round(tn * Lo) : null,
        { jsPDF: ot } = window.jspdf,
        Ht = Math.round(800 * Math.SQRT2),
        $t = Math.round(Ht * Math.SQRT2),
        eo = 24,
        vo = 24,
        qo = Ht - eo * 2,
        ao = qo / B.width,
        Fo = $t - vo * 2,
        zo = Math.max(1, Math.floor(Fo / ao)),
        Ho = new ot({ orientation: "portrait", unit: "px", format: [Ht, $t] }),
        nn = (_e, xt, we) => {
          const Mo = document.createElement("canvas");
          ((Mo.width = B.width), (Mo.height = xt));
          const Yo = Mo.getContext("2d");
          ((Yo.fillStyle = "#ffffff"),
            Yo.fillRect(0, 0, B.width, xt),
            Yo.drawImage(B, 0, _e, B.width, xt, 0, 0, B.width, xt));
          const yo = Mo.toDataURL("image/jpeg", 0.92);
          Ho.addImage(yo, "JPEG", eo, vo + we * ao, qo, xt * ao);
        };
      let Zt = 0,
        Uo = false;
      const pn = (_e, xt, we) => {
        if (xt <= 0) return;
        we && we.evitarPartir && Uo && Zt > 0 && xt > zo - Zt && (Ho.addPage([Ht, $t], "portrait"), (Zt = 0));
        let Mo = _e,
          Yo = xt;
        for (; Yo > 0; ) {
          Zt >= zo && (Ho.addPage([Ht, $t], "portrait"), (Zt = 0));
          const yo = Math.min(zo - Zt, Yo);
          (nn(Mo, yo, Zt), (Zt += yo), (Mo += yo), (Yo -= yo), (Uo = true));
        }
      };
      re != null ? (pn(0, re), pn(re, B.height - re, { evitarPartir: true })) : pn(0, B.height);
      const yn = Ho.output("blob");
      await ofrecerDescarga(
        "PDF Pagos Semanales " +
          numeroSemanaISO(/* @__PURE__ */ new Date()) +
          " " +
          /* @__PURE__ */ new Date().toISOString().slice(0, 10) +
          ".pdf",
        yn,
      );
    } catch {
      alert("No se pudo generar el PDF. Probá de nuevo.");
    } finally {
      po(false);
    }
  }
  function jt() {
    if (fo.length === 0) {
      alert("No hay líneas para mostrar en el filtro elegido arriba.");
      return;
    }
    Eo(true);
    try {
      const l = /* @__PURE__ */ new Map();
      fo.forEach((Y) => {
        const se = (Y.proveedorPago || Y.proveedor || "").trim() || "(Sin proveedor)";
        (l.has(se) || l.set(se, []), l.get(se).push(Y));
      });
      const I = Array.from(l.entries())
          .map(([Y, se]) => {
            const { retGanTransf: be, retGanChe: Ue } = calcularRetencionGananciasProveedor(se),
              it = se.reduce((Qt, lo) => Qt + (Number(lo.importe) || 0), 0),
              pt = se.reduce((Qt, lo) => Qt + (Number(lo.importeBruto) || 0), 0),
              Io = se.reduce((Qt, lo) => Qt + (Number(lo.transferencia) || 0), 0),
              Ot = se.reduce((Qt, lo) => Qt + (Number(lo.echeq) || 0), 0),
              no = Array.from(new Set(se.map((Qt) => (Qt.factura || "").trim()).filter(Boolean))).join(", "),
              Kt = (se.find((Qt) => (Qt.cbu || "").trim()) || {}).cbu || "",
              ae = Array.from(new Set(se.map((Qt) => (Qt.observaciones || "").trim()).filter(Boolean))).join(" / ");
            return {
              proveedor: Y,
              facturas: no,
              sumaImporteFinal: it,
              sumaImporteBruto: pt,
              retGanTransf: be,
              totalTransferencia: Io - be,
              retGanChe: Ue,
              totalCheques: Ot - Ue,
              cbu: Kt,
              observaciones: ae,
            };
          })
          .sort((Y, se) => Y.proveedor.localeCompare(se.proveedor, "es")),
        U = [
          "Proveedor",
          "Facturas",
          "Suma Importe Final",
          "Suma Importe Bruto",
          "Retención Transferencia",
          "Total Transferencia",
          "Retención Cheque",
          "Total Cheques",
          "CBU",
          "Observaciones",
        ],
        ce = I.map((Y) => [
          Y.proveedor,
          Y.facturas,
          Y.sumaImporteFinal,
          Y.sumaImporteBruto,
          Y.retGanTransf,
          Y.totalTransferencia,
          Y.retGanChe,
          Y.totalCheques,
          Y.cbu,
          Y.observaciones,
        ]),
        me = [
          "TOTALES",
          "",
          I.reduce((Y, se) => Y + se.sumaImporteFinal, 0),
          I.reduce((Y, se) => Y + se.sumaImporteBruto, 0),
          I.reduce((Y, se) => Y + se.retGanTransf, 0),
          I.reduce((Y, se) => Y + se.totalTransferencia, 0),
          I.reduce((Y, se) => Y + se.retGanChe, 0),
          I.reduce((Y, se) => Y + se.totalCheques, 0),
          "",
          "",
        ],
        ge = XLSX.utils.aoa_to_sheet([U, ...ce, me]),
        Ke = XLSX.utils.book_new();
      (XLSX.utils.book_append_sheet(Ke, ge, "Retenciones"),
        descargarLibroXlsx(Ke, "retenciones_" + /* @__PURE__ */ new Date().toISOString().slice(0, 10) + ".xlsx"));
    } finally {
      Eo(false);
    }
  }
  const q = {
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
      position: "sticky",
      top: 0,
      zIndex: 2,
    },
    Ae = { padding: "4px 6px", borderBottom: "1px solid " + BORDER, verticalAlign: "middle" },
    Ve = {
      border: "1px solid " + BORDER,
      borderRadius: 6,
      padding: "5px 7px",
      fontSize: 12,
      background: "#fff",
      color: TEXT,
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    bo = ne ? 23 : 22,
    thOrd = (label, key, extra, title) =>
      React.createElement(
        "th",
        {
          style: { ...q, ...(extra || {}), cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" },
          title: (title ? title + " · " : "") + "Click para ordenar (▲ / ▼ / sin orden)",
          onClick: () => {
            (Bo(null),
              Ne(null),
              setOrdPag((o) =>
                !o || o.key !== key ? { key, dir: "asc" } : o.dir === "asc" ? { key, dir: "desc" } : null,
              ));
          },
        },
        label,
        ordPag && ordPag.key === key ? (ordPag.dir === "asc" ? " ▲" : " ▼") : "",
      );
  return React.createElement(
    "div",
    { style: { padding: "22px 28px" } },
    React.createElement(
      "datalist",
      { id: "pagos-proveedores-datalist" },
      Array.from(new Set((A || []).map((l) => (l.proveedor || "").trim()).filter(Boolean)))
        .sort()
        .map((l) => React.createElement("option", { key: l, value: l })),
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 10,
        },
      },
      React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: NAVY } },
          "Pagos",
        ),
        React.createElement(
          "div",
          { style: { fontSize: 12, color: MUTED, marginTop: 2 } },
          "Lista corrida de facturas de proveedores a pagar, con cómo se le paga a cada uno.",
        ),
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },
        React.createElement(
          "div",
          { style: { position: "relative", display: "flex", alignItems: "center" } },
          React.createElement("input", {
            placeholder: "Buscar proveedor o imputación...",
            value: busqPag,
            onChange: (l) => setBusqPag(l.target.value),
            style: { ...inputStyle, width: 250, paddingRight: 26 },
          }),
          busqPag &&
            React.createElement(
              "button",
              {
                onClick: () => setBusqPag(""),
                title: "Borrar búsqueda",
                style: {
                  position: "absolute",
                  right: 6,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: MUTED,
                  padding: 0,
                  lineHeight: 0,
                },
              },
              React.createElement(X, { size: 13 }),
            ),
        ),
        React.createElement(
          "select",
          {
            style: {
              ...selectStyle,
              fontWeight: 700,
              color: nt === "vacias" ? "#8A6A1E" : NAVY,
              background: nt === "vacias" ? "#F7EDD2" : "#fff",
              borderColor: nt === "vacias" ? GOLD : BORDER,
            },
            value: nt,
            onChange: (l) => H(l.target.value),
          },
          React.createElement("option", { value: "vacias" }, "Sin Fecha Pagado"),
          React.createElement("option", { value: "semana" }, "Postergados"),
          React.createElement("option", { value: "fecha" }, "Por fecha pagada"),
          React.createElement("option", { value: "todas" }, "Todas las líneas"),
        ),
        nt === "fecha" &&
          React.createElement(
            "select",
            { style: { ...inputStyle, width: 190 }, value: Ee, onChange: (l) => Nt(l.target.value) },
            React.createElement("option", { value: "" }, "Elegí una fecha"),
            sn.map((l) =>
              React.createElement(
                "optgroup",
                { key: l.key, label: l.label },
                l.fechas.map((I) => React.createElement("option", { key: I, value: I }, fechaConGuiones(I))),
              ),
            ),
          ),
        React.createElement(
          "button",
          { onClick: kt, style: smallBtnGhost },
          React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
          " Descargar",
        ),
        React.createElement(
          "button",
          {
            onClick: Oe,
            disabled: qt,
            style: smallBtnGhost,
            title:
              "PDF con Proveedor, Cliente, Centro de Costo, Factura, Importe, Levy, Efectivo, Transferencia, E-Cheq y Observaciones de las líneas sin Fecha Pagado (Se Paga = SI), ordenadas por Proveedor",
          },
          React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
          " ",
          qt ? "Generando PDF..." : "Pagos Semanales",
        ),
        React.createElement(
          "button",
          {
            onClick: jt,
            disabled: oo,
            style: smallBtnGhost,
            title:
              "Excel de Retención de Ganancias consolidado por Proveedor (una fila por proveedor, con la suma del Importe Bruto de sus facturas — no factura por factura), sobre las líneas visibles según el filtro elegido arriba",
          },
          React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
          " ",
          oo ? "Generando..." : "Retenciones",
        ),
        React.createElement(XubioBotonesOP, { esAdmin: Be, puedeEditar: ne }),
        React.createElement(
          "button",
          {
            onClick: () => y(true),
            style: smallBtnGhost,
            title:
              "Tabla de Proveedor / Actividad / Factura que tilda automáticamente MAT, MO y Factura A al elegir un proveedor",
          },
          "Proveedores (MAT/MO/Fact. A)",
        ),
        ne &&
          React.createElement(
            "button",
            {
              onClick: gn,
              style: smallBtnGhost,
              title:
                "Descarga un Excel de ejemplo con las columnas que espera la Carga Masiva y las instrucciones de uso",
            },
            React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
            " Planilla de ejemplo",
          ),
        ne &&
          React.createElement(
            "label",
            {
              style: smallBtnGhost,
              title:
                "Importar varias líneas de una vez desde un Excel/CSV con columnas: Se Paga, Cliente, Centro de Costo, Sub Obra, Imputación, Proveedor, Factura, Importe Final, Importe Bruto, Diego Levy, Efectivo, Transferencia, E-Cheq, Observaciones. El resto (MAT/MO, Factura A, CUIT, Razón Social, CBU) se completa solo según la tabla de Proveedores. Si algún Cliente/Centro de Costo/Sub Obra/Imputación/Proveedor no coincide con datos ya cargados, se intenta corregir solo (si hay una única opción razonable); si no se puede, la línea se agrega igual pero queda marcada en rojo para corregir antes de poder pagarla.",
            },
            React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
            " Carga masiva",
            React.createElement("input", {
              type: "file",
              accept: ".xlsx,.xls,.csv",
              style: { display: "none" },
              onChange: (l) => {
                const I = l.target.files[0];
                (bn(I), (l.target.value = ""));
              },
            }),
          ),
        ne &&
          React.createElement(
            "button",
            { onClick: Pe, style: smallBtnPrimary },
            React.createElement(Plus, { size: 13, style: { verticalAlign: "-2px" } }),
            " Agregar línea",
          ),
      ),
    ),
    // Sección 95: la explicación queda plegada para que la tabla arranque más arriba.
    React.createElement(
      "details",
      { style: { fontSize: 11.5, color: MUTED, marginBottom: 10 } },
      React.createElement("summary", { style: { cursor: "pointer", fontWeight: 600, color: NAVY, fontSize: 12 } }, "Cómo funcionan los pagos"),
      React.createElement("div", { style: { height: 4 } }),
      '"Sin Fecha Pagado" = Fecha Pagado vacía y Se Paga = SI. "Postergados" = Fecha Pagado vacía y Se Paga = NO. Al completar la Fecha Pagado, la línea deja de contarse ahí y además se registra como pago real en Costos (mismo Cliente + Centro de Costo, o Sub Obra si corresponde): descuenta del presupuesto real del proveedor y aparece también ahí. Si el proveedor todavía no está cargado en esa obra, se da de alta ahí mismo con presupuesto original y real en 0 (para editarlo después en Costos); si la obra en sí todavía no existe, la línea queda sin registrar con el motivo, para corregir y reintentar. "Factura A" tildado: en Costos se imputa el Importe Bruto tal cual está cargado (sin dividir por 1.21); el Importe Final de la línea no cambia.',
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
        "style",
        null,
        ".pagos-scroll::-webkit-scrollbar { height: 14px; } .pagos-scroll::-webkit-scrollbar-track { background: #F0EFE9; } .pagos-scroll::-webkit-scrollbar-thumb { background: #B9B3A0; border-radius: 7px; border: 3px solid #F0EFE9; } .pagos-scroll::-webkit-scrollbar-thumb:hover { background: #a49d88; } .pagos-scroll { scrollbar-width: auto; scrollbar-color: #B9B3A0 #F0EFE9; }",
      ),
      React.createElement(
        "div",
        {
          className: "pagos-scroll",
          ref: attachDragScroll,
          style: { overflowX: "scroll", overflowY: "auto", maxHeight: "70vh" },
        },
        React.createElement(
          "table",
          { style: { borderCollapse: "collapse", width: "100%", minWidth: 2140 } },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              thOrd("Fecha Pagado", "fechaPagado"),
              thOrd("Se Paga", "sePaga"),
              thOrd("Cliente", "cliente"),
              thOrd("Centro de Costo", "centroCosto"),
              thOrd("Sub Obra", "subObra"),
              thOrd("Imputación", "proveedor", null, "A qué proveedor, dentro del Cliente/Centro de Costo/Sub Obra, se le imputa el pago en Costos"),
              thOrd("Proveedor", "proveedorPago", null, "A quién se le hace el pago efectivamente (puede ser distinto de la Imputación, cuando un proveedor factura a cuenta y orden de otro). Trae MAT/MO/Factura A/CUIT/Razón Social/CBU desde la tabla de Proveedores. Click para ordenar."),
              thOrd("MO", "mo", { textAlign: "center" }),
              thOrd("MAT", "mat", { textAlign: "center" }),
              thOrd("Factura", "factura"),
              React.createElement(
                "th",
                {
                  style: { ...q, textAlign: "center" },
                  title:
                    "Xubio: cada línea con CUIT y número de factura se manda sola a Xubio para ponerle el centro de costo. ✅ quedó bien · ❌ no se pudo (clic para ver el motivo; se reintenta sola cada 3 horas) · ⏳ se manda en unos minutos · – falta CUIT o factura.",
                },
                "Xubio",
              ),
              thOrd("Factura A", "facturaA", { textAlign: "center" }, "Si está tildado, en Costos se imputa el Importe Bruto tal cual está cargado (sin dividir por 1.21)"),
              thOrd("Importe Final", "importe", { textAlign: "right" }),
              thOrd("Importe Bruto", "importeBruto", { textAlign: "right" }, "Importe con IVA incluido. La Retención de Ganancias ya no se calcula ni se muestra acá factura por factura: se descarga consolidada por Proveedor con el botón 'Retenciones'"),
              thOrd("Diego Levy", "diegoLevy", { textAlign: "right" }),
              thOrd("Efectivo", "efectivo", { textAlign: "right" }),
              thOrd("Transferencia", "transferencia", { textAlign: "right" }),
              thOrd("E-Cheq", "echeq", { textAlign: "right" }),
              thOrd("Observaciones", "observaciones"),
              thOrd("CBU", "cbu"),
              thOrd("CUIT", "cuit"),
              thOrd("Razón Social", "razonSocial"),
              ne && React.createElement("th", { style: q }),
            ),
          ),
          React.createElement(
            "tbody",
            null,
            fo.length === 0 &&
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { colSpan: bo, style: { padding: "22px 10px", textAlign: "center", color: MUTED, fontSize: 12.5 } },
                  "No hay líneas para mostrar.",
                ),
              ),
            fo.map((l, I) => {
              const U = I % 2 === 0 ? "#fff" : "#F5F4F0",
                ce = (l.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS,
                me = obraKey(l.cliente, l.centroCosto),
                ge = ce
                  ? RUBROS_GASTOS_INTERNOS
                  : l.cliente
                    ? Array.from(new Set(d.filter((B) => B.cliente === l.cliente).map((B) => B.obra))).sort()
                    : [],
                Ke = ce ? [] : p[me] || [],
                Y = Ke.map((B) => B.nombre),
                se = Y.findIndex((B) => B.trim().toUpperCase() === (l.subObra || "").trim().toUpperCase()),
                be = se >= 0 ? subCostoKey(me, Ke[se].id) : null,
                Ue = ce ? [] : (l.subObra && be ? g[be] || [] : c[me] || []).map((B) => B.proveedor),
                it = !!l.cliente && !dt.includes(l.cliente),
                pt = !!l.centroCosto && !ge.includes(l.centroCosto),
                Io = ce ? false : !!l.subObra && !Y.includes(l.subObra),
                Ot = ce ? false : !!l.proveedor && !Ue.includes(l.proveedor),
                no = !!(l.proveedorPago || "").trim() && !G[(l.proveedorPago || "").trim().toUpperCase()],
                Kt = it || pt || Io || Ot || no,
                ae = (B) => (B ? { ...Ae, background: "#FBD3D3", boxShadow: "inset 0 0 0 2px " + RED } : Ae),
                Qt = (l.proveedor || "").trim().toUpperCase(),
                lo = ce ? [] : l.subObra && be ? g[be] || [] : c[me] || [],
                Wt = !ce && Qt ? lo.find((B) => B.proveedor === Qt) : null;
              let tn = false,
                Lo = 0;
              if (Wt) {
                const B = Number(Wt.presupuesto) || 0,
                  ot = (l.subObra && be ? S[be] || [] : C[me] || [])
                    .filter(($t) => $t.proveedor === Qt && $t._origenSemanalId !== l.id)
                    .reduce(($t, eo) => $t + (Number(eo.monto) || 0), 0),
                  Ht = Number(l.importeBruto) || 0;
                ((Lo = B - ot), (tn = Ht > 0 && ot + Ht > B));
              }
              return React.createElement(
                "tr",
                { key: l.id, style: { background: U } },
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: 6 } },
                    React.createElement("input", {
                      type: "checkbox",
                      checked: !!l.fechaPagado,
                      disabled: !ne || Le(l) || Kt,
                      title: Kt
                        ? "Corregí primero los datos marcados en rojo (Cliente/Centro de Costo/Sub Obra/Imputación/Proveedor) antes de poder marcarla como pagada, para que el pago se impute bien en Costos."
                        : l.fechaPagado
                          ? "Pagada — destildá para sacarle la Fecha Pagado"
                          : "Tildá para marcarla como pagada hoy (podés ajustar la fecha al lado si corresponde otro día)",
                      onChange: (B) => {
                        if (B.target.checked) {
                          const re = Lt(l);
                          if (re) {
                            alert(
                              'Completá el campo "' +
                                re +
                                '" antes de poder marcarla como pagada, para que el pago se impute bien en Costos.',
                            );
                            return;
                          }
                        }
                        ee(l.id, B.target.checked ? fechaHoyArgentinaDDMMAAAA() : "");
                      },
                      style: {
                        width: 15,
                        height: 15,
                        flexShrink: 0,
                        cursor: !ne || Le(l) || Kt ? "default" : "pointer",
                      },
                    }),
                    React.createElement("input", {
                      key: l.id + ":" + l.fechaPagado,
                      style: { ...Ve, width: 92 },
                      placeholder: "DD-MM-AAAA",
                      defaultValue: fechaConGuiones(l.fechaPagado),
                      disabled: !ne || Le(l) || Kt,
                      title: Kt
                        ? "Corregí primero los datos marcados en rojo (Cliente/Centro de Costo/Sub Obra/Imputación/Proveedor) antes de poner Fecha Pagado, para que el pago se impute bien en Costos."
                        : "Se completa sola al tildar el check, pero la podés corregir a mano si el pago fue otro día.",
                      onBlur: (B) => {
                        const re = normalizarFecha(B.target.value);
                        if (re !== l.fechaPagado) {
                          if (re) {
                            const ot = Lt(l);
                            if (ot) {
                              (alert(
                                'Completá el campo "' +
                                  ot +
                                  '" antes de poder poner Fecha Pagado, para que el pago se impute bien en Costos.',
                              ),
                                (B.target.value = fechaConGuiones(l.fechaPagado)));
                              return;
                            }
                          }
                          ee(l.id, re);
                        }
                      },
                    }),
                  ),
                  Kt &&
                    !l.fechaPagado &&
                    React.createElement(
                      "div",
                      { style: { fontSize: 10, color: RED, marginTop: 2, fontWeight: 700 } },
                      "Corregí los datos en rojo para poder pagar",
                    ),
                  !Kt &&
                    !l.fechaPagado &&
                    Lt(l) &&
                    React.createElement(
                      "div",
                      { style: { fontSize: 10, color: RED, marginTop: 2, fontWeight: 700 } },
                      'Completá "',
                      Lt(l),
                      '" para poder pagar',
                    ),
                  l.registradoEnCostos &&
                    React.createElement(
                      "div",
                      {
                        style: { fontSize: 10, color: GREEN, marginTop: 2 },
                        title:
                          (l.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS
                            ? Be
                              ? "Gasto interno pagado. No se imputa en Costos ni afecta el Margen Bruto de ningún cliente. Como Admin podés editarla o eliminarla igual."
                              : "Gasto interno pagado: la línea queda bloqueada para editar o eliminar (solo Admin puede hacerlo)"
                            : Be
                              ? "Ya se imputó en Costos. Como Admin podés editarla o eliminarla igual."
                              : "Ya se imputó en Costos: la línea queda bloqueada para editar o eliminar (solo Admin puede hacerlo)",
                      },
                      (l.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS
                        ? "✓ Gasto interno pagado"
                        : "✓ Imputado en Costos",
                      Be ? "" : " (bloqueada)",
                    ),
                  !l.registradoEnCostos &&
                    l.motivoError &&
                    React.createElement(
                      "div",
                      { style: { fontSize: 10, color: RED, marginTop: 2 } },
                      l.motivoError,
                      ne &&
                        l.fechaPagado &&
                        React.createElement(
                          React.Fragment,
                          null,
                          " · ",
                          React.createElement(
                            "button",
                            {
                              onClick: () => lt(l.id),
                              style: {
                                border: "none",
                                background: "none",
                                color: RED,
                                textDecoration: "underline",
                                cursor: "pointer",
                                fontSize: 10,
                                padding: 0,
                              },
                            },
                            "Reintentar",
                          ),
                        ),
                    ),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement(
                    "select",
                    {
                      style: Ve,
                      value: l.sePaga || "SI",
                      disabled: !ne || Le(l),
                      onChange: (B) => Z(l.id, { sePaga: B.target.value }),
                    },
                    React.createElement("option", { value: "SI" }, "SI"),
                    React.createElement("option", { value: "NO" }, "NO"),
                  ),
                ),
                React.createElement(
                  "td",
                  {
                    style: ae(it),
                    title: it
                      ? "Este Cliente no coincide con ninguno ya cargado — elegilo del desplegable o corregilo."
                      : void 0,
                  },
                  React.createElement(CascadingSelect, {
                    style: Ve,
                    value: l.cliente,
                    options: dt,
                    disabled: !ne || Le(l),
                    emptyLabel: "Elegí un cliente",
                    newLabel: "+ Crear nuevo cliente",
                    onCommit: (B, re, ot) => {
                      (it && !ot && te("cliente", l.cliente, B),
                        Z(l.id, { cliente: B, centroCosto: "", subObra: "", proveedor: "" }));
                    },
                  }),
                ),
                React.createElement(
                  "td",
                  {
                    style: ae(pt),
                    title: pt
                      ? "Este Centro de Costo no coincide con ninguno ya cargado para este Cliente — elegilo del desplegable o corregilo."
                      : void 0,
                  },
                  ce
                    ? React.createElement(
                        "select",
                        {
                          style: Ve,
                          value: l.centroCosto || "",
                          disabled: !ne || Le(l),
                          onChange: (B) => Z(l.id, { centroCosto: B.target.value, subObra: "", proveedor: "" }),
                        },
                        React.createElement("option", { value: "" }, "Elegí un rubro"),
                        RUBROS_GASTOS_INTERNOS.map((B) => React.createElement("option", { key: B, value: B }, B)),
                      )
                    : React.createElement(CascadingSelect, {
                        style: Ve,
                        value: l.centroCosto,
                        options: ge,
                        disabled: !ne || Le(l),
                        emptyLabel: "Elegí un centro de costo",
                        newLabel: "+ Crear nuevo centro de costo",
                        camposExtra: [
                          { key: "venta", label: "Venta original (opcional)" },
                          { key: "costoInicial", label: "Costo inicial (opcional)" },
                        ],
                        onCommit: (B, re, ot) => {
                          (ot ? ve(l.cliente, B, re) : pt && te("centroCosto", l.centroCosto, B),
                            Z(l.id, { centroCosto: B, subObra: "", proveedor: "" }));
                        },
                      }),
                ),
                React.createElement(
                  "td",
                  {
                    style: ae(Io),
                    title: ce
                      ? "No aplica para gastos internos."
                      : Io
                        ? "Esta Sub Obra no coincide con ninguna ya cargada en este Centro de Costo — elegila del desplegable o corregila."
                        : void 0,
                  },
                  ce
                    ? React.createElement(
                        "div",
                        {
                          style: {
                            ...Ve,
                            border: "none",
                            background: "transparent",
                            color: MUTED,
                            textAlign: "center",
                          },
                        },
                        "—",
                      )
                    : React.createElement(CascadingSelect, {
                        style: Ve,
                        value: l.subObra,
                        options: Y,
                        disabled: !ne || Le(l),
                        emptyLabel: "(ninguna)",
                        newLabel: "+ Crear nueva sub obra",
                        onCommit: (B, re, ot) => {
                          (ot && B ? P(l.cliente, l.centroCosto, B) : Io && te("subObra", l.subObra, B),
                            Z(l.id, { subObra: B, proveedor: "" }));
                        },
                      }),
                ),
                React.createElement(
                  "td",
                  {
                    style: ae(Ot),
                    title: ce
                      ? "No aplica para gastos internos: no se imputan en Costos."
                      : Ot
                        ? "Esta Imputación no coincide con ningún proveedor ya cargado ahí — elegilo del desplegable o corregilo."
                        : void 0,
                  },
                  ce
                    ? React.createElement(
                        "div",
                        {
                          style: {
                            ...Ve,
                            border: "none",
                            background: "transparent",
                            color: MUTED,
                            textAlign: "center",
                          },
                        },
                        "—",
                      )
                    : React.createElement(CascadingSelect, {
                        style: Ve,
                        value: l.proveedor,
                        options: Ue,
                        disabled: !ne || Le(l),
                        emptyLabel: "Elegí un proveedor",
                        newLabel: "+ Crear nuevo proveedor",
                        camposExtra: [
                          { key: "presupuestoOriginal", label: "Presupuesto original (opcional)" },
                          { key: "presupuestoReal", label: "Presupuesto real (opcional)" },
                        ],
                        onCommit: (B, re, ot) => {
                          (ot ? M(l.cliente, l.centroCosto, l.subObra, B, re) : Ot && te("imputacion", l.proveedor, B),
                            Z(l.id, { proveedor: B }));
                        },
                      }),
                ),
                React.createElement(
                  "td",
                  {
                    style: { ...ae(no), position: "relative" },
                    title: no
                      ? "Este Proveedor no está en la tabla de Proveedores (Actividad y Factura) — corregilo o agregalo ahí."
                      : void 0,
                  },
                  React.createElement("input", {
                    key: l.id + ":" + l.proveedorPago,
                    style: Ve,
                    list: "pagos-proveedores-datalist",
                    defaultValue: l.proveedorPago,
                    placeholder: "Elegí o escribí un proveedor",
                    disabled: !ne || Le(l),
                    onBlur: (B) => {
                      const re = B.target.value.trim().toUpperCase();
                      if (re === (l.proveedorPago || "")) return;
                      let ot = re;
                      if (re && !G[re]) {
                        const { valor: ao, corregido: Fo } = resolverConCoincidencia(re, Object.keys(G), L.proveedor);
                        if (Fo && G[ao]) (te("proveedor", re, ao), (ot = ao));
                        else {
                          const zo = normalizarTexto(re);
                          if (
                            !(zo.length < 5
                              ? true
                              : Object.keys(G).some((nn) => {
                                  const Zt = normalizarTexto(nn);
                                  return (
                                    Zt.includes(zo) ||
                                    zo.includes(Zt) ||
                                    distanciaLevenshtein(Zt, zo) <= (zo.length <= 8 ? 2 : 3)
                                  );
                                }))
                          ) {
                            at({ rowId: l.id, nombre: re, actividad: "", facturaA: false });
                            return;
                          }
                        }
                      } else no && l.proveedorPago && re && G[re] && te("proveedor", l.proveedorPago, re);
                      const Ht = G[ot] || {},
                        $t = (f || {})[ot] || {},
                        eo = Gt[ot] || {},
                        vo = (Ht.actividad || "").trim().toUpperCase(),
                        qo = (Ht.factura || "").trim().toUpperCase();
                      Z(l.id, {
                        proveedorPago: ot,
                        cuit: Ht.cuit || eo.cuit || $t.cuit || "",
                        razonSocial: Ht.razonSocial || eo.razonSocial || $t.razonSocial || "",
                        cbu: Ht.cbu || eo.cbu || $t.cbu || "",
                        mat: vo === "MAT",
                        mo: vo === "MO",
                        facturaA: qo === "A",
                      });
                    },
                  }),
                  Re &&
                    Re.rowId === l.id &&
                    React.createElement(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          zIndex: 30,
                          top: "100%",
                          left: 0,
                          background: "#fff",
                          border: "1px solid " + BORDER,
                          borderRadius: 8,
                          boxShadow: CARD_SHADOW,
                          padding: 10,
                          width: 230,
                        },
                      },
                      React.createElement(
                        "div",
                        { style: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 6 } },
                        "Nuevo proveedor: ",
                        Re.nombre,
                      ),
                      React.createElement(
                        "label",
                        { style: { fontSize: 10, color: MUTED, display: "block", marginBottom: 2 } },
                        "Actividad",
                      ),
                      React.createElement(
                        "select",
                        {
                          style: { ...Ve, width: "100%", marginBottom: 6, boxSizing: "border-box" },
                          value: Re.actividad,
                          onChange: (B) => at((re) => ({ ...re, actividad: B.target.value })),
                        },
                        React.createElement("option", { value: "" }, "(ninguna)"),
                        React.createElement("option", { value: "MAT" }, "MAT"),
                        React.createElement("option", { value: "MO" }, "MO"),
                      ),
                      React.createElement(
                        "label",
                        {
                          style: {
                            fontSize: 11,
                            color: NAVY,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 8,
                          },
                        },
                        React.createElement("input", {
                          type: "checkbox",
                          checked: !!Re.facturaA,
                          onChange: (B) => at((re) => ({ ...re, facturaA: B.target.checked })),
                        }),
                        "Factura A",
                      ),
                      React.createElement(
                        "div",
                        { style: { display: "flex", gap: 6 } },
                        React.createElement(
                          "button",
                          {
                            onClick: () => {
                              const { rowId: B, nombre: re, actividad: ot, facturaA: Ht } = Re;
                              (k([
                                ...(A || []),
                                {
                                  proveedor: re,
                                  actividad: ot,
                                  factura: Ht ? "A" : "",
                                  cuit: "",
                                  razonSocial: "",
                                  cbu: "",
                                },
                              ]),
                                Z(B, { proveedorPago: re, mat: ot === "MAT", mo: ot === "MO", facturaA: !!Ht }),
                                at(null));
                            },
                            style: { ...smallBtnPrimary, padding: "4px 10px", fontSize: 11 },
                          },
                          "Crear",
                        ),
                        React.createElement(
                          "button",
                          { onClick: () => at(null), style: { ...smallBtnGhost, padding: "4px 10px", fontSize: 11 } },
                          "Cancelar",
                        ),
                      ),
                    ),
                ),
                React.createElement(
                  "td",
                  { style: { ...Ae, textAlign: "center" } },
                  React.createElement("input", {
                    type: "checkbox",
                    checked: !!l.mo,
                    disabled: !ne || Le(l),
                    title: "MO y MAT son excluyentes: al tildar MO se destilda MAT",
                    onChange: (B) => Z(l.id, { mo: B.target.checked, mat: B.target.checked ? false : l.mat }),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: { ...Ae, textAlign: "center" } },
                  React.createElement("input", {
                    type: "checkbox",
                    checked: !!l.mat,
                    disabled: !ne || Le(l),
                    title: "MAT y MO son excluyentes: al tildar MAT se destilda MO",
                    onChange: (B) => Z(l.id, { mat: B.target.checked, mo: B.target.checked ? false : l.mo }),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement("input", {
                    style: Ve,
                    defaultValue: l.factura,
                    disabled: !ne || Le(l),
                    onBlur: (B) => {
                      B.target.value !== l.factura && Z(l.id, { factura: B.target.value });
                    },
                  }),
                ),
                React.createElement(
                  "td",
                  { style: { ...Ae, textAlign: "center" } },
                  React.createElement(XubioEstadoCelda, {
                    linea: l,
                    puedeEditar: ne,
                    onElegirCentro: (v) => Z(l.id, { centroCostoXubio: v }),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: { ...Ae, textAlign: "center" } },
                  React.createElement("input", {
                    type: "checkbox",
                    checked: !!l.facturaA,
                    disabled: !ne || Le(l),
                    title:
                      "Factura A: en Costos se imputa el Importe Bruto tal cual está cargado (sin dividir por 1.21)",
                    onChange: (B) => Z(l.id, { facturaA: B.target.checked }),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  (() => {
                    const B =
                        (Number(l.diegoLevy) || 0) +
                        (Number(l.efectivo) || 0) +
                        (Number(l.transferencia) || 0) +
                        (Number(l.echeq) || 0),
                      re = Number(l.importe) || 0,
                      ot = B > 0 && Math.round(re) !== Math.round(B);
                    return React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(MilesInput, {
                        style: {
                          ...Ve,
                          textAlign: "right",
                          ...(ot
                            ? { border: "1px solid " + RED, background: "#FBEAE7" }
                            : tn
                              ? { border: "1px solid #EEDFA8", background: "#FBF3D9" }
                              : {}),
                        },
                        title: tn
                          ? Lo >= 0
                            ? "⚠ Supera el presupuesto real: antes de este pago faltaban " +
                              fmt(Lo) +
                              " para llegar al presupuesto real (sin contar este pago)"
                            : "⚠ Supera el presupuesto real: antes de este pago ya se había superado por " +
                              fmt(Math.abs(Lo)) +
                              " (sin contar este pago)"
                          : void 0,
                        value: l.importe,
                        onChange: (Ht) => Z(l.id, { importe: Ht }),
                        disabled: !ne || Le(l),
                      }),
                      ot &&
                        React.createElement(
                          "div",
                          {
                            style: { fontSize: 10, color: RED, marginTop: 2, textAlign: "right" },
                            title:
                              "El Importe no coincide con la suma de Diego Levy + Efectivo + Transferencia + E-Cheq",
                          },
                          "Dif: ",
                          fmt(re - B),
                        ),
                    );
                  })(),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement(MilesInput, {
                    style: { ...Ve, textAlign: "right" },
                    title:
                      "Importe con IVA incluido, usado solo para calcular la Retención de Ganancias (Ret Gan Transf / Ret Gan Che)",
                    value: l.importeBruto,
                    onChange: (B) => Z(l.id, { importeBruto: B }),
                    disabled: !ne || Le(l),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement(MilesInput, {
                    style: { ...Ve, textAlign: "right" },
                    value: l.diegoLevy,
                    onChange: (B) => Z(l.id, { diegoLevy: B }),
                    disabled: !ne || Le(l),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement(MilesInput, {
                    style: { ...Ve, textAlign: "right" },
                    value: l.efectivo,
                    onChange: (B) => Z(l.id, { efectivo: B }),
                    disabled: !ne || Le(l),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement(MilesInput, {
                    style: { ...Ve, textAlign: "right" },
                    value: l.transferencia,
                    onChange: (B) => Z(l.id, { transferencia: B }),
                    disabled: !ne || Le(l),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement(MilesInput, {
                    style: { ...Ve, textAlign: "right" },
                    value: l.echeq,
                    onChange: (B) => Z(l.id, { echeq: B }),
                    disabled: !ne || Le(l),
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement("input", {
                    style: Ve,
                    defaultValue: l.observaciones,
                    disabled: !ne || Le(l),
                    onBlur: (B) => {
                      B.target.value !== l.observaciones && Z(l.id, { observaciones: B.target.value });
                    },
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement("input", {
                    key: l.id + ":" + l.proveedorPago + ":cbu",
                    style: Ve,
                    defaultValue: l.cbu,
                    disabled: !ne || Le(l),
                    onBlur: (B) => {
                      const re = B.target.value,
                        ot = l.proveedorPago || l.proveedor;
                      re !== l.cbu && (Z(l.id, { cbu: re }), F(ot, { cbu: re }), go(ot, { cbu: re }));
                    },
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement("input", {
                    key: l.id + ":" + l.proveedorPago + ":cuit",
                    style: Ve,
                    defaultValue: l.cuit,
                    placeholder: "CUIT",
                    disabled: !ne || Le(l),
                    onBlur: (B) => {
                      const re = B.target.value,
                        ot = l.proveedorPago || l.proveedor;
                      re !== l.cuit && (Z(l.id, { cuit: re }), F(ot, { cuit: re }), go(ot, { cuit: re }));
                    },
                  }),
                ),
                React.createElement(
                  "td",
                  { style: Ae },
                  React.createElement("input", {
                    key: l.id + ":" + l.proveedorPago + ":razonSocial",
                    style: Ve,
                    defaultValue: l.razonSocial,
                    placeholder: "Razón Social",
                    disabled: !ne || Le(l),
                    onBlur: (B) => {
                      const re = B.target.value,
                        ot = l.proveedorPago || l.proveedor;
                      re !== l.razonSocial &&
                        (Z(l.id, { razonSocial: re }), F(ot, { razonSocial: re }), go(ot, { razonSocial: re }));
                    },
                  }),
                ),
                ne &&
                  React.createElement(
                    "td",
                    { style: { ...Ae, textAlign: "center" } },
                    Le(l)
                      ? React.createElement(
                          "span",
                          {
                            title: "Ya imputada en Costos: solo Admin puede eliminarla",
                            style: { color: MUTED, fontSize: 11 },
                          },
                          "🔒",
                        )
                      : l.registradoEnCostos
                        ? React.createElement(
                            "button",
                            {
                              onClick: () => {
                                window.confirm(
                                  "Esta línea ya tiene un pago registrado en Costos. Al borrarla también se borra ese pago en Costos. ¿Confirmás?",
                                ) && Ye(l.id);
                              },
                              style: { border: "none", background: "none", cursor: "pointer", color: RED },
                            },
                            React.createElement(Trash2, { size: 13 }),
                          )
                        : React.createElement(
                            "button",
                            {
                              onClick: () => Ye(l.id),
                              style: { border: "none", background: "none", cursor: "pointer", color: RED },
                            },
                            React.createElement(Trash2, { size: 13 }),
                          ),
                  ),
              );
            }),
          ),
          fo.length > 0 &&
            React.createElement(
              "tfoot",
              null,
              React.createElement(
                "tr",
                { style: { background: BG, fontWeight: 700 } },
                React.createElement("td", { style: Ae, colSpan: 12 }),
                React.createElement("td", { style: { ...Ae, textAlign: "right" } }, fmt(E)),
                React.createElement("td", { style: { ...Ae, textAlign: "right" } }, fmt(de)),
                React.createElement("td", { style: { ...Ae, textAlign: "right" } }, fmt(Bt)),
                React.createElement("td", { style: { ...Ae, textAlign: "right" } }, fmt(Ft)),
                React.createElement("td", { style: { ...Ae, textAlign: "right" } }, fmt(Xe)),
                React.createElement("td", { style: Ae, colSpan: 4 }),
                ne && React.createElement("td", { style: Ae }),
              ),
              React.createElement(
                "tr",
                null,
                React.createElement("td", { style: Ae, colSpan: 13 }),
                React.createElement(
                  "td",
                  { style: { ...Ae, textAlign: "right", color: MUTED, fontSize: 12 } },
                  "TOTALES EFVO+TRA",
                ),
                React.createElement("td", { style: { ...Ae, textAlign: "right", fontWeight: 700 } }, fmt(rt)),
                React.createElement("td", { style: Ae, colSpan: ne ? 7 : 6 }),
              ),
              React.createElement(
                "tr",
                null,
                React.createElement("td", { style: Ae, colSpan: 13 }),
                React.createElement(
                  "td",
                  { style: { ...Ae, textAlign: "right", color: NAVY, fontWeight: 700, fontSize: 12.5 } },
                  "TOTALES",
                ),
                React.createElement(
                  "td",
                  { style: { ...Ae, textAlign: "right", fontWeight: 700, color: NAVY } },
                  fmt(Ct),
                ),
                React.createElement("td", { style: Ae, colSpan: ne ? 7 : 6 }),
              ),
            ),
        ),
      ),
    ),
    v.clientes.length > 0 &&
      React.createElement(
        "div",
        {
          style: {
            marginTop: 16,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            padding: "16px 18px",
            maxWidth: 640,
          },
        },
        React.createElement(
          "div",
          { style: { fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: NAVY } },
          "Resumen — Importe Final por Cliente y Centro de Costo",
        ),
        React.createElement(
          "div",
          { style: { fontSize: 11.5, color: MUTED, marginTop: 2, marginBottom: 12 } },
          'Solo pagos sin Fecha Pagado (Se Paga = SI), sin importar el filtro elegido arriba. Este mismo resumen se incluye en "Pagos Semanales".',
        ),
        React.createElement(
          "table",
          { style: { borderCollapse: "collapse", width: "100%" } },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", { style: q }, "Cliente / Centro de Costo"),
              React.createElement("th", { style: { ...q, textAlign: "right" } }, "Importe Final"),
            ),
          ),
          React.createElement(
            "tbody",
            null,
            v.clientes.map((l) =>
              React.createElement(
                React.Fragment,
                { key: l.cliente },
                React.createElement(
                  "tr",
                  { style: { background: BG } },
                  React.createElement("td", { style: { ...Ae, fontWeight: 700, color: NAVY } }, l.cliente),
                  React.createElement(
                    "td",
                    { style: { ...Ae, textAlign: "right", fontWeight: 700, color: NAVY } },
                    fmt(l.total),
                  ),
                ),
                l.centros.map((I) =>
                  React.createElement(
                    "tr",
                    { key: l.cliente + ":" + I.centro },
                    React.createElement("td", { style: { ...Ae, paddingLeft: 22, color: MUTED } }, I.centro),
                    React.createElement("td", { style: { ...Ae, textAlign: "right" } }, fmt(I.monto)),
                  ),
                ),
              ),
            ),
            React.createElement(
              "tr",
              { style: { background: "#F1E9D2", fontWeight: 700 } },
              React.createElement("td", { style: Ae }, "TOTAL GENERAL"),
              React.createElement("td", { style: { ...Ae, textAlign: "right", color: NAVY } }, fmt(v.totalGeneral)),
            ),
          ),
        ),
      ),
    vt &&
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
              maxWidth: 1080,
              height: "82%",
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
              "Proveedores — Actividad y Factura",
            ),
            React.createElement(
              "button",
              {
                onClick: () => y(false),
                style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
              },
              React.createElement(X, { size: 18 }),
            ),
          ),
          React.createElement(
            "div",
            { style: { padding: "10px 18px", fontSize: 12, color: MUTED, borderBottom: "1px solid " + BORDER } },
            'Al elegir un proveedor en la columna "Proveedor" de una línea de Pagos, MAT/MO, Factura A, CUIT, Razón Social y CBU se completan automáticamente según lo que diga esta tabla (después se pueden destildar o modificar sin problema, línea por línea).',
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "10px 18px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
                borderBottom: "1px solid " + BORDER,
              },
            },
            React.createElement("button", { onClick: Jt, style: smallBtnGhost }, "Traer proveedores nuevos de Costos"),
            React.createElement(
              "button",
              { onClick: St, style: smallBtnGhost },
              React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
              " Descargar Excel",
            ),
            React.createElement(
              "label",
              { style: smallBtnGhost },
              React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
              " Importar Excel",
              React.createElement("input", {
                type: "file",
                accept: ".xlsx,.xls,.csv",
                style: { display: "none" },
                onChange: (l) => {
                  const I = l.target.files[0];
                  (zt(I), (l.target.value = ""));
                },
              }),
            ),
            React.createElement(
              "button",
              { onClick: ut, style: smallBtnPrimary },
              React.createElement(Plus, { size: 13, style: { verticalAlign: "-2px" } }),
              " Agregar proveedor",
            ),
            ne &&
              React.createElement(
                "button",
                {
                  onClick: ht,
                  style: smallBtnGhost,
                  title:
                    "Vuelve a traer MAT/MO, Factura A, CUIT, Razón Social y CBU desde esta tabla hacia las líneas de Pagos que ya tienen un Proveedor elegido (por si se corrigió algo acá después). No toca líneas ya imputadas en Costos.",
                },
                "Actualizar líneas de Pagos ya cargadas",
              ),
          ),
          React.createElement(
            "div",
            { style: { flex: 1, overflowY: "auto", padding: "0 18px 18px" } },
            React.createElement(
              "table",
              { style: { borderCollapse: "collapse", width: "100%", marginTop: 10 } },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  React.createElement("th", { style: q }, "Proveedor"),
                  React.createElement("th", { style: q }, "Actividad"),
                  React.createElement("th", { style: q }, "Factura"),
                  React.createElement("th", { style: q }, "CUIT"),
                  React.createElement("th", { style: q }, "Razón Social"),
                  React.createElement("th", { style: q }, "CBU"),
                  React.createElement("th", { style: q }),
                ),
              ),
              React.createElement(
                "tbody",
                null,
                (A || []).length === 0 &&
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { colSpan: 7, style: { ...Ae, textAlign: "center", color: MUTED, padding: "18px 8px" } },
                      'Todavía no hay proveedores cargados acá. Usá "Traer proveedores nuevos de Costos", "Importar Excel" o "Agregar proveedor".',
                    ),
                  ),
                (A || []).map((l, I) =>
                  React.createElement(
                    "tr",
                    { key: I },
                    React.createElement(
                      "td",
                      { style: Ae },
                      React.createElement("input", {
                        style: Ve,
                        value: l.proveedor || "",
                        onChange: (U) => At(I, { proveedor: U.target.value.toUpperCase() }),
                      }),
                    ),
                    React.createElement(
                      "td",
                      { style: Ae },
                      React.createElement(
                        "select",
                        { style: Ve, value: l.actividad || "", onChange: (U) => At(I, { actividad: U.target.value }) },
                        React.createElement("option", { value: "" }, "—"),
                        React.createElement("option", { value: "MAT" }, "MAT"),
                        React.createElement("option", { value: "MO" }, "MO"),
                      ),
                    ),
                    React.createElement(
                      "td",
                      { style: Ae },
                      React.createElement(
                        "select",
                        { style: Ve, value: l.factura || "", onChange: (U) => At(I, { factura: U.target.value }) },
                        React.createElement("option", { value: "" }, "—"),
                        React.createElement("option", { value: "A" }, "A"),
                      ),
                    ),
                    React.createElement(
                      "td",
                      { style: Ae },
                      React.createElement("input", {
                        style: Ve,
                        value: l.cuit || "",
                        placeholder: "CUIT",
                        onChange: (U) => At(I, { cuit: U.target.value }),
                      }),
                    ),
                    React.createElement(
                      "td",
                      { style: Ae },
                      React.createElement("input", {
                        style: Ve,
                        value: l.razonSocial || "",
                        placeholder: "Razón Social",
                        onChange: (U) => At(I, { razonSocial: U.target.value }),
                      }),
                    ),
                    React.createElement(
                      "td",
                      { style: Ae },
                      React.createElement("input", {
                        style: Ve,
                        value: l.cbu || "",
                        placeholder: "CBU",
                        onChange: (U) => At(I, { cbu: U.target.value }),
                      }),
                    ),
                    React.createElement(
                      "td",
                      { style: { ...Ae, textAlign: "center" } },
                      React.createElement(
                        "button",
                        {
                          onClick: () => No(I),
                          style: { border: "none", background: "none", cursor: "pointer", color: RED },
                        },
                        React.createElement(Trash2, { size: 13 }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
  );
}
