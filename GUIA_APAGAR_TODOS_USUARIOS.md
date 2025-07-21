# 🗑️ GUIA PARA APAGAR TODOS OS USUÁRIOS DE TESTE

## ⚠️ **ATENÇÃO:**
Este comando irá **APAGAR TODOS OS USUÁRIOS** do sistema. Certifique-se de que todos são realmente de teste.

---

## ✅ **COMANDO SQL PARA APAGAR TODOS:**

### **Cole este comando no SQL Editor:**

```sql
-- 1. Verificar quantos usuários existem
SELECT COUNT(*) as total_usuarios 
FROM auth.users;

-- 2. Listar todos os usuários
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Remover de profiles (execute primeiro)
DELETE FROM profiles;

-- 4. Verificar se profiles foi limpo
SELECT COUNT(*) as profiles_restantes 
FROM profiles;

-- 5. Remover de sessions
DELETE FROM sessions;

-- 6. Remover de user_sessions
DELETE FROM user_sessions;

-- 7. Remover de assessments
DELETE FROM assessments;

-- 8. Remover de assessment_responses
DELETE FROM assessment_responses;

-- 9. Remover de user_tools
DELETE FROM user_tools;

-- 10. Remover de user_courses
DELETE FROM user_courses;

-- 11. Remover de user_data
DELETE FROM user_data;

-- 12. Remover de user_preferences
DELETE FROM user_preferences;

-- 13. Remover de user_activity
DELETE FROM user_activity;

-- 14. Remover todos os usuários de auth.users
DELETE FROM auth.users;

-- 15. Verificação final
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users;

SELECT COUNT(*) as profiles_restantes 
FROM profiles;
```

---

## 📋 **PASSO A PASSO:**

### **1️⃣ Acesse o SQL Editor:**
- 🧭 No painel do Supabase, clique em **"SQL Editor"**
- 📝 Clique em **"New query"**

### **2️⃣ Execute o comando:**
- 📝 **Cole** o comando acima no SQL Editor
- 🔘 Clique em **"Run"**
- ⏳ **Aguarde** a execução

### **3️⃣ Verifique o resultado:**
- ✅ **Comando 1:** Mostra total de usuários
- ✅ **Comando 2:** Lista todos os usuários
- ✅ **Comandos 3-13:** Remove de todas as tabelas
- ✅ **Comando 14:** Remove de auth.users
- ✅ **Comandos 15-16:** Verifica se foi limpo (deve retornar 0)

### **4️⃣ Verificação final:**
- 🔄 **Volte para Authentication > Users**
- 🔄 **Atualize a página** (F5)
- ✅ **Confirme** que todos os usuários foram removidos

---

## 🎯 **RESULTADO ESPERADO:**

Após executar o comando:
- ✅ **Todos os usuários removidos**
- ✅ **Todas as tabelas limpas**
- ✅ **Painel do Supabase vazio**
- ✅ **Sistema limpo para produção**

---

## 🚨 **EM CASO DE ERRO:**

### **❌ Erro de permissão:**
- ✅ Normal para auth.users
- 🔄 Continue com os outros comandos
- 📞 Contate suporte se necessário

### **❌ Tabela não existe:**
- ✅ Pule o comando
- 🔄 Continue com os próximos
- 📝 Anote quais tabelas existem

---

## 💡 **DICAS IMPORTANTES:**

- 🔐 **Faça backup** antes de executar
- ⚡ **Execute um comando por vez** se necessário
- 📊 **Verifique o resultado** após cada comando
- 🔄 **Atualize a página** após executar

---

## 🏆 **RESULTADO FINAL:**

**🎉 SISTEMA TOTALMENTE LIMPO!**

- ✅ **Todos os usuários de teste removidos**
- ✅ **Todas as tabelas limpas**
- ✅ **Sistema pronto para produção**
- ✅ **Pronto para criar usuários reais**

**🚀 Execute este comando e o sistema ficará completamente limpo!** 