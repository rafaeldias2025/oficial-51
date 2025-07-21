import { chromium } from 'playwright';

async function testCheckboxDebug() {
  console.log('🔍 Debugando checkboxes...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    // 1. Acessar a página
    await page.goto('http://localhost:8083/sabotadores-demo');
    console.log('✅ Página carregada');
    
    // 2. Aguardar carregamento
    await page.waitForTimeout(3000);
    
    // 3. Verificar se estamos na aba de avaliação
    const assessmentTab = await page.locator('button[role="tab"]:has-text("Avaliação")').count();
    console.log(`✅ ${assessmentTab} aba(s) de avaliação encontrada(s)`);
    
    // 4. Se não estiver na aba de avaliação, clicar nela
    if (assessmentTab > 0) {
      await page.click('button[role="tab"]:has-text("Avaliação")');
      console.log('✅ Clicou na aba Avaliação');
      await page.waitForTimeout(2000);
    }
    
    // 5. Verificar se há elementos de input na página
    const allInputs = await page.locator('input').count();
    console.log(`✅ ${allInputs} inputs encontrados`);
    
    // 6. Verificar tipos específicos de input
    const checkboxes = await page.locator('input[type="checkbox"]').count();
    const radios = await page.locator('input[type="radio"]').count();
    const ranges = await page.locator('input[type="range"]').count();
    const texts = await page.locator('input[type="text"]').count();
    
    console.log(`📋 Tipos de input encontrados:`);
    console.log(`- Checkboxes: ${checkboxes}`);
    console.log(`- Radios: ${radios}`);
    console.log(`- Ranges: ${ranges}`);
    console.log(`- Texts: ${texts}`);
    
    // 7. Verificar se há elementos com role="checkbox"
    const checkboxRoles = await page.locator('[role="checkbox"]').count();
    console.log(`✅ ${checkboxRoles} elementos com role="checkbox"`);
    
    // 8. Verificar se há elementos com data-state
    const dataStateElements = await page.locator('[data-state]').count();
    console.log(`✅ ${dataStateElements} elementos com data-state`);
    
    // 9. Verificar se há elementos com aria-checked
    const ariaCheckedElements = await page.locator('[aria-checked]').count();
    console.log(`✅ ${ariaCheckedElements} elementos com aria-checked`);
    
    // 10. Verificar se há elementos que parecem checkboxes
    const checkboxLikeElements = await page.locator('input[type="checkbox"], [role="checkbox"], [data-state="checked"], [data-state="unchecked"]').count();
    console.log(`✅ ${checkboxLikeElements} elementos que parecem checkboxes`);
    
    // 11. Se houver checkboxes, tentar clicar
    if (checkboxes > 0) {
      console.log('🧪 Tentando clicar nos checkboxes...');
      
      for (let i = 0; i < checkboxes; i++) {
        try {
          await page.locator('input[type="checkbox"]').nth(i).click();
          console.log(`✅ Checkbox ${i + 1} clicado`);
          await page.waitForTimeout(500);
        } catch (error) {
          console.log(`❌ Erro ao clicar no checkbox ${i + 1}:`, error.message);
        }
      }
    }
    
    // 12. Verificar se há elementos clicáveis que podem ser checkboxes
    const clickableElements = await page.locator('button, input, [role="button"], [tabindex]').count();
    console.log(`✅ ${clickableElements} elementos clicáveis encontrados`);
    
    // 13. Capturar screenshot
    await page.screenshot({ path: 'checkbox_debug.png', fullPage: true });
    console.log('📸 Screenshot salvo como checkbox_debug.png');
    
    console.log('\n🎉 DEBUG COMPLETO!');
    console.log('\n📋 RESUMO:');
    console.log(`✅ ${checkboxes} checkboxes HTML`);
    console.log(`✅ ${checkboxRoles} elementos com role="checkbox"`);
    console.log(`✅ ${dataStateElements} elementos com data-state`);
    console.log(`✅ ${ariaCheckedElements} elementos com aria-checked`);
    
  } catch (error) {
    console.error('❌ Erro durante o debug:', error);
    await page.screenshot({ path: 'checkbox_debug_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testCheckboxDebug(); 