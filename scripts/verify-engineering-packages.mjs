import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const root=process.cwd();
const load=(p)=>{const ctx={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root,p),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,ctx,{timeout:2000});return ctx.exports;};
const {projects}=load('src/data/projects.ts'),{products}=load('src/data/products.ts');
const source=JSON.parse(fs.readFileSync(path.join(root,'docs','UPSTREAM_DESIGN_ASSET_INDEX.json'),'utf8'));
const evidence=JSON.parse(fs.readFileSync(path.join(root,'docs','SUPPLIER_QUALIFICATION_MATRIX_20261027.json'),'utf8'));
const fail=(msg)=>{throw new Error('[MAKHEX engineering gate] '+msg);};
if(projects.length!==12)fail('Expected 12 projects');
if(products.length!==30)fail('Expected 30 researched product types');
if(source.projects.length!==projects.length)fail('Upstream index incomplete');
if(evidence.rows.length!==products.length)fail('Supplier ledger incomplete');
if(evidence.summary.currentlyQualified!==0)fail('Unreviewed sourcing claims current qualification');
let refs=0,photos=0,designSources=0;
for(const p of products){
 const media=path.join(root,'public','product-media',p.slug+'.jpg');
 if(!fs.existsSync(media))fail('Missing photo for '+p.slug);
 const bytes=fs.readFileSync(media);
 if(bytes.length<200 || bytes[0]!==0xFF || bytes[1]!==0xD8)fail('Invalid JPEG '+p.slug);
 photos++;
}
for(const p of projects){
 const dir=path.join(root,'builds',p.slug);
 const md=path.join(dir,'ENGINEERING-PACKAGE.md');
 const manifestPath=path.join(dir,'engineering-manifest.json');
 if(!fs.existsSync(md)||!fs.existsSync(manifestPath))fail('Missing engineering artifacts '+p.slug);
 const m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 if(m.schema!=='makhex-engineering-v1'||m.slug!==p.slug||m.number!==p.number)fail('Wrong manifest identity '+p.slug);
 if(m.status!=='RESEARCH_NOT_VALIDATED'||m.benchVerified!==false||m.paymentTrackingRefundVerified!==false||m.supplierVariantsVerified!==false)fail('Unsafe release flag '+p.slug);
 if(m.parts.length!==p.materials.length)fail('Incomplete BOM '+p.slug);
 for(let i=0;i<p.materials.length;i++){const a=p.materials[i],b=m.parts[i];if(a.slug!==b.slug||a.qty!==b.quantity)fail('BOM option or quantity drift '+p.slug);}
 const tree=source.projects.find(s=>s.slug===p.slug);
 if(!tree || tree.scanned!==true || !/^[a-f0-9]{40}$/.test(tree.upstreamCommit||''))fail('Upstream reference not pinned '+p.slug);
 if(tree.designFiles.length)designSources++;
 for(const f of m.media.hostedVideos)if(!fs.existsSync(path.join(root,'public',f.replace(/^\//,''))))fail('Missing project video '+f);
 if(m.media.referencePhoto)refs++;
 if(m.acceptance.length<2||m.steps.length<3)fail('Missing reproduction acceptance plan '+p.slug);
}
console.log('MAKHEX ENGINEERING QA PASS: '+projects.length+' source engineering packages, '+photos+' JPG component media assets, '+refs+' original-builder photos, '+designSources+' upstream design-file sources, 0 falsely approved sale-ready projects.');
