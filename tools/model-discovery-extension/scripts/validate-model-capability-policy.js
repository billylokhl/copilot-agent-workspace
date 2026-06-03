#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const POLICY = path.join(require('os').homedir(), '.copilot/model-recommendation/model-capability-policy.json');

function fail(msg){
  console.error('ERROR:', msg);
  process.exitCode = 2;
  throw new Error(msg);
}

let raw;
try{
  raw = fs.readFileSync(POLICY, 'utf8');
}catch(e){
  fail(`cannot read policy file: ${POLICY}`);
}

let doc;
try{ doc = JSON.parse(raw); }catch(e){ fail(`invalid JSON: ${e.message}`); }

const req = ['schema_version','capability_tiers','role_hierarchy','role_requirements','model_families','cost_classes','thinking_mode_guidance'];
for(const k of req){ if(!(k in doc)) fail(`missing required top-level field: ${k}`); }

const roles = ['Researcher','Builder','Architect','Auditor'];
for(const r of roles){ if(!doc.role_hierarchy || !doc.role_hierarchy.includes(r)) fail(`role_hierarchy missing role: ${r}`); }

// validate role_requirements map to known capability tiers
const tiers = Object.keys(doc.capability_tiers||{});
for(const [role, tier] of Object.entries(doc.role_requirements||{})){
  if(role.startsWith('_')) continue;
  if(!tiers.includes(tier)) fail(`role_requirements for ${role} references unknown tier: ${tier}`);
}

// validate model_families map to known capability tier and cost class
const costClasses = Object.keys(doc.cost_classes||{});
for(const [fam, spec] of Object.entries(doc.model_families||{})){
  if(fam.startsWith('_')) continue;
  const tier = spec.capability_tier || spec.tier || spec.capabilityTier || spec.capability;
  const cost = spec.cost_class || spec.costClass || spec.cost;
  if(tier && !tiers.includes(tier)) fail(`model_families.${fam} references unknown capability tier: ${tier}`);
  if(cost && !costClasses.includes(cost)) fail(`model_families.${fam} references unknown cost class: ${cost}`);
}

// vendor_preference optional
if('vendor_preference' in doc){
  if(!Array.isArray(doc.vendor_preference)) fail('vendor_preference must be an array when present');
}

console.log('PASS: model capability policy validated');
process.exit(0);
