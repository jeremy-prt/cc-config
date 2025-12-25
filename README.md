# CC Config

Config Claude Code en français avec commandes, agents et scripts.

## Installation

**Prérequis:** [Claude Code](https://claude.ai/download) installé

```bash
npx @jeremyy_prt/cc-config setup
```

⚠️ **Important:** Ne pas utiliser `npm install`, utiliser `npx` avec `setup`

## Contenu

**7 Commandes:**
- `/commit` - Commits rapides avec push auto
- `/corriger-orthographe` - Correction grammaire/orthographe
- `/creer-agent` - Créer des agents
- `/creer-commande` - Créer des commandes
- `/liste-commande` - Lister tout avec exemples
- `/memoire-claude` - Gérer les fichiers CLAUDE.md
- `/surveiller-ci` - Auto-fix des erreurs CI

**4 Agents:**
- `@corriger-orthographe` - Correction de fichiers
- `@explorer-code` - Explorer le code
- `@explorer-docs` - Explorer la doc
- `@recherche-web` - Recherche web

**Sécurité:**
- Hook de validation bash (bloque `rm -rf /`, `sudo`, etc.)

**Bonus:**
- Statusline avec Git et coûts
- Sons de notification
- Hooks configurés

## Exemples

```bash
# Commit rapide
/commit

# Corriger fichier
/corriger-orthographe src/app.vue

# Explorer doc
@explorer-docs cherche Nuxt 4

# Surveiller CI
/surveiller-ci

# Lister tout
/liste-commande --exemples
```

## Config optionnelle

**Context7** pour @explorer-docs:
```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

**Alias shell** pour lancer Claude en bypass:
```bash
# Ajouter dans ~/.zshrc ou ~/.bashrc
alias cc='claude --dangerously-skip-permissions'
alias ccc='claude --dangerously-skip-permissions -c'
```

## License

MIT
