import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseCsv, reviewedPrices, syncSource} from './sync-squarespace-prices.mjs';

const root=path.dirname(fileURLToPath(new URL('../package.json',import.meta.url)));
const stageFile=path.join(root,'src/data/catalog-staging.ts');
const staged=fs.readFileSync(stageFile,'utf8');
const normalizedStaged=staged.replace(/\r\n?/g,'\n');
const sourceMap=Object.fromEntries(
  [...staged.matchAll(/^\s*'([a-z0-9-]+)':\{supplierModel:.*$/gm)]
    .filter(m=>m[0].includes('plannedRetailUsd:'))
    .map(m=>[m[1],[...m[0].matchAll(/plannedRetailUsd:\s*(\d+(?:\.\d+)?)/g)].map(x=>Number(x[1]))])
);

test('current catalog has 16 distinct priced component families and 17 options',()=>{
  assert.equal(Object.keys(sourceMap).length,16);
  assert.equal(Object.values(sourceMap).flat().length,17);
  assert.deepEqual(sourceMap['esp-mosaico-vision-combo-kit'],[201.70]);
  assert.deepEqual(sourceMap['speaker-4ohm-3w'],[6.35]);
  assert.deepEqual(sourceMap['momentary-tactile-switch'],[3.55]);
  assert.deepEqual(sourceMap['5v-5a-led-power'],[29.18]);
});
test('applying the same Squarespace catalog twice is idempotent and preserves all newlines',()=>{
  const once=syncSource(staged,sourceMap,'2026-10-25');
  const twice=syncSource(once,sourceMap,'2026-10-25');
  assert.equal(once,normalizedStaged);
  assert.equal(twice,once);
  assert.equal([...twice.matchAll(/^\s*'([a-z0-9-]+)':\{supplierModel:/gm)].length,16);
});
test('price changes modify only the targeted staged option',()=>{
  const replacement={...sourceMap,'esp-mosaico-vision-combo-kit':[199.99]};
  const next=syncSource(staged,replacement,'2026-10-25');
  assert.match(next,/'esp-mosaico-vision-combo-kit':\{[^\n]*plannedRetailUsd:199\.99/);
  assert.ok(next.includes('plannedRetailUsd:29.18'));
  assert.ok(next.includes('plannedRetailUsd:3.55'));
  assert.ok(!next.includes('checkoutApprovals'));
});
test('rejects incomplete mapping, invalid amounts, merged stage entries and bad dates',()=>{
  const truncated={...sourceMap};
  delete truncated['speaker-4ohm-3w'];
  assert.throws(()=>syncSource(staged,truncated,'2026-10-25'),/exact reviewed/);
  assert.throws(()=>syncSource(staged,{...sourceMap,'speaker-4ohm-3w':[-2]},'2026-10-25'),/Unqualified price/);
  assert.throws(()=>syncSource(staged,sourceMap,'October 25'),/ISO snapshot/);
  const merged=normalizedStaged.replace(/\},\n  '(?=speaker-4ohm-3w)/,'},  \'');
  assert.throws(()=>syncSource(merged,sourceMap,'2026-10-25'),/own line/);
});

test('authenticated Squarespace CSV and public catalog remain identical when an export is supplied',
  {skip: !process.env.MAKHEX_OWNER_SQUARESPACE_CSV}, ()=>{
    const file=process.env.MAKHEX_OWNER_SQUARESPACE_CSV;
    const fresh=reviewedPrices(fs.readFileSync(file,'utf8'));
    assert.deepEqual(fresh,sourceMap);
    assert.equal(syncSource(staged,fresh,'2026-10-25'),normalizedStaged);
  });

test('CSV parses quoted multiline and rejects sales candidates with positive stock',()=>{
  const csv='Product URL,SKU,Price,Stock,Visible,Option Value 1\r\n' +
    'mkx-1005013031140600,MKX-TEST,201.70,0,No,"Black, combo kit"\r\n' +
    ',MKX-ALT,6.35,1,No,"Line one\nLine two"\r\n';
  const rows=parseCsv(csv);
  assert.equal(rows.length,3);
  assert.equal(rows[1][5],'Black, combo kit');
  assert.equal(rows[2][5],'Line one\nLine two');
  assert.throws(()=>reviewedPrices(csv),/No product|invalid catalog row/);
});
