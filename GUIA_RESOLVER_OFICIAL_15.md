# 🚨 GUIA PARA RESOLVER PROBLEMA NO OFICIAL-15

## ⚠️ **PROBLEMA IDENTIFICADO:**

O repositório `rafaeldias2025/oficial-15` contém credenciais expostas no arquivo `check_user_status.js`.

### **❌ Credenciais expostas:**
```javascript
const supabaseUrl = 'https://skcfeldqipxaomrjfuym.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxODU4MTEsImV4cCI6MjA0OTc2MTgxMX0.pF8sKzN8B6ckzOLPkdOMpRQKMfZ5aRVQP0nP-YfrBcg';
```

---

## ✅ **SOLUÇÃO:**

### **1️⃣ Remover arquivo com credenciais:**
```bash
# No repositório oficial-15
rm check_user_status.js
```

### **2️⃣ Criar versão segura:**
```javascript
// check_user_status_secure.js
import { createClient } from '@supabase/supabase-js';

// Configuração segura usando variáveis de ambiente
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rafaeldias2025.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Erro: VITE_SUPABASE_ANON_KEY não configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserStatus() {
  console.log('🔍 Verificando status do usuário...');
  
  try {
    // Verificar usuário logado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Erro de autenticação:', authError);
      return;
    }
    
    if (!user) {
      console.log('❌ Nenhum usuário logado');
      return;
    }
    
    console.log('✅ Usuário logado:', {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      email_confirmed: user.email_confirmed_at ? 'Sim' : 'Não'
    });
    
    // Verificar perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (profileError) {
      console.log('⚠️ Erro ao buscar perfil:', profileError);
    } else {
      console.log('📋 Perfil:', profile);
    }
    
    // Verificar se é admin
    const adminEmails = process.env.VITE_ADMIN_EMAILS?.split(',') || [
      'admin@instituto.com',
      'admin@sonhos.com'
    ];
    
    const isAdmin = adminEmails.includes(user.email || '');
    console.log('🔐 É admin?', isAdmin ? '✅ SIM' : '❌ NÃO');
    console.log('📧 Email atual:', user.email);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkUserStatus();
```

### **3️⃣ Criar arquivo .env no oficial-15:**
```env
# Supabase Configuration - SEGURO
VITE_SUPABASE_URL=https://rafaeldias2025.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_ADMIN_EMAILS=admin@instituto.com,admin@sonhos.com
NODE_ENV=development
```

### **4️⃣ Atualizar .gitignore:**
```gitignore
# Adicionar ao .gitignore
.env
.env.local
.env.production
```

---

## 🛡️ **AÇÕES IMEDIATAS:**

### **1️⃣ No repositório oficial-15:**
```bash
# Remover arquivo com credenciais
rm check_user_status.js

# Criar arquivo .env
cp config.env.example .env

# Adicionar credenciais reais ao .env
# NÃO commite o arquivo .env!
```

### **2️⃣ Rotacionar credenciais:**
- 🔄 **Gere novas chaves** no Supabase
- 🔄 **Atualize o .env** com as novas chaves
- 🔄 **Teste a aplicação** para garantir funcionamento

### **3️⃣ Verificar outros arquivos:**
```bash
# Procurar por credenciais expostas
grep -r "eyJ" .
grep -r "supabaseKey.*=" .
```

---

## 🎯 **RESULTADO ESPERADO:**

Após aplicar as correções:
- ✅ **Credenciais protegidas**
- ✅ **Arquivo seguro criado**
- ✅ **Configuração segura**
- ✅ **Pronto para produção**

**🚀 Sistema seguro em ambos os repositórios!** 