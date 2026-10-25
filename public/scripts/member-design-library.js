(async()=>{
const status=document.getElementById('design-library-status');
const auth=document.getElementById('design-library-auth');
const list=document.getElementById('design-library-items');
try{
 const res=await fetch('/api/v1/community/projects/microduck-robot/design-resources',{credentials:'same-origin',cache:'no-store',headers:{'Accept':'application/json'}});
 if(res.status===401){status.textContent='Maker account sign-in required.';auth.hidden=false;return;}
 if(!res.ok)throw new Error('Member design library unavailable.');
 const data=await res.json();
 for(const item of data.resources||[]){
   const a=document.createElement('a');const strong=document.createElement('strong');const small=document.createElement('small');
   if(!/^https:\/\/github\.com\/kissqy\/Microduck-kissqy\//.test(item.url)&&!/^https:\/\/kissqy\.github\.io\/Microduck-kissqy\//.test(item.url))continue;
   a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';
   strong.textContent=item.title+' ↗';small.textContent=item.type+' · Original creator source';
   a.append(strong,small);list.append(a);
 }
 list.hidden=false;status.textContent='Signed in. Access the original source files below.';
}catch{status.textContent='The design library cannot be loaded right now. Try signing in again.';}
})();
