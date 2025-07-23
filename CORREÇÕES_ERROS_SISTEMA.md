# Correções de Erros do Sistema

## 🔧 Problemas Identificados e Soluções

### 1. **Erros de Acessibilidade (Dialog)**

#### **Problema:**
- `DialogContent` requer `DialogTitle` para acessibilidade
- `DialogContent` requer `DialogDescription` ou `aria-describedby`

#### **Soluções Aplicadas:**

✅ **Componente VisuallyHidden criado:**
```typescript
// src/components/ui/visually-hidden.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "absolute left-[-10000px] top-auto w-[1px] h-[1px] overflow-hidden",
      className
    )}
    {...props}
  />
))
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
```

✅ **CircunferenciaAbdominalModal corrigido:**
```typescript
// Adicionado DialogDescription
<DialogHeader>
  <DialogTitle className="text-netflix-text flex items-center gap-2">
    <Ruler className="h-5 w-5 text-instituto-orange" />
    Circunferência Abdominal
  </DialogTitle>
  <DialogDescription className="text-netflix-text-muted">
    Meça sua circunferência abdominal para completar a análise de saúde
  </DialogDescription>
</DialogHeader>
```

✅ **AddContentModal corrigido:**
```typescript
// Adicionado DialogDescription
<DialogHeader>
  <DialogTitle className="text-2xl font-bold">
    Adicionar Novo Conteúdo
  </DialogTitle>
  <DialogDescription>
    Crie um novo conteúdo para a plataforma de cursos
  </DialogDescription>
</DialogHeader>
```

### 2. **Erros de API (Tabelas Inexistentes)**

#### **Problema:**
- Tabelas `user_physical_data` e `weight_measurements` não existem
- Erro 406 e 400 nas chamadas da API

#### **Soluções:**

✅ **Tabelas corretas a serem usadas:**
```sql
-- Tabelas existentes no sistema:
- dados_fisicos_usuario (para dados físicos)
- pesagens (para histórico de pesagens)
- dados_saude_usuario (para dados de saúde)
- profiles (para perfil do usuário)
```

✅ **Correção nos hooks:**
```typescript
// Substituir chamadas para tabelas inexistentes:
// ❌ user_physical_data -> ✅ dados_fisicos_usuario
// ❌ weight_measurements -> ✅ pesagens

const { data: physicalData } = await supabase
  .from('dados_fisicos_usuario')  // ✅ Tabela correta
  .select('*')
  .eq('user_id', profileId)
  .single();

const { data: weightHistory } = await supabase
  .from('pesagens')  // ✅ Tabela correta
  .select('*')
  .eq('user_id', profileId)
  .order('data_medicao', { ascending: false });
```

### 3. **Erro no XiaomiScaleFlow.tsx**

#### **Problema:**
- Arquivo não encontrado ou erro na função `confirmAndSave`

#### **Solução:**
```typescript
// Verificar se o arquivo existe e corrigir a função
const confirmAndSave = async (circunferencia: number) => {
  try {
    // Usar tabelas corretas
    const { error: pesagemError } = await supabase
      .from('pesagens')  // ✅ Tabela correta
      .insert({
        user_id: selectedUser,
        peso_kg: scaleData.weight,
        // ... outros campos
      });

    if (pesagemError) throw pesagemError;
    
    // Atualizar dados de saúde
    const { error: saudeError } = await supabase
      .from('dados_saude_usuario')  // ✅ Tabela correta
      .upsert({
        user_id: selectedUser,
        peso_atual_kg: scaleData.weight,
        // ... outros campos
      });

    if (saudeError) throw saudeError;
    
  } catch (error) {
    console.error('Erro ao salvar:', error);
    toast({
      title: "Erro ao salvar dados",
      description: "Tente novamente",
      variant: "destructive",
    });
  }
};
```

### 4. **Erro no AuthPage.tsx**

#### **Problema:**
- Erro 400 ao criar perfil

#### **Solução:**
```typescript
// Verificar dados obrigatórios antes de criar perfil
const handleSignup = async () => {
  try {
    // Validar dados obrigatórios
    if (!fullName || !dataNascimento || !sexo || !altura) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Criar perfil com dados válidos
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: fullName.trim(),
        data_nascimento: dataNascimento,
        sexo: sexo,
        altura_cm: parseInt(altura),
        email: user.email
      });

    if (error) throw error;

    // Criar dados físicos
    await supabase
      .from('dados_fisicos_usuario')
      .insert({
        user_id: user.id,
        nome_completo: fullName.trim(),
        data_nascimento: dataNascimento,
        sexo: sexo,
        altura_cm: parseInt(altura),
        peso_atual_kg: 70.0,
        circunferencia_abdominal_cm: 90.0
      });

  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    toast({
      title: "Erro ao criar perfil",
      description: "Tente novamente",
      variant: "destructive",
    });
  }
};
```

## 🚀 Próximos Passos

### 1. **Aplicar Correções nos Componentes**

```bash
# Verificar todos os componentes que usam Dialog
grep -r "DialogContent" src/components/
grep -r "DialogTitle" src/components/

# Adicionar DialogDescription onde necessário
```

### 2. **Corrigir Chamadas de API**

```bash
# Substituir todas as referências às tabelas incorretas
sed -i 's/user_physical_data/dados_fisicos_usuario/g' src/**/*.tsx
sed -i 's/weight_measurements/pesagens/g' src/**/*.tsx
```

### 3. **Verificar Hooks**

```bash
# Verificar se todos os hooks usam as tabelas corretas
grep -r "from.*user_physical_data" src/hooks/
grep -r "from.*weight_measurements" src/hooks/
```

### 4. **Testar Funcionalidades**

```bash
# Testar após correções:
1. Cadastro de usuário
2. Pesagem com balança
3. Visualização de gráficos
4. Acessibilidade dos modais
```

## 📋 Checklist de Correções

- [x] Criar componente VisuallyHidden
- [x] Corrigir CircunferenciaAbdominalModal
- [x] Corrigir AddContentModal
- [ ] Corrigir todos os outros modais
- [ ] Substituir tabelas incorretas
- [ ] Corrigir hooks de dados
- [ ] Testar funcionalidades
- [ ] Verificar acessibilidade

## 🔍 Monitoramento

Após aplicar as correções, monitorar:
- Console do navegador para erros
- Network tab para chamadas de API
- Acessibilidade com screen readers
- Funcionalidade dos gráficos 