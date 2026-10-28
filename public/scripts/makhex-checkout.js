/* MAKHEX owner-sourced checkout. No buyer payment details handled on this site. */
(()=>{
'use strict';
const form=document.getElementById('makhex-order-request-form');
if(!form)return;
const storeKey='makhex-parts-cart-v1',list=document.getElementById('makhex-checkout-lines');
const notice=document.getElementById('makhex-checkout-notice'),summary=document.getElementById('makhex-checkout-plan');
const submit=form.querySelector('[type=submit]');
let cart=[],challengeToken='',widget=null,statusLink='';
const say=s=>{notice.textContent=s;};
const getCart=()=>{
 try{
  const arr=JSON.parse(localStorage.getItem(storeKey)||'[]');
  return Array.isArray(arr)?arr.filter(i=>i&&/^[a-z0-9-]+$/.test(i.slug)&&Number.isInteger(i.quantity)&&i.quantity>0):[];
 }catch{return []}
};
async function loadLines(){
 try{
  cart=getCart();
  if(!cart.length){list.textContent='Your MAKHEX cart is empty.';summary.textContent='Add a project kit or component to start checkout.';return;}
  const resp=await fetch('/sourcing.json?v=makhex-checkout-20261027',{cache:'no-store'});
  if(!resp.ok)throw Error('MAKHEX catalog is temporarily unavailable');
  const catalog=await resp.json();
  list.replaceChildren();
  let total=0,missing=0,count=0;
  for(const item of cart){
   const product=[...catalog.components,...catalog.researchSubcomponents].find(p=>p.slug===item.slug);
   if(!product)throw Error('An old cart item needs review before checkout: '+item.slug);
   const row=document.createElement('div');row.className='checkout-item';
   const left=document.createElement('div'),title=document.createElement('strong'),variant=document.createElement('div'),price=document.createElement('span');
   title.textContent=product.title+' × '+item.quantity;
   variant.textContent=item.option==='Option pending'?product.exactRequirements||'MAKHEX will verify the exact required option':item.option;
   variant.className='checkout-variant';left.append(title,variant);
   const selected=product.variants.find(v=>v.title===item.option);
   if(typeof selected?.priceUsd==='number'){total+=selected.priceUsd*item.quantity;price.textContent='MAKHEX plan $'+(selected.priceUsd*item.quantity).toFixed(2)}
   else{missing++;price.textContent='Final price on approval'}
   row.append(left,price);list.append(row);count+=item.quantity;
  }
  summary.textContent=count+' parts in one order · '+(total>0?'current catalog planning subtotal $'+total.toFixed(2)+' · ':'')+(missing?missing+' lines need owner sourcing approval before payment':'final amount verified before payment');
 }catch(e){list.textContent=e.message||'Cart could not be loaded';cart=[]}
}
async function loadTurnstile(){
 try{
  const cfg=await fetch('/api/v1/community/config',{cache:'no-store'}).then(r=>r.json());
  if(!cfg.turnstileSiteKey)throw Error('Checkout anti-spam configuration is unavailable');
  if(!window.turnstile)await new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
   script.async=true;script.onload=resolve;script.onerror=()=>reject(Error('Verification did not load'));document.head.append(script);
  });
  widget=window.turnstile.render('#makhex-checkout-turnstile',{
   sitekey:cfg.turnstileSiteKey,
   callback:token=>{challengeToken=token;submit.disabled=!cart.length;},
   'expired-callback':()=>{challengeToken='';submit.disabled=true;},
   'error-callback':()=>{challengeToken='';submit.disabled=true;}
  });
  say('You can submit once the human check is complete. No payment is taken now.');
 }catch(e){say(e.message||'Verification is temporarily unavailable');submit.disabled=true}
}
form.addEventListener('submit',async e=>{
 e.preventDefault();
 if(!form.reportValidity()||!cart.length)return;
 if(!challengeToken)return say('Complete the human verification challenge first.');
 submit.disabled=true;say('Recording your MAKHEX order request securely…');
 try{
  const data={
   email:form.elements.email.value.trim(),shippingState:form.elements.shippingState.value,
   shippingZip:form.elements.shippingZip.value.trim(),acceptTerms:form.elements.acceptTerms.checked,
   turnstileToken:challengeToken,
   lines:cart.map(i=>({slug:i.slug,option:i.option,quantity:i.quantity,project:i.project||''}))
  };
  const result=await fetch('/api/v1/checkout/requests',{method:'POST',credentials:'same-origin',cache:'no-store',
    headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify(data)});
  const body=await result.json();
  if(!result.ok)throw Error(body.error||'MAKHEX could not record the order');
  statusLink=new URL(body.statusUrl,location.origin).href;
  document.getElementById('makhex-checkout-id').textContent='Order '+body.orderId;
  document.getElementById('makhex-checkout-status-link').href=statusLink;
  form.hidden=true;document.getElementById('makhex-checkout-success').hidden=false;
  localStorage.removeItem(storeKey);
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent='0');
  say('Your MAKHEX order request is recorded.');
 }catch(err){say(err.message||'Order request unavailable; no charge was made');}
 finally{
  challengeToken='';if(window.turnstile&&widget!==null)window.turnstile.reset(widget);
  if(!form.hidden)submit.disabled=true;
 }
});
document.getElementById('makhex-checkout-copy').addEventListener('click',async()=>{
 const label=document.getElementById('makhex-checkout-copy-result');
 try{await navigator.clipboard.writeText(statusLink);label.textContent='Private order link copied.'}
 catch{label.textContent='Use the View my order status link above to save the private URL.'}
});
loadLines().then(loadTurnstile);
})();