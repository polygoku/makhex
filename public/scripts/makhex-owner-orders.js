(()=>{
'use strict';
const root=document.getElementById('owner-orders');if(!root)return;
const keyInput=document.getElementById('owner-key'),message=document.getElementById('owner-message');
const panel=document.getElementById('owner-orders-section');
let token='';
const txt=(node,s)=>node.textContent=s;
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const req=async(path,method='GET',body)=>{
 const response=await fetch('/api/v1/checkout/admin/'+path,{method,headers:{authorization:'Bearer '+token,...(body?{'content-type':'application/json'}:{})},cache:'no-store',body:body?JSON.stringify(body):undefined});
 const data=await response.json();
 if(!response.ok)throw Error(data.error||'Owner order action was not accepted');
 return data;
};
const chooseAction=s=>s==='PENDING_REVIEW'?['approve','reject']:s==='APPROVED_NEEDS_PAYMENT_LINK'?['attach_payment','reject']:s==='PAYMENT_LINK_READY'?['record_paid_verified']:s==='PAID_VERIFIED'?['fulfill']:[];
function actionLabel(a){return ({approve:'Approve sourcing & final total',reject:'Reject / decline exception',attach_payment:'Attach MAKHEX Squarespace payment link',record_paid_verified:'Record verified Squarespace payment',fulfill:'Record shipment tracking'})[a]||a}
function renderCard(order){
 const card=el('article','owner-order');
 const header=el('header'),name=el('strong','',order.id),status=el('span','owner-status',order.status.replaceAll('_',' '));
 header.append(name,status);card.append(header);
 const note=el('p','',order.email+' · '+order.shipping_state+' '+order.shipping_zip+' · '+new Date(order.created_at).toLocaleString());card.append(note);
 const list=el('ul');
 for(const p of order.lines){const li=el('li','',p.quantity+' × '+p.title+' · '+p.option+(p.requiresExceptionReview?' · EXCEPTION REVIEW':''));list.append(li)}
 card.append(list);
 const estimate=el('p','',order.approved_total_cents==null?'Price not yet approved':'Approved price: $'+(order.approved_total_cents/100).toFixed(2));
 card.append(estimate);
 if(order.merchant_order_id)card.append(el('p','','Squarespace merchant order: '+order.merchant_order_id));
 if(order.tracking_reference)card.append(el('p','','Tracking: '+order.tracking_reference));
 if(order.owner_note)card.append(el('p','','Last owner note: '+order.owner_note));
 const actions=chooseAction(order.status);
 if(actions.length){
  const form=el('form','owner-order-controls');
  const actLabel=el('label');actLabel.textContent='Action';
  const select=el('select');for(const a of actions){const op=el('option','',actionLabel(a));op.value=a;select.append(op)}
  actLabel.append(select);form.append(actLabel);
  function field(caption,name,value='',placeholder=''){
   const label=el('label','',caption),input=el('input');input.name=name;input.value=value;input.placeholder=placeholder;label.append(input);return label;
  }
  const approved=field('Approved final total (USD)','total',order.approved_total_cents==null?'':(order.approved_total_cents/100).toFixed(2),'e.g. 199.95');
  const pay=field('MAKHEX Squarespace payment link','paymentUrl','','https://shop.makhex.com/...');
  const merchant=field('Verified Squarespace order ID','merchantOrderId','','Order number from merchant dashboard');
  const tracking=field('Carrier and tracking reference','tracking','','Carrier / tracking number');
  const ownerNote=el('label','owner-full','Owner decision notes and evidence (never include buyer card details)');
  const area=el('textarea');area.rows=3;area.name='note';area.placeholder='Document source SKU, U.S. freight, variant, margin and any approved substitution';ownerNote.append(area);
  const response=el('p','owner-response owner-full',''),button=el('button','btn btn-primary','APPLY OWNER DECISION →');button.type='submit';
  form.append(approved,pay,merchant,tracking,ownerNote,button,response);
  function arrange(){
   const a=select.value;
   approved.hidden=a!=='approve';pay.hidden=a!=='attach_payment';merchant.hidden=a!=='record_paid_verified';tracking.hidden=a!=='fulfill';
  }select.addEventListener('change',arrange);arrange();
  form.addEventListener('submit',async event=>{
   event.preventDefault();button.disabled=true;txt(response,'Saving owner decision…');
   const action=select.value,body={action,note:area.value.trim()};
   if(action==='approve'){const d=approved.querySelector('input').value.trim();if(!/^\d+(?:\.\d{1,2})?$/.test(d)){txt(response,'Use a dollar amount like 215.50');button.disabled=false;return;}body.approvedTotalCents=Math.round(Number(d)*100)}
   if(action==='attach_payment')body.paymentUrl=pay.querySelector('input').value.trim();
   if(action==='record_paid_verified'){body.merchantOrderId=merchant.querySelector('input').value.trim();body.receiptTotalCents=order.approved_total_cents}
   if(action==='fulfill')body.tracking=tracking.querySelector('input').value.trim();
   try{await req('requests/'+order.id,'POST',body);txt(message,'Owner decision saved. Reloaded queue.');await load()}
   catch(e){txt(response,e.message||'Decision not saved')}finally{button.disabled=false}
  });
  card.append(form);
 }
 return card;
}
async function load(){
 try{
  const data=await req('requests');
  root.replaceChildren();
  if(!data.orders.length)root.append(el('p','','No MAKHEX order exceptions yet.'));
  for(const order of data.orders)root.append(renderCard(order));
  panel.hidden=false;txt(message,'Secure owner queue loaded. '+data.orders.length+' requests.');
 }catch(e){panel.hidden=true;txt(message,e.message||'Owner authentication or order service failed.')}
}
document.getElementById('owner-refresh').addEventListener('click',()=>{
 token=keyInput.value.trim();keyInput.value='';
 if(!token)return txt(message,'Enter the private MAKHEX owner access key.');
 load();
});
document.getElementById('owner-reload').addEventListener('click',load);
})();