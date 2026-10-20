#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
source_dir="$root/.tools/gum-src"
pinned=f8ef8dad227fc1c57925ca02c0d90e60aec0d488
go_binary="${GUM_GO_BINARY:-$root/.tools/go/bin/go}"
if [[ ! -x "$go_binary" ]]; then go_binary="$(command -v go)"; fi
mkdir -p "$root/.tools"
if [[ ! -d "$source_dir/.git" ]]; then git clone --depth 1 --branch v2.3.1 https://github.com/ehmo/gum.git "$source_dir"; fi
[[ "$(git -C "$source_dir" rev-parse HEAD)" == "$pinned" ]] || { echo 'Gum source revision differs from the audited pin' >&2; exit 1; }
patch="$root/scripts/gum/google-ads-project-access.patch"
if git -C "$source_dir" apply --check "$patch" 2>/dev/null; then
  git -C "$source_dir" apply "$patch"
else
  git -C "$source_dir" apply --reverse --check "$patch"
fi
# Reject unrelated source changes before executing the build.
expected_diff="$(mktemp)"
actual_diff="$(mktemp)"
trap 'rm -f "$expected_diff" "$actual_diff"' EXIT
sed -E '/^index /d' "$patch" > "$expected_diff"
git -C "$source_dir" diff --no-ext-diff --no-color | sed -E '/^index /d' > "$actual_diff"
cmp -s "$expected_diff" "$actual_diff" || { echo 'Gum source has changes outside the audited patch' >&2; exit 1; }
[[ -z "$(git -C "$source_dir" ls-files --others --exclude-standard)" ]] || { echo 'Unexpected untracked Gum sources' >&2; exit 1; }
cd "$source_dir/apps/gum"
"$go_binary" test ./internal/adapters/googleads
"$go_binary" build -trimpath -ldflags='-X main.version=2.3.1-damas.1' -o "$root/.tools/gum-keywords" ./cmd/gum
"$root/.tools/gum-keywords" --version
