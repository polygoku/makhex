#!/usr/bin/env node
// MAKHEX production readiness auditor. READ ONLY: never changes Cloudflare, Squarespace,
// GitHub configuration, DNS, domains, payment settings or product inventory.
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {resolveNs} from 'node:dns/promises';
import {execFileSync} from 'node:child_process';
import {checkoutApprovals} from '../src/data/checkout-approvals.ts';
import {products} from '../src/data/products.ts';

const EVIDENCE_PATH=resolve('ops/launch-attestations.json');
const DOMAIN='makhex.com';
const SHOP='shop.makhex.com';
const OWNED_WORKER='https://makhex.makhex-labs.workers.dev/';

export function attestationValid(row){
 return Boolean(row&&Number.isFinite(Date.parse(row.verifiedAt||''))&&
  /^https:\/\/github\.com\/polygoku\/makhex\/(?:issues|pull)\/\d+$/.test(row.evidenceIssueUrl||''));
}
export function summarizeChecks(checks,ids){
 const missing=ids.filter(id=>checks.find(c=>c.id===id)?.status!=='PASS');
 return {ready:missing.length===0,blockedBy:missing};
}
export function classifyHttp(status,body,finalHost,expectedHost,{requireBrand=true}={}){
 if(status===401)return {status:'BLOCKED',detail:'HTTP 401: site is private, passworded or access-restricted'};
 if(status===403)return {status:'BLOCKED',detail:'HTTP 403: access denied or anti-bot challenge'};
 if(status!==200)return {status:'BLOCKED',detail:'HTTP '+status+' instead of 200'};
 if(finalHost!==expectedHost)return {status:'BLOCKED',detail:'Redirected away from required host '+expectedHost};
 if(requireBrand&&!/makhex/i.test(body))return {status:'BLOCKED',detail:'Expected MAKHEX brand not present in public response'};
 return {status:'PASS',detail:'Public HTTP 200; expected host and content'};
}

async function getResponse(url,expectedHost){
 try{
  let current=new URL(url);
  if(current.protocol!=='https:'||current.hostname!==expectedHost)throw Error('Unsafe target URL');
  for(let i=0;i<4;i++){
   const r=await fetch(current.href,{redirect:'manual',signal:AbortSignal.timeout(12500),headers:{'User-Agent':'MAKHEX-launch-audit/1.0'}});
   if([301,302,303,307,308].includes(r.status)){
    const loc=r.headers.get('location');
    if(!loc)return {status:r.status,body:'',host:current.hostname,headers:r.headers};
    const next=new URL(loc,current);
    if(next.hostname!==expectedHost||next.protocol!=='https:')return {status:200,body:'',host:next.hostname,headers:r.headers};
    current=next;continue;
   }
   const body=(await r.text()).slice(0,200000);
   return {status:r.status,body,host:current.hostname,headers:r.headers};
  }
  return {status:310,body:'',host:expectedHost,headers:new Headers()};
 }catch(e){
  return {status:0,body:'',host:expectedHost,headers:new Headers(),error:(e?.cause?.code||e?.code||e?.message||'network error').toString().slice(0,100)};
 }
}
function cleanWorkerUrl(s){
 try{const u=new URL(s);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||u.pathname!=='/'||!/^[-a-z0-9]+\.[-a-z0-9]+\.workers\.dev$/.test(u.hostname))return null;return u.href}catch{return null}
}
export function ownedWorkerMatches(scriptNames,accountSubdomain,permanentUrl){
 const origin=cleanWorkerUrl(permanentUrl||'');
 if(!origin||!Array.isArray(scriptNames)||typeof accountSubdomain!=='string')return false;
 const expected='makhex.'+accountSubdomain.toLowerCase()+'.workers.dev';
 return scriptNames.includes('makhex')&&new URL(origin).hostname===expected;
}
async function nameServers(){
 try{return (await resolveNs(DOMAIN)).map(s=>s.toLowerCase().replace(/\.$/,'')).sort()}catch(e){
  if(process.platform==='win32'){
   try{
    const powershell='Resolve-DnsName -Name makhex.com -Type NS -ErrorAction Stop | Where-Object { $_.Type -eq "NS" } | Select-Object -ExpandProperty NameHost';
    return execFileSync('powershell.exe',['-NoProfile','-Command',powershell],{encoding:'utf8',timeout:12000,windowsHide:true}).trim().split(/\r?\n/).filter(Boolean).map(s=>s.trim().toLowerCase().replace(/\.$/,'')).sort();
   }catch{}
  }
  return [];
 }
}
function append(checks,id,status,detail,stage){checks.push({id,status,detail,stage});}
export async function runAudit(env=process.env){
 const checks=[];
 const cfAccount=env.CLOUDFLARE_ACCOUNT_ID?.trim();
 const cfToken=env.CLOUDFLARE_API_TOKEN?.trim();
 let cloudflareReady=false;
 let workerNames=[];
 let workerSubdomain=null;
 if(!cfAccount||!cfToken){
  append(checks,'cloudflareAccount','BLOCKED','Permanent Cloudflare account ID and scoped API token are not configured. Claim/connect a permanent account first.','website');
 }else{
  try{
   const api=await fetch('https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(cfAccount)+'/workers/scripts',
    {headers:{Authorization:'Bearer '+cfToken},signal:AbortSignal.timeout(12500)});
   cloudflareReady=api.status===200;
   if(cloudflareReady){
    const listing=await api.json();
    workerNames=Array.isArray(listing.result)?listing.result.map(x=>x.id).filter(Boolean):[];
    try{
     const sub=await fetch('https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(cfAccount)+'/workers/subdomain',
      {headers:{Authorization:'Bearer '+cfToken},signal:AbortSignal.timeout(12500)});
     if(sub.status===200){
      const obj=await sub.json();
      workerSubdomain=obj?.result?.subdomain||null;
     }
    }catch{}
   }
   append(checks,'cloudflareAccount',cloudflareReady?'PASS':'BLOCKED',cloudflareReady?'Account-scoped Workers token authenticated':'Cloudflare Workers API rejected token or account (HTTP '+api.status+')','website');
  }catch(e){append(checks,'cloudflareAccount','BLOCKED','Cloudflare Workers API verification unavailable: '+(e?.cause?.code||e?.message||'network error'),'website')}
 }
 const permanent=cleanWorkerUrl(env.MAKHEX_PERMANENT_WORKER_URL||OWNED_WORKER);
 const owned=cloudflareReady&&ownedWorkerMatches(workerNames,workerSubdomain,permanent);
 append(checks,'workerOwnership',owned?'PASS':'BLOCKED',owned?'The MAKHEX Worker name and workers.dev hostname match this authenticated account':'No verified MAKHEX worker hostname belonging to the authenticated permanent account','website');
 if(!permanent){
  append(checks,'permanentWorker','BLOCKED','No owned permanent workers.dev production origin configured. Temporary --temporary deployments do not count.','website');
 }else{
  const site=await getResponse(permanent,new URL(permanent).hostname);
  const result=classifyHttp(site.status,site.body,site.host,new URL(permanent).hostname);
  append(checks,'permanentWorker',result.status,result.detail,'website');
 }
 // The former temporary preview expired; the permanent owned Worker is the source of truth.
 // Do not make DNS readiness depend on any --temporary deployment.
 const pipelineReady=env.CLOUDFLARE_DEPLOY_ENABLED==='true'&&env.CLOUDFLARE_TOKEN_SCOPE_APPROVED==='true'&&Boolean(cfAccount&&cfToken);
 append(checks,'githubDeployment',pipelineReady?'PASS':'BLOCKED',pipelineReady?'Deployment, credential presence and independent least-privilege review all enabled':'GitHub deployment requires credentials, enabled flag and reviewed worker-scoped token; unverified broad tokens cannot pass.','website');
 const sq=await getResponse('https://'+SHOP+'/',SHOP);
 const shopResult=classifyHttp(sq.status,sq.body,sq.host,SHOP);
 append(checks,'shopPublic',shopResult.status,shopResult.status==='BLOCKED'&&sq.error?'Shop host not publicly reachable: '+sq.error:shopResult.detail,'website');
 const apex=await getResponse('https://'+DOMAIN+'/',DOMAIN);
 const apexResult=classifyHttp(apex.status,apex.body,apex.host,DOMAIN);
 append(checks,'apexLive',apexResult.status,apexResult.status==='BLOCKED'&&apex.error?'Apex not publicly reachable: '+apex.error:apexResult.detail,'live');
 const names=await nameServers();
 const isCF=names.length===2&&names.every(n=>n.endsWith('.ns.cloudflare.com'));
 append(checks,'cloudflareDelegation',isCF?'PASS':'BLOCKED',names.length?'Currently delegated to '+(isCF?'Cloudflare':names.join(', ')):'Unable to verify public nameservers','live');
 const att=JSON.parse(readFileSync(EVIDENCE_PATH,'utf8'));
 for(const key of ['dnsZoneExport','cloudflareZoneRecordCopy','squarespaceShopPrimary','dnsRollbackPlan']){
  const good=attestationValid(att[key]);
  append(checks,key,good?'PASS':'BLOCKED',good?'Dated reviewer evidence recorded in GitHub issue/PR':'Owner evidence of '+key+' is not recorded; do not change nameservers','website');
 }
 const approved=Object.entries(checkoutApprovals).filter(([slug,a])=>{
   const p=products.find(p=>p.slug===slug);
   return p?.status==='Qualified'&&p.storePath===a.publicPath&&a.provider==='squarespace'&&
     a.supplierVariantVerified===true&&a.shippingAndReturnsVerified===true&&a.checkoutAndFulfillmentTested===true&&
     Boolean(a.merchantSku)&&Number.isFinite(Date.parse(a.checkedAt))&&
     /^https:\/\/github\.com\/polygoku\/makhex\/(?:issues|pull)\/\d+$/.test(a.evidenceIssueUrl);
 }).length;
 append(checks,'qualifiedCheckout',approved>0?'PASS':'BLOCKED',approved>0?approved+' product(s) with recorded checkout qualification':'No supplier-verified Squarespace product with completed fulfillment test; checkout remains disabled','commerce');
 const precutoverIds=['cloudflareAccount','workerOwnership','permanentWorker','githubDeployment','shopPublic','dnsZoneExport','cloudflareZoneRecordCopy','squarespaceShopPrimary','dnsRollbackPlan'];
 const siteLiveIds=[...precutoverIds,'apexLive','cloudflareDelegation'];
 const commerceIds=['shopPublic','qualifiedCheckout'];
 const audit={
  checkedAt:new Date().toISOString(),
  target:{makerSite:'https://'+DOMAIN+'/',commerceSite:'https://'+SHOP+'/',ownedWorker:permanent},
  preCutover:summarizeChecks(checks,precutoverIds),
  siteLive:summarizeChecks(checks,siteLiveIds),
  commerce:summarizeChecks(checks,commerceIds),
  checks
 };
 return audit;
}
async function main(){
 const idx=process.argv.indexOf('--output');
 const output=idx>=0?process.argv[idx+1]:'reports/sprint05-launch-audit.json';
 if(!output||output.startsWith('-'))throw Error('Invalid --output path');
 const audit=await runAudit();
 mkdirSync(dirname(output),{recursive:true});
 writeFileSync(output,JSON.stringify(audit,null,2)+'\n','utf8');
 console.log('MAKHEX LAUNCH AUDIT '+audit.checkedAt);
 for(const c of audit.checks)console.log(c.status.padEnd(8)+' '+c.id.padEnd(25)+' '+c.detail);
 console.log('PRE-CUTOVER '+(audit.preCutover.ready?'GO':'NO-GO'));
 console.log('SITE LIVE '+(audit.siteLive.ready?'YES':'NO'));
 console.log('COMMERCE '+(audit.commerce.ready?'GO':'HOLD'));
 console.log('Read-only report: '+output);
 if(!audit.preCutover.ready||!audit.siteLive.ready||!audit.commerce.ready)process.exitCode=2;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 main().catch(e=>{console.error('Audit could not complete: '+(e?.message||'error'));process.exitCode=2;});
}
