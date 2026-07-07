/** Utilidades DOM compartidas */

export const $ = (sel, root = document) => root.querySelector(sel);

export function crearToast(selector, duracionMs = 2500) {
  function toast(msg) {
    const el = $(selector);
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      el.hidden = true;
    }, duracionMs);
  }
  return toast;
}
