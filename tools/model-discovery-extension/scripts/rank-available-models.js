#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();

const AVAILABLE = path.join(homedir, '.copilot/model-recommendation/available-models.snapshot.json');
const POLICY = path.join(homedir, '.copilot/model-recommendation/model-capability-policy.json');
const OUT = path.join(homedir, '.copilot/model-recommendation/ranked-models.snapshot.json');

function read(p){ try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){ console.error('ERROR reading',p,e.message); process.exit(2);} }
const avail = read(AVAILABLE);
const policy = read(POLICY);

const families = policy.model_families || {};
const fallbackPolicy = policy._fallback || {};

function longestMatch(family){
  let best=null, bestk='';
  for(const k of Object.keys(families)){
    if(!k) continue;
    if(family && family.startsWith(k) && k.length>bestk.length){ bestk=k; best=families[k]; }
  }
  return {key:bestk, spec:best};
}

const results = [];
let explicit=0, fallback=0, internal=0;
for(const m of avail.models||[]){
  const family = m.family||m.id||'';
  const {key,spec} = longestMatch(family);
  let used_fallback = false;
  let matched_key = key || null;
  let policy_spec = spec || null;
  if(!policy_spec){
    if(policy.allow_id_fallback && policy.model_families[m.id]){ policy_spec = policy.model_families[m.id]; matched_key = m.id; }
  }
  if(!policy_spec){ policy_spec = fallbackPolicy; used_fallback=true; }

  const capability_tier = policy_spec && (policy_spec.capability_tier||policy_spec.tier) || null;
  const cost_class = policy_spec && (policy_spec.cost_class||policy_spec.cost) || null;
  const thinking = policy_spec && (policy_spec.thinking_mode_guidance||policy.thinking_mode_guidance) || policy.thinking_mode_guidance || null;
  const internalFlag = !!(policy_spec && policy_spec.internal) || !!m.internal;

  if(policy_spec && !used_fallback) explicit++;
  if(used_fallback) fallback++;
  if(internalFlag) internal++;

  const notes = [];
  if(!capability_tier) notes.push('no_capability_tier');
  if(!cost_class) notes.push('no_cost_class');

  results.push(Object.assign({}, m, {
    matched_policy_key: matched_key,
    capability_tier,
    cost_class,
    thinking_mode_guidance: thinking,
    internal: internalFlag,
    used_fallback_policy: used_fallback,
    notes
  }));
}

// sort helper: tiers and cost ordering from policy
const tierOrder = Object.keys(policy.capability_tiers||{});
const costOrder = Object.keys(policy.cost_classes||{});

results.sort((a,b)=>{
  const ta = tierOrder.indexOf(a.capability_tier); const tb = tierOrder.indexOf(b.capability_tier);
  if(ta!==tb) return ta - tb;
  const ca = costOrder.indexOf(a.cost_class); const cb = costOrder.indexOf(b.cost_class);
  if(ca!==cb) return ca - cb;
  // vendor preference
  const vp = Array.isArray(policy.vendor_preference) ? policy.vendor_preference : [];
  const va = vp.indexOf(a.vendor||'') ; const vb = vp.indexOf(b.vendor||'');
  if(va!==vb) return va - vb;
  // maxInputTokens desc
  const ma = (a.maxInputTokens||0), mb=(b.maxInputTokens||0);
  if(ma!==mb) return mb-ma;
  // stable tie
  return (a.id||'') .localeCompare(b.id||'') || (a.family||'').localeCompare(b.family||'') || (a.vendor||'').localeCompare(b.vendor||'');
});

const outDoc = { generated_at: new Date().toISOString(), models: results };
fs.mkdirSync(path.dirname(OUT), {recursive:true});
fs.writeFileSync(OUT, JSON.stringify(outDoc, null, 2));

console.log(`models loaded: ${(avail.models||[]).length}`);
console.log(`explicit policy matches: ${explicit}`);
console.log(`fallback matches: ${fallback}`);
console.log(`internal models: ${internal}`);
console.log(`output: ${OUT}`);
