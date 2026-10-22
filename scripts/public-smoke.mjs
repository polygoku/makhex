#!/usr/bin/env node
// Read-only public deploy smoke test. Does not attempt a purchase or change DNS.
const baseRaw=process.argv[2]||'http://127.0.0.1:4321';
let origin;
try {
  const input=new URL(baseRaw);
  const safeHosts=['makhex.com','www.makhex.com','127.0.0.1','localhost'];
  const validHost=safeHosts.includes(input.hostname)||/^[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev$/.test(input.hostname);
  if(!validHost||!['https:','http:'].includes(input.protocol)||input.username||input.password||input.search||input.hash||input.pathname!=='/'){
    throw new Error('Unsupported or non-root URL');
  }
  if(input.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(input.hostname))throw new Error('HTTPS required');
  origin=input.origin;
}catch(e){console.error('Invalid smoke target: '+e.message);process.exit(2)}
const local=/localhost|127\.0\.0\.1/.test(origin);
const checks=[
  {path:'/',contains:'class="site-header"'},
  {path:'/projects/',contains:'id="projects-grid"'},
  {path:'/shop/',contains:'id="catalog-grid"'},
  {path:'/community/',contains:'id="thread-heading"'},
  {path:'/shop/esp32-s3-devkit/',contains:'Coming soon'},
  {path:'/projects/touch-weather-station/',contains:'DOWNLOAD BOM CSV'},
  {path:'/projects/touch-weather-station.csv',contains:'RESEARCH ONLY'},
  {path:'/robots.txt',contains:'makhex.com/sitemap-index.xml'},
  {path:'/sitemap-index.xml',contains:'sitemap'},
];
let failures=0;
for(const check of checks){
 const url=origin+check.path;
 try{
  const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(15000),headers:{'User-Agent':'MAKHEX-release-smoke/1.0'}});
  const body=await response.text();
  const challenge=response.status===403&&(/just a moment|challenge-platform/i.test(body)||response.headers.get('cf-mitigated')==='challenge');
  const ok=response.status===200&&!challenge&&body.includes(check.contains);
  let detail=ok?'PASS':challenge?'CLOUDFLARE_CHALLENGE':response.status===401?'ACCESS_DENIED':('HTTP_'+response.status+' or content mismatch');
  if(!local&&ok&&check.path==='/'){
    const csp=response.headers.get('content-security-policy');
    const noSniff=response.headers.get('x-content-type-options');
    if(!csp||noSniff!=='nosniff'){detail='SECURITY_HEADERS_MISSING';}
  }
  if(detail!=='PASS')failures++;
  console.log(detail+' '+check.path);
 }catch(e){failures++;console.log('UNREACHABLE '+check.path+' '+e.message)}
}
if(failures){console.error('BLOCKED: '+failures+' public checks failed. Do not switch DNS or enable commerce.');process.exit(1)}
console.log('PASS: public smoke test. Separate Squarespace checkout validation is still required.');
