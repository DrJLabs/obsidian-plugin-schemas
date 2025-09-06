#!/usr/bin/env node
// Convenience runner for the Calendar weekStart Playwright spec.
// Usage:
//   OBSIDIAN_BIN=... VAULT=... node scripts/e2e/run-calendar-weekstart.mjs
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const req = createRequire(import.meta.url);

function havePlaywright() {
  try { req('playwright'); return true; } catch { return false; }
}

async function main(){
  if (!process.env.OBSIDIAN_BIN || !process.env.VAULT) {
    console.error('Set OBSIDIAN_BIN and VAULT before running.');
    process.exit(2);
  }
  if (!havePlaywright()) {
    console.error('playwright is not installed. Install with: npm i -D playwright');
    process.exit(2);
  }
  const p = spawn(process.execPath, ['scripts/e2e/calendar-weekstart.spec.mjs'], { stdio: 'inherit', env: process.env });
  p.on('exit', (code) => process.exit(code || 0));
}

main();

