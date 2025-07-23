import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjAxMjksImV4cCI6MjA2NzkzNjEyOX0.fSW8E59RnrKZdeuyGlxgjJdYgE87w53ahcwqL1GP4cw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupBasicDatabase() {
  console.log('🚀 Configurando banco básico...');
  
  try {
    // 1. Criar tabela tools se não existir
    console.log('📝 Criando tabela tools...');
    const { error: toolsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS tools (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT,
          content JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
      `
    });
    
    if (toolsTableError) {
      console.log('❌ Erro ao criar tabela tools:', toolsTableError.message);
    } else {
      console.log('✅ Tabela tools criada/verificada');
    }
    
    // 2. Criar tabela assessment_tools se não existir
    console.log('📝 Criando tabela assessment_tools...');
    const { error: assessmentTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS assessment_tools (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id),
          tool_id UUID REFERENCES tools(id),
          responses JSONB,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          score INTEGER
        );
        
        CREATE INDEX IF NOT EXISTS idx_assessment_tools_user ON assessment_tools(user_id);
        CREATE INDEX IF NOT EXISTS idx_assessment_tools_tool ON assessment_tools(tool_id);
      `
    });
    
    if (assessmentTableError) {
      console.log('❌ Erro ao criar tabela assessment_tools:', assessmentTableError.message);
    } else {
      console.log('✅ Tabela assessment_tools criada/verificada');
    }
    
    // 3. Inserir algumas ferramentas básicas
    console.log('🛠️ Inserindo ferramentas básicas...');
    const basicTools = [
      {
        name: 'Avaliação de Autocuidado',
        description: 'Ferramenta para avaliar práticas de autocuidado',
        category: 'wellness',
        content: {
          questions: [
            { id: 1, text: 'Como você avalia sua qualidade de sono?', type: 'scale', min: 1, max: 5 },
            { id: 2, text: 'Com que frequência você pratica exercícios?', type: 'multiple', options: ['Diariamente', 'Semanalmente', 'Raramente', 'Nunca'] }
          ]
        }
      },
      {
        name: 'Questionário de Bem-estar',
        description: 'Avaliação geral de bem-estar e satisfação',
        category: 'wellness',
        content: {
          questions: [
            { id: 1, text: 'Como você se sente em relação à sua vida atual?', type: 'scale', min: 1, max: 10 },
            { id: 2, text: 'Quais áreas você gostaria de melhorar?', type: 'text' }
          ]
        }
      }
    ];
    
    for (const tool of basicTools) {
      const { error: insertError } = await supabase
        .from('tools')
        .insert(tool);
        
      if (insertError) {
        console.log(`❌ Erro ao inserir tool ${tool.name}:`, insertError.message);
      } else {
        console.log(`✅ Tool inserida: ${tool.name}`);
      }
    }
    
    console.log('✨ Configuração básica concluída!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

setupBasicDatabase();
