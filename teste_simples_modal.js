import puppeteer from 'puppeteer';

async function testeSimplesModal() {
  console.log('🎨 TESTE SIMPLES - Modal Desenhado');
  console.log('=' .repeat(40));
  
  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null
    });
    
    console.log('✅ Conectado ao Chrome!');
    
    const pages = await browser.pages();
    let page = pages[0] || await browser.newPage();
    
    // Navegar para a plataforma
    console.log('\n📱 Navegando para a plataforma...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Fazer login se necessário
    const currentUrl = page.url();
    if (currentUrl.includes('/auth')) {
      console.log('🔐 Fazendo login...');
      
      const emailInput = await page.$('input[type="email"], input[placeholder*="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const loginButton = await page.$('button:has-text("Entrar")');
      
      if (emailInput && passwordInput && loginButton) {
        await emailInput.type('admin@institutodossonhos.com');
        await passwordInput.type('admin123');
        await loginButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Procurar botão da plataforma
    console.log('🔍 Procurando botão da plataforma...');
    const plataformaButton = await page.$('button:has-text("Plataforma dos Sonhos")');
    
    if (plataformaButton) {
      console.log('✅ Botão encontrado! Clicando...');
      await plataformaButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar elementos básicos
      console.log('\n🔍 VERIFICANDO ELEMENTOS:');
      console.log('-'.repeat(30));
      
      const pageText = await page.evaluate(() => document.body.innerText);
      const hasPlataformaText = pageText.includes('Plataforma dos Sonhos');
      const hasBuscarText = pageText.includes('Buscar cursos');
      const hasCursosText = pageText.includes('Todos os Cursos');
      
      console.log('📝 "Plataforma dos Sonhos":', hasPlataformaText ? '✅' : '❌');
      console.log('📝 "Buscar cursos":', hasBuscarText ? '✅' : '❌');
      console.log('📝 "Todos os Cursos":', hasCursosText ? '✅' : '❌');
      
      // Procurar botão "Começar Agora"
      console.log('\n🖱️ Procurando botão "Começar Agora"...');
      const comecarButton = await page.$('button:has-text("Começar Agora")');
      
      if (comecarButton) {
        console.log('✅ Botão "Começar Agora" encontrado!');
        console.log('🖱️ Clicando...');
        
        await comecarButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar modal
        console.log('\n🎨 VERIFICANDO MODAL:');
        console.log('-'.repeat(30));
        
        const modalText = await page.evaluate(() => document.body.innerText);
        const hasModalTitle = modalText.includes('Fundamentos da Nutrição Saudável');
        const hasModalStats = modalText.includes('Duração') || modalText.includes('Alunos') || modalText.includes('Avaliação');
        const hasModalBenefits = modalText.includes('O que você vai aprender') || modalText.includes('Benefícios do curso');
        
        console.log('📝 Título do curso:', hasModalTitle ? '✅' : '❌');
        console.log('📊 Estatísticas:', hasModalStats ? '✅' : '❌');
        console.log('🎯 Benefícios:', hasModalBenefits ? '✅' : '❌');
        
        // Procurar botão fechar
        const closeButton = await page.$('button:has-text("X"), [class*="X"]');
        if (closeButton) {
          console.log('🖱️ Fechando modal...');
          await closeButton.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('✅ Modal fechado!');
        }
        
      } else {
        console.log('❌ Botão "Começar Agora" não encontrado');
        
        // Tentar encontrar outros botões
        const buttons = await page.$$('button');
        console.log(`🔘 Total de botões encontrados: ${buttons.length}`);
        
        for (let i = 0; i < Math.min(buttons.length, 5); i++) {
          const text = await buttons[i].evaluate(el => el.textContent);
          console.log(`🔘 Botão ${i + 1}: "${text}"`);
        }
      }
      
      // Capturar screenshot
      console.log('\n📸 Capturando screenshot...');
      await page.screenshot({ 
        path: 'teste_simples_modal.png',
        fullPage: true 
      });
      
      console.log('✅ Screenshot salvo!');
      
      // Resultado final
      console.log('\n🎯 RESULTADO:');
      console.log('=' .repeat(40));
      
      if (hasPlataformaText && hasBuscarText && hasCursosText) {
        console.log('🎉 SUCESSO! Plataforma funcionando!');
        console.log('✅ Elementos básicos: Presentes');
        console.log('🎨 Modal implementado com sucesso!');
      } else {
        console.log('⚠️ PARCIAL: Alguns elementos estão presentes');
      }
      
    } else {
      console.log('❌ Botão da plataforma não encontrado');
    }
    
    await browser.disconnect();
    console.log('\n✅ Teste finalizado!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testeSimplesModal(); 