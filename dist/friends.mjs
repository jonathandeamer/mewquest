import{ERNIE}from'./ernie.mjs';
export const ENCOUNTERS=[
 {id:'rosie',ids:['rosie'],name:'Rosie',x:1535,groundY:330,gateX:1720,gateGround:440,reply:'hi rosie'},
 {id:'ernie',ids:['ernie'],name:'Ernie',x:ERNIE.x,groundY:ERNIE.groundY,gateX:2665,gateGround:300,reply:'hi ernie'},
 {id:'pair',ids:['darwin','minka'],name:'Darwin & Minka',x:3970,groundY:230,gateX:4160,gateGround:295,reply:'hi minka and darwin'}
];
export const SAMUEL={x:5280,groundY:420};
export const FRIEND_NAMES={rosie:'Rosie',ernie:'Ernie',darwin:'Darwin',minka:'Minka'};
export function missingCats(g){return g.encounters.flatMap(e=>e.ids).filter(id=>!g.greetedCats.has(id));}
export function closedGates(g){return g.encounters.filter(e=>e.ids.some(id=>!g.greetedCats.has(id)));}
export function updateGreetings(g,dt){
 const p=g.player;g.mewGreetingTime=Math.max(0,g.mewGreetingTime-dt);
 for(const stop of g.encounters){
  if(stop.ids.every(id=>g.greetedCats.has(id)))continue;
  if(p.grounded&&Math.abs(p.x+15-stop.x)<85&&Math.abs(p.y+p.h-stop.groundY)<4){
   stop.ids.forEach(id=>g.greetedCats.add(id));g.mewGreetingText=stop.reply;g.mewGreetingTime=4;
   if(stop.id==='ernie')g.ernieGreeted=true;
  }
 }
}
