import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function inserirUsuariosTeste() {
  try {
    console.log('Inserindo usuários de teste...');
    
    const usuarios = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        full_name: 'João Silva',
        email: 'joao.silva@teste.com',
        created_at: new Date().toISOString()
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        full_name: 'Maria Santos',
        email: 'maria.santos@teste.com',
        created_at: new Date().toISOString()
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        full_name: 'Pedro Oliveira',
        email: 'pedro.oliveira@teste.com',
        created_at: new Date().toISOString()
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        full_name: 'Ana Costa',
        email: 'ana.costa@teste.com',
        created_at: new Date().toISOString()
      }
    ];

    for (const usuario of usuarios) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(usuario, { onConflict: 'id' });
        
      if (error) {
        console.error(`Erro ao inserir ${usuario.full_name}:`, error);
      } else {
        console.log(`✅ Usuário ${usuario.full_name} inserido com sucesso`);
      }
    }
    
    console.log('✅ Todos os usuários de teste foram inseridos!');
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

inserirUsuariosTeste(); 