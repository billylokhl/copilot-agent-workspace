export function validatePolicy(policy) {
  if (!policy) throw new Error('policy missing');
  const ignored = (k) => k.startsWith('_');
  // cost_classes.order required
  if (!policy.cost_classes || !Array.isArray(policy.cost_classes.order)) throw new Error('cost_classes.order must be array');
  const knownRoles = ['Researcher','Builder','Architect','Auditor'];
  if (!policy.role_requirements) throw new Error('role_requirements missing');
  for (const r of Object.keys(policy.role_requirements)) {
    if (!knownRoles.includes(r)) throw new Error('unknown role in role_requirements: '+r);
  }
  // capability_tiers should exist and define known tier keys
  const capabilityTiers = policy.capability_tiers ? Object.keys(policy.capability_tiers).filter(k=>!k.startsWith('_')) : [];
  if (capabilityTiers.length===0) throw new Error('capability_tiers missing or empty');
  // role_requirements must map to one of the capability tier keys
  for (const v of Object.values(policy.role_requirements)){
    if (!capabilityTiers.includes(v)) throw new Error('role_requirements maps to unknown tier: '+v);
  }
  // model_families entries
  if (policy.model_families) {
    for (const [k,v] of Object.entries(policy.model_families)) {
      if (ignored(k)) continue;
      if (!v.capability_tier) throw new Error('model_families.'+k+'.capability_tier missing');
      if (!capabilityTiers.includes(v.capability_tier)) throw new Error('model_families.'+k+'.capability_tier invalid: '+v.capability_tier);
      if (!v.cost_class) throw new Error('model_families.'+k+'.cost_class missing');
      if (!policy.cost_classes.order.includes(v.cost_class)) throw new Error('model_families.'+k+'.cost_class invalid: '+v.cost_class);
      // internal flag is allowed
    }
  }
  if (policy.vendor_preference && !Array.isArray(policy.vendor_preference.order)) {
    throw new Error('vendor_preference.order must be array');
  }
  return true;
}

export function longestPrefixMatch(map, family) {
  if (!map) return null;
  let bestKey = null;
  for (const k of Object.keys(map)) {
    if (k.startsWith('_')) continue;
    if (family.startsWith(k)) {
      if (!bestKey || k.length > bestKey.length) bestKey = k;
    }
  }
  return bestKey;
}
