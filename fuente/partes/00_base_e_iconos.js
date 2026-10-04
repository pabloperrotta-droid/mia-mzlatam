const { useState, useEffect, useLayoutEffect, useMemo, useRef } = React,
  { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Legend } =
    Recharts,
  FIREBASE_CONFIG = {
    apiKey: "AIzaSyAz_ql2MYUmY3JrwWNaM0dssn_4_EZ8u8c",
    authDomain: "mzlatam-app.firebaseapp.com",
    projectId: "mzlatam-app",
    storageBucket: "mzlatam-app.firebasestorage.app",
    messagingSenderId: "731320227889",
    appId: "1:731320227889:web:72d08191f0a50c8a40dd10",
    measurementId: "G-LY33GDVKWX",
  },
  APP_ENV = (typeof window < "u" && window.__APP_ENV__) || "prod",
  COL_PREFIX = APP_ENV === "qa" ? "qa_" : "";
function scopedDb(n) {
  return !COL_PREFIX || !n
    ? n
    : {
        doc: (d) => {
          const c = String(d).split("/");
          return ((c[0] = COL_PREFIX + c[0]), n.doc(c.join("/")));
        },
        collection: (d) => n.collection(COL_PREFIX + d),
      };
}
function ChevronRight({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", { d: "m9 18 6-6-6-6" }),
  );
}
function Plus({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", { d: "M5 12h14" }),
    React.createElement("path", { d: "M12 5v14" }),
  );
}
function X({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", { d: "M18 6 6 18" }),
    React.createElement("path", { d: "m6 6 12 12" }),
  );
}
function PieIcon({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", {
      d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
    }),
    React.createElement("path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83" }),
  );
}
function ArrowLeft({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", { d: "m12 19-7-7 7-7" }),
    React.createElement("path", { d: "M19 12H5" }),
  );
}
function Upload({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    React.createElement("polyline", { points: "17 8 12 3 7 8" }),
    React.createElement("line", { x1: "12", x2: "12", y1: "3", y2: "15" }),
  );
}
function Pencil({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
    }),
    React.createElement("path", { d: "m15 5 4 4" }),
  );
}
function Trash2({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", { d: "M3 6h18" }),
    React.createElement("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
    React.createElement("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
    React.createElement("line", { x1: "10", x2: "10", y1: "11", y2: "17" }),
    React.createElement("line", { x1: "14", x2: "14", y1: "11", y2: "17" }),
  );
}
function Eye({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
    }),
    React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
  );
}
function Download({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    React.createElement("polyline", { points: "7 10 12 15 17 10" }),
    React.createElement("line", { x1: "12", x2: "12", y1: "15", y2: "3" }),
  );
}
function Paperclip({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", {
      d: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",
    }),
  );
}
function MessageSquare({ size: n = 24, ...d }) {
  return React.createElement(
    "svg",
    {
      width: n,
      height: n,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...d,
    },
    React.createElement("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }),
  );
}
