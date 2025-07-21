# 🚨 GUIA RÁPIDO - COMANDO SQL CORRETO

## ❌ **ERRO IDENTIFICADO:**
O comando anterior usava `user_id` na tabela `auth.users`, mas essa tabela usa `id`.

## ✅ **SOLUÇÃO CORRETA:**

### **1️⃣ Cole este comando no SQL Editor:**

```sql
-- 1. Verificar usuário
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 2. Remover de profiles
DELETE FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 3. Remover de auth.users (CORRETO)
DELETE FROM auth.users 
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 4. Verificar se foi removido
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';

-- 5. Listar usuários restantes
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;
```

### **2️⃣ Execute o comando:**
- 📝 **Cole** o comando no SQL Editor
- 🔘 Clique em **"Run"**
- ⏳ **Aguarde** a execução

### **3️⃣ Verifique o resultado:**
- ✅ **Comando 1:** Mostra o usuário problemático
- ✅ **Comando 2:** Remove de profiles
- ✅ **Comando 3:** Remove de auth.users
- ✅ **Comando 4:** Deve retornar 0
- ✅ **Comando 5:** Lista usuários restantes

### **4️⃣ Verificação final:**
- 🔄 **Volte para Authentication > Users**
- 🔄 **Atualize a página** (F5)
- ✅ **Confirme** que o usuário foi removido

---

## 🎯 **RESULTADO ESPERADO:**

Após executar o comando:
- ✅ **Usuário removido de auth.users**
- ✅ **Usuário removido de profiles**
- ✅ **Painel do Supabase limpo**
- ✅ **Sistema funcionando normalmente**

**🚀 Execute este comando e o problema será resolvido!** 