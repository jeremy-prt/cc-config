#!/usr/bin/env node

/**
 * Play finish.mp3 when Claude completes a response
 * Cross-platform sound player for macOS, Windows, and Linux
 */

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

try {
  const homeDir = os.homedir();
  const soundPath = path.join(homeDir, '.claude', 'song', 'finish.mp3');

  // Cross-platform sound playback
  if (os.platform() === 'darwin') {
    // macOS: use afplay
    execSync(`afplay "${soundPath}"`, { stdio: 'ignore', timeout: 3000 });
  } else if (os.platform() === 'win32') {
    // Windows: use PowerShell MediaPlayer
    const escapedPath = soundPath.replace(/\\/g, '\\\\');
    execSync(`powershell -c "Add-Type -AssemblyName presentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open('${escapedPath}'); $player.Play(); Start-Sleep -Milliseconds 1500"`, { stdio: 'ignore', timeout: 3000 });
  } else {
    // Linux: use mpg123 or ffplay if available
    try {
      execSync(`mpg123 -q "${soundPath}"`, { stdio: 'ignore', timeout: 3000 });
    } catch {
      execSync(`ffplay -nodisp -autoexit -loglevel quiet "${soundPath}"`, { stdio: 'ignore', timeout: 3000 });
    }
  }

  process.exit(0);
} catch (error) {
  // Silently fail - don't interrupt user experience
  process.exit(0);
}
