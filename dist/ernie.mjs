// A friendly garden resident, kept separate from patrolling obstacle cats.
export const ERNIE={x:2625,groundY:300,scale:1.7};
export function drawErnie(ctx,drawCat,viewport){
 const {x,groundY,scale}=ERNIE;
 if(viewport&&(x+60<viewport.left||x-60>viewport.left+viewport.width))return;
 ctx.save();
 drawCat(x,groundY-14-16*scale,-1,true,scale,0,{fur:'#dc8b3d',light:'#f5d29a',stripe:'#ac602b'});
 // A blue collar helps distinguish Ernie from Mew and the patrolling cats.
 ctx.fillStyle='#739ea8';ctx.beginPath();ctx.roundRect(x-4,groundY-43,10,5,2);ctx.fill();
 ctx.fillStyle='#d4b169';ctx.beginPath();ctx.roundRect(x,groundY-39,4,5,1);ctx.fill();
 const bx=viewport?Math.max(viewport.left+8,Math.min(x+55,viewport.left+viewport.width-158)):x+55,by=groundY-145;
 ctx.fillStyle='#fffbed';ctx.strokeStyle='#a4b18c';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.roundRect(bx,by,150,42,12);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(bx+5,by+41);ctx.lineTo(x-12,by+82);ctx.lineTo(bx+20,by+41);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.moveTo(bx+5,by+42);ctx.lineTo(x-12,by+82);ctx.lineTo(bx+20,by+42);ctx.stroke();
 ctx.fillStyle='#46543e';ctx.font='18px Georgia';ctx.fillText('Hello Mew!',bx+18,by+27);
 ctx.fillStyle='#5a6550';ctx.font='13px Georgia';ctx.fillText('Ernie',x-2,groundY+20);
 ctx.restore();
}

export function drawMewGreeting(ctx,player,message='Hi Ernie',viewport){
 ctx.save();ctx.font='17px Georgia';
 const width=Math.min(360,Math.max(120,message.length*8+34),viewport?viewport.width-16:Infinity),lines=[];
 let line='';for(const word of message.split(' ')){const candidate=line?line+' '+word:word,measured=ctx.measureText?.(candidate)?.width??candidate.length*8;if(line&&measured>width-36){lines.push(line);line=word;}else line=candidate;}if(line)lines.push(line);
 const height=lines.length*22+12,x=viewport?Math.max(viewport.left+8,Math.min(player.x-width-12,viewport.left+viewport.width-width-8)):player.x-width-12,y=Math.max(8,player.y-height-16);
 ctx.fillStyle='#fffbed';ctx.strokeStyle='#a4b18c';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.roundRect(x,y,width,height,10);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(x+width-21,y+height-1);ctx.lineTo(player.x+10,player.y-6);ctx.lineTo(x+width-9,y+height-1);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.moveTo(x+width-21,y+height);ctx.lineTo(player.x+10,player.y-6);ctx.lineTo(x+width-9,y+height);ctx.stroke();
 ctx.fillStyle='#46543e';lines.forEach((text,i)=>ctx.fillText(text,x+18,y+23+i*22));ctx.restore();
}
