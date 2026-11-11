// Mew Quest 3D course: layout, movement, friends, gates, resting spots and the ending.
// Pure simulation with no rendering, so tests can drive it headlessly (see tests/course-3d.test.mjs).
// Steps are meant to run at a fixed 1/120 s; events for sound and effects are queued on s.events.
export const SPEED = 6.2, JUMP = 9.6, GRAVITY = 26, DASH_SPEED = 17, DASH_TIME = 0.2, RADIUS = 0.4, HEIGHT = 0.7;
const R = RADIUS, HGT = HEIGHT, GRAV = GRAVITY, DASH_V = DASH_SPEED, DASH_T = DASH_TIME;
const box = (x, d0, d1, w, top, o = {}) => Object.assign({ kind: 'box', x, z: -(d0 + d1) / 2, hw: w / 2, hd: (d1 - d0) / 2, top, bottom: top - (o.thick == null ? 4 : o.thick) }, o);
const disc = (x, d, r, top, o = {}) => Object.assign({ kind: 'disc', x, z: -d, r, top, bottom: top - (o.thick == null ? 0.5 : o.thick) }, o);

// The course runs away from the camera along -z. Distances in comments and in box()/disc() are metres along the path.
export function level() {
  const P = [
    box(0, -5, 14, 11, 0, { type: 'lawn' }),
    disc(-1, 17, 1.15, 0, { type: 'stone', thick: 1.4 }), disc(1.2, 20.6, 1.15, 0, { type: 'stone', thick: 1.4 }), disc(-0.5, 24.2, 1.15, 0, { type: 'stone', thick: 1.4 }),
    box(0, 27, 41, 11, 0, { type: 'lawn' }),
    box(3.2, 30.2, 31.8, 1.6, 1.1, { type: 'crate', thick: 1.1 }),
    box(3.4, 33.2, 37.6, 4, 2.2, { type: 'planter', thick: 2.2 }),
    box(0, 43.5, 57.5, 2.2, 0, { type: 'plank', thick: 0.35 }),
    disc(0, 60.2, 1.2, 0.8, { type: 'pot', thick: 2.2 }), disc(1.8, 63.6, 1.2, 1.6, { type: 'pot', thick: 3 }), disc(0, 67, 1.2, 2.4, { type: 'pot', thick: 3.8 }),
    box(0, 69.5, 83.5, 9, 2.4, { type: 'terrace', thick: 6 }),
    box(0, 85.5, 90, 1.4, 2.4, { type: 'wall', thick: 6 }), box(0, 92.8, 97.5, 1.4, 2.4, { type: 'wall', thick: 6 }),
    box(0, 99, 115, 11, 0, { type: 'lawn' }),
    box(0.9, 105.7, 107.3, 1.6, 1.0, { type: 'crate', thick: 1 }),
    box(0.1, 108.6, 110.2, 1.6, 2.0, { type: 'crate', thick: 2 }),
    box(-3, 108, 112, 4, 3.0, { type: 'shed', thick: 3 }),
    disc(0, 118.3, 1.3, 0, { type: 'pad', thick: 0.25 }), disc(1, 126.2, 1.45, 0, { type: 'pad', thick: 0.25 }),
    disc(0, 130.6, 1.45, 0, { type: 'pad', thick: 0.25, move: { amp: 2.6, speed: 0.9 } }),
    box(0, 133.2, 153, 13, 0, { type: 'lawn' }),
    box(0, 147.2, 150.4, 5.5, 0.3, { type: 'step', thick: 0.3 }),
    box(0, 150.4, 158, 10, 6, { type: 'cottage', thick: 6 }),
  ];
  const T = [[2.5, 5, .6], [-3, 11.5, .6], [1.2, 20.6, 1.7], [-3.2, 30, .6], [3.4, 34.2, 2.9], [0, 48, 1.5], [0, 54, 1.5], [1.8, 63.6, 2.4], [-3.4, 77.5, 3.0], [0, 91.4, 3.7], [3.6, 111, .6], [-4.2, 111, 3.7], [.5, 122.3, 1.6], [-4.5, 139, .6], [4.5, 144, .6]];
  return {
    P,
    treats: T.map(([x, d, y], id) => ({ id, x, y, z: -d })),
    stops: [
      { id: 'rosie', ids: ['rosie'], x: 4, z: -36.4, y: 2.2, reply: 'Hi Rosie', gate: 39.6, gateW: 11, ask: 'Rosie' },
      { id: 'ernie', ids: ['ernie'], x: 2.4, z: -76, y: 2.4, reply: 'Hi Ernie', gate: 82.4, gateW: 9, gateY: 2.4, ask: 'Ernie and Mark' },
      { id: 'pair', ids: ['darwin', 'minka'], x: -3.1, z: -110.2, y: 3, reply: 'Hi Minka And Darwin', gate: 114, gateW: 11, ask: 'Darwin and Minka' },
    ],
    mark: { x: 3.3, z: -78.7, y: 2.4 },
    checkpoints: [{ x: 0, z: 0, y: 0 }, { x: -2.5, z: -40.4, y: 0 }, { x: -2.8, z: -71.2, y: 2.4 }, { x: 0, z: -100.8, y: 0 }, { x: 0, z: -134.8, y: 0 }],
    sprinklers: [{ x: 2.4, z: -9.5, r: 1.5, y: 0, phase: 0 }, { x: -1.2, z: -76.5, r: 1.5, y: 2.4, phase: 1.2 }, { x: 2.6, z: -103.5, r: 1.5, y: 0, phase: 0.6 }, { x: 0, z: -141, r: 1.8, y: 0, phase: 2 }],
    coco: { x: 0, y: 0, z: -47, min: -55.5, max: -46.5, dir: -1, speed: 2.6 },
    goal: { x: 0, z: -147.8, r: 2.3 },
  };
}
export const SPRINKLER_PERIOD = 3.8;
const SPR_PERIOD = SPRINKLER_PERIOD;
// 0..1 through the cycle: first half spraying, short sputter warning before it starts again.
export const sprayOn = (s, sp) => ((s.time + sp.phase) % SPR_PERIOD) < SPR_PERIOD * 0.5;
export const sprayWarn = (s, sp) => ((s.time + sp.phase) % SPR_PERIOD) > SPR_PERIOD - 0.6;

export function create() {
  const L = level();
  return {
    L, time: 0, clock: 0, paused: false, won: false, events: [],
    p: { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fz: -1, grounded: true, on: L.P[0], coyote: 0, buffer: 0, dashReady: true, dashT: 0 },
    checkpoint: 0, greeted: new Set(), markGreeted: false, queue: [], sayText: '', sayTime: 0,
    collected: new Set(), returns: 0, reunion: 0, lastJump: false, lastDash: false, bumpCool: 0,
  };
}
export const missing = s => { const out = []; for (const st of s.L.stops) { for (const id of st.ids) if (!s.greeted.has(id)) out.push(id); if (st.id === 'ernie' && !s.markGreeted) out.push('mark'); } return out; };
export const gateOpen = (s, st) => st.ids.every(id => s.greeted.has(id)) && (st.id !== 'ernie' || s.markGreeted);

export function toRest(s, why) {
  const p = s.p, c = s.L.checkpoints[s.checkpoint];
  s.events.push({ t: 'rest', why, x: p.x, y: p.y, z: p.z });
  Object.assign(p, { x: c.x, y: c.y, z: c.z, vx: 0, vy: 0, vz: 0, fx: 0, fz: -1, grounded: true, on: null, coyote: 0, buffer: 0, dashReady: true, dashT: 0 });
  s.returns++; s.reunion = 0;
}
function say(s, text, id) {
  if (s.queue.some(q => q.id === id)) return;
  const r = { text, id };
  if (s.sayTime > 0) s.queue.push(r); else startSay(s, r);
}
function startSay(s, r) { s.sayText = r.text; s.sayTime = 3; if (r.id === 'mark') s.markGreeted = true; s.events.push({ t: 'say', id: r.id }); }

function over(b, x, z, m) {
  return b.kind === 'box' ? Math.abs(x - b.x) < b.hw + m && Math.abs(z - b.z) < b.hd + m : Math.hypot(x - b.x, z - b.z) < b.r + m;
}
export function groundBelow(s, x, y, z) { let best = -Infinity; for (const b of s.L.P) if (b.top <= y + 0.05 && b.top > best && over(b, x, z, 0.15)) best = b.top; return best; }
function land(s, b) {
  const p = s.p; if (!p.grounded && p.vy < -4) s.events.push({ t: 'land', v: -p.vy });
  p.y = b.top; p.vy = 0; p.grounded = true; p.on = b;
}

export function step(s, inp = {}, dt = 1 / 120) {
  if (s.paused || s.won) return;
  dt = Math.min(dt, 1 / 30); s.time += dt; const p = s.p, L = s.L;
  s.bumpCool = Math.max(0, s.bumpCool - dt);
  for (const b of L.P) if (b.move) { const nx = b.move.amp * Math.sin(s.time * b.move.speed); b.dx = nx - b.x; b.x = nx; }
  const c = L.coco; c.z += c.dir * c.speed * dt; if (c.z < c.min) { c.z = c.min; c.dir = 1; } if (c.z > c.max) { c.z = c.max; c.dir = -1; }
  s.sayTime = Math.max(0, s.sayTime - dt); if (s.sayTime === 0 && s.queue.length) startSay(s, s.queue.shift());
  if (s.reunion > 0) { s.reunion = Math.max(0, s.reunion - dt); s.sayTime = Math.max(s.sayTime, s.reunion); p.vx = p.vz = 0; if (s.reunion === 0) { s.won = true; s.events.push({ t: 'won' }); } return; }
  s.clock += dt;

  let ix = inp.x || 0, iy = inp.y || 0; const len = Math.hypot(ix, iy); if (len > 1) { ix /= len; iy /= len; }
  if (len > 0.15) { p.fx = ix / len; p.fz = -iy / len; }
  p.buffer = Math.max(0, p.buffer - dt); p.coyote = p.grounded ? 0.11 : Math.max(0, p.coyote - dt);
  if (inp.jump && !s.lastJump) p.buffer = 0.14;
  if (p.grounded && p.dashT <= 0) p.dashReady = true;
  if (inp.dash && !s.lastDash && p.dashReady) { p.dashReady = false; p.dashT = DASH_T; p.vx = p.fx * DASH_V; p.vz = p.fz * DASH_V; p.vy = 0; s.events.push({ t: 'dash' }); }
  if (p.dashT > 0) { p.dashT -= dt; if (p.dashT <= 0) { p.vx = p.fx * SPEED; p.vz = p.fz * SPEED; } }
  else {
    const tx = ix * SPEED, tz = -iy * SPEED, acc = (p.grounded ? 55 : 32) * dt, ex = tx - p.vx, ez = tz - p.vz, el = Math.hypot(ex, ez);
    if (el <= acc) { p.vx = tx; p.vz = tz; } else { p.vx += ex / el * acc; p.vz += ez / el * acc; }
    p.vy = Math.max(-22, p.vy - GRAV * dt);
    if (p.buffer > 0 && p.coyote > 0) { p.vy = JUMP; p.grounded = false; p.on = null; p.coyote = 0; p.buffer = 0; s.events.push({ t: 'jump' }); }
    if (!inp.jump && s.lastJump && p.vy > 4) p.vy = 4;
  }
  s.lastJump = !!inp.jump; s.lastDash = !!inp.dash;

  const n = Math.max(1, Math.ceil(Math.max(Math.abs(p.vx), Math.abs(p.vy), Math.abs(p.vz)) * dt / 0.15)), h = dt / n;
  for (let i = 0; i < n; i++) {
    if (p.grounded && p.on && p.on.move) p.x += p.on.dx / n;
    p.x += p.vx * h; p.z += p.vz * h;
    p.x = Math.max(-14, Math.min(14, p.x));
    for (const st of L.stops) if (!gateOpen(s, st) && p.z < -st.gate + R) {
      p.z = -st.gate + R; if (p.vz < 0) { p.vz = 0; if (s.bumpCool === 0) { s.bumpCool = 2.5; s.events.push({ t: 'gate', ask: st.ask }); } }
    }
    // Sides: walk up small steps, catch ledges when heading for them, otherwise slide along.
    for (const b of L.P) {
      if (!(p.y < b.top - 0.02 && p.y + HGT > b.bottom) || !over(b, p.x, p.z, R)) continue;
      let nx, nz;
      if (b.kind === 'box') { nx = Math.max(b.x - b.hw, Math.min(b.x + b.hw, p.x)); nz = Math.max(b.z - b.hd, Math.min(b.z + b.hd, p.z)); }
      else { const d = Math.hypot(p.x - b.x, p.z - b.z) || 1e-6, k = Math.min(1, b.r / d); nx = b.x + (p.x - b.x) * k; nz = b.z + (p.z - b.z) * k; }
      const toward = (nx - p.x) * p.vx + (nz - p.z) * p.vz > 0.01 || (nx === p.x && nz === p.z);
      if (b.top - p.y <= 0.42 && p.vy <= 0 && toward) { land(s, b); continue; }
      if (b.kind === 'box') {
        const dx = p.x - b.x, dz = p.z - b.z, px = b.hw + R - Math.abs(dx), pz = b.hd + R - Math.abs(dz);
        if (px < pz) { p.x = b.x + Math.sign(dx || 1) * (b.hw + R); p.vx = 0; } else { p.z = b.z + Math.sign(dz || 1) * (b.hd + R); p.vz = 0; }
      } else {
        const d = Math.hypot(p.x - b.x, p.z - b.z) || 1e-6; p.x = b.x + (p.x - b.x) / d * (b.r + R); p.z = b.z + (p.z - b.z) / d * (b.r + R);
      }
    }
    const oldY = p.y; p.y += p.vy * h; p.grounded = false;
    if (p.vy <= 0) for (const b of L.P) if (over(b, p.x, p.z, 0.15) && oldY >= b.top - 1e-3 && p.y <= b.top) land(s, b);
    if (!p.grounded) p.on = null;
    if (p.y < -0.7) { toRest(s, 'pond'); break; }
    if (Math.hypot(p.x - c.x, p.z - c.z) < 0.95 && Math.abs(p.y - c.y) < 0.7) { toRest(s, 'coco'); break; }
    let wet = false; for (const sp of L.sprinklers) if (sprayOn(s, sp) && Math.hypot(p.x - sp.x, p.z - sp.z) < sp.r + 0.15 && p.y - sp.y < 1.3 && p.y - sp.y > -0.2) wet = true;
    if (wet) { toRest(s, 'sprinkler'); break; }
  }
  L.checkpoints.forEach((cp, i) => { if (i > s.checkpoint && Math.hypot(p.x - cp.x, p.z - cp.z) < 1.7 && Math.abs(p.y - cp.y) < 1) { s.checkpoint = i; s.events.push({ t: 'checkpoint', i }); } });
  for (const t of L.treats) if (!s.collected.has(t.id) && Math.hypot(p.x - t.x, p.y + 0.35 - t.y, p.z - t.z) < 0.95) { s.collected.add(t.id); s.events.push({ t: 'treat', id: t.id, x: t.x, y: t.y, z: t.z }); }
  for (const st of L.stops) {
    if (st.ids.every(id => s.greeted.has(id))) continue;
    if (p.grounded && Math.hypot(p.x - st.x, p.z - st.z) < 2.7 && Math.abs(p.y - st.y) < 0.3) { st.ids.forEach(id => s.greeted.add(id)); say(s, st.reply, st.id); s.events.push({ t: 'greet', id: st.id }); }
  }
  const m = L.mark;
  if (s.greeted.has('ernie') && !s.markGreeted && p.grounded && Math.hypot(p.x - m.x, p.z - m.z) < 2.7 && Math.abs(p.y - m.y) < 0.3) say(s, 'Hi Mark', 'mark');
  for (const st of L.stops) if (!st.opened && gateOpen(s, st)) { st.opened = true; s.events.push({ t: 'open', id: st.id }); }
  const g = L.goal;
  if (p.grounded && Math.hypot(p.x - g.x, p.z - g.z) < g.r && missing(s).length === 0) {
    s.queue = []; s.sayText = "Hi Samuel! Hi Jenn, It's good to be home!"; s.sayTime = 4.5; s.reunion = 4.5; p.vx = p.vz = 0; p.fx = 0; p.fz = -1; s.events.push({ t: 'reunion' });
  }
}
