#!/usr/bin/env node
import { loadJson, writeJson } from '../src/load-json.js';
import { applyPolicy } from '../src/ranking.js';
const policyPath = process.argv[2] || '~/ .copilot/model-recommendation/model-capability-policy.json'.replace('/ ','');
const availPath = process.argv[3] || '~/ .copilot/model-recommendation/available-models.snapshot.json'.replace('/ ','');
const outPath = process.argv[4] || '~/ .copilot/model-recommendation/ranked-models.snapshot.json'.replace('/ ','');
try{
  const policy = await loadJson(policyPath);
  const avail = await loadJson(availPath);
  const ranked = await applyPolicy(avail.models||avail, policy);
  await writeJson(outPath, {generated_at: new Date().toISOString(), models: ranked});
  console.log('Wrote', outPath);
}catch(e){ console.error(e); process.exit(2); }
