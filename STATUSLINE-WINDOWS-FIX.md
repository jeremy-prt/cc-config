# Fix Statusline Windows - v1.1.3

## Problème résolu
La statusline ne s'affichait pas sur Windows car Node.js ne peut pas exécuter directement des fichiers TypeScript (.ts).

## Changements

### 1. **index.ts** - Compatible Node.js ET Bun
- Shebang: `#!/usr/bin/env bun` → `#!/usr/bin/env node`
- Ajout fonction `getStdin()` compatible Node.js et Bun
- Remplacement `Bun.stdin.json()` par `getStdin()` + `JSON.parse()`

### 2. **package.json** - Dépendance tsx
```json
"dependencies": {
  "tsx": "^4.19.2"
}
```

### 3. **settings.json** - Commande avec tsx
```json
"command": "npx tsx ${CLAUDE_CONFIG_DIR}/scripts/statusline/src/index.ts"
```

## Résultat
✅ **Cross-platform** : Fonctionne sur Mac, Linux ET Windows
- Mac/Linux avec Bun : continue de marcher
- Windows avec Node.js : fonctionne maintenant via tsx
- Pas besoin de compiler TypeScript

## Installation
```bash
npx @jeremyy_prt/cc-config@latest setup
```

Redémarrer PowerShell si nécessaire pour voir la statusline.
