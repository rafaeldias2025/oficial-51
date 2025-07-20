# 🛠️ **Guia de Controles Avançados de Admin**

## 📋 **Como Acessar os Controles**

### **1. Na Lista de Aulas:**
- Ao lado de cada módulo, você verá dois botões:
  1. ➕ **Botão Plus** - Adicionar aula simples
  2. 🎛️ **Botão Avançado** - Abre o gerenciador avançado

## 🎯 **Tipos de Adição de Aula**

### **1. Adição Rápida (Botão Plus):**
- Clique no ➕ ao lado do módulo
- Preencha:
  - Título
  - Descrição
  - URL do vídeo
  - Duração

### **2. Adição Avançada (Gerenciador Avançado):**
O gerenciador avançado tem 4 abas:

#### **📝 Aba Básico:**
- Tipo de aula:
  - 🎬 Vídeo
  - 📄 Texto
  - 🔄 Misto
- Título e descrição
- Duração em minutos
- Ordem na lista
- Status ativo/inativo

#### **📊 Aba Conteúdo:**
- URL do vídeo (para aulas em vídeo)
- Editor de texto rico (para aulas em texto)
- Conteúdo misto (para aulas híbridas)

#### **🎨 Aba Mídia:**
- Upload de thumbnail
- Upload de documento de apoio (PDF)
- Upload de imagem ilustrativa
- Preview dos arquivos

#### **⚙️ Aba Avançado:**
- Objetivos de aprendizagem
- Pré-requisitos
- Recursos adicionais
- Configuração de quiz
- Tags da aula

## 🚀 **Como Usar**

### **1. Para Adicionar uma Aula Simples:**
```
1. Localize o módulo desejado
2. Clique no botão ➕
3. Preencha os dados básicos
4. Clique em "Salvar"
```

### **2. Para Usar o Gerenciador Avançado:**
```
1. Localize o módulo desejado
2. Clique no botão "Adicionar Aula Avançada"
3. A modal abrirá com todas as opções
4. Navegue pelas abas preenchendo os dados
5. Clique em "Salvar Aula" quando terminar
```

## 📤 **Upload de Arquivos**

### **Tipos de arquivo suportados:**
- **Thumbnail:** jpg, png, webp (até 250kb)
- **Documentos:** pdf, doc, docx, txt
- **Imagens:** jpg, png, webp (até 2MB)

### **Como fazer upload:**
1. Na aba "Mídia"
2. Escolha o tipo de arquivo
3. Clique no botão de upload
4. Selecione o arquivo
5. Aguarde o upload
6. Veja o preview

## ❓ **Sistema de Quiz**

### **Como adicionar um quiz:**
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

## 🏷️ **Sistema de Tags**

### **Como usar:**
1. Vá para a aba "Avançado"
2. No campo "Tags"
3. Digite as tags separadas por vírgula:
```
tag1, tag2, tag3
```

## 📊 **Metadados Avançados**

### **Campos disponíveis:**
- 🎯 Objetivos de aprendizagem
- 📋 Pré-requisitos
- 🔗 Recursos adicionais
- ❓ Questões do quiz
- 🏷️ Tags

## ⚠️ **Dicas Importantes**

### **1. Ordem das Aulas:**
- Use o campo "Ordem" para organizar
- Números menores aparecem primeiro
- Pode usar decimais (1.5, 2.3, etc)

### **2. Arquivos:**
- Otimize imagens antes do upload
- Use nomes descritivos
- Verifique o tamanho máximo

### **3. Conteúdo:**
- Preencha todos os campos possíveis
- Seja descritivo nas explicações
- Use formatação no texto quando disponível

### **4. Quiz:**
- Valide o JSON antes de salvar
- Numere as opções corretamente
- Teste o quiz após criar

## 🔍 **Troubleshooting**

### **Problemas comuns:**
1. **Upload falha:**
   - Verifique o tamanho do arquivo
   - Confirme o formato permitido
   - Tente otimizar a imagem

2. **Quiz não aparece:**
   - Verifique o formato JSON
   - Confirme que todas as opções estão preenchidas
   - Verifique o índice da resposta correta

3. **Aula não aparece na lista:**
   - Verifique se está ativa
   - Confirme a ordem
   - Recarregue a página

## ✅ **Checklist Final**

Antes de salvar uma aula, verifique:
- [ ] Título e descrição preenchidos
- [ ] Tipo de aula correto
- [ ] Arquivos enviados corretamente
- [ ] Quiz formatado (se houver)
- [ ] Tags adicionadas
- [ ] Ordem definida
- [ ] Status ativo/inativo correto

## 🎯 **Próximos Passos**

### **Recursos em desenvolvimento:**
1. Editor de vídeo integrado
2. Sistema de comentários
3. Analytics avançado
4. Exportação de dados
5. Importação em lote

## 🆘 **Suporte**

Se precisar de ajuda:
1. Verifique este guia
2. Consulte a documentação
3. Entre em contato com o suporte

**O sistema está pronto para uso!** 🚀 