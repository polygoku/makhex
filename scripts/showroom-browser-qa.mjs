// Live DOM/browser QA using local dev server and installed Chrome (no fixture purchases).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright-core';
const root='http://localhost:4322';
const browsers=['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'];
const bin=browsers.find(p=>fs.existsSync(p));
if(!bin)throw Error('Chrome/Edge not installed for visual QA');
const snapshots=path.resolve('reports','showroom-qa-20261122');
fs.mkdirSync(snapshots,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:bin,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
const cases=[
 {slug:'microduck-robot',width:1440,height:900},
 {slug:'microduck-robot',width:375,height:812},
 {slug:'microduck-robot',width:320,height:740},
 {slug:'atomdog-quadruped-robot',width:390,height:844},
 {slug:'mosaico-learning-assistant',width:1280,height:800},
 {slug:'touch-weather-station',width:390,height:844}
];
try{
 for(const item of cases){
  const context=await browser.newContext({viewport:{width:item.width,height:item.height},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=root+'/projects/'+item.slug+'/';
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
  assert.equal(response?.status(),200,'Project route should load '+url);
  await page.locator('#assembly-explorer').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('[data-assembly-viewer] canvas')||document.querySelector('[data-assembly-status]')?.textContent?.includes('unavailable'),undefined,{timeout:8000});
  assert(await page.locator('[data-assembly-viewer] canvas').count(),'Three.js must render a live canvas with WebGL available at '+item.width+'px');
  const partCount=await page.locator('[data-assembly-select]').count();
  const bundle=await page.evaluate(async slug=>(await (await fetch('/sourcing.json')).json()).projects.find(p=>p.slug===slug),item.slug);
  assert.equal(partCount,bundle.parts.length,'All BOM parts must have 3D mapped hotspots');
  assert.equal(await page.locator('[data-assembly-viewer]').count(),1);
  await page.locator('[data-assembly-select]').last().click();
  assert.equal(await page.locator('[data-assembly-select][aria-pressed="true"]').count(),1);
  const status=await page.locator('[data-assembly-status]').innerText();
  assert(status.includes('request')||status.includes('view'),'3D map must explain request status');
  await page.screenshot({path:path.join(snapshots,item.slug+'-'+item.width+'.png'),fullPage:true,animations:'disabled'});
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth}));
  assert(layout.scrollWidth<=layout.width+3,'Horizontal overflow on '+item.slug+' '+item.width+'px: '+JSON.stringify(layout));
  assert(errors.length===0,'Uncaught browser errors: '+JSON.stringify(errors));
  const button=page.locator('[data-cart-add-all="'+item.slug+'"]').first();
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await page.waitForTimeout(250);
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('makhex-parts-cart-v1')||'[]'));
  const expected=bundle.cartPlan?.parts||bundle.parts;
  assert.equal(stored.length,expected.length,'One-click kit must include all physical BOM types '+item.slug+': '+JSON.stringify(stored));
  if(item.slug==='mosaico-learning-assistant')assert(stored.some(p=>p.slug==='usb-c-data-cable'),'Mosaico needs a requestable data cable');
  if(item.slug==='microduck-robot'){
   assert(stored.some(p=>p.slug==='microduck-hat')&&stored.some(p=>p.slug==='microduck-imu'),'Microduck HAT and IMU must enter same MAKHEX cart');
  }
  await page.goto(root+'/cart/',{waitUntil:'domcontentloaded',timeout:20000});
  await page.waitForTimeout(150);
  assert(await page.locator('[data-cart-lines]').count(),'MAKHEX cart must render after Add All');
  console.log('PASS browser',item.slug,item.width+'px',partCount+' parts','3D:',await page.locator('canvas').count(),'cart:',stored.length);
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:375,height:812}});
 const page=await context.newPage();
 await page.goto(root+'/shop/esp32-s3-devkit/',{waitUntil:'domcontentloaded'});
 assert((await page.locator('.clean-product-price').innerText()).includes('Price on request'));
 assert((await page.locator('.qualification-pill').innerText()).includes('No charge until approved'));
 await page.locator('[data-cart-add]').first().click();
 await page.waitForFunction(()=>{try{return JSON.parse(localStorage.getItem('makhex-parts-cart-v1')||'[]').length===1}catch{return false}},undefined,{timeout:6000});
 const cart=await page.evaluate(()=>JSON.parse(localStorage.getItem('makhex-parts-cart-v1')||'[]'));
 assert.equal(cart.length,1);
 await page.goto(root+'/ops/metrics/',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#funnel-report-form').count(),1);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 assert(overflow<=3,'Metrics owner form should work on phone');
 await page.screenshot({path:path.join(snapshots,'metrics-owner-375.png'),fullPage:true});
 await context.close();
 console.log('PASS browser: quote-only component and owner dashboard');
}finally{await browser.close()}
