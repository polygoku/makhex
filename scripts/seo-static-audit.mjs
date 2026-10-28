// Read-only verification of generated SEO HTML. Run after: npx astro build.
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const dist=join(root,'dist');
const site='https://makhex.com';
const privatePages=[
 '/account/','/cart/','/checkout/','/checkout/status/',
 '/community/moderate/','/members/microduck-designs/','/ops/orders/','/parts-sources/'
];
const read=(rel)=>readFileSync(join(dist,rel),'utf8');
const xml=read('sitemap-0.xml');
const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
let failures=0;
let checked=0;
let projectCount=0;
let componentCount=0;
const titles=new Map();
function expect(ok,label) {
 checked++;
 if (!ok) {failures++;console.error('FAIL  '+label);}
}
expect(urls.length>=50,'indexable URL inventory (>=50 URLs, including new ESP32 article)');
expect(new Set(urls).size===urls.length,'sitemap URLs are unique');
expect(urls.includes(site+'/blog/esp32-project-ideas/'),'new ESP32 article appears in sitemap');
expect(read('robots.txt').includes('Sitemap: '+site+'/sitemap-index.xml'),'robots points to canonical sitemap');
for(const route of privatePages) {
 expect(!urls.includes(site+route),'private/utility route excluded: '+route);
 const html=read(route.slice(1)+'index.html');
 expect(/name="robots" content="noindex,follow"/.test(html),'noindex tag: '+route);
}
for(const url of urls) {
 expect(url.startsWith(site+'/'),'canonical apex host: '+url);
 const path=new URL(url).pathname;
 const file=path==='/'?'index.html':path.slice(1)+'index.html';
 if(!existsSync(join(dist,file))){expect(false,'missing static route: '+url);continue;}
 const html=read(file);
 const title=(html.match(/<title>([^<]+)<\/title>/)||[])[1]||'';
 const desc=(html.match(/<meta name="description" content="([^"]+)"/)||[])[1]||'';
 const img=(html.match(/<meta property="og:image" content="([^"]+)"/)||[])[1]||'';
 const canonical=(html.match(/<link rel="canonical" href="([^"]+)"/)||[])[1]||'';
 expect(title.length>=12 && title.length<=100,'meaningful title: '+path);
 expect(desc.length>=55 && desc.length<=225,'meaningful description: '+path);
 expect(canonical===url,'canonical URL matches sitemap: '+path);
 expect(/<h1(?:\s|>)/.test(html),'page has H1: '+path);
 expect(img.startsWith(site+'/'),'absolute social image: '+path);
 if(img.startsWith(site+'/')) expect(existsSync(join(dist,new URL(img).pathname.slice(1))),'social image exists: '+path);
 expect(!/name="robots" content="noindex/.test(html),'indexable route not noindexed: '+path);
 if(titles.has(title)) expect(false,'duplicate SEO title: '+path+' and '+titles.get(title));
 else titles.set(title,path);
 if(path.startsWith('/projects/') && path!=='/projects/') {
   projectCount++;
   expect(html.includes('TechArticle'),'project reference schema: '+path);
   expect(html.includes('BreadcrumbList'),'project breadcrumb schema: '+path);
   expect(html.includes('/shop/'),'project links to MAKHEX components: '+path);
   expect(!html.includes('"@type":"HowTo"'),'concept is not labeled as fully tested HowTo: '+path);
 }
 if(path.startsWith('/shop/') && path!=='/shop/') {
   componentCount++;
   expect(html.includes('TechArticle'),'component technical reference: '+path);
   expect(html.includes('BreadcrumbList'),'component breadcrumb: '+path);
   expect(!html.includes('"@type":"Offer"'),'unverified part has no fabricated Offer: '+path);
 }
 if(path==='/blog/esp32-project-ideas/') expect(html.includes('BlogPosting'),'original evergreen guide schema');
}
console.log('SEO static audit: '+checked+' checks, '+urls.length+' indexable URLs, '+projectCount+' project pages, '+componentCount+' components, '+failures+' failures.');
if(failures) process.exitCode=1;
