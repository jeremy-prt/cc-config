---
description: Corriger les erreurs de grammaire et d'orthographe dans un ou plusieurs fichiers en préservant le formatage
allowed-tools: Read, Edit, Write, MultiEdit, Task
argument-hint: <chemin-fichier> [fichiers-additionnels...]
---

Tu es un coordinateur de correction grammaticale. Corrige les erreurs de grammaire et d'orthographe dans les fichiers en préservant le formatage et le sens.

## Workflow

1. **PARSER LES FICHIERS**: Traiter les arguments de fichiers

   - Séparer les arguments en chemins de fichiers individuels
   - **CRITIQUE**: Au moins un chemin de fichier doit être fourni
   - **STOP** si aucun fichier spécifié - demander les chemins à l'utilisateur

2. **DÉTERMINER LA STRATÉGIE**: Choisir l'approche de traitement

   - **Fichier unique**: Traiter directement avec corrections grammaticales
   - **Fichiers multiples**: Lancer des agents @corriger-orthographe en parallèle

3. **MODE FICHIER UNIQUE**: Traitement direct

   - "Read" le fichier complètement
   - Appliquer les corrections de grammaire et d'orthographe
   - Préserver tout le formatage, les tags et les termes techniques
   - "Edit" ou "Write" pour mettre à jour le fichier avec les corrections
   - **PRÉSERVER**: Structure et sens d'origine

4. **MODE FICHIERS MULTIPLES**: Traitement par agents parallèles

   - **UTILISER TASK TOOL**: Lancer l'agent @corriger-orthographe pour chaque fichier
   - **EXÉCUTION PARALLÈLE**: Traiter tous les fichiers simultanément
   - **PROMPT AGENT**: Fournir uniquement le chemin du fichier à chaque agent
   - **ATTENDRE**: Que tous les agents se terminent avant de rapporter

5. **RAPPORTER LES RÉSULTATS**: Confirmer la complétion
   - Montrer les fichiers traités
   - Brève confirmation des corrections appliquées

## Règles

- **OBLIGATOIRE**: Au moins un chemin de fichier requis
- **PARALLÈLE**: Traiter plusieurs fichiers simultanément avec des agents
- **DIRECT**: Traiter un fichier unique sans lancer d'agent
- **PRÉSERVER**: Tout le formatage, la structure et les termes techniques
- **L'AGENT GÈRE**: Chaque fichier indépendamment en mode parallèle

## Exemples

### Fichier unique

Utilisateur: `/corriger-orthographe src/components/Header.vue`
→ Lire fichier → Appliquer corrections → Éditer fichier → Rapporter

### Fichiers multiples

Utilisateur: `/corriger-orthographe src/app.js src/utils.js src/config.js`
→ Lancer 3 agents @corriger-orthographe parallèles → Attendre → Rapporter tous les résultats
