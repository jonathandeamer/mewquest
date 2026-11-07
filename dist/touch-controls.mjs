// Track fingers independently so moving, jumping and dashing can be held together.
export function bindTouchControls(buttons,input,onInput=()=>{}){
 const controls=[...buttons],active=new Map();
 function update(button){const key=button.dataset.key,held=[...active.values()].some(b=>b.dataset.key===key);input[key]=held;if(held)button.classList.add('held');else button.classList.remove('held');}
 for(const button of controls){
  button.addEventListener('pointerdown',e=>{e.preventDefault();active.set(e.pointerId,button);try{button.setPointerCapture?.(e.pointerId);}catch{}update(button);onInput();});
  const release=e=>{e.preventDefault();if(active.get(e.pointerId)===button)active.delete(e.pointerId);update(button);onInput();};
  for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,release);
  button.addEventListener('contextmenu',e=>e.preventDefault());
 }
 return{clear(){active.clear();for(const button of controls){input[button.dataset.key]=false;button.classList.remove('held');}onInput();}};
}

export function mergeInputs(target,...sources){
 const keys=new Set([...Object.keys(target),...sources.flatMap(source=>Object.keys(source))]);
 for(const key of keys)target[key]=sources.some(source=>!!source[key]);return target;
}
