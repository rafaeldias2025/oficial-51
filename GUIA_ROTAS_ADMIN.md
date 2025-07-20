# 🛣️ Guia de Rotas do Sistema

## 📋 Análise do Problema

Após análise detalhada, identificamos que o problema está nas rotas do sistema. As rotas estão definidas corretamente no arquivo `App.tsx`, mas estamos tentando acessá-las de forma incorreta.

## 🌐 Rotas Corretas

### Rotas de Cursos
- ✅ `/courses` - Lista de todos os cursos
- ✅ `/courses/:courseId` - Página de detalhes do curso
- ✅ `/courses/:courseId/lessons/:lessonId` - Player de aula

### Rotas de Administração
- ✅ `/admin` - Painel de administração
- ✅ `/admin/courses` - Gerenciamento de cursos
- ✅ `/admin/courses/:courseId/modules/:moduleId/edit` - Edição de módulo
- ✅ `/admin/courses/:courseId/modules/:moduleId/lessons/new` - Nova aula
- ✅ `/admin/courses/:courseId/lessons/:lessonId/edit` - Edição de aula

## 🔍 Como Acessar os Controles Avançados de Admin

### 1. Acessar o Painel de Admin
```
http://localhost:8080/admin
```

### 2. Acessar o Gerenciamento de Cursos
```
http://localhost:8080/admin/courses
```

### 3. Gerenciar Módulos e Aulas de um Curso
Clique no botão "Gerenciar Módulos e Aulas" do curso desejado.

### 4. Editar um Módulo
```
http://localhost:8080/admin/courses/{ID_DO_CURSO}/modules/{ID_DO_MODULO}/edit
```
Exemplo: `http://localhost:8080/admin/courses/1/modules/1/edit`

### 5. Adicionar uma Nova Aula
```
http://localhost:8080/admin/courses/{ID_DO_CURSO}/modules/{ID_DO_MODULO}/lessons/new
```
Exemplo: `http://localhost:8080/admin/courses/1/modules/1/lessons/new`

### 6. Visualizar uma Aula (com controles de admin)
```
http://localhost:8080/courses/{ID_DO_CURSO}/lessons/{ID_DA_AULA}
```
Exemplo: `http://localhost:8080/courses/1/lessons/1`

## 🛠️ Botão Plus e Controles Avançados

O botão Plus e os controles avançados de admin estão disponíveis em duas situações:

1. **Na página de edição de módulo**:
   - Acesse `/admin/courses/{ID_DO_CURSO}/modules/{ID_DO_MODULO}/edit`
   - O botão Plus aparece ao lado de cada módulo

2. **No player de aula (quando logado como admin)**:
   - Acesse `/courses/{ID_DO_CURSO}/lessons/{ID_DA_AULA}`
   - O botão Plus aparece na barra lateral de aulas

## ⚠️ Problemas Comuns

1. **Erro "Aula não encontrada"**:
   - Verifique se o ID da aula existe no banco de dados
   - Tente outra aula, por exemplo `/courses/1/lessons/2`

2. **Erro "Curso não encontrado"**:
   - Verifique se o ID do curso existe no banco de dados
   - Tente outro curso, por exemplo `/courses/2/lessons/1`

3. **Página 404**:
   - Verifique se a rota está correta
   - Certifique-se de usar os IDs corretos

## 🔧 Solução

Para resolver os problemas de rotas:

1. **Use as rotas corretas** conforme listado acima
2. **Verifique os IDs** dos cursos e aulas no banco de dados
3. **Certifique-se de estar logado como admin** para acessar os controles avançados

## 📝 Próximos Passos

1. Criar um curso de teste com módulos e aulas
2. Acessar o player de aula para ver os controles avançados
3. Testar o botão Plus e o gerenciador avançado de aulas 