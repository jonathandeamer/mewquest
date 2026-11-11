import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as course from '../dist/3d/course.mjs';
import {createPacer, rememberView, blendView} from '../dist/3d/pacing.mjs';

test('Mew stays aligned with a moving pad between simulation steps', () => {
  for (const hz of [60, 90, 120, 144]) {
    const s = course.create(), index = s.L.P.findIndex(b => b.move), pad = s.L.P[index];
    for (const stop of s.L.stops) for (const id of stop.ids) s.greeted.add(id);
    s.markGreeted = true;
    Object.assign(s.p, {x: pad.x + .3, y: pad.top, z: pad.z, grounded: true, on: pad});
    const before = {}, view = {}, pacer = createPacer(1 / 120);
    rememberView(before, s);
    for (let frame = 0; frame < hz * 4; frame++) {
      const dt = 1 / hz + Math.sin(frame) * .001;
      const alpha = pacer.advance(dt, () => { rememberView(before, s); course.step(s); });
      blendView(view, before, s, alpha);
      assert.ok(Math.abs(view.x - view.platformX[index] - .3) < 1e-9, `${hz} Hz: rider stays in place on pad`);
    }
    // A rest/restart snapshot must not interpolate from the previous location.
    course.toRest(s, 'rest'); rememberView(before, s);
    blendView(view, before, s, .5);
    assert.equal(view.x, s.p.x);
    assert.equal(view.platformX[index], pad.x);
  }
});
