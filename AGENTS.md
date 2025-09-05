# AGENTS.md · Obsidian Plugin Schemas

Authoritative guidance for automation agents working in this repository.

## Mission
Provide self-contained configuration + JSON Schema bundles for popular Obsidian plugins. Agents must use the root-level bundles and treat all plugin source folders as read-only unless a maintainer explicitly instructs otherwise.

## Repository Layout
- Root bundles (authoritative): `*-config-schema.md` files combine a concise configuration guide with the complete JSON Schema for each plugin’s `data.json`. These guides now surface key enums and add concise descriptions for properties to make allowed values obvious.
  - Available bundles: `age-encrypt-config-schema.md`, `calendar-config-schema.md`, `commander-config-schema.md`, `copilot-config-schema.md`, `dataview-config-schema.md`, `editing-toolbar-config-schema.md`, `homepage-config-schema.md`, `kanban-config-schema.md`, `local-rest-api-config-schema.md`, `meta-bind-config-schema.md`, `quickadd-config-schema.md`, `style-settings-config-schema.md`, `switcher-plus-config-schema.md`, `tasks-config-schema.md`, `templater-config-schema.md`.
- Plugin sources (read-only): upstream plugin code mirrors. Do not edit anything under these directories without explicit instruction: `obsidian-age-encrypt`, `obsidian-calendar-plugin`, `obsidian-commander`, `obsidian-copilot`, `obsidian-dataview`, `obsidian-editing-toolbar`, `obsidian-homepage`, `obsidian-kanban`, `obsidian-local-rest-api`, `obsidian-meta-bind-plugin`, `obsidian-style-settings`, `obsidian-switcher-plus`, `obsidian-tasks`, `quickadd`, `Templater`.

## How To Use The Bundles
- Open the matching `*-config-schema.md` for the plugin you need.
- Follow the “Guide” section to understand options, defaults, and constraints.
- Use the embedded JSON Schema to validate or generate the plugin’s `data.json`.
- Write the resulting file to `<vault>/.obsidian/plugins/<plugin-id>/data.json`.
- Prefer these bundles over any legacy docs or schemas inside plugin folders.

## Policy: Do Not Modify Plugin Folders
- Never alter files under `obsidian-*`, `quickadd`, or `Templater` unless explicitly instructed by the maintainer.
- Treat those folders as upstream snapshots. Changes there risk diverging from the source and breaking future refreshes.

## Consolidation And Clean-up
- Legacy per-plugin `CONFIGURATION.md` and `schema/*.json` files have been removed in favor of the root `*-config-schema.md` bundles.
- All documentation and schemas now live in the root bundles to simplify automation and avoid duplication.

## Workflow For Agents
- Read-first: locate the correct root bundle and extract the schema from it; do not browse plugin `schema/` directories.
- Provisioning: generate `data.json` from the bundle’s schema, then place it in the user’s vault path.
- Validation: use the same embedded schema for linting or CI checks.

## Git And Commits
- Keep the working tree clean; one focused branch per task.
- Conventional Commits for any changes to root bundles (e.g., `docs(tasks): clarify recurring options`).

## Safety And Secrets
- Do not commit secrets or user paths. Honor `.gitignore`.

## When In Doubt
- Ask for explicit approval before touching any file outside the root `*-config-schema.md` set.
