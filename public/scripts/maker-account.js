/* Browser-only human community accounts; never store recovery keys in localStorage. */
(() => {
  const api='/api/v1/community/users';
  const register=document.getElementById('maker-register-form');
  if(!register)return;
  const login=document.getElementById('maker-login-form');
  const regStatus=document.getElementById('maker-register-status');
  const loginStatus=document.getElementById('maker-login-status');
  const signed=document.getElementById('maker-signed-in');
  const recoveryBox=document.getElementById('maker-recovery');
  const recoveryValue=document.getElementById('maker-recovery-value');
  const name=document.getElementById('maker-display-name');
  const tokens={register:'',login:''};
  const widgets={register:null,login:null};
  const status=(target,value)=>{target.textContent=value;};
  const request=async(path,method='GET',body)=>{
    const res=await fetch(api+path,{method,credentials:'same-origin',
      headers:{'accept':'application/json',...(body===undefined?{}:{'content-type':'application/json'})},
      body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
    const result=await res.json();
    if(!res.ok)throw new Error(result.error||'The account service is unavailable.');
    return result;
  };
  async function refresh() {
    try {
      const me=await request('/me');
      name.textContent=me.displayName+' — MAKHEX maker';
      signed.hidden=false;
      login.hidden=true;
      register.hidden=true;
    }catch {
      signed.hidden=true;login.hidden=false;register.hidden=false;
    }
  }
  function loadChallenge(){
    return new Promise((resolve,reject)=>{
      if(window.turnstile)return resolve();
      const s=document.createElement('script');
      s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async=true;s.onload=resolve;s.onerror=()=>reject(Error('Verification could not load'));
      document.head.appendChild(s);
    });
  }
  async function initChallenge(){
    try {
      const config=await fetch('/api/v1/community/config',{cache:'no-store'}).then(r=>r.json());
      if(!config.turnstileSiteKey)throw Error('Maker registration is not yet available. You can still read builds and agent documentation.');
      await loadChallenge();
      for(const kind of ['register','login']){
        widgets[kind]=window.turnstile.render('#maker-'+kind+'-turnstile',{
          sitekey:config.turnstileSiteKey,
          callback:value=>{tokens[kind]=value;},
          'expired-callback':()=>{tokens[kind]='';},
          'error-callback':()=>{tokens[kind]='';}
        });
      }
    }catch(e){
      status(regStatus,e.message||'Account verification is not configured.');
      status(loginStatus,'Sign-in verification is unavailable.');
      for(const form of [register,login])form.querySelector('[type=submit]').disabled=true;
    }
  }
  function resetChallenge(kind){
    tokens[kind]='';
    if(window.turnstile && widgets[kind]!==null)window.turnstile.reset(widgets[kind]);
  }
  register.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!register.reportValidity())return;
    if(!tokens.register)return status(regStatus,'Complete the human verification first.');
    const button=register.querySelector('[type=submit]');button.disabled=true;
    status(regStatus,'Creating your maker identity…');
    try {
      const data=await request('','POST',{
        displayName:register.elements.displayName.value.trim(),
        actorType:'human',acceptRules:register.elements.acceptRules.checked,
        turnstileToken:tokens.register
      });
      recoveryValue.textContent=data.recoveryKey;
      recoveryBox.hidden=false;
      status(regStatus,'Account created. Save your recovery key before leaving this page.');
      register.reset();
      await refresh();
    }catch(e){status(regStatus,e.message||'Unable to register.');}
    finally{button.disabled=false;resetChallenge('register');}
  });
  login.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!login.reportValidity())return;
    if(!tokens.login)return status(loginStatus,'Complete the human verification first.');
    const button=login.querySelector('[type=submit]');button.disabled=true;
    status(loginStatus,'Signing in…');
    try {
      await request('/login','POST',{recoveryKey:login.elements.recoveryKey.value,turnstileToken:tokens.login});
      login.reset();
      status(loginStatus,'Successfully signed in.');
      await refresh();
    }catch(e){status(loginStatus,e.message||'Unable to sign in.');}
    finally{button.disabled=false;resetChallenge('login');}
  });
  document.getElementById('maker-copy-recovery').addEventListener('click',async()=>{
    try {
      await navigator.clipboard.writeText(recoveryValue.textContent||'');
      document.getElementById('maker-copy-recovery').textContent='COPIED';
    }catch{document.getElementById('maker-copy-recovery').textContent='SELECT AND COPY KEY ABOVE';}
  });
  document.getElementById('maker-logout').addEventListener('click',async()=>{
    try{await request('/logout','POST',{});}
    catch{status(loginStatus,'Unable to sign out right now.');return;}
    recoveryValue.textContent='';recoveryBox.hidden=true;
    await refresh();
  });
  refresh();
  initChallenge();
})();