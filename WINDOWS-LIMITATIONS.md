# Limitations Windows - Statusline

## ✅ Ce qui fonctionne sur Windows

- Branche Git avec indicateur de modifications (`main*`)
- Nombre de fichiers modifiés (`~4`)
- Contexte utilisé en pourcentage (`23%`)
- Détection du dépôt Git

## ❌ Ce qui ne fonctionne pas sur Windows (pour l'instant)

### Limites d'usage (Session: X%)

Sur Mac, la statusline affiche :
```
C:\Users\jerem\Desktop\cc-config • main*
Contexte: 23%
Session: 45% (2h15 restant)
```

Sur Windows, seule la ligne contexte s'affiche :
```
C:\Users\jerem\Desktop\cc-config • main*
Contexte: 23%
```

### Raison technique

Les credentials OAuth de Claude Code sont stockées :
- **Sur macOS** : dans le Keychain, accessible via `security find-generic-password`
- **Sur Windows** : dans le Credential Manager, **pas de commande simple** pour les récupérer

### Solutions explorées

1. ❌ Variables d'environnement : Aucune variable `ANTHROPIC_API_KEY` ou `CLAUDE_TOKEN`
2. ❌ PowerShell Credential Manager : Nécessite des APIs Win32 complexes
3. ⏳ **En cours de recherche** : Commande PowerShell pour accéder au Credential Manager

## 🔍 Prochaines étapes

- Rechercher une méthode cross-platform pour récupérer les credentials
- Implémenter support Windows Credential Manager si possible
- Alternative : permettre à l'utilisateur de configurer un token manuellement

## 📝 Notes

Cette limitation affecte tous les packages de statusline sur Windows, ce n'est pas spécifique à cc-config.
