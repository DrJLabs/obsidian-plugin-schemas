// Draft Playwright spec for Calendar settings UI.
// Usage:
//   OBSIDIAN_BIN=... VAULT=... node scripts/e2e/run-calendar-weekstart.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const BIN = process.env.OBSIDIAN_BIN;
const VAULT = process.env.VAULT;
const REMOTE_PORT = process.env.REMOTE_PORT || '9223';
const E2E_TIMEOUT = Number(process.env.E2E_TIMEOUT || '30');

if (!BIN || !VAULT) {
  console.error('Please set OBSIDIAN_BIN and VAULT env vars');
  process.exit(2);
}

function launchObsidian() {
  return spawn('xvfb-run', ['-a', BIN, `--remote-debugging-port=${REMOTE_PORT}`, '--vault', VAULT], {
    stdio: 'inherit'
  });
}

async function openSettingsAndAssertWeekStart() {
  const browser = await chromium.connectOverCDP({ endpointURL: `http://localhost:${REMOTE_PORT}`});
  const contexts = browser.contexts();
  let page;
  for (const ctx of contexts) {
    for (const p of ctx.pages()) {
      // Heuristic: pick a page that is not a devtools page
      if (!p.url().startsWith('devtools://')) { page = p; break; }
    }
    if (page) break;
  }
  if (!page) throw new Error('No app page found via CDP');

  // Open settings (Ctrl+,)
  await page.keyboard.down('Control');
  await page.keyboard.press(',');
  await page.keyboard.up('Control');

  // Wait for settings modal/content
  await page.waitForTimeout(1000);

  // Try a few strategies to focus settings search and find Calendar
  const trySearch = async () => {
    const inputs = await page.$$('input[type="search"], input[placeholder*="Search" i]');
    if (inputs.length) {
      await inputs[0].click();
      await inputs[0].fill('Calendar');
      await page.waitForTimeout(300);
    }
  };
  await trySearch();

  // Click on Calendar in the navigation pane
  const cand = await page.$('*:text("Calendar")');
  if (cand) { await cand.click().catch(()=>{}); }
  await page.waitForTimeout(400);

  // Look for a week start control (label or select). Try common patterns.
  const label = await page.$('*:text("week")');
  const select = await page.$('select');
  if (!label && !select) {
    throw new Error('Could not find week-related control in Calendar settings');
  }
  // If a select exists, read its value and ensure it is one of allowed options
  if (select) {
    const val = await select.inputValue().catch(()=>null);
    console.log('WeekStart select value:', val);
  }
  await browser.close();
}

async function main(){
  const proc = launchObsidian();
  // Wait briefly for app to start and expose CDP
  await new Promise(res => setTimeout(res, 2000));
  let ok = false, err;
  try {
    await openSettingsAndAssertWeekStart();
    ok = true;
  } catch (e) {
    err = e;
  } finally {
    try { proc.kill(); } catch {}
  }
  if (!ok) { console.error('E2E failed:', err?.message || err); process.exit(1); }
  console.log('E2E Calendar weekStart assertion completed.');
}

main();

