import fs from 'node:fs';
import path from 'node:path';
import {projects} from '../src/data/projects.ts';
import {profiles} from './engineering-profiles.mjs';

const root=process.cwd();
const pins=JSON.parse(fs.readFileSync('docs/engineering/upstream-pins.json','utf8')).references;
const designs=JSON.parse(fs.readFileSync('docs/engineering/source-design-index.json','utf8')).results;
const getPin=slug=>pins.find(x=>x.slug===slug);
const getDesign=slug=>designs.find(x=>x.slug===slug);
const idf={tag:'v5.5.6',sha:'880a203ae603d08a94d06aa01e0d6761958e5e9e'};
const extension=/\.(stl|3mf|step|stp|fcstd|epro2|kicad_sch|kicad_pcb|fzz|dxf|scad)$/i;
const outputs=new Map(),tick=String.fromCharCode(96);
const wrap=v=>tick+v+tick;
const csv=rows=>rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
const escapeHtml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const md=s=>String(s).replaceAll('|','\\|').replaceAll('\n',' ');
const link=(label,url)=>'['+label+']('+url+')';
const emit=(name,body)=>outputs.set(name,body);

function wireSvg(p,wires){
  const h=177+wires.length*60,short=(v,n)=>v.length>n?v.slice(0,n-1)+'…':v;
  const parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 '+h+'" width="1160" height="'+h+'">',
  '<rect width="100%" height="100%" fill="#f7f4ea"/><path d="M0 0H1160V7H0Z" fill="#ad6a35"/>',
  '<text x="24" y="42" font-size="25" font-family="Arial,sans-serif" font-weight="bold" fill="#20423b">MAKHEX / '+escapeHtml(p.number)+' '+escapeHtml(p.title)+'</text>',
  '<text x="24" y="72" font-size="17" font-family="Arial,sans-serif" fill="#57675f">Connection REFERENCE, not fabrication or installed-assembly evidence.</text>',
  '<text x="24" y="99" font-size="15" font-family="Arial,sans-serif" fill="#994d2b">Proposed GPIO requires actual PCB revision verification before power-on.</text>',
  '<rect x="22" y="112" width="1116" height="32" fill="#dce6d6"/>',
  '<text x="32" y="133" font-size="14" font-family="Arial,sans-serif" font-weight="bold">FROM</text>',
  '<text x="411" y="133" font-size="14" font-family="Arial,sans-serif" font-weight="bold">TO</text>',
  '<text x="810" y="133" font-size="14" font-family="Arial,sans-serif" font-weight="bold">ELECTRICAL ROLE</text>'];
  wires.forEach((w,i)=>{
    const y=148+i*60;
    parts.push('<rect x="22" y="'+y+'" width="1116" height="59" fill="'+(i%2?'#f7f4ea':'#e9ede5')+'"/>');
    parts.push('<text x="32" y="'+(y+28)+'" font-size="14" font-family="Arial,sans-serif" fill="#24433c">'+escapeHtml(short(w[0],47))+'</text>');
    parts.push('<path d="M333 '+(y+22)+'h55" stroke="#b16e3a" stroke-width="3"/><circle cx="388" cy="'+(y+22)+'" r="4" fill="#b16e3a"/>');
    parts.push('<text x="411" y="'+(y+28)+'" font-size="14" font-family="Arial,sans-serif" fill="#24433c">'+escapeHtml(short(w[1],51))+'</text>');
    parts.push('<text x="810" y="'+(y+28)+'" font-size="13" font-family="Arial,sans-serif" fill="#4b5a53">'+escapeHtml(short(w[2],44))+'</text>');
  });
  parts.push('<text x="24" y="'+(h-14)+'" font-size="13" font-family="Arial,sans-serif" fill="#696b63">See wiring.csv for verification conditions. All actual power, signal and connector pin numbers require measurement.</text></svg>');
  return parts.join('\n')+'\n';
}

for(const p of projects){
  const profile=profiles[p.slug],source=getPin(p.slug),index=getDesign(p.slug);
  if(!profile||!source?.commit||!index)throw Error('Missing profile/source: '+p.slug);
  const dir='builds/'+p.slug+'/engineering/';
  const originalUrl='https://github.com/'+source.repo+'/tree/'+source.commit;
  const files=(index.candidateDesignFiles??[]).filter(a=>extension.test(a.path));
  const fwExample=profile.example?'https://github.com/espressif/esp-idf/tree/'+idf.sha+'/'+profile.example:null;
  const fw=profile.example?{kind:'reference peripheral example only',toolchain:'ESP-IDF',tag:idf.tag,commit:idf.sha,target:profile.target,example:fwExample,completeApplication:false,deviceFlashed:false}:{kind:'original third-party software',commit:source.commit,reference:originalUrl,deviceFlashed:false,commercialRightsVerified:false};
  const manifest={
    schemaVersion:1,slug:p.slug,buildNumber:p.number,title:p.title,
    reference:{repository:source.repo,commit:source.commit,licenseMetadata:source.license,url:originalUrl},
    hardware:{candidate:profile.board,exactBoardRevisionVerified:false,allElectricalPinsVerified:false,physicalPowerUpVerified:false},
    firmware:fw,
    billOfMaterials:p.materials.map(m=>({slug:m.slug,quantity:m.qty,role:m.why})),
    supplementaryRequirements:profile.extras,
    cad:{sourceFiles:files,originalCreatorFilesMayUseDifferentHardware:true,mechanicalFitVerified:false,redistributionRightsVerified:false},
    tests:profile.tests.map(t=>({id:t[0],name:t[1],procedure:t[2],acceptance:t[3],status:'NOT_RUN',evidence:null})),
    release:{engineeringReferencesPrepared:true,firmwareCompilationPassed:false,benchValidationPassed:false,retailReady:false}
  };
  const wireTable=['| Origin | Destination | Electrical interface | Verify before power |','|---|---|---|---|'];
  wireTable.push(...profile.wiring.map(w=>'| '+w.map(md).join(' | ')+' |'));
  const tests=['| ID | Procedure | Acceptance evidence | Result |','|---|---|---|---|'];
  tests.push(...profile.tests.map(t=>'| '+md(t[0])+' | '+md(t[1]+': '+t[2])+' | '+md(t[3])+' | NOT RUN |'));
  const cadList=files.slice(0,28).map(a=>'- '+link(a.path,a.url)+' — actual original-creator design; compatibility with MAKHEX hardware NOT established');
  if(p.slug==='microduck-robot')cadList.push('- '+link('Source hash/print review','../../../docs/microduck-cad-review-20261025.md')+' — original print RAR: 36 STL + five-plate 3MF, plus four electronic PCB projects.');
  if(!cadList.length)cadList.push('- No native mechanical or PCB design source identified in this original repository at the locked commit; do not claim a CAD kit exists.');
  const firmwareInstructions=profile.example?[
    'The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:',
    '',wrap('git clone --recursive -b '+idf.tag+' https://github.com/espressif/esp-idf.git'),wrap('cd esp-idf'),wrap('git rev-parse HEAD')+' must equal '+wrap(idf.sha),
    'After installing and activating ESP-IDF according to the platform instructions, enter '+wrap(profile.example)+', run '+wrap('idf.py set-target '+profile.target)+' and '+wrap('idf.py build')+'.',
    '**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**',
    'Source: '+link(profile.example,fwExample), ''
  ]:[
    'This build has no generic ESP32 development-board flash command. Use the original creator software strictly at its pinned revision after checking device revision, licensing and bootloader/recovery compatibility.',
    'Source: '+link(source.repo,originalUrl),''
  ];
  const procedure=p.steps.map((s,i)=>String(i+5)+'. '+s);
  const doc=[
    '# MAKHEX engineering reference — Build '+p.number+': '+p.title,'',
    '> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.',
    '','## Hardware identity and BOM','',
    '- **Candidate hardware:** '+profile.board,
    '- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.',
    '- **Independent original source:** '+link(source.repo,originalUrl)+' at commit '+wrap(source.commit)+' (GitHub license metadata: '+wrap(source.license)+'). Original media may show **different** hardware.',
    '- **Software approach:** '+profile.driver,'',
    '| Component | Qty | Role |','|---|---:|---|',
    ...p.materials.map(m=>'| '+wrap(m.slug)+' | '+m.qty+' | '+md(m.why)+' |'),
    '','### Additional engineering items and gaps',...profile.extras.map(x=>'- '+x),
    '','## Reproducible software reference',...firmwareInstructions,
    '### Relevant engineering references',...profile.refs.map(x=>'- '+x),
    '','## Proposed wiring and interfaces','',
    'This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is '+link('wiring.csv','./wiring.csv')+'; the generated connection chart is '+link('wiring.svg','./wiring.svg')+'.','',
    ...wireTable,'',
    '## Available original CAD, PCB and 3D models','',
    ...cadList,'',
    'Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.',
    '','## Repeatable assembly and validation','',
    '1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.',
    '2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.',
    '3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.',
    '4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.',
    ...procedure,
    String(p.steps.length+5)+'. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.',
    '','## Physical acceptance procedures — all tests currently NOT RUN','',
    ...tests,'',
    'Complete '+link('acceptance.csv','./acceptance.csv')+' and '+link('bench-results.template.json','./bench-results.template.json')+' with signed observations. Keep customer PII, passwords and tokens out of public build evidence.',
    '','## Engineering release gate','',
    '- [ ] Purchased PCB/variant physically identified and matched to the source schematic',
    '- [ ] All wiring and power connections validated with the hardware unpowered',
    '- [ ] Exact firmware compiled, hash saved and actual board flashed',
    '- [ ] Required source fabrication files verified, safely licensed and physically fitted',
    '- [ ] All functional/safety tests pass with dated, reproducible bench evidence',
    '- [ ] Additional electrical safety parts included in final revision BOM',
    '- [ ] Separate supplier order/fulfillment testing completed before enabling purchase',
    '','**Status: reference documented; not bench certified or purchase ready.**',''
  ].join('\n');
  const evidence={
    slug:p.slug,status:'NOT_RUN',operator:null,testDate:null,boardManufacturer:null,boardSKU:null,
    pcbRevision:null,firmwareCommit:null,firmwareSha256:null,instrumentsAndCalibration:[],
    tests:profile.tests.map(t=>({id:t[0],status:'NOT_RUN',measuredValues:{},evidenceFiles:[],reviewer:null})),
    signoff:{electrical:null,software:null,mechanical:null,reviewer:null}
  };
  emit(dir+'ENGINEERING.md',doc);
  emit(dir+'source-lock.json',JSON.stringify(manifest,null,2)+'\n');
  const wiring=csv([['Origin','Destination','Electrical role','Pre-power check'],...profile.wiring]);
  const diagram=wireSvg(p,profile.wiring);
  const acceptance=csv([['ID','Procedure','How to reproduce','Pass criterion','Status','Evidence'],...profile.tests.map(t=>[...t,'NOT_RUN',''])]);
  emit(dir+'wiring.csv',wiring);
  emit(dir+'wiring.svg',diagram);
  emit(dir+'acceptance.csv',acceptance);
  emit('public/engineering/'+p.slug+'/wiring.csv',wiring);
  emit('public/engineering/'+p.slug+'/wiring.svg',diagram);
  emit('public/engineering/'+p.slug+'/acceptance.csv',acceptance);
  emit(dir+'bench-results.template.json',JSON.stringify(evidence,null,2)+'\n');
}
const listing=['# MAKHEX engineering source and test index','',
'**12 packages created.** Each includes locked upstream commits, a hardware-specific connection plan, editable CSV/net diagram, candidate CAD links, test procedures, and evidence template. These are not proof of physical fit or a completed firmware application.',
'','ESP-IDF reference baseline: '+link(idf.tag+' / '+idf.sha,'https://github.com/espressif/esp-idf/tree/'+idf.sha)+'; the vendor sample is only a peripheral smoke test.',
'','| Build | Package | Wiring | Tests | Original fabrication sources |','|---|---|---|---|---:|',
...projects.map(p=>{const folder='../../builds/'+p.slug+'/engineering/',design=getDesign(p.slug),n=(design.candidateDesignFiles??[]).filter(x=>extension.test(x.path)).length;return '| '+p.number+' '+p.title+' | '+link('Engineering',folder+'ENGINEERING.md')+' | '+link('CSV',folder+'wiring.csv')+' / '+link('SVG',folder+'wiring.svg')+' | '+link('Acceptance',folder+'acceptance.csv')+' | '+n+' |';}),
'','**Source indexed** means the original creator published a design file; it does not mean the design fits the MAKHEX BOM. **NOT RUN** means no physical evidence has been produced, not that the test passed.','','To qualify, physically identify purchased PCB variants, reconcile every provisional net, compile and flash exact firmware, test each requirement and attach traceable evidence to the template.',''].join('\n');
emit('docs/engineering/INDEX.md',listing);

const checking=process.argv.includes('--check');
const normalize=s=>s.replace(/\r\n/g,'\n');
let writes=0;
for(const [file,expected] of outputs){
  const absolute=path.join(root,file);
  const current=fs.existsSync(absolute)?normalize(fs.readFileSync(absolute,'utf8')):null;
  if(checking){if(current!==expected)throw new Error('Generated artifact stale: '+file);}
  else {fs.mkdirSync(path.dirname(absolute),{recursive:true});if(current!==expected){fs.writeFileSync(absolute,expected);writes++;}}
}
console.log(JSON.stringify({projects:projects.length,artifacts:outputs.size,filesUpdated:writes,mode:checking?'CHECK':'GENERATE'}));
