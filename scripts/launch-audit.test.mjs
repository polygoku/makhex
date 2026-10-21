import test from 'node:test';
import assert from 'node:assert/strict';
import {attestationValid,classifyHttp,summarizeChecks,ownedWorkerMatches} from './launch-audit.mjs';

test('owner evidence requires dated GitHub issue or PR',()=>{
 assert.equal(attestationValid({verifiedAt:null,evidenceIssueUrl:null}),false);
 assert.equal(attestationValid({verifiedAt:'not a date',evidenceIssueUrl:'https://github.com/polygoku/makhex/issues/3'}),false);
 assert.equal(attestationValid({verifiedAt:'2026-10-21T10:00:00Z',evidenceIssueUrl:'https://evil.example/issues/3'}),false);
 assert.equal(attestationValid({verifiedAt:'2026-10-21T10:00:00Z',evidenceIssueUrl:'https://github.com/polygoku/makhex/issues/3'}),true);
});
test('a restricted Squarespace site is never treated as launch-ready',()=>{
 for(const code of [0,301,401,403,404,500])assert.equal(classifyHttp(code,'MAKHEX','shop.makhex.com','shop.makhex.com').status,'BLOCKED');
 assert.equal(classifyHttp(200,'MAKHEX','makhex.com','shop.makhex.com').status,'BLOCKED');
 assert.equal(classifyHttp(200,'Not branded','shop.makhex.com','shop.makhex.com').status,'BLOCKED');
 assert.equal(classifyHttp(200,'MAKHEX maker parts','shop.makhex.com','shop.makhex.com').status,'PASS');
});
test('every missing prerequisite fails closed',()=>{
 const checks=[{id:'account',status:'PASS'},{id:'dns',status:'BLOCKED'},{id:'shop',status:'PASS'}];
 assert.deepEqual(summarizeChecks(checks,['account','dns','shop']),{ready:false,blockedBy:['dns']});
 assert.deepEqual(summarizeChecks(checks,['account','missing']),{ready:false,blockedBy:['missing']});
 assert.deepEqual(summarizeChecks(checks,['account','shop']),{ready:true,blockedBy:[]});
});

test('a temporary or wrong-account worker cannot count as permanent ownership',()=>{
 assert.equal(ownedWorkerMatches(['makhex'],'owned-zone','https://makhex.owned-zone.workers.dev/'),true);
 assert.equal(ownedWorkerMatches(['other'],'owned-zone','https://makhex.owned-zone.workers.dev/'),false);
 assert.equal(ownedWorkerMatches(['makhex'],'owned-zone','https://makhex.sheer-cough.workers.dev/'),false);
 assert.equal(ownedWorkerMatches(['makhex'],'owned-zone','http://makhex.owned-zone.workers.dev/'),false);
});
