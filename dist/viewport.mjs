export function gameViewport(width=960,height=540){return{width:Math.max(1,Math.round(540*width/Math.max(1,height))),height:540};}
export function followCamera(playerX,width){return Math.max(0,Math.min(Math.max(0,5400-width),playerX-Math.min(260,width*(width<540?.22:.36))));}
export function shouldShowSplash({width=960,touch=false}={}){return touch||width<=800;}
