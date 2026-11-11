// Rendering pipeline: a soft "diorama" finish (gentle focus blur at the top and bottom of the screen,
// richer colour and a light vignette) and automatic quality steps for slower phones.
import { THREE } from './toolkit.mjs';

export function createRenderer(canvas) {
  // Some browsers refuse antialiasing but still allow WebGL, so try twice before giving up.
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { renderer = new THREE.WebGLRenderer({ canvas, antialias: false }); }
  canvas.addEventListener('webglcontextlost', e => e.preventDefault());
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  return renderer;
}

export function createPipeline(renderer, { scene, camera, sun }, startQuality) {
  // Quality steps down by itself on slower phones: 3 = everything, 0 = bare.
  let Q = startQuality, rt = null, postOK = true, ft = .016, qT = 0, qLock = false, W = 1, H = 1;
  const dpr = () => Math.min(devicePixelRatio || 1, [1, 1.25, 1.5, 2][Q]);
  const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const postMat = new THREE.ShaderMaterial({ uniforms: { tD: { value: null }, px: { value: new THREE.Vector2() }, k: { value: 1 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `uniform sampler2D tD; uniform vec2 px; uniform float k; varying vec2 vUv;
      void main(){ // diorama look: sharp around Mew, soft towards the top and bottom of the screen
        float b = smoothstep(0.2, 0.62, abs(vUv.y - 0.4)) * 2.6 * k; vec3 c = texture2D(tD, vUv).rgb;
        if (b > 0.05) { vec3 a = c; for (int i = 0; i < 8; i++) { float an = float(i) * 0.7854; vec2 o = vec2(cos(an), sin(an)) * px * b; a += texture2D(tD, vUv + o).rgb; a += texture2D(tD, vUv + o * 2.1).rgb * 0.6; } c = a / 13.8; }
        float l = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(l), c, 1.14); c = mix(c, c * c * (3.0 - 2.0 * c), 0.3);
        vec2 q = vUv - 0.5; c *= 1.0 - dot(q, q) * 0.34; gl_FragColor = vec4(c, 1.0); }` });
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));
  function applyQuality() {
    renderer.setPixelRatio(dpr()); renderer.setSize(W, H, false); sun.castShadow = Q >= 1;
    const ms = Q >= 2 ? 2048 : 1024; if (sun.shadow.mapSize.x !== ms) { sun.shadow.mapSize.set(ms, ms); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
    if (rt) { rt.dispose(); rt = null; }
    if (Q >= 2 && postOK) try { const w = Math.max(2, Math.floor(W * dpr())), h = Math.max(2, Math.floor(H * dpr())), o = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
      rt = renderer.capabilities.isWebGL2 ? new THREE.WebGLMultisampleRenderTarget(w, h, o) : new THREE.WebGLRenderTarget(w, h, o); rt.texture.encoding = THREE.sRGBEncoding; postMat.uniforms.px.value.set(1 / w, 1 / h); postMat.uniforms.k.value = dpr(); } catch (e) { postOK = false; rt = null; }
  }
  function draw() {
    if (rt) try { renderer.setRenderTarget(rt); renderer.render(scene, camera); renderer.setRenderTarget(null); postMat.uniforms.tD.value = rt.texture; renderer.render(postScene, postCam); return; } catch (e) { postOK = false; rt.dispose(); rt = null; renderer.setRenderTarget(null); }
    renderer.render(scene, camera);
  }
  function setSize(w, h) { W = w; H = h; applyQuality(); }
  // Called once per frame during play. If frames stay slow for three seconds, drop one quality step.
  function watch(dt) { if (qLock || Q === 0) return; ft = ft * .96 + dt * .04; qT += dt; if (qT > 3 && ft > .03) { Q--; qT = 0; ft = .016; applyQuality(); } }
  function lock(q) { Q = q; qLock = true; applyQuality(); }
  return { setSize, draw, watch, lock, get quality() { return Q; } };
}
