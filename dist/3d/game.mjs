// Mew Quest 3D: wires the course, garden, effects, controls, sound and HUD together and runs the frame loop.
import * as course from './course.mjs';
import { V } from './toolkit.mjs';
import { animWalk, animSit, blink } from './characters.mjs';
import { createStage, buildWorld } from './scene.mjs';
import { createEffects } from './effects.mjs';
import { createRenderer, createPipeline } from './render.mjs';
import { createLabels } from './labels.mjs';
import { createSound } from './sound.mjs';
import { createInput } from './input.mjs';

const STEP = 1 / 120;
const WHY = {
  pond: 'Nearly a wet paw! Back to your cosy cushion.',
  coco: 'Coco wants the bridge to herself. Hop over her!',
  sprinkler: 'Eek, sprinkler! Wait for it to stop.',
  rest: 'Back to your cosy cushion.',
};
const fmt = t => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
const lerpAngle = (a, b, k) => a + ((b - a + Math.PI * 3) % (Math.PI * 2) - Math.PI) * k;

export function startGame() {
  const $ = q => document.querySelector(q), app = $('#app'), canvas = $('#c');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let touchMode = matchMedia('(any-pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  document.body.classList.toggle('touch', touchMode);

  let s = course.create();
  const renderer = createRenderer(canvas), stage = createStage(), { camera, sun } = stage;
  const g = buildWorld(stage, s.L, { reduced });
  const fx = createEffects(stage.scene, g.world, g.treats, { reduced });
  const pipeline = createPipeline(renderer, stage, touchMode ? 2 : 3);
  const sound = createSound($('#music'));
  const TOTAL = s.L.treats.length;

  // ---------- labels ----------
  const labels = createLabels($('#labels'), camera), st = s.L.stops, mk = s.L.mark;
  const near = (z, r = 17) => Math.abs(s.p.z - z) < r && s.p.z > z - 6;
  const hello = id => () => s.greeted.has(id) ? 'Lovely to see you!' : 'Hello Mew!';
  labels.add('tag', 'Rosie', V(st[0].x, st[0].y - .12, st[0].z + .5), () => near(st[0].z));
  labels.add('bubble', '', V(st[0].x, st[0].y + 1.5, st[0].z), () => near(st[0].z, 13), hello('rosie'));
  labels.add('tag', 'Ernie', V(st[1].x, st[1].y - .12, st[1].z + .7), () => near(st[1].z));
  labels.add('bubble', '', V(st[1].x - .4, st[1].y + 2.1, st[1].z), () => near(st[1].z, 13), hello('ernie'));
  labels.add('tag', 'Mark', V(mk.x + .5, mk.y + 3.0, mk.z), () => near(mk.z));
  labels.add('tag', 'Darwin', V(-4.1, 2.9, -109.7), () => near(-110));
  labels.add('tag', 'Minka', V(-2.2, 2.9, -109.7), () => near(-110));
  labels.add('bubble', '', V(-3.1, 4.5, -110.2), () => near(-110, 13), hello('minka'));
  labels.add('tag', 'Jenn', V(-1.5, 2.75, -149.1), () => near(-149, 16));
  labels.add('tag', 'Samuel', V(1.55, 2.2, -149.2), () => near(-149, 16));
  const cocoTag = labels.add('tag', 'Coco', V(0, 1.2, 0), () => near(s.L.coco.z, 14));
  g.gates.forEach(gt => labels.add('tag gate', 'Say hi to ' + gt.st.ask + ' first', gt.pos, () => !course.gateOpen(s, gt.st) && near(-gt.st.gate, 10)));
  const mewBubble = labels.add('bubble mew', '', V(0, 0, 0), () => s.sayTime > 0, () => s.sayText);

  // ---------- HUD and flow ----------
  let playing = false, toastT = 0;
  const live = () => playing && !s.paused && !s.won;
  const syncMusic = () => sound.sync(live() && !document.hidden);
  function toast(t, secs = 2.6) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); toastT = secs; }
  function hud() {
    $('#tcount').textContent = s.collected.size + ' / ' + TOTAL;
    document.querySelectorAll('#friends li').forEach(li => { const id = li.dataset.id; li.classList.toggle('done', id === 'mark' ? s.markGreeted : s.greeted.has(id)); });
    g.treats.forEach((t, i) => t.visible = !s.collected.has(i));
    g.cushions.forEach((c, i) => c.flag.material = i <= s.checkpoint ? g.flagOn : g.flagOff);
    g.gates.forEach(gt => gt.g.visible = !course.gateOpen(s, gt.st));
  }
  function card(kind) {
    const won = kind === 'won', paused = kind === 'pause';
    $('#overlay').hidden = false; $('#stats').hidden = !won; $('#how').hidden = won || paused;
    $('#eyebrow').textContent = won ? 'The best place to land.' : paused ? 'A little breather.' : 'Small paws. Big adventure.';
    $('#title').innerHTML = won ? 'Home, <em>at last.</em>' : paused ? 'Stretch your <em>paws.</em>' : 'Mew Quest <em>3D</em>';
    $('#copy').textContent = won ? 'Mew is reunited with Jenn and Samuel! Time to watch Coronation Street together on the sofa with some crisps and Dreamies :)'
      : paused ? 'Your cosy cushion is right where you left it.' : 'Help Mew cross the garden, say hi to her friends, and get home to Jenn and Samuel.';
    if (won) $('#stats').textContent = `Dreamies collected: ${s.collected.size} / ${TOTAL} · Time ${fmt(s.clock)}`;
    $('#start').textContent = won ? 'Play Again' : paused ? 'Keep Exploring' : touchMode ? 'Tap To Play' : 'Play';
    syncMusic();
  }
  function clearInput() { input.clear(); s.lastJump = s.lastDash = false; }
  function start() {
    if (s.won) { s = course.create(); camSnap = true; }
    playing = true; s.paused = false; clearInput();
    $('#overlay').hidden = true; $('#hud').hidden = false; hud(); canvas.focus(); sound.sfx.start(); syncMusic();
  }
  function pause() { if (live()) { s.paused = true; clearInput(); card('pause'); } }
  function togglePause() {
    if (!playing || s.won) return;
    if (!s.paused) return pause();
    s.paused = false; clearInput(); $('#overlay').hidden = true; canvas.focus(); syncMusic();
  }
  function rest() { if (playing && !s.won && s.reunion <= 0) course.toRest(s, 'rest'); }
  const input = createInput({
    inMenu: () => !playing || s.won, isPaused: () => s.paused,
    start: () => $('#start').click(), togglePause, rest,
    onTouch: () => { if (!touchMode) { touchMode = true; document.body.classList.add('touch'); } },
  });
  $('#start').onclick = start;
  $('#pause').onclick = togglePause;
  function setSound(v) {
    sound.set(v);
    for (const b of [$('#sound'), $('#sound2')]) { b.textContent = v ? 'Sound On' : 'Sound Off'; b.setAttribute('aria-pressed', String(v)); }
    syncMusic();
  }
  $('#sound').onclick = () => { setSound(!sound.on); canvas.focus(); };
  $('#sound2').onclick = () => setSound(!sound.on);
  addEventListener('blur', () => { clearInput(); pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInput(); pause(); } syncMusic(); });

  // ---------- course events: sounds, sparkles, toasts ----------
  let squash = 0, heartsT = 0; const happy = {};
  function handle(e) {
    const p = s.p, { sfx } = sound, { burst } = fx;
    if (e.t === 'jump') { sfx.jump(); squash = -.18; }
    else if (e.t === 'land') { squash = .22; burst(p.x, p.y + .08, p.z, 4, 'puff', 1.6, .6); }
    else if (e.t === 'dash') { sfx.dash(); burst(p.x, p.y + .35, p.z, 6, 'star', 1.2, .8); }
    else if (e.t === 'treat') { sfx.treat(); burst(e.x, e.y, e.z, 9, 'star'); hud(); if (s.collected.size === TOTAL) toast('Every single Dreamie! What a feast.'); }
    else if (e.t === 'rest') { sfx.rest(); burst(e.x, Math.max(e.y, -.5) + .4, e.z, 10, e.why === 'rest' ? 'star' : 'drop'); burst(p.x, p.y + .4, p.z, 10, 'star'); toast(WHY[e.why]); camSnap = true; }
    else if (e.t === 'checkpoint') { sfx.flag(); const c = s.L.checkpoints[e.i]; burst(c.x + 1.2, c.y + 1.5, c.z, 10, 'star'); toast('Cosy cushion found. Mew will rest here.'); hud(); }
    else if (e.t === 'greet') { sfx.meow(); const stop = s.L.stops.find(x => x.id === e.id); burst(stop.x, stop.y + 1.2, stop.z, 10, 'heart', 1.6, 1.6); stop.ids.forEach(id => happy[id] = 1.2); hud(); }
    else if (e.t === 'say') { if (e.id === 'mark') { sfx.meow(); burst(mk.x, mk.y + 2.6, mk.z, 8, 'heart', 1.6, 1.6); } hud(); }
    else if (e.t === 'gate') { sfx.bump(); toast('Say hi to ' + e.ask + ' first.'); }
    else if (e.t === 'open') { sfx.open(); const gt = g.gates.find(x => x.st.id === e.id); for (let i = -2; i <= 2; i++) burst(i * 2, gt.pos.y - 1, gt.pos.z, 5, 'star'); hud(); }
    else if (e.t === 'reunion') { sfx.meow(); sfx.win(); heartsT = 4.5; }
    else if (e.t === 'won') card('won');
  }

  // ---------- camera and frame ----------
  let baseFov = 52, camDist = 8.2, camH = 4.6, camY = 0, camSnap = true, last = 0, acc = 0, runPhase = 0, heading = Math.PI, tAll = 0, W = 1, H = 1;
  const camPos = V(0, 5.2, 9.2), camLook = V(0, 1, -3.5);
  function resize() {
    W = app.clientWidth || innerWidth; H = app.clientHeight || innerHeight; pipeline.setSize(W, H);
    // Portrait screens pull the camera up and back so more of the path ahead is visible.
    const port = W < H; baseFov = port ? 62 : 52; camera.fov = baseFov; camDist = port ? 10.6 : 8.2; camH = port ? 6.2 : 4.6;
    camera.aspect = W / H; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); if (window.visualViewport) visualViewport.addEventListener('resize', resize); resize();

  function animateCharacters(dt, p, home) {
    const { mew, coco, friends, mark, samuel, jenn } = g;
    const sp = Math.hypot(p.vx, p.vz), amt = Math.min(1, sp / course.SPEED); if (live()) runPhase += sp * dt * 3.1;
    heading = lerpAngle(heading, playing ? Math.atan2(p.fx, p.fz) : Math.atan2(camPos.x - p.x, camPos.z - p.z), 1 - Math.exp(-14 * dt));
    mew.position.set(p.x, p.y, p.z); mew.rotation.y = heading; squash *= Math.exp(-9 * dt);
    mew.userData.body.scale.set(1 + squash * .6, 1 - squash, p.dashT > 0 ? 1.25 : 1 + squash * .3);
    animWalk(mew, runPhase, amt, !p.grounded, tAll); mew.userData.eyes.forEach(e => e.scale.y = blink(tAll, 0));
    mew.userData.head.rotation.x = p.grounded ? Math.sin(tAll * 1.4) * .04 : -.15;
    // Soft contact shadow under Mew that shrinks as she jumps.
    const gy = course.groundBelow(s, p.x, p.y, p.z); g.mewBlob.visible = gy > -50;
    if (g.mewBlob.visible) { g.mewBlob.position.set(p.x, gy + .03, p.z); const k = Math.max(.25, 1 - (p.y - gy) * .22) * .46; g.mewBlob.scale.set(k, k, 1); }
    mewBubble.pos.set(p.x, p.y + 1.25, p.z);
    let o = 0; for (const k in friends) { animSit(friends[k], tAll, o += 1.3, happy[k] || 0, p); if (happy[k] > 0) happy[k] = Math.max(0, happy[k] - dt); }
    const c = s.L.coco; coco.position.set(c.x, c.y, c.z); coco.rotation.y = c.dir < 0 ? Math.PI : 0; animWalk(coco, s.time * 9, .8, false, tAll);
    coco.userData.eyes.forEach(e => e.scale.y = blink(tAll, 2)); g.cocoBlob.position.set(c.x, .03, c.z); cocoTag.pos.set(c.x, 1.25, c.z);
    mark.userData.bass.rotation.z = .45 + Math.sin(tAll * 4) * .015; mark.userData.head.rotation.z = Math.sin(tAll * 2) * .06; mark.position.y = mk.y + Math.abs(Math.sin(tAll * 4)) * .02;
    samuel.userData.wave.rotation.z = Math.sin(tAll * (home ? 11 : 6)) * .28; samuel.userData.head.rotation.z = Math.sin(tAll * 1.6) * .05; samuel.position.y = .3 + (home ? Math.abs(Math.sin(tAll * 7)) * .12 : 0);
    jenn.userData.head.rotation.z = .08 + Math.sin(tAll * 1.2) * .04;
    if (heartsT > 0) { heartsT -= dt; if (Math.random() < .3) fx.burst(p.x + (Math.random() - .5) * 2.5, p.y + 1, p.z - .6, 1, 'heart', .6, 1.6); }
  }

  // Behind and above Mew, looking up the garden. Before play it drifts gently; at the doorstep it moves in close.
  function moveCamera(dt, p, home) {
    let tx, ty, tz, lx, ly, lz;
    if (!playing) { const a = tAll * .25; tx = p.x * .72 + Math.sin(a) * 1.6; ty = p.y + camH * 1.1; tz = p.z + camDist * 1.1; lx = p.x; ly = p.y + 1; lz = p.z - 3.5; }
    else {
      camY += ((p.grounded ? p.y : Math.min(p.y, camY + 1.2)) - camY) * (1 - Math.exp(-(p.grounded ? 4 : 1.5) * dt)); if (p.y < camY - .2) camY = p.y + .2;
      const k = home ? .62 : 1; tx = p.x * .72; ty = camY + camH * k; tz = p.z + camDist * k; lx = p.x * .9; ly = camY + 1; lz = p.z - 3.5 * k;
    }
    const kf = camSnap && playing ? 1 : 1 - Math.exp(-(playing ? 7 : 3) * dt); if (playing) camSnap = false;
    camPos.x += (tx - camPos.x) * kf; camPos.y += (ty - camPos.y) * kf; camPos.z += (tz - camPos.z) * kf;
    camLook.x += (lx - camLook.x) * kf; camLook.y += (ly - camLook.y) * kf; camLook.z += (lz - camLook.z) * kf;
    camera.position.copy(camPos); camera.lookAt(camLook);
    // A small field-of-view kick while dashing.
    const fv = baseFov + (p.dashT > 0 ? 7 : 0); if (Math.abs(camera.fov - fv) > .05) { camera.fov += (fv - camera.fov) * (1 - Math.exp(-12 * dt)); camera.updateProjectionMatrix(); }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now; tAll += dt;
    if (live()) { const inp = input.read(); acc += dt; while (acc >= STEP) { course.step(s, inp, STEP); acc -= STEP; } }
    for (const e of s.events.splice(0)) handle(e);
    if (toastT > 0 && (toastT -= dt) <= 0) $('#toast').classList.remove('on');
    const p = s.p, home = s.reunion > 0 || s.won;
    animateCharacters(dt, p, home);
    g.animate(tAll, s, camPos);
    fx.update(dt, tAll, p, camPos);
    moveCamera(dt, p, home);
    if (playing && !s.paused) pipeline.watch(dt);
    pipeline.draw(); labels.update(W, H);
  }

  hud(); card('splash'); requestAnimationFrame(frame);
  // Hooks for browser checks and screenshots.
  window.mewQuest3d = { get state() { return s; }, setQuality: q => pipeline.lock(q), get quality() { return pipeline.quality; } };
}
