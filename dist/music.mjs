export function syncMusic(media,{enabled,active}){
 if(!media)return;
 media.loop=true;media.volume=.22;
 if(enabled&&active){if(media.paused){try{media.play()?.catch(()=>{});}catch{}}}
 else media.pause();
}
