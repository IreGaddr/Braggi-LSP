import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, ExtensionContext } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    // Get the user's configured path to the LSP executable
    const config = vscode.workspace.getConfiguration('braggi');
    let lspPath = config.get<string>('lspPath');

    // If not specified, try to guess the path based on platform
    if (!lspPath) {
        vscode.window.showWarningMessage(
            'Braggi LSP path not configured. Please set the "braggi.lspPath" setting to point to the Braggi LSP executable.'
        );
        return;
    }

    // Make sure the path is normalized
    lspPath = path.normalize(lspPath);

    // Define server options
    const serverOptions: ServerOptions = {
        command: lspPath,
        args: ['json']
    };

    // Define client options
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'braggi' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.bg')
        }
    };

    // Create the language client
    client = new LanguageClient(
        'braggiLanguageServer',
        'Braggi Language Server',
        serverOptions,
        clientOptions
    );

    // Register the restart command
    const restartCommand = vscode.commands.registerCommand('braggi.restart', () => {
        if (client) {
            client.stop().then(() => {
                client.start();
                vscode.window.showInformationMessage('Braggi Language Server restarted');
            });
        }
    });

    // Start the client and add to subscriptions
    client.start();
    context.subscriptions.push(client, restartCommand);

    // Show a message when the extension is activated
    vscode.window.showInformationMessage('Braggi Language Extension is now active!');
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
} 