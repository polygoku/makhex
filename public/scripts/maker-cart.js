/* Local MAKHEX parts basket — NOT a checkout or order */
(()=>{
'use strict';
const STORE_KEY='makhex-parts-cart-v1',MAX_LINES=80,MAX_QUANTITY=99;
const okSlug=s=>typeof s==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
const okOption=s=>typeof s==='string'&&s.length>0&&s.length<=160;
const key=item=>item.slug+'\u001f'+item.option+'\u001f'+(item.project??'');
let catalogPromise,volatile=[];
const findPart=(catalog,slug)=>catalog.components.find(p=>p.slug===slug)||(catalog.researchSubcomponents??[]).find(p=>p.slug===slug);
const separateMosaico=new Set(['esp-mosaico-core-unit','esp-mosaico-camera-module','esp-mosaico-interaction-module']);
function excludeAlternative(items,added){
 const newParts=new Set(added.map(x=>x.slug));
 const replacingPlanCable=newParts.has('usb-c-data-cable');
 if(newParts.has('esp-mosaico-vision-combo-kit'))return items.filter(x=>!separateMosaico.has(x.slug)&&!(replacingPlanCable&&x.slug==='usb-c-data-cable'));
 if([...newParts].some(slug=>separateMosaico.has(slug)))return items.filter(x=>x.slug!=='esp-mosaico-vision-combo-kit'&&!(replacingPlanCable&&x.slug==='usb-c-data-cable'));
 return items;
}
function read(){
 try{
  const raw=window.localStorage.getItem(STORE_KEY);
  const items=raw?JSON.parse(raw):volatile;
  return Array.isArray(items)?items.filter(p=>p&&okSlug(p.slug)&&okOption(p.option)&&Number.isSafeInteger(p.quantity)&&p.quantity>0&&p.quantity<=MAX_QUANTITY).slice(0,MAX_LINES):[];
 }catch{return volatile}
}
function updateCount(){
 const total=read().reduce((v,p)=>v+p.quantity,0);
 document.querySelectorAll('[data-cart-count]').forEach(e=>{e.textContent=String(total);e.setAttribute('aria-label',total+' parts in cart')});
}
function save(items){
 volatile=items;
 try{window.localStorage.setItem(STORE_KEY,JSON.stringify(items))}catch{}
 updateCount();
 document.dispatchEvent(new Event('makhex:cart-updated'));
}
function flash(message){document.querySelectorAll('[data-cart-flash]').forEach(e=>e.textContent=message)}
async function catalog(){
 if(!catalogPromise) catalogPromise=fetch('/sourcing.json?v=checkout-20261027',{credentials:'same-origin',cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Component catalog is temporarily unavailable');return r.json()}).then(d=>{if(!Array.isArray(d.components)||!Array.isArray(d.projects))throw Error('Invalid catalog');return d}).catch(e=>{catalogPromise=null;throw e});
 return catalogPromise;
}
function check(c,item){
 const part=findPart(c,item.slug);
 if(!part||!okOption(item.option))throw Error('Unknown component or option');
 const options=part.variants??[];
 if(options.length&&!options.some(v=>v.title===item.option)&&!(item.slug==='speaker-4ohm-3w'&&item.project==='microduck-robot'&&item.option==='Option pending'))throw Error('Choose a listed option');
 if(!options.length&&item.option!=='Option pending')throw Error('Option qualification pending');
 if(!Number.isSafeInteger(item.quantity)||item.quantity<1||item.quantity>MAX_QUANTITY)throw Error('Invalid quantity');
}
// Migrate older carts as sourcing changes. Never preserve an obsolete,
// non-orderable historical quote as though it remains a valid shop option.
function migrateLegacyOptions(c){
 const stored=read(),migrated=[];
 let changed=false;
 for(const item of stored){
  const part=findPart(c,item.slug),variants=part?.variants??[];
  const isMicroduckSpeaker=item.slug==='speaker-4ohm-3w'&&item.project==='microduck-robot';
  const next=variants.length===0&&item.option!=='Option pending'?{...item,option:'Option pending'}:item.option==='Option pending'&&variants.length===1&&!isMicroduckSpeaker?{...item,option:variants[0].title}:item;
  if(next!==item)changed=true;
  const duplicate=migrated.find(existing=>key(existing)===key(next));
  if(duplicate){duplicate.quantity=Math.min(MAX_QUANTITY,duplicate.quantity+next.quantity);changed=true}
  else migrated.push(next);
 }
 if(changed){volatile=migrated;try{window.localStorage.setItem(STORE_KEY,JSON.stringify(migrated))}catch{}updateCount()}
 return changed?migrated:stored;
}
function insert(current,items,c){
 const next=excludeAlternative(current,items).map(p=>({...p}));
 for(const item of items){
  check(c,item);
  const old=next.find(p=>key(p)===key(item));
  if(old)old.quantity=Math.min(MAX_QUANTITY,old.quantity+item.quantity);
  else if(next.length<MAX_LINES)next.push({...item});
  else throw Error('Cart has too many different parts');
 }
 return next;
}
async function add(items,button){
 button.disabled=true;
 try{
  const c=await catalog();
  save(insert(migrateLegacyOptions(c),items,c));
  const count=items.reduce((n,p)=>n+p.quantity,0);
  flash('Added '+count+' part'+(count===1?'':'s')+' to your cart.');
 }catch(e){flash(e.message||'Could not add parts')}
 finally{button.disabled=false}
}
document.addEventListener('click',async event=>{
 const b=event.target.closest('button');
 if(!b)return;
 if(b.hasAttribute('data-cart-add-all')){
  b.disabled=true;
  try{
   const c=await catalog(),project=c.projects.find(p=>p.slug===b.getAttribute('data-cart-add-all'));
   if(!project)throw Error('Project not found');
   const items=(project.cartPlan?.parts??project.parts).map(p=>({slug:p.slug,option:p.option??p.selectedOption??'Option pending',quantity:p.qty,project:project.slug}));
   save(insert(migrateLegacyOptions(c),items,c));
   flash('Added all '+items.reduce((sum,p)=>sum+p.quantity,0)+' parts for '+project.title+'.');
  }catch(e){flash(e.message||'Unable to add kit')}
  finally{b.disabled=false}
  return;
 }
 if(b.hasAttribute('data-cart-add-plan')){
  b.disabled=true;
  try{
   const c=await catalog(),name=b.getAttribute('data-cart-add-plan');
   const plan=c.projectAlternativePlans?.[name];
   if(!plan)throw Error('Unrecognized component plan');
   const items=plan.parts.map(p=>({slug:p.slug,option:p.option??'Option pending',quantity:p.qty,project:name}));
   save(insert(migrateLegacyOptions(c),items,c));
   flash('Added '+items.length+' separate research components. Bundle duplicates removed.');
  }catch(e){flash(e.message||'Could not add individual research components')}
  finally{b.disabled=false}
  return;
 }
 if(b.hasAttribute('data-cart-add')){
  const part=b.closest('[data-cart-product]'),select=part?.querySelector('[data-cart-choice]');
  await add([{slug:b.getAttribute('data-cart-slug')||part?.getAttribute('data-cart-product'),option:select?select.value:(b.getAttribute('data-cart-option')||'Option pending'),quantity:Number(b.getAttribute('data-cart-quantity')||1),project:b.getAttribute('data-cart-project')||undefined}],b);
  return;
 }
 if(b.hasAttribute('data-cart-clear')){save([]);flash('Cart cleared.');return}
 if(b.hasAttribute('data-cart-copy')){
  try{
   const c=await catalog(),rows=migrateLegacyOptions(c).map(p=>p.quantity+' x '+(findPart(c,p.slug)?.title??p.slug)+' — '+p.option);
   if(!rows.length){flash('Cart is empty.');return}
   await navigator.clipboard.writeText('MAKHEX parts\n'+rows.join('\n'));
   flash('Parts list copied.');
  }catch{flash('Could not copy parts list.')}
 }
});
async function render(){
 const host=document.querySelector('[data-cart-lines]');
 if(!host)return;
 let c;
 try{c=await catalog()}catch(e){host.textContent=e.message;return}
 host.replaceChildren();
 const cart=migrateLegacyOptions(c),totalLabel=document.querySelector('[data-cart-total]'),countLabel=document.querySelector('[data-cart-lines-count]');
 if(!cart.length){
  const p=document.createElement('p'),a=document.createElement('a');
  p.className='cart-empty-message';p.textContent='Your parts cart is empty. Explore a build to add a complete kit or select individual components.';
  a.href='/projects/';a.className='btn btn-primary';a.textContent='Explore projects →';
  host.append(p,a);if(totalLabel)totalLabel.textContent='No items';if(countLabel)countLabel.textContent='0 parts';return;
 }
 let known=0,unknown=0,n=0;
 for(const item of cart){
  const part=findPart(c,item.slug);if(!part)continue;
  const variation=part.variants?.find(v=>v.title===item.option);
  const isDifferentSpeaker=item.slug==='speaker-4ohm-3w'&&item.project==='microduck-robot';
  const price=!isDifferentSpeaker&&typeof variation?.priceUsd==='number'&&Number.isFinite(variation.priceUsd)?variation.priceUsd:null;
  const card=document.createElement('article');card.className='cart-line';
  const imgLink=document.createElement('a');imgLink.href=part.url?.startsWith('https://makhex.com/')?part.url.replace('https://makhex.com',''):'/shop/'+encodeURIComponent(item.slug)+'/';imgLink.className='cart-line-photo';
  const img=document.createElement('img');img.src=part.image??'/product-media/'+item.slug+'.jpg';img.alt='MAKHEX component reference illustration for '+part.title;img.loading='lazy';imgLink.append(img);
  const info=document.createElement('div');info.className='cart-line-info';
  const name=document.createElement('a');name.href=imgLink.href;name.className='cart-line-title';name.textContent=part.title;
  const option=document.createElement('p');option.textContent=item.option==='Option pending'&&part.exactRequirements?part.exactRequirements:item.option;
  const note=document.createElement('small');note.textContent='MAKHEX handles sourcing, shipping and exception approval.';
  info.append(name,option,note);
  // Source procurement is a MAKHEX back-office task. Buyer should not have to shop elsewhere.
  const details=document.createElement('a');details.href=imgLink.href;details.className='text-link cart-seller-link';details.textContent='MAKHEX part details ↗';info.append(details);
  const controls=document.createElement('div');controls.className='cart-line-actions';
  const label=document.createElement('label');label.className='cart-quantity-label';label.textContent='Quantity';
  const input=document.createElement('input');input.type='number';input.min='1';input.max=String(MAX_QUANTITY);input.step='1';input.value=String(item.quantity);input.className='cart-qty';input.setAttribute('aria-label','Quantity of '+part.title);label.append(input);
  input.addEventListener('change',()=>{
   const qty=Number(input.value);
   if(!Number.isSafeInteger(qty)||qty<1||qty>MAX_QUANTITY){input.value=String(item.quantity);return}
   save(read().map(x=>key(x)===key(item)?{...x,quantity:qty}:x));render();
  });
  const remove=document.createElement('button');remove.type='button';remove.className='cart-remove';remove.textContent='Remove';
  remove.addEventListener('click',()=>{save(read().filter(x=>key(x)!==key(item)));render()});
  const val=document.createElement('strong');val.className='cart-line-price';val.textContent=price===null?'Final price on approval':'MAKHEX plan $'+(price*item.quantity).toFixed(2);
  controls.append(label,remove,val);card.append(imgLink,info,controls);host.append(card);
  n+=item.quantity;if(price===null)unknown++;else known+=price*item.quantity;
 }
 if(countLabel)countLabel.textContent=n+' parts · '+cart.length+' selections';
 if(totalLabel)totalLabel.textContent=unknown?(known>0?'MAKHEX planning subtotal $'+known.toFixed(2)+' · '+unknown+' part'+(unknown===1?'':'s')+' need sourcing approval':unknown+' part'+(unknown===1?'':'s')+' · pricing confirmed before payment'):'MAKHEX planning subtotal: $'+known.toFixed(2);
}
document.addEventListener('makhex:cart-updated',render);
updateCount();render();
})();
