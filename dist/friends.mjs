import{ERNIE}from'./ernie.mjs';
export const ENCOUNTERS=[
 {id:'rosie',ids:['rosie'],name:'Rosie',x:1535,groundY:330,gateX:1720,gateGround:440,reply:'hi rosie'},
 {id:'ernie',ids:['ernie'],name:'Ernie & Mark',x:ERNIE.x,groundY:ERNIE.groundY,gateX:2665,gateGround:300,reply:'hi ernie'},
 {id:'pair',ids:['darwin','minka'],name:'Darwin & Minka',x:3970,groundY:230,gateX:4160,gateGround:295,reply:'hi minka and darwin'}
];
export const MARK={x:2560,groundY:300};
export const SAMUEL={x:5280,groundY:420};
export const FRIEND_NAMES={rosie:'Rosie',ernie:'Ernie',darwin:'Darwin',minka:'Minka',mark:'Mark'};
export function missingCats(g){return g.encounters.flatMap(e=>e.ids).filter(id=>!g.greetedCats.has(id));}
export function missingFriends(g){const ids=missingCats(g);if(!g.markGreeted)ids.splice(ids.includes('ernie')?ids.indexOf('ernie')+1:ids.includes('rosie')?1:0,0,'mark');return ids;}
export function closedGates(g){return g.encounters.filter(e=>e.ids.some(id=>!g.greetedCats.has(id))||(e.id==='ernie'&&!g.markGreeted));}
function startReply(g,reply){g.mewGreetingText=reply.text;g.mewGreetingTime=4;if(reply.id==='mark')g.markGreeted=true;}
function queueReply(g,text,id){if(g.greetingQueue.some(r=>r.id===id))return;const reply={text,id};if(g.mewGreetingTime>0)g.greetingQueue.push(reply);else startReply(g,reply);}
export function updateGreetings(g,dt){
 const p=g.player;g.mewGreetingTime=Math.max(0,g.mewGreetingTime-dt);if(g.mewGreetingTime===0&&g.greetingQueue.length)startReply(g,g.greetingQueue.shift());
 for(const stop of g.encounters){
  if(stop.ids.every(id=>g.greetedCats.has(id)))continue;
  if(p.grounded&&Math.abs(p.x+15-stop.x)<85&&Math.abs(p.y+p.h-stop.groundY)<4){
   stop.ids.forEach(id=>g.greetedCats.add(id));queueReply(g,stop.reply,stop.id);
   if(stop.id==='ernie')g.ernieGreeted=true;
  }
 }
 if(g.greetedCats.has('ernie')&&!g.markGreeted&&p.grounded&&Math.abs(p.x+15-MARK.x)<85&&Math.abs(p.y+p.h-MARK.groundY)<4)queueReply(g,'hi mark','mark');
}
