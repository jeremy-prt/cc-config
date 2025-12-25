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

  // Lire le settings.json et remplacer les variables
  let settingsContent = fs.readFileSync(srcSettings, 'utf-8');

  // Remplacer ${CLAUDE_CONFIG_DIR} par le chemin absolu
  // Utiliser des forward slashes (compatible Windows et Unix)
  const claudeDir = CLAUDE_DIR.replace(/\\/g, '/');
  settingsContent = settingsContent.replace(/\$\{CLAUDE_CONFIG_DIR\}/g, claudeDir);

  if (fs.existsSync(destSettings)) {
    console.log('   ⚠️  settings.json existe déjà');
    const examplePath = path.join(CLAUDE_DIR, 'settings.example.json');
    fs.writeFileSync(examplePath, settingsContent);
    console.log(`   → Copié vers settings.example.json`);
    console.log('   → Merge manuel recommandé');
  } else {
    fs.writeFileSync(destSettings, settingsContent);
    console.log('   ✓ settings.json installé');
  }
}

function installShellAliases() {
  const isWindows = process.platform === 'win32';

  console.log('🔧 Installation des alias shell...');

  if (isWindows) {
    // PowerShell profiles - install in both locations
    const profilePaths = [
      path.join(process.env.USERPROFILE, 'Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1'), // PowerShell 5.1
      path.join(process.env.USERPROFILE, 'Documents', 'PowerShell', 'Microsoft.PowerShell_profile.ps1') // PowerShell 7+
    ];

    const aliases = `
# Claude Code aliases
function cc { claude --dangerously-skip-permissions @args }
function ccc { claude --dangerously-skip-permissions -c @args }
`;

    let installed = false;
    let alreadyExists = false;

    for (const profilePath of profilePaths) {
      try {
        const profileDir = path.dirname(profilePath);
        const profileName = path.basename(path.dirname(profilePath));

        // Create profile directory if it doesn't exist
        if (!fs.existsSync(profileDir)) {
          fs.mkdirSync(profileDir, { recursive: true });
          console.log(`   📁 Dossier créé: ${profileName}`);
        }

        // Check if aliases already exist
        let content = '';
        if (fs.existsSync(profilePath)) {
          content = fs.readFileSync(profilePath, 'utf8');
        }

        if (!content.includes('Claude Code aliases')) {
          fs.appendFileSync(profilePath, aliases);

          // Verify it was written
          if (fs.existsSync(profilePath)) {
            console.log(`   ✓ Alias installés dans ${profileName}`);
            installed = true;
          } else {
            console.log(`   ⚠️  Échec création profil ${profileName}`);
          }
        } else {
          alreadyExists = true;
        }
      } catch (error) {
        console.log(`   ⚠️  Erreur ${path.basename(path.dirname(profilePath))}: ${error.message}`);
      }
    }

    if (installed) {
      console.log('   → Redémarre PowerShell pour les activer');
    } else if (alreadyExists) {
      console.log('   ✓ Alias déjà présents');
    }
  } else {
    // Unix-like (Mac/Linux)
    const homeDir = os.homedir();
    const shellFiles = [
      path.join(homeDir, '.zshrc'),
      path.join(homeDir, '.bashrc')
    ];

    const aliases = `
# Claude Code aliases
alias cc='claude --dangerously-skip-permissions'
alias ccc='claude --dangerously-skip-permissions -c'
`;

    let installed = false;
    for (const shellFile of shellFiles) {
      if (fs.existsSync(shellFile)) {
        let content = fs.readFileSync(shellFile, 'utf8');

        if (!content.includes('Claude Code aliases')) {
          fs.appendFileSync(shellFile, aliases);
          console.log(`   ✓ Alias installés dans ${path.basename(shellFile)}`);
          installed = true;
        }
      }
    }

    if (installed) {
      console.log('   → Redémarre ton terminal pour les activer');
    } else {
      console.log('   ✓ Alias déjà installés');
    }
  }
}

function installStatuslineDeps() {
  const statuslineDir = path.join(CLAUDE_DIR, 'scripts', 'statusline');

  if (!fs.existsSync(statuslineDir)) {
    return;
  }

  try {
    console.log('📦 Installation des dépendances statusline...');

    const isWindows = process.platform === 'win32';

    // Vérifier si bun est disponible
    try {
      const bunCheck = isWindows ? 'where bun' : 'which bun';
      execSync(bunCheck, { stdio: 'ignore' });
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
  const settingsFile = path.join(CLAUDE_DIR, 'settings.json');
  const statuslineDir = path.join(CLAUDE_DIR, 'scripts', 'statusline');

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

  console.log('\n⚙️  Configuration:');
  if (fs.existsSync(settingsFile)) {
    console.log('   ✓ Hooks installés (PreToolUse, Stop, Notification)');
  }
  if (fs.existsSync(statuslineDir)) {
    console.log('   ✓ Statusline configurée');
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

  // Installer alias shell
  installShellAliases();

  // Installer dépendances statusline
  installStatuslineDeps();

  // Rendre le wrapper statusline exécutable sur Mac/Linux
  if (process.platform !== 'win32') {
    try {
      const wrapperPath = path.join(CLAUDE_DIR, 'scripts', 'statusline-wrapper.sh');
      if (fs.existsSync(wrapperPath)) {
        execSync(`chmod +x "${wrapperPath}"`, { stdio: 'ignore' });
      }
    } catch (err) {
      // Ignore errors
    }
  }

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
