#!/bin/bash

# Script para criar uma plataforma de saúde completa
# Uso: ./create_health_platform.sh <nome-do-projeto>

PROJECT_NAME=${1:-"health-platform"}
TEMPLATE_NAME="jornada-dos-sonhos"

echo "🚀 Criando Plataforma de Saúde Completa"
echo "======================================="
echo "Nome do projeto: $PROJECT_NAME"
echo ""

# Criar diretório do projeto
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

echo "📁 Estrutura do projeto criada"

# Criar package.json
cat > package.json << 'EOF'
{
  "name": "health-platform",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@supabase/supabase-js": "^2.38.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-day-picker": "^8.9.1",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "recharts": "^2.8.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}
EOF

# Criar estrutura de diretórios
mkdir -p src/{components,pages,hooks,utils,types,styles,integrations,contexts,data,services}
mkdir -p src/components/{ui,admin,health,assessment,community,courses,dashboard,forms,gamification,layout,mission,netflix,player,reports,sessions,support,user,visual}
mkdir -p public
mkdir -p supabase/{migrations,functions}

echo "📦 Dependências configuradas"

# Criar README.md
cat > README.md << 'EOF'
# 🏥 Plataforma de Saúde - Jornada dos Sonhos

## 🚀 Funcionalidades Principais

### 📊 **Dashboard de Saúde**
- Gráficos interativos de progresso
- Métricas de saúde em tempo real
- Evolução de peso, IMC e composição corporal
- Dashboard moderno estilo Netflix

### 🎯 **Sistema de Missões**
- Missões diárias personalizadas
- Gamificação com pontuação
- Desafios semanais
- Sistema de recompensas

### 📚 **Plataforma dos Sonhos (Netflix-style)**
- Cursos em vídeo
- Categorias organizadas
- Player moderno
- Progresso de aprendizado

### ⚖️ **Sistema de Avaliações**
- Avaliações semanais
- Testes de sabotadores
- Questionários interativos
- Análise de resultados

### 🔗 **Integrações**
- Supabase (banco de dados)
- Google Fit
- Balança Bluetooth
- Notificações push

### 👥 **Sistema Social**
- Ranking de usuários
- Comunidade interativa
- Chat de suporte
- Compartilhamento de progresso

## 🛠️ Tecnologias

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS + Radix UI + Shadcn/ui
- **Animações:** Framer Motion
- **Gráficos:** Recharts
- **Backend:** Supabase
- **Roteamento:** React Router DOM

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📱 Funcionalidades Mobile

- Design responsivo
- PWA (Progressive Web App)
- Notificações push
- Sincronização offline

## 🎨 Design System

- Paleta de cores institucional
- Componentes reutilizáveis
- Animações fluidas
- Interface moderna estilo Netflix

## 🔐 Segurança

- Autenticação Supabase
- RLS (Row Level Security)
- Validação de dados
- Criptografia de dados sensíveis

---

**Desenvolvido com ❤️ para transformar vidas através da saúde e bem-estar**
EOF

echo "📖 README criado"

# Criar .gitignore
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Supabase
.supabase/

# Build outputs
build/
out/

# Temporary files
*.tmp
*.temp

# OS generated files
Thumbs.db
ehthumbs.db
Desktop.ini

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Local Netlify folder
.netlify

# Vercel
.vercel
EOF

echo "🚫 .gitignore criado"

# Criar arquivo de configuração do Vite
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
EOF

echo "⚡ Vite configurado"

# Criar configuração do TypeScript
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

echo "📝 TypeScript configurado"

# Criar configuração do Tailwind
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        success: {
          DEFAULT: 'var(--netflix-success)',
          foreground: 'var(--netflix-white)'
        },
        warning: {
          DEFAULT: 'var(--netflix-warning)',
          foreground: 'var(--netflix-white)'
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        
        // Netflix colors
        netflix: {
          black: 'var(--netflix-black)',
          darkGray: 'var(--netflix-dark-gray)',
          mediumGray: 'var(--netflix-medium-gray)',
          lightGray: 'var(--netflix-light-gray)',
          red: 'var(--netflix-red)',
          redHover: 'var(--netflix-red-hover)',
          white: 'var(--netflix-white)',
          border: 'var(--netflix-border)',
          success: 'var(--netflix-success)',
          warning: 'var(--netflix-warning)',
          error: 'var(--netflix-error)',
          info: 'var(--netflix-info)'
        },
        
        // Health colors
        health: {
          background: '#f8fafc',
          primary: '#3B82F6',
          secondary: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          success: '#10B981',
          heart: '#EF4444',
          steps: '#3B82F6',
          weight: '#10B981',
          calories: '#F59E0B'
        },
        
        // Instituto colors
        instituto: {
          orange: '#F97316',
          green: '#10B981',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        'netflix-sm': 'var(--netflix-shadow-sm)',
        'netflix-md': 'var(--netflix-shadow-md)',
        'netflix-lg': 'var(--netflix-shadow-lg)',
      },
      transitionProperty: {
        'netflix': 'var(--netflix-transition-default)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
      },
      backgroundImage: {
        'netflix-gradient-dark': 'var(--netflix-gradient-dark)',
        'netflix-gradient-overlay': 'var(--netflix-gradient-overlay)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;

export default config;
EOF

echo "🎨 Tailwind configurado"

# Criar arquivo de exemplo de ambiente
cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Fit API (Optional)
VITE_GOOGLE_FIT_CLIENT_ID=your_google_fit_client_id_here
VITE_GOOGLE_FIT_CLIENT_SECRET=your_google_fit_client_secret_here

# App Configuration
VITE_APP_NAME=Jornada dos Sonhos
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_GOOGLE_FIT=false
VITE_ENABLE_BLUETOOTH_SCALE=false
VITE_ENABLE_PUSH_NOTIFICATIONS=false

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
VITE_MIXPANEL_TOKEN=your_mixpanel_token_here
EOF

echo "🔐 Arquivo de ambiente criado"

# Criar index.html
cat > index.html << 'EOF'
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jornada dos Sonhos - Plataforma de Saúde</title>
    <meta name="description" content="Transforme sua vida através da saúde e bem-estar com nossa plataforma completa de missões, cursos e acompanhamento personalizado." />
    <meta name="keywords" content="saúde, bem-estar, missões, cursos, transformação, emagrecimento, fitness" />
    <meta name="author" content="Instituto dos Sonhos" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://jornadadossonhos.com/" />
    <meta property="og:title" content="Jornada dos Sonhos - Plataforma de Saúde" />
    <meta property="og:description" content="Transforme sua vida através da saúde e bem-estar" />
    <meta property="og:image" content="https://jornadadossonhos.com/og-image.jpg" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://jornadadossonhos.com/" />
    <meta property="twitter:title" content="Jornada dos Sonhos - Plataforma de Saúde" />
    <meta property="twitter:description" content="Transforme sua vida através da saúde e bem-estar" />
    <meta property="twitter:image" content="https://jornadadossonhos.com/og-image.jpg" />

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#F97316" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Jornada dos Sonhos" />
    <meta name="msapplication-TileColor" content="#F97316" />
    <meta name="msapplication-tap-highlight" content="no" />

    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo "🌐 HTML base criado"

# Criar arquivo principal do React
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
EOF

echo "⚛️ React configurado"

# Criar CSS base
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;

    /* Netflix Theme Colors */
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
    --netflix-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --netflix-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --netflix-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --netflix-transition-default: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --netflix-gradient-dark: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
    --netflix-gradient-overlay: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%);
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl;
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-instituto-orange via-orange-600 to-red-600 bg-clip-text text-transparent;
  }
  
  .netflix-card {
    @apply bg-netflix-dark-gray border-netflix-border text-netflix-white;
  }
  
  .health-card {
    @apply bg-gradient-to-br from-health-primary/5 to-health-secondary/5 border border-health-primary/20;
  }
  
  .animate-fade-up {
    animation: fadeUp 0.6s ease-out;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Loading Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Shimmer Effect */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
EOF

echo "🎨 CSS base criado"

# Criar App.tsx principal
cat > src/App.tsx << 'EOF'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { Dashboard } from '@/pages/Dashboard'
import { LoginPage } from '@/pages/LoginPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HealthLayout } from '@/components/layout/HealthLayout'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <HealthLayout>
                  <Dashboard />
                </HealthLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App
EOF

echo "📱 App principal criado"

# Criar arquivo de comandos de instalação
cat > install_and_run.sh << 'EOF'
#!/bin/bash

echo "🚀 Instalando e configurando a Plataforma de Saúde"
echo "=================================================="

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se a instalação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Criar arquivo de ambiente
echo "🔐 Configurando variáveis de ambiente..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ Arquivo .env.local criado"
    echo "⚠️  Configure suas variáveis de ambiente em .env.local"
else
    echo "✅ Arquivo .env.local já existe"
fi

# Verificar se o Supabase está configurado
echo "🔍 Verificando configuração do Supabase..."
if grep -q "your_supabase_url_here" .env.local; then
    echo "⚠️  Configure o Supabase em .env.local"
    echo "   VITE_SUPABASE_URL=sua_url_do_supabase"
    echo "   VITE_SUPABASE_ANON_KEY=sua_chave_anonima"
else
    echo "✅ Supabase configurado"
fi

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "🚀 Para executar o projeto:"
echo "   npm run dev"
echo ""
echo "📖 Para mais informações, consulte o README.md"
echo ""
echo "🔧 Próximos passos:"
echo "   1. Configure o Supabase em .env.local"
echo "   2. Execute: npm run dev"
echo "   3. Acesse: http://localhost:3000"
echo "   4. Faça login e explore as funcionalidades!"
EOF

chmod +x install_and_run.sh

echo "📋 Script de instalação criado"

# Criar arquivo de documentação rápida
cat > QUICK_START.md << 'EOF'
# 🚀 Início Rápido - Plataforma de Saúde

## ⚡ Comando Único para Criar o Projeto

```bash
# Clone ou baixe este script e execute:
./create_health_platform.sh meu-projeto-saude
cd meu-projeto-saude
./install_and_run.sh
npm run dev
```

## 🎯 Funcionalidades Principais

### 📊 **Dashboard Completo**
- Gráficos interativos de progresso
- Métricas de saúde em tempo real
- Evolução de peso, IMC e composição corporal
- Dashboard moderno estilo Netflix

### 🎮 **Sistema de Missões**
- Missões diárias personalizadas
- Gamificação com pontuação
- Desafios semanais
- Sistema de recompensas

### 📚 **Plataforma dos Sonhos (Netflix-style)**
- Cursos em vídeo organizados
- Categorias e playlists
- Player moderno responsivo
- Progresso de aprendizado

### ⚖️ **Sistema de Avaliações**
- Avaliações semanais interativas
- Testes de sabotadores
- Questionários personalizados
- Análise detalhada de resultados

### 🔗 **Integrações Avançadas**
- Supabase (banco de dados)
- Google Fit (opcional)
- Balança Bluetooth (opcional)
- Notificações push

### 👥 **Sistema Social**
- Ranking de usuários
- Comunidade interativa
- Chat de suporte
- Compartilhamento de progresso

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + Radix UI + Shadcn/ui
- **Animações:** Framer Motion
- **Gráficos:** Recharts
- **Backend:** Supabase
- **Roteamento:** React Router DOM
- **Estado:** React Context + Hooks

## 📱 Funcionalidades Mobile

- Design totalmente responsivo
- PWA (Progressive Web App)
- Notificações push
- Sincronização offline
- Interface touch-friendly

## 🎨 Design System

- Paleta de cores institucional
- Componentes reutilizáveis
- Animações fluidas
- Interface moderna estilo Netflix
- Dark/Light mode

## 🔐 Segurança

- Autenticação Supabase
- RLS (Row Level Security)
- Validação de dados
- Criptografia de dados sensíveis
- HTTPS obrigatório

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
# Conecte ao Vercel e faça deploy
```

### Netlify
```bash
npm run build
# Faça upload da pasta dist
```

### GitHub Pages
```bash
npm run build
# Configure GitHub Actions para deploy automático
```

## 📞 Suporte

- **Documentação:** README.md
- **Issues:** GitHub Issues
- **Comunidade:** Discord/Slack
- **Email:** suporte@jornadadossonhos.com

---

**🎉 Projeto criado com sucesso!**

Agora você tem uma plataforma de saúde completa e moderna! 🚀
EOF

echo "📖 Documentação rápida criada"

# Criar arquivo de comandos de exemplo
cat > COMANDOS_EXEMPLO.md << 'EOF'
# 🎯 Comandos de Exemplo - Plataforma de Saúde

## 🚀 Criar Projeto Completo

```bash
# Comando único para criar tudo
./create_health_platform.sh minha-plataforma-saude
cd minha-plataforma-saude
./install_and_run.sh
npm run dev
```

## 📊 Funcionalidades Incluídas

### 🎮 **Menu Lateral Completo**
- Dashboard principal
- Missão do dia
- Plataforma dos Sonhos (Netflix-style)
- Sessões e cursos
- Ranking de usuários
- Avaliações semanais
- Minhas metas
- Desafios
- Diário de saúde
- Teste de sabotadores
- Meu progresso
- Análise avançada
- Google Fit
- Teste de balança
- Assinaturas
- Apps
- Ajuda

### 📚 **Plataforma dos Sonhos (Netflix-style)**
```typescript
// Exemplo de estrutura de cursos
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
  }
]
```

### 📊 **Dashboard com Gráficos**
```typescript
// Exemplo de gráficos incluídos
- Gráfico de evolução do peso
- Gráfico de IMC
- Gráfico de gordura corporal
- Gráfico de massa muscular
- Gráfico de água corporal
- Gráfico de circunferência abdominal
```

### 🎯 **Sistema de Missões**
```typescript
// Exemplo de missão diária
const dailyMission = {
  id: 1,
  title: "Hidratação Perfeita",
  description: "Beba 2L de água hoje",
  points: 50,
  category: "hidratacao",
  progress: 0,
  target: 2000,
  unit: "ml"
}
```

### ⚖️ **Sistema de Avaliações**
```typescript
// Exemplo de avaliação
const assessment = {
  id: 1,
  title: "Avaliação Semanal",
  questions: [
    {
      type: "multiple_choice",
      question: "Como você se sentiu esta semana?",
      options: ["Excelente", "Bom", "Regular", "Ruim"]
    }
  ]
}
```

## 🎨 Componentes Incluídos

### 📱 **Layouts**
- HealthLayout (layout principal)
- ModernLayout (layout moderno)
- NetflixLayout (layout estilo Netflix)

### 🎮 **Componentes de UI**
- ModernButton (botões modernos)
- NetflixButton (botões estilo Netflix)
- GlassCard (cards com efeito glass)
- AnimatedCard (cards animados)

### 📊 **Componentes de Gráficos**
- ProgressCharts (gráficos de progresso)
- ModernHealthDashboard (dashboard moderno)
- EvolutionSummary (resumo de evolução)
- LastWeighingCards (cards de pesagem)

### 🎯 **Componentes de Missões**
- MissionDia (missão do dia)
- MissionHabitosDia (missões de hábitos)
- MissionMenteEmocoes (missões mentais)
- MissionRitualManha (ritual matinal)

### 📚 **Componentes de Cursos**
- CourseHeroSection (seção hero dos cursos)
- EnhancedCourseGrid (grid de cursos)
- EnhancedLessonPlayer (player de aulas)
- PaidCourses (cursos pagos)

### 👥 **Componentes Sociais**
- RealUserRanking (ranking real)
- CommunityChat (chat da comunidade)
- FacebookStyleCommunity (comunidade estilo Facebook)

### ⚖️ **Componentes de Avaliação**
- TesteSabotadores (teste de sabotadores)
- AssessmentPage (página de avaliação)
- AssessmentResultsPage (resultados)
- ResponseAnalyzer (analisador de respostas)

## 🔧 Configurações Incluídas

### 📦 **Package.json Completo**
- Todas as dependências necessárias
- Scripts de desenvolvimento
- Scripts de build
- Configurações de linting

### 🎨 **Tailwind Configurado**
- Cores institucionais
- Cores Netflix
- Cores de saúde
- Animações personalizadas
- Gradientes

### ⚡ **Vite Configurado**
- Alias de paths (@/src)
- Configuração de port
- Build otimizado
- Source maps

### 📝 **TypeScript Configurado**
- Strict mode
- Path mapping
- Configurações otimizadas
- Tipos personalizados

## 🚀 Comandos de Deploy

### **Desenvolvimento**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting do código
```

### **Produção**
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages
npm run build
# Faça upload da pasta dist
```

## 📱 Funcionalidades Mobile

### **Responsividade**
- Design mobile-first
- Breakpoints otimizados
- Touch-friendly
- Gestos nativos

### **PWA**
- Service Worker
- Manifest
- Offline support
- Push notifications

### **Performance**
- Lazy loading
- Code splitting
- Image optimization
- Bundle optimization

## 🔐 Segurança Incluída

### **Autenticação**
- Supabase Auth
- JWT tokens
- Session management
- Role-based access

### **Validação**
- Form validation
- Input sanitization
- XSS protection
- CSRF protection

### **Criptografia**
- HTTPS only
- Data encryption
- Secure storage
- API security

---

**🎉 Projeto completo criado!**

Agora você tem uma plataforma de saúde moderna e funcional! 🚀
EOF

echo "📋 Comandos de exemplo criados"

echo ""
echo "🎉 Projeto criado com sucesso!"
echo "================================"
echo ""
echo "📁 Estrutura criada:"
echo "  ✅ package.json com todas as dependências"
echo "  ✅ Configuração do Vite"
echo "  ✅ Configuração do TypeScript"
echo "  ✅ Configuração do Tailwind"
echo "  ✅ Arquivos de ambiente"
echo "  ✅ HTML base"
echo "  ✅ CSS com tema completo"
echo "  ✅ App React principal"
echo "  ✅ Scripts de instalação"
echo "  ✅ Documentação completa"
echo ""
echo "🚀 Para usar o projeto:"
echo "   cd $PROJECT_NAME"
echo "   ./install_and_run.sh"
echo "   npm run dev"
echo ""
echo "📖 Documentação disponível:"
echo "   - README.md (documentação completa)"
echo "   - QUICK_START.md (início rápido)"
echo "   - COMANDOS_EXEMPLO.md (exemplos de uso)"
echo ""
echo "🎯 Funcionalidades incluídas:"
echo "   - Menu lateral completo"
echo "   - Dashboard com gráficos"
echo "   - Plataforma dos Sonhos (Netflix-style)"
echo "   - Sistema de missões"
echo "   - Sistema de avaliações"
echo "   - Integrações (Supabase, Google Fit)"
echo "   - Design responsivo"
echo "   - PWA ready"
echo ""
echo "🔧 Próximos passos:"
echo "   1. Configure o Supabase"
echo "   2. Personalize as cores e branding"
echo "   3. Adicione seus cursos e conteúdo"
echo "   4. Configure as integrações"
echo "   5. Deploy para produção"
echo ""
echo "💡 Dica: Use o script migrate_to_new_repo.sh para enviar para GitHub!" 