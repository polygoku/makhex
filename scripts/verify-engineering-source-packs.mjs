import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {projects} from '../src/data/projects.ts';
import {profiles} from './engineering-profiles.mjs';
const root=process.cwd();
const expectedFiles=['ENGINEERING.md','wiring.csv','wiring.svg','acceptance.csv','source-lock.json','bench-results.template.json'];
assert.equal(projects.length,12);
let nativeDesignProjects=0,tests=0,wires=0;
for(const p of projects){
  const dir=path.join(root,'builds',p.slug,'engineering');
  assert(profiles[p.slug],'missing engineering profile '+p.slug);
  for(const f of expectedFiles)assert(fs.existsSync(path.join(dir,f)),'missing '+p.slug+'/'+f);
  const m=JSON.parse(fs.readFileSync(path.join(dir,'source-lock.json'),'utf8'));
  const e=JSON.parse(fs.readFileSync(path.join(dir,'bench-results.template.json'),'utf8'));
  assert.equal(m.slug,p.slug);assert.equal(m.billOfMaterials.length,p.materials.length);
  assert.deepEqual(m.billOfMaterials.map(x=>x.slug),p.materials.map(x=>x.slug));
  assert.deepEqual(m.billOfMaterials.map(x=>x.quantity),p.materials.map(x=>x.qty));
  assert.match(m.reference.commit,/^[a-f0-9]{40}$/);
  assert.equal(m.hardware.exactBoardRevisionVerified,false);
  assert.equal(m.hardware.allElectricalPinsVerified,false);
  assert.equal(m.firmware.deviceFlashed,false);
  assert.equal(m.release.firmwareCompilationPassed,false);
  assert.equal(m.release.benchValidationPassed,false);
  assert.equal(m.release.retailReady,false);
  assert.equal(e.status,'NOT_RUN');
  assert(e.tests.length>=5);assert(m.tests.length>=5);
  assert(m.tests.every(x=>x.status==='NOT_RUN'&&x.evidence===null));
  assert(e.tests.every(x=>x.status==='NOT_RUN'&&x.evidenceFiles.length===0));
  tests+=m.tests.length;
  assert.equal(m.hardware.connectionCount===undefined,true); // explicit vectors in CSV, not a false verified netlist
  const csv=fs.readFileSync(path.join(dir,'wiring.csv'),'utf8');
  const a=fs.readFileSync(path.join(dir,'acceptance.csv'),'utf8');
  assert(csv.includes('Pre-power check'));assert(a.includes('NOT_RUN'));
  const svg=fs.readFileSync(path.join(dir,'wiring.svg'),'utf8');
  assert(svg.includes('<svg'));assert(svg.includes('not fabrication'));
  assert(!svg.includes('<script'));
  for(const file of ['wiring.csv','wiring.svg','acceptance.csv']){
    assert.equal(fs.readFileSync(path.join(dir,file),'utf8'),
      fs.readFileSync(path.join(root,'public','engineering',p.slug,file),'utf8'),
      'public file drift for '+p.slug+'/'+file);
  }
  wires+=profiles[p.slug].wiring.length;
  assert(profiles[p.slug].wiring.every(row=>row.length===4));
  if(m.cad.sourceFiles.length)nativeDesignProjects++;
  assert(!/MAKHEX_AUTO_PLACE_ENABLED=true/.test(fs.readFileSync(path.join(dir,'ENGINEERING.md'),'utf8')));
}
const run=spawnSync(process.execPath,['scripts/generate-engineering-packs.mjs','--check'],{cwd:root,encoding:'utf8',timeout:15000});
if(run.status!==0)throw new Error('Generated docs drift: '+(run.stderr||run.stdout));
console.log('MAKHEX ENGINEERING SOURCE PASS: '+projects.length+' page-linked packs, '+tests+' unrun acceptance cases, '+wires+' proposed connection records, '+nativeDesignProjects+' packages referencing original native design files, no bench or sales approvals.');
