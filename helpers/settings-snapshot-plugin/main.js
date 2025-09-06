'use strict';
const { Plugin } = require('obsidian');

class SettingsSnapshot extends Plugin {
  async onload() {
    const defaults = {
      targetPluginId: '',
      outputPath: '.obsidian/plugins/settings-snapshot/output.json',
      delayMs: 3500,
      maxAttempts: 20,
      intervalMs: 1000,
      verbose: true
    };
    try {
      const loaded = await this.loadData();
      this.settings = Object.assign({}, defaults, loaded || {});
    } catch (e) {
      console.warn('[settings-snapshot] loadData failed, using defaults', e);
      this.settings = defaults;
    }

    // Schedule snapshot shortly after plugin load. In headless runs, plugins may
    // load after layout; so we also retry a few times until the target plugin is ready.
    window.setTimeout(() => {
      this.snapshotWithRetry().catch(e => console.error('[settings-snapshot] snapshot error', e));
    }, this.settings.delayMs);
  }

  log(...args){ if (this.settings.verbose) console.log('[settings-snapshot]', ...args); }

  async ensureDir(pathStr){
    const parts = pathStr.split('/');
    parts.pop(); // remove filename
    const dir = parts.join('/');
    if (dir) {
      try { await this.app.vault.adapter.mkdir(dir); } catch (_) {}
    }
  }

  async snapshotOnce() {
    const pid = this.settings.targetPluginId;
    if (!pid) {
      this.log('No targetPluginId configured');
      return;
    }
    const plugin = this.app.plugins?.plugins?.[pid];
    if (!plugin) {
      this.log('Target plugin not found:', pid);
      return;
    }
    const settings = plugin.settings ?? plugin._settings ?? plugin.plugin?.settings ?? null;
    const payload = {
      pluginId: pid,
      time: new Date().toISOString(),
      settings
    };
    const json = JSON.stringify(payload, null, 2);
    await this.ensureDir(this.settings.outputPath);
    await this.app.vault.adapter.write(this.settings.outputPath, json);
    this.log('wrote', this.settings.outputPath);
  }

  async snapshotWithRetry(){
    const attempts = Math.max(1, Number(this.settings.maxAttempts || 1));
    const interval = Math.max(250, Number(this.settings.intervalMs || 1000));
    for (let i = 1; i <= attempts; i++) {
      try {
        await this.snapshotOnce();
        // If file exists and settings are present, we consider it a success
        const exists = await this.app.vault.adapter.exists(this.settings.outputPath);
        if (exists) { this.log('snapshot success on attempt', i); return; }
      } catch (e) {
        console.error('[settings-snapshot] attempt', i, 'error', e);
      }
      this.log('retry', i, 'waiting', interval, 'ms');
      // eslint-disable-next-line no-await-in-loop
      await new Promise(res => setTimeout(res, interval));
    }
    this.log('exhausted attempts without snapshot');
  }
}

module.exports = SettingsSnapshot;
