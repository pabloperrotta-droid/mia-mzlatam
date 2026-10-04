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
  // Sección 97: facturas en PDF (botón "Facturas PDF", arrastrar sobre la tabla, o "+PDF" en cada línea).
  const fcSt = useFcPdfs(),
    [fcProg, setFcProg] = useState(""),
    [fcRes, setFcRes] = useState(null),
    [fcArrastre, setFcArrastre] = useState(false),
    [fcRev, setFcRev] = useState(null),
    [fcCrear, setFcCrear] = useState(null),
    [cierre, setCierre] = useState(null);
  useEffect(() => {
    ne && fcPdfLimpiarHuerfanos(n);
  }, [fcSt.cargado, n.length]);
  // La tabla de Proveedores se completa sola (solo lo vacío) con lo cargado en Pagos.
  useEffect(() => {
    if (!ne) return;
    const t = aprenderProveedores(A, n);
    t && k(t);
  }, [n, A]);
  function fcDisponibles(cc) {
    if (!cc || !cc.centroCosto) return [];
    const qo = obraKey(cc.cliente, cc.centroCosto),
      ao = p[qo] || [],
      nn = cc.subObra ? ao.findIndex((x) => normalizarTexto(x.nombre) === normalizarTexto(cc.subObra)) : -1,
      Zt = nn >= 0 ? subCostoKey(qo, ao[nn].id) : null;
    return (Zt ? g[Zt] || [] : c[qo] || []).map((x) => x.proveedor);
  }
  function fcDatosProveedor(prov) {
    const reg = G[prov] || {},
      info = (f || {})[prov] || {},
      hist = Gt[prov] || {},
      act = (reg.actividad || "").trim().toUpperCase();
    return {
      razonSocial: reg.razonSocial || hist.razonSocial || info.razonSocial || "",
      cbu: reg.cbu || hist.cbu || info.cbu || "",
      mat: act === "MAT",
      mo: act === "MO",
      facturaA: (reg.factura || "").trim().toUpperCase() === "A",
    };
  }
  // Alta (o actualización si ya existe con ese nombre) en la tabla de Proveedores.
  function crearProveedorTabla(np) {
    const fila = {
        proveedor: np.nombre,
        actividad: np.actividad || "",
        factura: np.facturaA ? "A" : "",
        cuit: np.cuit || "",
        razonSocial: np.razonSocial || "",
        cbu: np.cbu || "",
        imputacion: np.imputacion || "",
      },
      lista = [...(A || [])],
      i = lista.findIndex((x) => (x.proveedor || "").trim().toUpperCase() === np.nombre);
    i >= 0 ? (lista[i] = { ...lista[i], ...Object.fromEntries(Object.entries(fila).filter(([, x]) => x)) }) : lista.push(fila);
    k(lista);
  }
  // Facturas iguales (mismo CUIT o mismo proveedor + mismo número) en otras líneas de Pagos.
  const fcIndice = useMemo(() => {
    const m = {};
    n.forEach((l) => {
      const num = fcClaveNumero(l.factura);
      if (!num) return;
      const c = fcSoloDigitos(l.cuit),
        pr = (l.proveedorPago || "").trim().toUpperCase();
      c && (m["C" + c + "|" + num] = [...(m["C" + c + "|" + num] || []), l]);
      pr && (m["P" + pr + "|" + num] = [...(m["P" + pr + "|" + num] || []), l]);
    });
    return m;
  }, [n]);
  function facturasIguales(l, factura) {
    const num = fcClaveNumero(factura);
    if (!num) return [];
    const c = fcSoloDigitos(l.cuit),
      pr = (l.proveedorPago || "").trim().toUpperCase(),
      todas = [...((c && fcIndice["C" + c + "|" + num]) || []), ...((pr && fcIndice["P" + pr + "|" + num]) || [])];
    return todas.filter((x, i) => x.id !== l.id && todas.indexOf(x) === i && !(l.parteFactura && x.parteFactura));
  }
  function textoFacturaRepetida(otras) {
    return otras
      .map(
        (x) =>
          (x.proveedorPago || x.razonSocial || "") +
          " " +
          (x.factura || "") +
          (x.fechaPagado ? " — PAGADA el " + x.fechaPagado : " — sin pagar todavía") +
          (x.centroCosto ? " (" + (x.subObra || x.centroCosto) + ")" : ""),
      )
      .join("\n");
  }
  // Imputación de una factura: 1) la escrita en el nombre del archivo; 2) la de la tabla de Proveedores;
  // 3) el mismo proveedor de la factura.
  function fcImputacion(prov, cc, archivo, razonSocial) {
    const disp = fcDisponibles(cc),
      deArchivo = archivo && (cc.cliente || "").trim().toUpperCase() !== CLIENTE_GASTOS_INTERNOS ? imputacionDesdeNombreArchivo(archivo, prov, disp, V, cc, razonSocial) : "";
    if (deArchivo) return { valor: deArchivo, deArchivo: true };
    if (!prov || !cc || !cc.centroCosto || (cc.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS) return { valor: "", deArchivo: false };
    const base = String((G[prov] || {}).imputacion || "").trim() || prov;
    return { valor: disp.find((x) => normalizarTexto(x) === normalizarTexto(base)) || base.toUpperCase(), deArchivo: false };
  }
  // Paso 1: leer los PDF y armar la ventana de revisión (todavía no se crea nada).
  async function importarFacturasPdf(lista) {
    const archivos = Array.from(lista || []).filter((x) => /\.pdf$/i.test(x.name || "") || x.type === "application/pdf");
    if (!archivos.length) {
      window.alert("Elegí archivos PDF de facturas.");
      return;
    }
    const filas = [],
      usadas = new Set();
    for (let i = 0; i < archivos.length; i++) {
      const file = archivos[i],
        archivo = file.name || "factura.pdf";
      setFcProg("Leyendo " + (i + 1) + " de " + archivos.length + "…");
      let fc;
      try {
        fc = await leerFacturaPdf(file);
      } catch (e) {
        fc = armarFactura(null, {}, facturaDesdeNombreArchivo(archivo));
      }
      const prov = proveedorPorCuit(fc.cuit, A, f, n) || proveedorPorRazonSocial(fc.razonSocial, A),
        dp = prov ? fcDatosProveedor(prov) : {},
        fila = { key: "f" + i + "-" + Date.now(), archivo, file, fc, incluir: true, formaPago: "", avisos: [] },
        repetida = filas.find(
          (x) => fc.cuit && fc.factura && fcSoloDigitos(x.fc.cuit) === fc.cuit && fcClaveNumero(x.fc.factura) === fcClaveNumero(fc.factura),
        );
      if (repetida) {
        filas.push({ ...fila, modo: "repetida", incluir: false, avisos: ["Es la misma factura que " + repetida.archivo + ": no se carga dos veces"] });
        continue;
      }
      if (fc.notaCredito) {
        filas.push({ ...fila, modo: "nc", prov, destino: "" });
        continue;
      }
      const m = lineaParaFactura(fc, n.filter((l) => !usadas.has(l.id)), prov, (id) => !!fcSt.metas[id]);
      if (m) {
        usadas.add(m.linea.id);
        const { cambios, avisos } = completarLineaConFactura(m.linea, fc, dp.razonSocial);
        m.como === "misma" &&
          m.linea.fechaPagado &&
          avisos.unshift("Esta factura YA ESTÁ PAGADA (" + m.linea.fechaPagado + "). Solo se le adjunta el PDF.");
        filas.push({ ...fila, modo: m.como, lineaId: m.linea.id, existente: m.linea, cambios, avisos });
        continue;
      }
      const partes = fcPartesArchivo(archivo),
        brutosPartes = partes.length >= 2 ? repartirFactura(fc, partes.length) : null,
        totalFc = fc.notaCredito ? -Math.abs(fc.total) : fc.total,
        // IVA y percepciones se reparten en proporción al bruto de cada parte (definición del usuario).
        finalesPartes = brutosPartes ? finalesProporcionales(totalFc, brutosPartes) : null;
      (partes.length >= 2 ? partes : [null]).forEach((parte, ip) => {
      const nombreParte = parte || archivo,
        cc = centroDesdeNombreArchivo(nombreParte, d, p, rubrosInt),
        imp = fcImputacion(prov, cc, nombreParte, fc.razonSocial),
        total = parte ? (finalesPartes ? finalesPartes[ip] : 0) : totalFc,
        neto = parte ? (brutosPartes ? brutosPartes[ip] * (fc.notaCredito ? -1 : 1) : 0) : fc.notaCredito ? -Math.abs(fc.neto || 0) : fc.neto || 0,
        fila2 = parte ? { ...fila, key: fila.key + "-p" + ip, avisos: [] } : fila;
      parte &&
        fila2.avisos.push(
          "Parte " + (ip + 1) + " de " + partes.length + " de la factura (" + fmt(Math.abs(totalFc)) + ")" +
            (brutosPartes ? "" : ": no se encontraron los importes de cada renglón, completalos"),
        );
      cc.ambiguo && fila2.avisos.push("El nombre del archivo coincide con más de un centro de costo: elegilo");
      !(fc.cuit && fc.factura && fc.total) && fila2.avisos.push("No se pudieron leer todos los datos del PDF: completalos");
      fc.total && !fc.neto && fila2.avisos.push("No se encontró el importe sin IVA (Importe Bruto): completalo");
      fc.notaCredito && fila2.avisos.push("Nota de crédito: entra en negativo");
      filas.push({
        ...fila2,
        modo: "nueva",
        impDeArchivo: imp.deArchivo,
        linea: {
          // "NO" suelto en el nombre del archivo = no se paga (ej. "… NO hernan caminos interno.pdf").
          sePaga: fcPalabrasArchivo(archivo).includes("NO") ? "NO" : "SI",
          cliente: cc.cliente,
          centroCosto: cc.centroCosto,
          subObra: cc.subObra,
          proveedor: imp.valor,
          proveedorPago: prov,
          factura: fc.factura,
          cuit: fc.cuit || "",
          razonSocial: dp.razonSocial || fc.razonSocial || "",
          cbu: dp.cbu || "",
          mat: !!dp.mat,
          mo: !!dp.mo,
          facturaA: fc.letra ? fc.letra === "A" : !!dp.facturaA,
          importe: total || 0,
          importeBruto: neto || 0,
          observaciones: [fc.notaCredito ? "Nota de crédito" : "", parte ? "Factura repartida " + (ip + 1) + "/" + partes.length : ""].filter(Boolean).join(" · "),
          ...(parte ? { parteFactura: ip + 1 + "/" + partes.length } : {}),
        },
      });
      // Forma de pago: la misma que la última vez a ese proveedor (con esa imputación, si la hay).
      const recien = filas[filas.length - 1],
        fp = formaPagoAprendida(n, recien.linea.proveedorPago, recien.linea.proveedor);
      fp && Object.assign(recien, { formaPago: fp.formaPago, mix: fp.mix || undefined, formaAprendida: true });
      });
    }
    // Notas de crédito: por defecto se descuentan de la factura de ese proveedor de esta misma carga, o de
    // la única línea sin pagar que tenga.
    filas.forEach((x) => {
      if (x.modo !== "nc") return;
      const cands = fcCandidatasNc(x, filas),
        enCarga = cands.filter((c) => c.key.startsWith("nueva:"));
      x.destino = enCarga.length ? enCarga[0].key : cands.length === 1 ? cands[0].key : "";
      cands.length || ((x.incluir = false), x.avisos.push("No hay ninguna factura de ese proveedor sin pagar para descontarla"));
    });
    setFcProg("");
    setFcRev(filas);
  }
  // Facturas de las que se puede descontar una nota de crédito: las de esta carga y las líneas sin pagar
  // del mismo proveedor (por CUIT o por nombre).
  function fcCandidatasNc(x, filas) {
    const c = fcSoloDigitos(x.fc.cuit),
      pr = (x.prov || "").trim().toUpperCase(),
      igual = (cuit, pp) => (c && fcSoloDigitos(cuit) === c) || (pr && (pp || "").trim().toUpperCase() === pr),
      desc = (l) => [l.proveedorPago || l.razonSocial, l.factura || "(sin número)", l.subObra || l.centroCosto, l.importe ? fmt(l.importe) : ""].filter(Boolean).join(" · ");
    return [
      ...(filas || [])
        .filter((y) => y.modo === "nueva" && y.incluir && igual(y.linea.cuit, y.linea.proveedorPago))
        .map((y) => ({ key: "nueva:" + y.key, texto: desc(y.linea) + " (en esta carga)" })),
      ...n.filter((l) => !l.fechaPagado && igual(l.cuit, l.proveedorPago)).map((l) => ({ key: "linea:" + l.id, texto: desc(l) })),
    ];
  }
  function fcCambiarFila(key, fn) {
    setFcRev((xs) => (xs || []).map((x) => (x.key === key ? fn(x) : x)));
  }
  function fcCambiarLinea(fila, cambios) {
    fcCambiarFila(fila.key, (x) => {
      const l = { ...x.linea, ...cambios },
        nx = { ...x, linea: l };
      if ("proveedorPago" in cambios) {
        const dp = cambios.proveedorPago ? fcDatosProveedor(cambios.proveedorPago) : {};
        dp.razonSocial && (l.razonSocial = dp.razonSocial);
        dp.cbu && (l.cbu = dp.cbu);
        l.mat = !!dp.mat;
        l.mo = !!dp.mo;
      }
      if (!x.impDeArchivo && ("proveedorPago" in cambios || "centroCosto" in cambios || "subObra" in cambios || "cliente" in cambios))
        l.proveedor = fcImputacion(l.proveedorPago, l, "").valor;
      "proveedor" in cambios && (nx.impDeArchivo = true);
      if (!x.formaManual && ("proveedorPago" in cambios || "proveedor" in cambios || "cliente" in cambios || "centroCosto" in cambios || "subObra" in cambios)) {
        const fp = formaPagoAprendida(n, l.proveedorPago, l.proveedor);
        fp ? Object.assign(nx, { formaPago: fp.formaPago, mix: fp.mix || undefined, formaAprendida: true }) : x.formaAprendida && Object.assign(nx, { formaPago: "", mix: undefined, formaAprendida: false });
      }
      return nx;
    });
  }
  // Paso 2: cargar lo revisado.
  async function confirmarFacturasPdf() {
    const filas = (fcRev || []).filter((x) => x.incluir && x.modo !== "repetida"),
      nuevas = [],
      subir = [],
      base = Date.now().toString(36);
    const porFila = {},
      cambiosNc = {},
      cuentaNc = {};
    filas.forEach((x, i) => {
      if (x.modo === "nueva") {
        const id = base + "-fc" + i + "-" + Math.random().toString(36).slice(2, 8),
          l = { id, ...x.linea };
        porFila[x.key] = l;
        nuevas.push([l, x]);
        subir.push([id, x]);
      }
    });
    // Facturas que completan una línea que ya estaba (o solo le suman el PDF).
    const completadas = {};
    filas.forEach((x) => {
      if (x.modo !== "misma" && x.modo !== "completa") return;
      Object.keys(x.cambios || {}).length && (Z(x.lineaId, x.cambios), (completadas[x.lineaId] = x.cambios));
      subir.push([x.lineaId, x]);
    });
    filas.forEach((x) => {
      if (x.modo !== "nc" || !x.destino) return;
      const monto = Math.abs(Number(x.fc.total) || 0),
        nota = "Tiene NC " + (x.fc.factura || "") + " por " + fmt(monto);
      let id;
      if (x.destino.startsWith("nueva:")) {
        const l = porFila[x.destino.slice(6)];
        if (!l) return;
        l.importe = (Number(l.importe) || 0) - monto;
        l.observaciones = [l.observaciones, nota].filter(Boolean).join(" · ");
        id = l.id;
      } else {
        id = x.destino.slice(6);
        const l = n.find((y) => y.id === id);
        if (!l) return;
        const base = { ...l, ...(completadas[id] || {}) },
          c = cambiosNc[id] || { importe: Number(base.importe) || 0, observaciones: base.observaciones || "" };
        c.importe -= monto;
        c.observaciones = [c.observaciones, nota].filter(Boolean).join(" · ");
        cambiosNc[id] = c;
      }
      cuentaNc[id] = (cuentaNc[id] || 0) + 1;
      subir.push([id + "__nc" + cuentaNc[id] + "-" + Date.now().toString(36), x]);
    });
    Object.entries(cambiosNc).forEach(([id, c]) => Z(id, c));
    nuevas.forEach(([l, x]) =>
      x.formaPago === "mixto"
        ? Object.assign(l, fcMontosMixto(l.importe, x.mix))
        : x.formaPago && (l[x.formaPago] = Number(l.importe) || 0),
    );
    nuevas.length && ye(nuevas.map(([l]) => l));
    // Tipo de factura leído del PDF → corrige "Factura A" en la tabla de Proveedores.
    const tipos = {};
    filas.forEach((x) => {
      const pr = ((x.linea && x.linea.proveedorPago) || (x.existente && x.existente.proveedorPago) || x.prov || "").trim().toUpperCase();
      pr && x.fc && x.fc.letra && x.modo !== "nc" && (tipos[pr] = x.fc.letra);
    });
    const tablaCorregida = corregirTipoFacturaProveedores(A, tipos);
    tablaCorregida && k(tablaCorregida);
    setFcRev(null);
    const res = [];
    for (let i = 0; i < subir.length; i++) {
      const [id, x] = subir[i];
      setFcProg("Guardando PDF " + (i + 1) + " de " + subir.length + "…");
      try {
        await fcPdfGuardar(id, x.file, x.fc);
        res.push({
          archivo: x.archivo,
          tipo: "ok",
          texto: x.modo === "nueva" ? "Línea nueva cargada" : x.modo === "nc" ? "Nota de crédito descontada del Importe Final de la factura" : "PDF adjuntado a la línea que ya estaba",
        });
      } catch (e) {
        res.push({ archivo: x.archivo, tipo: "falta", texto: "No se pudo guardar el PDF: " + ((e && e.message) || e) });
      }
    }
    setFcProg("");
    setFcRes(res);
  }
  const FORMAS_PAGO = [
    ["", "—"],
    ["efectivo", "Efectivo"],
    ["transferencia", "Transferencia"],
    ["echeq", "E-Cheq"],
    ["diegoLevy", "Diego Levy"],
    ["mixto", "Mixto"],
  ];
  const FORMAS_MIXTO = FORMAS_PAGO.slice(1, 5);
  // Mismo orden de columnas que una línea de Pagos: Se paga, Cliente, Centro de costo, Sub obra,
  // Imputación, Proveedor, Factura, Importe Final, Importe Bruto, Forma de pago.
  // Mixto: porcentajes por forma de pago → importes sobre el Importe Final (redondeados a centavos; la
  // última forma con porcentaje se lleva la diferencia de redondeo si suman 100 %).
  function fcMontosMixto(importe, mix) {
    const total = Number(importe) || 0,
      r = {},
      con = FORMAS_MIXTO.filter(([k]) => Number((mix || {})[k]) > 0).map(([k]) => k),
      pct = con.reduce((a, k) => a + Number(mix[k]), 0);
    FORMAS_MIXTO.forEach(([k]) => (r[k] = Math.round(total * (Number((mix || {})[k]) || 0)) / 100));
    if (con.length && Math.abs(pct - 100) < 0.01) {
      const ultimo = con[con.length - 1];
      r[ultimo] = Math.round((total - con.slice(0, -1).reduce((a, k) => a + r[k], 0)) * 100) / 100;
    }
    return r;
  }
  const fcOrdenColumnas = (xs) => [0, 1, 11, 4, 5, 6, 7, 2, 3, 8, 9, 10].map((i) => xs[i]);
  function fcVerPdf(file) {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 120000);
  }
  function renderRevisionFacturas() {
    const filas = fcRev || [],
      provs = Object.keys(G).sort(),
      cargables = filas.filter((x) => x.incluir && x.modo !== "repetida" && (x.modo !== "nc" || x.destino)),
      celda = { padding: "5px 6px", borderBottom: "1px solid #EEE", verticalAlign: "top", fontSize: 12 },
      th = { ...celda, fontSize: 10.5, color: MUTED, fontWeight: 700, textTransform: "uppercase", background: "#FAFAF7", position: "sticky", top: 0, zIndex: 2, textAlign: "left", whiteSpace: "nowrap" },
      inp = { fontSize: 12, padding: "3px 5px", border: "1px solid #D0D0D0", borderRadius: 4, background: "#fff", color: TEXT, boxSizing: "border-box" },
      mal = (b) => (b ? { borderColor: RED, background: "#FBEAE7" } : {}),
      sel = (valor, opciones, onCambio, malo, ancho, vacio) =>
        React.createElement(
          "select",
          { value: valor || "", onChange: (e) => onCambio(e.target.value), style: { ...inp, width: ancho, ...mal(malo) } },
          React.createElement("option", { value: "" }, vacio || "—"),
          valor && !opciones.includes(valor) && React.createElement("option", { value: valor }, valor + " (no existe)"),
          opciones.map((o) => React.createElement("option", { key: o, value: o }, o)),
        );
    return React.createElement(
      "div",
      { style: { position: "fixed", inset: 0, background: "rgba(20,20,20,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70 } },
      React.createElement(
        "div",
        { style: { background: "#fff", borderRadius: 12, width: "97%", maxWidth: 1600, height: "88%", display: "flex", flexDirection: "column", overflow: "hidden" } },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid " + BORDER } },
          React.createElement("div", { style: { fontWeight: 700, color: NAVY, fontSize: 14 } }, "Revisar facturas antes de cargarlas (" + filas.length + ")"),
          React.createElement(
            "button",
            { onClick: () => setFcRev(null), style: { border: "none", background: "none", cursor: "pointer", color: MUTED }, title: "Cancelar: no se carga nada" },
            React.createElement(X, { size: 18 }),
          ),
        ),
        React.createElement(
          "div",
          { style: { padding: "8px 18px", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid " + BORDER, fontSize: 12, color: MUTED } },
          "Lo marcado en rojo hay que completarlo o corregirlo (igual se puede cargar y corregir después en Pagos). En los importes podés escribir cuentas, ej. =13.000/2.",
          React.createElement(
            "label",
            { style: { display: "flex", gap: 6, alignItems: "center", color: NAVY, fontWeight: 600 } },
            "Forma de pago para todas:",
            React.createElement(
              "select",
              {
                value: "",
                onChange: (e) => {
                  const v = e.target.value;
                  setFcRev((xs) => xs.map((x) => (x.modo === "nueva" ? { ...x, formaPago: v === "-" ? "" : v, formaManual: true, formaAprendida: false } : x)));
                },
                style: inp,
              },
              React.createElement("option", { value: "" }, "Elegir…"),
              FORMAS_MIXTO.map(([k, t]) => React.createElement("option", { key: k, value: k }, t)),
              React.createElement("option", { value: "-" }, "(sin definir)"),
            ),
          ),
        ),
        React.createElement(
          "div",
          { style: { flex: 1, overflow: "auto" } },
          React.createElement(
            "table",
            { style: { borderCollapse: "collapse", width: "100%", minWidth: 1500 } },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                fcOrdenColumnas(["", "Archivo", "Proveedor", "Factura", "Cliente", "Centro de costo", "Sub obra", "Imputación", "Importe Final", "Importe Bruto", "Forma de pago", "Se paga"]).map((t, i) =>
                  React.createElement("th", { key: i, style: th }, t),
                ),
              ),
            ),
            React.createElement(
              "tbody",
              null,
              filas.map((x) => {
                const l = x.linea || {},
                  apagada = !x.incluir,
                  check = React.createElement("input", {
                    type: "checkbox",
                    checked: !!x.incluir,
                    disabled: x.modo === "repetida",
                    title: "Cargar esta factura",
                    onChange: (e) => fcCambiarFila(x.key, (y) => ({ ...y, incluir: e.target.checked })),
                  }),
                  archivo = React.createElement(
                    "div",
                    { style: { maxWidth: 210 } },
                    React.createElement(
                      "button",
                      { onClick: () => fcVerPdf(x.file), title: "Ver el PDF", style: { border: "none", background: "none", cursor: "pointer", padding: 0, marginRight: 4 } },
                      "👁",
                    ),
                    React.createElement("span", { style: { fontSize: 11, color: MUTED, wordBreak: "break-all" } }, x.archivo),
                    x.avisos.map((a, i) =>
                      React.createElement("div", { key: i, style: { color: /PAGADA/.test(a) ? RED : "#9A6700", fontSize: 11, fontWeight: /PAGADA/.test(a) ? 700 : 400, marginTop: 2 } }, "⚠️ " + a),
                    ),
                  );
                if (x.modo === "nc") {
                  const cands = fcCandidatasNc(x, filas),
                    monto = Math.abs(Number(x.fc.total) || 0);
                  return React.createElement(
                    "tr",
                    { key: x.key, style: { opacity: apagada ? 0.45 : 1, background: "#EEF4FB" } },
                    React.createElement("td", { style: celda }, check),
                    React.createElement("td", { style: celda }, archivo),
                    React.createElement(
                      "td",
                      { style: { ...celda, color: NAVY }, colSpan: 10 },
                      React.createElement(
                        "strong",
                        null,
                        "Nota de crédito " + (x.fc.factura || "") + " por " + fmt(monto) + " — " + (x.prov || x.fc.razonSocial || x.fc.cuit || "proveedor ?") + ". ",
                      ),
                      cands.length
                        ? React.createElement(
                            React.Fragment,
                            null,
                            "Descontarla del Importe Final de: ",
                            React.createElement(
                              "select",
                              {
                                value: x.destino || "",
                                onChange: (e) => fcCambiarFila(x.key, (y) => ({ ...y, destino: e.target.value })),
                                style: { ...inp, maxWidth: 520, ...mal(x.incluir && !x.destino) },
                              },
                              React.createElement("option", { value: "" }, "Elegí la factura…"),
                              cands.map((c) => React.createElement("option", { key: c.key, value: c.key }, c.texto)),
                            ),
                            React.createElement("div", { style: { fontSize: 11, color: MUTED, marginTop: 3 } }, 'En Observaciones queda "Tiene NC ' + (x.fc.factura || "") + " por " + fmt(monto) + '". El Importe Bruto no cambia.'),
                          )
                        : "No hay ninguna factura de ese proveedor sin pagar: cargá primero la factura (o descontala a mano).",
                    ),
                  );
                }
                if (x.modo !== "nueva") {
                  const e = x.existente || {},
                    desc =
                      x.modo === "repetida"
                        ? "No se carga"
                        : (x.modo === "misma" ? "Esa factura ya está cargada en Pagos: se le adjunta el PDF" : "Completa la línea que ya tenías cargada") +
                          " — " +
                          [e.proveedorPago, e.factura || "(sin número)", e.subObra || e.centroCosto, e.importe ? fmt(e.importe) : "", e.fechaPagado ? "pagada " + e.fechaPagado : ""].filter(Boolean).join(" · ") +
                          (Object.keys(x.cambios || {}).length ? ". Se completa: " + Object.keys(x.cambios).join(", ") : "");
                  return React.createElement(
                    "tr",
                    { key: x.key, style: { opacity: apagada ? 0.45 : 1, background: "#F7F5EE" } },
                    React.createElement("td", { style: celda }, check),
                    React.createElement("td", { style: celda }, archivo),
                    React.createElement("td", { style: { ...celda, color: NAVY }, colSpan: 10 }, desc),
                  );
                }
                const cc = { cliente: l.cliente, centroCosto: l.centroCosto, subObra: l.subObra },
                  interno = (l.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS,
                  centros = interno
                    ? rubrosInt
                    : l.cliente
                      ? Array.from(new Set(d.filter((o) => o.cliente === l.cliente).map((o) => o.obra))).sort()
                      : [],
                  subs = (p[obraKey(l.cliente, l.centroCosto)] || []).map((o) => o.nombre),
                  disp = fcDisponibles(cc),
                  provOk = !!G[(l.proveedorPago || "").trim().toUpperCase()],
                  impOk = interno || (!!l.proveedor && disp.some((o) => normalizarTexto(o) === normalizarTexto(l.proveedor))),
                  mix = x.mix || {},
                  pctTotal = FORMAS_MIXTO.reduce((a, [k]) => a + (Number(mix[k]) || 0), 0),
                  montosMix = fcMontosMixto(l.importe, mix),
                  listaProv = "fc-prov-" + x.key;
                return React.createElement(
                  "tr",
                  { key: x.key, style: { opacity: apagada ? 0.45 : 1 } },
                  ...fcOrdenColumnas([
                  React.createElement("td", { style: celda }, check),
                  React.createElement("td", { style: celda }, archivo),
                  React.createElement(
                    "td",
                    { style: { ...celda, position: "relative" } },
                    React.createElement("input", {
                      list: listaProv,
                      value: l.proveedorPago || "",
                      placeholder: "Elegí o creá",
                      onChange: (e) => fcCambiarLinea(x, { proveedorPago: e.target.value.toUpperCase() }),
                      style: { ...inp, width: 150, ...mal(!provOk) },
                      title: provOk ? l.razonSocial || "" : "No está en la tabla de Proveedores: elegí uno o crealo",
                    }),
                    React.createElement("datalist", { id: listaProv }, provs.map((o) => React.createElement("option", { key: o, value: o }))),
                    !provOk &&
                      React.createElement(
                        "button",
                        {
                          onClick: () => setFcCrear(fcCrear === x.key ? null : x.key),
                          style: { display: "block", marginTop: 3, border: "none", background: "none", color: "#0969DA", cursor: "pointer", fontSize: 11, padding: 0 },
                        },
                        "+ Crear proveedor",
                      ),
                    React.createElement("div", { style: { fontSize: 10.5, color: MUTED, marginTop: 2 } }, [l.razonSocial, l.cuit].filter(Boolean).join(" · ")),
                    fcCrear === x.key &&
                      React.createElement(
                        "div",
                        { style: { position: "absolute", zIndex: 5, top: "100%", left: 0, background: "#fff", border: "1px solid " + BORDER, borderRadius: 8, boxShadow: CARD_SHADOW, padding: 10 } },
                        React.createElement(NuevoProveedorForm, {
                          tabla: A,
                          onUsarExistente: (nombre) => {
                            setFcCrear(null);
                            fcCambiarLinea(x, { proveedorPago: nombre });
                          },
                          inicial: { nombre: "", cuit: l.cuit || "", razonSocial: l.razonSocial || x.fc.razonSocial || "", facturaA: x.fc.letra ? x.fc.letra === "A" : !!l.facturaA, cbu: l.cbu || "" },
                          imputaciones: V,
                          onCrear: (np) => {
                            crearProveedorTabla(np);
                            setFcCrear(null);
                            fcCambiarFila(x.key, (y) => {
                              const ln = {
                                ...y.linea,
                                proveedorPago: np.nombre,
                                mat: np.actividad === "MAT",
                                mo: np.actividad === "MO",
                                facturaA: !!np.facturaA,
                                cuit: np.cuit || y.linea.cuit,
                                razonSocial: np.razonSocial || y.linea.razonSocial,
                                cbu: np.cbu || y.linea.cbu,
                              };
                              if (!y.impDeArchivo && ln.centroCosto) {
                                const base = np.imputacion || np.nombre,
                                  dd = fcDisponibles(ln);
                                ln.proveedor = dd.find((o) => normalizarTexto(o) === normalizarTexto(base)) || base;
                              }
                              return { ...y, linea: ln };
                            });
                          },
                          onCancelar: () => setFcCrear(null),
                        }),
                      ),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    React.createElement("input", {
                      value: l.factura || "",
                      onChange: (e) => fcCambiarLinea(x, { factura: e.target.value }),
                      style: { ...inp, width: 125, ...mal(!l.factura) },
                    }),
                    (() => {
                      const otras = facturasIguales({ ...l, id: "" }, l.factura);
                      return otras.length
                        ? React.createElement(
                            "div",
                            { style: { color: RED, fontSize: 11, fontWeight: 700, marginTop: 2 }, title: textoFacturaRepetida(otras) },
                            "⚠️ Ya está en Pagos" + (otras.some((o) => o.fechaPagado) ? " (PAGADA)" : ""),
                          )
                        : null;
                    })(),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    sel(l.cliente, dt, (v) => fcCambiarLinea(x, { cliente: v, centroCosto: "", subObra: "" }), !dt.includes(l.cliente), 130, "Elegí cliente"),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    interno
                      ? React.createElement(
                          "div",
                          { style: { width: 150, ...(centros.includes(l.centroCosto) ? {} : { outline: "2px solid " + RED, borderRadius: 4 }) } },
                          React.createElement(CascadingSelect, {
                            style: { ...inp, width: "100%" },
                            value: l.centroCosto,
                            options: centros,
                            emptyLabel: "Elegí un rubro",
                            newLabel: "+ Crear nuevo rubro",
                            onCommit: (v) => fcCambiarLinea(x, { centroCosto: String(v || "").trim().toUpperCase(), subObra: "" }),
                          }),
                        )
                      : sel(l.centroCosto, centros, (v) => fcCambiarLinea(x, { centroCosto: v, subObra: "" }), !centros.includes(l.centroCosto), 150, "Elegí centro"),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    !interno && (subs.length || l.subObra)
                      ? sel(l.subObra, subs, (v) => fcCambiarLinea(x, { subObra: v }), !!l.subObra && !subs.includes(l.subObra), 140, "(ninguna)")
                      : React.createElement("span", { style: { color: MUTED } }, "—"),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    interno
                      ? React.createElement("span", { style: { color: MUTED } }, "— (gasto interno)")
                      : !l.centroCosto
                        ? React.createElement("span", { style: { color: MUTED, fontSize: 11 } }, "Elegí primero el centro de costo")
                        : React.createElement(
                            "div",
                            { style: { width: 170, ...(impOk ? {} : { outline: "2px solid " + RED, borderRadius: 4 }) }, title: impOk ? "" : l.proveedor ? l.proveedor + " no está cargado en ese centro de costo / sub obra" : "Falta la imputación" },
                            React.createElement(CascadingSelect, {
                              style: { ...inp, width: "100%" },
                              value: impOk ? l.proveedor : "",
                              options: disp,
                              emptyLabel: l.proveedor && !impOk ? l.proveedor + " (no está en el centro)" : "Elegí la imputación",
                              newLabel: "+ Crear nuevo proveedor",
                              camposExtra: [
                                { key: "presupuestoOriginal", label: "Presupuesto original (opcional)" },
                                { key: "presupuestoReal", label: "Presupuesto real (opcional)" },
                              ],
                              onCommit: (B, re, nuevo) => {
                                nuevo && M(l.cliente, l.centroCosto, l.subObra, B, re);
                                fcCambiarLinea(x, { proveedor: String(B || "").toUpperCase() });
                              },
                            }),
                          ),
                    !interno &&
                      l.centroCosto &&
                      l.proveedor &&
                      !impOk &&
                      React.createElement(
                        "button",
                        {
                          onClick: () => {
                            M(l.cliente, l.centroCosto, l.subObra, l.proveedor, {});
                          },
                          style: { display: "block", marginTop: 3, border: "none", background: "none", color: "#0969DA", cursor: "pointer", fontSize: 11, padding: 0, textAlign: "left" },
                          title: "Da de alta " + l.proveedor + " en " + (l.subObra || l.centroCosto) + " con presupuesto 0 (se edita después en Costos)",
                        },
                        "+ Crear " + l.proveedor + " en " + (l.subObra || l.centroCosto),
                      ),
                    x.impDeArchivo && !interno && l.proveedor && React.createElement("div", { style: { fontSize: 10.5, color: MUTED, marginTop: 2 } }, "del nombre del archivo"),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    React.createElement(MilesInput, {
                      value: l.importe,
                      onChange: (v) => fcCambiarLinea(x, { importe: v }),
                      style: { ...inp, width: 115, textAlign: "right", ...mal(!Number(l.importe)) },
                    }),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    React.createElement(MilesInput, {
                      value: l.importeBruto,
                      onChange: (v) => fcCambiarLinea(x, { importeBruto: v }),
                      style: { ...inp, width: 115, textAlign: "right", ...mal(!(Number(l.importeBruto) > 0)) },
                      title: "Importe de los productos, sin IVA ni percepciones",
                    }),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    React.createElement(
                      "select",
                      {
                        value: x.formaPago,
                        onChange: (e) => fcCambiarFila(x.key, (y) => ({ ...y, formaPago: e.target.value, formaManual: true, formaAprendida: false })),
                        style: { ...inp, width: 120 },
                      },
                      FORMAS_PAGO.map(([k, t]) => React.createElement("option", { key: k, value: k }, t)),
                    ),
                    x.formaAprendida &&
                      React.createElement("div", { style: { fontSize: 10.5, color: GREEN, marginTop: 2 } }, "Como la última vez"),
                    x.formaPago === "mixto"
                      ? React.createElement(
                          "div",
                          { style: { marginTop: 4, display: "grid", gridTemplateColumns: "auto auto", gap: "3px 6px", alignItems: "center", fontSize: 11 } },
                          FORMAS_MIXTO.map(([k, t]) => [
                            React.createElement("span", { key: k + "t", style: { color: MUTED } }, t),
                            React.createElement(
                              "span",
                              { key: k, style: { display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" } },
                              React.createElement("input", {
                                value: mix[k] == null ? "" : mix[k],
                                inputMode: "decimal",
                                placeholder: "0",
                                onChange: (e) => {
                                  const v = e.target.value.replace(",", ".").replace(/[^\d.]/g, "");
                                  fcCambiarFila(x.key, (y) => ({ ...y, mix: { ...(y.mix || {}), [k]: v }, formaManual: true, formaAprendida: false }));
                                },
                                style: { ...inp, width: 46, textAlign: "right", fontSize: 11.5 },
                              }),
                              "%",
                              React.createElement("span", { style: { color: Number(mix[k]) ? TEXT : MUTED, minWidth: 80, textAlign: "right" } }, Number(mix[k]) ? fmt(montosMix[k]) : ""),
                            ),
                          ]),
                          React.createElement(
                            "span",
                            { style: { gridColumn: "1 / 3", fontWeight: 700, color: Math.abs(pctTotal - 100) < 0.01 ? GREEN : RED } },
                            Math.abs(pctTotal - 100) < 0.01 ? "✓ 100 %" : (pctTotal < 100 ? "Falta " : "Sobra ") + Math.round(Math.abs(100 - pctTotal) * 100) / 100 + " %",
                          ),
                        )
                      : React.createElement(
                          "div",
                          { style: { fontSize: 10.5, color: MUTED, marginTop: 2, maxWidth: 125 } },
                          x.formaPago ? "Va el Importe Final entero" : "Para repartir, elegí Mixto",
                        ),
                  ),
                  React.createElement(
                    "td",
                    { style: celda },
                    React.createElement(
                      "select",
                      { value: l.sePaga || "SI", onChange: (e) => fcCambiarLinea(x, { sePaga: e.target.value }), style: { ...inp, width: 60 } },
                      React.createElement("option", { value: "SI" }, "SI"),
                      React.createElement("option", { value: "NO" }, "NO"),
                    ),
                  ),
                  ]),
                );
              }),
            ),
          ),
        ),
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 18px", borderTop: "1px solid " + BORDER } },
          React.createElement("button", { onClick: () => setFcRev(null), style: smallBtnGhost }, "Cancelar"),
          React.createElement(
            "button",
            { onClick: confirmarFacturasPdf, disabled: !cargables.length, style: { ...smallBtnPrimary, opacity: cargables.length ? 1 : 0.5 } },
            "Cargar " + cargables.length + " factura" + (cargables.length === 1 ? "" : "s"),
          ),
        ),
      ),
    );
  }
  // ---------- Cierre del pago semanal (Sección 98) ----------
  // Motivo por el que una línea no se puede marcar pagada (mismas reglas que el tilde de cada línea).
  function lineaConError(l) {
    const ce = (l.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS,
      me = obraKey(l.cliente, l.centroCosto),
      ge = ce ? rubrosInt : l.cliente ? Array.from(new Set(d.filter((B) => B.cliente === l.cliente).map((B) => B.obra))) : [],
      Ke = ce ? [] : p[me] || [],
      Y = Ke.map((B) => B.nombre),
      se = Y.findIndex((B) => B.trim().toUpperCase() === (l.subObra || "").trim().toUpperCase()),
      be = se >= 0 ? subCostoKey(me, Ke[se].id) : null,
      Ue = ce ? [] : (l.subObra && be ? g[be] || [] : c[me] || []).map((B) => B.proveedor);
    if (!(l.cliente || "").trim()) return "Falta Cliente";
    if (!(l.centroCosto || "").trim()) return "Falta Centro de Costo";
    if (l.cliente && !dt.includes(l.cliente)) return "Cliente no existe";
    if (l.centroCosto && !ge.includes(l.centroCosto)) return "Centro de costo no existe";
    if (!ce && l.subObra && !Y.includes(l.subObra)) return "Sub obra no existe";
    if (!ce && l.proveedor && !Ue.includes(l.proveedor)) return "Imputación no está en ese centro";
    if ((l.proveedorPago || "").trim() && !G[(l.proveedorPago || "").trim().toUpperCase()]) return "Proveedor no está en la tabla";
    const falta = Lt(l);
    return falta ? "Falta " + falta : null;
  }
  const pagoDe = (l) => ["efectivo", "transferencia", "echeq", "diegoLevy"].reduce((a, k) => a + (Number(l[k]) || 0), 0);
  function abrirCierre() {
    const pendientes = n.filter((l) => !l.fechaPagado && (l.sePaga || "SI") !== "NO");
    setCierre({
      fecha: fechaHoyArgentinaDDMMAAAA(),
      sel: new Set(pendientes.filter((l) => !lineaConError(l) && pagoDe(l) > 0).map((l) => l.id)),
      retenciones: true,
      busca: "",
    });
  }
  function confirmarCierre() {
    const fecha = normalizarFecha(cierre.fecha);
    if (!fechaEsValida(fecha)) {
      window.alert("La fecha de pago no es válida (DD/MM/AAAA).");
      return;
    }
    const lineas = n.filter((l) => cierre.sel.has(l.id) && !l.fechaPagado && !lineaConError(l));
    if (!lineas.length) return;
    const total = lineas.reduce((a, l) => a + (Number(l.importe) || 0), 0);
    if (
      !window.confirm(
        "¿Marcar " + lineas.length + " línea(s) como pagadas el " + fecha + " por un total de " + fmt(total) + "?\n\nSe imputan en Costos" +
          (cierre.retenciones ? " y se descarga la planilla de Retenciones" : "") + ".",
      )
    )
      return;
    lineas.forEach((l) => ee(l.id, fecha));
    setCierre(null);
    const res = [{ archivo: "Pago semanal", tipo: "ok", texto: lineas.length + " línea(s) marcadas pagadas el " + fecha + " por " + fmt(total) + " e imputadas en Costos" }];
    res.titulo = "Pago semanal cerrado";
    setFcRes(res);
    if (cierre.retenciones)
      try {
        jt(lineas);
      } catch (e) {
        window.alert("Las líneas quedaron pagadas, pero no se pudo descargar la planilla de Retenciones: " + ((e && e.message) || e));
      }
  }
  function renderCierre() {
    const pendientes = n
        .filter((l) => !l.fechaPagado && (l.sePaga || "SI") !== "NO")
        .sort((a, b) => (a.proveedorPago || a.proveedor || "").localeCompare(b.proveedorPago || b.proveedor || "", "es")),
      busca = normalizarTexto(cierre.busca),
      visibles = busca
        ? pendientes.filter((l) => normalizarTexto([l.proveedorPago, l.proveedor, l.cliente, l.centroCosto, l.subObra, l.factura].join(" ")).includes(busca))
        : pendientes,
      elegidas = pendientes.filter((l) => cierre.sel.has(l.id) && !lineaConError(l)),
      suma = (k) => elegidas.reduce((a, l) => a + (Number(l[k]) || 0), 0),
      celda = { padding: "5px 8px", borderBottom: "1px solid #EEE", fontSize: 12, verticalAlign: "top" },
      th = { ...celda, fontSize: 10.5, color: MUTED, fontWeight: 700, textTransform: "uppercase", background: "#FAFAF7", position: "sticky", top: 0, zIndex: 2, textAlign: "left", whiteSpace: "nowrap" },
      num = { ...celda, textAlign: "right", whiteSpace: "nowrap" },
      marcar = (ids, si) =>
        setCierre((x) => {
          const sel = new Set(x.sel);
          ids.forEach((id) => (si ? sel.add(id) : sel.delete(id)));
          return { ...x, sel };
        }),
      fechaOk = fechaEsValida(normalizarFecha(cierre.fecha));
    return React.createElement(
      "div",
      { style: { position: "fixed", inset: 0, background: "rgba(20,20,20,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70 } },
      React.createElement(
        "div",
        { style: { background: "#fff", borderRadius: 12, width: "96%", maxWidth: 1400, height: "88%", display: "flex", flexDirection: "column", overflow: "hidden" } },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid " + BORDER } },
          React.createElement("div", { style: { fontWeight: 700, color: NAVY, fontSize: 14 } }, "Marcar varias como pagadas (cierre del pago semanal)"),
          React.createElement("button", { onClick: () => setCierre(null), style: { border: "none", background: "none", cursor: "pointer", color: MUTED } }, React.createElement(X, { size: 18 })),
        ),
        React.createElement(
          "div",
          { style: { padding: "10px 18px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid " + BORDER, fontSize: 12.5 } },
          React.createElement(
            "label",
            { style: { display: "flex", gap: 6, alignItems: "center", fontWeight: 600, color: NAVY } },
            "Fecha de pago:",
            React.createElement("input", {
              value: cierre.fecha,
              onChange: (e) => setCierre((x) => ({ ...x, fecha: e.target.value })),
              placeholder: "DD/MM/AAAA",
              style: { ...Ve, width: 110, ...(fechaOk ? {} : { borderColor: RED, background: "#FBEAE7" }) },
            }),
          ),
          React.createElement("input", {
            value: cierre.busca,
            onChange: (e) => setCierre((x) => ({ ...x, busca: e.target.value })),
            placeholder: "Buscar proveedor, obra o factura…",
            style: { ...Ve, width: 240 },
          }),
          React.createElement(
            "button",
            { onClick: () => marcar(visibles.filter((l) => !lineaConError(l)).map((l) => l.id), true), style: smallBtnGhost },
            "Elegir todas",
          ),
          React.createElement("button", { onClick: () => marcar(visibles.map((l) => l.id), false), style: smallBtnGhost }, "Ninguna"),
          React.createElement(
            "label",
            { style: { display: "flex", gap: 6, alignItems: "center", color: NAVY } },
            React.createElement("input", { type: "checkbox", checked: cierre.retenciones, onChange: (e) => setCierre((x) => ({ ...x, retenciones: e.target.checked })) }),
            "Descargar la planilla de Retenciones de estas líneas",
          ),
          React.createElement(
            "span",
            { style: { color: MUTED, fontSize: 11.5 }, title: "Cuando se resuelva el problema con Xubio, al cerrar el pago también se van a crear las órdenes de pago" },
            "Órdenes de pago en Xubio: en pausa hasta resolverlo con Xubio",
          ),
        ),
        React.createElement(
          "div",
          { style: { flex: 1, overflow: "auto" } },
          React.createElement(
            "table",
            { style: { borderCollapse: "collapse", width: "100%" } },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                ["", "Proveedor", "Factura", "Cliente / Centro de costo", "Imputación", "Importe Final", "Efectivo", "Transferencia", "E-Cheq", "Diego Levy", "Estado"].map((t, i) =>
                  React.createElement("th", { key: i, style: i >= 5 && i <= 9 ? { ...th, textAlign: "right" } : th }, t),
                ),
              ),
            ),
            React.createElement(
              "tbody",
              null,
              visibles.length === 0 &&
                React.createElement("tr", null, React.createElement("td", { colSpan: 11, style: { ...celda, textAlign: "center", color: MUTED, padding: 20 } }, "No hay líneas pendientes de pago.")),
              visibles.map((l) => {
                const err = lineaConError(l),
                  pago = pagoDe(l),
                  dif = Math.abs(pago - (Number(l.importe) || 0)) >= 1,
                  estado = err
                    ? React.createElement("span", { style: { color: RED, fontWeight: 700 } }, "⛔ " + err)
                    : !pago
                      ? React.createElement("span", { style: { color: "#9A6700" } }, "⚠️ Sin forma de pago")
                      : dif
                        ? React.createElement("span", { style: { color: "#9A6700" }, title: "La suma de Efectivo + Transferencia + E-Cheq + Diego Levy no es igual al Importe Final (puede ser por la retención)" }, "⚠️ Pago ≠ Importe Final")
                        : React.createElement("span", { style: { color: GREEN } }, "✓ Lista");
                return React.createElement(
                  "tr",
                  { key: l.id, style: { opacity: err ? 0.55 : 1 } },
                  React.createElement(
                    "td",
                    { style: celda },
                    React.createElement("input", {
                      type: "checkbox",
                      disabled: !!err,
                      checked: !err && cierre.sel.has(l.id),
                      onChange: (e) => marcar([l.id], e.target.checked),
                      title: err ? "Corregila en Pagos antes de poder pagarla" : "",
                    }),
                  ),
                  React.createElement("td", { style: celda }, l.proveedorPago || l.razonSocial || "—"),
                  React.createElement("td", { style: celda }, l.factura || "—"),
                  React.createElement("td", { style: celda }, [l.cliente, l.subObra || l.centroCosto].filter(Boolean).join(" / ") || "—"),
                  React.createElement("td", { style: celda }, l.proveedor || "—"),
                  React.createElement("td", { style: { ...num, fontWeight: 700 } }, fmt(Number(l.importe) || 0)),
                  ["efectivo", "transferencia", "echeq", "diegoLevy"].map((k) => React.createElement("td", { key: k, style: { ...num, color: Number(l[k]) ? TEXT : MUTED } }, Number(l[k]) ? fmt(Number(l[k])) : "—")),
                  React.createElement("td", { style: celda }, estado),
                );
              }),
            ),
          ),
        ),
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 18px", borderTop: "1px solid " + BORDER, flexWrap: "wrap" } },
          React.createElement(
            "div",
            { style: { fontSize: 12.5, color: NAVY } },
            React.createElement("strong", null, elegidas.length + " línea(s) · " + fmt(suma("importe"))),
            "  —  Efectivo " + fmt(suma("efectivo")) + " · Transferencia " + fmt(suma("transferencia")) + " · E-Cheq " + fmt(suma("echeq")) + " · Diego Levy " + fmt(suma("diegoLevy")),
          ),
          React.createElement(
            "div",
            { style: { display: "flex", gap: 8 } },
            React.createElement("button", { onClick: () => setCierre(null), style: smallBtnGhost }, "Cancelar"),
            React.createElement(
              "button",
              { onClick: confirmarCierre, disabled: !elegidas.length || !fechaOk, style: { ...smallBtnPrimary, opacity: elegidas.length && fechaOk ? 1 : 0.5 } },
              "Marcar " + elegidas.length + " como pagadas",
            ),
          ),
        ),
      ),
    );
  }
  async function adjuntarPdfALinea(l, file) {
    let fc = null;
    try {
      fc = await leerFacturaPdf(file);
    } catch {}
    if (fc && (fc.cuit || fc.factura || fc.total)) {
      const prov = proveedorPorCuit(fc.cuit, A, f, n),
        dp = prov ? fcDatosProveedor(prov) : {},
        { cambios, avisos } = completarLineaConFactura(l, fc, dp.razonSocial);
      if (avisos.length && !window.confirm("Ojo con esta factura:\n- " + avisos.join("\n- ") + "\n\n¿Adjuntar el PDF igual? (no se cambia nada de lo que ya está cargado)"))
        return;
      !(l.proveedorPago || "").trim() && prov && Object.assign(cambios, { proveedorPago: prov, mat: !!dp.mat, mo: !!dp.mo }, dp.cbu && !l.cbu ? { cbu: dp.cbu } : {});
      Object.keys(cambios).length && Z(l.id, cambios);
    }
    await fcPdfGuardar(l.id, file, fc || {});
  }
  // Rubros de gastos internos: los fijos más los que se fueron creando en líneas de Pagos (INTERNO).
  const rubrosInt = useMemo(() => rubrosInternos(n), [n]);
  // CUIT repetidos en la tabla de Proveedores (posibles duplicados con distinto nombre).
  const cuitsRepetidos = useMemo(() => {
    const m = {};
    (A || []).forEach((r) => {
      const c = fcSoloDigitos(r.cuit);
      c.length === 11 && (m[c] = [...(m[c] || []), r.proveedor]);
    });
    Object.keys(m).forEach((c) => m[c].length > 1 || delete m[c]);
    return m;
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
        ["Proveedor", "Actividad", "Factura", "CUIT", "Razón Social", "CBU", "Imputación"],
        ...(A || []).map((U) => [
          U.proveedor || "",
          U.actividad || "",
          U.factura || "",
          U.cuit || "",
          U.razonSocial || "",
          U.cbu || "",
          U.imputacion || "",
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
              imputacion: String(ge(Ue, ["imputación", "imputacion"]) || "")
                .toUpperCase()
                .trim(),
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
  function jt(lineas) {
    const fo2 = Array.isArray(lineas) ? lineas : fo;
    if (fo2.length === 0) {
      alert("No hay líneas para mostrar en el filtro elegido arriba.");
      return;
    }
    Eo(true);
    try {
      const l = /* @__PURE__ */ new Map();
      fo2.forEach((Y) => {
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
        ne &&
          React.createElement(
            "button",
            {
              onClick: abrirCierre,
              style: { ...smallBtnGhost, background: "#C9A227", borderColor: "#C9A227", color: "#1A1A1A", fontWeight: 700 },
              title:
                "Arma el lote de pagos pendientes de la semana para revisarlo y, con un clic, marcarlo todo pagado: se imputa en Costos y se descarga la planilla de Retenciones de esas líneas.",
            },
            "✓ Marcar varias como pagadas",
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
              style: { ...smallBtnGhost, ...(fcProg ? { opacity: 0.7, cursor: "wait" } : {}) },
              title:
                "Cargar una o varias facturas de proveedores en PDF (también podés arrastrarlas sobre la tabla). Se lee el CUIT, número, tipo y total; el proveedor sale de la tabla de Proveedores por CUIT (con tu nombre, no la razón social) y el centro de costo / sub obra del nombre del archivo (ej. 'San Andres - Palermo.pdf'). Si ya tenías la línea tipeada sin factura, se completa esa en vez de crear otra. El PDF queda guardado en la línea (👁 / ⬇).",
            },
            React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
            " " + (fcProg || "Facturas PDF"),
            React.createElement("input", {
              type: "file",
              accept: "application/pdf,.pdf",
              multiple: true,
              disabled: !!fcProg,
              style: { display: "none" },
              onChange: (l) => {
                const I = Array.from(l.target.files || []);
                ((l.target.value = ""), importarFacturasPdf(I));
              },
            }),
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
    fcRev && renderRevisionFacturas(),
    cierre && renderCierre(),
    fcRes &&
      React.createElement(
        "div",
        {
          style: {
            background: "#fff",
            border: "1px solid " + BORDER,
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 10,
            fontSize: 12.5,
            boxShadow: CARD_SHADOW,
          },
        },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
          React.createElement("strong", { style: { color: NAVY } }, fcRes.titulo || "Facturas PDF cargadas (" + fcRes.length + ")"),
          React.createElement(
            "button",
            { onClick: () => setFcRes(null), style: { border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 14 }, title: "Cerrar" },
            "✕",
          ),
        ),
        fcRes.map((r, i) =>
          React.createElement(
            "div",
            { key: i, style: { padding: "3px 0", borderTop: i ? "1px solid #F0EFE9" : "none", lineHeight: 1.4 } },
            React.createElement("span", null, r.tipo === "ok" ? "✅ " : r.tipo === "aviso" ? "⚠️ " : "✏️ "),
            React.createElement("span", { style: { color: MUTED } }, r.archivo + ": "),
            r.texto,
          ),
        ),
        fcRes.some((r) => r.tipo === "falta") &&
          React.createElement(
            "div",
            { style: { color: MUTED, fontSize: 11.5, marginTop: 6 } },
            "Lo que falta queda en rojo en la línea para completarlo a mano. Tip: si cargás el CUIT del proveedor en la tabla de Proveedores, la próxima factura de ese proveedor sale sola.",
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
          onDragOver: (l) => {
            ne && !fcProg && l.dataTransfer && Array.from(l.dataTransfer.types || []).includes("Files") && (l.preventDefault(), fcArrastre || setFcArrastre(true));
          },
          onDragLeave: (l) => {
            l.currentTarget.contains(l.relatedTarget) || setFcArrastre(false);
          },
          onDrop: (l) => {
            if (!ne || !l.dataTransfer || !l.dataTransfer.files || !l.dataTransfer.files.length) return;
            (l.preventDefault(), setFcArrastre(false), fcProg || importarFacturasPdf(Array.from(l.dataTransfer.files)));
          },
          style: {
            overflowX: "scroll",
            overflowY: "auto",
            maxHeight: "70vh",
            ...(fcArrastre ? { outline: "3px dashed #C9A227", outlineOffset: -3, background: "#FFFBEA" } : {}),
          },
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
              thOrd("Importe Bruto", "importeBruto", { textAlign: "right" }, "Importe de los productos, sin IVA ni percepciones de Ingresos Brutos (al cargar una factura en PDF se toma de ahí). La Retención de Ganancias ya no se calcula ni se muestra acá factura por factura: se descarga consolidada por Proveedor con el botón 'Retenciones'"),
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
                  ? rubrosInt
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
                    ? React.createElement(CascadingSelect, {
                        style: Ve,
                        value: l.centroCosto,
                        options: rubrosInt,
                        disabled: !ne || Le(l),
                        emptyLabel: "Elegí un rubro",
                        newLabel: "+ Crear nuevo rubro",
                        onCommit: (B) => Z(l.id, { centroCosto: String(B || "").trim().toUpperCase(), subObra: "", proveedor: "" }),
                      })
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
                        },
                      },
                      React.createElement(NuevoProveedorForm, {
                        tabla: A,
                        onUsarExistente: (nombre) => {
                          const dp = fcDatosProveedor(nombre);
                          (Z(Re.rowId, { proveedorPago: nombre, mat: dp.mat, mo: dp.mo, facturaA: dp.facturaA, ...(dp.cbu ? { cbu: dp.cbu } : {}) }), at(null));
                        },
                        inicial: { nombre: Re.nombre, actividad: Re.actividad, facturaA: Re.facturaA, cuit: l.cuit || "", razonSocial: l.razonSocial || "", cbu: l.cbu || "" },
                        imputaciones: V,
                        onCrear: (np) => {
                          crearProveedorTabla(np);
                          const cambios = {
                            proveedorPago: np.nombre,
                            mat: np.actividad === "MAT",
                            mo: np.actividad === "MO",
                            facturaA: !!np.facturaA,
                            ...(np.cuit ? { cuit: np.cuit } : {}),
                            ...(np.razonSocial ? { razonSocial: np.razonSocial } : {}),
                            ...(np.cbu ? { cbu: np.cbu } : {}),
                          };
                          np.imputacion && !(l.proveedor || "").trim() && (cambios.proveedor = np.imputacion);
                          (Z(Re.rowId, cambios), at(null));
                        },
                        onCancelar: () => at(null),
                      }),
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
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: 2 } },
                    React.createElement("input", {
                      key: "fc-" + (l.factura || ""),
                      style: { ...Ve, minWidth: 118 },
                      title: l.factura || "",
                      defaultValue: l.factura,
                      disabled: !ne || Le(l),
                      onBlur: (B) => {
                        const v = B.target.value;
                        if (v === (l.factura || "")) return;
                        const otras = facturasIguales(l, v);
                        if (
                          otras.length &&
                          !window.confirm(
                            "Ojo: esa factura ya está cargada en Pagos para ese proveedor:\n\n" + textoFacturaRepetida(otras) + "\n\n¿La cargás igual?",
                          )
                        ) {
                          B.target.value = l.factura || "";
                          return;
                        }
                        Z(l.id, { factura: v });
                      },
                    }),
                    (() => {
                      const otras = facturasIguales(l, l.factura);
                      return otras.length
                        ? React.createElement(
                            "span",
                            {
                              title: "Esta factura también está en otra línea de Pagos:\n" + textoFacturaRepetida(otras),
                              style: { cursor: "help", fontSize: 12, color: otras.some((o) => o.fechaPagado) ? RED : "#9A6700" },
                            },
                            "⚠️",
                          )
                        : null;
                    })(),
                    React.createElement(FacturaPdfCelda, { linea: l, puedeEditar: ne && !Le(l), onAdjuntar: adjuntarPdfALinea }),
                  ),
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
                      // El CBU nuevo se copia a la tabla de Proveedores, solo si ese proveedor ya está en la
                      // tabla (nunca crea uno nuevo, para no duplicar).
                      const re = B.target.value,
                        ot = (l.proveedorPago || "").trim().toUpperCase();
                      re !== l.cbu && (Z(l.id, { cbu: re }), ot && (F(ot, { cbu: re }), G[ot] && go(ot, { cbu: re })));
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
                  React.createElement(
                    "th",
                    {
                      style: q,
                      title:
                        "Imputación habitual de este proveedor. Se usa al cargar facturas en PDF (salvo que el nombre del archivo diga otra, para cuando se prestan facturas).",
                    },
                    "Imputación",
                  ),
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
                      { colSpan: 8, style: { ...Ae, textAlign: "center", color: MUTED, padding: "18px 8px" } },
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
                        React.createElement("option", { value: "B" }, "B"),
                        React.createElement("option", { value: "C" }, "C"),
                      ),
                    ),
                    React.createElement(
                      "td",
                      { style: Ae },
                      React.createElement("input", {
                        style: { ...Ve, ...(cuitsRepetidos[fcSoloDigitos(l.cuit)] ? { borderColor: RED, background: "#FBEAE7" } : {}) },
                        value: l.cuit || "",
                        placeholder: "CUIT",
                        title: cuitsRepetidos[fcSoloDigitos(l.cuit)] ? "Mismo CUIT que: " + cuitsRepetidos[fcSoloDigitos(l.cuit)].filter((x) => x !== l.proveedor).join(", ") + " — ¿es el mismo proveedor?" : "",
                        onChange: (U) => At(I, { cuit: U.target.value }),
                      }),
                      cuitsRepetidos[fcSoloDigitos(l.cuit)] &&
                        React.createElement(
                          "div",
                          { style: { fontSize: 10.5, color: RED, marginTop: 2 } },
                          "Repetido con " + cuitsRepetidos[fcSoloDigitos(l.cuit)].filter((x) => x !== l.proveedor).join(", "),
                        ),
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
                      { style: Ae },
                      I === 0 &&
                        React.createElement(
                          "datalist",
                          { id: "mia-imputaciones" },
                          V.map((x) => React.createElement("option", { key: x, value: x })),
                        ),
                      React.createElement("input", {
                        style: Ve,
                        list: "mia-imputaciones",
                        value: l.imputacion || "",
                        placeholder: "Imputación",
                        title: "Imputación habitual (ej. SAN ANDRES → PINTURA)",
                        onChange: (U) => At(I, { imputacion: U.target.value.toUpperCase() }),
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
