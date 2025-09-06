#!/usr/bin/env node
/*
  Validate a plugin settings JSON file against the embedded JSON Schema
  inside a root-level *-config-schema.md bundle.

  Usage:
    node scripts/validate.js <bundle-name|plugin-id> <path/to/data.json>

  Examples:
    node scripts/validate.js quickadd path/to/data.json
    node scripts/validate.js quickadd-config-schema.md path/to/data.json
*/
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

function findBundle(nameOrId) {
  const files = fs.readdirSync(process.cwd());
  // direct match
  if (files.includes(nameOrId)) return nameOrId;
  // try <id>-config-schema.md
  const candidate = files.find((f) => f.endsWith('-config-schema.md') && (f.startsWith(nameOrId + '-') || f.includes(`${nameOrId}-config-schema.md`)));
  if (candidate) return candidate;
  // try contains id
  const contains = files.find((f) => f.endsWith('-config-schema.md') && f.includes(nameOrId));
  return contains || null;
}

function extractSchemaFromBundle(filePath) {
  const md = fs.readFileSync(filePath, 'utf8');
  const re = /```json\n([\s\S]*?)```/g;
  let match, last = null;
  while ((match = re.exec(md)) !== null) last = match[1];
  if (!last) throw new Error(`No JSON schema block found in ${filePath}`);
  try {
    return JSON.parse(last);
  } catch (e) {
    throw new Error(`Invalid JSON schema in ${filePath}: ${e.message}`);
  }
}

function main() {
  const [,, bundleArg, dataPath] = process.argv;
  if (!bundleArg || !dataPath) {
    console.error('Usage: node scripts/validate.js <bundle-name|plugin-id> <path/to/data.json>');
    process.exit(2);
  }
  const bundle = findBundle(bundleArg);
  if (!bundle) {
    console.error(`Could not locate bundle for: ${bundleArg}`);
    process.exit(2);
  }
  const schema = extractSchemaFromBundle(path.join(process.cwd(), bundle));
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strictSchema: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const ok = validate(data);
  if (ok) {
    console.log(`OK: ${path.basename(dataPath)} conforms to ${bundle}`);
    process.exit(0);
  } else {
    console.error(`FAIL: ${path.basename(dataPath)} does not conform to ${bundle}`);
    for (const err of validate.errors || []) {
      console.error(`- ${err.instancePath || '(root)'} ${err.message}`);
      if (err.params && err.params.allowedValues) {
        console.error(`  allowed: ${err.params.allowedValues.join(', ')}`);
      }
    }
    process.exit(1);
  }
}

main();

