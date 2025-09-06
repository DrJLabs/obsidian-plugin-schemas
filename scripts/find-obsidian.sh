#!/usr/bin/env bash
set -euo pipefail

# Attempt to locate an Obsidian binary on Linux (AppImage or wrapper).

if command -v obsidian >/dev/null 2>&1; then
  command -v obsidian
  exit 0
fi

for p in "$HOME/AppImages/obsidian.appimage" "$HOME/AppImages/Obsidian-"*".AppImage" "$HOME/Applications/Obsidian-"*".AppImage" "$HOME/Downloads/Obsidian-"*".AppImage"; do
  if [[ -f "$p" ]]; then echo "$p"; exit 0; fi
done

# Parse .desktop entries installed by AppImageLauncher
for d in "$HOME/.local/share/applications" /usr/share/applications; do
  if [[ -d "$d" ]]; then
    c=$(grep -Rsl "^Name=Obsidian$" "$d" || true)
    for f in $c; do
      execLine=$(awk -F= '/^Exec=/{print $2; exit}' "$f")
      if [[ -n "$execLine" ]]; then echo "$execLine" | awk '{print $1}'; exit 0; fi
    done
  fi
done

echo "Could not find Obsidian binary. Set OBSIDIAN_BIN manually." >&2
exit 1

