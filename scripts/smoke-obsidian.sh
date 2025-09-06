#!/usr/bin/env bash
set -euo pipefail

# Smoke-test a plugin settings round-trip by launching Obsidian headlessly.
#
# Requirements:
#  - Obsidian installed (set OBSIDIAN_BIN or ensure it's discoverable)
#  - Xvfb available (xvfb-run). If missing, script will skip runtime and only validate JSON shape.
#  - A distributable plugin folder (with manifest.json + main.js). Provide via --plugin-path.
#
# Usage:
#   scripts/smoke-obsidian.sh --bundle quickadd --plugin-id quickadd \
#     --plugin-path /path/to/quickadd-dist --data sample-data.json

usage() {
  echo "Usage: $0 --bundle <bundle-id|file> --plugin-id <id> --plugin-path <path> --data <data.json> [--timeout <secs>] [--no-snapshot]" >&2
}

BUNDLE=""; PID=""; PPATH=""; DATA=""; TIMEOUT="15"; VAULT=""; SNAPSHOT=1;
while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle) BUNDLE="$2"; shift 2;;
    --plugin-id) PID="$2"; shift 2;;
    --plugin-path) PPATH="$2"; shift 2;;
    --data) DATA="$2"; shift 2;;
    --timeout) TIMEOUT="$2"; shift 2;;
    --no-snapshot) SNAPSHOT=0; shift 1;;
    --vault) VAULT="$2"; shift 2;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if [[ -z "$BUNDLE" || -z "$PID" || -z "$PPATH" || -z "$DATA" ]]; then
  usage; exit 2
fi

if [[ ! -f "$DATA" ]]; then echo "data file not found: $DATA" >&2; exit 2; fi
if [[ ! -f "$PPATH/manifest.json" ]]; then echo "plugin path missing manifest.json: $PPATH" >&2; exit 2; fi
if [[ ! -f "$PPATH/main.js" ]]; then echo "plugin path missing main.js (built plugin required): $PPATH" >&2; exit 2; fi

ROOT="$(pwd)"
VAULT="${VAULT:-$ROOT/.tmp/vault-$PID-$(date +%s)}"
PLDIR="$VAULT/.obsidian/plugins/$PID"
mkdir -p "$PLDIR"

echo "[smoke] Vault: $VAULT"
rsync -a --delete "$PPATH/" "$PLDIR/"
cp "$DATA" "$PLDIR/data.json"

# Level 1: Schema validation pre-flight
node scripts/validate.js "$BUNDLE" "$PLDIR/data.json"

BIN="${OBSIDIAN_BIN:-}"
if [[ -z "$BIN" ]]; then
  BIN="$(command -v obsidian || true)"
fi

if [[ -z "$BIN" ]]; then
  echo "[smoke] OBSIDIAN_BIN not set and 'obsidian' not in PATH. Skipping runtime round-trip." >&2
  exit 0
fi

if ! command -v xvfb-run >/dev/null 2>&1; then
  echo "[smoke] xvfb-run not available. Skipping runtime round-trip. To enable: apt-get install xvfb." >&2
  exit 0
fi

echo "[smoke] Launching Obsidian headlessly for $TIMEOUT seconds…"
set +e
# Install snapshot helper unless disabled
if [[ "$SNAPSHOT" -eq 1 ]]; then
  SPDIR="$VAULT/.obsidian/plugins/settings-snapshot"
  mkdir -p "$SPDIR/output"
  rsync -a --delete helpers/settings-snapshot-plugin/ "$SPDIR/"
  # Configure target and output
  cat > "$SPDIR/data.json" <<JSON
{
  "targetPluginId": "$PID",
  "outputPath": ".obsidian/plugins/settings-snapshot/output/${PID}.loaded.json",
  "delayMs": 4000
}
JSON
fi

xvfb-run -a "$BIN" --vault "$VAULT" &
APP_PID=$!
sleep "$TIMEOUT"
kill "$APP_PID" >/dev/null 2>&1 || true
sleep 2
set -e

echo "[smoke] Validating persisted data.json after runtime…"
node scripts/validate.js "$BUNDLE" "$PLDIR/data.json"

if [[ "$SNAPSHOT" -eq 1 ]]; then
  SNAP_PATH="$VAULT/.obsidian/plugins/settings-snapshot/output/${PID}.loaded.json"
  if [[ -f "$SNAP_PATH" ]]; then
    echo "[smoke] Comparing intended vs loaded settings…"
    node scripts/compare-settings.js "$PLDIR/data.json" "$SNAP_PATH"
  else
    echo "[smoke] Snapshot output not found (plugin may not have loaded in time): $SNAP_PATH" >&2
    exit 1
  fi
fi

echo "[smoke] OK"
