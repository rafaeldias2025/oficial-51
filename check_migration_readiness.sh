#!/bin/bash

echo "🔍 Verificação de Preparação para Migração"
echo "=========================================="

# Verificar se estamos em um repositório Git
if [ ! -d ".git" ]; then
    echo "❌ Erro: Este diretório não é um repositório Git"
    echo "Execute 'git init' primeiro"
    exit 1
fi

echo "✅ Repositório Git encontrado"

# Verificar configuração do Git
echo ""
echo "📋 Configuração do Git:"
USER_NAME=$(git config user.name)
USER_EMAIL=$(git config user.email)

if [ -z "$USER_NAME" ] || [ -z "$USER_EMAIL" ]; then
    echo "❌ Git não configurado"
    echo "Configure com:"
    echo "  git config --global user.name 'Seu Nome'"
    echo "  git config --global user.email 'seu-email@exemplo.com'"
else
    echo "✅ Git configurado: $USER_NAME <$USER_EMAIL>"
fi

# Verificar remote atual
echo ""
echo "🔗 Remote atual:"
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null)
if [ -n "$CURRENT_REMOTE" ]; then
    echo "✅ Remote configurado: $CURRENT_REMOTE"
else
    echo "⚠️  Nenhum remote configurado"
fi

# Verificar status do repositório
echo ""
echo "📊 Status do repositório:"
UNTRACKED=$(git status --porcelain | grep "^??" | wc -l)
MODIFIED=$(git status --porcelain | grep "^ M" | wc -l)
STAGED=$(git status --porcelain | grep "^M " | wc -l)

if [ "$UNTRACKED" -gt 0 ] || [ "$MODIFIED" -gt 0 ] || [ "$STAGED" -gt 0 ]; then
    echo "⚠️  Há mudanças não commitadas:"
    echo "  - Arquivos não rastreados: $UNTRACKED"
    echo "  - Arquivos modificados: $MODIFIED"
    echo "  - Arquivos em staging: $STAGED"
    echo ""
    echo "💡 Recomendação: Faça commit das mudanças antes da migração"
else
    echo "✅ Repositório limpo - pronto para migração"
fi

# Verificar arquivos importantes
echo ""
echo "📁 Verificando arquivos importantes:"
IMPORTANT_FILES=("package.json" "tailwind.config.ts" "vite.config.ts" ".gitignore")
MISSING_FILES=()

for file in "${IMPORTANT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (faltando)"
        MISSING_FILES+=("$file")
    fi
done

# Verificar arquivos sensíveis
echo ""
echo "🔐 Verificando arquivos sensíveis:"
SENSITIVE_FILES=(".env" ".env.local" ".env.production")
EXPOSED_SENSITIVE=()

for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "$file" .gitignore 2>/dev/null; then
            echo "✅ $file (no .gitignore)"
        else
            echo "⚠️  $file (NÃO está no .gitignore)"
            EXPOSED_SENSITIVE+=("$file")
        fi
    fi
done

# Verificar tamanho do repositório
echo ""
echo "📦 Tamanho do repositório:"
REPO_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo "  Tamanho total: $REPO_SIZE"

# Verificar dependências
echo ""
echo "📦 Verificando dependências:"
if [ -f "package.json" ]; then
    if [ -d "node_modules" ]; then
        echo "✅ node_modules presente"
    else
        echo "⚠️  node_modules não encontrado"
        echo "  Execute: npm install"
    fi
else
    echo "❌ package.json não encontrado"
fi

# Resumo
echo ""
echo "📋 Resumo da Verificação:"
echo "========================"

if [ ${#MISSING_FILES[@]} -eq 0 ] && [ ${#EXPOSED_SENSITIVE[@]} -eq 0 ]; then
    echo "✅ Projeto pronto para migração!"
    echo ""
    echo "🚀 Próximos passos:"
    echo "   1. Crie um novo repositório no GitHub"
    echo "   2. Execute: ./migrate_to_new_repo.sh <nova-url>"
    echo "   3. Verifique o novo repositório"
else
    echo "⚠️  Alguns problemas encontrados:"
    
    if [ ${#MISSING_FILES[@]} -gt 0 ]; then
        echo "   - Arquivos faltando: ${MISSING_FILES[*]}"
    fi
    
    if [ ${#EXPOSED_SENSITIVE[@]} -gt 0 ]; then
        echo "   - Arquivos sensíveis expostos: ${EXPOSED_SENSITIVE[*]}"
        echo "   - Adicione ao .gitignore antes da migração"
    fi
    
    echo ""
    echo "🔧 Corrija os problemas antes de continuar"
fi

echo ""
echo "📖 Para mais informações, consulte: GUIA_MIGRACAO_GITHUB.md" 