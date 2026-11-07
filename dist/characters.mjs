import{drawErnie}from'./ernie.mjs';
import{ENCOUNTERS,SAMUEL,MARK}from'./friends.mjs';
function box(ctx,x,y,w,h,color,r=0){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function oval(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function label(ctx,s,x,y,size=13){ctx.fillStyle='#546149';ctx.font=`${size}px Georgia`;ctx.fillText(s,x,y);}
function greeting(ctx,x,y,greeted){box(ctx,x-42,y-101,126,30,greeted?'#f0f3df':'#fffbed',10);label(ctx,greeted?'Lovely to see you!':'Hello Mew!',x-28,y-81,13);ctx.fillStyle=greeted?'#f0f3df':'#fffbed';ctx.beginPath();ctx.moveTo(x,y-72);ctx.lineTo(x+10,y-61);ctx.lineTo(x+15,y-72);ctx.fill();}
export function drawFriends(ctx,cat,g,viewport){
 const rosie=ENCOUNTERS[0],pair=ENCOUNTERS[2];
 cat(rosie.x,rosie.groundY-30,-1,true,1,0,{fur:'#a58c77',light:'#f6ebd9',stripe:'#67534a',whiteToes:true});
 label(ctx,'Rosie',rosie.x-5,rosie.groundY+22);greeting(ctx,rosie.x,rosie.groundY,g.greetedCats.has('rosie'));
 drawErnie(ctx,cat,viewport);
 cat(pair.x-42,pair.groundY-30,-1,true,1,0,{fur:'#926443',light:'#dcb68a',stripe:'#543b2a'});
 cat(pair.x+30,pair.groundY-30,-1,false,1,0,{fur:'#222b31',light:'#f7efe5',patch:'#303a43',collar:'#b17b9e',whiteMuzzle:true});
 label(ctx,'Darwin',pair.x-48,pair.groundY+22);label(ctx,'Minka',pair.x+27,pair.groundY+22);
 greeting(ctx,pair.x,pair.groundY,g.greetedCats.has('minka'));
}
export function drawGreetingGates(ctx,g){
 for(const e of g.encounters){if(e.ids.every(id=>g.greetedCats.has(id))&&(e.id!=='ernie'||g.markGreeted))continue;
  // A visible garden ribbon marks the full-height stop; no hidden leap-through route.
  ctx.save();ctx.strokeStyle='#9baa7a';ctx.lineWidth=2;ctx.setLineDash([5,9]);ctx.beginPath();ctx.moveTo(e.gateX,0);ctx.lineTo(e.gateX,e.gateGround);ctx.stroke();ctx.setLineDash([]);
  box(ctx,e.gateX-5,e.gateGround-78,10,78,'#9b9b70',3);

  ctx.restore();
 }
}
export function drawSamuel(ctx,image){
 const {x,groundY:y}=SAMUEL;ctx.save();
 if(drawIllustratedPerson(ctx,image,x,y,125)){label(ctx,'Samuel',x-21,y-138);ctx.restore();return;}
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

export function drawMark(ctx,image){
 const {x,groundY:y}=MARK;ctx.save();
 if(drawIllustratedPerson(ctx,image,x,y,175)){label(ctx,'Mark',x-14,y-187);ctx.restore();return;}
 box(ctx,x-16,y-57,12,49,'#536371',4);box(ctx,x+4,y-57,12,49,'#536371',4);
 box(ctx,x-20,y-9,19,9,'#5f4938',3);box(ctx,x+2,y-9,20,9,'#5f4938',3);
 box(ctx,x-21,y-113,43,59,'#a96d57',7);box(ctx,x-30,y-108,12,46,'#a96d57',5);box(ctx,x+20,y-108,12,44,'#a96d57',5);
 // Broad cream and dark-red checks stay legible at game size.
 for(let yy=y-108;yy<y-56;yy+=13)box(ctx,x-20,yy,41,4,'#ddc7a0');
 for(let xx=x-15;xx<x+20;xx+=13)box(ctx,xx,y-111,4,54,'#ddc7a0');
 for(let yy=y-107;yy<y-58;yy+=13)for(let xx=x-14;xx<x+17;xx+=13)box(ctx,xx,yy,3,3,'#855044');
 box(ctx,x-5,y-123,12,14,'#ecc8a6',3);oval(ctx,x,y-137,17,21,'#f0cfb0');oval(ctx,x,y-153,18,9,'#6d503b');box(ctx,x-18,y-151,6,17,'#6d503b',3);box(ctx,x+12,y-151,6,17,'#6d503b',3);
 oval(ctx,x-6,y-138,1.8,2,'#4b4939');oval(ctx,x+6,y-138,1.8,2,'#4b4939');
 ctx.strokeStyle='#a16f59';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-5,y-128);ctx.quadraticCurveTo(x,y-124,x+6,y-129);ctx.stroke();
 // Long-neck four-string bass, held across his checked shirt.
 ctx.strokeStyle='#564533';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-13,y-107);ctx.lineTo(x+18,y-58);ctx.stroke();
 oval(ctx,x+7,y-50,17,24,'#965a36');oval(ctx,x+4,y-40,18,18,'#a96d3e');oval(ctx,x+15,y-68,9,12,'#965a36');
 ctx.fillStyle='#bd9968';ctx.beginPath();ctx.moveTo(x+7,y-56);ctx.lineTo(x+17,y-139);ctx.lineTo(x+23,y-139);ctx.lineTo(x+13,y-54);ctx.closePath();ctx.fill();
 box(ctx,x+16,y-154,10,20,'#b99563',3);for(let i=0;i<4;i++)box(ctx,x+(i%2?24:12),y-152+i*5,5,3,'#c0bbb0',1);
 box(ctx,x+1,y-47,16,4,'#302c29',1);box(ctx,x+1,y-36,15,3,'#b5ada0',1);
 ctx.strokeStyle='#e8ddbb';ctx.lineWidth=.65;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x+3+i*2,y-34);ctx.lineTo(x+18+i*1.4,y-149);ctx.stroke();}
 oval(ctx,x+20,y-99,6,5,'#efcfb1');oval(ctx,x-2,y-54,7,5,'#efcfb1');label(ctx,'Mark',x-14,y-175);ctx.restore();
}
export function drawCheckpoints(ctx,g,reduced=false){
 for(let [i,c]of g.checkpoints.entries()){
  let active=i<=g.checkpoint,ground=c.y+28;
  oval(ctx,c.x+15,ground,43,7,active?'#d4aa4c44':'#7a8d5422');
  box(ctx,c.x-24,ground-13,80,13,active?'#c79e58':'#b8b99a',6);box(ctx,c.x-19,ground-13,70,4,active?'#efd58b':'#daddbf',3);
  box(ctx,c.x+33,ground-91,5,80,active?'#98753f':'#929774',2);
  box(ctx,c.x+38,ground-91,52,31,active?'#e4b747':'#abc18a',3);box(ctx,c.x+42,ground-87,44,3,active?'#f4d67f':'#d2dfb8',1);
  ctx.fillStyle=active?'#63512f':'#f9f8e9';ctx.font='bold 18px Georgia';ctx.fillText(active?'✓':'⚑',c.x+54,ground-68);

  if(i===g.checkpoint&&!reduced){let rise=Math.sin(g.time*3)*3;label(ctx,'▼',c.x+3,ground-110+rise,16);}
 }
}

export function drawIllustratedPerson(ctx,image,x,groundY,height){
 if(!image?.complete||!image.naturalWidth||!image.naturalHeight)return false;
 const width=height*image.naturalWidth/image.naturalHeight;
 ctx.drawImage(image,x-width*.52,groundY-height,width,height);return true;
}
