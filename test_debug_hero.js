import puppeteer from 'puppeteer';

async function testDebugHero() {
  console.log('🔍 Testando debug do Hero Carousel...');
  
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
      
      // 5. Verificar se o debug aparece
      console.log('🔍 Verificando debug...');
      
      const debugElement = await page.$('text="DEBUG: Hero Carousel deve aparecer aqui"');
      console.log('🔍 Debug encontrado:', debugElement ? '✅' : '❌');
      
      // 6. Verificar se há elementos do carrossel
      const carouselElements = await page.$$('[class*="carousel"], [class*="hero"], [class*="banner"], [class*="slide"]');
      console.log(`🎬 Elementos do carrossel: ${carouselElements.length}`);
      
      // 7. Listar todos os elementos da página
      const allElements = await page.$$('*');
      console.log(`📋 Total de elementos: ${allElements.length}`);
      
      // 8. Procurar por texto específico
      const pageText = await page.evaluate(() => document.body.innerText);
      console.log('📄 Texto da página (primeiros 500 chars):', pageText.substring(0, 500));
      
      // 9. Capturar screenshot
      console.log('📸 Capturando screenshot...');
      await page.screenshot({ 
        path: 'debug_hero_carousel.png',
        fullPage: true 
      });
      
      console.log('✅ Screenshot salvo como "debug_hero_carousel.png"');
      
    } else {
      console.log('❌ Botão "Plataforma dos Sonhos" não encontrado');
    }
    
    await browser.disconnect();
    console.log('✅ Desconectado do Chrome');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

testDebugHero(); 