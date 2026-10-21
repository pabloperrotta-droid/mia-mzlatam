// Sección 129: ingreso con mail y contraseña (Firebase Authentication) en lugar del PIN.
// Pedido del usuario (20/10/2026): "que por más que tengan el link no puedan ingresar a la info".
//   - El Admin carga en Herramientas → Usuarios el mail de cada persona y su rol (colección `usuarios`).
//   - Cada persona elige su contraseña la primera vez y confirma su mail (Firebase le manda un link).
//   - También se puede entrar con la cuenta de Google del mismo mail (la que prefiera cada persona).
//   - "¿Olvidaste tu contraseña?" manda un mail para poner una nueva (también lo puede mandar el Admin).
//   - Las reglas de la base solo dejan leer/escribir a mails confirmados que estén en `usuarios` y activos
//     (ver firestore.rules). Sacar a alguien de la lista le corta el acceso al instante.
// En QA desde el 20/10/2026 y en Producción desde el 21/10/2026 (OK del usuario: "pasalo a producción").
const LOGIN_CON_MAIL = !(typeof window < "u" && window.__MIA_SIN_LOGIN_MAIL__);
function mailNormal(m) {
  return String(m || "").trim().toLowerCase();
}
function mailValido(m) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailNormal(m));
}
const ERRORES_INGRESO = {
  "auth/invalid-email": "El mail no es válido.",
  "auth/user-not-found": "Mail o contraseña incorrectos.",
  "auth/wrong-password": "Mail o contraseña incorrectos.",
  "auth/invalid-credential": "Mail o contraseña incorrectos.",
  "auth/invalid-login-credentials": "Mail o contraseña incorrectos.",
  "auth/email-already-in-use": "Ese mail ya tiene contraseña: ingresá con ella o usá \"¿Olvidaste tu contraseña?\".",
  "auth/weak-password": "La contraseña tiene que tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Esperá unos minutos y probá de nuevo.",
  "auth/network-request-failed": "Sin conexión. Revisá internet y probá de nuevo.",
  "auth/operation-not-allowed": "El ingreso con mail todavía no está habilitado en Firebase.",
  "auth/missing-password": "Escribí la contraseña.",
  "auth/unauthorized-domain": "Falta autorizar esta página en Firebase (Authentication → Configuración → Dominios autorizados).",
  "auth/account-exists-with-different-credential": "Ese mail ya entra de otra forma: usá mail y contraseña.",
};
function textoErrorIngreso(e) {
  return ERRORES_INGRESO[e && e.code] || "No se pudo: " + ((e && e.message) || e);
}
function firebaseAuth() {
  if (typeof firebase > "u") return null;
  firebase.apps && firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(FIREBASE_CONFIG);
  const a = firebase.auth();
  try {
    a.languageCode = "es";
  } catch {}
  return a;
}
// Estado de la sesión: cargando → login | verificar | no_habilitado | ok (con el usuario y su rol).
function useSesionMail() {
  const [st, setSt] = useState({ fase: "cargando" }),
    quitarRef = useRef(null),
    evaluarRef = useRef(null);
  useEffect(() => {
    const auth = firebaseAuth();
    if (!auth) {
      setSt({ fase: "error", mensaje: "No se pudo cargar el sistema de ingreso. Revisá internet y recargá la página." });
      return;
    }
    const evaluar = async (u) => {
      quitarRef.current && (quitarRef.current(), (quitarRef.current = null));
      if (!u || u.isAnonymous) {
        u && (await auth.signOut().catch(() => {}));
        setSt({ fase: "login" });
        return;
      }
      if (!u.emailVerified) {
        setSt({ fase: "verificar", email: u.email });
        return;
      }
      // El permiso de la base depende de que el mail esté confirmado: se pide un pase nuevo que ya lo diga.
      await u.getIdToken(true).catch(() => {});
      const email = mailNormal(u.email);
      quitarRef.current = scopedDb(firebase.firestore())
        .collection("usuarios")
        .doc(email)
        .onSnapshot(
          (s) => {
            const d = s.exists ? s.data() : null;
            !d || d.activo === false
              ? setSt({ fase: "no_habilitado", email })
              : setSt({ fase: "ok", usuario: { email, rol: d.rol || "custom", rolId: d.rolId || null, nombre: d.nombre || "" } });
          },
          () => setSt({ fase: "no_habilitado", email }),
        );
    };
    evaluarRef.current = () => evaluar(auth.currentUser);
    const quitar = auth.onAuthStateChanged(evaluar);
    return () => (quitar(), quitarRef.current && quitarRef.current());
  }, []);
  return { ...st, reevaluar: () => evaluarRef.current && evaluarRef.current() };
}
function cerrarSesionMail() {
  const a = firebaseAuth();
  a && a.signOut().catch(() => {});
}
const estiloIngreso = {
  input: {
    width: 260,
    fontSize: 15,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  boton: {
    width: 260,
    border: "none",
    background: GOLD,
    color: "#1A1A1A",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  link: { border: "none", background: "none", color: "rgba(255,255,255,0.75)", fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 4 },
  texto: { color: "rgba(255,255,255,0.85)", fontSize: 13.5, lineHeight: 1.5, maxWidth: 300, textAlign: "center" },
};
function PantallaIngresoMail({ sesion }) {
  const [modo, setModo] = useState("ingresar"),
    [email, setEmail] = useState(() => {
      try {
        return window.localStorage.getItem("mia-ultimo-mail") || "";
      } catch {
        return "";
      }
    }),
    [clave, setClave] = useState(""),
    [clave2, setClave2] = useState(""),
    [aviso, setAviso] = useState(null),
    [ocupado, setOcupado] = useState(false),
    auth = firebaseAuth(),
    hacer = async (f) => {
      if (ocupado) return;
      setOcupado(true);
      setAviso(null);
      try {
        await f();
      } catch (e) {
        setAviso({ error: true, texto: textoErrorIngreso(e) });
      }
      setOcupado(false);
    },
    recordar = () => {
      try {
        window.localStorage.setItem("mia-ultimo-mail", mailNormal(email));
      } catch {}
    },
    ingresar = () =>
      hacer(async () => {
        if (!mailValido(email)) return setAviso({ error: true, texto: "Escribí un mail válido." });
        recordar();
        await auth.signInWithEmailAndPassword(mailNormal(email), clave);
      }),
    crear = () =>
      hacer(async () => {
        if (!mailValido(email)) return setAviso({ error: true, texto: "Escribí un mail válido." });
        if (clave.length < 6) return setAviso({ error: true, texto: "La contraseña tiene que tener al menos 6 caracteres." });
        if (clave !== clave2) return setAviso({ error: true, texto: "Las dos contraseñas no coinciden." });
        recordar();
        const r = await auth.createUserWithEmailAndPassword(mailNormal(email), clave);
        await r.user.sendEmailVerification();
      }),
    conGoogle = () =>
      hacer(async () => {
        const prov = new firebase.auth.GoogleAuthProvider();
        prov.setCustomParameters({ prompt: "select_account" });
        await auth.signInWithPopup(prov).catch((e) => {
          if (e && e.code === "auth/popup-blocked") return auth.signInWithRedirect(prov);
          if (e && ["auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(e.code)) return;
          throw e;
        });
      }),
    olvide = () =>
      hacer(async () => {
        if (!mailValido(email)) return setAviso({ error: true, texto: "Escribí tu mail." });
        await auth.sendPasswordResetEmail(mailNormal(email)).catch((e) => {
          // Por seguridad no se dice si el mail tiene usuario o no.
          if (!["auth/user-not-found", "auth/invalid-email"].includes(e && e.code)) throw e;
        });
        setAviso({ texto: "Si " + mailNormal(email) + " tiene usuario en MIA, te llegó un mail para poner una contraseña nueva. Revisá también Spam." });
      }),
    reenviar = () =>
      hacer(async () => {
        await auth.currentUser.sendEmailVerification();
        setAviso({ texto: "Te mandamos de nuevo el mail de confirmación a " + sesion.email + ". Revisá también Spam." });
      }),
    yaConfirme = () =>
      hacer(async () => {
        await auth.currentUser.reload();
        if (!auth.currentUser.emailVerified)
          return setAviso({ error: true, texto: "Todavía no figura confirmado. Abrí el link del mail y volvé a tocar este botón." });
        sesion.reevaluar();
      }),
    salir = () => (cerrarSesionMail(), setAviso(null), setClave(""), setClave2("")),
    campo = (props) => React.createElement("input", { ...props, style: estiloIngreso.input, disabled: ocupado }),
    boton = (txt, f) => React.createElement("button", { onClick: f, disabled: ocupado, style: { ...estiloIngreso.boton, opacity: ocupado ? 0.6 : 1 } }, ocupado ? "Un momento…" : txt),
    link = (txt, f) => React.createElement("button", { onClick: f, style: estiloIngreso.link }, txt),
    texto = (t) => React.createElement("div", { style: estiloIngreso.texto }, t),
    enter = (f) => (e) => e.key === "Enter" && f();
  let cuerpo;
  if (sesion.fase === "cargando") cuerpo = [texto("Cargando…")];
  else if (sesion.fase === "error") cuerpo = [texto(sesion.mensaje)];
  else if (sesion.fase === "verificar")
    cuerpo = [
      texto(["Te mandamos un mail a ", React.createElement("b", { key: "m" }, sesion.email), " para confirmar que la casilla es tuya. Abrí el link del mail y después tocá el botón."]),
      boton("Ya confirmé mi mail", yaConfirme),
      link("Reenviar el mail", reenviar),
      link("Salir", salir),
    ];
  else if (sesion.fase === "no_habilitado")
    cuerpo = [
      texto(["El mail ", React.createElement("b", { key: "m" }, sesion.email), " no está habilitado en MIA. Pedile al administrador que te agregue en Herramientas → Usuarios y después volvé a ingresar."]),
      boton("Volver a intentar", () => sesion.reevaluar()),
      link("Salir", salir),
    ];
  else if (modo === "crear")
    cuerpo = [
      texto("Primera vez: escribí tu mail (el que te dio de alta el administrador) y elegí tu contraseña."),
      campo({ type: "email", placeholder: "Mail", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "username", autoFocus: true }),
      campo({ type: "password", placeholder: "Contraseña (mínimo 6)", value: clave, onChange: (e) => setClave(e.target.value), autoComplete: "new-password" }),
      campo({ type: "password", placeholder: "Repetir contraseña", value: clave2, onChange: (e) => setClave2(e.target.value), onKeyDown: enter(crear), autoComplete: "new-password" }),
      boton("Crear mi contraseña", crear),
      link("Ya tengo contraseña", () => (setModo("ingresar"), setAviso(null))),
    ];
  else if (modo === "olvide")
    cuerpo = [
      texto("Escribí tu mail y te mandamos un link para poner una contraseña nueva."),
      campo({ type: "email", placeholder: "Mail", value: email, onChange: (e) => setEmail(e.target.value), onKeyDown: enter(olvide), autoComplete: "username", autoFocus: true }),
      boton("Mandarme el mail", olvide),
      link("Volver", () => (setModo("ingresar"), setAviso(null))),
    ];
  else
    cuerpo = [
      campo({ type: "email", placeholder: "Mail", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "username", autoFocus: !email }),
      campo({ type: "password", placeholder: "Contraseña", value: clave, onChange: (e) => setClave(e.target.value), onKeyDown: enter(ingresar), autoComplete: "current-password", autoFocus: !!email }),
      boton("Ingresar", ingresar),
      React.createElement(
        "button",
        { onClick: conGoogle, disabled: ocupado, style: { ...estiloIngreso.boton, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } },
        React.createElement("span", { style: { fontWeight: 800, color: "#4285F4" } }, "G"),
        "Ingresar con Google",
      ),
      link("¿Olvidaste tu contraseña?", () => (setModo("olvide"), setAviso(null))),
      link("Primera vez: crear mi contraseña", () => (setModo("crear"), setAviso(null), setClave(""), setClave2(""))),
    ];
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
        overflowY: "auto",
      },
    },
    React.createElement("img", { src: LOGO_MZLATAM_DATA_URI, alt: "MZ LATAM", style: { width: 280, maxWidth: "80vw", height: "auto", display: "block" } }),
    React.createElement(
      "div",
      { style: { fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500, color: "#fff", letterSpacing: 3, marginTop: 12, marginBottom: 32 } },
      "MIA",
    ),
    React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 } },
      ...cuerpo.map((c, i) => React.cloneElement(c, { key: i })),
      aviso &&
        React.createElement(
          "div",
          { role: aviso.error ? "alert" : "status", style: { ...estiloIngreso.texto, color: aviso.error ? "#FF8A80" : "#B9F6CA", marginTop: 4 } },
          aviso.texto,
        ),
    ),
  );
}
// Raíz de la app: en QA (con ingreso por mail) muestra la pantalla de ingreso hasta que la sesión esté lista.
function AppRaiz() {
  if (!LOGIN_CON_MAIL) return React.createElement(App, null);
  return React.createElement(AppConIngresoMail, null);
}
function AppConIngresoMail() {
  const sesion = useSesionMail();
  if (sesion.fase !== "ok") return React.createElement(PantallaIngresoMail, { sesion });
  const u = sesion.usuario;
  // Si el Admin le cambia el rol, la app se vuelve a armar con el rol nuevo.
  return React.createElement(App, { key: u.email + "|" + u.rol + "|" + (u.rolId || ""), sesion: u });
}
// Herramientas → Usuarios (solo Admin): quién entra a MIA y con qué rol.
function UsuariosAdminPanel({ onClose, roles, miEmail, presencia }) {
  const [lista, setLista] = useState(null),
    [nuevo, setNuevo] = useState({ email: "", nombre: "", rol: "" }),
    [aviso, setAviso] = useState(null),
    col = () => scopedDb(firebase.firestore()).collection("usuarios"),
    opciones = [
      ["admin", "Admin"],
      ["comercial", "Comercial"],
      ...(roles || []).map((r) => ["custom:" + r.id, r.nombre || "(sin nombre)"]),
    ],
    valorRol = (u) => (u.rol === "custom" ? "custom:" + (u.rolId || "") : u.rol || ""),
    nombreRol = (u) => (opciones.find((o) => o[0] === valorRol(u)) || [null, u.rol === "custom" ? "(rol borrado)" : u.rol || "—"])[1],
    datosRol = (v) => (v.startsWith("custom:") ? { rol: "custom", rolId: v.slice(7) } : { rol: v, rolId: null }),
    error = (e) => setAviso({ error: true, texto: "No se pudo: " + ((e && e.message) || e) });
  useEffect(
    () =>
      col().onSnapshot(
        (s) => setLista(s.docs.map((d) => ({ email: d.id, ...d.data() })).sort((a, b) => a.email.localeCompare(b.email))),
        (e) => error(e),
      ),
    [],
  );
  const agregar = async () => {
      const email = mailNormal(nuevo.email);
      if (!mailValido(email)) return setAviso({ error: true, texto: "Escribí un mail válido." });
      if (!nuevo.rol) return setAviso({ error: true, texto: "Elegí el rol." });
      if ((lista || []).some((u) => u.email === email)) return setAviso({ error: true, texto: "Ese mail ya está en la lista." });
      await col()
        .doc(email)
        .set({ nombre: nuevo.nombre.trim(), ...datosRol(nuevo.rol), activo: true, alta: Date.now(), altaPor: miEmail })
        .then(() => {
          setNuevo({ email: "", nombre: "", rol: "" });
          setAviso({ texto: "Listo. Avisale a " + email + " que entre a MIA, toque \"Primera vez: crear mi contraseña\" y confirme su mail." });
        }, error);
    },
    cambiar = (email, datos) => col().doc(email).set({ ...datos, modificado: Date.now(), modificadoPor: miEmail }, { merge: true }).catch(error),
    borrar = (email) => window.confirm("¿Sacar a " + email + " de MIA? Deja de tener acceso al instante.") && col().doc(email).delete().catch(error),
    blanquear = (email) =>
      firebaseAuth()
        .sendPasswordResetEmail(email)
        .then(
          () => setAviso({ texto: "Le mandamos a " + email + " un mail para poner una contraseña nueva." }),
          (e) =>
            setAviso({
              error: true,
              texto: e && e.code === "auth/user-not-found" ? email + " todavía no creó su contraseña: tiene que entrar y tocar \"Primera vez: crear mi contraseña\"." : textoErrorIngreso(e),
            }),
        ),
    celda = { padding: "7px 8px", borderBottom: "1px solid " + BORDER, fontSize: 12.5, verticalAlign: "middle" },
    entrada = { fontSize: 12.5, padding: "6px 8px", border: "1px solid #D0D0D0", borderRadius: 6, background: "#fff", color: TEXT },
    chico = { border: "1px solid " + BORDER, background: "#fff", color: TEXT, borderRadius: 6, padding: "3px 8px", fontSize: 11.5, cursor: "pointer", whiteSpace: "nowrap" };
  return React.createElement(
    "div",
    {
      style: { position: "fixed", inset: 0, background: "rgba(20,20,20,0.5)", zIndex: 400, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflowY: "auto" },
      onMouseDown: (e) => e.target === e.currentTarget && onClose(),
    },
    React.createElement(
      "div",
      { role: "dialog", "aria-label": "Usuarios", style: { background: "#fff", borderRadius: 12, width: "100%", maxWidth: 860, padding: "18px 20px", boxShadow: "0 12px 40px rgba(0,0,0,.25)", color: TEXT } },
      React.createElement(
        "div",
        { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
        React.createElement("div", { style: { fontSize: 17, fontWeight: 700 } }, "Usuarios"),
        React.createElement("button", { onClick: onClose, style: { border: "none", background: "none", fontSize: 18, cursor: "pointer", color: MUTED } }, "✕"),
      ),
      React.createElement(
        "div",
        { style: { color: MUTED, fontSize: 12.5, marginBottom: 12, lineHeight: 1.5 } },
        "Solo entran a MIA los mails de esta lista que estén activos. Cada persona elige su contraseña la primera vez (\"Primera vez: crear mi contraseña\") y confirma su mail. Las contraseñas no las ve nadie. Los permisos de cada rol se arman en Herramientas → Roles.",
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12, padding: 10, background: "#F7F7F5", borderRadius: 8 } },
        React.createElement("input", { type: "email", placeholder: "Mail", value: nuevo.email, onChange: (e) => setNuevo({ ...nuevo, email: e.target.value }), style: { ...entrada, width: 230 } }),
        React.createElement("input", { placeholder: "Nombre", value: nuevo.nombre, onChange: (e) => setNuevo({ ...nuevo, nombre: e.target.value }), style: { ...entrada, width: 160 } }),
        React.createElement(
          "select",
          { value: nuevo.rol, onChange: (e) => setNuevo({ ...nuevo, rol: e.target.value }), style: entrada },
          React.createElement("option", { value: "" }, "Rol…"),
          opciones.map((o) => React.createElement("option", { key: o[0], value: o[0] }, o[1])),
        ),
        React.createElement("button", { onClick: agregar, style: { ...chico, background: GOLD, border: "none", fontWeight: 700, padding: "6px 12px", fontSize: 12.5 } }, "Agregar usuario"),
      ),
      aviso && React.createElement("div", { style: { fontSize: 12.5, marginBottom: 10, color: aviso.error ? "#CF222E" : "#1A7F37" } }, aviso.texto),
      lista === null
        ? React.createElement("div", { style: { color: MUTED, fontSize: 13 } }, "Cargando…")
        : React.createElement(
            "div",
            { style: { overflowX: "auto" } },
            React.createElement(
              "table",
              { style: { width: "100%", borderCollapse: "collapse" } },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  ["Mail", "Nombre", "Rol", "Activo", "Actividad", ""].map((t) => React.createElement("th", { key: t, style: { ...celda, textAlign: "left", fontSize: 11.5, color: MUTED, fontWeight: 600 } }, t)),
                ),
              ),
              React.createElement(
                "tbody",
                null,
                lista.map((u) => {
                  const yo = u.email === miEmail;
                  return React.createElement(
                    "tr",
                    { key: u.email, style: { opacity: u.activo === false ? 0.5 : 1 } },
                    React.createElement("td", { style: celda }, u.email, yo && React.createElement("span", { style: { color: MUTED } }, " (vos)")),
                    React.createElement(
                      "td",
                      { style: celda },
                      React.createElement("input", { defaultValue: u.nombre || "", onBlur: (e) => e.target.value.trim() !== (u.nombre || "") && cambiar(u.email, { nombre: e.target.value.trim() }), style: { ...entrada, width: 140 } }),
                    ),
                    React.createElement(
                      "td",
                      { style: celda },
                      yo
                        ? nombreRol(u)
                        : React.createElement(
                            "select",
                            { value: valorRol(u), onChange: (e) => cambiar(u.email, datosRol(e.target.value)), style: entrada },
                            !opciones.some((o) => o[0] === valorRol(u)) && React.createElement("option", { value: valorRol(u) }, nombreRol(u)),
                            opciones.map((o) => React.createElement("option", { key: o[0], value: o[0] }, o[1])),
                          ),
                    ),
                    React.createElement(
                      "td",
                      { style: celda },
                      React.createElement("input", { type: "checkbox", checked: u.activo !== false, disabled: yo, onChange: (e) => cambiar(u.email, { activo: e.target.checked }), title: yo ? "No te podés desactivar a vos mismo" : "Destildá para cortarle el acceso" }),
                    ),
                    React.createElement(
                      "td",
                      { style: { ...celda, whiteSpace: "nowrap" } },
                      (() => {
                        // Sección 130: en línea / última vez de cada persona (como en Roles).
                        const a = estadoDeActividad((presencia || {})["mail:" + u.email]);
                        return React.createElement(
                          "span",
                          { style: { display: "inline-flex", alignItems: "center", gap: 6, color: a.online ? "#1A7F37" : MUTED } },
                          React.createElement("span", { style: { width: 8, height: 8, borderRadius: "50%", background: a.online ? "#3CB371" : "#C9C4B8", display: "inline-block" } }),
                          a.online ? "En línea ahora" : a.texto === "Sin actividad registrada" ? "Todavía no entró" : a.texto.replace("Última vez: ", ""),
                        );
                      })(),
                    ),
                    React.createElement(
                      "td",
                      { style: { ...celda, textAlign: "right" } },
                      React.createElement("button", { onClick: () => blanquear(u.email), style: chico, title: "Le llega un mail para poner una contraseña nueva" }, "Mandar mail para blanquear"),
                      !yo && React.createElement("button", { onClick: () => borrar(u.email), style: { ...chico, marginLeft: 6, color: "#CF222E" } }, "Sacar"),
                    ),
                  );
                }),
              ),
            ),
          ),
    ),
  );
}
