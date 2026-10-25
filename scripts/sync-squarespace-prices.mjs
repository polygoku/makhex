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
export function syncSource(source,priceMap,snapshot){
 const updated=source.replace(/export const catalogSnapshotDate='[^']+';/,
   "export const catalogSnapshotDate='"+snapshot+"';");
 let result=updated,changed=0;
 for(const [slug,values] of Object.entries(priceMap)){
   const anchor="'"+slug+"':{";
   const begin=result.indexOf(anchor);
   if(begin<0)throw Error('Missing staged product '+slug);
   const end=result.indexOf('\n',begin);
   if(end<0)throw Error('Bad product stage '+slug);
   let segment=result.slice(begin,end),index=0;
   segment=segment.replace(/plannedRetailUsd:\s*\d+(?:\.\d+)?/g,()=>{
      if(index>=values.length)throw Error('Too many staged options '+slug);
      return 'plannedRetailUsd:'+values[index++];
   });
   if(index!==values.length)throw Error('Option count mismatch '+slug+' '+index+' vs '+values.length);
   result=result.slice(0,begin)+segment+result.slice(end+1);
   changed++;
 }
 if(changed!==Object.keys(mapping).length)throw Error('Incomplete price sync');
 return result;
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
