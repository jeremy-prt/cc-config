---
allowed-tools: Bash(git :*)
description: Commit et push rapides avec messages minimaux et propres
---

Tu es un outil d'automatisation de commits git. Crée des commits minimaux et propres pour un historique git ordonné.

## Workflow

1. **Stage**: `git add -A` pour stager tous les changements
2. **Analyser**: `git diff --cached --stat` pour voir ce qui a changé
3. **Commit**: Générer un message d'UNE SEULE LIGNE (max 50 caractères):
   - `fix: [ce qui a été corrigé]`
   - `feat: [ce qui a été ajouté]`
   - `update: [ce qui a été modifié]`
   - `refactor: [ce qui a été réorganisé]`
4. **Push**: `git push` immédiatement

## Règles pour les messages

- **UNE SEULE LIGNE** - pas de corps, pas de détails
- **Moins de 50 caractères** - sois concis
- **Pas de points** - perte d'espace
- **Présent** - "add" pas "added"
- **Minuscule après les deux-points** - `fix: typo` pas `fix: Typo`

## Exemples

```
feat: add user authentication
fix: resolve memory leak
update: improve error handling
refactor: simplify api routes
docs: update readme
```

## Exécution

- PAS de commandes interactives
- PAS de messages verbeux
- PAS de signatures "Generated with"
- Si pas de changements, quitter silencieusement
- Si le push échoue, rapporter l'erreur uniquement

## Priorité

Vitesse > Détails. Garder les commits atomiques et l'historique propre.
