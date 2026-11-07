import{PICKUP_STAR_LIFE}from'./pickup-stars.mjs';
import{ENCOUNTERS,closedGates,missingCats,missingFriends,updateGreetings}from'./friends.mjs';
export const W=960,H=540;
export function createGame(){
 const platforms=[{x:0,y:450,w:610,h:150},{x:690,y:425,w:260,h:175},{x:1040,y:390,w:210,h:210},{x:1340,y:440,w:420,h:160},{x:1860,y:410,w:230,h:190},{x:2200,y:350,w:190,h:250},{x:2510,y:300,w:180,h:300},{x:2810,y:365,w:390,h:235},{x:3340,y:410,w:180,h:190},{x:3670,y:340,w:180,h:260},{x:4010,y:295,w:180,h:305},{x:4350,y:365,w:210,h:235},{x:4720,y:420,w:650,h:180}];
 platforms.push({x:1360,y:385,w:75,h:16,shelf:true},{x:1450,y:330,w:210,h:18,shelf:true},{x:3770,y:285,w:95,h:16,shelf:true},{x:3860,y:230,w:240,h:18,shelf:true});
 const g={platforms,encounters:ENCOUNTERS.map(e=>({...e,ids:[...e.ids]})),greetedCats:new Set(),markGreeted:false,greetingQueue:[],mewGreetingText:'',samuelGreeted:false,reunionRemaining:0,checkpoints:[{x:80,y:416},{x:1675,y:412,requires:'rosie'},{x:2870,y:331},{x:4770,y:386}],checkpoint:0,obstacles:[{x:430,y:421,w:36,h:29,type:'pot'},{x:1580,y:408,w:45,h:32,type:'can'},{x:3050,y:333,w:40,h:32,type:'pot'},{x:4950,y:387,w:44,h:33,type:'can'}],cats:[{name:'Coco',x:1920,y:382,w:40,h:28,min:1880,max:2030,speed:42}],treats:platforms.filter(p=>!p.shelf).slice(1).map((p,i)=>({x:p.x+p.w*.45,y:p.y-65,id:i})),goal:{x:5190,y:350,w:70,h:70},collected:new Set(),pickupStars:[],time:0,returns:0,paused:false,won:false,lastJump:false,lastDash:false,notice:0,ernieGreeted:false,mewGreetingTime:0};
 g.player={x:80,y:416,w:30,h:28,vx:0,vy:0,grounded:false,coyote:0,buffer:0,dashReady:true,dashTimer:0,face:1};return g;
}
export function reset(g){Object.assign(g,createGame());}
export function returnToCheckpoint(g){let p=g.player,c=g.checkpoints[g.checkpoint];Object.assign(p,{x:c.x,y:c.y,vx:0,vy:0,grounded:false,coyote:0,buffer:0,dashReady:true,dashTimer:0});g.returns++;g.notice=1;g.pickupStars=[];g.mewGreetingTime=0;g.greetingQueue=[];g.reunionRemaining=0;g.samuelGreeted=false;}
export function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
export function step(g,input={},dt=1/120){if(g.paused||g.won)return;dt=Math.min(dt,1/60);g.time+=dt;g.notice=Math.max(0,g.notice-dt);let p=g.player;
 g.pickupStars=g.pickupStars.filter(star=>{star.age+=dt;return star.age<PICKUP_STAR_LIFE;});
 if(g.reunionRemaining>0){g.reunionRemaining=Math.max(0,g.reunionRemaining-dt);g.mewGreetingTime=g.reunionRemaining;p.vx=0;p.vy=0;if(g.reunionRemaining===0)g.won=true;return;}
 for(let c of g.cats){c.x+=c.speed*dt;if(c.x>c.max){c.x=c.max;c.speed=-Math.abs(c.speed);}if(c.x<c.min){c.x=c.min;c.speed=Math.abs(c.speed);}}
 p.buffer=Math.max(0,p.buffer-dt);p.coyote=p.grounded?.09:Math.max(0,p.coyote-dt);
 if(input.jump&&!g.lastJump)p.buffer=.12;
 let dir=(input.right?1:0)-(input.left?1:0);if(dir)p.face=dir;
 if(input.dash&&!g.lastDash&&p.dashReady){p.dashReady=false;p.dashTimer=.15;let dx=dir,dy=(input.down?1:0)-(input.up?1:0);if(!dx&&!dy)dx=p.face;let l=Math.hypot(dx,dy);p.vx=dx/l*610;p.vy=dy/l*610;}
 if(p.dashTimer>0){p.dashTimer-=dt;}else{let target=dir*245,acc=(p.grounded?1900:1400)*dt;p.vx+=Math.max(-acc,Math.min(acc,target-p.vx));p.vy=Math.min(650,p.vy+1400*dt);if(p.buffer>0&&p.coyote>0){p.vy=-480;p.grounded=false;p.coyote=0;p.buffer=0;}if(!input.jump&&g.lastJump&&p.vy< -200)p.vy=-200;}
 g.lastJump=!!input.jump;g.lastDash=!!input.dash;
 // Small collision substeps keep even a fast dash from crossing thin objects.
 let steps=Math.max(1,Math.ceil(Math.max(Math.abs(p.vx),Math.abs(p.vy))*dt/5)),s=dt/steps;
 for(let i=0;i<steps;i++){
 let oldRight=p.x+p.w;p.x+=p.vx*s;p.x=Math.max(0,p.x);
 for(let gate of closedGates(g))if(p.vx>0&&oldRight<=gate.gateX&&p.x+p.w>=gate.gateX){p.x=gate.gateX-p.w;p.vx=0;}
 let oldY=p.y;p.y+=p.vy*s;p.grounded=false;
 // One-way surfaces: pass through from below/sides; land only while crossing the top downward.
 for(let b of g.platforms)if(p.vy>=0&&p.x<b.x+b.w&&p.x+p.w>b.x&&oldY+p.h<=b.y+.01&&p.y+p.h>=b.y){p.y=b.y-p.h;p.vy=0;p.grounded=true;p.dashReady=true;}
 if(g.obstacles.some(o=>overlaps(p,o))||g.cats.some(c=>overlaps(p,c))||p.y>650){returnToCheckpoint(g);break;}
 }
 for(let i=0;i<g.checkpoints.length;i++){let c=g.checkpoints[i];if(i>g.checkpoint&&(!c.requires||g.greetedCats.has(c.requires))&&Math.abs(p.x-c.x)<42&&Math.abs(p.y-c.y)<42){g.checkpoint=i;g.notice=1.5;}}
 for(let y of g.treats)if(!g.collected.has(y.id)&&Math.hypot(p.x+15-y.x,p.y+14-y.y)<30){g.collected.add(y.id);g.pickupStars.push({x:y.x,y:y.y,age:0});}
 updateGreetings(g,dt);
 if(overlaps(p,g.goal)&&p.grounded&&missingFriends(g).length===0){g.samuelGreeted=true;g.mewGreetingText='Hi Samuel';g.mewGreetingTime=2.6;g.reunionRemaining=2.6;p.vx=0;p.vy=0;}
}
