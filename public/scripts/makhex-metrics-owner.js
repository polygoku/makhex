(()=>{
 'use strict';
 const form=document.getElementById('funnel-report-form');
 if(!form)return;
 const status=document.getElementById('funnel-report-status');
 const container=document.getElementById('funnel-report-results');
 const body=document.getElementById('funnel-report-body');
 const summary=document.getElementById('funnel-report-summary');
 const columns=['project_view','demo_play','assembly_interact','add_to_cart','checkout_start','order_request_created','paid_checkout_verified'];
 const fmt=n=>Number(n||0).toLocaleString('en-US');
 form.addEventListener('submit',async event=>{
  event.preventDefault();status.textContent='Loading owner report…';container.hidden=true;
  const token=form.elements.token.value;
  const days=form.elements.days.value;
  try{
   const response=await fetch('/api/v1/metrics/report?days='+encodeURIComponent(days),{
    method:'GET',credentials:'same-origin',cache:'no-store',headers:{'authorization':'Bearer '+token}
   });
   if(!response.ok)throw Error(response.status===401?'Owner token not accepted.':response.status===503?'Analytics storage or owner access not initialized.':'Report unavailable.');
   const data=await response.json();
   const projects=new Map();
   for(const row of data.rows||[]){
    const values=projects.get(row.project)||Object.fromEntries(columns.map(c=>[c,0]));
    if(columns.includes(row.event))values[row.event]+=Number(row.count)||0;
    projects.set(row.project,values);
   }
   body.replaceChildren();const totals=Object.fromEntries(columns.map(c=>[c,0]));
   const rows=[...projects].sort((a,b)=>b[1].project_view-a[1].project_view);
   for(const [slug,row] of rows){
    const tr=document.createElement('tr');
    const project=document.createElement('td');project.textContent=slug.replaceAll('-',' ');tr.append(project);
    for(const key of columns){
     totals[key]+=row[key];const td=document.createElement('td');td.textContent=fmt(row[key]);tr.append(td);
    }
    const ratio=document.createElement('td');
    ratio.textContent=row.project_view?((row.order_request_created/row.project_view)*100).toFixed(1)+'%':'—';
    tr.append(ratio);
    const paidRatio=document.createElement('td');paidRatio.textContent=row.order_request_created?((row.paid_checkout_verified/row.order_request_created)*100).toFixed(1)+'%':'—';
    tr.append(paidRatio);body.append(tr);
   }
   if(!rows.length){
    const tr=document.createElement('tr');const cell=document.createElement('td');
    cell.colSpan=10;cell.textContent='No events recorded in this window yet.';tr.append(cell);body.append(tr);
   }
   summary.textContent='Window: '+data.start+' to today · '+fmt(totals.project_view)+' views · '+fmt(totals.add_to_cart)+' cart-add events · '+fmt(totals.order_request_created)+' submitted requests · '+fmt(totals.paid_checkout_verified)+' owner-verified paid checkouts';
   status.textContent='Owner report loaded. No personal identifiers are retained by this analytics service.';
   container.hidden=false;
  }catch(e){status.textContent=e.message||'Unable to load report.'}
 });
})();
