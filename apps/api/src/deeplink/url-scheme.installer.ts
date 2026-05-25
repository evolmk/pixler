import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface SchemeStatus {
  registered: boolean;
  platform: string;
  method: string;
}

export function getSchemeStatus(): SchemeStatus {
  const platform = process.platform;

  if (platform === 'darwin') {
    try {
      const result = execSync(
        'defaults read com.apple.LaunchServices/com.apple.launchservices.secure LSHandlers 2>/dev/null | grep -c pixler',
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
      ).trim();
      return { registered: parseInt(result, 10) > 0, platform: 'darwin', method: 'LaunchServices' };
    } catch {
      return { registered: false, platform: 'darwin', method: 'LaunchServices' };
    }
  }

  if (platform === 'win32') {
    try {
      execSync('reg query HKCU\\Software\\Classes\\pixler', { stdio: 'pipe' });
      return { registered: true, platform: 'win32', method: 'Registry' };
    } catch {
      return { registered: false, platform: 'win32', method: 'Registry' };
    }
  }

  if (platform === 'linux') {
    const desktopPath = join(homedir(), '.local/share/applications/pixler-handler.desktop');
    return {
      registered: existsSync(desktopPath),
      platform: 'linux',
      method: 'xdg-mime',
    };
  }

  return { registered: false, platform, method: 'unsupported' };
}

export function registerScheme(apiPort = 7777): void {
  const platform = process.platform;

  if (platform === 'darwin') {
    // Write a tiny AppleScript app that forwards pixler:// to the local API
    const appDir = join(homedir(), 'Applications', 'PixlerURLHandler.app', 'Contents', 'MacOS');
    mkdirSync(appDir, { recursive: true });
    const infoPlist = join(homedir(), 'Applications', 'PixlerURLHandler.app', 'Contents', 'Info.plist');
    writeFileSync(
      infoPlist,
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleIdentifier</key><string>app.pixler.urlhandler</string>
  <key>CFBundleName</key><string>PixlerURLHandler</string>
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLSchemes</key>
      <array><string>pixler</string></array>
    </dict>
  </array>
  <key>CFBundleExecutable</key><string>pixler-handler</string>
</dict>
</plist>`,
    );
    const script = join(appDir, 'pixler-handler');
    writeFileSync(
      script,
      `#!/bin/bash\ncurl -s -X POST http://localhost:${apiPort}/api/deeplink -H 'Content-Type: application/json' -d "{\\"url\\":\\"$1\\"}" &`,
    );
    execSync(`chmod +x "${script}"`);
    execSync(`/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -f "${join(homedir(), 'Applications', 'PixlerURLHandler.app')}"`);
    return;
  }

  if (platform === 'win32') {
    const apiUrl = `http://localhost:${apiPort}/api/deeplink`;
    const cmds = [
      `reg add HKCU\\Software\\Classes\\pixler /ve /d "URL:pixler Protocol" /f`,
      `reg add HKCU\\Software\\Classes\\pixler /v "URL Protocol" /d "" /f`,
      `reg add "HKCU\\Software\\Classes\\pixler\\shell\\open\\command" /ve /d "curl -s -X POST ${apiUrl} -H \\"Content-Type: application/json\\" -d {\\"url\\":\\"%1\\"}" /f`,
    ];
    for (const cmd of cmds) execSync(cmd, { stdio: 'pipe' });
    return;
  }

  if (platform === 'linux') {
    const dir = join(homedir(), '.local/share/applications');
    mkdirSync(dir, { recursive: true });
    const desktopPath = join(dir, 'pixler-handler.desktop');
    writeFileSync(
      desktopPath,
      `[Desktop Entry]
Name=Pixler URL Handler
Exec=sh -c 'curl -s -X POST http://localhost:${apiPort}/api/deeplink -H "Content-Type: application/json" -d "{\\"url\\":\\"%u\\"}"'
Type=Application
MimeType=x-scheme-handler/pixler;
NoDisplay=true`,
    );
    try {
      execSync(`xdg-mime default pixler-handler.desktop x-scheme-handler/pixler`, { stdio: 'pipe' });
      execSync(`update-desktop-database "${dir}"`, { stdio: 'pipe' });
    } catch { /* best-effort */ }
  }
}
