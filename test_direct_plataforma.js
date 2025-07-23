import puppeteer from 'puppeteer';

async function testDirectPlataforma() {
  console.log('🎬 Testando acesso direto à Plataforma dos Sonhos...');
  
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
    
    // 1. Acessar diretamente a página da plataforma
    console.log('📱 Navegando para http://localhost:5173/plataforma-sonhos...');
    await page.goto('http://localhost:5173/plataforma-sonhos', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log('🔗 URL atual:', currentUrl);
    
    // 2. Verificar se o debug aparece
    console.log('🔍 Verificando debug...');
    
    const debugElement = await page.$('text="DEBUG: Hero Carousel deve aparecer aqui"');
    console.log('🔍 Debug encontrado:', debugElement ? '✅' : '❌');
    
    // 3. Verificar se há elementos do carrossel
    const carouselElements = await page.$$('[class*="carousel"], [class*="hero"], [class*="banner"], [class*="slide"]');
    console.log(`🎬 Elementos do carrossel: ${carouselElements.length}`);
    
    // 4. Procurar por texto específico
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('📄 Texto da página (primeiros 500 chars):', pageText.substring(0, 500));
    
    // 5. Verificar se há elementos com gradiente (nosso carrossel simplificado)
    const gradientElements = await page.$$('[class*="gradient"]');
    console.log(`🎨 Elementos com gradiente: ${gradientElements.length}`);
    
    // 6. Capturar screenshot
    console.log('📸 Capturando screenshot...');
    await page.screenshot({ 
      path: 'direct_plataforma_sonhos.png',
      fullPage: true 
    });
    
    console.log('✅ Screenshot salvo como "direct_plataforma_sonhos.png"');
    
    await browser.disconnect();
    console.log('✅ Desconectado do Chrome');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

testDirectPlataforma(); 