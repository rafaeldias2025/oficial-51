# ❓ Guia do Sistema de Quiz

## 🎯 Onde Encontrar o Quiz

### **Localização no Gerenciador Avançado:**

1. **Acesse:** `http://localhost:8080/admin/courses/01JCEHN6MZP3RQWJ5YH4V7XZB8/modules/01JCEHN6MZP3RQWJ5YH4V7XZC0/lessons/new`

2. **Navegue para a aba "Avançado"** (última aba)

3. **Localize o campo:** "Questões do Quiz (JSON)"

## 📝 Como Criar um Quiz

### **Formato JSON Esperado:**

```json
[
  {
    "question": "Qual é a principal técnica de gestão do tempo?",
    "options": [
      "Matriz de Eisenhower",
      "Técnica Pomodoro", 
      "Lista de Tarefas",
      "Agenda Digital"
    ],
    "correct": 0
  },
  {
    "question": "Quantos minutos dura um ciclo Pomodoro?",
    "options": [
      "15 minutos",
      "25 minutos",
      "30 minutos", 
      "45 minutos"
    ],
    "correct": 1
  },
  {
    "question": "Qual é o benefício principal da gestão do tempo?",
    "options": [
      "Mais dinheiro",
      "Mais produtividade",
      "Menos estresse",
      "Todas as anteriores"
    ],
    "correct": 3
  }
]
```

### **Estrutura do Quiz:**

- **`question`**: A pergunta
- **`options`**: Array com as opções de resposta
- **`correct`**: Índice da resposta correta (0 = primeira opção)

## 🎪 Exemplo Prático

### **Quiz sobre Gestão do Tempo:**

```json
[
  {
    "question": "O que é a Matriz de Eisenhower?",
    "options": [
      "Uma ferramenta de priorização",
      "Um método de organização de arquivos",
      "Uma técnica de respiração",
      "Um sistema de cores"
    ],
    "correct": 0
  },
  {
    "question": "Qual quadrante da Matriz de Eisenhower é mais importante?",
    "options": [
      "Urgente e Importante",
      "Não Urgente e Importante", 
      "Urgente e Não Importante",
      "Não Urgente e Não Importante"
    ],
    "correct": 1
  },
  {
    "question": "Quantos intervalos de 5 minutos há em um Pomodoro?",
    "options": [
      "2 intervalos",
      "3 intervalos",
      "4 intervalos",
      "5 intervalos"
    ],
    "correct": 2
  }
]
```

## 🔧 Como Usar

### **Passo a Passo:**

1. **Acesse o gerenciador avançado**
2. **Vá para a aba "Avançado"**
3. **Cole o JSON do quiz no campo "Questões do Quiz"**
4. **Salve a aula**
5. **O quiz será salvo junto com a aula**

## 🎯 Onde o Quiz Aparece

### **No Player de Aula:**
- O quiz aparece como um ícone de interrogação (❓)
- Localizado na barra lateral junto com outras aulas
- Clicável para acessar o quiz

### **No Sistema:**
- Tipo de aula: `quiz`
- Ícone: `HelpCircle` (❓)
- Renderizado no `CourseModulesSection.tsx`

## ⚠️ Importante

### **Validação do JSON:**
- Certifique-se de que o JSON está válido
- Use aspas duplas para strings
- Verifique se os índices das respostas estão corretos
- Teste o quiz após criar

### **Limitações Atuais:**
- O quiz é salvo como JSON no banco de dados
- A renderização do quiz ainda precisa ser implementada
- O sistema de pontuação não está implementado

## 🚀 Próximos Passos

Para completar o sistema de quiz, seria necessário:

1. **Criar um componente QuizRenderer**
2. **Implementar a lógica de pontuação**
3. **Adicionar feedback visual**
4. **Salvar resultados do usuário**

## 📍 Localização no Código

### **Arquivos Relacionados:**
- `src/components/admin/AdvancedLessonManager.tsx` - Campo de entrada do quiz
- `src/components/courses/CourseModulesSection.tsx` - Renderização do ícone
- `src/hooks/useCourses.tsx` - Tipo de aula 'quiz'

### **Campo no Formulário:**
```typescript
// Linha 408-411 do AdvancedLessonManager.tsx
<Label>Questões do Quiz (JSON)</Label>
<Textarea
  value={formData.quiz_questions}
  onChange={(e) => setFormData({ ...formData, quiz_questions: e.target.value })}
  placeholder='[{"question": "...", "options": [...], "correct": 0}]'
  rows={4}
/>
```

**O quiz está implementado como campo de entrada, mas precisa de um componente para renderização!** 🎯 