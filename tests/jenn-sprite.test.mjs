import{test}from'node:test';
import assert from'node:assert/strict';
import{drawJennSprite}from'../dist/jenn-sprite.mjs';
test('Jenn sprite uses intrinsic proportions and stands at the goal doorstep',()=>{const calls=[];let ctx={drawImage(...args){calls.push(args);}};const image={complete:true,naturalWidth:800,naturalHeight:1000};assert.equal(drawJennSprite(ctx,image,5210,420),true);let [asset,x,y,w,h]=calls[0];assert.equal(asset,image);assert.equal(h,156);assert.equal(w,124.8);assert.equal(y+h,420);assert.ok(x<5210&&x+w>5210);});
test('unloaded or broken sprite requests fallback instead of throwing',()=>{assert.equal(drawJennSprite({},null,5210,420),false);assert.equal(drawJennSprite({},{complete:false},5210,420),false);assert.equal(drawJennSprite({},{complete:true,naturalWidth:0,naturalHeight:0},5210,420),false);});
