import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
const root=process.cwd();
function data(rel){
 const compiled=ts.transpileModule(fs.readFileSync(path.join(root,rel),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const sandbox={exports:{}};vm.runInNewContext(compiled,sandbox,{filename:rel,timeout:3000});return sandbox.exports;
}
const {projects}=data('src/data/projects.ts');
const {projectGuides}=data('src/data/project-guides.ts');
const {buildReferences}=data('src/data/build-references.ts');
const result={generatedAt:new Date().toISOString(),source:'GitHub public repository tree readback',projects:[]};
for(const p of projects){
 const repo=projectGuides[p.slug]?.source?.url||buildReferences[p.slug]?.sourceUrl;
 const match=String(repo||'').match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
 const row={slug:p.slug,repo:repo||null,upstreamSha:null,upstreamCommit:null,designFiles:[],pdfFiles:[],instructions:[],scanned:false,scanError:null};
 if(!match){row.scanError='NO_GITHUB_SOURCE';result.projects.push(row);continue}
 const repoId=match[1]+'/'+match[2].replace(/\.git$/,'');
 try{
  const json=execFileSync('gh',['api','repos/'+repoId+'/git/trees/HEAD?recursive=1'],{encoding:'utf8',timeout:15000,maxBuffer:12_000_000,windowsHide:true});
  const body=JSON.parse(json);
  row.upstreamSha=body.sha||null;
  row.upstreamCommit=execFileSync('gh',['api','repos/'+repoId+'/commits/HEAD','--jq','.sha'],{encoding:'utf8',timeout:15000,windowsHide:true}).trim();
  const files=(body.tree||[]).filter(f=>f.type==='blob').map(f=>f.path);
  row.designFiles=files.filter(f=>/\.(stl|3mf|step|stp|obj|dxf|dwg|f3d|scad|kicad_pcb|kicad_sch|sch|epro2|fcstd|iges|igs)$/i.test(f)).slice(0,250);
  row.pdfFiles=files.filter(f=>/\.pdf$/i.test(f)).slice(0,80);
  row.instructions=files.filter(f=>/(README|instruction|guide|build|assembly|schematic)/i.test(f)&&/\.(md|txt|pdf)$/i.test(f)).slice(0,35);
  row.scanned=true;if(body.truncated)row.scanError='GITHUB_TREE_TRUNCATED';
 }catch(e){row.scanError='UPSTREAM_UNAVAILABLE';}
 result.projects.push(row);
 console.log(p.number+' '+p.slug+': '+(row.scanned?'TREE_OK':'TREE_NOT_AVAILABLE')+' models='+row.designFiles.length+' pdf='+row.pdfFiles.length+' instructions='+row.instructions.length);
}
fs.writeFileSync(path.join(root,'docs','UPSTREAM_DESIGN_ASSET_INDEX.json'),JSON.stringify(result,null,2)+'\n');
const md=['# MAKHEX upstream design-file audit','',
'Generated '+result.generatedAt+'. **These are source-owned repository paths, not verified MAKHEX-compatible or redistributable assets.**','',
'| Build | Original repository | Native design/model files | PDF documents | Upstream file tree |',
'|---|---|---:|---:|---|',
...result.projects.map(r=>'| '+r.slug+' | '+(r.repo||'unknown')+' | '+r.designFiles.length+' | '+r.pdfFiles.length+' | '+(r.scanError||'Scanned')+' |'),
'',
'Models and schematics must be matched to the actual BOM and their redistribution permissions checked before rehosting. An upstream model path alone is not a printable or verified file.',''];
for(const r of result.projects){
 md.push('## '+r.slug,'');
 md.push('- Reference: '+(r.repo||'none'));
 md.push('- Source tree hash: '+(r.upstreamSha||'not available'));
 md.push('- Design files: '+(r.designFiles.length?r.designFiles.join(', '):'none found in scanned tree'));
 md.push('- PDFs: '+(r.pdfFiles.length?r.pdfFiles.join(', '):'none found in scanned tree'));
 md.push('');
}
fs.writeFileSync(path.join(root,'docs','UPSTREAM_DESIGN_ASSET_INDEX.md'),md.join('\n'));
