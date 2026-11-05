// Original 8-bit art. World coordinates remain unchanged; each display pixel spans 3 world units.
const P={sky:'#5c94fc',white:'#fcfcfc',ink:'#181820',black:'#000000',green:'#00a800',leaf:'#00e800',dark:'#005800',soil:'#c84c0c',brick:'#e87820',cream:'#f8d878',orange:'#f89800',rust:'#a84000',pink:'#f87858',blue:'#0078f8',navy:'#0038a8',skin:'#f8b898',hair:'#503000',gold:'#f8b800'};
const CAT=[
'..o.....o.....',
'..oo...oo.....',
'..oroooro.....',
'..ooooooo.....',
'..okoooko.....',
'..occoocc.....',
'...ccncc......',
'...oooo.......',
'..oorooroo....',
'..ooooooo.o...',
'..oorooro..o..',
'..ooooooo..o..',
'..oo...oo.oo..',
'..oo...oo.....'];
const JENN=['....hhhhhh....','...hhhhhhhh...','...hhssssh.hh.','...hssksks.hhh','....ssssss.hhh','.....ssss..hh.','......ss....h.','...pppppppp...','..ssppppppss..','..ssppppppss..','..sspppppp.ss.','.ss.pppppp.ss.','.ss.pppppp..ss','....pppppp....','....bbbbbb....','....bb..bb....','....bb..bb....','....bb..bb....','....bb..bb....','....bb..bb....','...hhh..hhh...'];
export function renderPixelGame(ctx,g,camera=0,reduced=false){
 const cam=Math.round(camera/3),R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(0,Math.round(w)),Math.max(0,Math.round(h)));};
 const world=(x,y,w,h,c)=>R(x/3-cam,y/3,w/3,h/3,c);
 function sprite(rows,x,y,palette,flip=false,scale=1){for(let yy=0;yy<rows.length;yy++)for(let xx=0;xx<rows[yy].length;xx++){let c=palette[rows[yy][xx]];if(c)R(x+(flip?rows[yy].length-1-xx:xx)*scale,y+yy*scale,scale,scale,c);}}
 function cloud(x,y){R(x+6,y,20,5,P.white);R(x+2,y+5,30,6,P.white);R(x,y+11,37,5,P.white);R(x+5,y+16,28,2,'#bcbcff');}
 R(0,0,320,180,P.sky);
 for(let i=-1;i<5;i++)cloud(i*95-Math.round(cam*.15)%95,20+(i%2)*12);
 // Stepped hills and angular bushes, drawn as solid tile silhouettes.
 for(let i=-1;i<5;i++){let x=i*112-Math.round(cam*.28)%112;for(let row=0;row<8;row++)R(x+30-row*4,105+row*5,8+row*8,5,P.green);R(x+18,129,3,4,P.dark);R(x+41,124,3,4,P.dark);}
 for(let i=-1;i<8;i++){let x=i*58-Math.round(cam*.45)%58;R(x+4,134,34,11,P.dark);R(x+10,129,8,5,P.dark);R(x+23,127,9,7,P.dark);R(x+6,136,30,5,P.green);}
 for(let p of g.platforms){let x=Math.round(p.x/3)-cam,y=Math.round(p.y/3),w=Math.round(p.w/3);if(x+w<0||x>320)continue;
 R(x,y,w,8,P.green);R(x,y,w,2,P.leaf);
 for(let tx=0;tx<w;tx+=8){let tw=Math.min(8,w-tx);R(x+tx,y+3,Math.min(2,tw),2,P.dark);for(let ty=8;ty<180-y;ty+=8){R(x+tx,y+ty,tw,8,P.soil);R(x+tx,y+ty,tw,1,P.cream);R(x+tx,y+ty,1,8,P.cream);if(tw>3){R(x+tx+2,y+ty+2,tw-3,1,P.brick);R(x+tx+tw-1,y+ty+2,1,6,P.rust);}}}
 // Tiny tile flowers outside the collision boundary.
 for(let k=38;k<p.w-25;k+=135){let fx=Math.round((p.x+k)/3)-cam;R(fx,y-5,1,5,P.green);R(fx-2,y-8,5,3,P.pink);R(fx,y-9,1,5,P.cream);}}
 for(let [i,c]of g.checkpoints.entries()){let x=Math.round(c.x/3)-cam,y=Math.round((c.y+28)/3);R(x-5,y-3,18,3,P.rust);R(x-5,y-3,18,1,P.cream);R(x+12,y-21,1,20,P.white);R(x+13,y-21,9,6,i<=g.checkpoint?P.gold:P.navy);R(x+13,y-15,6,2,i<=g.checkpoint?P.orange:P.blue);}
 for(let o of g.obstacles){let x=Math.round(o.x/3)-cam,y=Math.round(o.y/3);if(o.type==='pot'){R(x+1,y+2,10,8,P.rust);R(x,y+1,12,3,P.soil);R(x+2,y+4,2,5,P.brick);R(x+5,y-5,2,7,P.green);R(x+1,y-4,5,2,P.leaf);R(x+7,y-7,5,3,P.leaf);}else{R(x+1,y+2,10,9,P.navy);R(x+2,y+3,7,6,P.blue);R(x+3,y-2,6,1,P.white);R(x+2,y-1,1,4,P.white);R(x+9,y-1,1,4,P.white);for(let k=0;k<5;k++)R(x+10+k,y+3-k,2,2,P.blue);}}
 for(let y of g.yarns)if(!g.collected.has(y.id)){let x=Math.round(y.x/3)-cam,yy=Math.round(y.y/3)+(reduced?0:Math.floor(Math.sin(g.time*3+y.id)*1));R(x-2,yy-3,5,7,P.gold);R(x-3,yy-2,7,5,P.gold);R(x-1,yy-2,2,4,P.cream);R(x+2,yy+3,4,1,P.orange);}
 // Jenn’s little brick house; an original cottage, with a friendly open door.
 let hx=1690-cam;R(hx,67,94,73,P.cream);for(let y=70;y<140;y+=8)for(let x=0;x<94;x+=16){R(hx+x,y,15,1,P.brick);R(hx+x+(y%16?0:8),y,1,8,P.brick);}for(let i=0;i<13;i++)R(hx-6+i*4,66-i*2,106-i*8,2,P.soil);R(hx+48,86,28,54,P.rust);R(hx+51,89,22,51,P.ink);R(hx+67,113,2,2,P.gold);R(hx+9,84,26,30,P.white);R(hx+12,87,20,24,P.blue);R(hx+21,87,2,24,P.white);R(hx+12,98,20,2,P.white);R(hx+33,140,58,3,P.brick);
 sprite(JENN,Math.round(5210/3)-cam-7,119,{h:P.hair,s:P.skin,k:P.ink,p:P.pink,b:P.navy});
 function cat(c,ginger,face,run){let x=Math.round(c.x/3)-cam-2,y=Math.round(c.y/3)-4;let map=ginger?{o:P.orange,r:P.rust,c:P.cream,k:P.ink,n:P.pink}:{o:P.ink,r:P.white,c:P.white,k:P.green,n:P.pink};sprite(CAT,x,y,map,face<0);if(run&&Math.floor(g.time*9)%2){R(x+2,y+12,2,2,map.o);R(x+7,y+13,2,1,map.o);}}
 for(let c of g.cats)cat(c,false,c.speed>0?1:-1,true);
 let p=g.player;if(p.dashTimer>0){let x=Math.round(p.x/3)-cam;for(let i=1;i<4;i++)R(x-p.face*(i*5),Math.round(p.y/3)+i,4,1,P.white);}
 cat(p,true,p.face,p.grounded&&Math.abs(p.vx)>20);
 if(g.notice>0&&!reduced){let x=Math.round(p.x/3)-cam+4,y=Math.round(p.y/3)-10;for(let i=0;i<4;i++){R(x-7+i*5,y+(i%2)*4,1,3,P.white);R(x-8+i*5,y+1+(i%2)*4,3,1,P.white);}}
 if(g.won){sprite(['.rr.rr.','rrrrrrr','rrrrrrr','.rrrrr.','..rrr..','...r...'],Math.round(p.x/3)-cam,Math.round(p.y/3)-13,{r:P.pink});}
}
