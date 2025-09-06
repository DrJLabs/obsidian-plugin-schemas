# Obsidian Plugin Schemas

Canonical, self-contained configuration bundles for popular Obsidian plugins. Each root-level `*-config-schema.md` file contains two parts:
- A concise configuration guide that documents options, defaults, and constraints.
- A full JSON Schema (Draft 2020‑12) to validate or generate each plugin’s `data.json`.

## Plugins Covered (root bundles)
- Age Encrypt: `age-encrypt-config-schema.md`
- Calendar: `calendar-config-schema.md`
- Commander: `commander-config-schema.md`
- Copilot: `copilot-config-schema.md`
- Dataview: `dataview-config-schema.md`
- Editing Toolbar: `editing-toolbar-config-schema.md`
- Homepage: `homepage-config-schema.md`
- Kanban: `kanban-config-schema.md`
- Local REST API: `local-rest-api-config-schema.md`
- Meta Bind: `meta-bind-config-schema.md`
- QuickAdd: `quickadd-config-schema.md`
- Style Settings: `style-settings-config-schema.md`
- Switcher++: `switcher-plus-config-schema.md`
- Tasks: `tasks-config-schema.md`
- Templater: `templater-config-schema.md`

Note: Per‑plugin `CONFIGURATION.md` and `schema/*.json` files were removed in favor of these root bundles to avoid duplication and drift from upstream sources.

## Usage
- Validate: point your JSON tooling at the embedded schema inside the matching `*-config-schema.md`.
- Provision: generate the plugin’s `data.json` from the schema and write it to `<vault>/.obsidian/plugins/<plugin-id>/data.json`.

### Enum Index
- Browse a compact, searchable list of all enumerations across bundles in `docs/enums-index.html`.
- Rebuild it locally with: `node scripts/build-enum-index.js`.

### Automated Validation
- Level 1 (static): Validate a `data.json` against a bundle schema
  - `node scripts/validate.js <bundle|plugin-id> <path/to/data.json>`
  - Example: `node scripts/validate.js quickadd examples/quickadd.data.json`
- Level 2 (runtime round‑trip, optional): Launch Obsidian headlessly and re‑validate persisted data
  - Requirements: `xvfb-run` and Obsidian binary (`$OBSIDIAN_BIN` or `obsidian` on PATH)
  - Provide a built plugin folder via `--plugin-path` (must contain `manifest.json` and `main.js`)
  - Example:
    - `scripts/smoke-obsidian.sh --bundle quickadd --plugin-id quickadd \
       --plugin-path /path/to/quickadd-dist --data ./examples/quickadd.data.json`

Level 3 UI/E2E plan lives in `docs/level3-e2e-plan.md`.

## Contributing
- Update the root bundles only. Treat `obsidian-*`, `quickadd`, and `Templater` source directories as read‑only mirrors.
- Keep prose aligned with schema. Enumerations should be listed in the guide when practical.
- Conventional Commits (subject ≤72 chars).

## License
- Schemas and guides are derived from plugin code under their respective licenses. This repo does not relicense upstream plugins; it only ships derived schemas and documentation.
