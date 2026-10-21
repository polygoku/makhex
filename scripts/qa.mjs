import fs from 'node:fs';
import path from 'node:path';
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
 for(const match of html.matchAll(/href="(\/[^"]*)"/g)){
   const href=match[1];if(href.startsWith('//'))continue;
   const dest=get(href);if(!dest)continue;
   const found=fs.existsSync(dest)||fs.existsSync(dest+path.sep+'index.html');
   expect(found,'Broken internal href '+href+' on '+path.relative(out,file));
   links++;
 }
}
const candidates=pages.filter(f=>/[/\\]shop[/\\][^/\\]+[/\\]index.html$/.test(f));
for(const f of candidates){
 const html=fs.readFileSync(f,'utf8');
 expect(html.includes('CHECKOUT COMING SOON'),'Product incorrectly shows live checkout: '+f);
 expect(!html.includes('CHECK OUT AT SQUARESPACE'),'Unverified checkout link on '+f);
}
console.log('MAKHEX QA: '+pages.length+' HTML pages, '+links+' internal links, '+candidates.length+' gated catalog pages');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('PASS: generated routes, links, metadata and checkout truth gate');
