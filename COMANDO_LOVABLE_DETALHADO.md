# 🚀 COMANDO DETALHADO PARA LOVABLE

## ⚡ **COMANDO COMPLETO:**

```bash
# Criar app React com todas as funcionalidades de saúde
npx create-react-app health-platform --template typescript
cd health-platform
npm install @supabase/supabase-js react-router-dom recharts tailwindcss @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip framer-motion lucide-react date-fns class-variance-authority clsx react-day-picker tailwind-merge tailwindcss-animate
```

## 🎯 **FUNCIONALIDADES DETALHADAS:**

### 📱 **Menu Lateral Completo:**
```typescript
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'inicio', label: 'Missão do Dia', icon: Activity },
  { id: 'plataforma-sonhos', label: 'Plataforma dos Sonhos', icon: GraduationCap },
  { id: 'sessoes', label: 'Sessões', icon: FileText },
  { id: 'ranking', label: 'Ranking', icon: Trophy },
  { id: 'avaliacoes', label: 'Avaliações', icon: ClipboardList },
  { id: 'semanal', label: '📊 Semanal', icon: Calendar, highlight: true },
  { id: 'avaliacao-semanal', label: 'Avaliação Semanal', icon: Calendar },
  { id: 'metas', label: 'Minhas Metas', icon: Target },
  { id: 'desafios', label: 'Desafios', icon: Award },
  { id: 'diario', label: 'Diário de Saúde', icon: FileText },
  { id: 'teste-sabotadores', label: 'Teste de Sabotadores', icon: Settings },
  { id: 'meu-progresso', label: 'Meu Progresso', icon: BarChart3 },
  { id: 'analise-avancada', label: 'Análise Avançada', icon: BarChart3 },
  { id: 'google-fit', label: 'Google Fit', icon: Activity },
  { id: 'openScale-test', label: 'Teste Xiaomi Mi Body Scale 2', icon: Scale },
  { id: 'assinaturas', label: 'Assinaturas', icon: CreditCard },
  { id: 'apps', label: 'Apps', icon: Grid },
  { id: 'ajuda', label: 'Ajuda', icon: HelpCircle }
]
```

### 📚 **Plataforma dos Sonhos (Netflix-style):**
```typescript
const courses = [
  {
    id: 1,
    title: "Fundamentos da Saúde",
    category: "Saúde Básica",
    duration: "2h 30min",
    progress: 75,
    thumbnail: "/thumbnails/saude-basica.jpg",
    episodes: [
      { title: "Introdução", duration: "15min" },
      { title: "Nutrição Básica", duration: "20min" },
      { title: "Exercícios", duration: "25min" }
    ]
  },
  {
    id: 2,
    title: "Emagrecimento Sustentável",
    category: "Emagrecimento",
    duration: "3h 45min",
    progress: 45,
    thumbnail: "/thumbnails/emagrecimento.jpg",
    episodes: [
      { title: "Mitos e Verdades", duration: "18min" },
      { title: "Plano Alimentar", duration: "25min" },
      { title: "Exercícios Cardio", duration: "30min" }
    ]
  }
]
```

### 📊 **Dashboard com Gráficos Detalhados:**
```typescript
// Gráficos incluídos
- Gráfico de evolução do peso (LineChart)
- Gráfico de IMC (AreaChart)
- Gráfico de gordura corporal (BarChart)
- Gráfico de massa muscular (LineChart)
- Gráfico de água corporal (AreaChart)
- Gráfico de circunferência abdominal (BarChart)
- Gráfico de pizza (composição corporal)
- Dashboard moderno estilo Netflix
```

### 🎮 **Sistema de Missões Detalhado:**
```typescript
const dailyMissions = [
  {
    id: 1,
    title: "Hidratação Perfeita",
    description: "Beba 2L de água hoje",
    points: 50,
    category: "hidratacao",
    progress: 0,
    target: 2000,
    unit: "ml",
    icon: Droplets,
    color: "blue"
  },
  {
    id: 2,
    title: "Exercício Matinal",
    description: "Faça 30min de exercício",
    points: 75,
    category: "exercicio",
    progress: 0,
    target: 30,
    unit: "min",
    icon: Activity,
    color: "green"
  },
  {
    id: 3,
    title: "Meditação",
    description: "Medite por 10 minutos",
    points: 30,
    category: "mente",
    progress: 0,
    target: 10,
    unit: "min",
    icon: Brain,
    color: "purple"
  }
]
```

### ⚖️ **Sistema de Avaliações Detalhado:**
```typescript
const assessments = [
  {
    id: 1,
    title: "Avaliação Semanal",
    questions: [
      {
        type: "multiple_choice",
        question: "Como você se sentiu esta semana?",
        options: ["Excelente", "Bom", "Regular", "Ruim"]
      },
      {
        type: "slider",
        question: "Nível de estresse (1-10)",
        min: 1,
        max: 10
      },
      {
        type: "text",
        question: "Descreva seu maior desafio da semana"
      }
    ]
  }
]
```

### 🔗 **Integrações Detalhadas:**
```typescript
// Supabase Configuration
const supabaseConfig = {
  url: process.env.VITE_SUPABASE_URL,
  anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  tables: {
    profiles: 'profiles',
    pesagens: 'pesagens',
    dados_fisicos_usuario: 'dados_fisicos_usuario',
    dados_saude_usuario: 'dados_saude_usuario',
    missions: 'missions',
    assessments: 'assessments',
    courses: 'courses',
    sessions: 'sessions'
  }
}

// Google Fit Integration
const googleFitConfig = {
  clientId: process.env.VITE_GOOGLE_FIT_CLIENT_ID,
  scopes: ['https://www.googleapis.com/auth/fitness.activity.read'],
  apiKey: process.env.VITE_GOOGLE_FIT_API_KEY
}
```

## 🎨 **DESIGN SYSTEM DETALHADO:**

### 🎨 **Cores Institucionais:**
```css
:root {
  /* Cores institucionais */
  --instituto-orange: #F97316;
  --instituto-green: #10B981;
  --instituto-blue: #3B82F6;
  --instituto-purple: #8B5CF6;
  --instituto-pink: #EC4899;
  
  /* Cores Netflix */
  --netflix-black: #000000;
  --netflix-dark-gray: #141414;
  --netflix-medium-gray: #333333;
  --netflix-light-gray: #666666;
  --netflix-red: #E50914;
  --netflix-red-hover: #F40612;
  --netflix-white: #FFFFFF;
  --netflix-border: #333333;
  --netflix-success: #46D369;
  --netflix-warning: #E87C03;
  --netflix-error: #E50914;
  --netflix-info: #0071EB;
  
  /* Cores de saúde */
  --health-primary: #3B82F6;
  --health-secondary: #10B981;
  --health-warning: #F59E0B;
  --health-error: #EF4444;
  --health-success: #10B981;
  --health-heart: #EF4444;
  --health-steps: #3B82F6;
  --health-weight: #10B981;
  --health-calories: #F59E0B;
}
```

### 🎭 **Animações Detalhadas:**
```css
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeUp {
  0% { 
    opacity: 0;
    transform: translateY(30px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-fade-up { animation: fadeUp 0.6s ease-out; }
.animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
.animate-scale-in { animation: scaleIn 0.3s ease-out; }
```

## 📱 **FUNCIONALIDADES MOBILE DETALHADAS:**

### 📱 **Responsividade Completa:**
```typescript
// Breakpoints
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
}

// Mobile-first design
const mobileStyles = {
  menu: 'fixed bottom-0 left-0 right-0 bg-white border-t',
  cards: 'grid-cols-1 gap-4 p-4',
  charts: 'h-64 w-full',
  buttons: 'w-full h-12 text-lg'
}
```

### 📱 **PWA Features:**
```typescript
// Service Worker
const swConfig = {
  name: 'Health Platform',
  short_name: 'Health',
  description: 'Plataforma de saúde completa',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#F97316',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
  ]
}
```

## 🔐 **SEGURANÇA DETALHADA:**

### 🔐 **Autenticação Supabase:**
```typescript
const authConfig = {
  providers: ['google', 'email'],
  redirectTo: '/dashboard',
  session: {
    refreshTokenRotationEnabled: true,
    detectSessionInUrl: true
  },
  flowType: 'pkce'
}
```

### 🔐 **Row Level Security (RLS):**
```sql
-- Exemplo de políticas RLS
CREATE POLICY "Users can view own data" ON pesagens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON pesagens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON pesagens
  FOR UPDATE USING (auth.uid() = user_id);
```

### 🔐 **Validação de Dados:**
```typescript
const validationSchemas = {
  userProfile: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    age: z.number().min(13).max(120),
    height: z.number().min(100).max(250),
    weight: z.number().min(30).max(300)
  }),
  
  assessment: z.object({
    title: z.string().min(5).max(100),
    questions: z.array(z.object({
      type: z.enum(['multiple_choice', 'slider', 'text']),
      question: z.string().min(10),
      options: z.array(z.string()).optional()
    }))
  })
}
```

## 🚀 **DEPLOY DETALHADO:**

### 🚀 **Vercel (Recomendado):**
```bash
npm run build
vercel --prod
```

### 🚀 **Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### 🚀 **GitHub Pages:**
```bash
npm run build
# Configure GitHub Actions para deploy automático
```

## 📊 **ESTRUTURA DE DADOS DETALHADA:**

### 📊 **Tabelas Supabase:**
```sql
-- Tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pesagens
CREATE TABLE pesagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  peso DECIMAL(5,2),
  data_pesagem DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de dados físicos
CREATE TABLE dados_fisicos_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  altura DECIMAL(5,2),
  idade INTEGER,
  sexo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de missões
CREATE TABLE missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  points INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  target INTEGER,
  unit TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cursos
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration TEXT,
  thumbnail_url TEXT,
  episodes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 **RESULTADO FINAL:**

**Uma plataforma de saúde completa com:**
- ✅ Menu lateral responsivo com 19 itens
- ✅ Plataforma dos Sonhos estilo Netflix
- ✅ Dashboard com 7 tipos de gráficos
- ✅ Sistema de missões com gamificação
- ✅ Avaliações semanais interativas
- ✅ Integração Supabase + Google Fit
- ✅ Design mobile-first + PWA
- ✅ Segurança completa (RLS + validação)
- ✅ Animações fluidas com Framer Motion
- ✅ Sistema de cores institucional
- ✅ Deploy otimizado para produção

---

**🎉 Plataforma completa e profissional pronta para uso!** 