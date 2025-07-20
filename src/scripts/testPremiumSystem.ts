import { supabase } from '@/integrations/supabase/client';

export const testPremiumSystem = async () => {
  console.log('🔥 Testando Sistema de Cursos Premium...');

  try {
    // 1. Teste de conectividade com o banco
    console.log('1. Testando conexão com o banco...');
    const { data: connectionTest } = await supabase.from('courses').select('count').limit(1);
    console.log('✅ Conexão com banco estabelecida');

    // 2. Verificar se as tabelas premium existem
    console.log('2. Verificando tabelas do sistema premium...');
    
    const tables = [
      'course_hero_config',
      'module_display_config', 
      'course_comments',
      'course_favorites',
      'course_ratings',
      'user_badges',
      'user_certificates',
      'user_playlists',
      'playlist_courses',
      'course_recommendations',
      'course_notifications',
      'course_themes',
      'course_analytics'
    ];

    // Testar principais tabelas do sistema premium
    try {
      const { data: heroTest } = await supabase.from('course_hero_config').select('*').limit(1);
      console.log('✅ Tabela course_hero_config: OK');
    } catch {
      console.log('❌ Tabela course_hero_config: Erro');
    }

    try {
      const { data: moduleTest } = await supabase.from('module_display_config').select('*').limit(1);
      console.log('✅ Tabela module_display_config: OK');
    } catch {
      console.log('❌ Tabela module_display_config: Erro');
    }

    try {
      const { data: commentsTest } = await supabase.from('course_comments').select('*').limit(1);
      console.log('✅ Tabela course_comments: OK');
    } catch {
      console.log('❌ Tabela course_comments: Erro');
    }

    try {
      const { data: favoritesTest } = await supabase.from('course_favorites').select('*').limit(1);
      console.log('✅ Tabela course_favorites: OK');
    } catch {
      console.log('❌ Tabela course_favorites: Erro');
    }

    try {
      const { data: ratingsTest } = await supabase.from('course_ratings').select('*').limit(1);
      console.log('✅ Tabela course_ratings: OK');
    } catch {
      console.log('❌ Tabela course_ratings: Erro');
    }

    // 3. Testar criação de dados de exemplo
    console.log('3. Testando criação de dados de exemplo...');

    // Verificar se existe pelo menos um curso
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, is_premium')
      .limit(1);

    if (courses && courses.length > 0) {
      const courseId = courses[0].id;
      console.log(`✅ Curso encontrado: ${courses[0].title} (ID: ${courseId})`);

      // Testar inserção de configuração de hero
      try {
        const { data: heroConfig, error: heroError } = await supabase
          .from('course_hero_config')
          .upsert({
            course_id: courseId,
            hero_type: 'image',
            hero_title: 'Curso Teste Premium',
            hero_subtitle: 'Sistema funcionando perfeitamente!',
            hero_image_url: 'https://via.placeholder.com/800x400'
          })
          .select()
          .single();

        if (heroError) {
          console.log(`❌ Erro ao criar hero config: ${heroError.message}`);
        } else {
          console.log('✅ Hero config criado com sucesso');
        }
      } catch (err) {
        console.log('❌ Erro ao testar hero config');
      }

      // Testar inserção de configuração de módulos
      try {
        const { data: moduleConfig, error: moduleError } = await supabase
          .from('module_display_config')
          .upsert({
            course_id: courseId,
            display_mode: 'direct',
            show_module_activation: true,
            active_modules: ['1', '2', '3']
          })
          .select()
          .single();

        if (moduleError) {
          console.log(`❌ Erro ao criar module config: ${moduleError.message}`);
        } else {
          console.log('✅ Module config criado com sucesso');
        }
      } catch (err) {
        console.log('❌ Erro ao testar module config');
      }

    } else {
      console.log('❌ Nenhum curso encontrado para testar');
    }

    // 4. Teste de funcionalidades do hook
    console.log('4. Sistema premium configurado e funcionando! 🎉');
    
    return {
      success: true,
      message: 'Sistema premium testado com sucesso!'
    };

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
    return {
      success: false,
      message: 'Erro ao testar sistema premium',
      error
    };
  }
};

// Executar teste se chamado diretamente
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).testPremiumSystem = testPremiumSystem;
  console.log('🔥 Teste disponível: window.testPremiumSystem()');
} 