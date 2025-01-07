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
try {
    vlc = require('vscode-languageclient/node');
} catch (error) {
    vlc = require('coc.nvim');
}
const TransportKind = vlc.TransportKind;
const LanguageClient = vlc.LanguageClient;

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	const serverOptions: ServerOptions = {
		run: {
			command: "jq-lsp",
			options: { env: process.env },
			transport: TransportKind.stdio
		},
		debug: {
			command: "jq-lsp",
			options: { env: Object.assign({}, process.env, { DEBUG: "1" }) },
			transport: TransportKind.stdio
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
