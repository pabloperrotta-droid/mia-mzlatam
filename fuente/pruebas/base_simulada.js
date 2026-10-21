// Base de datos simulada (en memoria) para las pruebas de pantalla: reemplaza a Firebase, así la
// prueba no lee ni escribe nada real. La app arranca con sus datos de ejemplo (SEED_*).
(function () {
  const docSnap = (id, data) => ({ id, exists: data !== undefined, data: () => data, get: (k) => (data || {})[k] });
  const colSnap = { docs: [], empty: true, size: 0, forEach() {} };
  const docRef = (path) => ({
    id: String(path).split("/").pop(),
    onSnapshot(ok) {
      // El estado principal existe (vacío) para que la app use sus datos de ejemplo.
      // Sección 129: el usuario de prueba del ingreso por mail.
      const dato = /app\/state$/.test(path) ? {} : /usuarios\/admin@prueba\.com$/.test(path) ? { rol: "admin", nombre: "Prueba", activo: true } : undefined;
      setTimeout(() => ok(docSnap(path, dato)), 0);
      return () => {};
    },
    get: async () => docSnap(path, undefined),
    set: async () => {},
    update: async () => {},
    delete: async () => {},
    collection: (c) => colRef(path + "/" + c),
  });
  const consulta = (p) => ({
    orderBy: () => consulta(p),
    where: () => consulta(p),
    limit: () => consulta(p),
    onSnapshot(ok) {
      setTimeout(() => ok(colSnap), 0);
      return () => {};
    },
    get: async () => colSnap,
  });
  const colRef = (p) => ({ ...consulta(p), doc: (id) => docRef(p + "/" + (id || "nuevo")), add: async () => docRef(p + "/nuevo") });
  const db = {
    doc: docRef,
    collection: colRef,
    batch: () => ({ set() {}, update() {}, delete() {}, commit: async () => {} }),
    runTransaction: async (fn) => fn({ get: async () => docSnap("", undefined), set() {}, update() {}, delete() {} }),
  };
  const firestore = () => db;
  firestore.FieldPath = function (...a) {
    this.partes = a;
  };
  firestore.FieldValue = { delete: () => ({ __borrar__: true }) };
  // Sección 129: con #mail se prueba el ingreso con mail (usuario admin@prueba.com, contraseña clave123).
  // Sin #mail la app de QA entra directo, como antes (sin pantalla de ingreso).
  window.__MIA_SIN_LOGIN_MAIL__ = location.hash !== "#mail";
  const avisos = [];
  const authMail = {
    currentUser: null,
    onAuthStateChanged(cb) {
      avisos.push(cb);
      setTimeout(() => cb(authMail.currentUser), 0);
      return () => {};
    },
    async signInWithEmailAndPassword(email, clave) {
      if (email !== "admin@prueba.com" || clave !== "clave123") throw { code: "auth/invalid-credential" };
      authMail.currentUser = { email, emailVerified: true, isAnonymous: false, getIdToken: async () => "t", reload: async () => {} };
      avisos.forEach((cb) => cb(authMail.currentUser));
    },
    async signOut() {
      authMail.currentUser = null;
      avisos.forEach((cb) => cb(null));
    },
    async sendPasswordResetEmail() {},
  };
  window.firebase = {
    apps: [],
    initializeApp() {
      this.apps.push({});
      return {};
    },
    auth: () => (location.hash === "#mail" ? authMail : { currentUser: { uid: "prueba" }, signInAnonymously: async () => ({}) }),
    firestore,
  };
  // Entra como Admin, salvo que la dirección termine en #pin (para ver la pantalla del PIN).
  try {
    location.hash === "#pin" ? localStorage.removeItem("obras-role") : localStorage.setItem("obras-role", "admin");
  } catch {}
})();
