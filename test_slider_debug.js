import { chromium } from 'playwright';

async function testSliderDebug() {
  console.log('🔍 Debugando slider...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    // 1. Acessar a página
    await page.goto('http://localhost:8083/sabotadores-demo');
    console.log('✅ Página carregada');
    
    // 2. Aguardar carregamento
    await page.waitForTimeout(3000);
    
    // 3. Verificar se estamos na primeira pergunta (slider)
    const questionText = await page.locator('h3').nth(1).textContent();
    console.log(`✅ Pergunta atual: "${questionText}"`);
    
    // 4. Verificar se há elementos de slider
    const sliderElements = await page.locator('input[type="range"]').count();
    console.log(`✅ ${sliderElements} sliders HTML encontrados`);
    
    // 5. Verificar se há elementos com role="slider"
    const sliderRoles = await page.locator('[role="slider"]').count();
    console.log(`✅ ${sliderRoles} elementos com role="slider"`);
    
    // 6. Verificar se há elementos com aria-valuemin
    const ariaMinElements = await page.locator('[aria-valuemin]').count();
    console.log(`✅ ${ariaMinElements} elementos com aria-valuemin`);
    
    // 7. Verificar se há elementos com aria-valuemax
    const ariaMaxElements = await page.locator('[aria-valuemax]').count();
    console.log(`✅ ${ariaMaxElements} elementos com aria-valuemax`);
    
    // 8. Verificar se há elementos com aria-valuenow
    const ariaNowElements = await page.locator('[aria-valuenow]').count();
    console.log(`✅ ${ariaNowElements} elementos com aria-valuenow`);
    
    // 9. Verificar se há elementos com data-orientation="horizontal"
    const horizontalElements = await page.locator('[data-orientation="horizontal"]').count();
    console.log(`✅ ${horizontalElements} elementos com data-orientation="horizontal"`);
    
    // 10. Verificar se há elementos com class que contenham "slider"
    const sliderClassElements = await page.locator('[class*="slider"]').count();
    console.log(`✅ ${sliderClassElements} elementos com class contendo "slider"`);
    
    // 11. Verificar se há elementos com class que contenham "thumb"
    const thumbElements = await page.locator('[class*="thumb"]').count();
    console.log(`✅ ${thumbElements} elementos com class contendo "thumb"`);
    
    // 12. Verificar se há elementos com class que contenham "track"
    const trackElements = await page.locator('[class*="track"]').count();
    console.log(`✅ ${trackElements} elementos com class contendo "track"`);
    
    // 13. Verificar se há elementos com class que contenham "range"
    const rangeElements = await page.locator('[class*="range"]').count();
    console.log(`✅ ${rangeElements} elementos com class contendo "range"`);
    
    // 14. Se houver sliders, tentar interagir
    if (sliderElements > 0) {
      console.log('🧪 Tentando interagir com o slider...');
      
      const slider = await page.locator('input[type="range"]:first');
      
      // Verificar valor atual
      const currentValue = await slider.getAttribute('value');
      console.log(`✅ Valor atual do slider: ${currentValue}`);
      
      // Verificar min e max
      const minValue = await slider.getAttribute('min');
      const maxValue = await slider.getAttribute('max');
      console.log(`✅ Range do slider: ${minValue} - ${maxValue}`);
      
      // Tentar mover o slider
      await slider.fill('5');
      console.log('✅ Slider movido para posição 5');
      
      await page.waitForTimeout(1000);
      
      // Verificar novo valor
      const newValue = await slider.getAttribute('value');
      console.log(`✅ Novo valor do slider: ${newValue}`);
    }
    
    // 15. Verificar se há labels do slider
    const minLabel = await page.locator('text=Nunca').count();
    const maxLabel = await page.locator('text=Sempre').count();
    console.log(`✅ Labels encontrados: Min=${minLabel}, Max=${maxLabel}`);
    
    // 16. Verificar se há números sendo exibidos
    const numbers = await page.locator('text=1, text=5, text=10').count();
    console.log(`✅ ${numbers} números encontrados`);
    
    // 17. Capturar screenshot
    await page.screenshot({ path: 'slider_debug.png', fullPage: true });
    console.log('📸 Screenshot salvo como slider_debug.png');
    
    console.log('\n🎉 DEBUG DO SLIDER COMPLETO!');
    console.log('\n📋 RESUMO:');
    console.log(`✅ ${sliderElements} sliders HTML`);
    console.log(`✅ ${sliderRoles} elementos com role="slider"`);
    console.log(`✅ ${ariaMinElements} elementos com aria-valuemin`);
    console.log(`✅ ${ariaMaxElements} elementos com aria-valuemax`);
    console.log(`✅ ${ariaNowElements} elementos com aria-valuenow`);
    console.log(`✅ ${horizontalElements} elementos horizontais`);
    console.log(`✅ ${sliderClassElements} elementos com class "slider"`);
    console.log(`✅ ${thumbElements} elementos com class "thumb"`);
    console.log(`✅ ${trackElements} elementos com class "track"`);
    console.log(`✅ ${rangeElements} elementos com class "range"`);
    
  } catch (error) {
    console.error('❌ Erro durante o debug:', error);
    await page.screenshot({ path: 'slider_debug_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testSliderDebug(); 