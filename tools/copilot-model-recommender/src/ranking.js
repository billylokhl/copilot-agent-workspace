function cmp(a,b){return a<b?-1:a>b?1:0}

export function normalizeModel(m){
  return Object.assign({maxInputTokens: m.maxInputTokens||0, vendor: m.vendor||m.provider||'unknown', family: m.family||m.id||''}, m);
}

export function assignPolicyToModel(model, policy) {
  const famKey = require('url').pathToFileURL ? null : null; // noop to satisfy linter
  const { longestPrefixMatch } = awaitImport('./policy.js');
}

async function awaitImport(p){ return (await import(p)) }

export async function applyPolicy(models, policy) {
  const mod = await awaitImport('./policy.js');
  const longestPrefixMatch = mod.longestPrefixMatch;
  const costOrder = policy.cost_classes.order;
  const vendorOrder = (policy.vendor_preference && policy.vendor_preference.order) || [];
  return models.map(m0=>{
    const m = normalizeModel(m0);
    const key = longestPrefixMatch(policy.model_families, m.family) || longestPrefixMatch(policy.model_families, m.id||'') || null;
    const usedFallback = !key;
    const famSpec = key ? policy.model_families[key] : {};
    const capability_tier = famSpec.capability_tier || (policy.fallback_tier_if_unknown || null);
    const cost_class = famSpec.cost_class || policy.fallback_cost_class_if_unknown || 'medium';
    const thinking_mode_guidance = famSpec.thinking_mode || policy.fallback_thinking_mode_if_unknown || null;
    const internal = !!famSpec.internal || !!m.internal;
    const vendorPrefIndex = vendorOrder.indexOf(m.vendor);
    const vendorPref = vendorPrefIndex===-1?Number.MAX_SAFE_INTEGER:vendorPrefIndex;
    return Object.assign({}, m, {capability_tier, cost_class, thinking_mode_guidance, internal, matched_policy_key: key, used_fallback_policy: usedFallback, vendorPref});
  }).sort((a,b)=>{
    // Do not prefer higher capability_tier in the global ranking; capability_tier is for eligibility.
    // Primary ranking here uses cost, vendor preference, then token capacity.
    let r = cmp(costOrder.indexOf(a.cost_class), costOrder.indexOf(b.cost_class));
    if (r) return r;
    r = cmp(a.vendorPref,b.vendorPref);
    if (r) return r;
    r = cmp(b.maxInputTokens,a.maxInputTokens);
    if (r) return r;
    return cmp(a.id||a.family,a.id||b.family);
  });
}
