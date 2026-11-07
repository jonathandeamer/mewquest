export const PICKUP_STAR_LIFE=.75;
export function drawPickupStars(ctx,stars,reduced=false){
 for(const star of stars){const p=Math.min(1,star.age/PICKUP_STAR_LIFE),radius=reduced?11:7+7*Math.sin(Math.PI*p),y=star.y-(reduced?13:12+28*p);
  ctx.save();ctx.globalAlpha=Math.min(1,(1-p)*2);ctx.fillStyle='#efc45b';ctx.strokeStyle='#fff3bf';ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<10;i++){let angle=-Math.PI/2+i*Math.PI/5,r=i%2?radius*.45:radius,x=star.x+Math.cos(angle)*r,yy=y+Math.sin(angle)*r;if(i===0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy);}
  ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
 }
}
