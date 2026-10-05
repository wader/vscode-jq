import * as fs from 'fs';
import * as path from 'path';
import type { ExtensionContext as ExtensionContext_vscode } from 'vscode';
import type {
    LanguageClient as LanguageClient_vscode,
    LanguageClientOptions as LanguageClientOptions_vscode,
    ServerOptions as ServerOptions_vscode,
} from 'vscode-languageclient/node';
import type {
    ExtensionContext as ExtensionContext_coc,
    LanguageClient as LanguageClient_coc,
    LanguageClientOptions as LanguageClientOptions_coc,
    ServerOptions as ServerOptions_coc,
} from 'coc.nvim';
type LanguageClient = LanguageClient_vscode | LanguageClient_coc;
type LanguageClientOptions = LanguageClientOptions_vscode | LanguageClientOptions_coc;
type ServerOptions = ServerOptions_vscode | ServerOptions_coc;
type ExtensionContext = ExtensionContext_vscode | ExtensionContext_coc;
let vlc;
// vscode or coc.nvim module, both provide workspace and window
let host;
try {
    vlc = require('vscode-languageclient/node');
    host = require('vscode');
} catch (error) {
    vlc = require('coc.nvim');
    host = vlc;
}
const LanguageClient = vlc.LanguageClient;

const serverBinary = process.platform === 'win32' ? 'jq-lsp.exe' : 'jq-lsp';

let client: LanguageClient;

// Resolve which jq-lsp to run, in order of preference:
// 1. the jq.serverPath setting
// 2. the binary bundled in platform-specific packages (see scripts/fetch-jq-lsp.sh)
// 3. jq-lsp found in $PATH
function serverCommand(context: ExtensionContext): string {
	const configured: string = host.workspace.getConfiguration('jq').get('serverPath', '');
	if (configured) {
		return configured;
	}

	const bundled = path.join(context.extensionPath, 'server', serverBinary);
	if (fs.existsSync(bundled)) {
		if (process.platform !== 'win32') {
			try {
				fs.accessSync(bundled, fs.constants.X_OK);
			} catch (error) {
				// make sure execute permission survived packaging and extraction
				fs.chmodSync(bundled, 0o755);
			}
		}
		return bundled;
	}

	return 'jq-lsp';
}

function inPath(command: string): boolean {
	const dirs = (process.env.PATH || '').split(path.delimiter);
	const exts = process.platform === 'win32'
		? (process.env.PATHEXT || '.EXE').split(';').concat([''])
		: [''];
	return dirs.some((dir) => exts.some((ext) => dir && fs.existsSync(path.join(dir, command + ext))));
}

export function activate(context: ExtensionContext) {
	const command = serverCommand(context);
	if (command === 'jq-lsp' && !inPath(command)) {
		host.window.showErrorMessage(
			'jq-lsp not found. Install it from https://github.com/wader/jq-lsp and make sure it is in $PATH, ' +
			'or set "jq.serverPath".'
		);
		return;
	}

	const serverOptions: ServerOptions = {
		run: {
			command: command,
			options: { env: process.env },
		},
		debug: {
			command: command,
			options: { env: Object.assign({}, process.env, { DEBUG: "1" }) },
		}
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'jq' }],
	};

	client = new LanguageClient(
		'jqlsp',
		'jq-lsp',
		serverOptions,
		clientOptions
	);

	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
