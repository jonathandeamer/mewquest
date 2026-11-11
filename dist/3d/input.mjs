// Keyboard and touch controls. Keyboard: arrows/WASD move, Space or C jumps, Shift or X dashes,
// R rests, Escape or P pauses, Enter starts. Touch: a floating thumb stick on the left half of the
// screen and Jump, Dash and Rest buttons on the right. Each finger is tracked separately.
const KEYMAP = { ArrowLeft: 'l', a: 'l', ArrowRight: 'r', d: 'r', ArrowUp: 'u', w: 'u', ArrowDown: 'd', s: 'd', ' ': 'jump', c: 'jump', x: 'dash', Shift: 'dash' };
export const keyAction = key => key ? (KEYMAP[key] || KEYMAP[key.toLowerCase()] || null) : null;
const STICK_RANGE = 46; // pixels from the touch point to full speed

// hooks: inMenu(), isPaused(), start(), togglePause(), rest(), onTouch()
export function createInput(hooks) {
  const $ = q => document.querySelector(q);
  const keys = {}, touch = { x: 0, y: 0, jump: false, dash: false }, state = { x: 0, y: 0, jump: false, dash: false };
  const zone = $('#stickzone'), stick = $('#stick'), knob = stick.firstElementChild;
  let stickId = null, sx0 = 0, sy0 = 0;

  addEventListener('keydown', e => {
    if (!e.key) return;
    if (hooks.inMenu()) { if (e.key === 'Enter' && !e.repeat) { e.preventDefault(); hooks.start(); } return; }
    if (e.key === 'Escape' || e.key.toLowerCase() === 'p') { if (!e.repeat) hooks.togglePause(); return; }
    if (e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
    const k = keyAction(e.key); if (k) { e.preventDefault(); keys[k] = true; }
    if (e.key.toLowerCase() === 'r' && !e.repeat && !hooks.isPaused()) hooks.rest();
  });
  addEventListener('keyup', e => { const k = keyAction(e.key); if (k) keys[k] = false; });

  zone.addEventListener('pointerdown', e => {
    if (stickId !== null) return;
    e.preventDefault(); stickId = e.pointerId;
    try { zone.setPointerCapture(e.pointerId); } catch (_) { /* older browsers */ }
    const r = zone.getBoundingClientRect(); sx0 = e.clientX; sy0 = e.clientY;
    stick.classList.add('live'); stick.style.left = (e.clientX - r.left) + 'px'; stick.style.top = (e.clientY - r.top) + 'px';
  });
  zone.addEventListener('pointermove', e => {
    if (e.pointerId !== stickId) return;
    let dx = e.clientX - sx0, dy = e.clientY - sy0; const l = Math.hypot(dx, dy);
    if (l > STICK_RANGE) { dx *= STICK_RANGE / l; dy *= STICK_RANGE / l; }
    touch.x = dx / STICK_RANGE; touch.y = -dy / STICK_RANGE; knob.style.transform = `translate(${dx}px,${dy}px)`;
  });
  const stickEnd = e => { if (e.pointerId !== stickId) return; stickId = null; touch.x = touch.y = 0; knob.style.transform = ''; stick.classList.remove('live'); stick.style.left = stick.style.top = ''; };
  zone.addEventListener('pointerup', stickEnd); zone.addEventListener('pointercancel', stickEnd);

  for (const k of ['jump', 'dash']) {
    const b = $('#' + k), up = () => { touch[k] = false; b.classList.remove('down'); };
    b.addEventListener('pointerdown', e => { e.preventDefault(); touch[k] = true; b.classList.add('down'); try { b.setPointerCapture(e.pointerId); } catch (_) { /* older browsers */ } });
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
  }
  $('#rest').addEventListener('click', () => { if (!hooks.isPaused()) hooks.rest(); });
  addEventListener('pointerdown', e => { if (e.pointerType === 'touch') hooks.onTouch(); }, true);
  addEventListener('contextmenu', e => e.preventDefault());

  // Merge keyboard and touch into one movement vector and two buttons.
  function read() {
    const kx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), ky = (keys.u ? 1 : 0) - (keys.d ? 1 : 0);
    state.x = kx || touch.x; state.y = ky || touch.y; state.jump = !!keys.jump || touch.jump; state.dash = !!keys.dash || touch.dash;
    return state;
  }
  // Let go of everything, e.g. on pause or when the window loses focus.
  function clear() {
    for (const k in keys) keys[k] = false;
    touch.x = touch.y = 0; touch.jump = touch.dash = false;
    stickId = null; stick.classList.remove('live'); knob.style.transform = ''; stick.style.left = stick.style.top = '';
    document.querySelectorAll('#pad .down').forEach(b => b.classList.remove('down'));
  }
  return { read, clear };
}
