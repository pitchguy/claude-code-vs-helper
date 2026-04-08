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
const vscode = __importStar(require("vscode"));
function showAutoDismissMessage(message, duration = 2000) {
    vscode.window.setStatusBarMessage(message, duration);
}
function activate(context) {
    const disposable = vscode.commands.registerCommand('claudeCodeHelper.insertToClaudeCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            showAutoDismissMessage('无活动编辑器');
            return;
        }
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        if (!selectedText || selectedText.trim() === '') {
            showAutoDismissMessage('未选中代码');
            return;
        }
        try {
            // Copy to clipboard
            await vscode.env.clipboard.writeText(selectedText);
            // Focus Claude Code panel
            await vscode.commands.executeCommand('claude-vscode.focus');
            // Wait for focus
            await new Promise(resolve => setTimeout(resolve, 200));
            // Try VSCode's paste command in the webview context
            try {
                await vscode.commands.executeCommand('workbench.action.terminal.paste');
            }
            catch {
                // Terminal paste not applicable
            }
            // showAutoDismissMessage('已复制，粘贴到 Claude Code');
        }
        catch (error) {
            await vscode.env.clipboard.writeText(selectedText);
            // showAutoDismissMessage('已复制');
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map