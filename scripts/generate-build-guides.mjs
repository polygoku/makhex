// Run with Node.js 24+ to regenerate the editable MAKHEX project briefs.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { projects } from '../src/data/projects.ts';
import { projectGuides } from '../src/data/project-guides.ts';
import { buildReferences } from '../src/data/build-references.ts';
import { projectBomMissingParts } from '../src/data/catalog-staging.ts';

const root = resolve(import.meta.dirname, '..');
const list = (values) => values.map((s,i) => (i+1) + '. ' + s).join('\n');
for (const p of projects) {
  const g=projectGuides[p.slug], ref=buildReferences[p.slug];
  if(!g || !ref) throw Error('Missing verified guide or reference: '+p.slug);
  const path=resolve(root,'builds',p.slug,'README.md');
  const materials=p.materials.map(m=>'| '+m.slug+' | '+m.qty+' | '+m.why+' |').join('\n');
  const missing=projectBomMissingParts[p.slug]||[];
  const lines=[
    '# '+p.title,
    '',
    '> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.',
    '',
    '[MAKHEX build page](https://makhex.com/projects/'+p.slug+'/)'+' · [Join discussion](https://makhex.com/projects/'+p.slug+'/#discussion)'+' · [Download BOM](https://makhex.com/projects/'+p.slug+'.csv)',
    '',
    '## Build objective', '',g.overview,'',
    '## Real use cases','',list(g.useCases),'',
    '## Before you order, wire or power','',list(g.beforeYouStart),'',
    '## Research-stage BOM',
    '',
    '| Component slug | Qty | Intended role |','|---|---:|---|',materials,'',
    ...(missing.length?['**Missing or unqualified pieces — not included in subtotal:**',...missing.map(x=>'- '+x),'']:[]),
    'The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.',
    '',
    '## Rough bring-up procedure','',list(p.steps),'',
    '## Acceptance checks','',list(g.demoGoals),'',
    '## Instructions for AI coding agents','',
    'Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.',
    '',
    list(g.agentTasks),'',
    '**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.','',
    '## Original creator and media','',
    'Original creator: **'+ref.builder+'** · [Original build, repository and firmware]('+ref.sourceUrl+')',
    '',
    'The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.','',
    ...(g.video?['[Watch original maker video]('+g.video.url+') — '+g.video.creator+' (reference only).']:['No original-maker video has been verified for this reference yet.']),
    '',
    '## Engineering limitations','',p.caution,'',
    '## Contributing','',
    'Use the [MAKHEX project discussion](https://makhex.com/projects/'+p.slug+'/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.',''
  ];
  await mkdir(dirname(path),{recursive:true});
  await writeFile(path,lines.join('\n'),'utf8');
}
console.log('Generated '+projects.length+' project READMEs');