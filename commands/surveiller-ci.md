---
description: Surveiller et corriger automatiquement les erreurs de CI GitHub Actions
allowed-tools: Bash(gh :*), Bash(git :*), Bash(sleep :*)
---

Tu es un outil de surveillance et correction automatique de CI. Surveille les runs GitHub Actions et corrige les erreurs jusqu'à ce que tout passe (max 3 tentatives).

## Workflow

1. **ATTENDRE LE DÉMARRAGE**: Laisser le temps au CI de démarrer
   - `sleep 10` pour attendre que le workflow démarre
   - **CRITIQUE**: Le CI met quelques secondes à apparaître après un push

2. **SURVEILLER LE RUN**: Observer le pipeline en temps réel
   - `gh run list --limit 1` pour obtenir l'ID du dernier run
   - `gh run watch <run-id>` pour surveiller en direct
   - **ATTENDRE**: Que le run se termine (succès ou échec)

3. **SI SUCCÈS**: Nettoyer et terminer
   - Supprimer les artifacts téléchargés s'il y en a
   - Afficher le statut final avec `gh run view <run-id>`
   - **STOP**: Mission accomplie

4. **SI ÉCHEC**: Analyser et corriger (max 3 tentatives)
   - `gh run view <run-id> --log-failed` pour récupérer les logs d'erreur
   - Analyser les erreurs pour identifier la cause racine
   - Faire les corrections ciblées dans le code
   - Commit avec message descriptif: `fix(ci): [ce qui a été corrigé]`
   - `git push` pour déclencher un nouveau run
   - **INCRÉMENTER**: Le compteur de tentatives
   - **BOUCLER**: Retourner à l'étape 1 (sauf si 3 tentatives atteintes)

5. **SI 3 ÉCHECS**: Rapporter et arrêter
   - Afficher un résumé des 3 tentatives et erreurs
   - **STOP**: L'intervention humaine est nécessaire

## Règles d'Exécution

- **MAX 3 TENTATIVES**: Éviter les boucles infinies
- **CORRECTIONS CIBLÉES**: Corriger uniquement les erreurs CI, pas de refactoring
- **MESSAGES DESCRIPTIFS**: Chaque commit doit expliquer la correction
- **VÉRIFIER AVANT DE PUSH**: S'assurer que la correction a du sens
- **FOCUS CI**: Rester concentré sur les erreurs de pipeline uniquement

## Exemples de Messages de Commit

```
fix(ci): install missing dependency @types/node
fix(ci): update node version to 18 in workflow
fix(ci): fix eslint errors in api routes
fix(ci): add missing env variables for tests
```

## Outils Autorisés

- `gh run list` - Lister les runs
- `gh run watch <id>` - Surveiller un run
- `gh run view <id>` - Voir les détails d'un run
- `gh run view <id> --log-failed` - Logs des échecs
- `git add`, `git commit`, `git push` - Corrections
- `sleep` - Attendre le démarrage du CI

## Priorité

Précision des corrections > Vitesse. Bien comprendre l'erreur avant de corriger.
