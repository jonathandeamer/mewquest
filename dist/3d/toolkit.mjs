// Shared building blocks for the 3D garden: colour handling, cached materials, unit shapes and painted textures.
// three.js r128 is loaded as a classic script before any module, so it is read from the global here.
const THREE = globalThis.THREE;
export { THREE };

export const lin = c => new THREE.Color(c).convertSRGBToLinear();
// Characters get a soft warm rim light so they pop from the garden; setRim(true) while building them.
let RIM = 0;
export const setRim = on => { RIM = on ? 1 : 0; };
const rimHook = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <tonemapping_fragment>', 'float rimF = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 2.6);\ngl_FragColor.rgb += vec3(1.0, 0.95, 0.82) * rimF * 0.3;\n#include <tonemapping_fragment>'); };
const mats = {};
// M: lit material from a hex colour, cached. MB: unlit (for eyes, sparkles and far scenery).
export const M = (c, o) => { const k = c + (RIM ? 'r' : '') + (o ? JSON.stringify(o) : ''); if (mats[k]) return mats[k]; const m = new THREE.MeshStandardMaterial(Object.assign({ color: lin(c), roughness: .8, metalness: 0 }, o)); if (RIM) m.onBeforeCompile = rimHook; return mats[k] = m; };
export const MB = (c, o) => { const k = 'b' + c + (o ? JSON.stringify(o) : ''); return mats[k] || (mats[k] = new THREE.MeshBasicMaterial(Object.assign({ color: lin(c) }, o))); };
// Shared unit geometries; every part is a scaled copy of one of these.
export const SPH = new THREE.SphereGeometry(1, 28, 18), SPHL = new THREE.SphereGeometry(1, 14, 10), CYL = new THREE.CylinderGeometry(1, 1, 1, 14), CONE = new THREE.ConeGeometry(1, 1, 12), BOX = new THREE.BoxGeometry(1, 1, 1),
  TOR = new THREE.TorusGeometry(1, 0.18, 8, 22), HEMI = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.56),
  TAPER = new THREE.CylinderGeometry(0.86, 1, 1, 16), TAPER2 = new THREE.CylinderGeometry(0.68, 1, 1, 16), ARC = new THREE.TorusGeometry(1, 0.2, 6, 14, Math.PI), OCT = new THREE.OctahedronGeometry(1);
const UP = new THREE.Vector3(0, 1, 0);
export const V = (x, y, z) => new THREE.Vector3(x, y, z);

// mk: add a scaled, positioned mesh to a parent group and return it.
export function mk(geo, mat, par, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); par.add(m);
  return m;
}
// limb: a capsule from point a to point b with radius r.
export function limb(par, mat, a, b, r) {
  const d = b.clone().sub(a), len = d.length(), m = mk(CYL, mat, par, (a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2, r, len, r);
  m.quaternion.setFromUnitVectors(UP, d.normalize()); mk(SPH, mat, par, a.x, a.y, a.z, r, r, r); mk(SPH, mat, par, b.x, b.y, b.z, r, r, r); return m;
}
// Seeded random numbers, so the garden is laid out the same way every time.
let seed = 20261110;
export const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export function canvasTex(w, h, draw) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
export const brickTex = canvasTex(128, 128, (x) => { x.fillStyle = '#d6a888'; x.fillRect(0, 0, 128, 128); x.strokeStyle = '#efdcc2'; x.lineWidth = 5; for (let r = 0; r < 4; r++) { const y = r * 32; x.beginPath(); x.moveTo(0, y); x.lineTo(128, y); x.stroke(); for (let c = 0; c < 3; c++) { const bx = c * 64 + (r % 2 ? 32 : 0); x.beginPath(); x.moveTo(bx, y); x.lineTo(bx, y + 32); x.stroke(); } } x.fillStyle = '#c9967a55'; for (let i = 0; i < 9; i++) x.fillRect((i * 53) % 128, (i * 37) % 128, 26, 10); });
export const woodTex = canvasTex(128, 128, (x) => { x.fillStyle = '#c99f6c'; x.fillRect(0, 0, 128, 128); x.strokeStyle = '#a97f52'; x.lineWidth = 4; for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, 128); x.stroke(); } x.strokeStyle = '#b98e5e'; x.lineWidth = 2; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(8 + i * 21, 20 + i * 9); x.lineTo(8 + i * 21, 60 + i * 9); x.stroke(); } });
export const checkTex = canvasTex(64, 64, (x) => { x.fillStyle = '#ad5a40'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#ecd9b6'; x.fillRect(0, 0, 64, 14); x.fillRect(0, 0, 14, 64); x.fillStyle = '#f7ead0'; x.fillRect(0, 0, 14, 14); x.fillStyle = '#7d3b2c'; x.fillRect(36, 14, 8, 50); x.fillRect(14, 36, 50, 8); });
export const rep = (tex, rx, ry) => { const t = tex.clone(); t.repeat.set(rx, ry); t.needsUpdate = true; return t; };
export const texMat = (tex, rx, ry, c = '#ffffff') => new THREE.MeshStandardMaterial({ color: lin(c), map: rep(tex, rx, ry), roughness: .85, metalness: 0 });
export const soilTex = canvasTex(128, 128, (x) => { const g = x.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, '#c9935f'); g.addColorStop(.5, '#b47f51'); g.addColorStop(1, '#8f6240'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.fillStyle = '#a06f47'; for (let i = 0; i < 5; i++) x.fillRect(0, 22 + i * 24 + (i % 2) * 5, 128, 3); x.fillStyle = '#dcb88c'; for (let i = 0; i < 14; i++) { x.beginPath(); x.ellipse((i * 47) % 128, 14 + (i * 31) % 104, 5, 3, 0, 0, 7); x.fill(); } });
export const roofTex = canvasTex(128, 128, (x) => { x.fillStyle = '#d2694c'; x.fillRect(0, 0, 128, 128); for (let r = 0; r < 4; r++) for (let c = -1; c < 4; c++) { const cx = c * 32 + (r % 2 ? 16 : 0) + 16, cy = r * 32; x.fillStyle = (r + c) % 2 ? '#c85f44' : '#dd7656'; x.beginPath(); x.arc(cx, cy, 16, 0, Math.PI); x.fill(); x.strokeStyle = '#a84a34'; x.lineWidth = 2.5; x.beginPath(); x.arc(cx, cy, 16, 0, Math.PI); x.stroke(); } });
