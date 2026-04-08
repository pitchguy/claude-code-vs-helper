import * as vscode from 'vscode';

function showAutoDismissMessage(message: string, duration: number = 2000): void {
    vscode.window.setStatusBarMessage(message, duration);
}

export function activate(context: vscode.ExtensionContext) {
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
            } catch {
                // Terminal paste not applicable
            }

            // showAutoDismissMessage('已复制，粘贴到 Claude Code');

        } catch (error) {
            await vscode.env.clipboard.writeText(selectedText);
            // showAutoDismissMessage('已复制');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
