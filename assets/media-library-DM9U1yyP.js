var e = `nt_media_library_v1`;
function t() {
  if (typeof window > `u`) return [];
  try {
    return JSON.parse(localStorage.getItem(e) || `[]`);
  } catch {
    return [];
  }
}
function n(t) {
  try {
    (localStorage.setItem(e, JSON.stringify(t)),
      window.dispatchEvent(new Event(`media-library-change`)));
  } catch (e) {
    console.warn(`Media library quota exceeded`, e);
  }
}
var r = {
  list() {
    return t().sort((e, t) => t.createdAt - e.createdAt);
  },
  add(e) {
    let r = {
      ...e,
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    return (n([r, ...t()]), r);
  },
  update(e, r) {
    n(t().map((t) => (t.id === e ? { ...t, ...r } : t)));
  },
  remove(e) {
    n(t().filter((t) => t.id !== e));
  },
  clear() {
    n([]);
  },
};
function i(e) {
  return new Promise((t, n) => {
    let r = new FileReader();
    ((r.onload = () => t(String(r.result))), (r.onerror = () => n(r.error)), r.readAsDataURL(e));
  });
}
async function a(e, t = `other`) {
  let n = await i(e);
  return r.add({
    name: e.name,
    type: e.type || `application/octet-stream`,
    size: e.size,
    dataUrl: n,
    usage: t,
  });
}
function o(e) {
  return e < 1024
    ? `${e} B`
    : e < 1024 * 1024
      ? `${(e / 1024).toFixed(1)} KB`
      : `${(e / (1024 * 1024)).toFixed(2)} MB`;
}
export { r as n, a as r, o as t };
