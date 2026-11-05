import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from '../dist/engine.mjs';
import {renderPixelGame} from '../dist/pixel-renderer.mjs';
test('pixel renderer draws the full garden with rectangular pixels only',()=>{let draws=0,colors=new Set();const ctx={fillStyle:'',fillRect(x,y,w,h){assert.ok([x,y,w,h].every(Number.isInteger),'pixel edges must be integer aligned');assert.ok(w>=0&&h>=0);draws++;colors.add(this.fillStyle);},clearRect(){},save(){},restore(){}};let g=createGame();for(let camera of [0,1700,3200,4410])renderPixelGame(ctx,g,camera,false);assert.ok(draws>1000);assert.ok(colors.size<=24,'use a restricted console palette');});
