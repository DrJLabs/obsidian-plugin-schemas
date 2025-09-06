'use strict';
const { Plugin } = require('obsidian');

class SettingsSnapshot extends Plugin {
  async onload() {
    const defaults = {
      targetPluginId: '',
      outputPath: '.obsidian/plugins/settings-snapshot/output.json',
      delayMs: 3500
    };
    try {
      const loaded = await this.loadData();
      this.settings = Object.assign({}, defaults, loaded || {});
    } catch (e) {
      console.warn('[settings-snapshot] loadData failed, using defaults', e);
      this.settings = defaults;
    }

    this.registerEvent(this.app.workspace.on('layout-ready', () => {
      window.setTimeout(() => {
        this.snapshot().catch(e => console.error('[settings-snapshot] snapshot error', e));
      }, this.settings.delayMs);
    }));
  }

  async snapshot() {
    const pid = this.settings.targetPluginId;
    if (!pid) {
      console.log('[settings-snapshot] No targetPluginId configured');
      return;
    }
    const plugin = this.app.plugins?.plugins?.[pid];
    if (!plugin) {
      console.log('[settings-snapshot] target plugin not found:', pid);
      return;
    }
    const settings = plugin.settings ?? plugin._settings ?? plugin.plugin?.settings ?? null;
    const payload = {
      pluginId: pid,
      time: new Date().toISOString(),
      settings
    };
    const json = JSON.stringify(payload, null, 2);
    await this.app.vault.adapter.write(this.settings.outputPath, json);
    console.log('[settings-snapshot] wrote', this.settings.outputPath);
  }
}

module.exports = SettingsSnapshot;

