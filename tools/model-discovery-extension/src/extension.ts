import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

interface ModelSnapshot {
  capturedAt: string;
  models: ModelMeta[];
}

interface ModelMeta {
  id: string;
  vendor: string;
  family: string;
  version: string;
  maxInputTokens: number;
}

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel('Model Discovery');

  const disposable = vscode.commands.registerCommand(
    'modelRecommendation.showAvailableModels',
    async () => {
      outputChannel.clear();
      outputChannel.show(true);
      outputChannel.appendLine('Model Recommendation: Show Available Models');
      outputChannel.appendLine('='.repeat(50));

      let models: vscode.LanguageModelChat[];
      try {
        models = await vscode.lm.selectChatModels({});
      } catch (err) {
        outputChannel.appendLine(`ERROR: Failed to call selectChatModels — ${err}`);
        return;
      }

      if (models.length === 0) {
        outputChannel.appendLine('No models returned. Ensure GitHub Copilot is active.');
        return;
      }

      const metas: ModelMeta[] = models.map((m) => ({
        id: m.id,
        vendor: m.vendor,
        family: m.family,
        version: m.version,
        maxInputTokens: m.maxInputTokens,
      }));

      outputChannel.appendLine(`Found ${metas.length} model(s):\n`);
      for (const meta of metas) {
        outputChannel.appendLine(`  id:             ${meta.id}`);
        outputChannel.appendLine(`  vendor:         ${meta.vendor}`);
        outputChannel.appendLine(`  family:         ${meta.family}`);
        outputChannel.appendLine(`  version:        ${meta.version}`);
        outputChannel.appendLine(`  maxInputTokens: ${meta.maxInputTokens}`);
        outputChannel.appendLine('');
      }

      const snapshot: ModelSnapshot = {
        capturedAt: new Date().toISOString(),
        models: metas,
      };

      const snapshotDir = path.join(os.homedir(), '.copilot', 'model-recommendation');
      const snapshotPath = path.join(snapshotDir, 'available-models.snapshot.json');

      try {
        fs.mkdirSync(snapshotDir, { recursive: true });
        fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf8');
        outputChannel.appendLine(`Snapshot written to: ${snapshotPath}`);
      } catch (err) {
        outputChannel.appendLine(`WARNING: Could not write snapshot — ${err}`);
      }
    }
  );

  context.subscriptions.push(outputChannel, disposable);
}

export function deactivate(): void {}
