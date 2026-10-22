import fs from 'node:fs';
import path from 'node:path';
import {projects} from '../src/data/projects.ts';
const out=path.resolve('dist');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const get=(u)=>{const url=u.split(/[?#]/)[0];if(!url)return null;const pathname=decodeURIComponent(url);if(pathname==='/')return path.join(out,'index.html');return path.join(out,pathname,pathname.endsWith('/')?'index.html':'');};
const walk=(dir)=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]):[];
const pages=walk(out).filter(p=>p.endsWith('.html'));
expect(pages.length>=27,'Expected at least 27 generated HTML pages, found '+pages.length);
expect(pages.filter(p=>p.includes(path.sep+'projects'+path.sep)&&p.endsWith('index.html')).length>=11,'Expected 10 project detail pages');
expect(pages.filter(p=>p.includes(path.sep+'shop'+path.sep)&&p.endsWith('index.html')).length>=13,'Expected 12 catalog detail pages');
expect(fs.existsSync(path.join(out,'sitemap-index.xml')),'Sitemap not generated');
expect(fs.existsSync(path.join(out,'robots.txt')),'robots.txt missing');
let links=0;
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
 expect(Boolean(title),'Missing title in '+file);
 expect(html.includes('rel="canonical"'),'Missing canonical in '+file);

 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  const attrs=match[1],body=match[2].trim();
  if(/\btype\s*=\s*["']application\/ld\+json["']/i.test(attrs))continue;
  const src=attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  expect(Boolean(src)||body.length===0,'CSP BLOCK: inline executable JavaScript on '+path.relative(out,file));
  if(src?.startsWith('/'))expect(fs.existsSync(path.join(out,src.slice(1))),'CSP BLOCK: local script asset missing '+src+' on '+path.relative(out,file));
 }
 for(const match of html.matchAll(/href="(\/[^"]*)"/g)){
   const href=match[1];if(href.startsWith('//'))continue;
   const dest=get(href);if(!dest)continue;
   const found=fs.existsSync(dest)||fs.existsSync(dest+path.sep+'index.html');
   expect(found,'Broken internal href '+href+' on '+path.relative(out,file));
   links++;
 }
}
// Featured component labels must remain real accessible links, not inert decoration.
const homeHtml=fs.readFileSync(path.join(out,'index.html'),'utf8');
for(const [tag,href] of [['pin-one','/shop/esp32-s3-devkit/'],['pin-two','/shop/bme280-sensor/']]){
  const linkedTag=new RegExp('<a\\b[^>]*class="[^"]*\\b'+tag+'\\b[^"]*"[^>]*href="'+href.replaceAll('/','\\/')+'"','i');
  expect(linkedTag.test(homeHtml),'Featured '+tag+' must link to '+href);
}
const candidates=pages.filter(f=>/[/\\]shop[/\\][^/\\]+[/\\]index.html$/.test(f));
for(const f of candidates){
 const html=fs.readFileSync(f,'utf8');
 expect(html.includes('CHECKOUT COMING SOON'),'Product incorrectly shows live checkout: '+f);
 expect(!html.includes('VIEW PRODUCT ON SQUARESPACE')&&!html.includes('CHECK OUT AT SQUARESPACE'),'Unverified Squarespace purchase link on '+f);
}
const discussionLinks=JSON.parse(fs.readFileSync('src/data/discussion-links.json','utf8'));
expect(Object.keys(discussionLinks.products).length===12,'Expected 12 component discussions');
expect(Object.keys(discussionLinks.projects).length===10,'Expected 10 project discussions');
let mapped=0;
for(const [type,records] of [['shop',discussionLinks.products],['projects',discussionLinks.projects]]){
 for(const [slug,url] of Object.entries(records)){
  const file=path.join(out,type,slug,'index.html');
  expect(/^https:\/\/github\.com\/polygoku\/makhex\/discussions\/\d+$/.test(url),'Invalid discussion URL for '+slug);
  expect(fs.existsSync(file),'Missing target page for discussion '+slug);
  if(fs.existsSync(file)){
   const html=fs.readFileSync(file,'utf8');
   expect(html.includes('href="'+url+'"'),'Discussion thread not linked on '+type+'/'+slug);
   mapped++;
  }
 }
}
for(const slug of Object.keys(discussionLinks.projects)){const file=path.join(out,'projects',slug+'.csv');expect(fs.existsSync(file),'Missing BOM CSV: '+slug);if(fs.existsSync(file)){const csv=fs.readFileSync(file,'utf8');expect(csv.includes('RESEARCH ONLY'),'Unqualified BOM missing sourcing disclaimer: '+slug);}}
for(const project of projects){
  const file=path.join(out,'projects',project.slug,'index.html');
  if(!fs.existsSync(file))continue;
  const html=fs.readFileSync(file,'utf8');
  expect(html.includes('data-build-checklist'),'Workbench checklist missing: '+project.slug);
  expect(html.includes('data-checklist-progress')&&html.includes('aria-live="polite"'),'Accessible checklist progress missing: '+project.slug);
  expect(html.includes('data-checklist-reset'),'Checklist reset missing: '+project.slug);
  const listed=[...html.matchAll(/data-part-slug="([^"]+)"/g)].map(m=>m[1]).sort();
  const expected=project.materials.map(m=>m.slug).sort();
  expect(JSON.stringify(listed)===JSON.stringify(expected),'Workbench checklist parts do not match BOM: '+project.slug);
}
expect(fs.existsSync(path.join(out,'_headers')),'Cloudflare security headers file not present');
console.log('MAKHEX QA: '+pages.length+' HTML pages, '+links+' internal links, '+candidates.length+' gated catalog pages, '+mapped+' mapped maker discussions, '+Object.keys(discussionLinks.projects).length+' BOM CSV files');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('PASS: generated routes, links, metadata and checkout truth gate');
