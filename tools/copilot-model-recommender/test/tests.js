import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { validatePolicy } from '../src/policy.js';
import { applyPolicy } from '../src/ranking.js';
import { vendorDisabledMap, filterCandidates, sortCandidates, computeCeilingRole } from '../src/recommendation.js';

const FIX = file => {
  const base = path.dirname(new URL(import.meta.url).pathname);
  return JSON.parse(fs.readFileSync(path.join(base, 'fixtures', file), 'utf8'));
};

const policy = FIX('policy.json');
validatePolicy(policy);
const avail = FIX('available-models.json');
const ranked = await applyPolicy(avail.models, policy);
assert(ranked.length>=3, 'ranking produced at least 3');
// Tier checks
const m1 = ranked.find(m=>m.vendor==='openai' || (m.family||'').startsWith('openai/'));
const m2 = ranked.find(m=>m.vendor==='builder' || (m.family||'').startsWith('builder/'));
const m3 = ranked.find(m=>m.vendor==='gptx' || (m.family||'').startsWith('gptx/'));
assert(m1 && m1.capability_tier==='Tier 1');
assert(m2 && m2.capability_tier==='Tier 2');
assert(m3 && m3.capability_tier==='Tier 3');
// Builder requires tier 2 -> should choose m2 over m1
{
  const disabled = {};
  const disabledMap = vendorDisabledMap(disabled);
  const participants = ['Builder'];
  const ceiling = computeCeilingRole(participants, policy);
  const required = policy.role_requirements[ceiling];
  const candidates = filterCandidates(ranked, {requiredTier: required, disabledMap});
  const sorted = sortCandidates(candidates, policy, required);
  // Ensure at least one Tier 2 candidate is available for Builder
  assert(candidates.find(c=>c.capability_tier==='Tier 2'), 'Tier 2 candidate exists for Builder');
}
// Workflow Researcher,Architect,Auditor -> ceiling Architect -> tier3
{
  const participants = ['Researcher','Architect','Auditor'];
  const ceiling = computeCeilingRole(participants, policy);
  const required = policy.role_requirements[ceiling];
  const candidates = filterCandidates(ranked, {requiredTier: required, disabledMap:{}});
  const sorted = sortCandidates(candidates, policy, required);
  assert(sorted[0].id==='tier3-1' || sorted[0].id==='m3' || sorted[0].capability_tier==='Tier 3', 'workflow picks tier3 model');
}
// internal excluded
{
  const cand = filterCandidates(ranked, {requiredTier:'Tier 1', disabledMap:{}});
  assert(!cand.find(m=>m.internal), 'internal models excluded');
}
// disabled provider
{
  const disabledMap = vendorDisabledMap({ disabled_providers: ['gptx'] });
  const cand = filterCandidates(ranked, {requiredTier:'Tier 1', disabledMap});
  assert(!cand.find(m=>m.vendor==='gptx'), 'disabled vendor excluded');
}

console.log('unit tests OK');
