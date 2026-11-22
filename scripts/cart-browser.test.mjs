import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const root=process.env.MAKHEX_PREVIEW_URL??'http://127.0.0.1:4399';
const chrome=process.env.CHROME_BIN??'/usr/bin/google-chrome';
const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const readCart=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('makhex-parts-cart-v1')||'[]'));
const waitLines=count=>page.waitForFunction(n=>{
 try{return JSON.parse(localStorage.getItem('makhex-parts-cart-v1')||'[]').length===n}catch{return false}
},count,{timeout:12000});
try{
 const source=await (await page.goto(root+'/projects/mosaico-learning-assistant/',{waitUntil:'domcontentloaded'})).status();
 assert.equal(source,200);
 assert.equal(await page.locator('.project-demo-local video').count(),1,'Mosaico media must remain present');
 assert.equal(await page.locator('[data-cart-add-all="mosaico-learning-assistant"]').count(),1,'Mosaico complete kit uses MAKHEX request');
 assert.equal(await page.locator('[data-cart-add-plan="mosaico-learning-assistant"]').count(),1,'Mosaico separate-module option remains accessible');
 await page.locator('[data-cart-add-all="mosaico-learning-assistant"]').first().click();
 await waitLines(2);
 assert.deepEqual((await readCart()).map(p=>p.slug).sort(),['esp-mosaico-vision-combo-kit','usb-c-data-cable'].sort(),'Mosaico cart includes bundle and data cable');
 await page.locator('[data-cart-add-plan="mosaico-learning-assistant"]').first().click();
 await waitLines(4);
 const separate=await readCart();
 assert(separate.some(p=>p.slug==='esp-mosaico-core-unit')&&!separate.some(p=>p.slug==='esp-mosaico-vision-combo-kit'),'Independent module request must replace bundle, not duplicate components');

 await page.goto(root+'/shop/esp32-s3-devkit/',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('[data-cart-add]').count(),1,'Former external-only SKU is now MAKHEX requestable');
 assert.match(await page.locator('.clean-product-price').innerText(),/Price on request/);
 assert.match(await page.locator('.qualification-pill').innerText(),/No charge until approved/);
 assert.equal(await page.locator('details.supplier-last-resort').count(),1,'Supplier is explicitly last-resort, not primary checkout');
 assert.doesNotMatch(await page.locator('body').innerText(),/\bmarkup\b|20\s*%/i);

 await page.goto(root+'/shop/feetech-hd1910/',{waitUntil:'domcontentloaded'});
 assert.match(await page.locator('.clean-product-price').innerText(),/^\$34\.33$/,'Planning retail amount is customer-facing, not supplier markup');
 assert.doesNotMatch(await page.locator('body').innerText(),/\bmarkup\b|20\s*%/i);

 await page.goto(root+'/projects/microduck-robot/',{waitUntil:'domcontentloaded'});
 const project=(await page.evaluate(async()=> (await(await fetch('/sourcing.json')).json()).projects.find(p=>p.slug==='microduck-robot')));
 assert(project);
 const expected=project.cartPlan?.parts??project.parts;
 assert.equal(expected.length,13);
 assert.equal(await page.locator('a[href="/members/microduck-designs/"]').count()>0,true,'Authorized CAD stays in gated design section');
 assert.equal(await page.locator('[data-bom-mode="MAKHEX_REQUEST"]').count(),13,'Every physical BOM line requests from MAKHEX');
 assert.equal(await page.locator('[data-bom-mode="EXTERNAL_LINK"]').count(),0);
 assert.equal(await page.locator('[data-bom-mode] a[href="/shop/microduck-printed-parts/"]').count(),0,'No standalone paid STL listing');
 assert.equal(await page.locator('[data-assembly-select]').count(),13,'Every BOM part appears in 3D component index');
 assert.equal(await page.locator('[data-cart-add-all="microduck-robot"]').count(),1);
 await page.locator('[data-cart-add-all="microduck-robot"]').click();
 await waitLines(17); // This adds Microduck to the previously tested 4-item Mosaico list.
 const mixed=await readCart();
 assert.equal(mixed.filter(p=>p.project==='microduck-robot').length,13);
 assert(mixed.some(p=>p.slug==='microduck-hat')&&mixed.some(p=>p.slug==='microduck-imu'));

 // Clean basket for isolated complete Microduck checkout test.
 await page.goto(root+'/cart/',{waitUntil:'domcontentloaded'});
 await page.locator('[data-cart-clear]').click();
 await waitLines(0);
 await page.goto(root+'/projects/microduck-robot/',{waitUntil:'domcontentloaded'});
 await page.locator('[data-cart-add-all="microduck-robot"]').click();
 await waitLines(13);
 const original=await readCart(),units=original.reduce((n,p)=>n+p.quantity,0);
 assert.deepEqual(original.map(p=>p.slug).sort(),expected.map(p=>p.slug).sort());
 assert.equal(units,expected.reduce((n,p)=>n+p.qty,0),'Every qty must be retained, not only unique SKUs');

 await page.goto(root+'/cart/',{waitUntil:'domcontentloaded'});
 await page.locator('.cart-line').first().waitFor();
 assert.equal(await page.locator('.cart-line').count(),13);
 const rows=await page.locator('.cart-lines').innerText();
 assert.match(rows,/Microduck HAT/i);
 assert.match(rows,/IMU/i);
 assert.doesNotMatch(rows,/\bmarkup\b|20\s*%|MAKHEX plan|printed-parts/i,'No secret pricing or sold STL item');
 assert.equal(await page.locator('a[href="/checkout/"].cart-checkout').count(),1);
 assert.match(await page.locator('.cart-checkout').innerText(),/SUBMIT MAKHEX ORDER REQUEST/);

 // Legacy cart must discard standalone STL and normalize obsolete option labels.
 await page.evaluate(()=>{
  const key='makhex-parts-cart-v1',items=JSON.parse(localStorage.getItem(key));
  items.push({slug:'microduck-printed-parts',option:'Print at home',quantity:1,project:'microduck-robot'});
  items.push({slug:'microduck-hat',option:'Original Oct 15 AMP2.0 HAT, assembled / made to order',quantity:1,project:'microduck-robot'});
  localStorage.setItem(key,JSON.stringify(items));
 });
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('.cart-line').first().waitFor();
 await waitLines(13);
 const migrated=await readCart();
 assert(!migrated.some(p=>p.slug==='microduck-printed-parts'));
 assert(migrated.some(p=>p.slug==='microduck-hat'&&p.option==='Option pending'));
 assert.equal(migrated.filter(p=>p.slug==='microduck-hat').length,1);
 assert.equal(migrated.find(p=>p.slug==='microduck-hat').quantity,original.find(p=>p.slug==='microduck-hat').quantity+1,'Legacy HAT quantity normalized, not silently lost');

 await page.goto(root+'/checkout/',{waitUntil:'domcontentloaded'});
 await page.locator('.checkout-item').first().waitFor();
 assert.equal(await page.locator('.checkout-item').count(),13);
 assert.equal(await page.locator('#makhex-order-request-form').count(),1);
 assert.doesNotMatch(await page.locator('body').innerText(),/\bmarkup\b|20\s*%|MAKHEX plan/i);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 assert(overflow<=4,'390px mobile horizontal overflow '+overflow);

 await page.route('**/api/v1/community/config',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({turnstileSiteKey:'test-site-key'})}));
 await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',route=>route.fulfill({status:200,contentType:'application/javascript',body:'window.turnstile={render:(el,cfg)=>{setTimeout(()=>cfg.callback("test-human-token"),0);return 7},reset:()=>{}};'}));
 let recorded=null;
 await page.route('**/api/v1/checkout/requests',async route=>{
  recorded=route.request().postDataJSON();
  await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({orderId:'MKX-ABCDEF12',accessToken:'mkxo_'+'a'.repeat(43),status:'PENDING_REVIEW',statusUrl:'/checkout/status/#mkxo_'+'a'.repeat(43)})});
 });
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('.checkout-item').first().waitFor();
 await page.locator('[name=email]').fill('buyer@example.com');
 await page.locator('[name=shippingState]').selectOption('NY');
 await page.locator('[name=shippingZip]').fill('11021');
 await page.locator('[name=acceptTerms]').check();
 await page.waitForFunction(()=>!document.querySelector('#makhex-order-request-form [type=submit]').disabled,{timeout:14000});
 await page.locator('#makhex-order-request-form [type=submit]').click();
 await page.locator('#makhex-checkout-success').waitFor({state:'visible'});
 assert.equal(recorded.lines.length,13);
 assert(recorded.lines.some(p=>p.slug==='microduck-hat')&&recorded.lines.some(p=>p.slug==='microduck-imu'));
 assert(!recorded.lines.some(p=>p.slug==='microduck-printed-parts'));
 assert.equal(recorded.lines.find(p=>p.slug==='feetech-hd1910').quantity,15);
 assert.match(await page.locator('#makhex-checkout-success').innerText(),/No charge has been made/);
 assert.equal(errors.length,0,errors.join('; '));
 console.log('PASS: all 13 Microduck BOM types, Mosaico complete/alternate requests, external fallback, legacy cart normalization, mobile, no payment');
}finally{await context.close();await browser.close()}
