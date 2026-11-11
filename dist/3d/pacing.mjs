// Frame pacing. The course advances in fixed steps, but screens refresh at their own rate (60, 90, 120 Hz...),
// so a frame may cover one step, two, or none. Drawing the latest step as-is makes movement lurch; instead the
// game draws a blend of the last two steps, using how far the frame sits between them.
export function createPacer(step, maxFrame = .05) {
  let acc = 0;
  return {
    // Run the whole steps this frame covers. Returns alpha (0..1): how far past the previous step the frame is.
    advance(dt, tick) { acc += Math.min(dt, maxFrame); while (acc >= step) { tick(); acc -= step; } return acc / step; },
    reset() { acc = 0; },
  };
}
export const mix = (a, b, t) => a + (b - a) * t;

// Keep riders and the platforms carrying them on the same render timeline.
export function rememberView(before, s) {
  before.x = s.p.x; before.y = s.p.y; before.z = s.p.z; before.coco = s.L.coco.z;
  before.platformX ??= [];
  s.L.P.forEach((b, i) => { before.platformX[i] = b.x; });
}
export function blendView(view, before, s, alpha) {
  Object.assign(view, s.p);
  view.x = mix(before.x, s.p.x, alpha); view.y = mix(before.y, s.p.y, alpha); view.z = mix(before.z, s.p.z, alpha);
  view.cocoZ = mix(before.coco, s.L.coco.z, alpha);
  view.platformX ??= [];
  s.L.P.forEach((b, i) => { view.platformX[i] = mix(before.platformX[i], b.x, alpha); });
  return view;
}
