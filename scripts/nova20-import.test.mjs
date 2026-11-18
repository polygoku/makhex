import assert from 'node:assert/strict';
import fs from 'node:fs';
import {test} from 'node:test';
import {projects} from '../src/data/projects.ts';
import {products} from '../src/data/products.ts';
import {isMakhexAliExpress,isMakhexQuoteOnly,isMakhexRequestEligible} from '../src/data/sourcing-policy.ts';
import {checkoutCatalog} from '../worker/checkout-catalog.mjs';
import {checkoutInternals} from '../worker/checkout.mjs';
const slug='esp32-nova20-lidar-scanner';
const partSlugs=['benewake-nova20-lidar','esp32-wroom32-devkit','ssd1306-oled-096','nova20-5pin-harness','regulated-5v-2a-proto-kit','nova20-capacitor-kit','dupont-jumper-20cm-kit'];
const altSlugs=['vl53l5cx-tof-8x8','esp32-wroom32-devkit','ssd1306-oled-096','dupont-jumper-20cm-kit','regulated-5v-2a-proto-kit'];
test('Build 13 source, metadata, firmware, BOM, hero and original maker link are recorded',()=>{
  const p=projects.find(x=>x.slug===slug);
  assert.equal(p?.number,'13');
  assert.deepEqual(p.materials.map(x=>x.slug),partSlugs);
  assert.equal(new Set(p.materials.map(x=>x.slug)).size,7);
  assert(p.caution.includes('NOT a 360-degree'));
  const readme=fs.readFileSync('builds/'+slug+'/README.md','utf8');
  for(const mark of ['cgwaltney','NOVA20','921600','TF-NOVA','UART','5 V','source','frame'])assert(readme.includes(mark),'Missing documentation '+mark);
  assert(fs.existsSync('builds/'+slug+'/firmware/nova20_uart_wifi_demo.ino'));
  assert(fs.statSync('public/demo/nova20/hero.jpg').size>20000);
  const html=fs.readFileSync('dist/projects/'+slug+'/index.html','utf8');
  for(const mark of ['cgwaltney','r8egFYK296M','youtube-nocookie.com','/demo/nova20/hero.jpg','id="video"','data-cart-add-all="'+slug+'"','data-discussion-project="'+slug+'"'])assert(html.includes(mark),'Missing rendered project feature '+mark);
});
test('All seven exact NOVA20 BOM lines require sourcing approval and cannot collect verified charges',()=>{
  assert.equal(projects.length,13);assert.equal(products.length,38);
  const lines=partSlugs.map(x=>({slug:x,quantity:1,option:'Option pending',project:slug}));
  for(const x of partSlugs){
    assert(isMakhexQuoteOnly(x)&&isMakhexRequestEligible(x)&&!isMakhexAliExpress(x));
    assert.equal(checkoutCatalog.parts[x].shopEligible,true);
    assert.equal(checkoutCatalog.parts[x].sellerCheckoutVerified,false);
    assert.deepEqual(checkoutCatalog.parts[x].variants,[]);
    assert.deepEqual(checkoutCatalog.parts[x].plannedRetailCents,[]);
  }
  const result=checkoutInternals.validateLines(lines);
  assert.equal(result.lines.length,7);assert.equal(result.planningSubtotalCents,null);
  assert(result.lines.every(x=>x.requiresExceptionReview));
  assert.equal(checkoutInternals.validateLines([{slug:partSlugs[0],option:'fake purchase',quantity:1,project:slug}]),null);
  assert.equal(checkoutInternals.validateLines([{slug:partSlugs[0],option:'Option pending',quantity:1,project:'microduck-robot'}]),null);
});

test('8x8 alternative has distinct BOM, unpriced checkout and cannot mix incompatible sensors',()=>{
 const alt=altSlugs.map(slug=>({slug,quantity:1,option:'Option pending',project:'esp32-nova20-lidar-scanner'}));
 const request=checkoutInternals.validateLines(alt);
 assert.equal(request?.lines.length,5);
 assert.equal(request.planningSubtotalCents,null);
 assert(request.lines.every(line=>line.requiresExceptionReview));
 assert.equal(checkoutInternals.validateLines([...alt,{slug:'benewake-nova20-lidar',quantity:1,option:'Option pending',project:'esp32-nova20-lidar-scanner'}]),null);
 const html=fs.readFileSync('dist/projects/esp32-nova20-lidar-scanner/index.html','utf8');
 for(const term of ['data-cart-add-plan="esp32-nova20-lidar-scanner-vl53l5cx"','/shop/vl53l5cx-tof-8x8/','Not pin-','VL53L5CX'])assert(html.includes(term),term);
});
