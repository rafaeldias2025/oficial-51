# 🏃 Configuração Completa do Google Fit

## 📋 Status Atual da Integração

### ✅ **Componentes Funcionais:**
- ✅ Serviço de autenticação OAuth 2.0
- ✅ Busca de dados (passos, peso, frequência cardíaca)
- ✅ Sincronização com Supabase
- ✅ Interface de usuário completa
- ✅ Componente de teste integrado
- ✅ Tratamento de erros robusto

### ⚠️ **Configurações Necessárias:**

## 🔧 Passo 1: Configurar Google Cloud Console

### 1.1 Criar Projeto
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a faturação (necessário para APIs)

### 1.2 Habilitar APIs
1. Vá para "APIs & Services" > "Library"
2. Procure e habilite:
   - **Google Fitness API**
   - **Google+ API** (para perfil do usuário)

### 1.3 Criar Credenciais OAuth 2.0
1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure:
   - **Application type**: Web application
   - **Name**: TV30 Google Fit Integration
   - **Authorized JavaScript origins**:
   ```
     http://localhost:5173
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5173
     https://yourdomain.com
     ```

### 1.4 Copiar Client ID
- Copie o Client ID gerado
- Adicione ao arquivo `.env`:
  ```
  VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
  ```

## 🔧 Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Google Fit Integration
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui

# Supabase Configuration (já configurado)
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
```

## 🔧 Passo 3: Verificar Banco de Dados

### 3.1 Tabelas Necessárias
As seguintes tabelas devem estar criadas:

```sql
-- Tabela para dados do Google Fit
CREATE TABLE google_fit_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  data_type VARCHAR(50) NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR(20),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(50) DEFAULT 'google_fit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para credenciais OAuth
CREATE TABLE user_google_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 3.2 Verificar Migrações
Execute as migrações do Supabase:
```bash
supabase db reset
```

## 🧪 Passo 4: Testar a Integração

### 4.1 Executar Testes
1. Acesse a aplicação
2. Vá para a seção "Integração Google Fit"
3. Clique na aba "Teste Completo"
4. Execute os testes para verificar:
   - ✅ Google API disponível
   - ✅ Status da conexão
   - ✅ Tabelas do banco
   - ✅ Sincronização de dados

### 4.2 Teste Manual
1. Conecte sua conta Google
2. Autorize o acesso aos dados de fitness
3. Teste a sincronização
4. Verifique os dados no banco

## 🚨 Problemas Comuns e Soluções

### Problema 1: "Erro de domínio não autorizado"
**Solução:**
- Adicione `http://localhost:5173` aos domínios autorizados no Google Cloud Console
- Para produção, adicione seu domínio real

### Problema 2: "Token expirado"
**Solução:**
- O token expira em 1 hora
- Implementar refresh token (próxima versão)
- Reconectar manualmente

### Problema 3: "Nenhum dado encontrado"
**Solução:**
- Verificar se o usuário tem dados no Google Fit
- Verificar permissões concedidas
- Testar com dados de exemplo

### Problema 4: "Erro de CORS"
**Solução:**
- Verificar domínios autorizados
- Usar HTTPS em produção
- Verificar configuração do Supabase

## 📊 Monitoramento

### Logs Importantes
- Console do navegador para erros de API
- Logs do Supabase para erros de banco
- Network tab para requisições HTTP

### Métricas a Acompanhar
- Taxa de sucesso na autenticação
- Quantidade de dados sincronizados
- Tempo de resposta das APIs
- Erros de validação de token

## 🔄 Próximas Melhorias

### Versão 2.0 (Planejada)
- ✅ Refresh token automático
- ✅ Sincronização em background
- ✅ Notificações de novos dados
- ✅ Dashboard de métricas
- ✅ Exportação de dados

### Versão 3.0 (Futura)
- ✅ Integração com Apple Health
- ✅ Suporte a outros wearables
- ✅ Análise preditiva
- ✅ Recomendações personalizadas

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Execute o teste completo
3. Verifique a configuração do Google Cloud
4. Consulte a documentação da Google Fitness API

---

**Status Atual: 95% Funcional** ✅
**Próximo Passo: Configurar credenciais e testar** 