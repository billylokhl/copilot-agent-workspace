#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');

const snapshotPath = path.join(os.homedir(), '.copilot', 'model-recommendation', 'available-models.snapshot.json');
if (!fs.existsSync(snapshotPath)) { console.error('No snapshot found'); process.exit(1); }
const avail = JSON.parse(fs.readFileSync(snapshotPath,'utf8'));
console.log('Ranking', (avail.models||[]).length, 'models — simple token-capacity sort');
const ranked = (avail.models||[]).slice().sort((a,b)=> b.maxInputTokens - a.maxInputTokens);
ranked.forEach((m,i)=> console.log(`${i+1}. ${m.id} (${m.vendor}) - maxTokens:${m.maxInputTokens}`));
