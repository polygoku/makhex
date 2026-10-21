import {resolve4,resolveCname,resolveMx,resolveTxt,resolveNs} from 'node:dns/promises';
import {writeFileSync,mkdirSync} from 'node:fs';
const names=['makhex.com','www.makhex.com','shop.makhex.com'];
const types=[['A',resolve4],['CNAME',resolveCname],['MX',resolveMx],['TXT',resolveTxt],['NS',resolveNs]];
const results={checkedAt:new Date().toISOString(),names:{}};
for(const hostname of names){
 const item={};
 for(const [type,run] of types){try{item[type]=await run(hostname)}catch(e){item[type]=e.code||'NOT_FOUND'}}
 results.names[hostname]=item;
 console.log(hostname,JSON.stringify(item));
}
mkdirSync('reports',{recursive:true});
writeFileSync('reports/domain-readiness.json',JSON.stringify(results,null,2)+'\n');
const errors=Object.values(results.names).flatMap(record=>Object.values(record)).filter(v=>typeof v==='string' && !['ENODATA','ENOTFOUND','ESERVFAIL','ENODOMAIN'].includes(v));
if(errors.length){console.error('DNS query transport failed; snapshot is NOT a trustworthy record of production DNS. Use Windows Resolve-DnsName or a provider DNS export.');process.exitCode=1;}
else console.log('Read-only DNS snapshot saved. Validate against registrar zone export before DNS changes.');
