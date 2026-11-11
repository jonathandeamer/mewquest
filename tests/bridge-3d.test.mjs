import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as course from '../dist/3d/course.mjs';

test('stone bridge caps are the only top surface at walking height', async () => {
  // Use the real bundled geometry; only canvas painting needs a browser stub.
  await import('../dist/3d/vendor/three.min.js');
  const previousDocument = globalThis.document;
  const context = new Proxy({}, {get: (target, key) => key in target ? target[key] :
    key === 'createLinearGradient' ? () => ({addColorStop(){}}) : () => {}});
  globalThis.document = {createElement: () => ({getContext: () => context})};
  try {
    const {createStage, buildWorld} = await import('../dist/3d/scene.mjs');
    const level = course.level(), world = buildWorld(createStage(), level, {reduced: true}).world;
    world.updateMatrixWorld(true);
    const ray = new THREE.Raycaster();
    for (const bridge of level.P.filter(b => b.type === 'wall')) {
      ray.set(new THREE.Vector3(bridge.x + .13, bridge.top + 1, bridge.z + .17), new THREE.Vector3(0, -1, 0));
      const hits = ray.intersectObject(world, true).filter(hit => hit.object.geometry.type === 'BoxGeometry');
      assert.ok(hits.length >= 2, 'ray crosses the cap and its supporting base');
      assert.ok(Math.abs(hits[0].point.y - bridge.top) < 1e-6, 'cap meets the walking surface');
      assert.ok(hits[0].point.y - hits[1].point.y > .1, 'base is buried below the cap, without a coplanar face');
    }
  } finally {
    globalThis.document = previousDocument;
  }
});
