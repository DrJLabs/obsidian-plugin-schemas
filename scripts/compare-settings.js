#!/usr/bin/env node
/*
  Compare intended settings (as written to data.json) to settings captured by the
  Settings Snapshot helper plugin after Obsidian load.

  Success criteria: every key/value in intended must exist with deep-equal value
  in loaded.settings (allowing loaded to contain additional defaulted keys).
*/
const fs = require('fs');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function isObject(x){ return x && typeof x === 'object' && !Array.isArray(x); }

function diffSubset(intended, loaded, path = []) {
  const diffs = [];
  for (const k of Object.keys(intended)) {
    const ip = intended[k];
    const lp = loaded?.[k];
    const here = path.concat(k);
    if (isObject(ip)) {
      if (!isObject(lp)) { diffs.push({ path: here.join('.'), expected: ip, actual: lp }); continue; }
      diffs.push(...diffSubset(ip, lp, here));
    } else if (Array.isArray(ip)) {
      // Require same length and elements equal when array provided explicitly
      if (!Array.isArray(lp) || lp.length !== ip.length || JSON.stringify(lp) !== JSON.stringify(ip)) {
        diffs.push({ path: here.join('.'), expected: ip, actual: lp });
      }
    } else {
      if (ip !== lp) { diffs.push({ path: here.join('.'), expected: ip, actual: lp }); }
    }
  }
  return diffs;
}

function main(){
  const [,, intendedPath, loadedPath] = process.argv;
  if (!intendedPath || !loadedPath) {
    console.error('Usage: node scripts/compare-settings.js <intended-data.json> <snapshot.json>');
    process.exit(2);
  }
  const intended = readJson(intendedPath);
  const snapshot = readJson(loadedPath);
  const loaded = snapshot.settings || {};
  const diffs = diffSubset(intended, loaded);
  if (diffs.length) {
    console.error('Mismatch between intended and loaded settings:');
    for (const d of diffs) {
      console.error(`- ${d.path}: expected=${JSON.stringify(d.expected)} actual=${JSON.stringify(d.actual)}`);
    }
    process.exit(1);
  }
  console.log('Settings match expected subset.');
}

main();

