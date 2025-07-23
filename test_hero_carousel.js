import puppeteer from 'puppeteer';

async function testHeroCarousel() {
  console.log('🎬 Testando Hero Carousel na Plataforma dos Sonhos...');
  
  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null
    });
    
    console.log('✅ Conectado ao Chrome existente!');
    
    const pages = await browser.pages();
    let page = pages[0] || await browser.newPage();
    
    // 1. Navegar para a plataforma dos sonhos
    console.log('📱 Navegando para http://localhost:5173/dashboard...');
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
      await plataformaButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 5. Verificar se o Hero Carousel está presente
      console.log('🔍 Verificando Hero Carousel...');
      
      // Procurar por elementos do carrossel
      const carousel = await page.$('[class*="carousel"], [class*="hero"], [class*="banner"]');
      const carouselTitle = await page.$('text="Transforme seus Sonhos em Realidade"');
      const carouselDescription = await page.$('text="Descubra o poder da transformação"');
      const ctaButton = await page.$('text="Começar Jornada"');
      
      console.log('🔍 Elementos do Hero Carousel:');
      console.log('  - Carrossel encontrado:', carousel ? '✅' : '❌');
      console.log('  - Título encontrado:', carouselTitle ? '✅' : '❌');
      console.log('  - Descrição encontrada:', carouselDescription ? '✅' : '❌');
      console.log('  - Botão CTA encontrado:', ctaButton ? '✅' : '❌');
      
      // 6. Capturar screenshot
      console.log('📸 Capturando screenshot do Hero Carousel...');
      await page.screenshot({ 
        path: 'hero_carousel_plataforma_sonhos.png',
        fullPage: true 
      });
      
      console.log('✅ Screenshot salvo como "hero_carousel_plataforma_sonhos.png"');
      
      // 7. Listar elementos da página
      console.log('🔍 Elementos encontrados na página:');
      const allButtons = await page.$$('button');
      const allTexts = await page.$$('h1, h2, h3, p');
      
      console.log(`📋 Botões: ${allButtons.length}`);
      console.log(`📋 Textos: ${allTexts.length}`);
      
      // Verificar se há elementos do carrossel
      const carouselElements = await page.$$('[class*="carousel"], [class*="hero"], [class*="banner"], [class*="slide"]');
      console.log(`🎬 Elementos do carrossel: ${carouselElements.length}`);
      
      if (carouselElements.length > 0) {
        console.log('🎉 Hero Carousel implementado com sucesso!');
      } else {
        console.log('❌ Hero Carousel não encontrado');
      }
      
    } else {
      console.log('❌ Botão "Plataforma dos Sonhos" não encontrado');
    }
    
    await browser.disconnect();
    console.log('✅ Desconectado do Chrome');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

testHeroCarousel(); 