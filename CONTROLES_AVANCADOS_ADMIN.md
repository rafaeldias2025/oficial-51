# 🎮 Guia de Controles Avançados de Admin

## 📋 Visão Geral

Os controles avançados de admin permitem gerenciar módulos e aulas de forma mais completa, com recursos adicionais como upload de documentos, imagens, configuração de quiz e muito mais.

## 🔍 Como Acessar os Controles

### 1. No Player de Aula (Sidebar)
- Acesse uma aula como admin: `/courses/{ID_DO_CURSO}/lessons/{ID_DA_AULA}`
- Na barra lateral, você verá dois botões ao lado de cada módulo:
  - ➕ **Botão Plus** - Adicionar aula simples
  - 🎛️ **Botão Avançado** - Abre o gerenciador avançado de aulas

### 2. Na Página de Edição de Módulo
- Acesse a página de edição de módulo: `/admin/courses/{ID_DO_CURSO}/modules/{ID_DO_MODULO}/edit`
- Você verá os mesmos botões ao lado de cada módulo

## 🎯 Tipos de Adição de Aula

### 1. Adição Rápida (Botão Plus)
- Clique no ➕ ao lado do módulo
- Preencha os campos básicos:
  - Título
  - Descrição
  - URL do vídeo
  - Duração
  - Ordem

### 2. Adição Avançada (Gerenciador Avançado)
O gerenciador avançado tem 4 abas:

#### 📝 Aba Básico
- Tipo de aula:
  - 🎬 Vídeo
  - 📄 Texto
  - 🔄 Misto
- Título e descrição
- Duração em minutos
- Ordem na lista
- Status ativo/inativo

#### 📊 Aba Conteúdo
- URL do vídeo (para aulas em vídeo)
- Editor de texto rico (para aulas em texto)
- Conteúdo misto (para aulas híbridas)

#### 🎨 Aba Mídia
- Upload de thumbnail
- Upload de documento de apoio (PDF)
- Upload de imagem ilustrativa
- Preview dos arquivos

#### ⚙️ Aba Avançado
- Objetivos de aprendizagem
- Pré-requisitos
- Recursos adicionais
- Configuração de quiz
- Tags da aula

## 🚀 Como Usar

### 1. Para Adicionar uma Aula Simples
```
1. Localize o módulo desejado
2. Clique no botão ➕
3. Preencha os dados básicos
4. Clique em "Salvar"
```

### 2. Para Usar o Gerenciador Avançado
```
1. Localize o módulo desejado
2. Clique no botão "Adicionar Aula Avançada"
3. A modal abrirá com todas as opções
4. Navegue pelas abas preenchendo os dados
5. Clique em "Salvar Aula" quando terminar
```

## 📤 Upload de Arquivos

### Tipos de arquivo suportados
- **Thumbnail:** jpg, png, webp (até 250kb)
- **Documentos:** pdf, doc, docx, txt
- **Imagens:** jpg, png, webp (até 2MB)

### Como fazer upload
1. Na aba "Mídia"
2. Escolha o tipo de arquivo
3. Clique no botão de upload
4. Selecione o arquivo
5. Aguarde o upload
6. Veja o preview

## ❓ Sistema de Quiz

### Como adicionar um quiz
1. Vá para a aba "Avançado"
2. Localize o campo "Questões do Quiz"
3. Adicione no formato JSON:
```json
[
  {
    "question": "Pergunta aqui?",
    "options": [
      "Opção 1",
      "Opção 2",
      "Opção 3",
      "Opção 4"
    ],
    "correct": 0
  }
]
```

## 🏷️ Sistema de Tags

### Como usar
1. Vá para a aba "Avançado"
2. No campo "Tags"
3. Digite as tags separadas por vírgula:
```
tag1, tag2, tag3
```

## 📊 Metadados Avançados

### Campos disponíveis
- 🎯 Objetivos de aprendizagem
- 📋 Pré-requisitos
- 🔗 Recursos adicionais
- ❓ Questões do quiz
- 🏷️ Tags

## ⚠️ Solução de Problemas

### 1. Não consigo ver o botão Plus ou o gerenciador avançado
- Verifique se você está logado como admin
- Certifique-se de estar na rota correta
- Tente recarregar a página

### 2. Erro ao salvar uma aula
- Verifique se todos os campos obrigatórios estão preenchidos
- Certifique-se de que o formato do JSON do quiz está correto
- Verifique se o tamanho dos arquivos está dentro do limite

### 3. Não consigo fazer upload de arquivos
- Verifique o tipo e tamanho do arquivo
- Certifique-se de que o Supabase está rodando
- Tente um arquivo menor ou em outro formato

## 📝 Próximos Passos

Para testar os controles avançados:

1. Crie um curso de teste
2. Adicione um módulo
3. Use o gerenciador avançado para adicionar uma aula
4. Teste todas as funcionalidades (upload, quiz, tags, etc.)
5. Visualize a aula no player para confirmar que tudo está funcionando 