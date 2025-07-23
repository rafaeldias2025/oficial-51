import puppeteer from 'puppeteer';

async function testeFinalHeroCarousel() {
  console.log('🎬 TESTE FINAL - Hero Carousel Netflix na Plataforma dos Sonhos');
  console.log('=' .repeat(60));
  
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
      // 4. Clicar no botão com verificação de visibilidade
      console.log('🖱️ Clicando no botão "Plataforma dos Sonhos"...');
      
      // Verificar se o botão está visível
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
      
      // 5. Verificar elementos do Hero Carousel
      console.log('\n🔍 VERIFICANDO ELEMENTOS DO HERO CAROUSEL:');
      console.log('-'.repeat(40));
      
      // Verificar elementos específicos
      const debugElement = await page.$('text="DEBUG: Hero Carousel deve aparecer aqui"');
      const gradientElements = await page.$$('[class*="gradient"]');
      const purpleElements = await page.$$('[class*="purple"]');
      const blueElements = await page.$$('[class*="blue"]');
      const redElements = await page.$$('[class*="red"]');
      
      console.log('🔍 Debug encontrado:', debugElement ? '✅' : '❌');
      console.log('🎨 Elementos com gradiente:', gradientElements.length);
      console.log('🟣 Elementos roxos:', purpleElements.length);
      console.log('🔵 Elementos azuis:', blueElements.length);
      console.log('🔴 Elementos vermelhos:', redElements.length);
      
      // 6. Verificar texto específico
      console.log('\n📄 VERIFICANDO TEXTOS:');
      console.log('-'.repeat(40));
      
      const pageText = await page.evaluate(() => document.body.innerText);
      const hasTransformText = pageText.includes('Transforme seus Sonhos em Realidade');
      const hasChavesText = pageText.includes('7 Chaves para o Sucesso');
      const hasChasText = pageText.includes('12 Chás da Transformação');
      const hasComecarText = pageText.includes('Começar Jornada');
      
      console.log('📝 "Transforme seus Sonhos em Realidade":', hasTransformText ? '✅' : '❌');
      console.log('📝 "7 Chaves para o Sucesso":', hasChavesText ? '✅' : '❌');
      console.log('📝 "12 Chás da Transformação":', hasChasText ? '✅' : '❌');
      console.log('📝 "Começar Jornada":', hasComecarText ? '✅' : '❌');
      
      // 7. Verificar estrutura visual
      console.log('\n🎨 VERIFICANDO ESTRUTURA VISUAL:');
      console.log('-'.repeat(40));
      
      const heroSection = await page.$('[class*="h-[500px]"]');
      const roundedElements = await page.$('[class*="rounded-xl"]');
      const overflowElements = await page.$('[class*="overflow-hidden"]');
      
      console.log('📐 Seção Hero (500px):', heroSection ? '✅' : '❌');
      console.log('🔵 Elementos arredondados:', roundedElements ? '✅' : '❌');
      console.log('📦 Elementos com overflow:', overflowElements ? '✅' : '❌');
      
      // 8. Capturar screenshot
      console.log('\n📸 CAPTURANDO SCREENSHOT...');
      await page.screenshot({ 
        path: 'teste_final_hero_carousel.png',
        fullPage: true 
      });
      
      console.log('✅ Screenshot salvo como "teste_final_hero_carousel.png"');
      
      // 9. Resultado final
      console.log('\n🎯 RESULTADO FINAL:');
      console.log('=' .repeat(60));
      
      const totalElements = gradientElements.length + purpleElements.length + blueElements.length + redElements.length;
      const hasTexts = hasTransformText || hasChavesText || hasChasText;
      const hasVisualElements = heroSection || roundedElements || overflowElements;
      
      if (totalElements > 0 && hasTexts && hasVisualElements) {
        console.log('🎉 SUCESSO! Hero Carousel Netflix implementado corretamente!');
        console.log('✅ Elementos visuais: Presentes');
        console.log('✅ Textos: Presentes');
        console.log('✅ Estrutura: Correta');
        console.log('🎬 A plataforma dos sonhos agora tem estilo Netflix!');
      } else {
        console.log('⚠️  PARCIAL: Alguns elementos estão presentes, mas pode precisar de ajustes');
        console.log('📋 Elementos encontrados:', totalElements);
        console.log('📝 Textos encontrados:', hasTexts ? 'Sim' : 'Não');
        console.log('🎨 Estrutura visual:', hasVisualElements ? 'Sim' : 'Não');
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

testeFinalHeroCarousel(); 