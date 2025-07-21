# 🔧 GUIA PARA USAR O SQL EDITOR CORRETAMENTE

## 🚨 **PROBLEMA IDENTIFICADO**

Você estava tentando executar código JavaScript no SQL Editor, mas ele só aceita comandos SQL puros.

---

## 📋 **PASSO A PASSO CORRETO**

### **1️⃣ ACESSAR O SQL EDITOR**
- 🧭 No painel do Supabase, clique em **"SQL Editor"** no menu lateral
- 📝 Clique em **"New query"** para criar uma nova consulta

### **2️⃣ COPIAR O COMANDO SQL**
Copie e cole este comando SQL puro:

```sql
-- Verificar usuário problemático
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- Remover da tabela profiles
DELETE FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Verificar se foi removido
SELECT COUNT(*) as profiles_restantes 
FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Listar profiles restantes
SELECT user_id, email, role 
FROM profiles 
ORDER BY created_at DESC;
```

### **3️⃣ EXECUTAR O COMANDO**
- 📝 **Cole o comando** no SQL Editor
- 🔘 Clique em **"Run"** (botão azul)
- ⏳ **Aguarde** a execução

### **4️⃣ VERIFICAR RESULTADO**
- ✅ **Primeira consulta:** Mostra o usuário problemático
- ✅ **Segunda consulta:** Remove o profile
- ✅ **Terceira consulta:** Confirma remoção (deve retornar 0)
- ✅ **Quarta consulta:** Lista todos os profiles restantes

---

## 🚨 **COMANDOS ALTERNATIVOS**

### **Se o comando acima não funcionar, tente este:**

```sql
-- Comando mais simples
DELETE FROM profiles 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- Verificar resultado
SELECT * FROM profiles;
```

### **Para remover outros usuários admin:**

```sql
-- Remover todos os usuários admin
DELETE FROM profiles 
WHERE role = 'admin' 
   OR role = 'superadmin'
   OR email LIKE '%admin%';

-- Verificar resultado
SELECT * FROM profiles;
```

---

## ✅ **VERIFICAÇÃO FINAL**

### **Após executar o SQL:**

1. **Volte para Authentication > Users**
2. **Verifique** se o usuário foi removido
3. **Atualize a página** (F5) se necessário
4. **Teste o sistema** para garantir funcionamento

---

## 🚨 **EM CASO DE ERRO**

### **❌ Erro de permissão:**
- 🔐 Verifique se você tem acesso de admin
- 📞 Contate suporte se necessário

### **❌ Erro de sintaxe:**
- ✅ Use apenas comandos SQL puros
- ❌ Não use JavaScript no SQL Editor
- 📝 Copie exatamente o comando fornecido

### **❌ Usuário não encontrado:**
- ✅ Normal se já foi removido
- 🔄 Continue com a verificação

---

## 💡 **DICAS IMPORTANTES**

- 🔐 **Faça backup** antes de executar
- ⚡ **Execute um comando por vez** se necessário
- 📊 **Verifique o resultado** após cada comando
- 🔄 **Atualize a página** após executar

---

## 🎯 **RESULTADO ESPERADO**

Após executar o SQL:
- ✅ **Usuário problemático removido**
- ✅ **Sistema funcionando normalmente**
- ✅ **Painel do Supabase limpo**
- ✅ **Pronto para criar novo admin**

**🎉 RESULTADO: Sistema limpo e seguro!** 