(()=>{
const node=document.getElementById('makhex-order-state');if(!node)return;
const token=decodeURIComponent(location.hash.slice(1));
const id=document.getElementById('makhex-order-id'),list=document.getElementById('makhex-order-items');
const info=document.getElementById('makhex-order-info'),cost=document.getElementById('makhex-order-cost');
const pay=document.getElementById('makhex-order-pay'),track=document.getElementById('makhex-order-tracking');
const refresh=document.getElementById('makhex-order-refresh');
async function load(){
 if(!/^mkxo_[A-Za-z0-9_-]{43}$/.test(token)){
  node.textContent='Your private link is missing. Return to your order confirmation and save the full link.';refresh.disabled=true;return;
 }
 refresh.disabled=true;node.textContent='Checking order status…';
 try{
  const resp=await fetch('/api/v1/checkout/status',{method:'POST',headers:{'content-type':'application/json'},cache:'no-store',body:JSON.stringify({accessToken:token})});
  const result=await resp.json();if(!resp.ok)throw Error(result.error||'Order status unavailable');
  node.textContent=result.status.replaceAll('_',' ');
  id.textContent='Order '+result.orderId;
  list.replaceChildren();
  for(const item of result.items){
    const li=document.createElement('li');
    li.textContent=item.quantity+' × '+item.title+' — '+(item.option==='Option pending'?'MAKHEX will confirm exact option':item.option);
    list.append(li);
  }
  info.textContent=result.notice;
  cost.textContent=result.approvedAmountUsd==null?'Final price and shipping under review':'Approved order total: $'+result.approvedAmountUsd.toFixed(2)+' (USD)';
  if(result.status==='PAYMENT_LINK_READY' && /^https:\/\//.test(result.paymentUrl)){
   const u=new URL(result.paymentUrl);
   const safe=u.hostname==='shop.makhex.com'||u.hostname==='squarespace.com'||u.hostname.endsWith('.squarespace.com');
   if(safe){pay.href=u.href;pay.hidden=false}else pay.hidden=true;
  }else pay.hidden=true;
  track.textContent=result.tracking?'Tracking: '+result.tracking:'';
 }catch(e){node.textContent=e.message||'Order status unavailable';}
 finally{refresh.disabled=false}
}
refresh.addEventListener('click',load);load();
})();