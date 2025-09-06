#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch(e){ return null; } }

function main(){
  const c1 = path.join(process.env.HOME, '.config/obsidian/obsidian.json');
  const c2 = path.join(process.env.HOME, '.config/Obsidian/obsidian.json');
  const cfg = readJson(c1) || readJson(c2);
  if (!cfg || !cfg.vaults) { console.error('No Obsidian config found.'); process.exit(1); }
  const entries = Object.values(cfg.vaults).map(v => ({ path: v.path, open: !!v.open, ts: v.ts })).sort((a,b)=>b.ts-a.ts);
  for (const v of entries) {
    console.log(`${v.open ? '*' : ' '} ${v.path}`);
  }
}

main();

