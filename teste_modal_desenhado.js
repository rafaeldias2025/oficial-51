import puppeteer from 'puppeteer';

async function testeModalDesenhado() {
  console.log('🎨 TESTE - Modal Desenhado na Plataforma dos Sonhos');
  console.log('=' .repeat(50));
  
  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null
    });
    
    console.log('✅ Conectado ao Chrome existente!');
    
    const pages = await browser.pages();
    let page = pages[0] || await browser.newPage();
    
    // Capturar logs do console
    page.on('console', msg => console.log('📱 Console:', msg.text()));
    page.on('pageerror', error => console.log('❌ Erro:', error.message));
    
    // 1. Navegar para a plataforma dos sonhos
    console.log('\n📱 Navegando para http://localhost:5173/dashboard...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 2. Fazer login se necessário
    const currentUrl = page.url();
    if (currentUrl.includes('/auth')) {
      console.log('🔐 Fazendo login...');
      
      const emailInput = await page.$('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]');
      const passwordInput = await page.$('input[type="password"]');
      const buttons = await page.$$('button');
      let loginButton = null;
      
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && text.includes('Entrar')) {
          loginButton = button;
          break;
        }
      }
      
      if (emailInput && passwordInput && loginButton) {
        await emailInput.type('admin@institutodossonhos.com');
        await passwordInput.type('admin123');
        await loginButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // 3. Procurar e clicar no botão "Plataforma dos Sonhos"
    console.log('🔍 Procurando pelo botão "Plataforma dos Sonhos"...');
    const buttons = await page.$$('button');
    let plataformaButton = null;
    
    for (const button of buttons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && text.includes('Plataforma dos Sonhos')) {
        plataformaButton = button;
        console.log('✅ Encontrou o botão "Plataforma dos Sonhos"!');
        break;
      }
    }
    
    if (plataformaButton) {
      // 4. Clicar no botão
      console.log('🖱️ Clicando no botão "Plataforma dos Sonhos"...');
      
      const isVisible = await plataformaButton.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      
      if (isVisible) {
        await plataformaButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.log('⚠️ Botão não está visível, tentando scroll...');
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(resolve => setTimeout(resolve, 1000));
        await plataformaButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // 5. Verificar elementos da plataforma
      console.log('\n🔍 VERIFICANDO ELEMENTOS DA PLATAFORMA:');
      console.log('-'.repeat(40));
      
      const heroSection = await page.$('[class*="h-[500px]"]');
      const searchInput = await page.$('input[placeholder*="Buscar"]');
      const filterButtons = await page.$$('button');
      const courseCards = await page.$$('[class*="bg-gray-800"]');
      
      console.log('🎬 Hero Section (500px):', heroSection ? '✅' : '❌');
      console.log('🔍 Campo de busca:', searchInput ? '✅' : '❌');
      console.log('🔘 Botões de filtro:', filterButtons.length);
      console.log('📚 Cards de cursos:', courseCards.length);
      
      // 6. Testar clique no botão "Começar Agora"
      console.log('\n🖱️ TESTANDO BOTÃO "COMEÇAR AGORA":');
      console.log('-'.repeat(40));
      
      const comecarButton = await page.$('text="Começar Agora"');
      if (comecarButton) {
        console.log('✅ Botão "Começar Agora" encontrado!');
        console.log('🖱️ Clicando no botão...');
        
        await comecarButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 7. Verificar se o modal apareceu
        console.log('\n🎨 VERIFICANDO MODAL:');
        console.log('-'.repeat(40));
        
        const modal = await page.$('[class*="fixed inset-0"]');
        const modalTitle = await page.$('text="Fundamentos da Nutrição Saudável"');
        const modalStats = await page.$$('[class*="bg-gradient-to-br"]');
        const closeButton = await page.$('[class*="X"]');
        
        console.log('🎨 Modal presente:', modal ? '✅' : '❌');
        console.log('📝 Título do curso:', modalTitle ? '✅' : '❌');
        console.log('📊 Estatísticas:', modalStats.length);
        console.log('❌ Botão fechar:', closeButton ? '✅' : '❌');
        
        // 8. Testar fechamento do modal
        if (closeButton) {
          console.log('🖱️ Fechando modal...');
          await closeButton.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const modalClosed = await page.$('[class*="fixed inset-0"]');
          console.log('✅ Modal fechado:', !modalClosed ? '✅' : '❌');
        }
        
        // 9. Testar clique nos cards de cursos
        console.log('\n🖱️ TESTANDO CARDS DE CURSOS:');
        console.log('-'.repeat(40));
        
        const firstCourseCard = courseCards[0];
        if (firstCourseCard) {
          console.log('🖱️ Clicando no primeiro card de curso...');
          await firstCourseCard.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const modalAfterCard = await page.$('[class*="fixed inset-0"]');
          console.log('🎨 Modal após clique no card:', modalAfterCard ? '✅' : '❌');
        }
        
      } else {
        console.log('❌ Botão "Começar Agora" não encontrado');
      }
      
      // 10. Capturar screenshot
      console.log('\n📸 CAPTURANDO SCREENSHOT...');
      await page.screenshot({ 
        path: 'teste_modal_desenhado.png',
        fullPage: true 
      });
      
      console.log('✅ Screenshot salvo como "teste_modal_desenhado.png"');
      
      // 11. Resultado final
      console.log('\n🎯 RESULTADO FINAL:');
      console.log('=' .repeat(50));
      
      const hasHero = heroSection !== null;
      const hasSearch = searchInput !== null;
      const hasFilters = filterButtons.length > 0;
      const hasCourses = courseCards.length > 0;
      const hasModal = modal !== null;
      
      if (hasHero && hasSearch && hasFilters && hasCourses && hasModal) {
        console.log('🎉 SUCESSO! Modal desenhado implementado corretamente!');
        console.log('✅ Hero Section: Funcionando');
        console.log('✅ Busca e filtros: Funcionando');
        console.log('✅ Cards de cursos: Funcionando');
        console.log('✅ Modal desenhado: Funcionando');
        console.log('🎨 A plataforma agora tem um modal moderno e elegante!');
      } else {
        console.log('⚠️ PARCIAL: Alguns elementos estão funcionando');
        console.log('📋 Hero:', hasHero ? '✅' : '❌');
        console.log('📋 Busca:', hasSearch ? '✅' : '❌');
        console.log('📋 Filtros:', hasFilters ? '✅' : '❌');
        console.log('📋 Cursos:', hasCourses ? '✅' : '❌');
        console.log('📋 Modal:', hasModal ? '✅' : '❌');
      }
      
    } else {
      console.log('❌ Botão "Plataforma dos Sonhos" não encontrado');
    }
    
    await browser.disconnect();
    console.log('\n✅ Teste finalizado - Desconectado do Chrome');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

testeModalDesenhado(); 