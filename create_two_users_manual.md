# Guia para Criar 2 Usuários Manualmente

## 🎯 **Usuários a serem criados:**

### **Usuário 1:**
- **Email:** `pedro.oliveira@exemplo.com`
- **Password:** `Pedro123!`
- **Nome:** Pedro Oliveira
- **Role:** client (automático)

### **Usuário 2:**
- **Email:** `ana.costa@exemplo.com`
- **Password:** `Ana123!`
- **Nome:** Ana Costa
- **Role:** client (automático)

## 📋 **Passos para Criar:**

### **1. Acessar Supabase Studio**
- Abra: http://127.0.0.1:54323
- Faça login se necessário

### **2. Criar Primeiro Usuário (Pedro)**
1. **Vá para Authentication > Users**
2. **Clique em "Add User"**
3. **Preencha os dados:**
   - **Email:** `pedro.oliveira@exemplo.com`
   - **Password:** `Pedro123!`
   - **Confirm Password:** `Pedro123!`
4. **Clique em "Create User"**
5. **Verifique se foi criado:**
   - Deve aparecer na lista de usuários
   - Vá para **Table Editor > profiles**
   - Verifique se o perfil foi criado automaticamente

### **3. Criar Segundo Usuário (Ana)**
1. **Volte para Authentication > Users**
2. **Clique em "Add User"**
3. **Preencha os dados:**
   - **Email:** `ana.costa@exemplo.com`
   - **Password:** `Ana123!`
   - **Confirm Password:** `Ana123!`
4. **Clique em "Create User"**
5. **Verifique se foi criado:**
   - Deve aparecer na lista de usuários
   - Vá para **Table Editor > profiles**
   - Verifique se o perfil foi criado automaticamente

### **4. Verificar Resultado Final**
1. **Authentication > Users:**
   - Deve ter 3 usuários (incluindo o João Silva criado anteriormente)
   - `joao.silva@exemplo.com`
   - `pedro.oliveira@exemplo.com`
   - `ana.costa@exemplo.com`

2. **Table Editor > profiles:**
   - Deve ter 3 perfis correspondentes
   - Todos com role `client`

## ✅ **Resultado Esperado:**
- ✅ 2 novos usuários criados
- ✅ 2 novos perfis criados automaticamente
- ✅ Todos com role `client`
- ✅ Sistema funcionando corretamente

## 🔧 **Se Houver Problemas:**
1. Verificar se o trigger está funcionando
2. Executar o script `fix_all_issues.sql` novamente
3. Criar perfis manualmente se necessário

## 📊 **Lista Final Esperada:**
```
Authentication > Users:
- joao.silva@exemplo.com
- pedro.oliveira@exemplo.com
- ana.costa@exemplo.com

Table Editor > profiles:
- joao.silva@exemplo.com (client)
- pedro.oliveira@exemplo.com (client)
- ana.costa@exemplo.com (client)
``` 