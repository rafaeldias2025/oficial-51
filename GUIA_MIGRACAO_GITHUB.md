# 🚀 Guia de Migração para Novo Repositório GitHub

## 📋 Pré-requisitos

### 1. **Criar Novo Repositório no GitHub**
- Acesse [github.com](https://github.com)
- Clique em "New repository"
- Configure o repositório:
  - **Nome:** `oficial-51` (ou outro nome)
  - **Descrição:** "Sistema de Saúde e Bem-estar - Jornada dos Sonhos"
  - **Visibilidade:** Public ou Private
  - **NÃO inicialize** com README, .gitignore ou license
- Copie a URL do repositório (ex: `https://github.com/seu-usuario/novo-repo.git`)

### 2. **Verificar Configuração Git Local**
```bash
# Verificar se o Git está configurado
git config --list | grep user

# Se não estiver configurado, configure:
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

## 🔧 Métodos de Migração

### **Método 1: Script Automatizado (Recomendado)**

#### 1. **Executar o Script**
```bash
./migrate_to_new_repo.sh https://github.com/seu-usuario/novo-repo.git
```

#### 2. **Seguir as Instruções**
- O script fará backup do repositório atual
- Adicionará o novo remote
- Enviará todo o código
- Manterá backup do remote anterior

### **Método 2: Migração Manual**

#### 1. **Fazer Backup do Remote Atual**
```bash
# Verificar remote atual
git remote -v

# Fazer backup
git remote rename origin origin-backup
```

#### 2. **Adicionar Novo Remote**
```bash
# Adicionar novo repositório
git remote add origin https://github.com/seu-usuario/novo-repo.git

# Verificar
git remote -v
```

#### 3. **Enviar Código**
```bash
# Fazer push para o novo repositório
git push -u origin main

# Se der erro de branch, tente:
git branch -M main
git push -u origin main
```

## 🔄 Restaurar Configuração Anterior

Se precisar voltar ao repositório original:

```bash
# Remover novo remote
git remote remove origin

# Restaurar remote original
git remote rename origin-backup origin

# Verificar
git remote -v
```

## 📦 Backup Completo

### **Criar Backup Local**
```bash
# Criar backup com timestamp
cp -r . ../oficial-51-backup-$(date +%Y%m%d_%H%M%S)

# Ou criar arquivo compactado
tar -czf oficial-51-backup-$(date +%Y%m%d_%H%M%S).tar.gz .
```

### **Backup de Configurações Importantes**
```bash
# Listar arquivos importantes
ls -la .env* config* package.json tailwind.config.ts
```

## 🔐 Configurações de Segurança

### **1. Verificar Arquivos Sensíveis**
```bash
# Verificar se há arquivos .env com dados sensíveis
find . -name ".env*" -type f

# Verificar se há credenciais no código
grep -r "password\|secret\|key" src/ --exclude-dir=node_modules
```

### **2. Configurar .gitignore**
```bash
# Verificar se .gitignore está correto
cat .gitignore

# Adicionar se necessário:
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
echo "*.log" >> .gitignore
```

## 🚀 Pós-Migração

### **1. Verificar no GitHub**
- Acesse o novo repositório
- Verifique se todos os arquivos estão lá
- Confirme se não há arquivos sensíveis expostos

### **2. Configurar GitHub Pages (Opcional)**
```bash
# Se quiser deploy automático
# Vá em Settings > Pages no GitHub
# Configure source como GitHub Actions
```

### **3. Configurar Actions (Opcional)**
```bash
# Criar workflow para deploy automático
mkdir -p .github/workflows
```

## 🔧 Solução de Problemas

### **Erro: "Repository not found"**
```bash
# Verificar URL do repositório
git remote get-url origin

# Verificar se o repositório existe no GitHub
# Verificar permissões de acesso
```

### **Erro: "Authentication failed"**
```bash
# Configurar token de acesso pessoal
# Ou usar SSH keys
git remote set-url origin git@github.com:usuario/repo.git
```

### **Erro: "Permission denied"**
```bash
# Verificar se você é owner/admin do repositório
# Verificar configurações de branch protection
```

## 📝 Checklist de Migração

- [ ] ✅ Criar novo repositório no GitHub
- [ ] ✅ Configurar Git local
- [ ] ✅ Fazer backup do remote atual
- [ ] ✅ Adicionar novo remote
- [ ] ✅ Enviar código
- [ ] ✅ Verificar no GitHub
- [ ] ✅ Configurar permissões
- [ ] ✅ Testar clone do novo repo
- [ ] ✅ Atualizar documentação

## 🎯 Comandos Rápidos

```bash
# Migração rápida
./migrate_to_new_repo.sh https://github.com/seu-usuario/novo-repo.git

# Verificar status
git status
git remote -v

# Fazer backup manual
cp -r . ../backup-$(date +%Y%m%d_%H%M%S)

# Restaurar configuração
git remote remove origin && git remote rename origin-backup origin
```

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** do script
2. **Confirme a URL** do repositório
3. **Verifique permissões** no GitHub
4. **Teste com repositório de teste** primeiro

---

**🎉 Migração concluída com sucesso!**

O projeto agora está no novo repositório GitHub e pronto para uso! 🚀 