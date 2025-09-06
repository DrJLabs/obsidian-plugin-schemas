#!/usr/bin/env node
// Clone an existing local vault, install Calendar (bundled sample), write settings,
// then run the Calendar weekStart UI probe end-to-end using your AppImage.

import { spawnSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function sh(cmd, args, opts={}){ const r = spawnSync(cmd, args, { stdio: 'pipe', encoding: 'utf8', ...opts }); if (r.status !== 0) { throw new Error(`${cmd} ${args.join(' ')}\n${r.stderr}`); } return r.stdout.trim(); }

function findObsidian(){
  try { return process.env.OBSIDIAN_BIN || sh('bash',['scripts/find-obsidian.sh']); } catch { return null; }
}

function pickSourceVault(){
  const out = sh(process.execPath,['scripts/list-vaults.js']);
  const firstStar = out.split('\n').find(l=>l.startsWith('* '));
  const first = firstStar || out.split('\n')[0];
  return first.replace(/^\*?\s+/,'');
}

function cloneVault(src){
  const tgt = path.join(process.cwd(), '.tmp', `e2e-calendar-${Date.now()}`);
  fs.mkdirSync(tgt, { recursive: true });
  sh('rsync',['-a','--delete', src + '/', tgt + '/']);
  return tgt;
}

function installCalendarPlugin(vaultPath){
  const src = path.join(process.cwd(),'obsidian-tasks','resources','sample_vaults','Tasks-Demo','.obsidian','plugins','calendar');
  const dst = path.join(vaultPath,'.obsidian','plugins','calendar');
  if (!fs.existsSync(path.join(src,'main.js'))) throw new Error('Sample Calendar plugin not found: ' + src);
  fs.mkdirSync(dst, { recursive: true });
  sh('rsync',['-a','--delete', src + '/', dst + '/']);
  // Enable plugin
  const cpl = path.join(vaultPath,'.obsidian','community-plugins.json');
  let list = [];
  try { list = JSON.parse(fs.readFileSync(cpl,'utf8')); } catch {}
  if (!Array.isArray(list)) list = [];
  if (!list.includes('calendar')) list.push('calendar');
  fs.writeFileSync(cpl, JSON.stringify(list,null,2));
  return dst;
}

function writeCalendarSettings(vaultPath){
  const file = path.join(process.cwd(),'examples','calendar.defaults.json');
  const data = JSON.parse(fs.readFileSync(file,'utf8'));
  data.weekStart = 'monday';
  const pluginDir = path.join(vaultPath,'.obsidian','plugins','calendar');
  fs.writeFileSync(path.join(pluginDir,'data.json'), JSON.stringify(data,null,2));
}

async function run(){
  const bin = findObsidian();
  if (!bin) { console.error('Could not find Obsidian AppImage. Set OBSIDIAN_BIN.'); process.exit(2); }
  const srcVault = process.env.SOURCE_VAULT || pickSourceVault();
  const vault = cloneVault(srcVault);
  installCalendarPlugin(vault);
  writeCalendarSettings(vault);

  const env = { ...process.env, OBSIDIAN_BIN: bin, VAULT: vault, E2E_TIMEOUT: '45', REMOTE_PORT: '9223' };
  const p = spawn(process.execPath, ['scripts/e2e/run-calendar-weekstart.mjs'], { stdio: 'inherit', env });
  p.on('exit', (code)=> process.exit(code||0));
}

run();

