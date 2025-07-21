#!/bin/bash

# Script para migrar o projeto para um novo repositório GitHub
# Uso: ./migrate_to_new_repo.sh <novo-repo-url>

echo "🚀 Script de Migração para Novo Repositório GitHub"
echo "=================================================="

# Verificar se a URL do novo repositório foi fornecida
if [ -z "$1" ]; then
    echo "❌ Erro: URL do novo repositório não fornecida"
    echo "Uso: ./migrate_to_new_repo.sh <novo-repo-url>"
    echo "Exemplo: ./migrate_to_new_repo.sh https://github.com/seu-usuario/novo-repo.git"
    exit 1
fi

NEW_REPO_URL=$1

echo "📋 Configurações:"
echo "  - Repositório atual: $(git remote get-url origin 2>/dev/null || echo 'Nenhum')"
echo "  - Novo repositório: $NEW_REPO_URL"
echo ""

# Verificar se estamos em um repositório Git
if [ ! -d ".git" ]; then
    echo "❌ Erro: Este diretório não é um repositório Git"
    echo "Execute 'git init' primeiro"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Aviso: Há mudanças não commitadas"
    echo "Deseja fazer commit das mudanças antes de migrar? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "📝 Fazendo commit das mudanças..."
        git add .
        git commit -m "🔧 Preparação para migração - Últimas correções"
    fi
fi

echo ""
echo "🔄 Iniciando migração..."

# Fazer backup do remote atual
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null)
if [ -n "$CURRENT_REMOTE" ]; then
    echo "📦 Fazendo backup do remote atual..."
    git remote rename origin origin-backup
fi

# Adicionar novo remote
echo "🔗 Adicionando novo remote..."
git remote add origin "$NEW_REPO_URL"

# Verificar se o novo remote foi adicionado corretamente
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "❌ Erro: Não foi possível adicionar o novo remote"
    exit 1
fi

echo "✅ Novo remote adicionado com sucesso"

# Fazer push para o novo repositório
echo "📤 Enviando código para o novo repositório..."
echo ""

# Tentar push com --set-upstream
if git push -u origin main; then
    echo ""
    echo "🎉 Migração concluída com sucesso!"
    echo ""
    echo "📋 Resumo:"
    echo "  ✅ Código enviado para: $NEW_REPO_URL"
    echo "  ✅ Branch principal configurada"
    echo "  ✅ Backup do remote anterior mantido como 'origin-backup'"
    echo ""
    echo "🔗 Para verificar o novo repositório:"
    echo "   git remote -v"
    echo ""
    echo "🔄 Para voltar ao repositório anterior:"
    echo "   git remote remove origin"
    echo "   git remote rename origin-backup origin"
    echo ""
    echo "📝 Próximos passos:"
    echo "   1. Verifique o novo repositório no GitHub"
    echo "   2. Configure as permissões e colaboradores"
    echo "   3. Atualize a documentação se necessário"
    
else
    echo ""
    echo "❌ Erro ao fazer push para o novo repositório"
    echo ""
    echo "🔧 Possíveis soluções:"
    echo "   1. Verifique se o repositório existe no GitHub"
    echo "   2. Verifique suas credenciais Git"
    echo "   3. Verifique se você tem permissão para push"
    echo ""
    echo "🔄 Restaurando configuração anterior..."
    git remote remove origin
    if [ -n "$CURRENT_REMOTE" ]; then
        git remote rename origin-backup origin
    fi
    echo "✅ Configuração anterior restaurada"
fi 