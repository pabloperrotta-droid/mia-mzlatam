function normalizarTexto(n) {
  return String(n || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}
function distanciaLevenshtein(n, d) {
  const c = n.length,
    p = d.length;
  if (c === 0) return p;
  if (p === 0) return c;
  let g = new Array(p + 1),
    C = new Array(p + 1);
  for (let S = 0; S <= p; S++) g[S] = S;
  for (let S = 1; S <= c; S++) {
    C[0] = S;
    for (let f = 1; f <= p; f++) {
      const F = n[S - 1] === d[f - 1] ? 0 : 1;
      C[f] = Math.min(C[f - 1] + 1, g[f] + 1, g[f - 1] + F);
    }
    [g, C] = [C, g];
  }
  return g[p];
}
function resolverConCoincidencia(n, d, c) {
  const p = String(n || "").trim();
  if (!p) return { valor: "", corregido: false };
  const g = normalizarTexto(p),
    C = (d || []).filter(Boolean),
    S = C.find((A) => normalizarTexto(A) === g);
  if (S) return { valor: S, corregido: S !== p };
  if (g.length < 5) return { valor: p, corregido: false };
  if (c && c[g] && C.some((A) => normalizarTexto(A) === normalizarTexto(c[g]))) {
    const A = C.find((k) => normalizarTexto(k) === normalizarTexto(c[g]));
    return { valor: A, corregido: normalizarTexto(A) !== g };
  }
  const f = g.length <= 4 ? 1 : g.length <= 8 ? 2 : 3,
    F = C.filter((A) => {
      const k = normalizarTexto(A);
      return k.includes(g) || g.includes(k) ? true : distanciaLevenshtein(k, g) <= f;
    });
  return F.length === 1 ? { valor: F[0], corregido: true } : { valor: p, corregido: false };
}
function viernesDeLaSemana(n) {
  const c = (5 - n.getDay() + 7) % 7,
    p = new Date(n);
  return (p.setDate(p.getDate() + c), p);
}
function tasaRegalias(anio, mesIdx) {
  const k = anio * 12 + mesIdx;
  return k <= 2027 * 12 + 5 ? 0.01 : k <= 2028 * 12 + 5 ? 0.015 : k <= 2029 * 12 + 5 ? 0.02 : 0.025;
}
function regaliasPorSemana(facturas, semanas) {
  const r = {};
  return (
    (semanas || []).forEach((s) => {
      const [dd, mm, yy] = String(s)
        .split("/")
        .map((x) => parseInt(x, 10));
      if (!(dd >= 1 && dd <= 7) || !mm || !yy) return;
      let m = mm - 2,
        y = yy;
      m < 0 && ((m = 11), (y -= 1));
      const base = (facturas || [])
          .filter((f) => {
            const p = String(f.fecha || "").split("/");
            return p.length === 3 && parseInt(p[1], 10) - 1 === m && parseInt(p[2], 10) === y;
          })
          .reduce((a, f) => a + (Number(f.importe) || 0), 0),
        tasa = tasaRegalias(y, m);
      r[s] = {
        clave: y + "-" + String(m + 1).padStart(2, "0"),
        mesNombre: MESES[m].charAt(0) + MESES[m].slice(1).toLowerCase() + " " + y,
        base,
        tasa,
        monto: Math.round(base * tasa * 100) / 100,
      };
    }),
    r
  );
}
function regaliaPendiente(mapa, pagadas, s) {
  const x = mapa[s];
  return x && !(pagadas || {})[x.clave] ? x.monto : 0;
}
function generarSemanas(n, d) {
  const c = viernesDeLaSemana(fechaAObjetoDate(n) || /* @__PURE__ */ new Date()),
    p = [];
  for (let g = 0; g < d; g++) {
    const C = new Date(c);
    (C.setDate(C.getDate() + g * 7), p.push(dateAFechaStr(C)));
  }
  return p;
}
function moverSemanas(n, d) {
  const c = fechaAObjetoDate(n) || /* @__PURE__ */ new Date(),
    p = new Date(c);
  return (p.setDate(p.getDate() + d * 7), dateAFechaStr(viernesDeLaSemana(p)));
}
function semanaLabelCorta(n) {
  const d = n.split("/");
  return d[0] + "/" + d[1];
}
function fechaComercialHoy() {
  const n = /* @__PURE__ */ new Date(),
    d = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  n.getHours() < 9 && d.setDate(d.getDate() - 1);
  const c = d.getFullYear(),
    p = String(d.getMonth() + 1).padStart(2, "0"),
    g = String(d.getDate()).padStart(2, "0");
  return c + "-" + p + "-" + g;
}
function dataUrlToBlob(n) {
  const [d, c] = n.split(","),
    p = d.match(/:(.*?);/),
    g = p ? p[1] : "application/pdf",
    C = atob(c),
    S = new Uint8Array(C.length);
  for (let f = 0; f < C.length; f++) S[f] = C.charCodeAt(f);
  return new Blob([S], { type: g });
}
function dataUrlToBlobUrl(n) {
  try {
    return URL.createObjectURL(dataUrlToBlob(n));
  } catch {
    return n;
  }
}
async function ofrecerDescarga(n, d) {
  try {
    if (window.claude && window.claude.use) {
      const C = await window.claude.use("downloads");
      if (C) {
        await C.save({ filename: n, data: d });
        return;
      }
    }
    const c = d instanceof Blob ? d : new Blob([d], { type: "application/octet-stream" }),
      p = URL.createObjectURL(c),
      g = document.createElement("a");
    ((g.href = p),
      (g.download = n),
      document.body.appendChild(g),
      g.click(),
      document.body.removeChild(g),
      setTimeout(() => URL.revokeObjectURL(p), 4e3));
  } catch (c) {
    (!c || c.code !== "declined") && alert('No se pudo descargar "' + n + '".');
  }
}
function descargarLibroXlsx(n, d) {
  const c = XLSX.write(n, { bookType: "xlsx", type: "array" });
  ofrecerDescarga(d, new Blob([c], { type: "application/octet-stream" }));
}
