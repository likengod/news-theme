import { t as e } from "./jsx-runtime-CF8L0Gwd.js";
var t = e();
function n({ label: e, value: n, onChange: r, type: i = `text`, placeholder: a }) {
  return (0, t.jsxs)(`div`, {
    children: [
      (0, t.jsx)(`label`, {
        className: `mb-1 block text-xs font-medium text-slate-700`,
        children: e,
      }),
      (0, t.jsx)(`input`, {
        type: i,
        value: n,
        placeholder: a,
        onChange: (e) => r(e.target.value),
        className: `w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none`,
      }),
    ],
  });
}
export { n as t };
