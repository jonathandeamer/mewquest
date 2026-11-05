// A friendly garden resident, kept separate from patrolling obstacle cats.
export const ERNIE={x:2625,groundY:300,scale:1.7};
export function drawErnie(ctx,drawCat){
 const {x,groundY,scale}=ERNIE;
 ctx.save();
 drawCat(x,groundY-14-16*scale,-1,true,scale,0,{fur:'#8e7964',light:'#ead8bb',stripe:'#635344'});
 // A blue collar helps distinguish Ernie from Mew and the patrolling cats.
 ctx.fillStyle='#739ea8';ctx.beginPath();ctx.roundRect(x-4,groundY-43,10,5,2);ctx.fill();
 ctx.fillStyle='#d4b169';ctx.beginPath();ctx.roundRect(x,groundY-39,4,5,1);ctx.fill();
 const bx=x-98,by=groundY-120;
 ctx.fillStyle='#fffbed';ctx.strokeStyle='#a4b18c';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.roundRect(bx,by,150,42,12);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(x-29,by+41);ctx.lineTo(x-12,by+55);ctx.lineTo(x-11,by+41);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.moveTo(x-29,by+42);ctx.lineTo(x-12,by+55);ctx.lineTo(x-11,by+42);ctx.stroke();
 ctx.fillStyle='#46543e';ctx.font='18px Georgia';ctx.fillText(' Hello Mew!',bx+18,by+27);
 ctx.fillStyle='#5a6550';ctx.font='13px Georgia';ctx.fillText('Ernie',x-2,groundY+20);
 ctx.restore();
}
