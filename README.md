# vscode-jq

jq extension for VSCode

It provides:
- Syntax highlighting
- Syntax checking
- Auto completion
- Goto defintion
- Hover documentation
- Snippets

If your using [dash](https://kapeli.com/dash) or [zeal](https://zealdocs.org/) I would
recommend installing the jq docset. Search for "jq" under "User Contributed Docsets" in dash
or goto https://zealusercontributions.now.sh/.

## Requirements

Install [jq-lsp](https://github.com/wader/jq-lsp) and make sure it's in `$PATH`:
```sh
go install github.com/wader/jq-lsp@latest
cp $(go env GOPATH)/bin/jq-lsp /usr/local/bin
```

## Package and install manually

```sh
npm install
vsce package && code --install-extension vscode-jq-*.vsix
```

## Development

- Run `npm install`.
- Open VSCode
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.

