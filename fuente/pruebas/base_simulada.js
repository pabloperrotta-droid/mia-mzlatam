// Base de datos simulada (en memoria) para las pruebas de pantalla: reemplaza a Firebase, así la
// prueba no lee ni escribe nada real. La app arranca con sus datos de ejemplo (SEED_*).
(function () {
  const docSnap = (id, data) => ({ id, exists: data !== undefined, data: () => data, get: (k) => (data || {})[k] });
  const colSnap = { docs: [], empty: true, size: 0, forEach() {} };
  const docRef = (path) => ({
    id: String(path).split("/").pop(),
    onSnapshot(ok) {
      // El estado principal existe (vacío) para que la app use sus datos de ejemplo.
      setTimeout(() => ok(docSnap(path, /app\/state$/.test(path) ? {} : undefined)), 0);
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
  window.firebase = {
    apps: [],
    initializeApp() {
      this.apps.push({});
      return {};
    },
    auth: () => ({ currentUser: { uid: "prueba" }, signInAnonymously: async () => ({}) }),
    firestore,
  };
  // Entra como Admin, salvo que la dirección termine en #pin (para ver la pantalla del PIN).
  try {
    location.hash === "#pin" ? localStorage.removeItem("obras-role") : localStorage.setItem("obras-role", "admin");
  } catch {}
})();
