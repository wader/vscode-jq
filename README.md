# vscode-jq

jq extension for VSCode

## Requirements

Install jq-lsp and make sure it's in `$PATH`:
```sh
go install github.com/wader/jq-lsp@latest
cp $(go env GOPATH)/bin/jq-lsp /usr/local/bin
```

## Development

- Run `npm install` in this folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.

## Package and install manually

```sh
vsce package && code --install-extension vscode-jq-*.vsix
```