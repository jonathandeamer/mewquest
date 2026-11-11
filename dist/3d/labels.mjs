// Name tags and speech bubbles: HTML elements pinned to points in the 3D garden.
import { THREE } from './toolkit.mjs';

export function createLabels(box, camera) {
  const labels = [], tmp = new THREE.Vector3();
  // show() decides visibility each frame; text() (optional) supplies changing text such as a greeting.
  function add(cls, text, pos, show, textFn) {
    const el = document.createElement('div'); el.className = cls; el.textContent = text; el.hidden = true; box.appendChild(el);
    const l = { el, pos, show, text, textFn }; labels.push(l); return l;
  }
  function update(W, H) {
    for (const l of labels) {
      let vis = l.show();
      if (vis) { tmp.copy(l.pos).project(camera); vis = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.15; }
      if (l.el.hidden !== !vis) l.el.hidden = !vis;
      if (!vis) continue;
      if (l.textFn) { const t = l.textFn(); if (t !== l.text) l.el.textContent = l.text = t; }
      // Keep bubbles on screen and below the HUD.
      const m = l.el.classList.contains('bubble') ? Math.min(130, W / 2) : 30;
      const x = Math.max(m, Math.min(W - m, (tmp.x * .5 + .5) * W)), y = Math.max(54, (-tmp.y * .5 + .5) * H);
      l.el.style.transform = `translate(-50%,-100%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
    }
  }
  return { add, update };
}
