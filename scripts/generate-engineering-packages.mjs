import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
// Reproducibility preparation; never conflate documentation with hardware certification.
const root=process.cwd();
function data(rel){
 const compiled=ts.transpileModule(fs.readFileSync(path.join(root,rel),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const sandbox={exports:{}};vm.runInNewContext(compiled,sandbox,{filename:rel,timeout:3000});return sandbox.exports;
}
const {projects}=data('src/data/projects.ts');
const {products}=data('src/data/products.ts');
const {projectGuides}=data('src/data/project-guides.ts');
const {buildReferences}=data('src/data/build-references.ts');
const {catalogStaging}=data('src/data/catalog-staging.ts');
const upstreamIndex=JSON.parse(fs.readFileSync(path.join(root,'docs','UPSTREAM_DESIGN_ASSET_INDEX.json'),'utf8'));
const productMap=new Map(products.map(p=>[p.slug,p]));
const asset=(f)=>fs.existsSync(path.join(root,'public',f.replace(/^\//,'')));
const clean=s=>String(s||'').replace(/\|/g,'/').replace(/[\r\n]+/g,' ');
const matrix=[];
for(const project of projects){
 const guide=projectGuides[project.slug],ref=buildReferences[project.slug];
 const sourceAssets=upstreamIndex.projects.find(p=>p.slug===project.slug);
 const sourcePaths=[...(sourceAssets?.designFiles||[]),...(sourceAssets?.pdfFiles||[])];
 const pinnedLink=(name)=>sourceAssets?.repo&&sourceAssets?.upstreamCommit?sourceAssets.repo.replace(/\/$/,'')+'/blob/'+sourceAssets.upstreamCommit+'/'+name.split('/').map(encodeURIComponent).join('/'):null;
 if(!guide)throw new Error('Missing guide: '+project.slug);
 const media={referencePhoto:ref&&asset(ref.image)?ref.image:null,credit:ref?.builder||guide.source?.creator||'Independent maker',externalVideo:guide.video?.url||null,hostedVideos:[]};
 if(project.number==='12')for(let i=1;i<=7;i++){const v='/demo/microduck/microduck-demo-'+String(i).padStart(2,'0')+'.mp4';if(asset(v))media.hostedVideos.push(v)}
 if(project.number==='11'&&asset('/demo/build11-en-concept.mp4'))media.hostedVideos.push('/demo/build11-en-concept.mp4');
 const parts=project.materials.map(m=>{
  const prod=productMap.get(m.slug);if(!prod)throw new Error('Unmapped '+m.slug+' in '+project.slug);
  return {slug:m.slug,quantity:m.qty,role:m.why,title:prod.title,photo:asset('/product-media/'+m.slug+'.jpg')?'/product-media/'+m.slug+'.jpg':null,publicUrl:'/shop/'+m.slug+'/',supplierVariantVerified:false,zip11021ShippingVerified:false,customerCheckoutVerified:false,pricePlanningSnapshot:catalogStaging[m.slug]?.variants[0]?.plannedRetailUsd??null};
 });
 const design=project.number==='12'?
  {status:'source-linked member-gated CAD, not physically qualified',url:'https://github.com/kissqy/Microduck-kissqy'}:
  project.number==='11'?{status:'upstream reference firmware is noncommercial, commercial distribution not authorized',url:guide.source?.url||null}:
  {status:'no validated native fabrication CAD/3D model in MAKHEX package',url:ref?.sourceUrl||null};
 const profile={schema:'makhex-engineering-v1',slug:project.slug,number:project.number,title:project.title,status:'RESEARCH_NOT_VALIDATED',benchVerified:false,firmwareBuildVerified:false,mechanicalFitVerified:false,powerBudgetVerified:false,schematicPinoutVerified:false,supplierVariantsVerified:false,paymentTrackingRefundVerified:false,sourceUrl:guide.source?.url||ref?.sourceUrl||null,sourceLicense:guide.source?.license||ref?.license||'check original source',sourceCommit:sourceAssets?.upstreamCommit||null,upstreamDesignFiles:sourcePaths,media,design,parts,preflight:guide.beforeYouStart,steps:project.steps,acceptance:guide.demoGoals,agentTasks:guide.agentTasks,caution:project.caution};
 const md=['# MAKHEX Engineering Package '+project.number+' — '+project.title,'',
 '**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.','',
 '## Provenance and source rights',
 '- Original maker/source: '+(profile.sourceUrl||'not established'),
 '- License: '+profile.sourceLicense,
 '- Credited physical reference photo: '+(media.referencePhoto||'not locally hosted'),
 '- MAKHEX-hosted videos: '+(media.hostedVideos.length?media.hostedVideos.join(', '):'none'),
 '- External demo: '+(media.externalVideo||'none confirmed'),
 '- Source design/3D assets: '+design.status,
 '- Design source: '+(design.url||'not yet identified'),
 '- Pinned original-source commit: '+(sourceAssets?.upstreamCommit||'not available'),
 '',
 '### Native source files (original build, not verified compatible with MAKHEX BOM)',
 ...(sourcePaths.length?sourcePaths.map(f=>'- ['+clean(f)+']('+pinnedLink(f)+')'):['- No source CAD/3D/PDF files indexed.']),
 '',
 '## Required hardware — research BOM',
 '| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |',
 '|---:|---|---|---|',
 ...parts.map(p=>'| '+p.quantity+' | ['+clean(p.title)+'](https://makhex.com'+p.publicUrl+') | '+clean(p.role)+' | Not verified |'),
 '',
 'The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.','',
 '## Reproducible engineering protocol',
 '1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.',
 '2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.',
 '3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.',
 '4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.',
 '5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.',
 '',
 '### Project-specific bring-up',
 ...project.steps.map((s,i)=>(i+1)+'. '+s),
 '',
 '### Project-specific preflight',
 ...guide.beforeYouStart.map(s=>'- '+s),
 '',
 '## Acceptance tests — evidence not yet supplied',
 ...guide.demoGoals.map(g=>'- [ ] '+g),
 '',
 'Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**',
 '',
 '## Engineering and licensing caution',project.caution,'',
 '## Purchasing acceptance',
 'Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.',
 '',
 '## Agent implementation tasks',
 ...guide.agentTasks.map((s,i)=>(i+1)+'. '+s),
 '',
 'A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.',''];
 const dir=path.join(root,'builds',project.slug);
 fs.writeFileSync(path.join(dir,'ENGINEERING-PACKAGE.md'),md.join('\n')+'\n');
 fs.writeFileSync(path.join(dir,'engineering-manifest.json'),JSON.stringify(profile,null,2)+'\n');
 matrix.push({slug:project.slug,number:project.number,types:parts.length,pricedTypes:parts.filter(p=>p.pricePlanningSnapshot!==null).length,hostedVideos:media.hostedVideos.length,physicalReferencePhoto:!!media.referencePhoto,verifiedOrderableTypes:0,benchCertified:false});
}
fs.writeFileSync(path.join(root,'docs','ENGINEERING_RELEASE_MATRIX.json'),JSON.stringify({schema:'makhex-release-matrix-v1',generatedAt:new Date().toISOString(),projects:matrix},null,2)+'\n');
console.log('Generated '+matrix.length+' source packages with '+matrix.reduce((s,p)=>s+p.types,0)+' project-part references.');
console.table(matrix);
