#!/usr/bin/env node
// READ ONLY. Compare a FULL Squarespace registrar DNS export with a staged Cloudflare
// zone export. Never edits a provider, changes nameservers, or declares checkout ready.
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const DOMAIN='makhex.com';
const REQUIRED_SOURCE='squarespace-registrar-full-zone';
const REQUIRED_TARGET='cloudflare-staged-zone';
const EVIDENCE=/^https:\/\/github\.com\/polygoku\/makhex\/(?:issues|pull)\/\d+$/;

export function fqdn(name){
  const n=String(name??'').trim().toLowerCase().replace(/\.$/,'');
  if(!n||n==='@'||n===DOMAIN)return DOMAIN;
  return n.endsWith('.'+DOMAIN)?n:n+'.'+DOMAIN;
}
export function normalize(record){
  if(!record||typeof record!=='object')throw Error('Invalid record');
  const name=fqdn(record.name);
  const type=String(record.type||'').trim().toUpperCase();
  if(!/^[A-Z0-9]+$/.test(type))throw Error('Invalid DNS type');
  const raw=record.content??record.value??record.data;
  if(raw==null||typeof raw==='object'&&!Array.isArray(raw))throw Error('Missing DNS record content');
  let value=Array.isArray(raw)?raw.join(''):String(raw).trim();
  if(type==='TXT'&&value.startsWith('"')&&value.endsWith('"'))value=value.slice(1,-1);
  if(['CNAME','NS','PTR','DNAME'].includes(type))value=value.toLowerCase().replace(/\.$/,'');
  if(type==='MX'){
    let priority=record.priority??record.data?.priority;
    const m=value.match(/^(\d+)\s+(.+)$/);
    if(priority==null&&m){priority=m[1];value=m[2];}
    if(priority==null)throw Error('MX priority required');
    value=String(Number(priority))+' '+value.toLowerCase().replace(/\.$/,'');
  }
  if(!value||!name.endsWith(DOMAIN))throw Error('Invalid DNS record value or host');
  return {name,type,value,proxied:record.proxied===true};
}
export function validProvenance(snapshot,expected){
  return Boolean(snapshot&&snapshot.domain===DOMAIN&&snapshot.sourceSystem===expected&&
    snapshot.verifiedComplete===true&&Number.isFinite(Date.parse(snapshot.capturedAt||''))&&
    EVIDENCE.test(snapshot.evidenceIssueUrl||'')&&Array.isArray(snapshot.records)&&snapshot.records.length>0);
}
const changeable=(r)=>r.name===DOMAIN&&['A','AAAA','CNAME'].includes(r.type)||
  r.name==='www.'+DOMAIN&&['A','AAAA','CNAME'].includes(r.type);
const key=(r)=>[r.name,r.type,r.value].join('|');
function tally(records){
  const map=new Map();
  for(const r of records)map.set(key(r),(map.get(key(r))||0)+1);
  return map;
}
export function compareSnapshots(source,target){
  const errors=[],warnings=[];
  if(!validProvenance(source,REQUIRED_SOURCE))errors.push('SOURCE_EXPORT_UNVERIFIED');
  if(!validProvenance(target,REQUIRED_TARGET))errors.push('TARGET_EXPORT_UNVERIFIED');
  let left=[],right=[];
  try{left=(source?.records||[]).map(normalize);}catch{errors.push('SOURCE_RECORD_INVALID')}
  try{right=(target?.records||[]).map(normalize);}catch{errors.push('TARGET_RECORD_INVALID')}
  if(errors.length)return {ready:false,errors,warnings,recordsCompared:0,sourceRecordCount:left.length,targetRecordCount:right.length};
  const sourceKeys=tally(left.filter(r=>!changeable(r)&&!(r.name===DOMAIN&&['SOA','NS'].includes(r.type))));
  const targetKeys=tally(right);
  for(const [k,n] of sourceKeys){
    const got=targetKeys.get(k)||0;
    if(got<n){
      const [name,type]=k.split('|');
      errors.push('MISSING_OR_CHANGED '+type+' '+name+' count='+String(n-got));
    }
  }
  const shop=right.filter(r=>r.name==='shop.'+DOMAIN&&['A','AAAA','CNAME'].includes(r.type));
  if(shop.length!==1)errors.push('SHOP_DNS_MUST_HAVE_SINGLE_DESTINATION');
  else{
    if(shop[0].proxied)errors.push('SHOP_DNS_MUST_BE_DNS_ONLY');
    if(shop[0].value.includes(DOMAIN))errors.push('SHOP_DNS_TARGET_MUST_NOT_REDIRECT_TO_APEX');
  }
  if(left.some(r=>r.name===DOMAIN&&r.type==='DS'))warnings.push('DNSSEC_DS_REQUIRES_REGISTRAR_REVIEW');
  warnings.push('CERTIFICATE_MAIL_CHECKOUT_AND_PRIMARY_DOMAIN_REQUIRE_SEPARATE_LIVE_CHECKS');
  return {ready:errors.length===0,errors,warnings,
    recordsCompared:[...sourceKeys.values()].reduce((a,b)=>a+b,0),
    sourceRecordCount:left.length,targetRecordCount:right.length};
}

async function main(){
  const a=process.argv;
  const get=(flag)=>{const i=a.indexOf(flag);return i<0?null:a[i+1]};
  const src=get('--source'),dst=get('--target');
  const out=get('--output')||'reports/dns-cutover-compare.json';
  if(!src||!dst||src.startsWith('-')||dst.startsWith('-')||out.startsWith('-')){
    console.error('Usage: node scripts/dns-cutover-compare.mjs --source reports/squarespace-zone.json --target reports/cloudflare-zone.json [--output reports/dns-cutover-compare.json]');
    process.exitCode=2;return;
  }
  let result;
  try{result=compareSnapshots(JSON.parse(readFileSync(src,'utf8')),JSON.parse(readFileSync(dst,'utf8')));}
  catch(e){console.error('NO-GO: DNS exports unavailable or invalid: '+e.message);process.exitCode=2;return;}
  mkdirSync(dirname(out),{recursive:true});
  writeFileSync(out,JSON.stringify({checkedAt:new Date().toISOString(),...result},null,2)+'\n');
  console.log('DNS CUTOVER COMPARISON '+(result.ready?'STRUCTURALLY MATCHED':'NO-GO'));
  for(const err of result.errors)console.log('BLOCKED '+err);
  for(const warn of result.warnings)console.log('NOTE '+warn);
  console.log('Checked '+result.recordsCompared+' pre-existing non-cutover records. No DNS writes performed.');
  if(!result.ready)process.exitCode=2;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  main().catch(e=>{console.error('NO-GO: '+e.message);process.exitCode=2;});
}