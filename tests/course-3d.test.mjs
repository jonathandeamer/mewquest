import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as course from '../dist/3d/course.mjs';
import {createHold, keyAction} from '../dist/3d/input.mjs';

const STEP = 1 / 120;
const tick = (s, input = {}, n = 1) => { for (let i = 0; i < n; i++) course.step(s, input, STEP); };
const place = (s, x, y, z) => Object.assign(s.p, {x, y, z, vx: 0, vy: 0, vz: 0, grounded: true});
const greetAll = s => { s.greeted = new Set(['rosie', 'ernie', 'darwin', 'minka']); s.markGreeted = true; };
const kinds = s => s.events.map(e => e.t);

// A scripted player that walks the intended route from waypoint to waypoint (x, distance along the path),
// jumping at edges and steps, hopping over Coco, waiting for sprinklers and the sliding lily pad, and dashing
// across the long gap. If it can finish without any safe returns, every part of the course is reachable.
const ROUTE = [[3.5, 6], [3.5, 13.2], [-1, 17], [1.2, 20.6], [-.5, 24.2], [0, 28.5], [3.2, 29.4], [3.2, 31], [3.4, 34.5], [3.6, 36], [0, 38.5], [-2.5, 40.4], [0, 44.5], [0, 57], [0, 60.2], [1.8, 63.6], [0, 67], [0, 70.5], [-2.8, 71.2], [2, 73.5], [2.6, 77], [3.2, 80], [0, 83], [0, 86.5], [0, 89.6], [0, 93.5], [0, 97.2], [0, 100.8], [-1.5, 105], [.9, 105], [.9, 106.5], [.1, 109.4], [-2, 110], [-3, 110.2], [-3, 112.4, {drop: true}], [0, 113.2], [0, 114.8], [0, 118.3], [0, 119.3], [1, 126.2, {dash: true}], ['mover', 130.6], [0, 134.8], [3.8, 138], [3.8, 144], [0, 146.6], [0, 148]];
function playThrough(limitSeconds = 300) {
  const s = course.create(), L = s.L, p = s.p, mover = L.P.find(b => b.move);
  let wi = 0, t = 0, holdJump = 0, seenReturns = 0;
  const greetings = [];
  while (!s.won && t < limitSeconds) {
    const [wpx, dist, o = {}] = ROUTE[wi], wx = wpx === 'mover' ? mover.x : wpx, wz = -dist;
    const dx = wx - p.x, dz = wz - p.z, d = Math.hypot(dx, dz) || 1, input = {x: 0, y: 0, jump: false, dash: false};
    let go = !(wpx === 'mover' && p.grounded && Math.abs(wx - p.x) > .7 && p.on && !p.on.move);
    for (const sp of L.sprinklers) {
      const ds = Math.hypot(sp.x - p.x, sp.z - p.z);
      if (ds < sp.r + 2.2 && ds > sp.r + .3 && Math.hypot(sp.x - (p.x + dx / d * 1.2), sp.z - (p.z + dz / d * 1.2)) < sp.r + .5 && (course.sprayOn(s, sp) || course.sprayWarn(s, sp))) go = false;
    }
    if (go && d > .05) { input.x = dx / d; input.y = -dz / d; }
    const coco = Math.hypot(L.coco.x - p.x, L.coco.z - p.z);
    if (p.grounded && go) {
      const edge = course.groundBelow(s, p.x + dx / d * .55, p.y + .45, p.z + dz / d * .55) < p.y - .05 && !o.drop;
      const step = course.groundBelow(s, p.x + dx / d * 1.2, p.y + 2, p.z + dz / d * 1.2) > p.y + .42;
      if (edge || step || coco < 2.6) holdJump = .5;
    }
    if (holdJump > 0) { holdJump -= STEP; input.jump = true; }
    if (!p.grounded && coco < 3) input.jump = true;
    if (o.dash && !p.grounded && p.vy < 3 && p.dashReady) input.dash = true;
    course.step(s, input, STEP); t += STEP;
    for (const e of s.events.splice(0)) if (e.t === 'say') greetings.push(s.sayText);
    const [nx, nd] = ROUTE[wi];
    if (Math.hypot((nx === 'mover' ? mover.x : nx) - p.x, -nd - p.z) < .45 && p.grounded) wi = Math.min(ROUTE.length - 1, wi + 1);
    if (s.returns !== seenReturns) { seenReturns = s.returns; const cz = -L.checkpoints[s.checkpoint].z; wi = ROUTE.findIndex(w => w[1] > cz + .3); }
  }
  return {s, t, greetings};
}

test('the whole garden can be crossed, greeting everyone, without a single slip', () => {
  const {s, t, greetings} = playThrough();
  assert.equal(s.won, true, 'reached Jenn and Samuel');
  assert.equal(s.returns, 0);
  assert.deepEqual(course.missing(s), []);
  assert.equal(s.checkpoint, s.L.checkpoints.length - 1);
  assert.deepEqual(greetings, ['Hi Rosie', 'Hi Ernie', 'Hi Mark', 'Hi Minka And Darwin']);
  assert.ok(t < 120, `took ${t.toFixed(1)} s`);
});

test('greetings are capitalised and the ending line is unchanged', () => {
  const s = course.create();
  assert.deepEqual(s.L.stops.map(st => st.reply), ['Hi Rosie', 'Hi Ernie', 'Hi Minka And Darwin']);
  greetAll(s); const g = s.L.goal; place(s, g.x, 0.3, g.z); s.p.y = 0.3; s.p.grounded = false; s.p.vy = -1; tick(s);
  assert.equal(s.sayText, "Hi Samuel! Hi Jenn, It's good to be home!");
  assert.equal(s.won, false, 'the doorstep greeting plays before the ending');
  tick(s, {}, Math.ceil(4.5 / STEP) + 2);
  assert.equal(s.won, true);
});

test('each gate holds Mew back until its friends are greeted', () => {
  const s = course.create(), rosieGate = s.L.stops[0];
  place(s, 0, 0, -rosieGate.gate + 2); s.events.length = 0;
  tick(s, {y: 1}, 120);
  assert.ok(s.p.z >= -rosieGate.gate, 'stopped at the ribbon');
  assert.ok(kinds(s).includes('gate'));
  s.greeted.add('rosie'); tick(s);
  assert.ok(kinds(s).includes('open'));
  tick(s, {y: 1}, 36);
  assert.ok(s.p.z < -rosieGate.gate - .5, 'walked through once Rosie was greeted');
});

test('Mark is greeted after Ernie, and Ernie\'s gate waits for both', () => {
  const s = course.create(), ernie = s.L.stops[1], mark = s.L.mark;
  s.greeted.add('rosie');
  place(s, ernie.x, ernie.y, ernie.z); tick(s);
  assert.equal(s.sayText, 'Hi Ernie');
  assert.equal(course.gateOpen(s, ernie), false);
  place(s, mark.x, mark.y, mark.z); tick(s);
  assert.equal(s.sayText, 'Hi Ernie', 'Mark waits his turn');
  tick(s, {}, Math.ceil(3 / STEP) + 2);
  assert.equal(s.sayText, 'Hi Mark');
  assert.equal(s.markGreeted, true);
  assert.equal(course.gateOpen(s, ernie), true);
});

test('home is only reached once every friend has been greeted', () => {
  const s = course.create(), g = s.L.goal;
  s.greeted = new Set(['rosie', 'ernie', 'darwin']); s.markGreeted = true;
  place(s, g.x, 0.3, g.z); tick(s, {}, 30);
  assert.equal(s.reunion, 0);
  assert.deepEqual(course.missing(s), ['minka']);
});

test('the pond, Coco and sprinklers all return Mew gently to her resting spot', () => {
  for (const why of ['pond', 'coco', 'sprinkler']) {
    const s = course.create(); s.checkpoint = 1; s.collected.add(3); s.greeted.add('rosie');
    if (why === 'pond') place(s, 0, 0, -15);
    if (why === 'coco') place(s, s.L.coco.x, 0, s.L.coco.z);
    if (why === 'sprinkler') { const sp = s.L.sprinklers[0]; s.time = SPRINKLER_ON_AT(sp); place(s, sp.x, 0, sp.z); }
    if (why === 'pond') { s.p.grounded = false; }
    tick(s, {}, why === 'pond' ? 60 : 1);
    const rest = s.events.find(e => e.t === 'rest');
    assert.equal(rest && rest.why, why);
    const c = s.L.checkpoints[1];
    assert.deepEqual([s.p.x, s.p.y, s.p.z, s.p.vx, s.p.vz].map(v => v + 0), [c.x, c.y, c.z, 0, 0]);
    assert.equal(s.collected.size, 1, 'Dreamies are kept');
    assert.equal(s.greeted.has('rosie'), true, 'greetings are kept');
  }
});
const SPRINKLER_ON_AT = sp => ((course.SPRINKLER_PERIOD - sp.phase) % course.SPRINKLER_PERIOD + course.SPRINKLER_PERIOD) % course.SPRINKLER_PERIOD + .1;

test('sprinklers spend half their cycle off and warn before starting', () => {
  const s = course.create(), sp = s.L.sprinklers[0];
  const samples = Math.round(course.SPRINKLER_PERIOD * 120 * 4);
  let on = 0, starts = 0, warnedStarts = 0, wasOn = true, wasWarn = false;
  for (let i = 0; i < samples; i++) {
    s.time = i / 120; const now = course.sprayOn(s, sp);
    if (now) on++;
    if (now && !wasOn) { starts++; if (wasWarn) warnedStarts++; }
    wasOn = now; wasWarn = course.sprayWarn(s, sp);
  }
  assert.ok(Math.abs(on / samples - .5) < .01);
  assert.ok(starts >= 3);
  assert.equal(warnedStarts, starts, 'every restart is preceded by a sputter');
});

test('resting spots only move forward', () => {
  const s = course.create(), cps = s.L.checkpoints;
  greetAll(s);
  place(s, cps[2].x, cps[2].y, cps[2].z); tick(s);
  assert.equal(s.checkpoint, 2);
  place(s, cps[1].x, cps[1].y, cps[1].z); tick(s);
  assert.equal(s.checkpoint, 2);
});

test('a Dreamie is collected once', () => {
  const s = course.create(), t = s.L.treats[0];
  place(s, t.x, t.y - .35, t.z); s.p.grounded = false; tick(s);
  assert.equal(s.collected.size, 1);
  s.events.length = 0; tick(s);
  assert.equal(s.events.filter(e => e.t === 'treat').length, 0);
  assert.equal(s.L.treats.length, 15);
});

test('Rest returns Mew safely and counts as a return', () => {
  const s = course.create(); s.checkpoint = 0; place(s, 2, 0, -8); s.p.vx = 5;
  course.toRest(s, 'rest');
  assert.deepEqual([s.p.x, s.p.z, s.p.vx, s.returns], [0, 0, 0, 1]);
});

test('jumping from flat ground clears a crate but not the raised bed', () => {
  const s = course.create(); let top = 0;
  place(s, 0, 0, -5); tick(s, {jump: true}, 60);
  for (let i = 0; i < 120; i++) { tick(s, {jump: true}); top = Math.max(top, s.p.y); }
  assert.ok(top > 1.1, `jump peak ${top.toFixed(2)} m clears the 1.1 m crate`);
  assert.ok(top < 2.2, 'the 2.2 m raised bed needs the crate as a step');
});

test('air dash is limited to one until Mew lands', () => {
  const s = course.create(); place(s, 0, 0, -5);
  tick(s, {jump: true}, 10); tick(s, {jump: true, dash: true});
  assert.equal(s.p.dashReady, false);
  tick(s, {jump: true}, 1); const before = s.p.dashT; tick(s, {jump: true, dash: true});
  assert.ok(s.p.dashT < before, 'a second press does not restart the dash');
  tick(s, {}, 240);
  assert.equal(s.p.grounded, true); assert.equal(s.p.dashReady, true);
});

test('pause freezes the garden', () => {
  const s = course.create(); s.paused = true;
  const z = s.p.z, coco = s.L.coco.z;
  tick(s, {y: 1}, 120);
  assert.equal(s.p.z, z); assert.equal(s.L.coco.z, coco); assert.equal(s.time, 0);
});

test('Coco and the sliding lily pad stay within their paths', () => {
  const s = course.create(), c = s.L.coco, pad = s.L.P.find(b => b.move);
  for (let i = 0; i < 6000; i++) {
    tick(s);
    assert.ok(c.z >= c.min && c.z <= c.max);
    assert.ok(Math.abs(pad.x) <= pad.move.amp + 1e-9);
  }
});

test('a dash travels the same distance on diagonal keys as on the thumb stick', () => {
  const dashLength = input => {
    const s = course.create(); place(s, 0, 0, -5); tick(s, input, 12);
    const x = s.p.x, z = s.p.z; tick(s, {...input, dash: true});
    assert.ok(Math.abs(Math.hypot(s.p.fx, s.p.fz) - 1) < 1e-9, 'facing is a unit vector');
    tick(s, {...input, dash: true}, Math.round(course.DASH_TIME * 120) - 1);
    return Math.hypot(s.p.x - x, s.p.z - z);
  };
  const keys = dashLength({x: 1, y: 1}), stick = dashLength({x: Math.SQRT1_2, y: Math.SQRT1_2}), straight = dashLength({x: 0, y: 1});
  assert.ok(Math.abs(keys - stick) < 1e-6, `keys ${keys.toFixed(3)} m, stick ${stick.toFixed(3)} m`);
  assert.ok(Math.abs(keys - straight) < 1e-6);
});

test('a touch button stays held until every finger on it has lifted or been cancelled', () => {
  const jump = createHold();
  jump.press(1); jump.press(2);
  jump.release(1);
  assert.equal(jump.held, true, 'the second finger still holds Jump');
  jump.release(2);
  assert.equal(jump.held, false);
  jump.release(2); jump.press(3); jump.clear();
  assert.equal(jump.held, false, 'pause or focus loss releases everything');
});

test('keys map to actions whatever the letter case', () => {
  assert.deepEqual(['ArrowUp', 'W', 'a', ' ', 'C', 'Shift', 'X', 'q', undefined].map(keyAction), ['u', 'u', 'l', 'jump', 'jump', 'dash', 'dash', null, null]);
});

test('being lifted onto a low ledge is reported so the view can ease it', () => {
  const s = course.create(), step = s.L.P.find(b => b.type === 'step');
  greetAll(s);
  place(s, 2.5, 0, step.z + step.hd + .6); s.events.length = 0; // off to one side, outside the doorstep greeting
  tick(s, {y: 1}, 30);
  const ledge = s.events.find(e => e.t === 'ledge');
  assert.ok(ledge, 'stepping onto the doorstep raises a ledge event');
  assert.ok(Math.abs(ledge.lift - step.top) < 1e-9);
  assert.equal(s.p.y, step.top);
});
