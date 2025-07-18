# 🧪 Guia de Teste - Google Fit Integration

## ✅ **STATUS: DOMÍNIO AUTORIZADO**

### 🎯 **Passo a Passo para Testar:**

#### 1. **Acesse a Aplicação**
```
http://localhost:8080
```

#### 2. **Navegue para Integração Google Fit**
- Vá para a seção de integração Google Fit
- Clique na aba **"Debug"** primeiro

#### 3. **Verifique a Configuração (Debug)**
Na aba Debug, verifique:
- ✅ **Client ID**: Configurado corretamente
- ✅ **Domínio Atual**: `http://localhost:8080`
- ✅ **Google API**: Deve estar carregada
- ✅ **Auth2**: Deve estar inicializado
- ✅ **LocalStorage**: Tokens (se houver)

#### 4. **Execute Testes**
1. **Clique em "Testar Google API"**
2. **Clique em "Re-verificar"**
3. **Se houver erros, clique em "Limpar Cache"**

#### 5. **Teste a Conexão**
Na aba **"Integração OAuth 2.0"**:
1. **Clique em "Conectar Google Fit"**
2. **Autorize o acesso** na janela do Google
3. **Verifique se conectou** com sucesso

#### 6. **Execute Teste Completo**
Na aba **"Teste Completo"**:
1. **Clique em "Executar Testes Completos"**
2. **Verifique todos os testes**:
   - ✅ Google API disponível
   - ✅ Status da conexão
   - ✅ Tabelas do banco
   - ✅ Sincronização de dados

### 🔍 **O que Procurar nos Logs:**

#### ✅ **Logs de Sucesso:**
```
🔐 Iniciando autenticação Google Fit...
✅ Google API já carregada
🔑 Solicitando autorização...
✅ Usuário autenticado: seu-email@gmail.com
💾 Salvando credenciais...
✅ Credenciais salvas no Supabase
🎉 Autenticação Google Fit concluída com sucesso!
```

#### ❌ **Logs de Erro Comuns:**
```
❌ Erro na autenticação: Falha na autenticação com Google: access_denied
❌ Erro na autenticação: Falha na autenticação com Google: popup_closed
❌ Erro na autenticação: Falha na autenticação com Google: idpiframe_initialization_failed
```

### 🚨 **Problemas e Soluções:**

#### **Problema 1: "access_denied"**
**Causa:** Usuário negou permissão
**Solução:** 
- Clique em "Limpar Cache" no Debug
- Tente conectar novamente
- Certifique-se de autorizar todas as permissões

#### **Problema 2: "popup_closed"**
**Causa:** Usuário fechou a janela de autorização
**Solução:**
- Tente novamente
- Verifique se o popup não foi bloqueado pelo navegador

#### **Problema 3: "idpiframe_initialization_failed"**
**Causa:** Problemas de CORS ou rede
**Solução:**
- Verifique conexão com internet
- Tente em navegador diferente
- Limpe cache do navegador

#### **Problema 4: "Domínio não autorizado"**
**Causa:** Domínio não está na lista do Google Cloud
**Solução:**
- Adicione `http://localhost:8080` aos domínios autorizados
- Aguarde alguns minutos para propagação

### 📊 **Dados que Devem Sincronizar:**

Após conexão bem-sucedida, você deve ver:
- **Passos diários** do Google Fit
- **Peso corporal** (se disponível)
- **Frequência cardíaca** (se disponível)
- **Calorias queimadas** (se disponível)

### 🎯 **Teste Final:**

1. **Conecte sua conta Google**
2. **Autorize o acesso aos dados**
3. **Execute sincronização**
4. **Verifique dados na aba "Verificação de Dados"**

### ✅ **Critérios de Sucesso:**

- ✅ Conecta sem erros
- ✅ Autoriza permissões
- ✅ Sincroniza dados
- ✅ Salva no banco
- ✅ Mostra dados na interface

### 📞 **Se Ainda Houver Problemas:**

1. **Verifique a aba Debug** para detalhes específicos
2. **Consulte os logs** no console do navegador
3. **Teste em navegador diferente** (Chrome recomendado)
4. **Verifique se tem dados** no Google Fit

---

**Status Atual: PRONTO PARA TESTE** 🚀
**Próximo Passo: Execute os testes seguindo este guia** 