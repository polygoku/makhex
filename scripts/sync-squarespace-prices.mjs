import fs from 'node:fs';
import path from 'node:path';
const mapping={
 'mkx-1005005087160183':'esp32-c6-devkit',
 'mkx-3256803793464226':'esp32-s3-devkit',
 'mkx-1005010676427148':'esp32-c3-supermini',
 'mkx-1005012486756480':'esp32-s3-touch-35',
 'mkx-1005007652717681':'esp32-s3-camera',
 'mkx-1005009183279052':'i2s-mems-mic',
 'mkx-1005012900699543':'i2s-amplifier',
 'mkx-1005001827244148':'bme280-sensor',
 'mkx-1005010268049095':'sgp40-voc',
 'mkx-1005012759142272':'epaper-29',
 'mkx-1005003043547774':'ws2812-leds',
 'mkx-1005008875945838':'usb-c-power-kit',
 'mkx-1005013031140600':'esp-mosaico-vision-combo-kit',
 'mkx-1005010262728927':'speaker-4ohm-3w',
 'mkx-1005010178736825':'momentary-tactile-switch',
 'mkx-1005009680870996':'5v-5a-led-power'
};
export function parseCsv(input){
 let rows=[],row=[],field='',quoted=false;
 for(let i=0;i<input.length;i++){
  const ch=input[i];
  if(ch==='"'){if(quoted&&input[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
  else if(ch===','&&!quoted){row.push(field);field='';}
  else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&input[i+1]==='\n')i++;row.push(field);if(row.some(s=>s.trim()))rows.push(row);row=[];field='';}
  else field+=ch;
 }
 if(quoted)throw Error('Unterminated CSV field');
 if(field||row.length){row.push(field);rows.push(row);}
 return rows;
}
export function reviewedPrices(csv){
 const rows=parseCsv(csv);const cols=rows.shift();
 const required=['Product URL','SKU','Price','Stock','Visible','Option Value 1'];
 for(const c of required)if(!cols.includes(c))throw Error('Missing Squarespace CSV column: '+c);
 const records=rows.map(r=>Object.fromEntries(cols.map((c,i)=>[c,r[i]||''])));
 const result={};
 for(const [storeUrl,slug] of Object.entries(mapping)){
  const matching=[];let active=false;
  for(const r of records){if(r['Product URL'])active=r['Product URL']===storeUrl;if(active)matching.push(r);}
  if(!matching.length)throw Error('No product '+storeUrl);
  const options=matching.filter(r=>r.SKU&&r.Price);
  if(!options.length)throw Error('No priced variant '+storeUrl);
  const prices=options.map(r=>{
    const price=Number(r.Price);
    if(!Number.isFinite(price)||price<=0||price>10000||r.Stock!=='0'||(r.Visible&&r.Visible!=='No'))
      throw Error('Unqualified or invalid catalog row '+storeUrl);
    return Math.round(price*100)/100;
  });
  result[slug]=prices;
 }
 return result;
}
export function syncSource(source, priceMap, snapshot) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(snapshot)) throw Error('Expected ISO snapshot date');
 if(Object.keys(priceMap).length !== Object.keys(mapping).length ||
   Object.keys(priceMap).some(slug => !Object.values(mapping).includes(slug)))
   throw Error('Expected the exact reviewed MAKHEX product mapping');
 const timestamp=/export const catalogSnapshotDate='[^']+';/;
 if(!timestamp.test(source))throw Error('Missing catalog snapshot date');
 const dated=source.replace(timestamp, "export const catalogSnapshotDate='"+snapshot+"';");
 const touched=new Set();
 const lines=dated.split(/\r?\n/).map(line=>{
   const key=line.match(/^\s*'([a-z0-9-]+)':\{supplierModel:/)?.[1];
   if(!key || !Object.hasOwn(priceMap,key))return line;
   if(touched.has(key))throw Error('Duplicate catalog record '+key);
   if((line.match(/supplierModel:/g)||[]).length!==1)
     throw Error('Catalog records must each occupy their own line: '+key);
   const values=priceMap[key];
   if(!Array.isArray(values)||values.length===0||values.some(v=>!Number.isFinite(v)||v<=0||v>10000))
     throw Error('Unqualified price '+key);
   let i=0;
   const changed=line.replace(/plannedRetailUsd:\s*\d+(?:\.\d+)?/g,()=>{
     if(i>=values.length)throw Error('Too many staged options '+key);
     return 'plannedRetailUsd:'+values[i++];
   });
   if(i!==values.length)throw Error('Variant price count mismatch '+key+' '+i+' vs '+values.length);
   touched.add(key);
   return changed;
 });
 if(touched.size!==Object.keys(mapping).length)
   throw Error('Missing catalog records: '+Object.values(mapping).filter(v=>!touched.has(v)).join(', '));
 return lines.join('\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Z]:)/,''))){
 const [csvPath,sourcePath]=process.argv.slice(2);
 if(!csvPath||!sourcePath)throw Error('Usage: node scripts/sync-squarespace-prices.mjs <fresh-export.csv> <catalog-staging.ts>');
 const prices=reviewedPrices(fs.readFileSync(csvPath,'utf8'));
 const original=fs.readFileSync(sourcePath,'utf8');
 const next=syncSource(original,prices,'2026-10-25');
 fs.writeFileSync(sourcePath,next);
 console.log('Synced '+Object.keys(prices).length+' catalog prices from Squarespace export; no supplier costs or IDs written.');
}
