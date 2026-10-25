(async()=>{
const status=document.getElementById('design-library-status');
const auth=document.getElementById('design-library-auth');
const list=document.getElementById('design-library-items');
try{
 const response=await fetch('/api/v1/community/projects/microduck-robot/design-resources',{credentials:'same-origin',cache:'no-store',headers:{accept:'application/json'}});
 if(response.status===401){status.textContent='Please sign in to download original CAD and PCB design files.';auth.hidden=false;return;}
 if(!response.ok)throw new Error('Cannot retrieve maker design library.');
 const data=await response.json();
 if(data.access!=='authenticated-maker-session'||!Array.isArray(data.resources))throw new Error('Unexpected resource list.');
 const grouped=new Map();
 for(const item of data.resources){
   if(typeof item.downloadUrl!=='string'||!/^\/api\/v1\/community\/projects\/microduck-robot\/design-downloads\/[a-z0-9-]+$/.test(item.downloadUrl))continue;
   if(!grouped.has(item.group))grouped.set(item.group,[]);
   grouped.get(item.group).push(item);
 }
 for(const [group,items] of grouped){
   const header=document.createElement('h2');header.textContent=group;header.style.gridColumn='1/-1';list.append(header);
   for(const item of items){
     const a=document.createElement('a'),strong=document.createElement('strong'),small=document.createElement('small');
     a.href=item.downloadUrl;a.setAttribute('download',item.filename);
     strong.textContent=item.title+' ↓';
     const kb=(item.bytes/1024).toFixed(0);
     small.textContent='MAKHEX protected download · '+kb+' KB · Original kissqy source';
     const detail=document.createElement('small');detail.textContent=item.description||'Source-matched CAD reference';
     a.append(strong,small,detail);list.append(a);
   }
 }
 list.hidden=false;status.textContent=data.resources.length+' original files available. Every download requires your maker session.';
}catch(e){status.textContent='The protected design library could not be loaded. Please sign in again or contact MAKHEX.';}
})();
