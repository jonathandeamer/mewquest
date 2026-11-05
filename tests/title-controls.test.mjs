import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
// Exercise the real browser event handlers without needing a rendering host.
test('Enter starts from the title screen, C jumps, and Space no longer jumps',async()=>{
 const elements=new Map(),handlers={};
 function el(selector){if(!elements.has(selector))elements.set(selector,{hidden:false,textContent:'',innerHTML:'',style:{},dataset:{},classList:{add(){},remove(){}},focus(){},getContext(){return {};},addEventListener(){}});return elements.get(selector);}
 globalThis.document={querySelector:el,querySelectorAll:()=>[],addEventListener(){},hidden:false};
 globalThis.window={addEventListener:(name,fn)=>handlers[name]=fn};
 globalThis.matchMedia=()=>({matches:true});globalThis.requestAnimationFrame=()=>{};
 let source=await readFile(new URL('../dist/game.mjs',import.meta.url),'utf8');
 source=source.replace("from'./engine.mjs'",`from '${new URL('../dist/engine.mjs',import.meta.url).href}'`)+ '\nexport {g,input,playing};';
 let game=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const event=key=>({key,repeat:false,target:{tagName:'BODY'},preventDefault(){}});
 assert.equal(game.playing,false);
 handlers.keydown(event('Enter'));
 assert.equal(game.playing,true,'Enter should enter the game directly');
 assert.equal(el('#title-screen').hidden,true);
 handlers.keydown(event('c'));assert.equal(game.input.jump,true);
 handlers.keyup(event('c'));assert.equal(game.input.jump,false);
 handlers.keydown(event('C'));assert.equal(game.input.jump,true);
 handlers.keyup(event('C'));
 handlers.keydown(event(' '));assert.equal(game.input.jump,false,'Space should not trigger jump');
});
