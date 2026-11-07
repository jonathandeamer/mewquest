import{bindTouchControls,mergeInputs}from'./touch-controls.mjs';
import{drawPickupStars}from'./pickup-stars.mjs';
import{gameViewport,followCamera,shouldShowSplash}from'./viewport.mjs';
import{drawMewGreeting}from'./ernie.mjs';
import{drawFriends,drawGreetingGates,drawSamuel,drawMark,drawCheckpoints}from'./characters.mjs';
import{missingCats,missingFriends,FRIEND_NAMES}from'./friends.mjs';
import{syncMusic}from'./music.mjs';
import{drawJennSprite}from'./jenn-sprite.mjs';
import{createGame,step,reset,returnToCheckpoint,W,H}from'./engine.mjs';
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d'),$=s=>document.querySelector(s),g=createGame(),input={},keyboardInput={},touchInput={};let playing=!shouldShowSplash({width:window.innerWidth||960,touch:matchMedia('(any-pointer: coarse)').matches||!!globalThis.navigator?.maxTouchPoints}),camera=0,last=0,acc=0,sound=false,audio,viewWidth=W,touchControls;
let touchMode=matchMedia('(any-pointer: coarse)').matches||!!globalThis.navigator?.maxTouchPoints;
$('#mobile-splash').hidden=playing;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const soundtrack=document.querySelector('#soundtrack');
function updateMusic(){syncMusic(soundtrack,{enabled:sound,active:playing&&!g.paused&&!g.won&&!document.hidden});}
const jennImage=new Image();jennImage.src='assets/jenn-welcome.png';
const samuelImage=new Image();samuelImage.src='assets/samuel-illustrated.png';
const markImage=new Image();markImage.src='assets/mark-stocky.png';
function resizeGame(){const bounds=canvas.getBoundingClientRect?.();const v=gameViewport(bounds?.width||window.innerWidth||960,bounds?.height||window.innerHeight||540);viewWidth=v.width;canvas.width=v.width;canvas.height=v.height;ctx.imageSmoothingEnabled=true;camera=followCamera(g.player.x,viewWidth);}
window.addEventListener('resize',resizeGame);window.visualViewport?.addEventListener('resize',resizeGame);resizeGame();
function tone(freq=520){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();let o=audio.createOscillator(),v=audio.createGain();o.type='sine';o.frequency.value=freq;v.gain.setValueAtTime(.035,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.15);o.connect(v);v.connect(audio.destination);o.start();o.stop(audio.currentTime+.15);}catch{}}
function clearInput(){for(let k in keyboardInput)keyboardInput[k]=false;touchControls?.clear();for(let k in input)input[k]=false;g.lastJump=false;g.lastDash=false;}
function showMenu(kind){updateMusic();$('#overlay').classList.remove('hidden');let paused=kind==='pause',won=kind==='won';if(won)$('#overlay').classList.add('ending');else $('#overlay').classList.remove('ending');for(const id of ['#menu-eyebrow','#menu-title','#menu-foot','#start'])$(id).hidden=won;$('#menu-eyebrow').textContent=won?'THE BEST PLACE TO LAND.':paused?'A LITTLE BREATHER.':'WHISKERS UP. ADVENTURE AWAITS.';$('#menu-title').innerHTML=won?'Home, at last.<br><em>Hello, Jenn.</em>':paused?'Take a moment.<br><em>Stretch your paws.</em>':'Small paws.<br><em>Big adventure.</em>';$('#menu-copy').innerHTML=won?`Mew is reunited with Jenn and Samuel! Time to watch Coronation Street together on the sofa with some crisps and Dreamies :)<br><span class="reunion-count">Dreamies collected: ${g.collected.size} / ${g.treats.length}</span>`:paused?'Your cosy resting spot is right where you left it.':'Help Mew find her way through the garden<br>and back to her favourite person.';$('#start').innerHTML=won?'Play again <span>↻</span>':paused?'Keep exploring <span>→</span>':'Let’s find Jenn <span>→</span>';}
$('#start').onclick=()=>{$('#mobile-splash').hidden=true;if(g.won){reset(g);camera=0;}playing=true;g.paused=false;clearInput();$('#overlay').classList.add('hidden');canvas.focus();tone();updateMusic();};
$('#splash-start').onclick=()=>$('#start').onclick();
function pause(){if(!playing||g.won)return;g.paused=!g.paused;clearInput();if(g.paused)showMenu('pause');else{$('#overlay').classList.add('hidden');canvas.focus();updateMusic();}}
$('#rest').onclick=()=>{if(g.paused||g.won)return;clearInput();returnToCheckpoint(g);tone(300);canvas.focus();};
$('#pause').onclick=pause;$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'Sound On':'Sound Off';$('#sound').setAttribute('aria-pressed',String(sound));tone();updateMusic();if(playing&&!g.paused&&!g.won)canvas.focus();};
const mapping={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',c:'jump',C:'jump',x:'dash',X:'dash',Shift:'dash'};
window.addEventListener('keydown',e=>{if(!playing){if(e.key==='Enter'&&!e.repeat){e.preventDefault();$('#splash-start').onclick();}return;}if(e.target.tagName==='BUTTON')return;if(mapping[e.key]){e.preventDefault();keyboardInput[mapping[e.key]]=true;mergeInputs(input,keyboardInput,touchInput);}if(e.key==='Escape'&&!e.repeat)pause();if(e.key.toLowerCase()==='r'&&playing&&!g.paused&&!g.won){returnToCheckpoint(g);tone(300);}});window.addEventListener('keyup',e=>{if(mapping[e.key]){e.preventDefault();keyboardInput[mapping[e.key]]=false;mergeInputs(input,keyboardInput,touchInput);}});window.addEventListener('blur',()=>{clearInput();if(playing&&!g.paused&&!g.won){g.paused=true;showMenu('pause');}});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(playing&&!g.paused&&!g.won){g.paused=true;showMenu('pause');}}});
touchControls=bindTouchControls(document.querySelectorAll('[data-key]'),touchInput,()=>{mergeInputs(input,keyboardInput,touchInput);if(Object.values(touchInput).some(Boolean))touchMode=true;});
function rect(x,y,w,h,c,r=0){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}function line(points,c,width=2){ctx.strokeStyle=c;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();}function text(s,x,y,size,c,font='Georgia'){ctx.font=`${size}px ${font}`;ctx.fillStyle=c;ctx.fillText(s,x,y);}
function cat(x,y,face=1,ginger=true,scale=1,run=0,palette=null){ctx.save();ctx.translate(x+15,y+14);ctx.scale(face*scale,scale);let fur=palette?.fur||(ginger?'#d48945':'#394740'),light=palette?.light||(ginger?'#f5cc8a':'#fcf5df');line([[-11,5],[-23,0],[-27,-11],[-24,-17]],fur,7);ellipse(0,3,15,10,fur);let stride=Math.sin(run)*3;rect(-10,8+stride,6,8,fur,3);rect(7,8-stride,6,8,fur,3);ellipse(10,-6,11,10,fur);ctx.fillStyle=fur;ctx.beginPath();ctx.moveTo(1,-11);ctx.lineTo(1,-23);ctx.lineTo(10,-15);ctx.lineTo(17,-23);ctx.lineTo(21,-9);ctx.fill();ctx.fillStyle='#e8ac8d';ctx.beginPath();ctx.moveTo(3,-15);ctx.lineTo(3,-20);ctx.lineTo(7,-15);ctx.fill();ellipse(15,-2,6,5,light);ellipse(14,-8,1.5,2,'#344333');ellipse(21,-3,1.6,1.4,'#9b6153');if(!ginger)ellipse(-1,3,7,8,light);else{line([[-5,-4],[-7,2]],palette?.stripe||'#b36c37',2);line([[1,-5],[-1,1]],palette?.stripe||'#b36c37',2);line([[6,-14],[9,-12]],palette?.stripe||'#b36c37',2);}if(palette?.whiteToes){rect(-10,12,6,4,'#fffbed',2);rect(7,12,6,4,'#fffbed',2);}if(palette?.patch){ellipse(-2,0,9,7,palette.patch);ellipse(7,-14,5,6,palette.patch);line([[-14,4],[-23,0],[-26,-10]],palette.patch,6);}if(palette?.collar){line([[2,0],[16,1]],palette.collar,3);}line([[19,0],[27,-2]],'#776b56',.7);line([[19,2],[27,3]],'#776b56',.7);ctx.restore();}
function flower(x,y,s=1,color='#e9bd9e'){line([[x,y],[x-2,y-17*s]],'#81965c',2);ellipse(x+4,y-8*s,5*s,2*s,'#8da565');for(let i=0;i<5;i++){let a=i*Math.PI*2/5;ellipse(x+Math.cos(a)*4*s-2,y-19*s+Math.sin(a)*4*s,3*s,3*s,color);}ellipse(x-2,y-19*s,2*s,2*s,'#c49c48');}
function bush(x,y,s=1){for(let i=0;i<5;i++)ellipse(x+i*18*s,y-Math.sin(i*.8)*15*s,26*s,28*s,i%2?'#a8b982':'#b6c38e');}
function backdrop(){let sky=ctx.createLinearGradient(0,0,0,540);sky.addColorStop(0,'#e7edcf');sky.addColorStop(1,'#f6eed1');rect(0,0,viewWidth,H,sky);ellipse(789-camera*.035,85,40,40,'#f8efc2');ellipse(789-camera*.035,85,52,52,'#f8efc244');
 for(let i=0;i<Math.ceil(viewWidth/190)+3;i++){let x=i*190-camera*.12%190;ellipse(x,315+Math.sin(i)*20,145,110,'#d7dfb6');ellipse(x+70,350,120,100,'#c9d6a4');}
 for(let i=-1;i<Math.ceil(viewWidth/57)+3;i++){let x=i*57-(camera*.3%57);rect(x,280,12,220,'#d7d6b0',3);ctx.fillStyle='#d7d6b0';ctx.beginPath();ctx.moveTo(x,280);ctx.lineTo(x+6,268);ctx.lineTo(x+12,280);ctx.fill();}rect(0,320,viewWidth,9,'#dddbb6');rect(0,384,viewWidth,8,'#dddbb6');
 for(let i=0;i<Math.ceil(viewWidth/145)+3;i++)bush(i*145-(camera*.5%145),440,.9);
 if(!reduced)for(let i=0;i<5;i++){let x=(i*217+g.time*13)%1050-40,y=155+Math.sin(g.time*.7+i)*55;ellipse(x,y,3,2,'#f8f7da');}
}
function jenn(){let x=5210,y=420;rect(5070,190,270,235,'#e4cfa6',3);rect(5090,225,90,125,'#f2dfb8',4);rect(5100,238,70,90,'#90aa99',4);rect(5131,238,6,90,'#f1e7c9');rect(5100,280,70,5,'#f1e7c9');rect(5210,250,85,175,'#8a9a76',4);rect(5220,264,65,160,'#a9b28c',3);ellipse(5270,340,4,4,'#e8d39a');ctx.fillStyle='#b38063';ctx.beginPath();ctx.moveTo(5045,205);ctx.lineTo(5205,125);ctx.lineTo(5360,205);ctx.fill();rect(5050,204,300,12,'#aa785b');rect(5160,420,170,12,'#c2b091',3);
 if(drawJennSprite(ctx,jennImage,x,y)){text('Jenn',x-13,y-170,14,'#687650');return;}
 // A simple fallback remains visible while the illustrated sprite loads.
 ellipse(x+13,y-91,15,23,'#77513a');ellipse(x+23,y-84,9,19,'#77513a');rect(x-8,y-37,8,33,'#526858',3);rect(x+6,y-37,8,33,'#526858',3);rect(x-11,y-8,12,7,'#654f3b',3);rect(x+5,y-8,13,7,'#654f3b',3);rect(x-15,y-72,32,39,'#c18774',10);line([[x-12,y-62],[x-27,y-45],[x-35,y-57]],'#f1d3ba',7);line([[x+14,y-61],[x+25,y-47]],'#f1d3ba',7);rect(x-4,y-82,12,13,'#f1d3ba',4);ellipse(x+1,y-93,12,15,'#f6dbc2');ellipse(x,y-105,13,8,'#77513a');line([[x-10,y-102],[x-11,y-91]],'#77513a',5);ellipse(x-3,y-94,1,1.5,'#514a3c');line([[x-2,y-87],[x+3,y-86],[x+6,y-89]],'#a96e60',1);text('Jenn',x-13,y-127,14,'#687650');
}
function draw(){ctx.clearRect(0,0,viewWidth,H);backdrop();ctx.save();ctx.translate(-camera,0);
 // Quiet background details and a garden sign.
 rect(120,360,6,90,'#aa9871');rect(75,350,123,36,'#e8dab7',5);text('JENN’S HOUSE  →',86,373,10,'#7d8062','sans-serif');
 for(let p of g.platforms){if(p.x+p.w<camera-50||p.x>camera+viewWidth+50)continue;rect(p.x,p.y,p.w,p.h,'#b5a67c',5);rect(p.x,p.y+12,p.w,20,'#c8bc8c');rect(p.x,p.y-2,p.w,13,'#899c60',5);rect(p.x+2,p.y-2,p.w-4,5,'#aabd7a',4);for(let k=13;k<p.w;k+=38){ellipse(p.x+k,p.y+49+(k%3)*12,3,2,'#a79972');line([[p.x+k,p.y],[p.x+k-3,p.y-6],[p.x+k+1,p.y-2],[p.x+k+5,p.y-8]],'#8b9d60',1.5);}for(let k=30;k<p.w-20;k+=97)flower(p.x+k,p.y-2,.7,k%2?'#f2d8ae':'#dfb99d');}
 drawCheckpoints(ctx,g,reduced);
 for(let o of g.obstacles){if(o.type==='pot'){rect(o.x+3,o.y+7,o.w-6,o.h-7,'#bd8761',4);rect(o.x,o.y+3,o.w,8,'#d39b72',3);line([[o.x+17,o.y+4],[o.x+16,o.y-19]],'#688453',3);ellipse(o.x+9,o.y-10,9,4,'#829c60');ellipse(o.x+24,o.y-18,9,4,'#93a56c');}else{rect(o.x+3,o.y+7,29,25,'#819d99',5);line([[o.x+30,o.y+13],[o.x+45,o.y+1]],'#819d99',7);line([[o.x+8,o.y+8],[o.x+6,o.y-3],[o.x+24,o.y-3],[o.x+27,o.y+8]],'#819d99',3);}}
 for(let treat of g.treats)if(!g.collected.has(treat.id)){let yy=treat.y+(reduced?0:Math.sin(g.time*2+treat.id)*3);rect(treat.x-9,yy-6,18,12,'#c49359',2);rect(treat.x-7,yy-5,14,3,'#e4c28e',1);rect(treat.x-7,yy+2,14,2,'#a57543',1);rect(treat.x-3,yy-1,2,2,'#d5ac75');rect(treat.x+3,yy,2,2,'#d5ac75');}
 drawFriends(ctx,cat,g,{left:camera,width:viewWidth});drawMark(ctx,markImage);drawGreetingGates(ctx,g);jenn();drawSamuel(ctx,samuelImage);for(let c of g.cats){cat(c.x,c.y,c.speed>0?1:-1,false,1,g.time*7,{fur:'#303b38',light:'#fffbed',whiteToes:true});text('Coco',c.x-20,c.y-26,12,'#66734f');}
 let p=g.player;if(p.dashTimer>0){for(let i=1;i<4;i++){ctx.globalAlpha=.16*(4-i);cat(p.x-p.face*i*13,p.y,p.face,true,1,0);}ctx.globalAlpha=1;}ellipse(p.x+14,p.y+29,19,4,'#5a6a3c20');cat(p.x,p.y,p.face,true,1,p.grounded&&Math.abs(p.vx)>20?g.time*19:0);
 drawPickupStars(ctx,g.pickupStars,reduced);
 if(g.mewGreetingTime>0)drawMewGreeting(ctx,p,g.mewGreetingText,{left:camera,width:viewWidth});
 if(!playing){text('Mew',p.x-1,p.y-22,13,'#727d54');}
 if(g.won){text('♡',p.x+20,p.y-35,25,'#b77f70');text('♡',5224,282,21,'#b77f70');}
 ctx.restore();
 if(g.player.x<240)drawGardenInstructions();
 const missing=missingFriends(g);$('#friends').textContent=`Friends ${g.greetedCats.size+(g.markGreeted?1:0)} / 5`;$('#friend-next').textContent=missing.length?`Next Friend: ${FRIEND_NAMES[missing[0]]}`:'Jenn And Samuel Are Waiting';
 $('#area').textContent=p.x<1800?'The Lawn':p.x<3300?'Flowerpot Terraces':'The Way Home';$('#treats').textContent=`Dreamies ${g.collected.size} / ${g.treats.length}`;$('#dash').textContent=p.dashReady?'✦ Dash Ready':'✧ Land To Recharge';$('#progress').style.width=`${Math.min(100,p.x/5190*100)}%`;$('#checkpoint').textContent=['A cosy place to begin','Rosie’s garden resting spot','A quiet patch of garden','Almost home'][g.checkpoint];$('#toast').style.opacity=g.notice>0?'1':'0';$('#toast').textContent='♡ Safe And Sound';
}
function drawGardenInstructions(){
 const width=Math.min(330,viewWidth-28),x=14,y=178;
 rect(x+width*.16,y+125,8,85,'#ae9770',3);rect(x+width*.78,y+125,8,85,'#ae9770',3);
 rect(x,y,width,164,'#fcf6e4',12);ctx.strokeStyle='#b2bb8c';ctx.lineWidth=2;ctx.stroke();
 text('Mew Quest',x+18,y+32,27,'#617648');text('A Little Garden Adventure',x+18,y+53,12,'#8b9672');
 if(touchMode){text('Hold The Arrows To Move',x+18,y+79,14,'#5f6c4d');text('Tap Jump • Tap Dash',x+18,y+102,14,'#5f6c4d');}else{text('← →  Move',x+18,y+79,14,'#5f6c4d');text('C  Jump',x+width*.54,y+79,14,'#5f6c4d');text('X  Dash',x+18,y+102,14,'#5f6c4d');text('R  Rest',x+width*.54,y+102,14,'#5f6c4d');}
 text('Meet your friends.',x+18,y+127,13,'#8b7652');
 text('Jump over plant pots and Coco!',x+18,y+146,Math.min(12,(width-36)/15),'#8b7652');
}
function frame(t){let dt=Math.min((t-last)/1000,.05);last=t;acc+=dt;if(playing&&!g.paused&&!g.won){while(acc>=1/120){let before=g.collected.size,jump=g.player.vy;step(g,input,1/120);if(g.collected.size>before)tone(740);if(g.player.vy< -400&&jump>=0)tone(430);acc-=1/120;}if(g.won){clearInput();showMenu('won');tone(880);}}else acc=0;let target=followCamera(g.player.x,viewWidth);camera+=(target-camera)*(reduced?1:Math.min(1,dt*6));draw();requestAnimationFrame(frame);}if(playing)canvas.focus();requestAnimationFrame(frame);
