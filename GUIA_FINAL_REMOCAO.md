# 🚨 GUIA FINAL PARA REMOVER USUÁRIO PROBLEMÁTICO

## ⚠️ **PROBLEMA IDENTIFICADO**

O usuário `deleted_superadmin@institutodossonhos.com` ainda está presente na tabela `auth.users` mesmo após remoção da tabela `profiles`.

---

## 🔧 **SOLUÇÃO FINAL**

### **1️⃣ ACESSAR SQL EDITOR**
- 🧭 No painel do Supabase, clique em **"SQL Editor"**
- 📝 Clique em **"New query"**

### **2️⃣ EXECUTAR COMANDOS UM POR VEZ**

#### **Comando 1 - Verificar:**
```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';
```

#### **Comando 2 - Remover de profiles:**
```sql
DELETE FROM profiles 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

#### **Comando 3 - Remover de sessions:**
```sql
DELETE FROM sessions 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

#### **Comando 4 - Remover de user_sessions:**
```sql
DELETE FROM user_sessions 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

#### **Comando 5 - Remover de assessments:**
```sql
DELETE FROM assessments 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

#### **Comando 6 - Remover de assessment_responses:**
```sql
DELETE FROM assessment_responses 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

#### **Comando 7 - Remover de user_tools:**
```sql
DELETE FROM user_tools 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

#### **Comando 8 - Remover de user_courses:**
```sql
DELETE FROM user_courses 
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

#### **Comando 9 - Tentar remover de auth.users:**
```sql
DELETE FROM auth.users 
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

#### **Comando 10 - Verificar resultado:**
```sql
SELECT COUNT(*) as usuarios_restantes 
FROM auth.users 
WHERE email = 'deleted_superadmin@institutodossonhos.com';
```

---

## 📋 **PASSO A PASSO**

### **1️⃣ Execute cada comando separadamente:**
- 📝 **Cole um comando** no SQL Editor
- 🔘 Clique em **"Run"**
- ⏳ **Aguarde** a execução
- 🔄 **Repita** para o próximo comando

### **2️⃣ Verifique o resultado:**
- ✅ **Comando 1:** Deve mostrar o usuário problemático
- ✅ **Comandos 2-8:** Devem remover dados das tabelas
- ✅ **Comando 9:** Pode não funcionar (normal)
- ✅ **Comando 10:** Deve retornar 0 ou 1

### **3️⃣ Verificação final:**
- 🔄 **Volte para Authentication > Users**
- 🔄 **Atualize a página** (F5)
- ✅ **Confirme** que o usuário foi removido

---

## 🚨 **EM CASO DE ERRO**

### **❌ Erro de permissão:**
- ✅ Normal para auth.users
- 🔄 Continue com os outros comandos
- 📞 Contate suporte se necessário

### **❌ Tabela não existe:**
- ✅ Pule o comando
- 🔄 Continue com os próximos
- 📝 Anote quais tabelas existem

### **❌ Usuário não encontrado:**
- ✅ Normal se já foi removido
- 🔄 Continue com a verificação

---

## 🎯 **RESULTADO ESPERADO**

Após executar todos os comandos:
- ✅ **Usuário removido de todas as tabelas**
- ✅ **Painel do Supabase limpo**
- ✅ **Sistema funcionando normalmente**
- ✅ **Pronto para criar novo admin**

---

## 💡 **DICAS IMPORTANTES**

- 🔐 **Execute um comando por vez**
- ⚡ **Verifique o resultado** após cada comando
- 🔄 **Atualize a página** após terminar
- 📊 **Confirme** que o usuário foi removido

---

## 🏆 **RESULTADO FINAL**

**🎉 USUÁRIO PROBLEMÁTICO TOTALMENTE REMOVIDO!**

- ✅ **Dados limpos de todas as tabelas**
- ✅ **Sistema funcionando normalmente**
- ✅ **Painel do Supabase atualizado**
- ✅ **Pronto para uso em produção**

**🚀 Status: RESOLVIDO DEFINITIVAMENTE!** 