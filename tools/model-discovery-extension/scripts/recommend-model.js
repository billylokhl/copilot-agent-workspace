#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();

const RANKED = path.join(homedir, '.copilot/model-recommendation/ranked-models.snapshot.json');
const POLICY = path.join(homedir, '.copilot/model-recommendation/model-capability-policy.json');
const AVAILABLE = path.join(homedir, '.copilot/model-recommendation/available-models.snapshot.json');
const PROVIDER = path.join(homedir, '.copilot/model-recommendation/provider-availability.json');

function read(p){ try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){ return null; } }
const ranked = read(RANKED);
if(!ranked) { console.error('ERROR: missing ranked snapshot:', RANKED); process.exit(2); }
const policy = read(POLICY) || {};
const avail = read(AVAILABLE);

// warn if available older than 7 days
if(avail && avail.generated_at){
  const age = Date.now() - Date.parse(avail.generated_at);
  if(age > 7*24*3600*1000) console.warn('WARNING: available-models snapshot older than 7 days');
}

let provider = read(PROVIDER) || {};
// tolerate older format: {anthropic: true}
if(provider && Object.keys(provider).length && !provider.disabled_providers){
  const disabled = [];
  for(const k of Object.keys(provider)){ if(provider[k]===false || provider[k]==='disabled' ) disabled.push(k); }
  if(disabled.length) provider = { disabled_providers: disabled, notes: {} };
}

// simple argv parsing
const rawArgs = process.argv.slice(2);
let rolesArg = null;
for(let i=0;i<rawArgs.length;i++){
  if(rawArgs[i]==='--role' && rawArgs[i+1]){ rolesArg = rawArgs[i+1]; i++; }
  else if(rawArgs[i]==='--workflow' && rawArgs[i+1]){ rolesArg = rawArgs[i+1]; i++; }
}
if(!rolesArg){ console.error('ERROR: need --role or --workflow'); process.exit(2); }
const roles = String(rolesArg).split(',').map(s=>s.trim()).filter(Boolean);
const known = policy.role_hierarchy || [];
for(const r of roles){ if(!known.includes(r)){ console.error('ERROR: unknown role', r); process.exit(2);} }

// participating agents = roles provided
const participants = roles;

// ceiling = highest required capability among participants
const roleReq = policy.role_requirements||{};
const tiers = policy.capability_tiers||{};
const tierOrder = Object.keys(tiers);
let ceilingIndex = -1, ceilingRole=null;
for(const r of participants){ const t = roleReq[r]; const idx = tierOrder.indexOf(t); if(idx>ceilingIndex){ ceilingIndex=idx; ceilingRole=t; } }
if(ceilingIndex<0){ console.error('ERROR: cannot determine capability ceiling'); process.exit(2); }

// filter candidates
const disabledProviders = provider.disabled_providers||[];
const candidates = ranked.models.filter(m=>{
  if(m.internal) return false;
  if(disabledProviders.includes((m.vendor||'').toLowerCase())) return false;
  const idx = tierOrder.indexOf(m.capability_tier);
  return idx>=0 && idx<=ceilingIndex;
});

if(!candidates.length){ console.error('ERROR: no eligible candidates'); process.exit(2); }

// ranking same as before
const costOrder = Object.keys(policy.cost_classes||{});
const vp = Array.isArray(policy.vendor_preference) ? policy.vendor_preference : [];
candidates.sort((a,b)=>{
  const ta = tierOrder.indexOf(a.capability_tier); const tb = tierOrder.indexOf(b.capability_tier);
  if(ta!==tb) return ta - tb;
  const ca = costOrder.indexOf(a.cost_class); const cb = costOrder.indexOf(b.cost_class);
  if(ca!==cb) return ca - cb;
  const va = vp.indexOf(a.vendor||''); const vb = vp.indexOf(b.vendor||'');
  if(va!==vb) return va - vb;
  const ma = (a.maxInputTokens||0), mb=(b.maxInputTokens||0); if(ma!==mb) return mb-ma;
  return (a.id||'').localeCompare(b.id||'');
});

const primary = candidates[0];
const alternatives = candidates.slice(1,4);

console.log('Recommendation');
console.log('Mode:', primary.thinking_mode_guidance || 'N/A');
console.log('Agent:', participants.join(','));
console.log('Model:', `${primary.id||primary.family} (${primary.vendor||'unknown'})`);
console.log('Thinking Mode:', primary.thinking_mode_guidance||'');
console.log('Session Recommendation: use', primary.id||primary.family);
console.log('Reason: matches ceiling', ceilingRole);

console.log('\nCeiling role:', ceilingRole);
console.log('Participating agents:', participants.join(','));
console.log('\nPrimary recommendation:');
console.log(`- ${primary.id||primary.family} vendor=${primary.vendor} tier=${primary.capability_tier} cost=${primary.cost_class}`);

console.log('\nTop 3 alternatives:');
for(const a of alternatives) console.log(`- ${a.id||a.family} vendor=${a.vendor} tier=${a.capability_tier} cost=${a.cost_class}`);

// best per vendor
const byVendor = {};
for(const c of candidates){ const v=c.vendor||'unknown'; if(!byVendor[v]) byVendor[v]=c; }
console.log('\nBest by vendor:');
for(const [v,m] of Object.entries(byVendor)) console.log(`- ${v}: ${m.id||m.family} tier=${m.capability_tier} cost=${m.cost_class}`);

if(disabledProviders.length) console.log('\nDisabled providers:', disabledProviders.join(','));

process.exit(0);
