# Context de débugage Windows - cc-config

**Date:** 2025-12-25
**Package:** @jeremyy_prt/cc-config
**Version actuelle:** 1.1.2
**Problèmes:** Statusline ne s'affiche pas sur Windows

---

## 📋 Résumé du projet

Package npm qui installe une configuration personnalisée pour Claude Code avec :
- 7 commandes custom (`/commit`, `/corriger-orthographe`, `/creer-agent`, `/creer-commande`, `/liste-commande`, `/memoire-claude`, `/surveiller-ci`)
- 4 agents (`@corriger-orthographe`, `@explorer-code`, `@explorer-docs`, `@recherche-web`)
- Hooks de sécurité (validation bash)
- Statusline personnalisée avec Git et coûts
- Alias shell `cc` et `ccc` pour bypass mode

**Repo:** https://github.com/jeremy-prt/cc-config

---

## ✅ Ce qui fonctionne maintenant (TESTÉ ET CONFIRMÉ)

### Installation automatique
```bash
npx @jeremyy_prt/cc-config@latest setup
```

- ✅ **Commandes** : Toutes installées correctement dans `~/.claude/commands/`
- ✅ **Agents** : Tous installés correctement dans `~/.claude/agents/`
- ✅ **Scripts** : Installés dans `~/.claude/scripts/`
- ✅ **Settings.json** : Installé avec hooks
- ✅ **Alias PowerShell** : `cc` et `ccc` s'installent automatiquement dans le profil PowerShell (**TESTÉ SUR WINDOWS - FONCTIONNE**)
- ✅ **Cross-platform** : Fonctionne sur Mac, Linux, et Windows

**Confirmation test Windows (2025-12-25) :**
- Installation réussie avec `npx @jeremyy_prt/cc-config@latest setup`
- Alias `cc` et `ccc` fonctionnent après redémarrage PowerShell
- `cc --version` ouvre Claude Code avec bypass permissions ✅

### Alias PowerShell (RÉSOLU v1.1.2)

**Problème initial :** Les alias ne s'installaient pas automatiquement sur Windows

**Solution :** Amélioration du code dans `cli.js` ligne 91-185
- Gestion d'erreur détaillée par profil
- Logging amélioré montrant quand dossier est créé
- Vérifie que fichier existe après création
- Support PowerShell 5.1 ET PowerShell 7+

**Résultat :**
```
🔧 Installation des alias shell...
   📁 Dossier créé: WindowsPowerShell
   ✓ Alias installés dans WindowsPowerShell
   → Redémarre PowerShell pour les activer
```

**Localisation des profils :**
- PowerShell 5.1: `C:\Users\{USER}\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
- PowerShell 7+: `C:\Users\{USER}\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`

**Utilisation :**
```powershell
# Après redémarrage de PowerShell
cc --version          # → claude --dangerously-skip-permissions --version
ccc "ta requête"      # → claude --dangerously-skip-permissions -c "ta requête"
```

---

## ❌ Problème actuel : Statusline

### Symptôme
La statusline ne s'affiche pas dans Claude Code sur Windows

### Configuration actuelle
Fichier `~/.claude/settings.json` :
```json
{
  "statusLine": {
    "type": "command",
    "command": "node ${CLAUDE_CONFIG_DIR}/scripts/statusline/src/index.ts",
    "padding": 0
  }
}
```

### Problème suspecté
**Node ne peut pas exécuter directement des fichiers TypeScript (.ts)**

Sur Mac, ça marche probablement parce que :
- Bun est installé et gère automatiquement TypeScript
- Ou il y a un runtime TypeScript global

Sur Windows :
- `node` seul ne peut pas exécuter `.ts`
- Il faut soit :
  1. Compiler le TypeScript en JavaScript
  2. Utiliser `ts-node`
  3. Utiliser `bun` si installé

### Fichiers concernés
- **Source TypeScript:** `~/.claude/scripts/statusline/src/index.ts`
- **Config:** `~/.claude/scripts/statusline/package.json`
- **Lock file:** `~/.claude/scripts/statusline/bun.lockb`

---

## 🔍 Commandes de diagnostic Windows

### Vérifier l'installation

```powershell
# 1. Vérifier que Claude Code est installé
claude --version

# 2. Vérifier les alias PowerShell
cat $PROFILE

# 3. Tester les alias
cc --version
ccc --version

# 4. Vérifier les fichiers installés
ls $env:USERPROFILE\.claude\

# 5. Lister les commandes
ls $env:USERPROFILE\.claude\commands\

# 6. Lister les agents
ls $env:USERPROFILE\.claude\agents\

# 7. Vérifier settings.json
cat $env:USERPROFILE\.claude\settings.json
```

### Débugger la statusline

```powershell
# 1. Vérifier que le dossier statusline existe
ls $env:USERPROFILE\.claude\scripts\statusline\

# 2. Vérifier que index.ts existe
Test-Path $env:USERPROFILE\.claude\scripts\statusline\src\index.ts

# 3. Vérifier si bun est installé
bun --version

# 4. Vérifier si ts-node est installé globalement
ts-node --version

# 5. Vérifier les dépendances statusline
cat $env:USERPROFILE\.claude\scripts\statusline\package.json

# 6. Tester manuellement l'exécution de la statusline
cd $env:USERPROFILE\.claude\scripts\statusline\
node src/index.ts
# → Si erreur TypeScript, c'est le problème confirmé

# 7. Essayer avec bun si installé
bun run src/index.ts

# 8. Vérifier les dépendances installées
ls $env:USERPROFILE\.claude\scripts\statusline\node_modules\
```

---

## 🔧 Solutions possibles pour la statusline

### Option 1: Compiler TypeScript → JavaScript
```powershell
cd $env:USERPROFILE\.claude\scripts\statusline\
npx tsc
# Puis modifier settings.json pour pointer vers le .js compilé
```

### Option 2: Utiliser tsx (TypeScript runner)
```powershell
# Dans package.json du package, ajouter tsx comme dépendance
# Puis modifier settings.json:
{
  "statusLine": {
    "type": "command",
    "command": "npx tsx ${CLAUDE_CONFIG_DIR}/scripts/statusline/src/index.ts",
    "padding": 0
  }
}
```

### Option 3: Build script dans le package
Créer un script de build qui compile le TypeScript lors de `npx cc-config setup` :
```javascript
// Dans cli.js après installation des dépendances
function buildStatusline() {
  const statuslineDir = path.join(CLAUDE_DIR, 'scripts', 'statusline');
  execSync('npx tsc', { cwd: statuslineDir, stdio: 'ignore' });
}
```

### Option 4: Utiliser bun
```json
{
  "statusLine": {
    "type": "command",
    "command": "bun ${CLAUDE_CONFIG_DIR}/scripts/statusline/src/index.ts",
    "padding": 0
  }
}
```

---

## 📝 Historique des versions

### v1.0.0 - Initial release
- Installation de base

### v1.0.1
- Fix URLs repo GitHub

### v1.0.2
- Fix: Windows `where claude` au lieu de `which claude`

### v1.0.3
- Fix: Windows `where bun` pour statusline deps

### v1.1.0
- Feature: Auto-installation alias shell
- Fix: Cross-platform settings.json avec `${CLAUDE_CONFIG_DIR}`
- Fix: Changé `bun` → `node` pour compatibilité

### v1.1.1
- Fix: Support PowerShell 5.1 ET PowerShell 7+ profiles

### v1.1.2 - Version actuelle
- Fix: Logging amélioré pour installation alias
- Fix: Gestion d'erreur détaillée par profil
- Fix: Vérifie que fichier existe après création
- Feature: Affiche quel dossier est créé

---

## 🎯 Prochaines étapes

1. **URGENT:** Résoudre le problème de statusline sur Windows
   - Identifier pourquoi `node index.ts` ne fonctionne pas
   - Choisir une solution (compilation, tsx, bun, etc.)
   - Tester sur Windows
   - Publier fix en v1.1.3

2. **Amélioration:** Support CMD en plus de PowerShell
   - Créer des fichiers batch `.bat` pour `cc` et `ccc`
   - Installer dans un dossier du PATH
   - Permettre utilisation dans CMD et PowerShell

3. **Documentation:** Améliorer le README avec section Windows

4. **Tests:** Créer un script de test automatisé pour Windows

---

## 💡 Notes importantes

### Différences CMD vs PowerShell

**PowerShell:**
- Support des fonctions dans le profil
- `$PROFILE` variable automatique
- Syntaxe: `function cc { claude --dangerously-skip-permissions @args }`

**CMD:**
- Pas de support natif des alias
- Faut utiliser `doskey` (temporaire, perdu après fermeture)
- Ou créer des fichiers `.bat`/`.cmd` dans le PATH

### AIBlueprint comparaison

AIBlueprint ne supporte PAS Windows pour les alias :
- Affiche juste warning "Shell shortcuts only supported on macOS and Linux"
- Les utilisateurs Windows doivent utiliser WSL ou Git Bash

**Notre package est meilleur** car on supporte PowerShell !

---

## 📞 Contact

- **Auteur:** Jeremy (@jeremyy_prt)
- **Repo:** https://github.com/jeremy-prt/cc-config
- **Issues:** https://github.com/jeremy-prt/cc-config/issues
- **npm:** https://www.npmjs.com/package/@jeremyy_prt/cc-config

---

## 🚀 Workflow de développement

### Pour tester des changements localement
```bash
# Sur Mac (développement)
cd /Users/jeremy/Documents/code/scripts/claude-config-jeremy/

# Modifier le code dans cli.js
# Bump version dans package.json
git add -A
git commit -m "Fix: description"
git push

# Publier sur npm
npm publish --access public --otp=CODE_2FA

# Tester sur Windows
npx @jeremyy_prt/cc-config@latest setup
```

### Structure du projet
```
claude-config-jeremy/
├── cli.js                    # Script d'installation principal
├── package.json              # Config npm
├── README.md                 # Documentation utilisateur
├── settings.json             # Template settings Claude Code
├── commands/                 # 7 commandes
│   ├── commit.md
│   ├── corriger-orthographe.md
│   ├── creer-agent.md
│   ├── creer-commande.md
│   ├── liste-commande.md
│   ├── memoire-claude.md
│   └── surveiller-ci.md
├── agents/                   # 4 agents
│   ├── corriger-orthographe.md
│   ├── explorer-code.md
│   ├── explorer-docs.md
│   └── recherche-web.md
├── scripts/                  # Scripts utilitaires
│   ├── validate-command.js   # Hook de validation bash
│   └── statusline/           # Statusline TypeScript
│       ├── src/
│       │   └── index.ts      # ⚠️ PROBLÈME ICI
│       ├── package.json
│       └── bun.lockb
└── song/                     # Sons de notification
    ├── finish.mp3
    └── need-human.mp3
```

---

**FIN DU CONTEXTE**

Ce fichier contient tout ce dont Claude Code a besoin pour comprendre le projet et débugger le problème de statusline sur Windows.
