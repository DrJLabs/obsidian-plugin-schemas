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
  echo "Usage: $0 --bundle <bundle-id|file> --plugin-id <id> --data <data.json> [--plugin-path <path>] [--source-vault <vault>] [--timeout <secs>] [--no-snapshot] [--snapshot-wait <secs>] [--snapshot-delay <ms>]" >&2
}

BUNDLE=""; PID=""; PPATH=""; DATA=""; TIMEOUT="15"; VAULT=""; SOURCE_VAULT=""; SNAPSHOT=1; SNAP_WAIT=0; SNAP_DELAY=4000;
while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle) BUNDLE="$2"; shift 2;;
    --plugin-id) PID="$2"; shift 2;;
    --plugin-path) PPATH="$2"; shift 2;;
    --source-vault) SOURCE_VAULT="$2"; shift 2;;
    --data) DATA="$2"; shift 2;;
    --timeout) TIMEOUT="$2"; shift 2;;
    --no-snapshot) SNAPSHOT=0; shift 1;;
    --snapshot-wait) SNAP_WAIT="$2"; shift 2;;
    --snapshot-delay) SNAP_DELAY="$2"; shift 2;;
    --vault) VAULT="$2"; shift 2;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if [[ -z "$BUNDLE" || -z "$PID" || -z "$DATA" ]]; then
  usage; exit 2
fi

if [[ ! -f "$DATA" ]]; then echo "data file not found: $DATA" >&2; exit 2; fi

ROOT="$(pwd)"
VAULT="${VAULT:-$ROOT/.tmp/vault-$PID-$(date +%s)}"
PLDIR="$VAULT/.obsidian/plugins/$PID"

# If source vault provided, clone it first to preserve user's vault
if [[ -n "$SOURCE_VAULT" ]]; then
  echo "[smoke] Cloning source vault: $SOURCE_VAULT -> $VAULT"
  rsync -a --delete "$SOURCE_VAULT/" "$VAULT/"
fi

mkdir -p "$PLDIR"

# Resolve plugin path: prefer explicit --plugin-path, else copy from source vault if present
if [[ -n "$PPATH" ]]; then
  if [[ ! -f "$PPATH/manifest.json" || ! -f "$PPATH/main.js" ]]; then
    echo "plugin path invalid (need manifest.json and main.js): $PPATH" >&2; exit 2
  fi
  rsync -a --delete "$PPATH/" "$PLDIR/"
else
  if [[ -n "$SOURCE_VAULT" && -d "$SOURCE_VAULT/.obsidian/plugins/$PID" ]]; then
    echo "[smoke] Using plugin from source vault"
    rsync -a --delete "$SOURCE_VAULT/.obsidian/plugins/$PID/" "$PLDIR/"
  else
    echo "No --plugin-path provided and plugin not found in source vault. Aborting." >&2
    exit 2
  fi
fi

echo "[smoke] Vault: $VAULT"
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
  "delayMs": ${SNAP_DELAY}
}
JSON
  # Ensure snapshot plugin is enabled
  CPLUGS="$VAULT/.obsidian/community-plugins.json"
  if [[ -f "$CPLUGS" ]]; then
    if ! rg -q '"settings-snapshot"' "$CPLUGS"; then
      tmpfile=$(mktemp)
      jq '. + ["settings-snapshot"]' "$CPLUGS" > "$tmpfile" && mv "$tmpfile" "$CPLUGS"
    fi
  else
    echo '["settings-snapshot"]' > "$CPLUGS"
  fi
fi

SNAP_PATH="$VAULT/.obsidian/plugins/settings-snapshot/output/${PID}.loaded.json"

xvfb-run -a "$BIN" --remote-debugging-port=0 --vault "$VAULT" &
APP_PID=$!
# Wait up to max(TIMEOUT, SNAP_WAIT) for snapshot
MAX_WAIT=$TIMEOUT
if [[ $SNAP_WAIT -gt $MAX_WAIT ]]; then MAX_WAIT=$SNAP_WAIT; fi
elapsed=0
found=0
while [[ $elapsed -lt $MAX_WAIT ]]; do
  if [[ -f "$SNAP_PATH" ]]; then found=1; break; fi
  sleep 1
  elapsed=$((elapsed+1))
done
kill "$APP_PID" >/dev/null 2>&1 || true
sleep 2
set -e

echo "[smoke] Validating persisted data.json after runtime…"
node scripts/validate.js "$BUNDLE" "$PLDIR/data.json"

if [[ "$SNAPSHOT" -eq 1 ]]; then
  if [[ -f "$SNAP_PATH" ]]; then
    echo "[smoke] Comparing intended vs loaded settings…"
    node scripts/compare-settings.js "$PLDIR/data.json" "$SNAP_PATH"
  else
    echo "[smoke] Snapshot output not found after waiting $MAX_WAIT sec: $SNAP_PATH" >&2
    exit 1
  fi
fi

echo "[smoke] OK"
