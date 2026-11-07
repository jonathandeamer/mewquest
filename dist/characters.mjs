import{drawErnie}from'./ernie.mjs';
import{ENCOUNTERS,SAMUEL}from'./friends.mjs';
function box(ctx,x,y,w,h,color,r=0){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function oval(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function label(ctx,s,x,y,size=13){ctx.fillStyle='#546149';ctx.font=`${size}px Georgia`;ctx.fillText(s,x,y);}
function greeting(ctx,x,y,greeted){box(ctx,x-42,y-101,126,30,greeted?'#f0f3df':'#fffbed',10);label(ctx,greeted?'Lovely to see you!':'Hello Mew!',x-28,y-81,13);ctx.fillStyle=greeted?'#f0f3df':'#fffbed';ctx.beginPath();ctx.moveTo(x,y-72);ctx.lineTo(x+10,y-61);ctx.lineTo(x+15,y-72);ctx.fill();}
export function drawFriends(ctx,cat,g){
 const rosie=ENCOUNTERS[0],pair=ENCOUNTERS[2];
 cat(rosie.x,rosie.groundY-30,-1,true,1,0,{fur:'#a58c77',light:'#f6ebd9',stripe:'#67534a',whiteToes:true});
 label(ctx,'Rosie',rosie.x-5,rosie.groundY+22);greeting(ctx,rosie.x,rosie.groundY,g.greetedCats.has('rosie'));
 drawErnie(ctx,cat);
 cat(pair.x-42,pair.groundY-30,-1,true,1,0,{fur:'#926443',light:'#dcb68a',stripe:'#543b2a'});
 cat(pair.x+30,pair.groundY-30,-1,false,1,0,{fur:'#f5f1e7',light:'#fffbed',patch:'#343b3e',collar:'#b17b9e'});
 label(ctx,'Darwin',pair.x-48,pair.groundY+22);label(ctx,'Minka',pair.x+27,pair.groundY+22);
 greeting(ctx,pair.x,pair.groundY,g.greetedCats.has('minka'));
}
export function drawGreetingGates(ctx,g){
 for(const e of g.encounters){if(e.ids.every(id=>g.greetedCats.has(id)))continue;
  // A visible garden ribbon marks the full-height stop; no hidden leap-through route.
  ctx.save();ctx.strokeStyle='#9baa7a';ctx.lineWidth=2;ctx.setLineDash([5,9]);ctx.beginPath();ctx.moveTo(e.gateX,0);ctx.lineTo(e.gateX,e.gateGround);ctx.stroke();ctx.setLineDash([]);
  box(ctx,e.gateX-5,e.gateGround-78,10,78,'#9b9b70',3);
  box(ctx,e.gateX-99,e.gateGround-101,194,35,'#fbf7e7',6);label(ctx,`Say hello to ${e.name}`,e.gateX-87,e.gateGround-79,12);
  ctx.restore();
 }
}
export function drawSamuel(ctx){
 const {x,groundY:y}=SAMUEL;ctx.save();
 // Brown trainers and blue jeans, with a small child-sized silhouette.
 box(ctx,x-12,y-39,10,33,'#627e97',4);box(ctx,x+3,y-39,10,33,'#627e97',4);
 box(ctx,x-15,y-8,15,8,'#775741',3);box(ctx,x+2,y-8,16,8,'#775741',3);
 box(ctx,x-19,y-78,38,42,'#70a34c',8);box(ctx,x-26,y-73,11,19,'#70a34c',5);box(ctx,x+15,y-73,11,19,'#70a34c',5);
 box(ctx,x-25,y-57,8,26,'#f3d3b3',4);box(ctx,x+18,y-57,8,26,'#f3d3b3',4);
 // A blocky Minecraft Creeper motif on the T-shirt.
 box(ctx,x-11,y-68,22,24,'#9bc667',2);box(ctx,x-7,y-64,5,5,'#30472a');box(ctx,x+3,y-64,5,5,'#30472a');box(ctx,x-2,y-59,5,6,'#30472a');box(ctx,x-6,y-55,13,5,'#30472a');box(ctx,x-6,y-51,4,3,'#30472a');box(ctx,x+3,y-51,4,3,'#30472a');
 box(ctx,x-5,y-85,11,12,'#f3d3b3',3);oval(ctx,x,y-97,17,21,'#f5d8bc');oval(ctx,x-16,y-96,3,5,'#efc8a6');oval(ctx,x+16,y-96,3,5,'#efc8a6');
 oval(ctx,x,y-112,17,10,'#d9b459');box(ctx,x-17,y-111,7,16,'#d9b459',4);box(ctx,x+10,y-111,7,13,'#d9b459',3);box(ctx,x-11,y-117,8,15,'#e6c56d',3);
 oval(ctx,x-6,y-97,3,3.5,'#fff9ed');oval(ctx,x+6,y-97,3,3.5,'#fff9ed');oval(ctx,x-6,y-97,1.8,2.5,'#704a2e');oval(ctx,x+6,y-97,1.8,2.5,'#704a2e');
 ctx.strokeStyle='#b67c67';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-5,y-87);ctx.quadraticCurveTo(x,y-82,x+5,y-87);ctx.stroke();
 label(ctx,'Samuel',x-21,y-135);ctx.restore();
}
