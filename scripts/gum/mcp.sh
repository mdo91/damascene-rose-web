#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "$0")/../.." && pwd)"
gum_binary="${GUM_BINARY:-$project_root/.tools/gum-keywords}"
if [[ ! -x "$gum_binary" ]]; then
  echo 'Build the pinned Gum adapter with bash scripts/gum/build-keyword-gum.sh first.' >&2
  exit 1
fi
# Interactive MCP is tied to the read-only Search Console profile. Keyword
# research uses the separately authorized, operation-allowlisted CLI collectors.
exec "$gum_binary" --profile damas-searchconsole mcp --stdio
