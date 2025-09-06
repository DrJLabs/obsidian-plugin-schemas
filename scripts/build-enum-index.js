#!/usr/bin/env node
/*
  Build a compact HTML index of all enum values found in the embedded JSON Schemas
  inside the root-level *-config-schema.md bundles.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function listBundles() {
  return fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith('-config-schema.md'))
    .sort();
}

function extractSchemaJson(markdown) {
  // Pick the last fenced ```json block, which is the schema in these bundles
  const fence = /```json\n([\s\S]*?)```/g;
  let match, last = null;
  while ((match = fence.exec(markdown)) !== null) last = match[1];
  return last;
}

function getPluginTitle(markdown, fallback) {
  const m = markdown.match(/^#\s+(.+?)\s+—\s+Config \+ Schema/m);
  return (m && m[1]) || fallback;
}

function walk(obj, cb, pathArr = []) {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => walk(v, cb, pathArr.concat([`[${i}]`])));
    } else {
      if (Array.isArray(obj.enum)) {
        cb({ path: pathArr.slice(), values: obj.enum.slice() });
      }
      for (const [k, v] of Object.entries(obj)) {
        walk(v, cb, pathArr.concat([k]));
      }
    }
  }
}

function humanPath(jsonPath) {
  // Collapse noisy segments for readability
  const filtered = [];
  let skipNext = false;
  for (let i = 0; i < jsonPath.length; i++) {
    const seg = jsonPath[i];
    if (seg === 'properties' || seg === '$defs' || seg === 'definitions') continue;
    if (seg === 'items' || seg === 'oneOf' || seg === 'anyOf' || seg === 'allOf') continue;
    if (seg === 'enum') continue;
    filtered.push(seg.replace(/^\[(\d+)\]$/, '#$1'));
  }
  return filtered.join('.').replace(/\.\./g, '.');
}

function buildIndex() {
  const bundles = listBundles();
  const index = [];
  for (const file of bundles) {
    const md = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const plugin = getPluginTitle(md, file);
    const raw = extractSchemaJson(md);
    if (!raw) {
      index.push({ plugin, file, enums: [], error: 'no schema block found' });
      continue;
    }
    let schema;
    try {
      schema = JSON.parse(raw);
    } catch (e) {
      index.push({ plugin, file, enums: [], error: 'invalid JSON schema' });
      continue;
    }
    const enums = [];
    walk(schema, ({ path: p, values }) => {
      const hp = humanPath(p);
      if (!hp) return;
      enums.push({ path: hp, values });
    });
    // Deduplicate by path
    const byPath = new Map();
    for (const e of enums) {
      if (!byPath.has(e.path)) byPath.set(e.path, e.values);
    }
    index.push({ plugin, file, enums: Array.from(byPath, ([path, values]) => ({ path, values })) });
  }
  return index;
}

function toHtml(index) {
  const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const style = `body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",sans-serif;max-width:980px;margin:2rem auto;padding:0 1rem;color:#1b1f23}
h1{font-size:1.6rem;margin:0 0 1rem}
.bundle{margin:1.2rem 0;padding:1rem;border:1px solid #e1e4e8;border-radius:8px}
.bundle h2{font-size:1.1rem;margin:0 0 .5rem}
code,pre{background:#f6f8fa;border-radius:6px;padding:.2rem .4rem}
.path{font-family:ui-monospace,Consolas,Menlo,Monaco,monospace;color:#444}
.values{margin:.2rem 0 .6rem}
.file{color:#586069;font-size:.9rem}
`; 
  let out = `<!doctype html><meta charset="utf-8"/><title>Obsidian Plugin Schemas — Enum Index</title><style>${style}</style><body>`;
  out += `<h1>Enum Index for Root Bundles</h1>`;
  for (const b of index) {
    out += `<div class="bundle">`;
    out += `<h2>${escape(b.plugin)}</h2>`;
    out += `<div class="file">${escape(b.file)}</div>`;
    if (b.error) {
      out += `<div class="error">${escape(b.error)}</div>`;
    } else if (!b.enums.length) {
      out += `<div>No enums found.</div>`;
    } else {
      for (const e of b.enums) {
        out += `<div class="path">${escape(e.path)}</div>`;
        out += `<div class="values"><code>[${e.values.map(escape).join(', ')}]</code></div>`;
      }
    }
    out += `</div>`;
  }
  out += `</body>`;
  return out;
}

function main() {
  const index = buildIndex();
  const html = toHtml(index);
  const outDir = path.join(ROOT, 'docs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, 'enums-index.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main();

