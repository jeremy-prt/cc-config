# Guide de Publication sur NPM

## Prérequis

1. Avoir un compte npm: https://www.npmjs.com/signup
2. Se connecter en local:
```bash
npm login
```

## Étapes de Publication

### 1. Préparer le package

```bash
cd /Users/jeremy/Documents/code/scripts/claude-config-jeremy

# Vérifier que tout est bon
npm pack --dry-run
```

### 2. Publier sur npm

```bash
# Première publication
npm publish

# Ou si le nom est déjà pris, utiliser un scope
npm publish --access public
```

### 3. Mettre à jour le nom si nécessaire

Si "claude-config-jeremy" est pris, éditer `package.json`:
```json
{
  "name": "@ton-username/claude-config-jeremy",
  ...
}
```

Puis publier:
```bash
npm publish --access public
```

## Mettre à Jour le Package

### 1. Modifier la version

```bash
# Version patch (1.0.0 -> 1.0.1)
npm version patch

# Version mineure (1.0.0 -> 1.1.0)
npm version minor

# Version majeure (1.0.0 -> 2.0.0)
npm version major
```

### 2. Publier la nouvelle version

```bash
npm publish
```

## Alternative: GitHub Repo + NPM Registry

### Option recommandée pour éviter les conflits de nom

1. Créer un repo GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ton-username/claude-config-jeremy.git
git push -u origin main
```

2. Publier sur npm avec ton username en scope:
```bash
# Éditer package.json pour ajouter ton scope
{
  "name": "@ton-username/claude-config-jeremy"
}

npm publish --access public
```

3. Les utilisateurs installeront avec:
```bash
npx @ton-username/claude-config-jeremy setup
```

## Installation Directe depuis GitHub (sans npm)

Si tu ne veux pas publier sur npm, les utilisateurs peuvent installer directement depuis GitHub:

```bash
npx github:ton-username/claude-config-jeremy setup
```

## Tester Localement

Avant de publier:

```bash
# Installer en global localement
npm link

# Tester
claude-config-jeremy setup

# Désinstaller
npm unlink -g claude-config-jeremy
```

## Bonnes Pratiques

1. **Versioning**: Suivre [semver](https://semver.org/)
2. **Changelog**: Documenter les changements dans README.md
3. **Tags git**: Créer des tags pour chaque version
   ```bash
   git tag v1.0.0
   git push --tags
   ```
4. **README**: Garder à jour avec des exemples clairs
5. **License**: Ajouter une license (MIT recommandé)

## Commandes Utiles

```bash
# Voir la version actuelle
npm version

# Voir les infos du package
npm info claude-config-jeremy

# Dépublier (attention, irréversible!)
npm unpublish claude-config-jeremy@1.0.0

# Voir ce qui sera publié
npm pack --dry-run
```
