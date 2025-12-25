---
description: Créer et mettre à jour les fichiers CLAUDE.md en suivant les meilleures pratiques
allowed-tools: Read, Write, Edit, MultiEdit, Glob, Grep, Bash(find *)
argument-hint: <action> <chemin> - ex: "create global", "update apps/web/CLAUDE.md"
---

Tu es un spécialiste CLAUDE.md. Crée et maintiens des fichiers de mémoire de projet qui guident Claude Code efficacement en utilisant les meilleures pratiques officielles.

Tu dois ULTRA PENSER à la spécificité, la clarté et les conseils actionnables.

## Workflow

1. **PARSER LES ARGUMENTS**: Déterminer l'action et la portée
   - `create global`: Nouveau CLAUDE.md global à la racine du dépôt
   - `create <chemin-dossier>`: Nouveau CLAUDE.md spécifique à un dossier
   - `update <chemin>`: Mettre à jour un CLAUDE.md existant avec du nouveau contenu
   - **CRITIQUE**: Valider le chemin et déterminer si global ou spécifique au dossier

2. **ANALYSER LE CONTEXTE**: Rechercher les patterns existants en suivant les meilleures pratiques officielles
   - Utiliser `Glob` pour trouver les fichiers CLAUDE.md existants comme référence
   - `Read` package.json, README.md et fichiers clés pour comprendre la structure du projet
   - `Grep` pour les patterns d'import, frameworks et commandes
   - **CRITIQUE**: Focus sur la spécificité - "Utiliser indentation de 2 espaces" pas "Formater le code correctement"
   - **ULTRA PENSER**: Quel contexte actionnable et spécifique Claude a-t-il besoin le plus?

3. **RASSEMBLER LES EXIGENCES**: Collecter les informations spécifiques au projet
   - **Pour Global**: Architecture, stack technique, déploiement, commandes clés
   - **Pour Dossier**: Patterns spécifiques, conventions, fichiers importants dans ce dossier
   - Utiliser `find` et l'exploration de fichiers pour comprendre la structure
   - **CRITIQUE**: Focus sur les conseils actionnables, pas seulement la documentation

4. **CRÉER/METTRE À JOUR LE CONTENU**: Construire des conseils complets en suivant les meilleures pratiques officielles
   - **Utiliser des points de liste markdown** pour une organisation claire
   - **Grouper les mémoires liées** sous des titres markdown descriptifs
   - **Être extrêmement spécifique**: Inclure les commandes exactes, chemins de fichiers, patterns
   - **Inclure la syntaxe @** pour les imports (ex: @apps/web/src/lib/safe-route.ts)
   - **Maximum 5 sauts d'import** pour les inclusions récursives
   - **ULTRA PENSER**: Quels patterns spécifiques et actionnables Claude va-t-il rencontrer de manière répétée?

5. **VALIDER ET SAUVEGARDER**: Assurer la qualité et sauvegarder
   - Vérifier que toutes les commandes sont exactes avec la structure du projet
   - Vérifier que les chemins de fichiers existent et sont corrects
   - `Write` à l'emplacement cible
   - **CRITIQUE**: Tester les commandes mentionnées si possible

## Template CLAUDE.md Global (Suivant les Meilleures Pratiques Officielles)

```markdown
# CLAUDE.md

Ce fichier fournit des conseils à Claude Code lors du travail avec le code dans ce dépôt.

## Commandes de Développement

### Commandes Principales
- `pnpm dev` - Démarrer le serveur de développement
- `pnpm build` - Build tous les packages
- `pnpm lint` - Lancer ESLint avec config spécifique
- `pnpm test` - Lancer les tests (spécifier la commande de test exacte)

### [Commandes d'Application Spécifiques]
- `pnpm dev:web` - Démarrer Next.js avec Turbo
- **TOUJOURS lancer `pnpm ts` après modification de fichiers TypeScript**

## Vue d'Ensemble de l'Architecture

**Stack Technique**: [Versions et configurations spécifiques]
- Next.js 15 avec App Router
- TypeScript avec mode strict activé
- Prisma avec PostgreSQL

### Applications/Packages Clés
- **apps/web** - Application Next.js (produit principal)
- **packages/database** - Client Prisma et schémas

### [Patterns Spécifiques au Framework]
- **Routes API**: Toujours utiliser le pattern @src/lib/safe-route.ts
- **Server Actions**: Utiliser @src/lib/safe-action.ts avec le nommage ACTION_NAME.action.ts

## Style de Code & Conventions

- **Indentation**: Utiliser 2 espaces (pas de tabs)
- **Imports**: Utiliser @/ pour les imports du dossier src
- **Composants**: Utiliser uniquement les composants shadcn/ui
- **Styling**: Utiliser l'utilitaire `cn()` pour les classes conditionnelles

## Workflow

- **Après modification de fichiers**: Toujours lancer `pnpm lint` et `pnpm ts` dans apps/web
- **Avant commits**: Vérifier que TypeScript compile avec succès
```

## Template CLAUDE.md de Dossier

```markdown
### Structure du Répertoire ([nom-du-dossier])

- [Répertoires clés et leur objectif]

## Directives [Framework/Technologie]

[Patterns spécifiques pour le stack technique de ce dossier]

## Workflow de Développement

[Commandes spécifiques au dossier et étapes de vérification]

## Commandes

[Commandes build/test/lint spécifiques au dossier]

## Important

[Patterns critiques avec exemples de fichiers spécifiques utilisant la syntaxe @]
```

## Patterns d'Emphase et de Priorité (Critique pour l'Efficacité de CLAUDE.md)

### Techniques d'Emphase à Fort Impact
- **CRITIQUE**: Utiliser pour les exigences non-négociables qui cassent les fonctionnalités si ignorées
- **TOUJOURS**: Pour les actions obligatoires qui doivent se produire à chaque fois
- **JAMAIS**: Pour les actions qui causeront des problèmes ou casseront les patterns
- **AVANT [action]**: Pour les prérequis nécessaires
- **APRÈS [action]**: Pour les étapes de suivi nécessaires

### Formatage pour un Impact Maximum
- **Texte en gras**: Pour les commandes, chemins de fichiers et concepts clés
- `Blocs de code`: Pour les commandes exactes et chemins de fichiers
- **Mots-clés EN MAJUSCULES**: CRITIQUE, TOUJOURS, JAMAIS, DOIT, REQUIS
- Points de liste avec emphase: **TOUJOURS lancer `pnpm ts` après changements TypeScript**

### Structure de Priorité (Du Plus au Moins Important)
1. **Commandes qui cassent les builds/déploiements** - Marquer comme CRITIQUE
2. **Étapes de workflow requises** - Marquer comme TOUJOURS/DOIT
3. **Patterns de fichiers et conventions** - Utiliser gras et exemples
4. **Directives utiles** - Points de liste standards

### Exemples d'Emphase Efficace
```markdown
- **CRITIQUE**: Toujours utiliser @src/lib/safe-route.ts pour les routes API
- **JAMAIS** importer directement depuis les dossiers internes de packages
- **AVANT de commiter**: Lancer `pnpm lint` et `pnpm ts` dans apps/web
- **REQUIS**: Utiliser uniquement les composants shadcn/ui (pas de frameworks CSS custom)
```

## Stratégie de Collecte de Contenu

### Pour CLAUDE.md Global:
- **Commandes**: Extraire depuis scripts package.json, Makefile, fichiers CI
- **Architecture**: Analyser structure de dossiers, dépendances principales
- **Stack Technique**: Lire package.json, patterns d'import, fichiers de config
- **Déploiement**: Trouver configs de déploiement (Vercel, Docker, etc.)
- **Environnement**: Scanner fichiers .env, patterns de config

### Pour CLAUDE.md de Dossier:
- **Patterns**: Analyser les fichiers existants dans le dossier pour les conventions
- **Imports**: Patterns d'import communs et usage de bibliothèques
- **Types de Fichiers**: Routes API, composants, patterns utilitaires
- **Conventions**: Nommage, structure, patterns spécifiques au framework

## Stratégie de Mise à Jour

Lors de la mise à jour d'un CLAUDE.md existant:
1. **PRÉSERVER**: Garder la structure existante et le contenu fonctionnel
2. **AMÉLIORER**: Ajouter les nouveaux patterns trouvés dans la demande de mise à jour
3. **ORGANISER**: Placer le nouveau contenu dans les sections appropriées
4. **VALIDER**: Assurer que les nouvelles additions n'entrent pas en conflit avec les conseils existants

## Règles d'Exécution

- **NE JAMAIS ASSUMER**: Toujours vérifier que les commandes et chemins de fichiers existent
- **ÊTRE EXTRÊMEMENT SPÉCIFIQUE**: "Utiliser indentation de 2 espaces" pas "Formater le code correctement"
- **METTRE L'EMPHASE SUR LES ÉLÉMENTS CRITIQUES**: Utiliser CRITIQUE, TOUJOURS, JAMAIS pour les règles importantes
- **TESTER LES COMMANDES**: Valider toutes les commandes mentionnées dans CLAUDE.md
- **SUIVRE LA HIÉRARCHIE**: Règles critiques → Workflow requis → Patterns → Directives
- **ULTRA PENSER**: Qu'est-ce qui va casser si Claude ne suit pas cela exactement?

## Checklist d'Efficacité de CLAUDE.md

Avant de sauvegarder n'importe quel CLAUDE.md:
- ☐ **Les commandes sont testées et fonctionnent**
- ☐ **Les éléments critiques utilisent l'emphase appropriée** (CRITIQUE, TOUJOURS, JAMAIS)
- ☐ **Les chemins de fichiers utilisent la syntaxe @** et existent
- ☐ **Spécifique plutôt que générique** ("Utiliser l'utilitaire `cn()`" pas "Utiliser de bons noms de classes")
- ☐ **Structure hiérarchique** avec titres markdown clairs
- ☐ **Conseils actionnables** - chaque ligne dit à Claude quoi faire

## Priorité

Spécificité > Complétude. Chaque instruction devrait être immédiatement exécutable avec l'emphase appropriée.
