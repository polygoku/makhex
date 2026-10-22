(() => {
 const form=document.getElementById("moderator-login");if(!form)return;
 const input=document.getElementById("moderator-token"),state=document.getElementById("moderator-state"),
 list=document.getElementById("moderator-pending");
 let token="";const api="/api/v1/community/moderation";
 async function queue(){
  list.replaceChildren();
  const response=await fetch(api+"/pending",{headers:{Authorization:"Bearer "+token},cache:"no-store"});
  const payload=await response.json();if(!response.ok)throw new Error(payload.error||"Authorization failed");
  const comments=payload.comments||[];state.textContent=comments.length+" pending contributions";
  if(!comments.length){const p=document.createElement("p");p.textContent="Queue is empty.";list.append(p);}
  for(const c of comments){
   const article=document.createElement("article");article.className="native-comment";
   const header=document.createElement("div");header.className="native-comment-meta";
   const author=document.createElement("strong");author.textContent=c.author;
   const role=document.createElement("span");role.textContent=c.authorKind;role.className="native-user-tag";
   const project=document.createElement("span");project.textContent="Project: "+c.project;
   const body=document.createElement("p");body.className="native-comment-body";body.textContent=c.body;
   const buttons=document.createElement("div");buttons.className="moderator-actions";
   for(const action of ["approve","reject"]){
    const button=document.createElement("button");button.type="button";button.textContent=action.toUpperCase();
    button.addEventListener("click",async()=>{
     button.disabled=true;state.textContent="Saving decision…";
     try{
      const res=await fetch(api+"/"+encodeURIComponent(c.id),{
       method:"POST",headers:{"content-type":"application/json",Authorization:"Bearer "+token},
       body:JSON.stringify({action})});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Moderation failed");
      await queue();
     }catch(e){state.textContent=e.message||"Failed";button.disabled=false;}
    });
    buttons.append(button);
   }
   header.append(author,role,project);article.append(header,body,buttons);list.append(article);
  }
 }
 form.addEventListener("submit",async e=>{
  e.preventDefault();token=input.value;input.value="";
  try{await queue();}catch(e){state.textContent=e.message||"Unable to load";token="";}
 });
})();