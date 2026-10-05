#!/bin/sh
# Download a prebuilt jq-lsp release binary into ./server/ so it gets bundled
# into a platform-specific VSIX.
#
# Usage: scripts/fetch-jq-lsp.sh <vscode-target> [jq-lsp-version]
#
# <vscode-target> is a `vsce package --target` value, e.g. linux-x64,
# darwin-arm64 or win32-x64. The version defaults to $JQ_LSP_VERSION.
set -eu

target="${1:?usage: $0 <vscode-target> [jq-lsp-version]}"
version="${2:-${JQ_LSP_VERSION:?jq-lsp version not given and JQ_LSP_VERSION not set}}"
version="${version#v}"

case "$target" in
	linux-x64) asset_platform=linux_amd64 ext=tar.gz ;;
	linux-arm64) asset_platform=linux_arm64 ext=tar.gz ;;
	darwin-x64) asset_platform=macos_amd64 ext=zip ;;
	darwin-arm64) asset_platform=macos_arm64 ext=zip ;;
	win32-x64) asset_platform=windows_amd64 ext=zip ;;
	win32-arm64) asset_platform=windows_arm64 ext=zip ;;
	*) echo "unsupported target: $target" >&2; exit 1 ;;
esac

asset="jq-lsp_${version}_${asset_platform}.${ext}"
base_url="https://github.com/wader/jq-lsp/releases/download/v${version}"

root="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

curl -fsSL -o "$tmp/$asset" "$base_url/$asset"
curl -fsSL -o "$tmp/checksums.txt" "$base_url/checksums.txt"

expected="$(awk -v a="$asset" '$2 == a { print $1 }' "$tmp/checksums.txt")"
if [ -z "$expected" ]; then
	echo "no checksum for $asset in checksums.txt" >&2
	exit 1
fi
if command -v sha256sum >/dev/null 2>&1; then
	actual="$(sha256sum "$tmp/$asset" | awk '{ print $1 }')"
else
	actual="$(shasum -a 256 "$tmp/$asset" | awk '{ print $1 }')"
fi
if [ "$expected" != "$actual" ]; then
	echo "checksum mismatch for $asset: expected $expected, got $actual" >&2
	exit 1
fi

rm -rf "$root/server"
mkdir -p "$root/server"
case "$ext" in
	tar.gz) tar --no-same-owner -xzf "$tmp/$asset" -C "$root/server" ;;
	zip) unzip -q "$tmp/$asset" -d "$root/server" ;;
esac
chmod +x "$root/server/"jq-lsp* 2>/dev/null || true

echo "fetched jq-lsp $version for $target:"
ls -l "$root/server"
