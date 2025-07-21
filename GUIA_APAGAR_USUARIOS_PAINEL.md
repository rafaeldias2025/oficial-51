# 🗑️ GUIA PARA APAGAR USUÁRIOS NO PAINEL SUPABASE

## 🎯 **PASSO A PASSO DETALHADO**

### **1️⃣ ACESSAR O PAINEL**
- ✅ Navegador já aberto em: https://supabase.com/dashboard
- 🔐 Faça login na sua conta Supabase

### **2️⃣ SELECIONAR O PROJETO**
- 📋 Clique no projeto: `skcfeldqipxaomrjfuym` (ou nome do seu projeto)
- ⏳ Aguarde carregar o dashboard

### **3️⃣ NAVEGAR PARA USUÁRIOS**
- 🧭 No menu lateral esquerdo, clique em **"Authentication"**
- 👥 Clique em **"Users"**
- 📊 Você verá a lista de todos os usuários

### **4️⃣ IDENTIFICAR USUÁRIOS PARA REMOVER**

**🔍 Procure por estes usuários problemáticos:**
- `deleted_superadmin@institutodossonhos.com`
- `admin@institudossonhos.com`
- `admin@sonhos.com`
- `Administrador Sistema`
- Qualquer usuário com role "admin" ou "superadmin"

### **5️⃣ REMOVER USUÁRIOS**

**Para cada usuário problemático:**

1. **🔍 Encontre o usuário** na lista
2. **📝 Clique nos 3 pontos** (⋮) ao lado do usuário
3. **🗑️ Selecione "Delete User"**
4. **⚠️ Confirme a remoção**
5. **✅ Repita para todos os usuários admin**

### **6️⃣ VERIFICAR REMOÇÃO**

**Após remover todos:**
- 🔄 **Atualize a página** (F5)
- 📊 **Verifique** se os usuários foram removidos
- ✅ **Confirme** que apenas usuários legítimos permanecem

---

## 🚨 **USUÁRIOS ESPECÍFICOS PARA REMOVER**

### **❌ REMOVER ESTES:**
- `deleted_superadmin@institutodossonhos.com`
- `admin@institudossonhos.com`
- `admin@sonhos.com`
- `Administrador Sistema`
- Qualquer usuário com email contendo "admin"
- Usuários com role "admin" ou "superadmin"

### **✅ MANTER ESTES:**
- Usuários legítimos do sistema
- Usuários de teste válidos
- Seu próprio usuário (se necessário)

---

## 🔧 **PROCESSO ALTERNATIVO VIA SQL**

**Se preferir usar SQL diretamente:**

1. **Acesse:** SQL Editor no painel
2. **Execute este comando:**

```sql
-- Listar todos os usuários admin
SELECT id, email, raw_user_meta_data, created_at 
FROM auth.users 
WHERE raw_user_meta_data->>'role' IN ('admin', 'superadmin')
   OR email LIKE '%admin%'
   OR email LIKE '%superadmin%';

-- Remover usuários admin específicos
DELETE FROM auth.users 
WHERE email IN (
  'deleted_superadmin@institutodossonhos.com',
  'admin@institudossonhos.com',
  'admin@sonhos.com'
);
```

---

## ✅ **VERIFICAÇÃO FINAL**

### **🔍 Após remover todos os usuários:**

1. **📊 Verifique a lista** de usuários
2. **🔐 Teste login** com usuário válido
3. **⚙️ Verifique funcionalidades** admin
4. **📱 Teste o sistema** completo

### **🎯 Resultado esperado:**
- ✅ **Apenas usuários legítimos** na lista
- ✅ **Sistema funcionando** normalmente
- ✅ **Sem usuários órfãos**
- ✅ **Controle total** do sistema

---

## 🚨 **EM CASO DE PROBLEMAS**

### **❌ Erro ao remover usuário:**
- 🔄 **Tente novamente** após alguns segundos
- 🔍 **Verifique permissões** da sua conta
- 📞 **Contate suporte** se necessário

### **❌ Usuário não aparece na lista:**
- 🔄 **Atualize a página**
- 🔍 **Verifique filtros** aplicados
- 📊 **Confirme** se o usuário existe

### **❌ Sistema não funciona após remoção:**
- 🔄 **Reinicie o servidor:** `npm run dev`
- 🔍 **Verifique logs** de erro
- 📱 **Teste funcionalidades** uma por uma

---

## 💡 **DICAS IMPORTANTES**

- 🔐 **Faça backup** antes de remover
- ⏰ **Remova um por vez** para evitar erros
- 📊 **Verifique** após cada remoção
- 🔄 **Teste o sistema** após completar
- 📱 **Mantenha** pelo menos um usuário admin válido

---

## ✅ **CHECKLIST DE CONCLUSÃO**

- [ ] **Todos os usuários problemáticos removidos**
- [ ] **Apenas usuários legítimos permanecem**
- [ ] **Sistema funcionando normalmente**
- [ ] **Login testado**
- [ ] **Funcionalidades admin verificadas**
- [ ] **Backup realizado** (se necessário)

**🎉 RESULTADO: Sistema limpo e seguro!** 