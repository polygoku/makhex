/** One-time provenance-verified supplier listing imagery ingest. No upstream IDs in public web pages.
 * Supplier images are reference-only until specific vendor reuse permission is documented.
 * Run in CI on a trusted branch to stage first-party JPEG assets.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
const sources=[
 ['esp32-s3-devkit','https://ae-pic-a1.aliexpress-media.com/kf/U6d4dac3648e64af89147b9e4d278a20bn.png'],
 ['esp32-c3-supermini','https://ae01.alicdn.com/kf/Sc97f12b2e36b47d081864467a839a33bf.jpg'],
 ['esp32-c6-devkit','https://ae-pic-a1.aliexpress-media.com/kf/Se853349d265c4dfb8d105305377a1e31T.png'],
 ['esp32-s3-touch-35','https://ae01.alicdn.com/kf/Se646c56d6a6540e7a8270539eb9b12b31.jpg'],
 ['esp32-s3-camera','https://ae01.alicdn.com/kf/Sd0d926357d3e4bc0af0cd8266a18e9bf2.jpg'],
 ['i2s-mems-mic','https://ae01.alicdn.com/kf/S1b82a07da54f4812871ee112336a5bf3o.jpg'],
 ['i2s-amplifier','https://ae01.alicdn.com/kf/Sca68740a684741589a3668b0e32c7e1fi.jpg'],
 ['bme280-sensor','https://ae01.alicdn.com/kf/H8679f55dd1d84096ba999bd0e3bc626dn.jpg'],
 ['sgp40-voc','https://ae01.alicdn.com/kf/S78c1bd5b400a479eab0b3c82dc4d6baeg.jpg'],
 ['epaper-29','https://ae01.alicdn.com/kf/Se33a95b18378428cb92a7ef47d260724i.jpg'],
 ['ws2812-leds','https://ae01.alicdn.com/kf/S4ed0f0ff8450480e9ed6b7c9b5e9b5b9j.jpg'],
 ['usb-c-power-kit','https://ae01.alicdn.com/kf/S046e1af07e074290b87e5fec11a5fbfeY.jpg'],
 ['esp-mosaico-vision-combo-kit','https://ae-pic-a1.aliexpress-media.com/kf/Afee80fdd185b42b7874e13c52ab932303.jpg'],
 ['speaker-4ohm-3w','https://ae-pic-a1.aliexpress-media.com/kf/Sdd8d3d02d1a84b7f862715e31eb4462dc.jpg'],
 ['momentary-tactile-switch','https://ae-pic-a1.aliexpress-media.com/kf/S4b88e23326b84d9089eca39b3de77d3bq.jpg'],
 ['5v-5a-led-power','https://ae-pic-a1.aliexpress-media.com/kf/S5e5eda7658674f4eba4934569cef2ac9m.jpg']
];
const out=path.resolve('public/product-media'), hosts=new Set(['ae01.alicdn.com','ae-pic-a1.aliexpress-media.com']);
await fs.mkdir(out,{recursive:true});
if(sources.length!==16)throw Error('Expected 16 approved research photo candidates');
const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'makhex-media-'));
try{
 for(const [slug,url] of sources){
  if(!/^[a-z0-9-]+$/.test(slug))throw Error('Unexpected component slug');
  const dest=path.join(out,slug+'.jpg');
  try{const bytes=await fs.readFile(dest);if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes.length>4000){console.log('Already staged',slug);continue}}catch{}
  const origin=new URL(url);
  if(origin.protocol!=='https:'||!hosts.has(origin.hostname))throw Error('Rejected upstream photo domain');
  const response=await fetch(origin,{redirect:'follow',signal:AbortSignal.timeout(30000),headers:{Accept:'image/jpeg,image/png,image/webp,image/*;q=.9,*/*;q=.8','User-Agent':'Mozilla/5.0 (compatible; MAKHEXProductMedia/1.0)'}});
  if(!response.ok)throw Error(slug+' HTTP '+response.status);
  const data=Buffer.from(await response.arrayBuffer());
  if(data.length<1000||data.length>8000000)throw Error(slug+' byte-size gate');
  const jpg=data[0]===0xff&&data[1]===0xd8;
  const png=data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const webp=data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP';
  if(!jpg&&!png&&!webp)throw Error(slug+' unexpected image magic');
  const tmpfile=path.join(tmp,slug+(jpg?'.jpg':png?'.png':'.webp'));
  await fs.writeFile(tmpfile,data);
  execFileSync('convert',[tmpfile,'-auto-orient','-background','white','-alpha','remove','-alpha','off','-resize','900x900>','-quality','83',dest],{stdio:'pipe',timeout:40000});
  const produced=await fs.readFile(dest);
  if(produced[0]!==0xff||produced[1]!==0xd8||produced.length<3000)throw Error(slug+' invalid output');
  console.log('Photo staged',slug,produced.length,'bytes');
 }
}finally{await fs.rm(tmp,{recursive:true,force:true})}
console.log('MAKHEX 16 research photos prepared');
