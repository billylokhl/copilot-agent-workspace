import { longestPrefixMatch } from './policy.js';

export function computeCeilingRole(participants, policy){
  // role_hierarchy is ordered low->high; pick the highest participant present
  if (policy.role_hierarchy && Array.isArray(policy.role_hierarchy)){
    for (let i = policy.role_hierarchy.length-1; i>=0; i--){
      const r = policy.role_hierarchy[i];
      if (participants.includes(r)) return r;
    }
  }
  // fallback: pick participant with highest role_requirements tier index (map tiers to capability_tiers order)
  let best = null; let bestIdx = -1;
  const tierKeys = policy.capability_tiers?Object.keys(policy.capability_tiers).filter(k=>!k.startsWith('_')):['Tier 1','Tier 2','Tier 3'];
  for (const p of participants){
    const tier = policy.role_requirements[p];
    const idx = tierKeys.indexOf(tier);
    if (idx>bestIdx){ bestIdx=idx; best=p }
  }
  return best;
}

export function vendorDisabledMap(avail){
  if (!avail) return {};
  if (Array.isArray(avail.disabled_providers)){
    const m = {}; avail.disabled_providers.forEach(v=>m[v]=true); return m;
  }
  return avail;
}

export function filterCandidates(models, {requiredTier, disabledMap}){
  // Build tier index map
  const tierKeys = models.__policy_tier_keys || null; // optional hint
  return models.filter(m=>{
    if (m.internal) return false;
    if (disabledMap && disabledMap[m.vendor]) return false;
    // compare tier indices
    const candidateTier = m.capability_tier || null;
    const required = requiredTier || null;
    if (!candidateTier || !required) return true; // if missing info, keep (caller may handle)
    const keys = tierKeys || ['Tier 1','Tier 2','Tier 3'];
    const ci = keys.indexOf(candidateTier);
    const ri = keys.indexOf(required);
    return ci>=0 && ri>=0 && ci>=ri;
  });
}

export function sortCandidates(candidates, policy, requiredTier){
  const costOrder = policy.cost_classes.order;
  const vendorOrder = (policy.vendor_preference && policy.vendor_preference.order) || [];
  const cmp = (a,b)=>a<b?-1:a>b?1:0;
  return candidates.sort((a,b)=>{
    let r = cmp(costOrder.indexOf(a.cost_class), costOrder.indexOf(b.cost_class)); if (r) return r;
    // If both meet requiredTier, prefer the lower capability tier (economy) to avoid up-ranking by capability
    if (requiredTier){
      const tierKeys = policy.capability_tiers?Object.keys(policy.capability_tiers).filter(k=>!k.startsWith('_')):['Tier 1','Tier 2','Tier 3'];
      const reqIdx = tierKeys.indexOf(requiredTier);
      const ai = tierKeys.indexOf(a.capability_tier);
      const bi = tierKeys.indexOf(b.capability_tier);
      if (ai>=reqIdx && bi>=reqIdx && ai!==bi){
        // prefer smaller index (lower tier) to save costs
        return cmp(ai,bi);
      }
    }
    r = cmp((vendorOrder.indexOf(a.vendor)===-1?999:vendorOrder.indexOf(a.vendor)), (vendorOrder.indexOf(b.vendor)===-1?999:vendorOrder.indexOf(b.vendor))); if (r) return r;
    r = cmp(b.maxInputTokens,a.maxInputTokens); if (r) return r;
    r = cmp(a.id||a.family,(b.id||b.family)); if (r) return r;
    return cmp(a.vendor,b.vendor);
  });
}
