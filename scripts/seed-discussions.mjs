#!/usr/bin/env node
// Idempotent GitHub Discussions seeder for MAKHEX.
// Read-only by default. Use --apply to create missing threads.
// The generated URL map is public repo metadata; no secrets are stored.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { products } from '../src/data/products.ts';
import { projects } from '../src/data/projects.ts';

const owner='polygoku', name='makhex', apply=process.argv.includes('--apply');
const gh=process.platform==='win32'?'gh.exe':'gh';
function api(query, vars={}){
  const args=['api','graphql','-f','query='+query, ...Object.entries(vars).flatMap(([k,v])=>['-f',k+'='+String(v)])];
  const raw=execFileSync(gh,args,{encoding:'utf8',windowsHide:true,timeout:45000,maxBuffer:1024*1024});
  const response=JSON.parse(raw);
  if(response.errors?.length)throw new Error(JSON.stringify(response.errors));
  return response.data;
}
const q='query($owner:String!,$name:String!){repository(owner:$owner,name:$name){id discussionCategories(first:20){nodes{id name}} discussions(first:100){nodes{number title url}}}}';
const d=api(q,{owner,name}).repository;
if(!d)throw new Error('GitHub repository is inaccessible.');
const general=d.discussionCategories.nodes.find(c=>c.name==='General');
if(!general)throw new Error('General discussion category is missing.');
const topics=[
 ...products.map(p=>({
   group:'products',slug:p.slug,title:'Component: '+p.title+' - wiring, firmware, parts',
   body:'# '+p.title+' — MAKHEX component workbench\n\n**Current status:** Research candidate. No verified seller, SKU, orderability or checkout.\n\nDiscuss exact board or module variants, pinouts, SDK compatibility, firmware changes, and reproducible bench measurements here.\n\n## What to contribute\n- Manufacturer, source URL and exact variant/PCB revision\n- Power supply and GPIO voltage limits, schematic, chip package\n- Code examples with ESP-IDF/Arduino and library versions\n- Supplier and BOM changes with dated orderability evidence\n- Confirmed failures, measurements and proposed fixes\n\n**Known qualification caution:** '+p.notes+'\n\n**Please separate hypotheses from tested findings.** Never post credentials or personal information.'
 })),
 ...projects.map(p=>({
  group:'projects',slug:p.slug,title:'Project: '+p.title+' - BOM, firmware, build notes',
  body:'# '+p.title+' — MAKHEX build log\n\n**Current status:** Blueprint, not an electrically or mechanically qualified kit.\n\n**Purpose:** '+p.summary+'\n\n## Candidate bill of materials\n'+p.materials.map(m=>'- '+m.qty+'x [/'+m.slug+'](https://makhex.com/shop/'+m.slug+'/) — '+m.why).join('\n')+'\n\n## Proposed build milestones\n'+p.steps.map((s,i)=>(i+1)+'. '+s).join('\n')+'\n\n## Improve this guide\n- Suggest validated supplier or component substitutions\n- Share board revision and software environment\n- Post reproducible firmware builds, wiring diagrams and measurements\n- Document errors, successful tests and unresolved risks\n\n**Engineering caution:** '+p.caution+'\n\nPlease be specific and label unverified approaches.'
 }))
];
const mutation='mutation($repo:ID!,$category:ID!,$title:String!,$body:String!){createDiscussion(input:{repositoryId:$repo,categoryId:$category,title:$title,body:$body}){discussion{number title url}}}';
const existing=d.discussions.nodes;
const urls={products:{},projects:{}};
let created=0,reused=0;
for(const [i,t] of topics.entries()){
  let match=existing.find(x=>x.title===t.title);
  if(!match){
    if(!apply){console.log('WOULD CREATE '+t.title);continue;}
    const result=api(mutation,{repo:d.id,category:general.id,title:t.title,body:t.body}).createDiscussion.discussion;
    match=result;existing.push(match);created++;
    console.log('CREATED '+(i+1)+'/'+topics.length+' '+result.url);
  }else{
    reused++;console.log('REUSED '+(i+1)+'/'+topics.length+' '+match.url);
  }
  urls[t.group][t.slug]=match.url;
}
if(apply){
  const dest='src/data/discussion-links.json';
  mkdirSync(dirname(dest),{recursive:true});
  writeFileSync(dest,JSON.stringify(urls,null,2)+'\n','utf8');
  console.log('COMPLETED '+created+' created, '+reused+' reused; mapped '+Object.keys(urls.products).length+' products and '+Object.keys(urls.projects).length+' projects');
}else{
  console.log('DRY RUN: '+topics.length+' desired threads; rerun with --apply to create.');
}
