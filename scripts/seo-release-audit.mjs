// Production-only SEO release verification. Use after the separate deploy gate.
const site='https://makhex.com';
let checked=0,failures=0;
const assert=(ok,name)=>{checked++;console.log((ok?'PASS  ':'FAIL  ')+name);if(!ok)failures++;};
const get=async path=>{
  const response=await fetch(site+path,{signal:AbortSignal.timeout(15000)});
  return {response,body:await response.text()};
};
try{
 const {response:r,body}=await get('/sitemap-0.xml');
 assert(r.status===200,'sitemap-0.xml HTTP 200');
 assert(body.includes(site+'/blog/esp32-project-ideas/'),'new evergreen guide in live sitemap');
 for(const path of ['/account/','/cart/','/checkout/','/checkout/status/','/ops/orders/','/members/microduck-designs/'])
  assert(!body.includes(site+path),'private route excluded from sitemap: '+path);
 const article=await get('/blog/esp32-project-ideas/');
 assert(article.response.status===200,'ESP32 guide HTTP 200');
 assert(article.body.includes('BlogPosting'),'ESP32 article rich context');
 assert(article.body.includes('https://makhex.com/blog/esp32-project-ideas/'),'article canonical');
 const project=await get('/projects/microduck-robot/');
 assert(project.body.includes('TechArticle') && project.body.includes('BreadcrumbList'),'live Microduck schema');
 const product=await get('/shop/esp32-s3-devkit/');
 assert(product.body.includes('TechArticle') && !product.body.includes('"@type":"Offer"'),'live research product has no fake offer');
 const account=await get('/account/');
 assert(account.body.includes('noindex,follow'),'live account noindex,follow');
 const og=await fetch(site+'/og.png',{signal:AbortSignal.timeout(15000)});
 assert(og.status===200 && (og.headers.get('content-type')||'').includes('image/png'),'social OG PNG reachable');
 const home=await get('/');
 assert(home.body.includes('ESP32 Projects, DIY Robotics &amp; Maker Parts'),'homepage SEO title active');
} catch(error) {failures++;console.error('RELEASE CHECK ERROR: '+String(error));}
console.log('SEO release: '+checked+' checks; '+failures+' failures');
if(failures)process.exitCode=1;
