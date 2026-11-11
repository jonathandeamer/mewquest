// Sparkles and atmosphere: star, heart, puff and droplet bursts; Dreamie glows; the sun's glow;
// drifting pollen; and chimney smoke. Reduced motion thins the bursts and removes pollen.
import { THREE, lin, V, rnd, canvasTex } from './toolkit.mjs';

export function createEffects(scene, world, treats, { reduced }) {
  const sprMat = (draw, o) => new THREE.SpriteMaterial(Object.assign({ map: canvasTex(64, 64, draw), transparent: true, depthWrite: false }, o));
  const glowDraw = (a, b) => c => { const g = c.createRadialGradient(32, 32, 2, 32, 32, 32); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, 64, 64); };
  const PCOL = {
    star: sprMat(c => { glowDraw('rgba(255,244,180,.85)', 'rgba(255,220,90,0)')(c); c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? 10 : 23; c.lineTo(32 + Math.cos(a) * q, 32 + Math.sin(a) * q); } c.closePath(); c.fillStyle = '#ffd23e'; c.fill(); c.lineWidth = 3; c.lineJoin = 'round'; c.strokeStyle = '#fff8d0'; c.stroke(); }),
    heart: sprMat(c => { c.beginPath(); c.moveTo(32, 55); c.bezierCurveTo(2, 34, 10, 8, 32, 24); c.bezierCurveTo(54, 8, 62, 34, 32, 55); c.fillStyle = '#ff7b95'; c.fill(); c.lineWidth = 3; c.strokeStyle = '#ffd6de'; c.stroke(); }),
    puff: sprMat(glowDraw('rgba(255,255,255,.95)', 'rgba(255,255,255,0)')), drop: sprMat(glowDraw('rgba(235,252,255,1)', 'rgba(150,225,245,0)')),
  };
  const glowM = sprMat(glowDraw('rgba(255,225,130,.5)', 'rgba(255,200,80,0)'), { blending: THREE.AdditiveBlending });
  treats.forEach(g => { const glow = new THREE.Sprite(glowM); glow.scale.set(1.05, 1.05, 1); g.add(glow); });
  const sunSpr = new THREE.Sprite(sprMat(glowDraw('rgba(255,252,225,1)', 'rgba(255,240,170,0)'), { blending: THREE.AdditiveBlending, fog: false })); sunSpr.scale.set(46, 46, 1); scene.add(sunSpr);
  const POLLEN = reduced ? 0 : 70, polBase = [], polGeo = new THREE.BufferGeometry(); for (let i = 0; i < POLLEN; i++) polBase.push(rnd() * 30, rnd() * 5 + .3, rnd() * 40, rnd() * 6);
  polGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(POLLEN * 3), 3)); const pollen = new THREE.Points(polGeo, new THREE.PointsMaterial({ map: PCOL.puff.map, size: .13, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending, color: lin('#fff3c0') })); pollen.frustumCulled = false; scene.add(pollen);
  const smoke = [0, 1, 2, 3].map(i => { const s = new THREE.Sprite(PCOL.puff.clone()); s.material.fog = true; world.add(s); return s; });
  const parts = []; for (let i = 0; i < 70; i++) { const m = new THREE.Sprite(PCOL.star); m.visible = false; world.add(m); parts.push({ m, life: 0, v: V(0, 0, 0), g: 0, s: .3 }); }
  let pi = 0;
  function burst(x, y, z, n, kind, sp = 2.5, up = 2.5) { if (reduced) n = Math.ceil(n / 3); for (let i = 0; i < n; i++) { const p = parts[pi = (pi + 1) % parts.length]; p.m.material = PCOL[kind]; p.m.visible = true; p.m.position.set(x, y, z); p.v.set((Math.random() - .5) * sp, Math.random() * up + .5, (Math.random() - .5) * sp); p.life = p.max = .5 + Math.random() * .5; p.g = kind === 'heart' ? -1 : kind === 'puff' ? 1 : 6; p.s = { star: .3, heart: .32, puff: .34, drop: .24 }[kind]; } }

  function update(dt, tAll, p, camPos) {
    for (const q of parts) if (q.life > 0) { q.life -= dt; q.v.y -= q.g * dt; q.m.position.addScaledVector(q.v, dt); const k = Math.max(0, q.life / q.max); q.m.scale.set(q.s * (.4 + k), q.s * (.4 + k), 1); if (q.life <= 0) q.m.visible = false; }
    sunSpr.position.set(camPos.x + 62, 30, camPos.z - 165);
    // Pollen drifts in a box that travels with the camera.
    if (POLLEN) { const a = polGeo.attributes.position.array; for (let i = 0; i < POLLEN; i++) { const bx = polBase[i * 4], by = polBase[i * 4 + 1], bz = polBase[i * 4 + 2], o = polBase[i * 4 + 3]; a[i * 3] = camPos.x + ((bx + tAll * .3 - camPos.x) % 30 + 30) % 30 - 15 + Math.sin(tAll * .5 + o) * .4; a[i * 3 + 1] = p.y + by + Math.sin(tAll * .7 + o) * .3; a[i * 3 + 2] = camPos.z - 2 - ((bz - camPos.z) % 40 + 40) % 40; } polGeo.attributes.position.needsUpdate = true; }
    // Chimney smoke from the cottage at the end of the garden.
    smoke.forEach((sm, i) => { const u = (tAll * .22 + i / 4) % 1; sm.position.set(3 + u * 1.2 + Math.sin(u * 5 + i) * .25, 9.6 + u * 3.6, -154.2); const z = .7 + u * 1.6; sm.scale.set(z, z, 1); sm.material.opacity = (1 - u) * .6; });
  }

  return { burst, update };
}
