import { Injectable, BadRequestException } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { homedir, platform } from 'node:os';

@Injectable()
export class SystemService {
  /**
   * Opens a native OS folder-picker dialog and returns the chosen absolute path,
   * or null if the user cancelled. Throws if no picker is available on this OS.
   */
  async pickFolder(opts: { title?: string; defaultPath?: string } = {}): Promise<string | null> {
    const os = platform();
    if (os === 'darwin') return this.pickFolderMac(opts);
    if (os === 'win32') return this.pickFolderWin(opts);
    if (os === 'linux') return this.pickFolderLinux(opts);
    throw new BadRequestException(`Folder picker not supported on platform: ${os}`);
  }

  /**
   * Opens the host's default terminal app and runs the given command.
   * Used for interactive flows we can't drive inline — e.g. `gh auth login`.
   */
  async openTerminal(command: string): Promise<void> {
    if (!command || !command.trim()) throw new BadRequestException('command is required');
    const os = platform();
    if (os === 'darwin') return this.openTerminalMac(command);
    if (os === 'win32') return this.openTerminalWin(command);
    if (os === 'linux') return this.openTerminalLinux(command);
    throw new BadRequestException(`Terminal open not supported on platform: ${os}`);
  }

  private openTerminalMac(command: string): Promise<void> {
    const escaped = command.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const script = `tell application "Terminal"
  activate
  do script "${escaped}"
end tell`;
    return new Promise((resolve, reject) => {
      const child = spawn('osascript', ['-e', script], { stdio: 'ignore', detached: true });
      child.on('error', reject);
      child.on('spawn', () => { child.unref(); resolve(); });
    });
  }

  private openTerminalWin(command: string): Promise<void> {
    // Prefer Windows Terminal (`wt`); fall back to cmd.exe so the window stays open after exit.
    const safe = command.replace(/"/g, '\\"');
    const args = ['/c', 'start', 'wt.exe', '-d', '.', 'cmd.exe', '/k', safe];
    return new Promise((resolve, reject) => {
      const child = spawn('cmd.exe', args, { stdio: 'ignore', detached: true });
      child.on('error', reject);
      child.on('spawn', () => { child.unref(); resolve(); });
    });
  }

  private openTerminalLinux(command: string): Promise<void> {
    const safe = command.replace(/"/g, '\\"');
    const candidates: Array<[string, string[]]> = [
      ['x-terminal-emulator', ['-e', 'bash', '-lc', `${command}; exec bash`]],
      ['gnome-terminal', ['--', 'bash', '-lc', `${command}; exec bash`]],
      ['konsole', ['-e', 'bash', '-lc', `${command}; exec bash`]],
      ['xterm', ['-e', `bash -lc "${safe}; exec bash"`]],
    ];
    return new Promise((resolve, reject) => {
      const tryNext = (i: number) => {
        if (i >= candidates.length) return reject(new Error('No terminal emulator found'));
        const [cmd, args] = candidates[i]!;
        const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
        child.once('error', () => tryNext(i + 1));
        child.once('spawn', () => { child.unref(); resolve(); });
      };
      tryNext(0);
    });
  }

  private pickFolderMac(opts: { title?: string; defaultPath?: string }): Promise<string | null> {
    const title = (opts.title ?? 'Choose folder').replace(/"/g, '\\"');
    const defaultClause = opts.defaultPath
      ? ` default location (POSIX file "${this.expandHome(opts.defaultPath).replace(/"/g, '\\"')}")`
      : '';
    // `choose folder` raises error number -128 on cancel — swallow that and return empty.
    const script = `try
  set theFolder to choose folder with prompt "${title}"${defaultClause}
  POSIX path of theFolder
on error number -128
  return ""
end try`;
    return this.runPicker('osascript', ['-e', script]);
  }

  private pickFolderWin(opts: { title?: string; defaultPath?: string }): Promise<string | null> {
    const title = (opts.title ?? 'Choose folder').replace(/'/g, "''");
    const initial = opts.defaultPath
      ? `$dlg.SelectedPath = '${this.expandHome(opts.defaultPath).replace(/'/g, "''")}'; `
      : '';
    const script = `Add-Type -AssemblyName System.Windows.Forms | Out-Null; ` +
      `$dlg = New-Object System.Windows.Forms.FolderBrowserDialog; ` +
      `$dlg.Description = '${title}'; ` +
      `$dlg.ShowNewFolderButton = $true; ` +
      initial +
      `if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { Write-Output $dlg.SelectedPath }`;
    return this.runPicker('powershell.exe', ['-NoProfile', '-STA', '-Command', script]);
  }

  private async pickFolderLinux(opts: { title?: string; defaultPath?: string }): Promise<string | null> {
    const title = opts.title ?? 'Choose folder';
    const initial = opts.defaultPath ? this.expandHome(opts.defaultPath) : homedir();
    // Try zenity first, then kdialog.
    try {
      return await this.runPicker('zenity', [
        '--file-selection',
        '--directory',
        `--title=${title}`,
        `--filename=${initial}/`,
      ]);
    } catch {
      return this.runPicker('kdialog', ['--title', title, '--getexistingdirectory', initial]);
    }
  }

  private expandHome(p: string): string {
    if (p === '~') return homedir();
    if (p.startsWith('~/')) return homedir() + p.slice(1);
    return p;
  }

  private runPicker(cmd: string, args: string[]): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });
      child.on('error', (err) => reject(err));
      child.on('close', (code) => {
        // zenity/kdialog return non-zero on cancel — treat empty output as cancel.
        const out = stdout.trim();
        if (!out) return resolve(null);
        if (code !== 0 && cmd !== 'zenity' && cmd !== 'kdialog') {
          return reject(new Error(`Picker exited ${code}: ${stderr.trim() || stdout.trim()}`));
        }
        resolve(out);
      });
    });
  }
}
