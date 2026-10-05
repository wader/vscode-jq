# vscode-jq

jq extension for VSCode/(Neo)Vim.

It provides:
- Syntax highlighting
- Syntax checking
- Auto completion
- Goto defintion
- Hover documentation
- Snippets

![demo](https://raw.githubusercontent.com/wader/vscode-jq/master/media/demo.png)

## Install

### Install vscode extension

Search for "jq" in the VSCode extensions view, or install it from the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=<publisher>.vscode-jq)
or [Open VSX](https://open-vsx.org/extension/<publisher>/vscode-jq) (VSCodium etc.).

jq-lsp is bundled for Linux, macOS and Windows (x64 and arm64). On other platforms
install jq-lsp as described below, or point the `jq.serverPath` setting to it.

### Install jq-lsp

Only needed for vim, or on platforms without a bundled jq-lsp.
Install [jq-lsp](https://github.com/wader/jq-lsp) and make sure it's in `$PATH`:
```sh
go install github.com/wader/jq-lsp@latest
cp $(go env GOPATH)/bin/jq-lsp /usr/local/bin
```

### Install vim extension

- [coc-marketplace](https://github.com/fannheyward/coc-marketplace)
- [npm](https://www.npmjs.com/package/vscode-jq)
- vim:

```vim
" command line
CocInstall vscode-jq
" or add the following code to your vimrc
let g:coc_global_extensions = ['vscode-jq', 'other coc-plugins']
```

### Build and install vscode extension from source

```sh
npm install
npm exec @vscode/vsce@latest package && code --install-extension vscode-jq-*.vsix
# or if a reasonably new vsce is installed
vsce package && code --install-extension vscode-jq-*.vsix
```

This package does not include jq-lsp. See [PUBLISHING.md](PUBLISHING.md) for how to build
one that does, and how releases are published.

If your using [dash](https://kapeli.com/dash) or [zeal](https://zealdocs.org/) I would
recommend installing the jq docset. Search for "jq" under "User Contributed Docsets" in dash
or goto https://zealusercontributions.now.sh/.

## Development

- Run `npm install`.
- Open VSCode
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.

