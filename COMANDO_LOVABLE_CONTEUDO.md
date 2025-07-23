# 🚀 COMANDO FOCO NO CONTEÚDO - Lovable

## ⚡ **COMANDO BÁSICO:**
```bash
npx create-react-app health-platform --template typescript
cd health-platform
npm install @supabase/supabase-js react-router-dom recharts tailwindcss framer-motion lucide-react date-fns
```

## 🎯 **CONTEÚDO DOS BOTÕES DO MENU:**

### 📱 **1. DASHBOARD**
```typescript
// Conteúdo: Visão geral da saúde
- Gráfico de evolução do peso (últimos 30 dias)
- IMC atual e meta
- Gordura corporal (%)
- Massa muscular (kg)
- Água corporal (%)
- Circunferência abdominal (cm)
- Resumo da semana
- Próximas metas
```

### 🎯 **2. MISSÃO DO DIA**
```typescript
// Conteúdo: Missões diárias personalizadas
const dailyMissions = [
  {
    title: "Hidratação Perfeita",
    description: "Beba 2L de água hoje",
    progress: 0,
    target: 2000,
    unit: "ml",
    points: 50
  },
  {
    title: "Exercício Matinal",
    description: "Faça 30min de exercício",
    progress: 0,
    target: 30,
    unit: "min",
    points: 75
  },
  {
    title: "Meditação",
    description: "Medite por 10 minutos",
    progress: 0,
    target: 10,
    unit: "min",
    points: 30
  }
]
```

### 📚 **3. PLATAFORMA DOS SONHOS (Netflix-style)**
```typescript
// Conteúdo: Cursos organizados por categorias
const courses = [
  {
    title: "Fundamentos da Saúde",
    category: "Saúde Básica",
    duration: "2h 30min",
    progress: 75,
    episodes: [
      { title: "Introdução", duration: "15min" },
      { title: "Nutrição Básica", duration: "20min" },
      { title: "Exercícios", duration: "25min" }
    ]
  },
  {
    title: "Emagrecimento Sustentável",
    category: "Emagrecimento",
    duration: "3h 45min",
    progress: 45,
    episodes: [
      { title: "Mitos e Verdades", duration: "18min" },
      { title: "Plano Alimentar", duration: "25min" },
      { title: "Exercícios Cardio", duration: "30min" }
    ]
  },
  {
    title: "Mindfulness e Bem-estar",
    category: "Mente",
    duration: "1h 20min",
    progress: 90,
    episodes: [
      { title: "Técnicas de Respiração", duration: "15min" },
      { title: "Meditação Guiada", duration: "20min" },
      { title: "Gestão do Estresse", duration: "25min" }
    ]
  }
]
```

### 📋 **4. SESSÕES**
```typescript
// Conteúdo: Sessões de acompanhamento
const sessions = [
  {
    title: "Sessão Semanal",
    date: "2024-01-15",
    duration: "45min",
    topics: [
      "Revisão do progresso",
      "Ajustes no plano",
      "Novos objetivos"
    ],
    completed: true
  },
  {
    title: "Sessão Mensal",
    date: "2024-01-30",
    duration: "60min",
    topics: [
      "Avaliação completa",
      "Novas estratégias",
      "Planejamento futuro"
    ],
    completed: false
  }
]
```

### 🏆 **5. RANKING**
```typescript
// Conteúdo: Ranking de usuários
const ranking = [
  {
    position: 1,
    name: "Maria Silva",
    points: 1250,
    achievements: ["7 dias seguidos", "Meta atingida"],
    avatar: "/avatars/maria.jpg"
  },
  {
    position: 2,
    name: "João Santos",
    points: 1100,
    achievements: ["5 dias seguidos"],
    avatar: "/avatars/joao.jpg"
  },
  {
    position: 3,
    name: "Ana Costa",
    points: 950,
    achievements: ["3 dias seguidos"],
    avatar: "/avatars/ana.jpg"
  }
]
```

### 📊 **6. AVALIAÇÕES**
```typescript
// Conteúdo: Avaliações semanais
const assessments = [
  {
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

### 📈 **7. MEU PROGRESSO**
```typescript
// Conteúdo: Gráficos detalhados
const progressCharts = [
  {
    type: "weight",
    title: "Evolução do Peso",
    data: [
      { date: "2024-01-01", value: 75.5 },
      { date: "2024-01-08", value: 74.8 },
      { date: "2024-01-15", value: 74.2 }
    ]
  },
  {
    type: "body_composition",
    title: "Composição Corporal",
    data: [
      { fat: 25, muscle: 45, water: 60, bone: 10 }
    ]
  },
  {
    type: "measurements",
    title: "Medidas Corporais",
    data: [
      { waist: 85, chest: 95, arms: 30, legs: 55 }
    ]
  }
]
```

### 🧠 **8. TESTE DE SABOTADORES**
```typescript
// Conteúdo: Teste de sabotadores do emagrecimento
const sabotadoresTest = {
  title: "Teste de Sabotadores",
  description: "Identifique os fatores que podem estar sabotando seu emagrecimento",
  questions: [
    {
      question: "Você come quando está estressado?",
      options: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"]
    },
    {
      question: "Você pula refeições?",
      options: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"]
    },
    {
      question: "Você come rápido?",
      options: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"]
    },
    {
      question: "Você come por tédio?",
      options: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"]
    },
    {
      question: "Você come à noite?",
      options: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"]
    }
  ],
  results: {
    low: "Você tem bons hábitos alimentares!",
    medium: "Alguns ajustes podem melhorar seus resultados",
    high: "Identificamos alguns sabotadores. Vamos trabalhar nisso!"
  }
}
```

### 📝 **9. DIÁRIO DE SAÚDE**
```typescript
// Conteúdo: Registro diário
const healthDiary = {
  today: {
    date: "2024-01-15",
    weight: 74.2,
    water: 2000,
    exercise: 30,
    sleep: 8,
    mood: "Bom",
    notes: "Dia produtivo, me senti bem"
  },
  history: [
    {
      date: "2024-01-14",
      weight: 74.5,
      water: 1800,
      exercise: 45,
      sleep: 7,
      mood: "Regular",
      notes: "Dia estressante no trabalho"
    }
  ]
}
```

### 🎯 **10. MINHAS METAS**
```typescript
// Conteúdo: Metas personalizadas
const goals = [
  {
    title: "Peso Ideal",
    current: 74.2,
    target: 68.0,
    unit: "kg",
    deadline: "2024-06-01",
    progress: 65
  },
  {
    title: "Gordura Corporal",
    current: 25,
    target: 18,
    unit: "%",
    deadline: "2024-06-01",
    progress: 40
  },
  {
    title: "Circunferência Abdominal",
    current: 85,
    target: 75,
    unit: "cm",
    deadline: "2024-06-01",
    progress: 50
  }
]
```

### 🏅 **11. DESAFIOS**
```typescript
// Conteúdo: Desafios semanais
const challenges = [
  {
    title: "Desafio da Hidratação",
    description: "Beba 2L de água por 7 dias seguidos",
    duration: "7 dias",
    reward: "50 pontos",
    participants: 45,
    completed: false
  },
  {
    title: "Desafio do Exercício",
    description: "Faça 30min de exercício por 5 dias",
    duration: "5 dias",
    reward: "75 pontos",
    participants: 32,
    completed: true
  },
  {
    title: "Desafio da Meditação",
    description: "Medite 10min por 7 dias",
    duration: "7 dias",
    reward: "30 pontos",
    participants: 28,
    completed: false
  }
]
```

### 📊 **12. ANÁLISE AVANÇADA**
```typescript
// Conteúdo: Análises detalhadas
const advancedAnalytics = {
  trends: [
    {
      metric: "Peso",
      trend: "down",
      change: "-2.3kg",
      period: "30 dias"
    },
    {
      metric: "Gordura Corporal",
      trend: "down",
      change: "-3.2%",
      period: "30 dias"
    },
    {
      metric: "Massa Muscular",
      trend: "up",
      change: "+1.8kg",
      period: "30 dias"
    }
  ],
  insights: [
    "Seu peso está diminuindo de forma saudável",
    "A massa muscular está aumentando",
    "Continue com os exercícios de força"
  ],
  recommendations: [
    "Aumente a ingestão de proteínas",
    "Mantenha o treino de força",
    "Continue com a hidratação"
  ]
}
```

### 🔗 **13. GOOGLE FIT**
```typescript
// Conteúdo: Integração com Google Fit
const googleFitData = {
  connected: true,
  lastSync: "2024-01-15 10:30",
  today: {
    steps: 8500,
    calories: 450,
    distance: 6.2,
    activeMinutes: 45
  },
  weekly: {
    averageSteps: 8200,
    averageCalories: 420,
    totalDistance: 43.4,
    totalActiveMinutes: 315
  },
  goals: {
    dailySteps: 10000,
    dailyCalories: 500,
    weeklyActiveMinutes: 150
  }
}
```

### ⚖️ **14. TESTE XIAOMI MI BODY SCALE 2**
```typescript
// Conteúdo: Teste da balança
const scaleTest = {
  connected: false,
  lastReading: null,
  instructions: [
    "Certifique-se de que a balança está ligada",
    "Posicione-se descalço na balança",
    "Aguarde a leitura completa",
    "Os dados serão sincronizados automaticamente"
  ],
  troubleshooting: [
    "Verifique se as pilhas estão boas",
    "Certifique-se de que o Bluetooth está ativo",
    "Tente reiniciar a balança"
  ]
}
```

### 💳 **15. ASSINATURAS**
```typescript
// Conteúdo: Planos de assinatura
const subscriptions = [
  {
    name: "Plano Básico",
    price: "R$ 29,90/mês",
    features: [
      "Acesso aos cursos básicos",
      "Dashboard de progresso",
      "Suporte por email"
    ],
    current: false
  },
  {
    name: "Plano Premium",
    price: "R$ 49,90/mês",
    features: [
      "Todos os cursos",
      "Acompanhamento personalizado",
      "Suporte prioritário",
      "Avaliações semanais"
    ],
    current: true
  },
  {
    name: "Plano VIP",
    price: "R$ 99,90/mês",
    features: [
      "Tudo do Premium",
      "Consultoria individual",
      "Plano alimentar personalizado",
      "Treinos exclusivos"
    ],
    current: false
  }
]
```

### 📱 **16. APPS**
```typescript
// Conteúdo: Apps integrados
const integratedApps = [
  {
    name: "Google Fit",
    connected: true,
    lastSync: "2024-01-15 10:30",
    icon: "google-fit.png"
  },
  {
    name: "MyFitnessPal",
    connected: false,
    lastSync: null,
    icon: "myfitnesspal.png"
  },
  {
    name: "Strava",
    connected: true,
    lastSync: "2024-01-15 09:15",
    icon: "strava.png"
  },
  {
    name: "Apple Health",
    connected: false,
    lastSync: null,
    icon: "apple-health.png"
  }
]
```

### ❓ **17. AJUDA**
```typescript
// Conteúdo: Sistema de ajuda
const helpContent = {
  faq: [
    {
      question: "Como funciona o sistema de missões?",
      answer: "As missões são desafios diários personalizados que te ajudam a manter o foco nos seus objetivos de saúde."
    },
    {
      question: "Como sincronizar com Google Fit?",
      answer: "Vá em Configurações > Integrações > Google Fit e siga as instruções para conectar sua conta."
    },
    {
      question: "Como interpretar os gráficos?",
      answer: "Os gráficos mostram sua evolução ao longo do tempo. Linhas ascendentes indicam progresso positivo."
    }
  ],
  contact: {
    email: "suporte@jornadadossonhos.com",
    whatsapp: "+55 11 99999-9999",
    chat: "Disponível 24/7"
  },
  tutorials: [
    "Como usar o dashboard",
    "Como interpretar os gráficos",
    "Como definir metas",
    "Como usar a balança"
  ]
}
```

## 🎯 **RESULTADO:**
**Uma plataforma completa com conteúdo real em cada botão do menu, focada nas funcionalidades e não apenas na aparência!**

---

**💡 Foco no conteúdo: Cada botão tem funcionalidades específicas e dados reais para o usuário!** 