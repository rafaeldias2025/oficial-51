# Instituto TV30 - Plataforma de Saúde e Bem-estar

Uma plataforma moderna de saúde e bem-estar construída com React, TypeScript e Supabase.

## 🚀 Funcionalidades

- **Dashboard Interativo**: Visualizações avançadas de dados de saúde com gráficos dinâmicos
- **Sistema de Missões Diárias**: Acompanhamento de objetivos e hábitos saudáveis
- **Painel Administrativo**: Gestão completa de usuários, cursos e conteúdo
- **Integração de Dados de Saúde**: Conectividade com dispositivos e APIs de saúde
- **Sistema de Gamificação**: Pontuação, níveis e conquistas para engajamento
- **Responsivo**: Interface otimizada para desktop e mobile

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Charts**: Recharts para visualizações de dados
- **State Management**: React Context + Hooks customizados
- **Validação**: Zod para validação de schemas
- **Deploy**: Vercel/Netlify ready

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── admin/          # Componentes do painel administrativo
│   ├── dashboard/      # Componentes do dashboard principal
│   ├── forms/          # Formulários especializados
│   ├── layout/         # Componentes de layout (header, sidebar)
│   └── ui/             # Componentes base (botões, inputs, etc.)
├── hooks/              # Hooks customizados para lógica de negócio
├── contexts/           # Context providers para estado global
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias e helpers
├── services/           # Integrações com APIs externas
├── pages/              # Páginas principais da aplicação
└── integrations/       # Configurações de integrações (Supabase)
```

### Hooks Principais

- `useAuth`: Autenticação de usuários
- `useAdminAuth`: Verificação de permissões administrativas
- `useCourses`: Gerenciamento de cursos e módulos
- `useMissaoDia`: Sistema de missões diárias
- `usePhysicalData`: Dados físicos e de saúde do usuário
- `useProgressData`: Visualização de progresso e estatísticas

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase

### 1. Clone o repositório

```bash
git clone <repository-url>
cd instituto-tv30
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local`:

```env
# Configurações do Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Lista de emails de administradores
VITE_ADMIN_EMAILS=admin@instituto.com,suporte@instituto.com

# Configurações da aplicação
VITE_APP_NAME=Instituto TV30
VITE_APP_VERSION=1.0.0

# Configurações de desenvolvimento
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=warn
```

### 4. Configure o banco de dados

Execute as migrações do Supabase:

```bash
# Navegar para a pasta supabase (se usando Supabase CLI)
cd supabase
supabase db reset

# Ou aplique manualmente as migrações no dashboard do Supabase
```

### 5. Execute a aplicação

```bash
npm run dev
```

## 🔒 Segurança e Permissões

### Sistema de Roles

- **Admin**: Acesso completo ao sistema e painel administrativo
- **Client**: Usuários padrão com acesso às funcionalidades principais
- **Visitor**: Acesso limitado para demonstração

### Políticas RLS (Row Level Security)

O projeto implementa políticas rigorosas de segurança no Supabase:

- Usuários só podem acessar seus próprios dados
- Administradores têm acesso completo quando necessário
- Operações são auditadas através de logs administrativos

### Validação de Dados

- Validação no frontend com schemas TypeScript
- Validação no backend com políticas do banco
- Sanitização de inputs para prevenir XSS e SQL injection

## 📊 Funcionalidades de Administração

### Painel Administrativo

- **Gestão de Usuários**: Visualizar, editar e gerenciar contas de usuários
- **Gestão de Cursos**: Criar, editar e organizar cursos e módulos
- **Analytics**: Relatórios de uso e engagement dos usuários
- **Logs de Auditoria**: Rastreamento de ações administrativas
- **Upload de Arquivos**: Sistema seguro para imagens e documentos

### Acesso ao Painel Admin

1. Faça login com um email listado em `VITE_ADMIN_EMAILS`
2. O sistema automaticamente detectará e concederá permissões administrativas
3. Acesse `/admin` para entrar no painel

## 🔍 Sistema de Logging

O projeto inclui um sistema de logging centralizado:

```typescript
import { logger } from '@/utils/logger';

// Diferentes níveis de log
logger.debug('Mensagem de debug', data);
logger.info('Informação importante', data);
logger.warn('Aviso sobre algo', data);
logger.error('Erro crítico', error);

// Performance logging
logger.time('operacao-pesada');
// ... código ...
logger.timeEnd('operacao-pesada');
```

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes com coverage
npm run test:coverage

# Executar testes E2E
npm run test:e2e
```

## 📱 Responsividade

A aplicação é totalmente responsiva com:

- Breakpoints otimizados para mobile, tablet e desktop
- Componentes adaptáveis
- Header móvel com navegação otimizada
- Formulários mobile-friendly

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

### Deploy no Vercel

```bash
npm install -g vercel
vercel --prod
```

### Variáveis de Ambiente em Produção

Certifique-se de configurar todas as variáveis de ambiente no seu provedor de deploy:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAILS`
- `VITE_DEBUG_MODE=false`
- `VITE_LOG_LEVEL=error`

## 🔄 Atualizações Recentes

### v1.1.0 - Correções Críticas e Melhorias

- **✅ Segurança**: Removidas chaves hardcoded do código fonte
- **✅ Performance**: Otimização de hooks com useCallback e useMemo
- **✅ Type Safety**: Implementação completa de interfaces TypeScript
- **✅ Arquitetura**: Consolidação de hooks duplicados e limpeza de código
- **✅ UX/UI**: Melhorias na interface e tratamento de erros
- **✅ Logging**: Sistema centralizado de logs para debugging
- **✅ RLS**: Correção completa das políticas de segurança do banco

### Correções Implementadas

1. **Problemas de Segurança**:
   - Chaves Supabase movidas para variáveis de ambiente
   - Emails admin configuráveis via environment
   - Políticas RLS corrigidas para administradores

2. **Otimizações de Performance**:
   - Hooks memoizados com useCallback
   - Queries otimizadas para evitar N+1
   - Subscriptions com cleanup adequado

3. **Type Safety Completo**:
   - Interfaces centralizadas em `/types/admin.ts`
   - Remoção de `any` types
   - Validação de dados em runtime

4. **Arquitetura Limpa**:
   - Remoção de hooks duplicados
   - Consolidação de responsabilidades
   - Estrutura de pastas organizada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- Email: suporte@instituto.com
- Documentação: [docs.instituto.com](https://docs.instituto.com)
- Issues: [GitHub Issues](https://github.com/instituto-tv30/issues)
