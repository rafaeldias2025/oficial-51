# Guia para Remover os 3 Usuários de Teste

## 🎯 **Usuários a serem removidos:**

1. **`teste-1753134508492@exemplo.com`** (Usuário Teste)
   - ID: `b98cfa80-9d8d-4640-ac25-620b3cc2e75b`

2. **`admin@example.com`**
   - ID: `00000000-0000-0000-0000-000000000001`

3. **`claude@example.com`**
   - ID: `00000000-0000-0000-0000-000000000002`

## 📋 **Opções de Remoção:**

### **Opção 1: Via SQL Script (Recomendado)**
1. Acesse: http://127.0.0.1:54323
2. Vá para **SQL Editor**
3. Execute o script `remove_specific_users.sql`

### **Opção 2: Via Interface Manual**
1. Acesse: http://127.0.0.1:54323
2. Vá para **Authentication > Users**
3. Para cada usuário:
   - Clique no ícone de lixeira (🗑️)
   - Confirme a remoção

### **Opção 3: Via Table Editor**
1. **Remover perfis primeiro:**
   - Vá para **Table Editor > profiles**
   - Delete os registros com os IDs:
     - `b98cfa80-9d8d-4640-ac25-620b3cc2e75b`
     - `00000000-0000-0000-0000-000000000001`
     - `00000000-0000-0000-0000-000000000002`

2. **Remover usuários depois:**
   - Vá para **Authentication > Users**
   - Remova os 3 usuários listados

## ✅ **Verificação:**
Após a remoção, verifique se:
- Nenhum dos 3 emails aparece na lista de usuários
- Nenhum dos 3 IDs aparece na tabela profiles
- Apenas usuários válidos restam no sistema 