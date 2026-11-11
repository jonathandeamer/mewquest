// Mew, the garden cats, Jenn, Samuel and Mark, built from simple rounded shapes.
import { THREE, M, MB, mk, limb, V, SPH, CYL, CONE, BOX, TOR, HEMI, TAPER, TAPER2, ARC, texMat, checkTex } from './toolkit.mjs';

export function buildCat(c, sit) {
  const g = new THREE.Group(), body = new THREE.Group(), head = new THREE.Group(), tail = new THREE.Group(); g.add(body);
  const fur = M(c.fur), light = M(c.light), stripe = M(c.stripe), toe = M(c.toes || c.fur), pink = M('#e9a394'), eyeM = MB(c.eye || '#e6a92e'), black = MB('#3a2e28'), white = MB('#fffdf5');
  const u = g.userData = { legs: [], eyes: [], head, tail, body, sit };
  mk(SPH, fur, head, 0, 0, 0, .235, .2, .2);
  for (const s of [-1, 1]) {
    const e = mk(CONE, fur, head, s * .135, .19, -.01, .085, .18, .06); e.rotation.z = -s * .28; const i = mk(CONE, pink, head, s * .135, .18, .025, .048, .11, .03); i.rotation.z = -s * .28;
    const eye = new THREE.Group(); eye.position.set(s * .098, .028, .163); head.add(eye); u.eyes.push(eye); mk(SPH, eyeM, eye, 0, 0, 0, .056, .062, .03); mk(SPH, black, eye, 0, 0, .023, .034, .045, .012); mk(SPH, white, eye, s * .014, .022, .034, .017, .017, .007); mk(SPH, white, eye, -s * .012, -.02, .034, .008, .008, .005);
    for (const k of [0, 1]) { const w = mk(BOX, white, head, s * .21, -.05 - k * .03, .14, .15, .006, .006); w.rotation.z = s * (k ? -.16 : .1); w.rotation.y = -s * .35; }
  }
  mk(SPH, light, head, 0, -.058, .15, .118, .082, .08); mk(SPH, pink, head, 0, -.03, .228, .027, .02, .02);
  if (c.tabby) for (const k of [-1, 0, 1]) mk(SPH, stripe, head, k * .055, .168 - Math.abs(k) * .014, .075, .015, .03, .065);
  if (c.blaze) mk(SPH, light, head, 0, .05, .16, .045, .13, .045);
  if (!sit) {
    mk(SPH, fur, body, 0, .37, 0, .24, .22, .4);
    if (c.tabby) for (const z of [-.2, -.02, .16]) { const f = Math.sqrt(1 - (z / .4) ** 2); mk(SPH, stripe, body, 0, .395, z, .19 * f, .208 * f, .03); }
    if (c.bib) mk(SPH, light, body, 0, .31, .27, .16, .15, .15);
    for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { const leg = new THREE.Group(); leg.position.set(sx * .13, .3, sz * .25); body.add(leg); mk(CYL, fur, leg, 0, -.13, 0, .062, .26, .062); mk(SPH, toe, leg, 0, -.26, .02, .072, .05, .088); u.legs.push(leg); }
    tail.position.set(0, .46, -.35); for (let i = 0; i < 6; i++) mk(SPH, i > 3 && c.tip ? M(c.tip) : fur, tail, 0, i * .085, -i * .03 - i * i * .006, .055, .06, .055);
    head.position.set(0, .61, .36);
    if (c.collar) { const t = mk(TOR, M(c.collar), body, 0, .5, .27, .14, .14, .14); t.rotation.x = 1.0; }
  } else {
    mk(SPH, fur, body, 0, .33, -.06, .25, .33, .27);
    for (const s of [-1, 1]) { mk(SPH, fur, body, s * .19, .15, -.02, .13, .15, .2); mk(CYL, fur, body, s * .09, .2, .2, .058, .38, .058); mk(SPH, toe, body, s * .09, .045, .25, .072, .05, .092); mk(SPH, toe, body, s * .21, .04, .19, .065, .045, .09); }
    if (c.bib) mk(SPH, light, body, 0, .38, .14, .14, .2, .1);
    if (c.tabby) for (const y of [.3, .42]) mk(SPH, stripe, body, 0, y, -.08, .256, .03, .25);
    tail.position.set(0, .06, -.06); for (let i = 0; i < 7; i++) { const a = -2.3 + i * .42; mk(SPH, i > 4 && c.tip ? M(c.tip) : fur, tail, Math.cos(a) * .34, 0, Math.sin(a) * .3 + .02, .055, .055, .055); }
    head.position.set(0, .8, .1);
    if (c.collar) { const t = mk(TOR, M(c.collar), body, 0, .63, .07, .15, .15, .15); t.rotation.x = Math.PI / 2; mk(SPH, M('#e9c35a'), body, 0, .6, .22, .03, .035, .02); }
  }
  body.add(head); body.add(tail); return g;
}
export const CATS = {
  mew: { fur: '#e2903f', light: '#fbe3b8', stripe: '#b9652a', tabby: 1, eye: '#e6a92e' },
  rosie: { fur: '#a58c77', light: '#f6ebd9', stripe: '#67534a', toes: '#fffaf0', tabby: 1, eye: '#a6bd6c' },
  ernie: { fur: '#dc8b3d', light: '#f5d29a', stripe: '#ac602b', tabby: 1, collar: '#739ea8', eye: '#e6a92e' },
  darwin: { fur: '#926443', light: '#dcb68a', stripe: '#543b2a', tabby: 1, eye: '#d9b24a' },
  minka: { fur: '#2a3238', light: '#f7efe5', stripe: '#2a3238', bib: 1, collar: '#a66fb5', eye: '#e6c84a' },
  coco: { fur: '#34312f', light: '#fffaf0', stripe: '#34312f', toes: '#fffaf0', bib: 1, tip: '#fffaf0', blaze: 1, eye: '#8fc48a' },
};
function face(head, o) {
  const dark = MB(o.eye || '#5a3d2a'), pink = MB('#f3a99b'), white = MB('#fffdf5');
  for (const s of [-1, 1]) {
    if (o.closed) { const e = mk(ARC, dark, head, s * .11, -.035, .262, .045, .045, .05); e.rotation.x = -.15; }
    else { mk(SPH, dark, head, s * .11, -.02, .25, .043, .055, .03); mk(SPH, white, head, s * .124, .005, .277, .017, .017, .007); }
    mk(SPH, pink, head, s * .185, -.105, .205, .055, .034, .02);
    if (o.brow) { const b = mk(BOX, MB(o.brow), head, s * .11, .07, .262, .085, .02, .01); b.rotation.z = -s * .12; }
  }
  const sm = mk(ARC, MB('#a65f4e'), head, 0, -.105, .268, .062, .05, .05); sm.rotation.z = Math.PI;
  mk(SPH, M(o.nose || '#efc0a0'), head, 0, -.055, .285, .022, .018, .018);
}
export function buildSamuel() {
  const g = new THREE.Group(), skin = M('#f6d3b4'), tee = M('#6f9e45'), jeans = M('#5b7fa8'), shoe = M('#8a6248'), sole = M('#f4eee0'), hair = M('#e6bd5c'), dk = MB('#2f4a26');
  for (const s of [-1, 1]) { mk(SPH, sole, g, s * .12, .035, .05, .105, .035, .17); mk(SPH, shoe, g, s * .12, .085, .05, .1, .07, .165); limb(g, jeans, V(s * .12, .17, 0), V(s * .11, .62, 0), .095); mk(BOX, dk, g, s * .065, .98, .178, .07, .07, .02); mk(BOX, dk, g, s * .05, .845, .19, .042, .08, .02); }
  mk(BOX, dk, g, 0, .9, .187, .062, .1, .02);
  mk(TAPER, tee, g, 0, .86, 0, .235, .5, .19); mk(SPH, tee, g, 0, 1.1, 0, .225, .09, .18); mk(CYL, skin, g, 0, 1.17, 0, .07, .1, .07);
  limb(g, tee, V(-.25, 1.06, 0), V(-.31, .93, 0), .075); limb(g, skin, V(-.31, .93, 0), V(-.34, .68, .02), .055); mk(SPH, skin, g, -.345, .62, .02, .065, .07, .06);
  const wave = new THREE.Group(); wave.position.set(.25, 1.06, 0); g.add(wave);
  limb(wave, tee, V(0, 0, 0), V(.1, .08, 0), .075); limb(wave, skin, V(.1, .08, 0), V(.2, .36, 0), .055); mk(SPH, skin, wave, .22, .46, 0, .08, .095, .04);
  const head = new THREE.Group(); head.position.set(0, 1.44, 0); g.add(head);
  mk(SPH, skin, head, 0, 0, 0, .3, .29, .28); for (const s of [-1, 1]) mk(SPH, skin, head, s * .29, -.03, 0, .05, .065, .04);
  mk(HEMI, hair, head, 0, .03, -.02, .318, .31, .312);
  for (let i = -2; i <= 2; i++) { const t = mk(SPH, hair, head, i * .1, .19 - Math.abs(i) * .025, .2, .1, .075, .09); t.rotation.z = i * .3; }
  for (let i = 0; i < 9; i++) { const a = i * 2.4, r = .1 + (i % 3) * .07, t = mk(CONE, hair, head, Math.cos(a) * r, .31, Math.sin(a) * r - .03, .07, .14, .07); t.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .6); }
  face(head, { eye: '#6b4528' });
  g.userData = { wave, head }; return g;
}
export function buildJenn() {
  const g = new THREE.Group(), skin = M('#f6d0b0'), coat = M('#2f6b63'), hood = M('#b9b0a6'), tr = M('#5f444b'), boot = M('#8a5a3a'), beanie = M('#e58a8f'), hair = M('#8b5a3a');
  for (const s of [-1, 1]) { mk(SPH, M('#5a4030'), g, s * .17, .03, .29, .115, .03, .21); mk(SPH, boot, g, s * .17, .11, .28, .11, .1, .2); limb(g, tr, V(s * .17, .22, .22), V(s * .17, .58, .32), .11); limb(g, tr, V(s * .17, .58, .32), V(s * .15, .46, -.1), .125); }
  mk(TAPER2, coat, g, 0, .42, -.2, .42, .66, .35);
  const t = mk(SPH, coat, g, 0, .92, -.05, .31, .36, .26); t.rotation.x = .3;
  const col = mk(TOR, hood, g, 0, 1.17, .03, .17, .17, .2); col.rotation.x = Math.PI / 2 - .25;
  for (const y of [.98, .82]) mk(SPH, M('#7a5236'), g, .05, y, .2 + (1 - y) * .08, .028, .028, .02);
  limb(g, coat, V(-.3, 1.02, 0), V(-.44, .82, .28), .1); limb(g, coat, V(-.44, .82, .28), V(-.5, .68, .5), .09); mk(SPH, skin, g, -.52, .64, .63, .075, .035, .1);
  limb(g, coat, V(.3, 1.02, 0), V(.36, .8, .2), .1); limb(g, coat, V(.36, .8, .2), V(.22, .68, .36), .09); mk(SPH, skin, g, .18, .66, .4, .07, .06, .07);
  const head = new THREE.Group(); head.position.set(0, 1.45, .1); head.rotation.set(.14, 0, .08); g.add(head);
  mk(SPH, hair, head, 0, 0, -.05, .3, .29, .27); mk(SPH, skin, head, 0, 0, 0, .29, .28, .27);
  for (const s of [-1, 1]) mk(SPH, hair, head, s * .255, -.08, .09, .05, .15, .07);
  mk(SPH, hair, head, .12, -.02, -.34, .12, .13, .12); mk(SPH, hair, head, .2, -.17, -.43, .085, .15, .085);
  const hat = new THREE.Group(); hat.rotation.x = -.16; head.add(hat);
  mk(HEMI, beanie, hat, 0, .04, -.01, .325, .34, .315); const cuff = mk(TOR, M('#d9767d'), hat, 0, .1, -.01, .3, .3, .42); cuff.rotation.x = Math.PI / 2;
  face(head, { closed: 1, eye: '#6b4a38' });
  g.userData = { head }; return g;
}
export function buildMark() {
  const g = new THREE.Group(), skin = M('#f1cdae'), shirt = texMat(checkTex, 5, 3), sleeve = texMat(checkTex, 3, 2), jeans = M('#5d6770'), boot = M('#7a543a'), hair = M('#7a5438'), wood = M('#d08a3c'), dark = M('#5a3a26');
  for (const s of [-1, 1]) { mk(SPH, boot, g, s * .2, .1, .06, .15, .1, .24); limb(g, jeans, V(s * .2, .2, 0), V(s * .19, .95, 0), .17); }
  mk(TAPER, shirt, g, 0, 1.35, 0, .47, .85, .37); mk(SPH, shirt, g, 0, 1.75, 0, .45, .14, .33); mk(SPH, M('#f4ead8'), g, 0, 1.81, .12, .1, .06, .08); mk(CYL, skin, g, 0, 1.86, 0, .1, .12, .1);
  limb(g, M('#6b4a33'), V(-.34, 1.15, .32), V(.26, 1.82, .18), .032);
  const bass = new THREE.Group(); bass.position.set(-.05, 1.12, .42); bass.rotation.z = .45; g.add(bass);
  mk(SPH, wood, bass, 0, 0, 0, .36, .27, .08); mk(SPH, wood, bass, .22, .13, 0, .18, .14, .075); mk(SPH, dark, bass, .02, -.03, .05, .2, .14, .045);
  mk(BOX, dark, bass, .78, 0, .02, 1.0, .07, .05); mk(BOX, M('#e8ddbb'), bass, .62, 0, .05, 1.3, .035, .01); mk(BOX, M('#c79a63'), bass, 1.36, .02, .02, .24, .13, .05); mk(BOX, M('#c9c2b4'), bass, -.14, 0, .08, .05, .12, .03);
  for (let i = 0; i < 4; i++) mk(SPH, M('#c9c2b4'), bass, 1.29 + i * .05, .1, .02, .022, .03, .022);
  limb(g, sleeve, V(-.46, 1.7, 0), V(-.58, 1.32, .2), .13); const pluck = limb(g, skin, V(-.58, 1.32, .2), V(-.22, 1.1, .5), .09); mk(SPH, skin, g, -.16, 1.08, .52, .09, .08, .08);
  limb(g, sleeve, V(.46, 1.7, 0), V(.74, 1.32, .2), .13); limb(g, skin, V(.74, 1.32, .2), V(.62, 1.42, .46), .09); mk(SPH, skin, g, .6, 1.44, .5, .09, .08, .08);
  const head = new THREE.Group(); head.position.set(0, 2.14, 0); g.add(head);
  mk(SPH, skin, head, 0, 0, 0, .32, .31, .3); mk(SPH, M('#e2b89a'), head, 0, -.1, .035, .3, .2, .275); for (const s of [-1, 1]) mk(SPH, skin, head, s * .31, -.02, 0, .05, .07, .04);
  mk(HEMI, hair, head, 0, .04, -.03, .335, .32, .325);
  for (let i = 0; i < 16; i++) { const a = i * 2.39996, r = .08 + (i / 16) * .24; mk(SPH, hair, head, Math.cos(a) * r, .33 - r * .45, Math.sin(a) * r - .03, .095, .09, .095); }
  face(head, { eye: '#4a3a2c', brow: '#6b4a33', nose: '#e8b998' });
  g.userData = { head, bass }; return g;
}


// ---------- animation ----------
// Eyes close briefly every few seconds; o offsets each character so they don't blink together.
export const blink = (t, o) => ((t + o) % 4.3) < .13 ? .1 : 1;
// Four-legged trot, or legs tucked in mid-air.
export function animWalk(cat, phase, amt, air, t) { const u = cat.userData; u.legs.forEach((l, i) => { const off = (i === 0 || i === 3) ? 0 : Math.PI; l.rotation.x = air ? (i < 2 ? -.7 : .7) : Math.sin(phase + off) * .75 * amt; }); u.body.position.y = air ? 0 : Math.abs(Math.sin(phase)) * .035 * amt; u.tail.rotation.x = air ? -.5 : -.15 + Math.sin(t * 2.2) * .1; u.tail.rotation.z = Math.sin(t * 3 + phase * .5) * .22; u.head.rotation.z = Math.sin(phase) * .04 * amt; }
// A sitting friend breathes, swishes its tail, turns to watch Mew and hops when happy (0..1.2).
export function animSit(cat, t, o, happy, target) { const u = cat.userData; u.eyes.forEach(e => e.scale.y = blink(t, o)); u.body.scale.y = 1 + Math.sin(t * 1.8 + o) * .018; u.tail.rotation.y = Math.sin(t * 1.3 + o) * .12; cat.position.y = u.y0 + Math.abs(Math.sin(happy * 9)) * happy * .25;
  const dx = target.x - cat.position.x, dz = target.z - cat.position.z, a = Math.atan2(dx, dz) - cat.rotation.y; u.head.rotation.y += (Math.max(-.9, Math.min(.9, (a + Math.PI * 3) % (Math.PI * 2) - Math.PI)) - u.head.rotation.y) * .08; u.head.rotation.z = Math.sin(t * .7 + o) * .05; }
