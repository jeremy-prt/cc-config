# Claude Config Jeremy

Configuration personnalisée pour Claude Code avec commandes, agents et scripts en français.

## ✨ Features

### 📝 Commandes (7)
- `/commit` - Commits conventionnels rapides avec push automatique
- `/corriger-orthographe` - Correction grammaticale et orthographique
- `/creer-agent` - Créer et optimiser des agents personnalisés
- `/creer-commande` - Créer et optimiser des commandes
- `/liste-commande` - Liste toutes les commandes et agents avec exemples
- `/memoire-claude` - Créer et mettre à jour les fichiers CLAUDE.md
- `/surveiller-ci` - Surveiller et corriger automatiquement les erreurs de CI GitHub Actions

### 🤖 Agents (4)
- `@corriger-orthographe` - Correction orthographique de fichiers
- `@explorer-code` - Exploration de codebase
- `@explorer-docs` - Exploration de documentation avec Context7
- `@recherche-web` - Recherche web rapide

### 🔒 Sécurité
- Hook PreToolUse avec validation des commandes bash (700+ lignes)
- Bloque les commandes dangereuses (`rm -rf /`, `sudo`, etc.)

### 🎨 Autres
- Statusline personnalisée avec Git et tracking des coûts
- Sons de notification (finish, need-human)
- Hooks configurés (PreToolUse, Stop, Notification)

## 🚀 Installation

### Option 1: Script Shell (local)

```bash
cd /Users/jeremy/Documents/code/scripts/claude-config-jeremy
./install.sh
```

### Option 2: NPM Package (recommandé)

```bash
npx claude-config-jeremy setup
```

ou avec bun:

```bash
bunx claude-config-jeremy setup
```

### Option 3: Installation manuelle

```bash
# Cloner/télécharger le repo
git clone https://github.com/ton-user/claude-config-jeremy.git

# Copier les fichiers
cp -r claude-config-jeremy/commands/* ~/.claude/commands/
cp -r claude-config-jeremy/agents/* ~/.claude/agents/
cp -r claude-config-jeremy/scripts/* ~/.claude/scripts/
```

## 📦 Prérequis

- [Claude Code](https://claude.ai/download) installé
- `bun` (optionnel, pour statusline)
- `gh` CLI (optionnel, pour /surveiller-ci)

## 🔧 Configuration

### Context7 MCP (recommandé pour @explorer-docs)

```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

Ou avec API key:
```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp \
  --header "CONTEXT7_API_KEY: ta_clé"
```

## 📚 Exemples d'utilisation

### Commits rapides
```bash
/commit
```

### Corriger l'orthographe
```bash
/corriger-orthographe src/components/Header.vue
/corriger-orthographe src/**/*.vue
```

### Explorer la documentation
```bash
@explorer-docs cherche la doc de Nuxt 4
```
ou en conversationnel:
```
Comment utiliser les server routes dans Vue 3 ?
```

### Surveiller le CI
```bash
/surveiller-ci
```

### Créer une commande personnalisée
```bash
/creer-commande create deploy
```

### Lister toutes les commandes avec exemples
```bash
/liste-commande --exemples
```

## 🗂️ Structure

```
claude-config-jeremy/
├── commands/           # Commandes slash personnalisées
│   ├── commit.md
│   ├── corriger-orthographe.md
│   ├── creer-agent.md
│   ├── creer-commande.md
│   ├── liste-commande.md
│   ├── memoire-claude.md
│   └── surveiller-ci.md
├── agents/            # Agents spécialisés
│   ├── corriger-orthographe.md
│   ├── explorer-code.md
│   ├── explorer-docs.md
│   └── recherche-web.md
├── scripts/           # Scripts utilitaires
│   ├── validate-command.js
│   └── statusline/
├── song/              # Sons de notification
│   ├── finish.mp3
│   └── need-human.mp3
├── settings.json      # Configuration des hooks et statusline
├── install.sh         # Script d'installation shell
└── README.md
```

## 🤝 Contribution

N'hésite pas à proposer des améliorations ou de nouvelles commandes!

## 📝 License

MIT

## 🙏 Crédits

Inspiré par [AIBlueprint](https://github.com/Melvynx/aiblueprint) de Melvynx
