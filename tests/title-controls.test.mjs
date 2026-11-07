import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
// Exercise the real browser event handlers without needing a rendering host.
test('the game starts immediately, fills the viewport, renders illustrations and keeps C jump',async()=>{
 const elements=new Map(),handlers={};
 function el(selector){if(!elements.has(selector))elements.set(selector,{hidden:false,textContent:'',innerHTML:'',style:{},dataset:{},classList:{add(){},remove(){}},focus(){},getContext(){return new Proxy({createLinearGradient(){return {addColorStop(){}};}},{get(target,key){return key in target?target[key]:()=>{};}});},paused:true,play(){return Promise.resolve();},pause(){},setAttribute(){},addEventListener(){}});return elements.get(selector);}
 globalThis.document={querySelector:el,querySelectorAll:()=>[],addEventListener(){},hidden:false};
 globalThis.window={addEventListener:(name,fn)=>handlers[name]=fn};
 globalThis.Image=class{complete=false;naturalWidth=0;naturalHeight=0;};
 globalThis.matchMedia=()=>({matches:true});globalThis.requestAnimationFrame=()=>{};
 let source=await readFile(new URL('../dist/game.mjs',import.meta.url),'utf8');
 source=source.replace("from'./touch-controls.mjs'",`from '${new URL('../dist/touch-controls.mjs',import.meta.url).href}'`).replace("from'./pickup-stars.mjs'",`from '${new URL('../dist/pickup-stars.mjs',import.meta.url).href}'`).replace("from'./viewport.mjs'",`from '${new URL('../dist/viewport.mjs',import.meta.url).href}'`).replace("from'./characters.mjs'",`from '${new URL('../dist/characters.mjs',import.meta.url).href}'`).replace("from'./friends.mjs'",`from '${new URL('../dist/friends.mjs',import.meta.url).href}'`).replace("from'./ernie.mjs'",`from '${new URL('../dist/ernie.mjs',import.meta.url).href}'`).replace("from'./music.mjs'",`from '${new URL('../dist/music.mjs',import.meta.url).href}'`).replace("from'./jenn-sprite.mjs'",`from '${new URL('../dist/jenn-sprite.mjs',import.meta.url).href}'`).replace("from'./engine.mjs'",`from '${new URL('../dist/engine.mjs',import.meta.url).href}'`)+ '\nexport {g,input,playing,showMenu,draw,jennImage,markImage,samuelImage};';
 let game=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 game.draw();for(let image of [game.jennImage,game.markImage,game.samuelImage]){image.complete=true;image.naturalWidth=1024;image.naturalHeight=1536;}game.draw();
 globalThis.window.innerWidth=390;globalThis.window.innerHeight=844;handlers.resize();game.draw();assert.equal(el('#game').width,250);assert.equal(el('#game').height,540);
 const event=key=>({key,repeat:false,target:{tagName:'BODY'},preventDefault(){}});
 assert.equal(game.playing,true,'garden must be playable immediately');
 handlers.keydown(event('Enter'));
 assert.equal(game.playing,true,'Enter should enter the game directly');
 assert.equal(game.playing,true);
 handlers.keydown(event('c'));assert.equal(game.input.jump,true);
 handlers.keyup(event('c'));assert.equal(game.input.jump,false);
 handlers.keydown(event('C'));assert.equal(game.input.jump,true);
 handlers.keyup(event('C'));
 handlers.keydown(event(' '));assert.equal(game.input.jump,false,'Space should not trigger jump');
 game.g.mewGreetingText='Hi Minka And Darwin';game.g.mewGreetingTime=4;game.draw();
 game.g.pickupStars.push({x:100,y:350,age:.2});game.draw();
 game.g.collected.add(0);game.g.collected.add(1);game.showMenu('won');
 assert.equal(el('#menu-copy').innerHTML,'Mew is reunited with Jenn and Samuel! Time to watch Coronation Street together on the sofa with some crisps and Dreamies :)<br><span class="reunion-count">Dreamies collected: 2 / 12</span>');
 for(const id of ['#menu-eyebrow','#menu-title','#menu-foot','#start'])assert.equal(el(id).hidden,true,`${id} must not appear in the ending popup`);
 game.showMenu('pause');
 for(const id of ['#menu-eyebrow','#menu-title','#menu-foot','#start'])assert.equal(el(id).hidden,false,`${id} must be restored for pause`);
});
