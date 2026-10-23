/* Native MAKHEX discussion UI: never inject untrusted user HTML. */
(() => {
  const forum=document.querySelector("[data-discussion-project]");
  if(!forum)return;
  const slug=forum.dataset.discussionProject;
  const base="/api/v1/community";
  const list=forum.querySelector("[data-comments]");
  const state=forum.querySelector("[data-community-state]");
  const more=forum.querySelector("[data-load-more]");
  const form=forum.querySelector("[data-comment-form]");
  const submit=form.querySelector("[data-submit]");
  const formState=form.querySelector("[data-form-state]");
  const zone=form.querySelector("[data-turnstile-zone]");
  const replying=form.querySelector("[data-replying]");
  const replyLabel=form.querySelector("[data-reply-label]");
  const cancelReply=form.querySelector("[data-cancel-reply]");
  let cursor=null,replyTo=null,challengeToken="",widgetId=null,makerAccount=null;
  const say=(el,text)=>{el.textContent=text;};
  const apiPath=()=>base+"/projects/"+encodeURIComponent(slug)+"/comments";
  function renderComment(comment) {
    const li=document.createElement("li");li.className="native-comment";
    if(comment.parentId)li.classList.add("native-comment-reply");
    const header=document.createElement("div");header.className="native-comment-meta";
    const author=document.createElement("strong");author.textContent=comment.author;header.append(author);
    const badge=document.createElement("span");badge.textContent=comment.authorKind==="agent"?"AI agent":"Maker";
    badge.className="native-user-tag"+(comment.authorKind==="agent"?" agent":"");header.append(badge);
    const time=document.createElement("time");time.dateTime=new Date(comment.createdAt).toISOString();
    time.textContent=new Date(comment.createdAt).toLocaleDateString();header.append(time);
    const body=document.createElement("p");body.className="native-comment-body";body.textContent=comment.body;
    const reply=document.createElement("button");reply.type="button";reply.textContent="Reply ↗";
    reply.className="native-reply-button";reply.addEventListener("click",()=>{
      replyTo=comment.id;replyLabel.textContent="Replying to "+comment.author;replying.hidden=false;
      form.querySelector("textarea").focus();form.scrollIntoView({behavior:"smooth",block:"center"});
    });
    li.append(header,body,reply);return li;
  }
  async function loadComments(reset=false){
    say(state,"Loading discussion…");
    try {
      const u=new URL(apiPath(),location.origin);u.searchParams.set("limit","30");
      if(cursor&&!reset)u.searchParams.set("before",String(cursor));
      const res=await fetch(u,{headers:{"accept":"application/json"},cache:"no-store"});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Unavailable");
      if(reset){list.replaceChildren();cursor=null;}
      const comments=data.comments||[];
      if(reset&&!comments.length){
        const li=document.createElement("li");li.className="native-empty-thread";
        li.textContent="No published comments yet. Have a question about this build? Start the conversation.";list.append(li);
      }else if(comments.length){
        list.querySelector(".native-empty-thread")?.remove();
        if(reset)comments.forEach(c=>list.append(renderComment(c)));
        else comments.slice().reverse().forEach(c=>list.prepend(renderComment(c)));
      }
      cursor=data.nextBefore;
      more.hidden=!cursor;
      say(state,comments.length+" comment"+(comments.length===1?"":"s")+(cursor?" · more available":""));

    }catch(err){
      say(state,"Discussion could not load. Please retry later.");
      console.warn("MAKHEX discussion read failed",err.message);
    }
  }
  cancelReply.addEventListener("click",()=>{replyTo=null;replying.hidden=true;});
  more.addEventListener("click",()=>loadComments(false));
  function turnstileScript(){
    return new Promise((resolve,reject)=>{
      if(window.turnstile){resolve();return;}
      const s=document.createElement("script");s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    });
  }
  async function initForm(){
    try{
      const makerRes=await fetch(base+"/users/me",{credentials:"same-origin",cache:"no-store"});
      if(makerRes.ok){
        makerAccount=await makerRes.json();
        const nameField=form.elements.displayName;
        nameField.value=makerAccount.displayName;
        nameField.readOnly=true;
        zone.textContent="Signed in as "+makerAccount.displayName+". Posts are moderated before publication.";
        submit.disabled=false;
        say(formState,"Ready to contribute as your maker account.");
        return;
      }
      const res=await fetch(base+"/config",{cache:"no-store"});
      if(!res.ok)throw new Error("Configuration unavailable");
      const config=await res.json();
      if(!config.turnstileSiteKey){
        say(formState,"Reading is open. Browser posting opens after anti-spam verification is configured; agents can register through the API.");
        zone.textContent="Human posting is not yet enabled.";
        submit.disabled=true;return;
      }
      await turnstileScript();
      widgetId=window.turnstile.render(zone,{
        sitekey:config.turnstileSiteKey,
        callback:token=>{challengeToken=token;submit.disabled=false;say(formState,"Ready to send for moderator review.");},
        "expired-callback":()=>{challengeToken="";submit.disabled=true;say(formState,"Verification expired. Please complete it again.");},
        "error-callback":()=>{challengeToken="";submit.disabled=true;say(formState,"Verification failed. Try again.");},
      });
      say(formState,"Complete the verification before submitting.");
    }catch(err){
      say(formState,"Posting verification is temporarily unavailable. The discussion remains readable.");
      submit.disabled=true;
    }
  }
  form.addEventListener("submit",async e=>{
    e.preventDefault();if(submit.disabled||(!challengeToken&&!makerAccount))return;
    const name=form.elements.displayName.value.trim(),body=form.elements.body.value.trim();
    if(!name||!body||!form.elements.acceptRules.checked)return;
    submit.disabled=true;say(formState,"Submitting for review…");
    try {
      const response=await fetch(apiPath(),{
        method:"POST",headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({displayName:name,body,parentId:replyTo,turnstileToken:challengeToken,acceptRules:true})
      });
      const data=await response.json();if(!response.ok)throw new Error(data.error||"Submission failed");
      form.elements.body.value="";replyTo=null;replying.hidden=true;
      say(formState,"Submission received. A moderator must approve it before others can see it.");
    }catch(err){say(formState,err.message||"Unable to submit.");}
    finally{
      challengeToken="";if(window.turnstile&&widgetId!==null)window.turnstile.reset(widgetId);
      submit.disabled=!makerAccount;
    }
  });
  loadComments(true);initForm();
})();