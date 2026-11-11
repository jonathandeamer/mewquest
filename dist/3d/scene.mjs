// The garden: sky and sunlight, islands and platforms, pond, plants, gates, resting cushions,
// sprinklers, Dreamies and every character placed in the world.
import { THREE, lin, M, MB, setRim, mk, limb, V, rnd, canvasTex, texMat, SPH, SPHL, CYL, CONE, BOX, brickTex, woodTex, soilTex, roofTex } from './toolkit.mjs';
import { buildCat, buildSamuel, buildJenn, buildMark, CATS } from './characters.mjs';
import { sprayOn, sprayWarn } from './course.mjs';

// Sky, fog, lights and camera. The sun casts the shadows; the hemisphere light fills them with sky blue and grass green.
export function createStage() {
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(52, 1, 0.4, 240); // a tight near/far range keeps depth precise
  { const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256; const x = cv.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#4fb0ea'); g.addColorStop(.55, '#bfe8f4'); g.addColorStop(1, '#f4f7df'); x.fillStyle = g; x.fillRect(0, 0, 4, 256); const bg = new THREE.CanvasTexture(cv); bg.encoding = THREE.sRGBEncoding; scene.background = bg; }
  scene.fog = new THREE.Fog(lin('#d6eeea'), 48, 150);
  scene.add(new THREE.HemisphereLight(lin('#e6f4ff'), lin('#b9dc8c'), 0.47));
  const sun = new THREE.DirectionalLight(lin('#fff0cc'), 0.72); scene.add(sun); scene.add(sun.target);
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 30, bottom: -30, near: 1, far: 90 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 1.6; sun.shadow.camera.updateProjectionMatrix();
  return { scene, camera, sun };
}

// Build the whole garden for a course from course.mjs. Returns handles the game animates each frame.
export function buildWorld({ scene, sun }, course, { reduced }) {
  const L = () => course;
  const world = new THREE.Group(); scene.add(world);
  // Thin flat layers (stripes, foam, rings, soft shadows) are nudged towards the camera in depth so they never fight the surface beneath.
  const DECAL = { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 };
  const grass = M('#8fd05c'), grassD = M('#72b94e'), soil = M('#b98558'), stone = M('#d8d0c0'), stoneL = M('#efe6d2'), terra = M('#e08658'), terraD = M('#c56e45');
  function roundCap(w, d, r, h) { const s = new THREE.Shape(), x = w / 2, y = d / 2; s.moveTo(-x + r, -y); s.lineTo(x - r, -y); s.quadraticCurveTo(x, -y, x, -y + r); s.lineTo(x, y - r); s.quadraticCurveTo(x, y, x - r, y); s.lineTo(-x + r, y); s.quadraticCurveTo(-x, y, -x, y - r); s.lineTo(-x, -y + r); s.quadraticCurveTo(-x, -y, -x + r, -y); const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: .12, bevelSize: .12, bevelSegments: 4, curveSegments: 6 }); g.rotateX(-Math.PI / 2); return g; }
  const foams = [], foamM = new THREE.MeshBasicMaterial(Object.assign({ color: 0xffffff, transparent: true, opacity: .75, depthWrite: false }, DECAL));
  function foamDisc(x, z, r, par = world) { const m = new THREE.Mesh(new THREE.RingGeometry(r, r + .22, 36), foamM); m.rotation.x = -Math.PI / 2; m.position.set(x, -.885, z); par.add(m); foams.push(m); return m; }
  // A foam band around a rectangle; r rounds the corners to match rounded lawns.
  function roundRect(path, hw, hd, r, ccw) { const c = [[hw, -hd + r, hw, -hd, hw - r, -hd], [-hw + r, -hd, -hw, -hd, -hw, -hd + r], [-hw, hd - r, -hw, hd, -hw + r, hd], [hw - r, hd, hw, hd, hw, hd - r]]; if (ccw) { path.moveTo(hw, hd - r); for (const q of c) { path.lineTo(q[0], q[1]); path.quadraticCurveTo(q[2], q[3], q[4], q[5]); } } else { path.moveTo(hw, -hd + r); for (const q of c.slice().reverse()) { path.lineTo(q[4], q[5]); path.quadraticCurveTo(q[2], q[3], q[0], q[1]); } } path.closePath(); return path; }
  function foamRect(x, z, hw, hd, r = .02) { const o = .24, s = roundRect(new THREE.Shape(), hw + o, hd + o, r + o, true); s.holes.push(roundRect(new THREE.Path(), hw, hd, r, false)); const m = new THREE.Mesh(new THREE.ShapeGeometry(s), foamM); m.rotation.x = -Math.PI / 2; m.position.set(x, -.885, z); world.add(m); foams.push(m); }
  const movers = [];
  function slab(b, mat, top = mat) { const h = b.top - b.bottom, m = new THREE.Mesh(new THREE.BoxGeometry(b.hw * 2, h, b.hd * 2), [mat, mat, top, mat, mat, mat]); m.position.set(b.x, b.top - h / 2, b.z); world.add(m); return m; }
  function signBoard(lines, x, y, z, w = 1.9) {
    const tex = canvasTex(384, 192, () => {}); tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    const draw = () => { const c = tex.image.getContext('2d'); c.fillStyle = '#f6e7c2'; c.fillRect(0, 0, 384, 192); c.strokeStyle = '#5b4636'; c.lineWidth = 10; c.strokeRect(5, 5, 374, 182); c.fillStyle = '#4a4034'; c.textAlign = 'center'; c.font = '800 31px Grandstander, "Trebuchet MS", sans-serif'; lines.forEach((t, i) => c.fillText(t, 192, 192 / 2 + 14 + (i - (lines.length - 1) / 2) * 46)); tex.needsUpdate = true; };
    draw(); document.fonts && document.fonts.ready.then(draw);
    const g = new THREE.Group(); g.position.set(x, y, z); mk(CYL, M('#a97f52'), g, 0, .5, -.04, .06, 1, .06); mk(BOX, M('#a97f52'), g, 0, 1.15, 0, w + .12, w / 2 + .12, .07);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 2), new THREE.MeshBasicMaterial({ map: tex })); p.position.set(0, 1.15, .04); g.add(p); world.add(g); return g;
  }
  for (const b of L().P) {
    if (b.type === 'lawn') {
      slab(Object.assign({}, b, { top: b.top - .3, hw: b.hw - .22, hd: b.hd - .22 }), texMat(soilTex, Math.round(b.hw), 1)); const cap = new THREE.Mesh(roundCap(b.hw * 2 + .16, b.hd * 2 + .16, .7, .3), grass); cap.position.set(b.x, b.top - .42, b.z); world.add(cap); foamRect(b.x, b.z, b.hw - .2, b.hd - .2, .5);
      for (let z = b.z - b.hd + 1; z < b.z + b.hd - 1; z += 3.2) { const st = new THREE.Mesh(new THREE.PlaneGeometry(b.hw * 2 - 1, 1.6), M('#9ddb69', DECAL)); st.userData.noCast = true; st.rotation.x = -Math.PI / 2; st.position.set(b.x, b.top + .006, z + .8); world.add(st); }
    } else if (b.type === 'stone') { mk(CYL, stone, world, b.x, b.top - .7, b.z, b.r, 1.4, b.r); foamDisc(b.x, b.z, b.r); mk(CYL, stoneL, world, b.x, b.top - .04, b.z, b.r * .86, .1, b.r * .86); }
    else if (b.type === 'crate') { slab(b, texMat(woodTex, 1, 1), texMat(woodTex, 1, 1, '#f1dfc0')); const h = b.top - b.bottom; for (const y of [b.bottom + .08, b.top - .08]) mk(BOX, M('#a97f52'), world, b.x, y, b.z, b.hw * 2 + .08, .14, b.hd * 2 + .08); }
    else if (b.type === 'planter') { slab(b, stone, grass); mk(BOX, stoneL, world, b.x, b.top - .08, b.z, b.hw * 2 + .16, .16, b.hd * 2 + .16); mk(BOX, grass, world, b.x, b.top - .045, b.z, b.hw * 2 - .3, .1, b.hd * 2 - .3); }
    else if (b.type === 'plank') { slab(b, texMat(woodTex, 1, 7)); for (let z = b.z - b.hd + .6; z < b.z + b.hd; z += 3.2) for (const sx of [-1, 1]) mk(CYL, M('#a97f52'), world, b.x + sx * (b.hw - .1), -.6, z, .11, 1.3, .11); }
    else if (b.type === 'pot') { const h = b.top - b.bottom, m = new THREE.Mesh(new THREE.CylinderGeometry(b.r * .96, b.r * .66, h, 20), terra); m.position.set(b.x, b.top - h / 2 - .1, b.z); world.add(m); foamDisc(b.x, b.z, b.r * .78); mk(CYL, terraD, world, b.x, b.top - .16, b.z, b.r + .04, .3, b.r + .04); mk(CYL, M('#8a6a50'), world, b.x, b.top - .02, b.z, b.r * .9, .05, b.r * .9); }
    else if (b.type === 'terrace') { foamRect(b.x, b.z, b.hw, b.hd); slab(b, texMat(brickTex, 5, 3), M('#eadfc6')); mk(BOX, stoneL, world, b.x, b.top - .1, b.z, b.hw * 2 + .2, .2, b.hd * 2 + .2); mk(BOX, M('#eadfc6'), world, b.x, b.top - .05, b.z, b.hw * 2 - .2, .12, b.hd * 2 - .2); }
    else if (b.type === 'wall') {
      foamRect(b.x, b.z, b.hw, b.hd);
      // Bury the brick top inside the 18 cm cap: coincident top faces flicker as the camera moves.
      slab(Object.assign({}, b, {top: b.top - .16}), texMat(brickTex, 1, 3));
      mk(BOX, stoneL, world, b.x, b.top - .09, b.z, b.hw * 2 + .2, .18, b.hd * 2 + .1);
    }
    else if (b.type === 'shed') {
      slab(b, texMat(woodTex, 4, 1, '#f0d2a8')); mk(BOX, M('#7f948c'), world, b.x, b.top - .12, b.z, b.hw * 2 + .5, .24, b.hd * 2 + .5); mk(BOX, M('#8fa49b'), world, b.x, b.top - .03, b.z, b.hw * 2 + .2, .08, b.hd * 2 + .2);
      const fz = b.z + b.hd + .03; mk(BOX, M('#8a9a76'), world, b.x - .7, 1.05, fz, 1.1, 2.1, .06); mk(SPH, M('#e9c35a'), world, b.x - .32, 1.05, fz + .05, .06, .06, .04); mk(BOX, M('#f6e7c2'), world, b.x + 1, 1.6, fz, .95, .8, .06); mk(BOX, M('#a9d0cb'), world, b.x + 1, 1.6, fz + .02, .75, .6, .06);
    } else if (b.type === 'pad') {
      const g = new THREE.Group(); g.position.set(b.x, b.top, b.z); world.add(g);
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(b.r, b.r * .94, .16, 28, 1, false, .35, Math.PI * 2 - .7), M('#58bf6a')); pad.position.y = -.08; g.add(pad); mk(CYL, M('#4aa85c'), g, 0, -.55, 0, .13, .9, .13); { const f = foamDisc(0, 0, .16, g); f.position.set(0, -.885 - b.top, 0); }
      mk(CYL, M('#86dc8a'), g, 0, .005, 0, b.r * .62, .01, b.r * .62);
      for (let i = 0; i < 6; i++) { const p = mk(CONE, M(i % 2 ? '#f6c9cf' : '#f3aeb8'), g, -b.r * .62 + Math.cos(i) * .13, .14, b.r * .5 + Math.sin(i) * .13, .09, .26, .09); p.rotation.set(Math.sin(i) * .5, 0, Math.cos(i) * .5); }
      if (b.move) movers.push({ i: L().P.indexOf(b), g });
    } else if (b.type === 'step') { slab(b, stoneL); mk(BOX, M('#c98f72'), world, b.x, b.top + .012, b.z + .9, 1.9, .03, .9); }
    else if (b.type === 'cottage') {
      slab(b, M('#f3e4c2')); const fz = b.z + b.hd + .04;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(7.6, 3.4, 4), texMat(roofTex, 8, 3)); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, .8); roof.position.set(b.x, b.top + 1.7, b.z); world.add(roof);
      mk(BOX, M('#d6a888'), world, 3, b.top + 2.2, b.z, .9, 2.2, .9);
      mk(BOX, M('#f6e7c2'), world, 0, 1.6, fz, 1.9, 2.75, .08); mk(BOX, M('#7f9a78'), world, 0, 1.52, fz + .03, 1.5, 2.45, .1); mk(SPH, M('#e9c35a'), world, .52, 1.5, fz + .1, .07, .07, .05); mk(BOX, M('#a9d0cb'), world, 0, 2.2, fz + .06, .7, .5, .08);
      for (const sx of [-1, 1]) { mk(BOX, M('#f6e7c2'), world, sx * 3.1, 2.5, fz, 1.9, 1.7, .08); mk(BOX, M('#a9d0cb'), world, sx * 3.1, 2.5, fz + .03, 1.6, 1.4, .08); mk(BOX, M('#f6e7c2'), world, sx * 3.1, 2.5, fz + .06, .09, 1.4, .06); mk(BOX, M('#f6e7c2'), world, sx * 3.1, 2.5, fz + .06, 1.6, .09, .06); mk(BOX, M('#a97f52'), world, sx * 3.1, 1.5, fz + .16, 1.9, .3, .34);
        for (let i = 0; i < 6; i++) mk(SPH, M(['#ff8fa6', '#ffd95e', '#b79cf0'][i % 3]), world, sx * 3.1 - .75 + i * .3, 1.74, fz + .2, .13, .13, .13); }
    }
  }
  // pond, banks, hedges, trees, hills, clouds
  const waterU = { t: { value: 0 }, fogC: { value: new THREE.Color('#d6eeea') }, cam: { value: new THREE.Vector3() } }, grassU = { value: 0 };
  { const w = new THREE.Mesh(new THREE.PlaneGeometry(400, 520), new THREE.ShaderMaterial({ uniforms: waterU,
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: `uniform float t; uniform vec3 fogC; uniform vec3 cam; varying vec3 vW;
        vec2 h2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
        float vor(vec2 x){ vec2 n = floor(x), f = fract(x); float d1 = 8.0, d2 = 8.0;
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)); vec2 o = h2(n + g); o = 0.5 + 0.4 * sin(t * 0.9 + 6.2831 * o); float d = length(g + o - f); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; } }
          return d2 - d1; }
        void main(){ vec2 p = vW.xz * 0.42; p += vec2(sin(p.y * 1.7 + t * 0.5), cos(p.x * 1.5 + t * 0.4)) * 0.18;
          float line = 1.0 - smoothstep(0.03, 0.1, vor(p)); float soft = 1.0 - smoothstep(0.0, 0.4, vor(p * 0.5 + 7.3));
          vec3 c = mix(vec3(0.13, 0.63, 0.84), vec3(0.33, 0.83, 0.88), 0.45 + 0.35 * sin(vW.x * 0.25 + t * 0.3) * cos(vW.z * 0.21 - t * 0.25));
          float far = length(vW - cam); line *= 1.0 - smoothstep(22.0, 60.0, far); // distant lines are thinner than a pixel and would shimmer
        c += soft * 0.06; c = mix(c, vec3(0.94, 1.0, 1.0), line * 0.55);
          c = mix(c, fogC, smoothstep(48.0, 150.0, far)); gl_FragColor = vec4(c, 1.0); }` }));
    w.rotation.x = -Math.PI / 2; w.position.set(0, -.9, -80); world.add(w);
    const im = (geo, mat, n) => { const m = new THREE.InstancedMesh(geo, mat, n); m.frustumCulled = false; m.userData.noCast = true; world.add(m); return m; }, D = new THREE.Object3D(), put = (m, i, x, y, z, sx, sy = sx, sz = sx, ry = 0) => { D.position.set(x, y, z); D.scale.set(sx, sy, sz); D.rotation.set(0, ry, 0); D.updateMatrix(); m.setMatrixAt(i, D.matrix); };
    const pads = im(new THREE.CylinderGeometry(1, 1, .04, 14, 1, false, .3, 5.7), M('#62c477'), 70); let n = 0;
    while (n < 70) { const x = (rnd() - .5) * 28, z = 8 - rnd() * 170; if (L().P.some(b => b.kind === 'box' ? Math.abs(x - b.x) < b.hw + 1.2 && Math.abs(z - b.z) < b.hd + 1.2 : Math.hypot(x - b.x, z - b.z) < b.r + 3.2)) continue; put(pads, n++, x, -.87, z, .35 + rnd() * .5, 1, .35 + rnd() * .5, rnd() * 6); }
    for (const sx of [-1, 1]) { foamRect(sx * 22, -76, 7, 110); const bank = new THREE.Mesh(new THREE.BoxGeometry(14, 2, 220), grassD); bank.position.set(sx * 22, -.9, -76); world.add(bank); }
    const hedge = im(SPHL, M('#55a84d'), 150), hedge2 = im(SPHL, M('#7cc45f'), 150), trunk = im(CYL, M('#a07048'), 40), crown = im(SPHL, M('#4c9f49'), 40), crown2 = im(SPHL, M('#85cc66'), 40);
    for (let i = 0; i < 75; i++) for (const [k, sx] of [[0, -1], [1, 1]]) { const z = 14 - i * 2.5; put(hedge, i * 2 + k, sx * (16 + rnd() * .6), .9, z, 1.9 + rnd() * .5, 1.7 + rnd() * .5, 1.9); put(hedge2, i * 2 + k, sx * (17.4 + rnd()), 1.9 + rnd() * .4, z + 1.2, 1.7); }
    for (let i = 0; i < 20; i++) for (const [k, sx] of [[0, -1], [1, 1]]) { const z = 10 - i * 9 - rnd() * 4, x = sx * (21 + rnd() * 4), h = 4 + rnd() * 2.5; put(trunk, i * 2 + k, x, h / 2, z, .28, h, .28); put(crown, i * 2 + k, x, h + 1, z, 2.3 + rnd()); put(crown2, i * 2 + k, x + .8, h + 2, z + .5, 1.4 + rnd() * .5); }
    const hills = im(SPHL, M('#a9d8b4', { fog: false }), 12); for (let i = 0; i < 12; i++) put(hills, i, (i - 5.5) * 30 + rnd() * 8, -8, -205 - (i % 2) * 22, 30 + rnd() * 14, 20 + rnd() * 9, 20);
    const clouds = im(SPHL, M('#ffffff', { fog: false, roughness: 1 }), 36); for (let i = 0; i < 12; i++) { const x = (rnd() - .5) * 150, y = 20 + rnd() * 14, z = -60 - rnd() * 190; for (let k = 0; k < 3; k++) put(clouds, i * 3 + k, x + (k - 1) * 3.2, y + (k === 1 ? .9 : 0), z, 3 + (k === 1 ? 1.4 : 0), 1.9 + (k === 1 ? .8 : 0), 2.4); }
    // flowers and tufts on every lawn, kept off the middle of the path
    const lawns = L().P.filter(b => b.type === 'lawn' || b.type === 'planter'), stems = im(CYL, M('#4fa348'), 220), heads = im(SPHL, M('#ffffff'), 220), mids = im(SPHL, M('#ffc93e'), 220), cols = ['#ff8fa6', '#ffffff', '#b79cf0', '#ffd95e', '#ff7a5c'].map(lin);
    const spot = () => { const b = lawns[Math.floor(rnd() * lawns.length)], x = b.x + (rnd() * 2 - 1) * (b.hw - .5), z = b.z + (rnd() * 2 - 1) * (b.hd - .5); return [x, b.top, z, b]; };
    for (let i = 0; i < 220; i++) { let p; do p = spot(); while (p[3].type === 'lawn' && Math.abs(p[0]) < 2.2); const h = .28 + rnd() * .3; put(stems, i, p[0], p[1] + h / 2, p[2], .022, h, .022); put(heads, i, p[0], p[1] + h, p[2], .13 + rnd() * .05, .06, .13 + rnd() * .05); put(mids, i, p[0], p[1] + h + .03, p[2], .055, .05, .055); heads.setColorAt(i, cols[i % cols.length]); } heads.instanceColor.needsUpdate = true;
    // swaying grass: one instanced clump of blades, moved by the wind in the vertex shader
    const bg = (() => { const pos = [], col = [], idx = [], c0 = lin('#5cba48'), c1 = lin('#a9e468');
      for (let b = 0; b < 3; b++) { const a = b * 2.1, ox = Math.cos(a) * .06, oz = Math.sin(a) * .06, w = .05, h = .3 + b * .07, lean = .1, base = pos.length / 3, dx = Math.cos(a + 1.57), dz = Math.sin(a + 1.57);
        [[-w, 0], [w, 0], [-w * .7, h * .5], [w * .7, h * .5], [0, h]].forEach(([q, y]) => { const k = y / h; pos.push(ox + dx * q + Math.cos(a) * lean * k * k, y, oz + dz * q + Math.sin(a) * lean * k * k); const c = c0.clone().lerp(c1, k); col.push(c.r, c.g, c.b); });
        idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2, base + 2, base + 3, base + 4, base + 2, base + 1, base, base + 2, base + 3, base + 1, base + 4, base + 3, base + 2); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); const nr = []; for (let i = 0; i < pos.length / 3; i++) nr.push(0, 1, 0); g.setAttribute('normal', new THREE.Float32BufferAttribute(nr, 3)); return g; })();
    const bm = new THREE.MeshLambertMaterial({ vertexColors: true });
    bm.onBeforeCompile = sh => { sh.uniforms.uT = grassU; sh.vertexShader = 'uniform float uT;\n' + sh.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = position;\n#ifdef USE_INSTANCING\nfloat gw = sin(uT * 1.8 + instanceMatrix[3].x * 0.8 + instanceMatrix[3].z * 0.6) + 0.5 * sin(uT * 3.1 + instanceMatrix[3].z * 1.3);\ntransformed.x += gw * 0.2 * position.y; transformed.z += gw * 0.08 * position.y;\n#endif'); };
    const NB = 3200, blades = im(bg, bm, NB), keepOff = (x, y, z, b) => L().P.some(o => o !== b && o.top > y && (o.kind === 'box' ? Math.abs(x - o.x) < o.hw + .25 && Math.abs(z - o.z) < o.hd + .25 : false)) || L().sprinklers.some(q => Math.hypot(x - q.x, z - q.z) < q.r + .35) || L().checkpoints.some(q => Math.hypot(x - q.x, z - q.z) < 1.3) || (z < -134 && Math.abs(x) < 1.3);
    for (let i = 0; i < NB; i++) { let p, n = 0; do p = spot(); while (keepOff(p[0], p[1], p[2], p[3]) && ++n < 20); put(blades, i, p[0], p[1], p[2], .8 + rnd() * .6, .4 + rnd() * .5, .8 + rnd() * .6, rnd() * 6); }
    // a stepping-stone path up to the door
    for (let d = 135.5; d < 147; d += 1.7) mk(CYL, stoneL, world, Math.sin(d) * .5, .012, -d, .62, .03, .5);
    for (const b of lawns.filter(b => b.type === 'lawn')) for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const x = b.x + sx * (b.hw - .9), z = b.z + sz * (b.hd - .9); if (Math.abs(z + 147) < 12) continue; mk(SPH, M('#55a84d'), world, x, .45, z, .8, .62, .8); mk(SPH, M('#7cc45f'), world, x + sx * -.5, .32, z + .3, .5, .42, .5); }
  }
  signBoard(['Home is this way!', 'Say hi to your friends'], -2.7, 0, -4.2, 2.5); // close enough to the path to fit a portrait phone screen
  signBoard(['Big gap ahead!', 'Jump, then Dash'], 3.6, 0, -114.6, 2.3);
  // ducks on the pond
  const ducks = [[-6, -20], [7, -64], [-7.5, -121]].map(([x, z]) => { const g = new THREE.Group(); mk(SPH, M('#ffd94a'), g, 0, .16, 0, .3, .22, .4); mk(SPH, M('#ffd94a'), g, 0, .46, .24, .2, .19, .2); const bk = mk(CONE, M('#f0a04a'), g, 0, .43, .46, .08, .16, .05); bk.rotation.x = Math.PI / 2; for (const sx of [-1, 1]) mk(SPH, MB('#3a2e28'), g, sx * .1, .5, .4, .03, .035, .02); g.position.set(x, -.9, z); world.add(g); return g; });

  // gates
  const gates = L().stops.map(st => {
    const g = new THREE.Group(), y = st.gateY || 0, w = st.gateW; g.position.set(0, y, -st.gate); world.add(g);
    for (const sx of [-1, 1]) { mk(CYL, M('#f6e7c2'), g, sx * (w / 2 - .25), 1.1, 0, .09, 2.2, .09); mk(SPH, M('#e9b949'), g, sx * (w / 2 - .25), 2.3, 0, .15, .15, .15); }
    const n = Math.round(w * 1.6); for (let i = 0; i < n; i++) { const u = (i + .5) / n, x = (u - .5) * (w - .6), sag = 1.95 - Math.sin(u * Math.PI) * .45; const f = mk(CONE, M(['#e08086', '#e9b949', '#6fa59c'][i % 3]), g, x, sag, 0, .2, .36, .03); f.rotation.x = Math.PI; }
    for (let i = 0; i < 12; i++) { const u0 = i / 12, u1 = (i + 1) / 12, a = V((u0 - .5) * (w - .5), 2.15 - Math.sin(u0 * Math.PI) * .45, 0), b = V((u1 - .5) * (w - .5), 2.15 - Math.sin(u1 * Math.PI) * .45, 0); limb(g, M('#e08086'), a, b, .028); }
    const veil = new THREE.Mesh(new THREE.PlaneGeometry(w - .5, 5), new THREE.MeshBasicMaterial({ color: '#f3aeb8', transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide })); veil.position.y = 2.5; g.add(veil);
    return { st, g, pos: V(0, y + 2.9, -st.gate) };
  });
  // cosy cushions
  const cushM = M('#e9a0a6'), flagOff = M('#b9c69a'), flagOn = M('#e9b949');
  const cushions = L().checkpoints.map((c, i) => { const g = new THREE.Group(); g.position.set(c.x, c.y, c.z); world.add(g); mk(SPH, cushM, g, 0, .07, 0, .72, .12, .56); mk(SPH, M('#f6c9cf'), g, 0, .1, 0, .5, .1, .38); mk(CYL, M('#f6e7c2'), g, .95, .85, -.2, .045, 1.7, .045); const flag = mk(BOX, i ? flagOff : flagOn, g, 1.27, 1.48, -.2, .6, .36, .04); return { g, flag }; });
  // sprinklers
  const DROPS = 26, sprM = new THREE.InstancedMesh(new THREE.SphereGeometry(.07, 6, 5), MB('#e3f6f8'), L().sprinklers.length * DROPS); sprM.frustumCulled = false; world.add(sprM);
  const sprRings = L().sprinklers.map(sp => { mk(CYL, M('#6fa59c'), world, sp.x, sp.y + .1, sp.z, .16, .2, .16); mk(SPH, M('#e9b949'), world, sp.x, sp.y + .26, sp.z, .1, .1, .1);
    const ring = new THREE.Mesh(new THREE.RingGeometry(sp.r - .1, sp.r, 40), new THREE.MeshBasicMaterial(Object.assign({ color: '#5fa9b5', transparent: true, opacity: .5, depthWrite: false }, DECAL))); ring.rotation.x = -Math.PI / 2; ring.position.set(sp.x, sp.y + .07, sp.z); world.add(ring);
    const fill = new THREE.Mesh(new THREE.CircleGeometry(sp.r - .1, 40), new THREE.MeshBasicMaterial(Object.assign({ color: '#bfe6ea', transparent: true, opacity: .3, depthWrite: false }, DECAL))); fill.rotation.x = -Math.PI / 2; fill.position.set(sp.x, sp.y + .06, sp.z); world.add(fill); return { ring, fill }; });
  // Dreamies
  const treatM = M('#dcb47e'), treats = L().treats.map(t => { const g = new THREE.Group(); mk(BOX, treatM, g, 0, 0, 0, .42, .42, .16); mk(BOX, M('#ecd0a4'), g, 0, 0, 0, .26, .26, .19); g.position.set(t.x, t.y, t.z); world.add(g); return g; });
  // friends
  const blobG = new THREE.CircleGeometry(1, 20), blobM = new THREE.MeshBasicMaterial(Object.assign({ color: 0x16300f, transparent: true, opacity: .2, depthWrite: false }, DECAL));
  const blob = (x, y, z, r) => { const m = new THREE.Mesh(blobG, blobM); m.rotation.x = -Math.PI / 2; m.position.set(x, y + .03, z); m.scale.set(r, r, 1); world.add(m); return m; };
  setRim(true);
  function placeCat(key, x, y, z, ry, scale = 1, sit = true) { const c = buildCat(CATS[key], sit); c.position.set(x, y, z); c.rotation.y = ry; c.scale.setScalar(scale); world.add(c); if (sit) blob(x, y, z, .42 * scale); return c; }
  const st = L().stops, friends = {
    rosie: placeCat('rosie', st[0].x, st[0].y, st[0].z, -.5, 1.15), ernie: placeCat('ernie', st[1].x, st[1].y, st[1].z, -.45, 1.7),
    darwin: placeCat('darwin', -3.75, 3, -110.2, .3, 1.15), minka: placeCat('minka', -2.45, 3, -110.35, .15, 1.1),
  };
  const mark = buildMark(); mark.position.set(L().mark.x, L().mark.y, L().mark.z); mark.rotation.y = -.35; world.add(mark); blob(mark.position.x, mark.position.y, mark.position.z, .7);
  const jenn = buildJenn(); jenn.position.set(-1.25, .3, -149.1); jenn.rotation.y = .3; jenn.scale.setScalar(1.25); world.add(jenn); blob(-1.25, .3, -149.1, .75);
  const samuel = buildSamuel(); samuel.position.set(1.45, .3, -149.2); samuel.rotation.y = -.25; samuel.scale.setScalar(1.05); world.add(samuel); blob(1.45, .3, -149.2, .4);
  const coco = placeCat('coco', 0, 0, 0, 0, 1.1, false), cocoBlob = blob(0, 0, 0, .45);
  const mew = buildCat(CATS.mew, false); mew.scale.setScalar(1.12); world.add(mew); const mewBlob = blob(0, 0, 0, .45);
  setRim(false);
  // butterflies
  const flies = reduced ? [] : [0, 1, 2, 3, 4].map(i => { const g = new THREE.Group(), m = MB(['#f3aeb8', '#f6dc8f', '#c9b6e3'][i % 3], { side: THREE.DoubleSide }); const wings = [-1, 1].map(sx => { const p = new THREE.Group(); const w = new THREE.Mesh(new THREE.CircleGeometry(.11, 8), m); w.position.x = sx * .1; w.rotation.x = -Math.PI / 2; p.add(w); g.add(p); return p; }); world.add(g); return { g, wings, o: i * 1.7 }; });
  // shadows: everything solid casts and receives, except the far scenery
  world.traverse(o => { if (o.isMesh) { const m = o.material, soft = !Array.isArray(m) && (m.isMeshBasicMaterial || m.isShaderMaterial || m.transparent); o.castShadow = !soft && !o.userData.noCast; o.receiveShadow = !soft; } });

  // Per-frame motion for everything in the garden that isn't a character.
  const D2 = new THREE.Object3D();
  function animate(tAll, s, camPos, p = s.p) {
    const t = s.time;
    for (const m of movers) m.g.position.x = p.platformX?.[m.i] ?? s.L.P[m.i].x;
    treats.forEach((g, i) => { if (g.visible) { g.rotation.y = tAll * 2 + i; g.position.y = s.L.treats[i].y + Math.sin(tAll * 2.4 + i) * .08; } });
    ducks.forEach((d, i) => { d.position.y = -.92 + Math.sin(tAll * 1.5 + i) * .03; d.rotation.y = Math.sin(tAll * .3 + i * 2) * 1.2; });
    flies.forEach(f => { const a = tAll * .5 + f.o; f.g.position.set(Math.sin(a * 1.3 + f.o) * 4.5, 1.3 + Math.sin(a * 2.1) * .5 + Math.max(0, p.y), p.z - 5 - f.o * 2.2 + Math.cos(a) * 2); f.g.rotation.y = a; f.wings.forEach((w, i) => w.rotation.z = (i ? 1 : -1) * Math.sin(tAll * 16 + f.o) * .9); });
    // Sprinklers: a fountain of drops while on, a short sputter as a warning before they start again.
    s.L.sprinklers.forEach((spk, si) => { const on = sprayOn(s, spk), warn = sprayWarn(s, spk); sprRings[si].ring.material.opacity = on ? .85 : warn ? .5 + Math.sin(tAll * 30) * .3 : .3; sprRings[si].fill.visible = on;
      for (let j = 0; j < DROPS; j++) { const a = j * 2.39996 + t * .8, u = (t * 1.25 + j * .377) % 1; let x = 0, y = -5, z = 0; if (on) { x = Math.cos(a) * spk.r * u * .95; z = Math.sin(a) * spk.r * u * .95; y = .25 + 5.2 * u * (1 - u); } else if (warn && j < 8) { x = Math.cos(a) * .25 * u; z = Math.sin(a) * .25 * u; y = .25 + 1.6 * u * (1 - u); } D2.position.set(spk.x + x, spk.y + y, spk.z + z); D2.updateMatrix(); sprM.setMatrixAt(si * DROPS + j, D2.matrix); } });
    sprM.instanceMatrix.needsUpdate = true;
    // The sun's shadow box follows Mew so shadows stay crisp near the camera.
    const lx0 = Math.round(p.x * .5), lz0 = Math.round(p.z) - 16; sun.target.position.set(lx0, 0, lz0); sun.position.set(lx0 + 22, 28, lz0 + 12); sun.target.updateMatrixWorld();
    waterU.t.value = tAll; waterU.cam.value.copy(camPos); grassU.value = reduced ? 0 : tAll;
    const fo = .55 + Math.sin(tAll * 1.6) * .25; foamM.opacity = fo; for (let i = 0; i < foams.length; i++) { const k = 1 + Math.sin(tAll * 1.3 + i) * .012; foams[i].scale.set(k, k, 1); }
  }

  for (const k in friends) friends[k].userData.y0 = friends[k].position.y;
  return { world, gates, cushions, flagOn, flagOff, treats, friends, mark, jenn, samuel, coco, cocoBlob, mew, mewBlob, animate };
}
