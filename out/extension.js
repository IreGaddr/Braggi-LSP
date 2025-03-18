"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    // Get the user's configured path to the LSP executable
    const config = vscode.workspace.getConfiguration('braggi');
    let lspPath = config.get('lspPath');
    // If not specified, try to guess the path based on platform
    if (!lspPath) {
        vscode.window.showWarningMessage('Braggi LSP path not configured. Please set the "braggi.lspPath" setting to point to the Braggi LSP executable.');
        return;
    }
    // Make sure the path is normalized
    lspPath = path.normalize(lspPath);
    // Define server options
    const serverOptions = {
        command: lspPath,
        args: ['json']
    };
    // Define client options
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'braggi' }],
        synchronize: {
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/*.bg')
        }
    };
    // Create the language client
    client = new node_1.LanguageClient('braggiLanguageServer', 'Braggi Language Server', serverOptions, clientOptions);
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
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
//# sourceMappingURL=extension.js.map