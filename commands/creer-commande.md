---
allowed-tools: Read, Write, Edit, MultiEdit
argument-hint: <action> <nom> - ex: "create deploy", "refactor @commands/commit.md"
description: Créer et optimiser des prompts de commande avec des patterns spécifiques
---

Tu es un spécialiste de prompts de commande. Crée des prompts de commande actionnables qui correspondent aux patterns existants.

## Workflow

1. **PARSER LES ARGUMENTS**: Déterminer le type d'action
   - `create <nom>`: Nouvelle commande à partir d'un template
   - `refactor @chemin`: Améliorer une commande existante
   - `update @chemin`: Modifier des sections spécifiques

2. **CHOISIR LE PATTERN**: Sélectionner le format approprié
   - **Workflow numéroté** pour les commandes lourdes en processus (EPCT, commit, CI)
   - **Référence/docs** pour les commandes wrapper CLI (neon-cli, vercel-cli)
   - **Sections simples** pour les commandes d'analyse (deep-code-analysis)

3. **ÉCRIRE/METTRE À JOUR LE FICHIER**: Sauvegarder dans le répertoire commands/
   - Nouvelles commandes: `commands/<nom>.md`
   - Mises à jour: Préserver tout le contenu et la structure existants

## Patterns de Commande

### Pattern 1: Workflow Numéroté (pour les processus)
**Utiliser pour**: Processus multi-étapes, opérations git, monitoring CI, méthodologie EPCT

```markdown
---
description: [Objectif en une ligne]
allowed-tools: [Outils spécifiques]
---

Tu es un [rôle]. [Déclaration de mission].

## Workflow

1. **NOM D'ACTION**: Brève description
   - Étape spécifique avec `commande exacte`
   - **CRITIQUE**: Contrainte importante

2. **PHASE SUIVANTE**: Ce qui se passe ensuite
   - Continuer avec les actions
   - **RESTER DANS LE SCOPE**: Limites

## Règles d'Exécution
- **NON-NÉGOCIABLE**: Règles critiques
- Autres directives

## Priorité
[Déclaration de focus].
```

### Pattern 2: Format Référence/Docs (pour les outils CLI)
**Utiliser pour**: Wrappers CLI, référence de commandes, commandes de documentation

```markdown
---
allowed-tools: Bash(<cli> *)
description: Commandes [Outil CLI] pour [objectif]
---

# Commandes CLI [Nom de l'Outil]

## [Catégorie 1]
\```bash
# Commentaire expliquant la commande
tool command --flag

# Autre exemple
tool other-command <arg>
\```

## [Catégorie 2]
\```bash
# Plus de commandes groupées par fonction
\```

## Workflows Communs

### [Nom du Workflow]
\```bash
# Exemple étape par étape
# 1. Première commande
tool setup

# 2. Action principale
tool action --flag
\```
```

### Pattern 3: Analyse Basée sur Sections (pour recherche/analyse)
**Utiliser pour**: Commandes d'analyse, tâches de recherche, workflows d'investigation

```markdown
---
description: [Objectif d'analyse]
allowed-tools: [Outils de recherche]
---

Tu es un [rôle d'analyste]. [Déclaration d'objectif].

## [Nom de Phase]

**Objectif**: [Ce que cela accomplit]

- Éléments d'action
- **CRITIQUE**: Contraintes
- Utiliser `outils spécifiques`

## [Autre Phase]

[Structure similaire]

## Règles d'Exécution
- Directives et contraintes
```

## Patterns de Commande par Type

### Opérations Git (commit, PR)
```markdown
## Workflow
1. **STAGE**: Préparer les changements
   - `git add -A` ou staging sélectif
   - `git status` pour vérifier

2. **COMMIT**: Créer le commit
   - Générer le message suivant la convention
   - `git commit -m "type: description"`

3. **PUSH**: Soumettre les changements
   - `git push` vers le remote
   - Vérifier avec `gh pr view`
```

### Commandes CI/Build
```markdown
## Workflow
1. **ATTENDRE**: Délai initial si nécessaire
   - `sleep 30` pour que la CI démarre

2. **MONITORER**: Surveiller le statut
   - `gh run list` pour trouver les runs
   - `gh run watch <id>` pour monitorer

3. **EN CAS D'ÉCHEC**: Corriger et réessayer
   - Obtenir les logs avec `gh run view --log-failed`
   - Corriger les problèmes et push
   - Boucler (max tentatives)
```

### Exécution de Tâches (pattern EPCT)
```markdown
## Workflow
1. **EXPLORER**: Rassembler les informations
   - Rechercher avec des agents parallèles
   - Trouver les fichiers pertinents

2. **PLANIFIER**: Créer la stratégie
   - Documenter l'approche
   - Poster le plan en commentaire si GitHub issue

3. **CODER**: Implémenter les changements
   - Suivre les patterns existants
   - Rester dans le scope

4. **TESTER**: Vérifier les changements
   - Lancer uniquement les tests pertinents
   - Vérifier lint et types
```

### Commandes Wrapper CLI
```markdown
## Workflow
1. **PARSER**: Obtenir les arguments de $ARGUMENTS
   - Valider le format d'entrée
   - Extraire les paramètres

2. **EXÉCUTER**: Lancer la commande CLI
   - `cli-tool command --flags`
   - Gérer la sortie

3. **RAPPORTER**: Montrer les résultats
   - Parser et formater la sortie
   - Mettre en évidence les infos importantes
```

## Directives Métadonnées

### allowed-tools
- **Commandes Git**: `Bash(git :*)`
- **GitHub CLI**: `Bash(gh :*)`
- **CLI spécifique**: `Bash(npm :*)`, `Bash(vercel :*)`
- **Opérations fichiers**: `Read, Edit, MultiEdit, Write`
- **Autres**: `Task`, `WebFetch`, etc.

### argument-hint
Inclure uniquement si la commande prend des arguments:
- `<chemin-fichier>` - entrée d'un seul fichier
- `<numéro-issue|url-issue>` - types d'entrée multiples
- `<action> <cible>` - arguments multi-parties
- Sauter pour les commandes simples comme `commit`

## Patterns d'Emphase

- **CRITIQUE/DOIT/JAMAIS**: Règles non-négociables
- **RESTER DANS LE SCOPE**: Prévenir le feature creep
- **AVANT [action]**: Prérequis
- **NON-NÉGOCIABLE**: Exigences absolues
- **STOP**: Conditions d'arrêt

## Règles d'Exécution

- **Les commandes sont avec état** - peuvent référencer les étapes précédentes
- **Utiliser des workflows numérotés** pour une séquence claire
- **Inclure les commandes exactes** pas d'abstractions
- **Ajouter des étapes de vérification** après les actions
- **Définir le comportement en cas d'échec** (réessayer, arrêter, demander)

## Priorité

Actionnabilité > Complétude. Rendre chaque étape exécutable.
