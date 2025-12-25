#!/bin/bash

# Claude Config Jeremy - Installation Script
# Installation simple de la config Claude personnalisée

set -e

CLAUDE_DIR="$HOME/.claude"
BACKUP_DIR="$HOME/.claude.backup.$(date +%Y%m%d_%H%M%S)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Installation de Claude Config Jeremy"
echo ""

# Vérifier que Claude Code est installé
if ! command -v claude &> /dev/null; then
    echo "⚠️  Claude Code n'est pas installé. Installe-le d'abord:"
    echo "   https://claude.ai/download"
    exit 1
fi

# Créer un backup de la config existante
if [ -d "$CLAUDE_DIR" ]; then
    echo "📦 Backup de la config existante dans: $BACKUP_DIR"
    cp -r "$CLAUDE_DIR" "$BACKUP_DIR"
fi

# Créer les dossiers si nécessaire
echo "📁 Création des dossiers..."
mkdir -p "$CLAUDE_DIR"/{commands,agents,scripts,song,hooks}

# Copier les commandes
echo "📝 Installation des commandes..."
cp -r "$SCRIPT_DIR/commands/"* "$CLAUDE_DIR/commands/" 2>/dev/null || echo "   Pas de commandes à copier"

# Copier les agents
echo "🤖 Installation des agents..."
cp -r "$SCRIPT_DIR/agents/"* "$CLAUDE_DIR/agents/" 2>/dev/null || echo "   Pas d'agents à copier"

# Copier les scripts
echo "⚙️  Installation des scripts..."
cp -r "$SCRIPT_DIR/scripts/"* "$CLAUDE_DIR/scripts/" 2>/dev/null || echo "   Pas de scripts à copier"

# Copier les sons
echo "🔔 Installation des sons de notification..."
cp -r "$SCRIPT_DIR/song/"* "$CLAUDE_DIR/song/" 2>/dev/null || echo "   Pas de sons à copier"

# Merger settings.json (simple copie pour l'instant)
if [ -f "$SCRIPT_DIR/settings.json" ]; then
    echo "⚙️  Configuration des settings..."
    if [ -f "$CLAUDE_DIR/settings.json" ]; then
        echo "   ⚠️  settings.json existe déjà, fusion manuelle recommandée"
        cp "$SCRIPT_DIR/settings.json" "$CLAUDE_DIR/settings.example.json"
        echo "   → Fichier copié vers settings.example.json"
    else
        cp "$SCRIPT_DIR/settings.json" "$CLAUDE_DIR/settings.json"
    fi
fi

# Installer les dépendances pour statusline si bun est disponible
if command -v bun &> /dev/null && [ -d "$CLAUDE_DIR/scripts/statusline" ]; then
    echo "📦 Installation des dépendances statusline..."
    cd "$CLAUDE_DIR/scripts/statusline"
    bun install --silent 2>/dev/null || echo "   Impossible d'installer les dépendances"
    cd - > /dev/null
fi

echo ""
echo "✅ Installation terminée!"
echo ""
echo "📋 Commandes installées:"
ls -1 "$CLAUDE_DIR/commands/" | sed 's/\.md$//' | sed 's/^/   - \//'
echo ""
echo "🤖 Agents installés:"
ls -1 "$CLAUDE_DIR/agents/" | sed 's/\.md$//' | sed 's/^/   - @/'
echo ""
echo "💡 Teste avec: /liste-commande --exemples"
echo ""
echo "📁 Backup de ton ancienne config: $BACKUP_DIR"
echo ""
