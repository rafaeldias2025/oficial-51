# 🎯 Modelo de Crítica de Sabotadores - Ferramentas

## 🎨 **DESENHO DO MODELO - COMO FUNCIONA**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SISTEMA DE SABOTADORES                                  │
│                                                                                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   COLETA        │    │  PROCESSAMENTO  │    │    RESULTADO    │              │
│  │   DE DADOS      │    │   INTELIGENTE   │    │  PERSONALIZADO  │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘              │
│           │                       │                       │                      │
│           ▼                       ▼                       ▼                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                        115 PERGUNTAS                                      │  │
│  │                                                                           │  │
│  │  📝 Sistema de Respostas:                                                │  │
│  │  • 5 opções (1-5)                                                       │  │
│  │  • "Concordo Fortemente" até "Discordo Fortemente"                      │  │
│  │  • Salvamento individual no Supabase                                     │  │
│  │  • Sistema de lixeira de segurança                                      │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    ALGORITMO DE CÁLCULO                                   │  │
│  │                                                                           │  │
│  │  🧮 FÓRMULA:                                                             │  │
│  │  Score = (Soma das respostas / Número de perguntas) × 20                 │  │
│  │                                                                           │  │
│  │  🔄 PROCESSO:                                                            │  │
│  │  1. Coleta respostas (1-5) para cada pergunta                           │  │
│  │  2. Agrupa por sabotador (5 perguntas por sabotador)                    │  │
│  │  3. Calcula média das respostas                                         │  │
│  │  4. Multiplica por 20 para escala 0-100                                 │  │
│  │  5. Arredonda para número inteiro                                       │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    24 SABOTADORES                                         │  │
│  │                                                                           │  │
│  │  📦 COMPORTAMENTAIS:                                                     │  │
│  │  • Sabotador das Roupas (0-4)                                           │  │
│  │  • Sabotador do Dinheiro (5-9)                                          │  │
│  │  • Válvula de Escape (25-29)                                            │  │
│  │  • Prazer da Comida (45-49)                                             │  │
│  │                                                                           │  │
│  │  🧠 PSICOLÓGICOS:                                                        │  │
│  │  • Crítico Interno (105-109)                                            │  │
│  │  • Boazinha Demais (110-114)                                            │  │
│  │  • Falta de Crenças (30-34)                                             │  │
│  │  • Apego à Autoimagem (60-64)                                           │  │
│  │                                                                           │  │
│  │  👥 RELACIONAIS:                                                         │  │
│  │  • Problemas com Cônjuge (65-69)                                        │  │
│  │  • Proteção dos Filhos (75-79)                                          │  │
│  │  • Fuga Afetiva (80-84)                                                 │  │
│  │  • Comida como Afeto (90-94)                                            │  │
│  │                                                                           │  │
│  │  🏃 FÍSICOS:                                                             │  │
│  │  • Atividade Física (35-39)                                             │  │
│  │  • Crença Contrária (40-44)                                             │  │
│  │  • Tamanho como Fortaleza (55-59)                                       │  │
│  │                                                                           │  │
│  │  🕰️ TEMPORAIS:                                                           │  │
│  │  • Estranheza da Mudança (10-14)                                        │  │
│  │  • Magreza da Infância (15-19)                                          │  │
│  │  • Perdas no Presente (95-99)                                           │  │
│  │  • Perdas na Infância (100-104)                                         │  │
│  │                                                                           │  │
│  │  💰 SOCIOECONÔMICOS:                                                     │  │
│  │  • Obesidade como Riqueza (50-54)                                       │  │
│  │  • Biotipo e Identidade (85-89)                                         │  │
│  │  • Fuga da Beleza (70-74)                                               │  │
│  │  • Rivalidade (20-24)                                                   │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    TOP 5 SABOTADORES                                      │  │
│  │                                                                           │  │
│  │  🎯 ORDENAÇÃO POR SCORE:                                                 │  │
│  │  • Maior score = Principal sabotador                                    │  │
│  │  • Identificação dos bloqueios principais                               │  │
│  │  • Personalização das recomendações                                     │  │
│  │                                                                           │  │
│  │  📋 DICAS PERSONALIZADAS:                                               │  │
│  │  • Resumo do comportamento                                              │  │
│  │  • Estratégias de superação                                            │  │
│  │  • Ações práticas específicas                                           │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 **SISTEMA DE EDIÇÃO DE PERGUNTAS**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        EDITOR DE PERGUNTAS                                      │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  📝 FORMULÁRIO DE EDIÇÃO:                                                 │  │
│  │                                                                           │  │
│  │  🔤 TEXTO DA PERGUNTA:                                                   │  │
│  │  "Eu sempre escolho roupas que mais disfarçam meu excesso de peso."      │  │
│  │                                                                           │  │
│  │  🎯 TIPO DE PERGUNTA:                                                    │  │
│  │  ☑️ Múltipla Escolha (1-5)                                              │  │
│  │  ☐ Texto Livre                                                           │  │
│  │  ☐ Verdadeiro/Falso                                                     │  │
│  │  ☐ Escala (1-10)                                                        │  │
│  │                                                                           │  │
│  │  📊 OPÇÕES DE RESPOSTA:                                                  │  │
│  │  [1] Discordo Fortemente                                                 │  │
│  │  [2] Discordo                                                            │  │
│  │  [3] Às Vezes                                                            │  │
│  │  [4] Concordo                                                            │  │
│  │  [5] Concordo Fortemente                                                 │  │
│  │                                                                           │  │
│  │  💬 FEEDBACK:                                                            │  │
│  │  ☑️ Mostrar feedback após resposta                                       │  │
│  │  ☐ Sem feedback                                                          │  │
│  │                                                                           │  │
│  │  📝 MENSAGEM DE FEEDBACK:                                                │  │
│  │  "Esta pergunta avalia como você lida com sua autoimagem..."             │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    TIPOS DE PERGUNTA DISPONÍVEIS                          │  │
│  │                                                                           │  │
│  │  🎯 MÚLTIPLA ESCOLHA (1-5):                                             │  │
│  │  • Padrão do sistema                                                     │  │
│  │  • 5 opções de resposta                                                  │  │
│  │  • Cálculo de score direto                                               │  │
│  │                                                                           │  │
│  │  📝 TEXTO LIVRE:                                                         │  │
│  │  • Resposta aberta                                                       │  │
│  │  • Análise qualitativa                                                   │  │
│  │  • Não afeta score numérico                                              │  │
│  │                                                                           │  │
│  │  ✅ VERDADEIRO/FALSO:                                                    │  │
│  │  • Resposta binária                                                      │  │
│  │  • Sim/Não                                                               │  │
│  │  • Score 0 ou 100                                                        │  │
│  │                                                                           │  │
│  │  📊 ESCALA (1-10):                                                       │  │
│  │  • Escala mais ampla                                                     │  │
│  │  • Maior precisão                                                        │  │
│  │  • Score 0-100                                                           │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    SISTEMA DE FEEDBACK                                    │  │
│  │                                                                           │  │
│  │  💬 FEEDBACK IMEDIATO:                                                   │  │
│  │  • Explicação da pergunta                                                │  │
│  │  • Contexto do sabotador                                                 │  │
│  │  • Dica de reflexão                                                      │  │
│  │                                                                           │  │
│  │  📊 FEEDBACK ACUMULATIVO:                                                │  │
│  │  • Progresso do teste                                                    │  │
│  │  • Sabotadores identificados                                             │  │
│  │  • Tendências observadas                                                 │  │
│  │                                                                           │  │
│  │  🎯 FEEDBACK PERSONALIZADO:                                              │  │
│  │  • Baseado no histórico                                                  │  │
│  │  • Adaptado ao perfil                                                    │  │
│  │  • Sugestões específicas                                                 │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🎨 **NOVO DESENHO - SISTEMA EXPANDIDO DE TIPOS DE PERGUNTA**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    SISTEMA COMPLETO DE TIPOS DE PERGUNTA                         │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  🎯 TIPOS DE PERGUNTA PRINCIPAIS                                         │  │
│  │                                                                           │  │
│  │  📊 MÚLTIPLA ESCOLHA:                                                    │  │
│  │  • Padrão (1-5)                                                          │  │
│  │  • Estendida (1-7)                                                       │  │
│  │  • Binária (Sim/Não)                                                     │  │
│  │  • Múltipla seleção                                                      │  │
│  │                                                                           │  │
│  │  📝 TEXTO:                                                               │  │
│  │  • Texto livre                                                           │  │
│  │  • Texto limitado (máx. 500 chars)                                       │  │
│  │  • Texto estruturado                                                     │  │
│  │  • Narrativa pessoal                                                     │  │
│  │                                                                           │  │
│  │  📈 ESCALAS:                                                             │  │
│  │  • Escala Likert (1-5)                                                   │  │
│  │  • Escala ampla (1-10)                                                   │  │
│  │  • Escala emocional (😢 😔 😐 😊 😄)                                    │  │
│  │  • Escala de confiança                                                   │  │
│  │                                                                           │  │
│  │  🎨 VISUAIS:                                                             │  │
│  │  • Seleção de imagem                                                     │  │
│  │  • Drag & drop                                                           │  │
│  │  • Slider interativo                                                     │  │
│  │  • Gráfico de barras                                                     │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  🔧 CONFIGURAÇÕES AVANÇADAS                                              │  │
│  │                                                                           │  │
│  │  📊 CÁLCULO DE SCORE:                                                    │  │
│  │  • Padrão (0-100)                                                        │  │
│  │  • Personalizado                                                          │  │
│  │  • Peso variável                                                          │  │
│  │  • Não calculável                                                         │  │
│  │                                                                           │  │
│  │  💬 FEEDBACK:                                                            │  │
│  │  • Imediato                                                              │  │
│  │  • Acumulativo                                                           │  │
│  │  • Personalizado                                                          │  │
│  │  • Condicional                                                            │  │
│  │                                                                           │  │
│  │  🎯 VALIDAÇÃO:                                                           │  │
│  │  • Obrigatória                                                            │  │
│  │  • Opcional                                                              │  │
│  │  • Condicional                                                            │  │
│  │  • Com regras específicas                                                 │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  📋 EXEMPLOS DE IMPLEMENTAÇÃO                                             │  │
│  │                                                                           │  │
│  │  🎯 MÚLTIPLA ESCOLHA (1-5):                                             │  │
│  │  "Eu sempre escolho roupas que disfarçam meu peso."                      │  │
│  │  [1] Discordo Fortemente [2] Discordo [3] Às Vezes [4] Concordo [5] Concordo Fortemente │
│  │                                                                           │  │
│  │  📝 TEXTO LIVRE:                                                         │  │
│  │  "Descreva como você se sente quando pensa em emagrecer."                │  │
│  │  [Campo de texto livre - máx. 500 caracteres]                           │  │
│  │                                                                           │  │
│  │  📈 ESCALA (1-10):                                                       │  │
│  │  "Quão confiante você está em emagrecer?"                                │  │
│  │  [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]                              │  │
│  │                                                                           │  │
│  │  🎨 ESCALA EMOCIONAL:                                                    │  │
│  │  "Como você se sente ao se olhar no espelho?"                            │  │
│  │  😢 😔 😐 😊 😄                                                          │  │
│  │                                                                           │  │
│  │  ✅ VERDADEIRO/FALSO:                                                    │  │
│  │  "Você acredita que pode emagrecer com sucesso?"                         │  │
│  │  ☑️ Verdadeiro ☐ Falso                                                   │  │
│  │                                                                           │  │
│  │  🎯 MÚLTIPLA SELEÇÃO:                                                    │  │
│  │  "Quais sabotadores você identifica em si mesmo?"                        │  │
│  │  ☐ Crítico Interno ☐ Sabotador das Roupas ☐ Válvula de Escape          │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 **FLUXO COMPLETO DO SISTEMA**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              FLUXO COMPLETO                                      │
│                                                                                   │
│  ┌─────────────────┐                                                             │
│  │   INÍCIO       │                                                             │
│  │   DO TESTE     │                                                             │
│  └─────────────────┘                                                             │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    ETAPA 1: COLETA DE DADOS                               │  │
│  │                                                                           │  │
│  │  📝 PERGUNTA 1/115:                                                      │  │
│  │  "Eu sempre escolho roupas que mais disfarçam meu excesso de peso."      │  │
│  │                                                                           │  │
│  │  ⚡ OPÇÕES DE RESPOSTA:                                                   │  │
│  │  [1] Discordo Fortemente                                                 │  │
│  │  [2] Discordo                                                            │  │
│  │  [3] Às Vezes                                                            │  │
│  │  [4] Concordo                                                            │  │
│  │  [5] Concordo Fortemente                                                 │  │
│  │                                                                           │  │
│  │  💬 FEEDBACK (OPCIONAL):                                                 │  │
│  │  "Esta pergunta avalia como você lida com sua autoimagem..."             │  │
│  │                                                                           │  │
│  │  💾 SALVAMENTO:                                                          │  │
│  │  • Resposta salva no Supabase                                           │  │
│  │  • Progresso atualizado                                                  │  │
│  │  • Sistema de lixeira disponível                                         │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    ETAPA 2: PROCESSAMENTO                                 │  │
│  │                                                                           │  │
│  │  🧮 CÁLCULO DE SCORES:                                                   │  │
│  │                                                                           │  │
│  │  Exemplo - Sabotador das Roupas:                                         │  │
│  │  Perguntas: [0,1,2,3,4]                                                  │  │
│  │  Respostas: [4,5,3,4,5] = 21 pontos                                     │  │
│  │  Score: (21/5) × 20 = 84 pontos                                         │  │
│  │                                                                           │  │
│  │  🔄 REPETIR PARA TODOS OS 24 SABOTADORES:                               │  │
│  │  • Calcular score para cada sabotador                                   │  │
│  │  • Ordenar por pontuação                                                │  │
│  │  • Identificar top 5                                                    │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    ETAPA 3: ANÁLISE E RESULTADOS                         │  │
│  │                                                                           │  │
│  │  📊 TOP 5 SABOTADORES IDENTIFICADOS:                                     │  │
│  │                                                                           │  │
│  │  1. 🥇 Crítico Interno (Score: 92)                                      │  │
│  │     • Resumo: "Uma voz interna te julga constantemente..."               │  │
│  │     • Estratégia: "Dê um nome a essa voz crítica..."                     │  │
│  │                                                                           │  │
│  │  2. 🥈 Sabotador das Roupas (Score: 84)                                 │  │
│  │     • Resumo: "O sabotador das roupas te faz esconder..."                │  │
│  │     • Estratégia: "Comece a renovar seu guarda-roupa..."                 │  │
│  │                                                                           │  │
│  │  3. 🥉 Válvula de Escape (Score: 78)                                     │  │
│  │     • Resumo: "Você usa a comida como uma muleta..."                     │  │
│  │     • Estratégia: "Identifique os gatilhos emocionais..."                │  │
│  │                                                                           │  │
│  │  4. 🏅 Prazer da Comida (Score: 72)                                      │  │
│  │     • Resumo: "Para você, o maior prazer da vida..."                     │  │
│  │     • Estratégia: "Expanda seu leque de prazeres..."                     │  │
│  │                                                                           │  │
│  │  5. 🏅 Boazinha Demais (Score: 68)                                       │  │
│  │     • Resumo: "Você tem uma enorme dificuldade..."                       │  │
│  │     • Estratégia: "Comece a praticar dizer 'não'..."                     │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    ETAPA 4: INTEGRAÇÃO COM SISTEMA                       │  │
│  │                                                                           │  │
│  │  🎯 RECOMENDAÇÕES PERSONALIZADAS:                                        │  │
│  │                                                                           │  │
│  │  📚 CURSOS SUGERIDOS:                                                    │  │
│  │  • "Mindfulness e Meditação" (para Crítico Interno)                      │  │
│  │  • "Psicologia Positiva" (para Boazinha Demais)                          │  │
│  │  • "Transformação Completa 2025" (para todos)                            │  │
│  │                                                                           │  │
│  │  📊 DASHBOARD INTELIGENTE:                                               │  │
│  │  • Visualização dos scores em gráficos                                   │  │
│  │  • Progresso ao longo do tempo                                           │  │
│  │  • Comparação com outros usuários                                        │  │
│  │                                                                           │  │
│  │  🔄 ACOMPANHAMENTO CONTÍNUO:                                             │  │
│  │  • Reavaliação periódica                                                 │  │
│  │  • Ajuste das estratégias                                                │  │
│  │  • Feedback contínuo                                                     │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                    RESULTADO FINAL                                        │  │
│  │                                                                           │  │
│  │  ✅ IDENTIFICAÇÃO PRECISA dos bloqueios principais                       │  │
│  │  ✅ ESTRATÉGIAS ESPECÍFICAS para cada sabotador                         │  │
│  │  ✅ RECOMENDAÇÕES PERSONALIZADAS de cursos                               │  │
│  │  ✅ ACOMPANHAMENTO CONTÍNUO do progresso                                 │  │
│  │  ✅ MELHORIA CONTÍNUA baseada nos dados                                  │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 **DETALHAMENTO DO SISTEMA DE EDIÇÃO**

### **📝 FORMULÁRIO DE EDIÇÃO DE PERGUNTAS**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              EDITOR DE PERGUNTAS                                  │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  📝 CONFIGURAÇÕES BÁSICAS:                                               │  │
│  │                                                                           │  │
│  │  🔤 TEXTO DA PERGUNTA:                                                   │  │
│  │  [Campo de texto livre]                                                  │  │
│  │                                                                           │  │
│  │  🎯 TIPO DE PERGUNTA:                                                    │  │
│  │  ☑️ Múltipla Escolha (1-5)                                              │  │
│  │  ☐ Texto Livre                                                           │  │
│  │  ☐ Verdadeiro/Falso                                                     │  │
│  │  ☐ Escala (1-10)                                                        │  │
│  │                                                                           │  │
│  │  📊 OPÇÕES DE RESPOSTA:                                                  │  │
│  │  [1] [Campo de texto]                                                    │  │
│  │  [2] [Campo de texto]                                                    │  │
│  │  [3] [Campo de texto]                                                    │  │
│  │  [4] [Campo de texto]                                                    │  │
│  │  [5] [Campo de texto]                                                    │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  💬 CONFIGURAÇÕES DE FEEDBACK:                                           │  │
│  │                                                                           │  │
│  │  ☑️ Mostrar feedback após resposta                                       │  │
│  │  ☐ Sem feedback                                                          │  │
│  │                                                                           │  │
│  │  📝 MENSAGEM DE FEEDBACK:                                                │  │
│  │  [Campo de texto livre]                                                  │  │
│  │                                                                           │  │
│  │  🎯 TIPO DE FEEDBACK:                                                    │  │
│  │  ☑️ Explicação da pergunta                                               │  │
│  │  ☑️ Contexto do sabotador                                                │  │
│  │  ☑️ Dica de reflexão                                                     │  │
│  │  ☐ Feedback personalizado                                                │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  🔧 CONFIGURAÇÕES AVANÇADAS:                                             │  │
│  │                                                                           │  │
│  │  📍 CATEGORIA:                                                           │  │
│  │  [Dropdown: Comportamental, Psicológico, Relacional, etc.]               │  │
│  │                                                                           │  │
│  │  🎯 SABOTADOR:                                                           │  │
│  │  [Dropdown: Roupas, Dinheiro, Crítico Interno, etc.]                     │  │
│  │                                                                           │  │
│  │  📊 PESO NO CÁLCULO:                                                    │  │
│  │  [Slider: 1-5]                                                           │  │
│  │                                                                           │  │
│  │  🔄 ORDEM NO TESTE:                                                     │  │
│  │  [Campo numérico]                                                        │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### **🎯 TIPOS DE PERGUNTA DISPONÍVEIS**

#### **📊 MÚLTIPLA ESCOLHA (1-5)**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PERGUNTA: "Eu sempre escolho roupas que mais disfarçam meu excesso de peso."    │
│                                                                                   │
│  OPÇÕES:                                                                         │
│  [1] Discordo Fortemente                                                         │
│  [2] Discordo                                                                    │
│  [3] Às Vezes                                                                    │
│  [4] Concordo                                                                    │
│  [5] Concordo Fortemente                                                         │
│                                                                                   │
│  CÁLCULO: Score = (Resposta × 20)                                               │
│  EXEMPLO: Resposta 4 = Score 80                                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### **📝 TEXTO LIVRE**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PERGUNTA: "Descreva como você se sente quando pensa em emagrecer."              │
│                                                                                   │
│  RESPOSTA: [Campo de texto livre]                                               │
│                                                                                   │
│  ANÁLISE: Qualitativa (não afeta score numérico)                                │
│  USO: Insights adicionais para personalização                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### **✅ VERDADEIRO/FALSO**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PERGUNTA: "Você acredita que pode emagrecer com sucesso?"                       │
│                                                                                   │
│  OPÇÕES:                                                                         │
│  ☑️ Verdadeiro                                                                   │
│  ☐ Falso                                                                         │
│                                                                                   │
│  CÁLCULO: Verdadeiro = 100, Falso = 0                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### **📊 ESCALA (1-10)**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PERGUNTA: "Em uma escala de 1 a 10, quão confiante você está em emagrecer?"    │
│                                                                                   │
│  ESCALA: [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]                              │
│                                                                                   │
│  CÁLCULO: Score = (Resposta × 10)                                               │
│  EXEMPLO: Resposta 7 = Score 70                                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### **💬 SISTEMA DE FEEDBACK**

#### **📝 FEEDBACK IMEDIATO**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  APÓS RESPONDER:                                                                │
│                                                                                   │
│  💬 "Esta pergunta avalia como você lida com sua autoimagem.                    │
│      Pessoas que escolhem roupas que disfarçam o corpo podem estar              │
│      evitando confrontar sua realidade física. Isso pode ser um                 │
│      sinal do 'Sabotador das Roupas'."                                          │
│                                                                                   │
│  💡 DICA: "Tente se olhar no espelho com mais gentileza hoje."                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### **📊 FEEDBACK ACUMULATIVO**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  DURANTE O TESTE:                                                               │
│                                                                                   │
│  📈 "Você já respondeu 45 perguntas.                                           │
│      Identificamos tendências relacionadas ao 'Crítico Interno'                 │
│      e 'Sabotador das Roupas'."                                                 │
│                                                                                   │
│  🎯 "Continue! Faltam 70 perguntas para completar sua análise."                │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### **🎯 FEEDBACK PERSONALIZADO**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  BASEADO NO HISTÓRICO:                                                          │
│                                                                                   │
│  👤 "Olá [Nome]! Baseado em seus testes anteriores,                            │
│      notamos que você tem trabalhado bem o 'Crítico Interno'.                   │
│      Esta pergunta pode ajudar a identificar novos padrões."                    │
│                                                                                   │
│  💪 "Continue assim! Você está progredindo muito."                             │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🎨 **NOVO DESENHO - TIPOS DE PERGUNTA EXPANDIDOS**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    SISTEMA COMPLETO DE TIPOS DE PERGUNTA                         │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  🎯 TIPOS DE PERGUNTA PRINCIPAIS                                         │  │
│  │                                                                           │  │
│  │  📊 MÚLTIPLA ESCOLHA:                                                    │  │
│  │  • Padrão (1-5)                                                          │  │
│  │  • Estendida (1-7)                                                       │  │
│  │  • Binária (Sim/Não)                                                     │  │
│  │  • Múltipla seleção                                                      │  │
│  │                                                                           │  │
│  │  📝 TEXTO:                                                               │  │
│  │  • Texto livre                                                           │  │
│  │  • Texto limitado (máx. 500 chars)                                       │  │
│  │  • Texto estruturado                                                     │  │
│  │  • Narrativa pessoal                                                     │  │
│  │                                                                           │  │
│  │  📈 ESCALAS:                                                             │  │
│  │  • Escala Likert (1-5)                                                   │  │
│  │  • Escala ampla (1-10)                                                   │  │
│  │  • Escala emocional (😢 😔 😐 😊 😄)                                    │  │
│  │  • Escala de confiança                                                   │  │
│  │                                                                           │  │
│  │  🎨 VISUAIS:                                                             │  │
│  │  • Seleção de imagem                                                     │  │
│  │  • Drag & drop                                                           │  │
│  │  • Slider interativo                                                     │  │
│  │  • Gráfico de barras                                                     │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  🔧 CONFIGURAÇÕES AVANÇADAS                                              │  │
│  │                                                                           │  │
│  │  📊 CÁLCULO DE SCORE:                                                    │  │
│  │  • Padrão (0-100)                                                        │  │
│  │  • Personalizado                                                          │  │
│  │  • Peso variável                                                          │  │
│  │  • Não calculável                                                         │  │
│  │                                                                           │  │
│  │  💬 FEEDBACK:                                                            │  │
│  │  • Imediato                                                              │  │
│  │  • Acumulativo                                                           │  │
│  │  • Personalizado                                                          │  │
│  │  • Condicional                                                            │  │
│  │                                                                           │  │
│  │  🎯 VALIDAÇÃO:                                                           │  │
│  │  • Obrigatória                                                            │  │
│  │  • Opcional                                                              │  │
│  │  • Condicional                                                            │  │
│  │  • Com regras específicas                                                 │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  📋 EXEMPLOS DE IMPLEMENTAÇÃO                                             │  │
│  │                                                                           │  │
│  │  🎯 MÚLTIPLA ESCOLHA (1-5):                                             │  │
│  │  "Eu sempre escolho roupas que disfarçam meu peso."                      │  │
│  │  [1] Discordo Fortemente [2] Discordo [3] Às Vezes [4] Concordo [5] Concordo Fortemente │
│  │                                                                           │  │
│  │  📝 TEXTO LIVRE:                                                         │  │
│  │  "Descreva como você se sente quando pensa em emagrecer."                │  │
│  │  [Campo de texto livre - máx. 500 caracteres]                           │  │
│  │                                                                           │  │
│  │  📈 ESCALA (1-10):                                                       │  │
│  │  "Quão confiante você está em emagrecer?"                                │  │
│  │  [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]                              │  │
│  │                                                                           │  │
│  │  🎨 ESCALA EMOCIONAL:                                                    │  │
│  │  "Como você se sente ao se olhar no espelho?"                            │  │
│  │  😢 😔 😐 😊 😄                                                          │  │
│  │                                                                           │  │
│  │  ✅ VERDADEIRO/FALSO:                                                    │  │
│  │  "Você acredita que pode emagrecer com sucesso?"                         │  │
│  │  ☑️ Verdadeiro ☐ Falso                                                   │  │
│  │                                                                           │  │
│  │  🎯 MÚLTIPLA SELEÇÃO:                                                    │  │
│  │  "Quais sabotadores você identifica em si mesmo?"                        │  │
│  │  ☐ Crítico Interno ☐ Sabotador das Roupas ☐ Válvula de Escape          │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 **PRINCIPAIS CARACTERÍSTICAS**

### **✅ Pontos Fortes:**
- **115 perguntas abrangentes** cobrindo todos os aspectos
- **24 sabotadores identificados** com precisão
- **Sistema de lixeira** para segurança dos dados
- **Cálculo inteligente** de scores
- **Recomendações personalizadas** baseadas nos resultados
- **Integração completa** com o sistema de cursos
- **Sistema flexível de edição** com múltiplos tipos de pergunta
- **Feedback configurável** para melhor experiência do usuário

### **🔄 Processo de Avaliação:**
1. **Coleta de dados** através de perguntas específicas
2. **Processamento** com algoritmo matemático
3. **Análise** dos principais sabotadores
4. **Geração** de insights personalizados
5. **Integração** com recomendações de conteúdo

### **📈 Resultados Esperados:**
- **Identificação precisa** dos bloqueios principais
- **Estratégias específicas** para cada sabotador
- **Recomendações personalizadas** de cursos
- **Acompanhamento contínuo** do progresso
- **Melhoria contínua** baseada nos dados

---

## 🎨 **VISUALIZAÇÃO DO MODELO**

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA SABOTADORES                    │
│                                                           │
│  📝 ENTRADA: 115 Perguntas → 🧮 PROCESSAMENTO → 📊 SAÍDA │
│                                                           │
│  🎯 RESULTADO: 24 Sabotadores + Top 5 + Estratégias     │
│                                                           │
│  🔄 INTEGRAÇÃO: Recomendações + Cursos + Acompanhamento  │
│                                                           │
│  🔧 EDIÇÃO: Múltiplos Tipos + Feedback Configurável     │
└─────────────────────────────────────────────────────────────┘
```

Este modelo garante uma avaliação completa e personalizada, identificando os principais sabotadores e fornecendo estratégias específicas para superá-los, integrando-se perfeitamente ao sistema de ferramentas da plataforma. 