import test from 'node:test';
import assert from 'node:assert/strict';
import {compareSnapshots,fqdn,normalize,validProvenance} from './dns-cutover-compare.mjs';

const at='2026-10-21T20:00:00Z';
const url='https://github.com/polygoku/makhex/issues/30';
const base=[
 {name:'@',type:'A',content:'198.185.159.144'},
 {name:'www',type:'CNAME',content:'ext-sq.squarespace.com.'},
 {name:'@',type:'HTTPS',content:'1 . alpn="h2" ipv4hint="198.185.159.144"'},
 {name:'shop',type:'CNAME',content:'ext-cust.squarespace.com.'},
 {name:'@',type:'MX',content:'mx.example.test.',priority:10},
 {name:'@',type:'TXT',content:'v=spf1 include:example.test -all'},
 {name:'selector._domainkey',type:'TXT',content:'v=DKIM1; k=rsa; p=AbCdEf'},
 {name:'_dmarc',type:'TXT',content:'v=DMARC1; p=reject'},
 {name:'mail',type:'A',content:'192.0.2.25'},
 {name:'_verify',type:'TXT',content:'ownership-unique-token'}
];
const source=()=>({domain:'makhex.com',sourceSystem:'squarespace-registrar-full-zone',capturedAt:at,evidenceIssueUrl:url,verifiedComplete:true,dnssecParentDsPresent:false,records:structuredClone(base)});
const target=()=>({domain:'makhex.com',sourceSystem:'cloudflare-staged-zone',capturedAt:at,evidenceIssueUrl:url,verifiedComplete:true,records:[
 ...structuredClone(base.slice(4)),
 {name:'@',type:'A',content:'192.0.2.55',proxied:true},
 {name:'www',type:'CNAME',content:'makhex.makhex-labs.workers.dev',proxied:true},
 {name:'shop.makhex.com',type:'CNAME',content:'ext-cust.squarespace.com',proxied:false}
]});
test('normalizes relative and FQDN without corrupting case-sensitive TXT',()=>{
 assert.equal(fqdn('WWW.'),'www.makhex.com');
 assert.equal(normalize({name:'_dmarc',type:'TXT',content:'"p=Reject"'}).value,'p=Reject');
 assert.equal(normalize({name:'@',type:'MX',priority:5,content:'Mx.Example.Test.'}).value,'5 mx.example.test');
});
test('identical preserved records survive intentional apex and www route changes',()=>{
 const res=compareSnapshots(source(),target());
 assert.equal(res.ready,true);
 assert.equal(res.errors.length,0);
 assert.equal(res.recordsCompared,7);
});
test('missing mail, DKIM, verification and TXT fail closed',()=>{
 const t=target();
 t.records=t.records.filter(r=>r.type!=='MX'&&!String(r.name).includes('domainkey')&&r.name!=='_verify');
 const res=compareSnapshots(source(),t);
 assert.equal(res.ready,false);
 assert.ok(res.errors.some(x=>x.includes(' MX ')));
 assert.ok(res.errors.some(x=>x.includes('TXT selector._domainkey')));
 assert.ok(res.errors.some(x=>x.includes('TXT _verify')));
});
test('shop routing must be present and DNS-only',()=>{
 const t=target();t.records=t.records.filter(r=>r.name!=='shop.makhex.com');
 assert.ok(compareSnapshots(source(),t).errors.some(x=>x.startsWith('SHOP_DNS')));
 const t2=target();t2.records.find(r=>r.name==='shop.makhex.com').proxied=true;
 assert.ok(compareSnapshots(source(),t2).errors.includes('SHOP_DNS_MUST_BE_DNS_ONLY'));
});
test('unverified / partial exports never qualify',()=>{
 const s=source();s.verifiedComplete=false;
 assert.ok(compareSnapshots(s,target()).errors.includes('SOURCE_EXPORT_UNVERIFIED'));
 const t=target();t.evidenceIssueUrl='https://example.net/bogus';
 assert.equal(validProvenance(t,'cloudflare-staged-zone'),false);
});
test('duplicate TXT values preserve multiplicity',()=>{
 const s=source();s.records.push({...s.records[5]});
 const r=compareSnapshots(s,target());
 assert.equal(r.ready,false);
 assert.ok(r.errors.some(x=>x.includes('count=1')));
});

test('apex Squarespace HTTPS hints are retired rather than copied',()=>{
  const good=compareSnapshots(source(),target());
  assert.equal(good.ready,true);
  assert.ok(good.warnings.includes('OLD_APEX_HTTPS_SVCB_INTENTIONALLY_RETIRED'));
  const bad=target();
  bad.records.push({name:'@',type:'HTTPS',content:'1 . ipv4hint="198.185.159.144"'});
  assert.ok(compareSnapshots(source(),bad).errors.includes('STALE_SQUARESPACE_APEX_HTTPS_HINTS'));
});
test('pre-cutover Squarespace web DNS remains an explicit blocker',()=>{
  const t=target();
  t.records.find(r=>r.name==='@'&&r.type==='A').content='198.185.159.144';
  t.records.find(r=>r.name==='www'&&r.type==='CNAME').content='ext-sq.squarespace.com';
  const result=compareSnapshots(source(),t);
  assert.equal(result.ready,false);
  assert.ok(result.errors.includes('APEX_STILL_POINTS_TO_OLD_SQUARESPACE_SITE'));
  assert.ok(result.errors.includes('WWW_STILL_POINTS_TO_OLD_SQUARESPACE_SITE'));
});
test('DNSSEC parent DS must be queried and cleared before delegation',()=>{
  const s=source();delete s.dnssecParentDsPresent;
  assert.ok(compareSnapshots(s,target()).errors.includes('PARENT_DNSSEC_DS_NOT_VERIFIED'));
  s.dnssecParentDsPresent=true;
  assert.ok(compareSnapshots(s,target()).errors.includes('PARENT_DNSSEC_DS_ACTIVE'));
});
test('shop must retain Squarespace managed third-party CNAME exactly',()=>{
  const t=target();t.records.find(r=>r.name==='shop.makhex.com').content='ext-sq.squarespace.com';
  const x=compareSnapshots(source(),t);
  assert.equal(x.ready,false);
  assert.ok(x.errors.some(err=>err.includes('CNAME shop.makhex.com')));
});
