# Changelog

## v1.1.8 (2025-12-25) - STATUSLINE WINDOWS COMPLÈTE ✅

### Fixed
- **context.ts** : Remplace `Bun.file()` par `readFile()` (Node.js compatible)
- Le contexte s'actualise maintenant correctement au lieu de rester bloqué à 23%

### Résultat
La statusline affiche maintenant **TOUT** sur Windows et Mac :
- ✅ Branche Git avec modifications (`main*`)
- ✅ Contexte utilisé (s'actualise en temps réel)
- ✅ Limites d'usage API (`Session: X%`)
- ✅ Temps restant avant reset

---

## v1.1.7 (2025-12-25)

### Fixed
- **usage-limits.ts** : Lit `.credentials.json` sur Windows/Linux
- macOS continue d'utiliser le Keychain
- Support complet limites d'usage sur Windows

---

## v1.1.6 (2025-12-25)

### Fixed
- **spend.ts** : `import.meta.dir` → `import.meta.url` (Node.js ESM)
- **usage-limits.ts** : Fix crash "path argument must be string"
- Désactivation temporaire cache usage-limits sur Windows

---

## v1.1.5 (2025-12-25)

### Added
- **statusline-wrapper.cmd** : Wrapper Windows pour exécution TypeScript

### Fixed
- Fix détection Git : passe `current_dir` à `getGitStatus()`
- Fix `import.meta.dir` → `import.meta.url` dans usage-limits.ts
- **settings.json** utilise wrapper CMD au lieu de `npx tsx`

---

## v1.1.4 (2025-12-25)

### Fixed
- **git.ts** : Remplace `$ de Bun` par `execSync` (Node.js natif)
- **usage-limits.ts** : Remplace `$ de Bun` par `execSync`
- Suppression totale des dépendances Bun

---

## v1.1.3 (2025-12-25)

### Added
- **index.ts** : Fonction `getStdin()` compatible Node.js et Bun
- **package.json** : Dépendance `tsx` pour exécution TypeScript

### Fixed
- **settings.json** : `node` → `npx tsx` pour exécuter index.ts

---

## v1.1.2

### Fixed
- Logging amélioré pour installation alias PowerShell
- Gestion d'erreur détaillée par profil
- Vérifie que fichier existe après création

---

## v1.1.1

### Fixed
- Support PowerShell 5.1 ET PowerShell 7+ profiles

---

## v1.1.0

### Added
- Auto-installation alias shell (`cc` et `ccc`)
- Cross-platform settings.json avec `${CLAUDE_CONFIG_DIR}`

### Changed
- `bun` → `node` pour meilleure compatibilité

---

## v1.0.3

### Fixed
- Windows : `where bun` pour statusline deps

---

## v1.0.2

### Fixed
- Windows : `where claude` au lieu de `which claude`

---

## v1.0.1

### Fixed
- URLs repo GitHub

---

## v1.0.0

### Added
- Release initiale
- 7 commandes custom
- 4 agents
- Hooks de sécurité
- Statusline (Mac uniquement)
- Alias shell
