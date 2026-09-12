import { n as e, t } from "./createServerFn-Ciss0-sp.js";
import { t as n } from "./auth-middleware-JDjVgB0Q.js";
var r = `nt:journalist-ranks:v1`,
  i = [
    { id: `bronze`, name: `Bronze`, minNews: 100, pointsPerNews: 10, color: `amber`, builtin: !0 },
    { id: `silver`, name: `Silver`, minNews: 500, pointsPerNews: 20, color: `slate`, builtin: !0 },
    { id: `gold`, name: `Gold`, minNews: 1e3, pointsPerNews: 30, color: `amber`, builtin: !0 },
    { id: `diamond`, name: `Diamond`, minNews: 8e3, pointsPerNews: 50, color: `sky`, builtin: !0 },
  ],
  a = t({ method: `GET` }).handler(
    e(`867f8fd34f32acecfe9ec627f5b33ef8762a5eabab40b2b297e14b09e6fd5382`),
  ),
  o = t({ method: `POST` })
    .middleware([n])
    .handler(e(`35a302f18de1d0793e7e730eeef2831b0cc516d86513b175f171d21a439cfea8`));
function s() {
  if (typeof window > `u`) return i;
  try {
    let e = localStorage.getItem(r);
    if (!e) return i;
    let t = JSON.parse(e);
    return !Array.isArray(t) || t.length === 0 ? i : [...t].sort((e, t) => e.minNews - t.minNews);
  } catch {
    return i;
  }
}
function c(e) {
  (typeof window < `u` && localStorage.setItem(r, JSON.stringify(e)),
    o({ data: e }).catch(() => {}));
}
function l(e, t = s()) {
  let n = [...t].sort((e, t) => e.minNews - t.minNews),
    r = null;
  for (let t of n) e >= t.minNews && (r = t);
  return r;
}
function u(e, t = s()) {
  return [...t].sort((e, t) => e.minNews - t.minNews).find((t) => e < t.minNews) ?? null;
}
export { c as a, l as i, s as n, u as r, a as t };
