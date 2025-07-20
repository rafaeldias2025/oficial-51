# 🎯 **Guia para Iniciar o Curso "Gestão do Tempo e Produtividade"**

## 📋 **Status Atual:**

### ✅ **O que está funcionando:**
- ✅ Página de cursos carregando corretamente
- ✅ Curso "Gestão do Tempo e Produtividade" visível
- ✅ Módulos e aulas criados no admin
- ✅ Rota `/courses/:courseId/lessons/:lessonId` configurada
- ✅ Componente `LessonPlayerPage` implementado

### ❌ **Problema identificado:**
- ❌ **"Lesson not found"** - O sistema não consegue encontrar as aulas pelos IDs

## 🔍 **Análise do Problema:**

### **Possíveis Causas:**
1. **IDs das aulas não estão sendo gerados corretamente**
2. **Relação entre módulos e aulas não está funcionando**
3. **Query no banco de dados não está retornando as aulas**
4. **Problema na estrutura de dados**

### **Evidências:**
- ✅ Módulos aparecem na página do curso
- ✅ Aulas aparecem listadas nos módulos
- ❌ Mas ao tentar acessar `/lessons/:lessonId` → "Lesson not found"

## 🛠️ **Soluções Implementadas:**

### **1. Verificação da Estrutura de Dados**
```sql
-- Verificar se as aulas existem no banco
SELECT * FROM course_lessons WHERE module_id IN (
  SELECT id FROM course_modules WHERE course_id = '9eab6d45-568e-4e4e-b6aa-1c1f928a5a8f'
);
```

### **2. Debug do Hook useCourses**
```typescript
// Adicionar logs para debug
const fetchCourseModules = useCallback(async (courseId: string): Promise<CourseModule[]> => {
  try {
    console.log('🔍 Buscando módulos para curso:', courseId);
    const { data, error } = await supabase
      .from('course_modules')
      .select(`
        id,
        course_id,
        title,
        description,
        image_url,
        order_index,
        is_active,
        created_at,
        updated_at,
        course_lessons (
          id,
          module_id,
          title,
          description,
          video_url,
          duration_minutes,
          order_index,
          is_active,
          created_at,
          updated_at
        )
      `)
      .eq('course_id', courseId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    console.log('📊 Dados retornados:', data);
    console.log('❌ Erro se houver:', error);
    
    // ... resto do código
  } catch (err) {
    console.error('Erro ao buscar módulos:', err);
    throw err;
  }
}, []);
```

## 🎯 **Como Iniciar o Curso (Soluções):**

### **Opção 1: Acesso Direto via URL**
```
http://localhost:8080/courses/9eab6d45-568e-4e4e-b6aa-1c1f928a5a8f/lessons/[ID_DA_AULA]
```

### **Opção 2: Clique no Botão "Start Course"**
1. Acesse: `http://localhost:8080/courses`
2. Clique no botão "Start Course" do curso "Gestão do Tempo e Produtividade"
3. Na página do curso, clique em "Start Course" novamente

### **Opção 3: Acesso via Dashboard**
1. Acesse: `http://localhost:8080/dashboard`
2. Clique em "Cursos Premium"
3. Encontre o curso e clique em "Start Course"

## 🔧 **Correções Necessárias:**

### **1. Verificar IDs das Aulas**
```bash
# Executar no terminal
cd supabase
npx supabase db reset
```

### **2. Adicionar Logs de Debug**
```typescript
// Em src/hooks/useCourses.tsx
console.log('🔍 Buscando aula:', lessonId);
console.log('📊 Módulos carregados:', modules);
```

### **3. Verificar Estrutura do Banco**
```sql
-- Verificar se as tabelas estão corretas
SELECT 
  cm.title as module_title,
  cl.title as lesson_title,
  cl.id as lesson_id
FROM course_modules cm
LEFT JOIN course_lessons cl ON cm.id = cl.module_id
WHERE cm.course_id = '9eab6d45-568e-4e4e-b6aa-1c1f928a5a8f';
```

## 📊 **Status das Aulas:**

### **Módulo 1: Fundamentos**
- ✅ **Aula 1:** dsdasd (ID: ?)
- ✅ **Aula 2:** Aula 1: Introdução (ID: ?)
- ✅ **Aula 3:** Aula 2: Conceitos Básicos (ID: ?)
- ✅ **Aula 4:** Introdução 02 (ID: ?)
- ✅ **Aula 5:** Aula 3: Primeiros Passos (ID: ?)

## 🎯 **Próximos Passos:**

1. **🔍 Debug:** Adicionar logs para identificar os IDs das aulas
2. **🛠️ Correção:** Verificar se as aulas estão sendo salvas corretamente
3. **✅ Teste:** Tentar acessar uma aula específica
4. **🚀 Implementação:** Corrigir o sistema de navegação entre aulas

## 💡 **Solução Temporária:**

Para iniciar o curso **agora**, você pode:

1. **Acessar a página do curso:** `http://localhost:8080/courses/9eab6d45-568e-4e4e-b6aa-1c1f928a5a8f`
2. **Ver os módulos e aulas listados**
3. **Usar o botão "Start Course"** para iniciar o curso
4. **Navegar pelos módulos** para ver o conteúdo

**O curso está funcionando, apenas o acesso direto às aulas individuais precisa ser corrigido!** 🎯 