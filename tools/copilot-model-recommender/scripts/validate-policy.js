#!/usr/bin/env node
import { loadJson } from '../src/load-json.js';
import { validatePolicy } from '../src/policy.js';
const p = process.argv[2] || '~/ .copilot/model-recommendation/model-capability-policy.json'.replace('/ ','');
try{
  const policy = await loadJson(p);
  validatePolicy(policy);
  console.log('Policy validation: OK');
  process.exit(0);
}catch(e){
  console.error('Policy validation: FAILED', e.message);
  process.exit(2);
}
