# Publishing

The [Package and publish](.github/workflows/release.yml) workflow builds the
extension for every platform jq-lsp has a release binary for, and publishes it
to the [VS Code Marketplace](https://marketplace.visualstudio.com/vscode) and
[Open VSX](https://open-vsx.org) (used by VSCodium, Cursor, Gitpod, etc.).

| VSIX | Contents |
|---|---|
| `vscode-jq-linux-x64.vsix`, `-linux-arm64`, `-darwin-x64`, `-darwin-arm64`, `-win32-x64`, `-win32-arm64` | Extension with the matching jq-lsp binary in `server/` |
| `vscode-jq-universal.vsix` | Extension without jq-lsp, used on other platforms (e.g. Alpine, web). jq-lsp must be in `$PATH` or set with `jq.serverPath` |

Both stores pick the right package for the user's platform automatically.

The extension runs jq-lsp from, in order: the `jq.serverPath` setting, the
bundled `server/jq-lsp`, then `jq-lsp` in `$PATH`.

## One-time account setup (TODO)

These steps need to be done by the upstream maintainer before the first
publish. Until then the workflow still builds and uploads the VSIX files as
workflow artifacts, but the publish job refuses to run.

1. **Pick a publisher ID.** Use the same ID on both stores. The extension ID
   becomes `<publisher>.vscode-jq`.

2. **VS Code Marketplace**
   - Create an Azure DevOps organization at https://dev.azure.com if you don't
     have one.
   - Create a personal access token with organization **All accessible
     organizations** and scope **Marketplace › Manage**.
   - Create the publisher at https://marketplace.visualstudio.com/manage.
   - Details: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

3. **Open VSX**
   - Log in at https://open-vsx.org with GitHub, link an Eclipse account and
     sign the publisher agreement.
   - Create an access token in the Open VSX user settings.
   - Create the namespace: `npx ovsx create-namespace <publisher> -p <token>`.
   - Optionally claim ownership of the namespace so it shows as verified:
     https://github.com/EclipseFdn/open-vsx.org/wiki/Namespace-Access
   - Details: https://github.com/eclipse/openvsx/wiki/Publishing-Extensions

4. **Repository secrets** (Settings › Secrets and variables › Actions):
   - `VSCE_PAT`: the Azure DevOps token.
   - `OVSX_PAT`: the Open VSX token.

   If one is missing, publishing to that store is skipped with a warning.

## Placeholders to fill in

| Where | Placeholder | Replace with |
|---|---|---|
| `package.json` | `"publisher": "dummy"` | The publisher ID from step 1. The publish job fails while it is still `dummy`. |
| `README.md`, "Install vscode extension" | `<publisher>` in the Marketplace and Open VSX links | The publisher ID from step 1. |
| `.github/workflows/release.yml` | `github.repository == 'wader/vscode-jq'` | Already the upstream repository. Only change it if the repository moves. Forks never publish. |

## Releasing

1. Bump `version` in `package.json` (and commit).
2. Tag and push: `git tag v<version> && git push origin v<version>`. The tag
   must match the `package.json` version.
3. The workflow packages, publishes to both stores and attaches all VSIX files
   to a GitHub release for the tag.

To bundle a newer jq-lsp, change `JQ_LSP_VERSION` in
`.github/workflows/release.yml`. New jq-lsp platforms need a line in
`scripts/fetch-jq-lsp.sh` and in the workflow's target matrix.

The npm package used by coc.nvim is not affected: `.npmignore` only includes
`client/out`, so the binaries never end up in it.

## Building a platform package locally

```sh
npm install
scripts/fetch-jq-lsp.sh linux-x64 0.1.18   # or darwin-arm64, win32-x64, ...
npm exec @vscode/vsce@latest -- package --target linux-x64
```

Run `rm -rf server` before packaging a universal VSIX.
