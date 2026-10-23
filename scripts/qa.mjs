import fs from 'node:fs';
import path from 'node:path';
import {projects} from '../src/data/projects.ts';
const out=path.resolve('dist');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const get=(u)=>{const url=u.split(/[?#]/)[0];if(!url)return null;const pathname=decodeURIComponent(url);if(pathname==='/')return path.join(out,'index.html');return path.join(out,pathname,pathname.endsWith('/')?'index.html':'');};
const walk=(dir)=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]):[];
const pages=walk(out).filter(p=>p.endsWith('.html'));
expect(pages.length>=31,'Expected at least 31 generated HTML pages, found '+pages.length);
expect(pages.filter(p=>p.includes(path.sep+'projects'+path.sep)&&p.endsWith('index.html')).length >=12,'Expected 11 project detail pages');
expect(pages.filter(p=>p.includes(path.sep+'shop'+path.sep)&&p.endsWith('index.html')).length >=17,'Expected 16 catalog detail pages');
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
// Newest build numbers appear first in the project gallery, homepage cards and hero.
const newestFirst=[...projects].sort((a,b)=>Number(b.number)-Number(a.number));
const expectedBuildNumbers=newestFirst.map(p=>Number(p.number));
const projectGalleryHtml=fs.readFileSync(path.join(out,'projects','index.html'),'utf8');
const renderedNumbers=html=>[...html.matchAll(/class="project-number">BUILD ([0-9]{2})/g)].map(m=>Number(m[1]));
expect(expectedBuildNumbers[0]===11,'Build 11 must be the newest project');
expect(JSON.stringify(renderedNumbers(projectGalleryHtml))===JSON.stringify(expectedBuildNumbers),'Project gallery not ordered 11 down to 01');
const homeHtml=fs.readFileSync(path.join(out,'index.html'),'utf8');
expect(JSON.stringify(renderedNumbers(homeHtml))===JSON.stringify(expectedBuildNumbers.slice(0,3)),'Homepage project cards must show the newest three builds in order');
const latest=newestFirst[0];
expect(homeHtml.includes('BUILD '+latest.number+' / '+String(projects.length).padStart(2,'0')),'Homepage hero still features an outdated build');
expect(homeHtml.includes('id="featured-build-name">'+latest.title.replaceAll('&','&amp;')+'</h2>'),'Homepage hero title does not match newest build');
const leadHref='/shop/'+latest.materials[0].slug+'/';
const linkedTag=new RegExp('<a\\b[^>]*class="[^"]*\\bpin-one\\b[^"]*"[^>]*href="'+leadHref.replaceAll('/','\\/')+'"','i');
expect(linkedTag.test(homeHtml),'Homepage featured part label must link to '+leadHref);
expect(!homeHtml.includes('A little screen. A couple of sensors.'),'Old weather-station hero copy still shown for newer build');

const candidates=pages.filter(f=>/[/\\]shop[/\\][^/\\]+[/\\]index.html$/.test(f));
for(const f of candidates){
 const html=fs.readFileSync(f,'utf8');
 expect(html.includes('Coming soon'),'Product incorrectly shows live checkout: '+f); expect(!/aliexpress/i.test(html),'Supplier link exposed on product: '+f);
 expect(!html.includes('VIEW PRODUCT ON SQUARESPACE')&&!html.includes('CHECK OUT AT SQUARESPACE'),'Unverified Squarespace purchase link on '+f);
}

// Native MAKHEX project discussions replace external GitHub discussions.
let mapped=0;
for(const project of projects){
 const slug=project.slug, f=path.join(out,'projects',slug,'index.html');
 expect(fs.existsSync(f),'Project forum missing: '+slug);
 if(fs.existsSync(f)){
  const html=fs.readFileSync(f,'utf8');
  expect(html.includes('data-discussion-project="'+slug+'"'),'Embedded native forum missing: '+slug);
  expect(html.includes('href="#discussion"'),'Jump to forum missing: '+slug);
  expect(html.includes('src="/scripts/community-discussion.js"'),'Forum script missing: '+slug);
  for(const label of ['Repository license:','Build stage:','OPEN ORIGINAL BUILD + FIRMWARE','Photo source &amp;','Photo optimized for this reference gallery'])
   expect(!html.includes(label),'Verbose photo attribution leaked: '+slug+' '+label);
  mapped++;
 }
 const bom=path.join(out,'projects',slug+'.csv');
 expect(fs.existsSync(bom),'Missing BOM CSV: '+slug);
 if(fs.existsSync(bom))expect(fs.readFileSync(bom,'utf8').includes('Unit price USD'),'BOM pricing missing: '+slug);
}
// Original Mosaico developer attribution stays in GitHub README, not the customer-facing site.
const mosaicoPage=path.join(out,'projects','mosaico-learning-assistant','index.html');
if(fs.existsSync(mosaicoPage)){
 const html=fs.readFileSync(mosaicoPage,'utf8');
 const readable=html.replace(/<[^>]*>/g,' ');
 expect(!/samyeei/i.test(readable),'Mosaico creator credited in visible MAKHEX copy');
 expect(html.includes('WATCH PROJECT DEMO'),'Mosaico original demo link not presented');
 expect(html.includes('PolyForm Noncommercial'),'Mosaico licensing caution missing');
}
const communityHTML=fs.readFileSync(path.join(out,'community','index.html'),'utf8');
for(const project of projects)expect(communityHTML.includes('/projects/'+project.slug+'/#discussion'),'Directory missing local forum: '+project.slug);
const discussionOrder=[...communityHTML.matchAll(/href="\/projects\/([a-z0-9-]+)\/#discussion"/g)].map(m=>m[1]);
expect(JSON.stringify(discussionOrder)===JSON.stringify(newestFirst.map(p=>p.slug)),'Community project list must show newest discussions first');
expect(!communityHTML.includes('OPEN GITHUB DISCUSSIONS'),'Legacy GitHub forum CTA still visible');
for(const f of ['agents/index.html','openapi.json','.well-known/makhex-community.json','llms.txt'])expect(fs.existsSync(path.join(out,f)),'Missing agent resource '+f);
const workerSource=fs.readFileSync(path.resolve('worker/community.mjs'),'utf8');
for(const project of projects)expect(workerSource.includes('"'+project.slug+'"'),'Worker missing native project slug '+project.slug);
const sitemaps=walk(out).filter(f=>/sitemap-[0-9]+[.]xml$/.test(f));
for(const f of sitemaps)expect(!fs.readFileSync(f,'utf8').includes('/community/moderate/'),'Private moderator route appears in sitemap');
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
// MAKHEX editorial: every navigation entry and the first attributed long-form page must be built.
const blogIndexFile=path.join(out,'blog','index.html');
const articleFile=path.join(out,'blog','robotics-engineer-six-month-roadmap','index.html');
expect(fs.existsSync(blogIndexFile),'MAKHEX blog index was not generated');
expect(fs.existsSync(articleFile),'MAKHEX robotics guide was not generated');
if(fs.existsSync(blogIndexFile)){
 const html=fs.readFileSync(blogIndexFile,'utf8');
 expect(html.includes('href="/blog/robotics-engineer-six-month-roadmap/"'),'Blog index missing first article');
}
if(fs.existsSync(articleFile)){
 const html=fs.readFileSync(articleFile,'utf8');
 for(const label of ['Ronin (@DeRonin_)','2026-10-23','application/ld+json','BlogPosting','/projects/espnow-remote/','/shop/','/community/']){
  expect(html.includes(label),'MAKHEX robotics article missing editorial requirement: '+label);
 }
 expect(html.includes('not independently bench-verified kits')||html.includes('not independently bench-verified'),'Unqualified MAKHEX kits misrepresented');
 expect(html.includes('Engineers, All Other'),'O*NET wage category qualification missing');
}
expect(homeHtml.includes('href="/blog/"')&&homeHtml.includes('href="/blog/robotics-engineer-six-month-roadmap/"'),'Homepage or header missing blog entry');
for(const f of sitemaps){
 const xml=fs.readFileSync(f,'utf8');
 if(xml.includes('/blog/')){expect(xml.includes('/blog/robotics-engineer-six-month-roadmap/'),'Blog sitemap missing first post');break;}
}
expect(fs.existsSync(path.join(out,'_headers')),'Cloudflare security headers file not present');
console.log('MAKHEX QA: '+pages.length+' HTML pages, '+links+' internal links, '+candidates.length+' gated catalog pages, '+mapped+' native maker discussions, '+projects.length+' BOM CSV files');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('PASS: generated routes, links, metadata and checkout truth gate');
