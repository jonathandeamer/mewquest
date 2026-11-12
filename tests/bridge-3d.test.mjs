import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as course from '../dist/3d/course.mjs';

// Build the real garden once with the bundled three.js geometry; only canvas painting needs a browser stub.
// (Building again would scatter the flowers and grass differently, since their layout comes from one seeded sequence.)
let garden;
const buildGarden = () => garden ??= build();
async function build() {
  await import('../dist/3d/vendor/three.min.js');
  const previousDocument = globalThis.document;
  const context = new Proxy({}, {get: (target, key) => key in target ? target[key] :
    key === 'createLinearGradient' ? () => ({addColorStop() {}}) : () => {}});
  globalThis.document = {createElement: () => ({getContext: () => context})};
  try {
    const {createStage, buildWorld} = await import('../dist/3d/scene.mjs');
    const level = course.level(), world = buildWorld(createStage(), level, {reduced: true}).world;
    world.updateMatrixWorld(true);
    return {level, world};
  } finally {
    globalThis.document = previousDocument;
  }
}

// Solid built surfaces under a point, highest first, from a ray cast straight down. Scattered scenery drawn
// in bulk (grass, flowers, hedges) is skipped: blades overlapping each other are not stacked surfaces.
function surfacesBelow(world, x, y, z) {
  const ray = new THREE.Raycaster(new THREE.Vector3(x, y, z), new THREE.Vector3(0, -1, 0));
  return ray.intersectObject(world, true).filter(hit => hit.object.isMesh && !hit.object.isInstancedMesh && !hit.object.material.transparent);
}

test('stone wall caps are the only top surface at walking height', async () => {
  const {level, world} = await buildGarden();
  for (const wall of level.P.filter(b => b.type === 'wall')) {
    const hits = surfacesBelow(world, wall.x + .13, wall.top + 1, wall.z + .17).filter(hit => hit.object.geometry.type === 'BoxGeometry');
    assert.ok(hits.length >= 2, 'ray crosses the cap and its supporting base');
    assert.ok(Math.abs(hits[0].point.y - wall.top) < 1e-6, 'cap meets the walking surface');
    assert.ok(hits[0].point.y - hits[1].point.y > .1, 'base is buried below the cap, without a coplanar face');
  }
});

test('no platform shows two different surfaces at the same height on top', async () => {
  // Two meshes whose visible top faces coincide flicker as the camera moves (z-fighting).
  const {level, world} = await buildGarden(), clashes = [];
  for (const b of level.P) {
    // Clashes tend to be thin bands at rims, so walk two lines across each platform every 3 cm.
    const [ex, ez] = b.kind === 'box' ? [b.hw + .15, b.hd + .15] : [b.r + .15, b.r + .15], points = [];
    for (let d = -ex; d <= ex; d += .03) points.push([b.x + d, b.z + ez * .23]);
    for (let d = -ez; d <= ez; d += .03) points.push([b.x + ex * .19, b.z + d]);
    for (const [x, z] of points) {
      const [top, next] = surfacesBelow(world, x, b.top + 2, z);
      if (top && next && top.object !== next.object && Math.abs(top.point.y - next.point.y) < 1e-4) {
        clashes.push(`${b.type} at ${(-b.z).toFixed(1)} m (x ${x.toFixed(2)}, height ${top.point.y.toFixed(2)})`);
      }
    }
  }
  assert.deepEqual([...new Set(clashes.map(c => c.split(' (')[0]))], [], clashes.slice(0, 5).join('\n'));
});
