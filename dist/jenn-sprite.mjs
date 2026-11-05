// Keep the illustrated character’s proportions independent of the canvas size.
export function drawJennSprite(ctx,image,x,groundY){
 if(!image?.complete||!image.naturalWidth||!image.naturalHeight)return false;
 const height=156,width=height*image.naturalWidth/image.naturalHeight;
 ctx.drawImage(image,x-width*.52,groundY-height,width,height);
 return true;
}
