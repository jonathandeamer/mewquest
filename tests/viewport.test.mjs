import{test}from'node:test';import assert from'node:assert/strict';
import{gameViewport,followCamera}from'../dist/viewport.mjs';
test('viewport fills landscape and portrait screens without changing character proportions',()=>{for(let[w,h]of[[1920,1080],[390,844],[2560,1080],[844,390]]){let v=gameViewport(w,h);assert.equal(v.height,540);assert.ok(Math.abs(v.width/v.height-w/h)<.002);}});
test('camera follows Mew and keeps the garden inside its bounds',()=>{for(let width of[250,960,1280]){assert.equal(followCamera(0,width),0);assert.ok(followCamera(3000,width)>0);assert.ok(followCamera(5500,width)+width<=5400);}});
