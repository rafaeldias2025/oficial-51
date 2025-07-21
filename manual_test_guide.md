# Guia para Testar Criação Manual de Usuário

## 🎯 **Objetivo:**
Testar se a criação de usuários está funcionando corretamente após aplicar as correções.

## 📋 **Passos para Testar:**

### **1. Aplicar Correções (Primeiro)**
1. Acesse: http://127.0.0.1:54323
2. Vá para **SQL Editor**
3. Execute o script `fix_all_issues.sql`
4. Verifique se não há erros

### **2. Testar Criação Manual**
1. Acesse: http://127.0.0.1:54323
2. Vá para **Authentication > Users**
3. Clique em **"Add User"**
4. Preencha os dados:
   - **Email:** `maria.santos@exemplo.com`
   - **Password:** `Maria123!`
   - **Confirm Password:** `Maria123!`
5. Clique em **"Create User"**

### **3. Verificar se Funcionou**
1. **Verificar usuário criado:**
   - Vá para **Authentication > Users**
   - Procure por `maria.santos@exemplo.com`
   - Deve aparecer na lista

2. **Verificar perfil criado:**
   - Vá para **Table Editor > profiles**
   - Procure por `maria.santos@exemplo.com`
   - Deve ter role `client`

### **4. Testar Login**
1. Vá para **Authentication > Users**
2. Clique no usuário criado
3. Clique em **"Sign in as user"**
4. Teste se consegue fazer login

## ✅ **Resultado Esperado:**
- ✅ Usuário criado no auth
- ✅ Perfil criado automaticamente na tabela profiles
- ✅ Role definido como 'client'
- ✅ Login funcionando

## 🔧 **Se Não Funcionar:**
1. Verificar logs no SQL Editor
2. Executar o script de correção novamente
3. Verificar se o trigger está ativo
4. Testar criação manual do perfil se necessário

## 📊 **Dados de Teste:**
- **Email:** `maria.santos@exemplo.com`
- **Senha:** `Maria123!`
- **Nome:** Maria Santos
- **Role:** client (automático) 