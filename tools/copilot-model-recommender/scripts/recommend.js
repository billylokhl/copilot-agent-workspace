#!/usr/bin/env node
import { loadJson } from '../src/load-json.js';
import { computeCeilingRole, vendorDisabledMap, filterCandidates, sortCandidates } from '../src/recommendation.js';
import { applyPolicy } from '../src/ranking.js';
const argv = process.argv.slice(2);
function parseArgs(){
  const out = {roles:[], workflow:[]};
  for (let i=0;i<argv.length;i++){
    if (argv[i]==='--role') out.roles.push(argv[++i]);
    if (argv[i]==='--workflow') out.workflow = argv[++i].split(',');
  }
  return out;
}
const args = parseArgs();
const policyPath = '~/ .copilot/model-recommendation/model-capability-policy.json'.replace('/ ','');
const availPath = '~/ .copilot/model-recommendation/available-models.snapshot.json'.replace('/ ','');
const providerAvail = '~/ .copilot/model-recommendation/provider-availability.json'.replace('/ ','');
try{
  const policy = await loadJson(policyPath);
  const avail = await loadJson(availPath);
  // Prefer ranked snapshot if present (it contains policy fields attached)
  const rankedPath = '~/ .copilot/model-recommendation/ranked-models.snapshot.json'.replace('/ ','');
  let models = null;
  try{
    const ranked = await loadJson(rankedPath);
    models = ranked.models || ranked;
  }catch(e){
    // fallback: if ranked snapshot missing, attach policy to available models
    models = (avail.models||avail);
    models = await applyPolicy(models, policy);
  }
    // freshness warning: look for common timestamp fields
    const ts = avail.generated_at || avail.generatedAt || avail.capturedAt || avail.captured_at || avail.timestamp || null;
    if (!ts){ console.warn('Warning: available-models snapshot freshness unknown (no timestamp field)'); }
    else {
      const then = new Date(ts);
      const ageDays = (Date.now()-then.getTime())/(1000*60*60*24);
      if (ageDays>7) console.warn('Warning: available-models snapshot is older than 7 days (',Math.floor(ageDays),'days)');
    }
  let disabled = {};
  try{ disabled = await loadJson(providerAvail); }catch(e){ disabled = {}; }
  const disabledMap = vendorDisabledMap(disabled);
  const participants = args.roles.length?args.roles:args.workflow;
  const ceiling = computeCeilingRole(participants, policy);
  const requiredTier = policy.role_requirements[ceiling] || 0;
  const candidates = filterCandidates(models, {requiredTier, disabledMap});
  const sorted = sortCandidates(candidates, policy, requiredTier);
  const best = sorted[0];
  console.log('Ceiling Role:', ceiling);
  console.log('Participating:', participants.join(','));
  if (!best) { console.log('No candidate models'); process.exit(0); }
  console.log('Recommendation:');
  console.log('  Model:', best.id||best.family);
  console.log('  Vendor:', best.vendor);
  const tm = best.thinking_mode_guidance||best.thinking_mode||'Unknown';
  console.log('  Thinking Mode:', tm);
  console.log('Alternatives:');
  sorted.slice(1,4).forEach(s=>console.log(' -', s.id||s.family, s.vendor, s.capability_tier||'Unknown', s.cost_class||'Unknown'));
}catch(e){ console.error(e); process.exit(2); }
