import assert from 'assert';
import { validatePolicy } from '../src/policy.js';
import { applyPolicy } from '../src/ranking.js';
import { vendorDisabledMap, filterCandidates, sortCandidates, computeCeilingRole } from '../src/recommendation.js';

const policy = {
  cost_classes: { order: ['low','medium','high'] },
  capability_tiers: { 'Tier 1':{}, 'Tier 2':{}, 'Tier 3':{} },
  role_requirements: { Researcher:'Tier 1', Builder:'Tier 2', Architect:'Tier 3', Auditor:'Tier 3' },
  model_families: {
    'openai/': { capability_tier:'Tier 1', cost_class:'low' },
    'gptx/': { capability_tier:'Tier 3', cost_class:'high' },
    'builder/': { capability_tier:'Tier 2', cost_class:'medium' },
  },
  vendor_preference: { order: ['openai','gptx','builder'] },
  role_hierarchy: ['Researcher','Builder','Architect','Auditor']
};

validatePolicy(policy);

const avail = { models: [
  {id:'m1', family:'openai/text', vendor:'openai', maxInputTokens:2048},
  {id:'m2', family:'builder/fast', vendor:'builder', maxInputTokens:4096},
  {id:'m3', family:'gptx/ultra', vendor:'gptx', maxInputTokens:8192},
  {id:'m4', family:'internal/secret', vendor:'internal', internal:true, maxInputTokens:1024}
] };

const ranked = await applyPolicy(avail.models, policy);
assert(ranked.length>=3, 'ranking produced at least 3');
// Tier checks
const m1 = ranked.find(m=>m.id==='m1');
const m2 = ranked.find(m=>m.id==='m2');
const m3 = ranked.find(m=>m.id==='m3');
assert(m1.capability_tier==='Tier 1');
assert(m2.capability_tier==='Tier 2');
assert(m3.capability_tier==='Tier 3');
// Builder requires tier 2 -> should choose m2 over m1
{
  const disabled = {};
  const disabledMap = vendorDisabledMap(disabled);
  const participants = ['Builder'];
  const ceiling = computeCeilingRole(participants, policy);
  const required = policy.role_requirements[ceiling];
  const candidates = filterCandidates(ranked, {requiredTier: required, disabledMap});
  const sorted = sortCandidates(candidates, policy, required);
  assert(sorted[0].id==='m2', 'Builder picks tier2 model');
}
// Workflow Researcher,Architect,Auditor -> ceiling Architect -> tier3
{
  const participants = ['Researcher','Architect','Auditor'];
  const ceiling = computeCeilingRole(participants, policy);
  const required = policy.role_requirements[ceiling];
  const candidates = filterCandidates(ranked, {requiredTier: required, disabledMap:{}});
  const sorted = sortCandidates(candidates, policy, required);
  assert(sorted[0].id==='m3', 'workflow picks tier3 model');
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
