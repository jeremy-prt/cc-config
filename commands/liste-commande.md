---
description: Afficher la liste de toutes les commandes et agents avec exemples d'utilisation
allowed-tools: Read, Glob
argument-hint: [--exemples | -e]
---

Tu es un assistant qui liste les commandes et agents disponibles avec leurs exemples d'utilisation.

## Workflow

1. **PARSER L'ARGUMENT** :
   - Vérifier si `--exemples` ou `-e` est passé en argument
   - Mode normal: liste simple
   - Mode exemples: liste + exemples d'utilisation

2. **LISTER LES COMMANDES** :
   - Utiliser `Glob` avec le pattern `*.md` dans `~/.claude/commands/`
   - Pour chaque fichier, utiliser `Read` pour lire le frontmatter YAML et le contenu
   - Extraire la description entre les `---`
   - Si mode exemples: extraire aussi les exemples du contenu

3. **LISTER LES AGENTS** :
   - Utiliser `Glob` avec le pattern `*.md` dans `~/.claude/agents/`
   - Pour chaque fichier, utiliser `Read` pour lire le frontmatter YAML et le contenu
   - Extraire le `name` et `description` entre les `---`
   - Si mode exemples: créer des exemples basés sur la description

4. **AFFICHER** :
   - Afficher les commandes dans une section
   - Afficher les agents dans une autre section
   - Si mode exemples: ajouter un exemple d'utilisation pour chaque

## Format de Sortie (Mode Normal)

```
🔧 COMMANDES DISPONIBLES

/nom-commande    Description de la commande
/autre-commande  Description de l'autre commande

🤖 AGENTS DISPONIBLES

@nom-agent       Description de l'agent
@autre-agent     Description de l'autre agent

💡 Pour voir des exemples: /liste-commande --exemples
```

## Format de Sortie (Mode Exemples)

```
🔧 COMMANDES DISPONIBLES

/commit
└─ Commit et push rapides avec messages minimaux
   Exemple: /commit

/corriger-orthographe
└─ Corriger les erreurs de grammaire et d'orthographe
   Exemple: /corriger-orthographe src/components/Header.vue
   Exemple: /corriger-orthographe src/*.vue

/surveiller-ci
└─ Surveiller et corriger automatiquement les erreurs de CI
   Exemple: /surveiller-ci

🤖 AGENTS DISPONIBLES

@explorer-docs
└─ Explorer la documentation de bibliothèques avec exemples de code
   Exemple: @explorer-docs cherche la doc de Nuxt 4
   Exemple: Comment utiliser les server routes dans Vue 3 ?

@recherche-web
└─ Recherche web rapide avec sources fiables
   Exemple: @recherche-web quoi de neuf dans TypeScript 5.7
   Exemple: Trouve-moi des infos sur l'API Context7
```

## Exemples par Défaut

Si le fichier ne contient pas d'exemples, génère des exemples intelligents basés sur:
- Le nom de la commande/agent
- La description
- L'argument-hint si présent

**Exemples types** :
- Commandes sans arguments: Juste `/nom-commande`
- Commandes avec fichiers: `/nom-commande chemin/vers/fichier.ext`
- Agents: `@nom-agent [question ou contexte]` ou en conversationnel

## Règles

- Ne pas inclure le fichier `liste-commande.md` lui-même dans la liste
- Trier par ordre alphabétique
- Format compact et lisible
- En mode normal: juste lister
- En mode exemples: exemples clairs et concrets
- Les exemples doivent être copy-paste ready

## Priorité

Clarté > Détails. Exemples pratiques et immédiatement utilisables.
