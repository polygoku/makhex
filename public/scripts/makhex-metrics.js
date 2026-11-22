/* MAKHEX privacy-minimal project funnel events: aggregated server-side by day, no visitor IDs or external analytics. */
(()=>{
 'use strict';
 const validEvents=new Set(['project_view','demo_play','assembly_interact','add_to_cart','checkout_start']);
 const projects=new Set(['touch-weather-station','voice-command-node','tiny-ble-presence','plant-health-monitor','camera-event-trigger','epaper-desk-calendar','indoor-voc-explorer','rgb-matrix-clock','espnow-remote','smart-desk-button','mosaico-learning-assistant','microduck-robot','atomdog-quadruped-robot','mixed']);
 const sent=new Set();
 function track(event,project){
  if(!validEvents.has(event)||!projects.has(project))return;
  const id=event+'/'+project;if(sent.has(id))return;sent.add(id);
  try{
   fetch('/api/v1/metrics/events',{method:'POST',credentials:'same-origin',keepalive:true,
    headers:{'content-type':'application/json'},body:JSON.stringify({event,project})}).catch(()=>{});
  }catch{}
 }
 window.addEventListener('makhex:track',e=>{
  const data=e.detail||{};track(data.event,data.project||'mixed');
 });
 const bodyProject=document.querySelector('[data-showcase-project]');
 if(bodyProject){
  const project=bodyProject.getAttribute('data-showcase-project')||'';
  track('project_view',project);
  document.querySelectorAll('#project-showcase video, #microduck-demo video, #video video').forEach(v=>{
   v.addEventListener('play',()=>track('demo_play',project),{once:true});
  });
 }
 if(location.pathname.startsWith('/checkout/')){
  try{
   const items=JSON.parse(localStorage.getItem('makhex-parts-cart-v1')||'[]');
   const entries=Array.isArray(items)?[...new Set(items.map(x=>x.project).filter(Boolean))]:[];
   track('checkout_start',entries.length===1&&projects.has(entries[0])?entries[0]:'mixed');
  }catch{track('checkout_start','mixed');}
 }
})();
