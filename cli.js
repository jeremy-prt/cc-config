#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const SCRIPT_DIR = __dirname;

function createBackup() {
  if (!fs.existsSync(CLAUDE_DIR)) {
    return null;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = `${CLAUDE_DIR}.backup.${timestamp}`;

  console.log(`📦 Création du backup: ${backupDir}`);
  fs.cpSync(CLAUDE_DIR, backupDir, { recursive: true });

  return backupDir;
}

function ensureDirectories() {
  console.log('📁 Création des dossiers...');
  const dirs = [
    CLAUDE_DIR,
    path.join(CLAUDE_DIR, 'commands'),
    path.join(CLAUDE_DIR, 'agents'),
    path.join(CLAUDE_DIR, 'scripts'),
    path.join(CLAUDE_DIR, 'song'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function copyDirectory(src, dest, label) {
  console.log(`${label}...`);

  if (!fs.existsSync(src)) {
    console.log(`   ⚠️  Dossier source non trouvé: ${src}`);
    return;
  }

  const files = fs.readdirSync(src);
  let count = 0;

  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
    count++;
  });

  console.log(`   ✓ ${count} fichier(s) installé(s)`);
}

function mergeSettings() {
  const srcSettings = path.join(SCRIPT_DIR, 'settings.json');
  const destSettings = path.join(CLAUDE_DIR, 'settings.json');

  if (!fs.existsSync(srcSettings)) {
    console.log('⚙️  Pas de settings.json à installer');
    return;
  }

  console.log('⚙️  Configuration des settings...');

  if (fs.existsSync(destSettings)) {
    console.log('   ⚠️  settings.json existe déjà');
    const examplePath = path.join(CLAUDE_DIR, 'settings.example.json');
    fs.copyFileSync(srcSettings, examplePath);
    console.log(`   → Copié vers settings.example.json`);
    console.log('   → Merge manuel recommandé');
  } else {
    fs.copyFileSync(srcSettings, destSettings);
    console.log('   ✓ settings.json installé');
  }
}

function installStatuslineDeps() {
  const statuslineDir = path.join(CLAUDE_DIR, 'scripts', 'statusline');

  if (!fs.existsSync(statuslineDir)) {
    return;
  }

  try {
    console.log('📦 Installation des dépendances statusline...');

    // Vérifier si bun est disponible
    try {
      execSync('which bun', { stdio: 'ignore' });
      execSync('bun install', {
        cwd: statuslineDir,
        stdio: 'ignore'
      });
      console.log('   ✓ Dépendances installées avec bun');
    } catch {
      // Fallback sur npm
      execSync('npm install --silent', {
        cwd: statuslineDir,
        stdio: 'ignore'
      });
      console.log('   ✓ Dépendances installées avec npm');
    }
  } catch (error) {
    console.log('   ⚠️  Impossible d\'installer les dépendances');
  }
}

function listInstalled() {
  const commandsDir = path.join(CLAUDE_DIR, 'commands');
  const agentsDir = path.join(CLAUDE_DIR, 'agents');

  console.log('\n📋 Commandes installées:');
  if (fs.existsSync(commandsDir)) {
    const commands = fs.readdirSync(commandsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
    commands.forEach(cmd => console.log(`   - /${cmd}`));
  }

  console.log('\n🤖 Agents installés:');
  if (fs.existsSync(agentsDir)) {
    const agents = fs.readdirSync(agentsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
    agents.forEach(agent => console.log(`   - @${agent}`));
  }
}

function setup() {
  console.log('🚀 Installation de Claude Config Jeremy\n');

  // Vérifier que Claude Code est installé
  try {
    const isWindows = process.platform === 'win32';
    const command = isWindows ? 'where claude' : 'which claude';
    execSync(command, { stdio: 'ignore' });
  } catch {
    console.error('⚠️  Claude Code n\'est pas installé.');
    console.error('   Installe-le d\'abord: https://claude.ai/download');
    process.exit(1);
  }

  // Backup
  const backupDir = createBackup();

  // Créer les dossiers
  ensureDirectories();

  // Copier les fichiers
  copyDirectory(
    path.join(SCRIPT_DIR, 'commands'),
    path.join(CLAUDE_DIR, 'commands'),
    '📝 Installation des commandes'
  );

  copyDirectory(
    path.join(SCRIPT_DIR, 'agents'),
    path.join(CLAUDE_DIR, 'agents'),
    '🤖 Installation des agents'
  );

  copyDirectory(
    path.join(SCRIPT_DIR, 'scripts'),
    path.join(CLAUDE_DIR, 'scripts'),
    '⚙️  Installation des scripts'
  );

  copyDirectory(
    path.join(SCRIPT_DIR, 'song'),
    path.join(CLAUDE_DIR, 'song'),
    '🔔 Installation des sons'
  );

  // Merger settings
  mergeSettings();

  // Installer dépendances statusline
  installStatuslineDeps();

  // Afficher résumé
  listInstalled();

  console.log('\n✅ Installation terminée!\n');
  console.log('💡 Teste avec: /liste-commande --exemples\n');

  if (backupDir) {
    console.log(`📁 Backup: ${backupDir}\n`);
  }
}

// CLI
const command = process.argv[2];

switch (command) {
  case 'setup':
    setup();
    break;
  default:
    console.log('Usage: npx claude-config-jeremy setup');
    process.exit(1);
}
