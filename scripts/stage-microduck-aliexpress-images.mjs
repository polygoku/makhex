/** One-time source media ingest for exact AliExpress variants observed 2026-10-28.
 * The 16 existing Squarespace-imported photos are never overwritten.
 * Source images are listing references, not independently photographed stock.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const sources=[
 ['feetech-hd1910','Sb79259caa1104ccd940e288d2a85b2b7I','15 x Servo','3256813219512604'],
 ['imx219-160-camera','S43fb7e4a82194523a194a0638642b121J','160 Degree','3256807416958346'],
 ['vl53l5cx-v2','S9508c9a8366146e79a23fa05dfe50684b','VL53L5X V2','3256807375986018'],
 ['npf550-power-kit','Hf50fc17937bd4eccab9875f0db3a5a7dd','2Pcs set','2255800740884834'],
 ['bearing-6700','S3ca5028153e542469ed2b2ea745f91553','S6700W3-OPEN 10x15x3','3256807024557318'],
 ['bearing-et2216','S3371a95958894f538a89b11e9a15e0b3m','ET2216ZZ 16x22x4 10-pack','3256804482667678'],
 ['bearing-623zz','S7b437aa8ebe548db89cc10395238775c7','623ZZ 3x10x4 10-pack listing; catalog thumbnail may show multiple sizes','3256805794598678']
];
const sourceHost='https://ae-pic-a1.aliexpress-media.com/kf/';
for(const [slug,pictureId,variant,item] of sources){
 const src=sourceHost+pictureId+'.jpg';
 const r=await fetch(src,{signal:AbortSignal.timeout(18000),headers:{'user-agent':'Mozilla/5.0','accept':'image/jpeg,image/*;q=0.9'}});
 if(!r.ok)throw Error('Source photo failed '+slug+' HTTP '+r.status);
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length<3500||bytes.length>6500000)throw Error('Image size invalid '+slug);
 const m=await sharp(bytes).metadata();
 if(m.width<220||m.height<220)throw Error('Too small '+slug);
 const out=path.join('public','product-media',slug+'.jpg');
 await sharp(bytes).rotate().resize(900,900,{fit:'contain',background:'#ffffff',withoutEnlargement:true}).jpeg({quality:85}).toFile(out+'.tmp.jpg');
 const o=await fs.readFile(out+'.tmp.jpg');
 if(o[0]!==0xff||o[1]!==0xd8||o.length<4000)throw Error('Invalid output '+slug);
 await fs.rename(out+'.tmp.jpg',out);
 console.log('SOURCE_IMAGE',slug,item,variant,'width',m.width,'height',m.height,'bytes',o.length);
}
