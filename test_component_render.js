import { chromium } from 'playwright';

async function testComponentRender() {
  console.log('🔍 Testando renderização do componente...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    // 1. Acessar a página
    await page.goto('http://localhost:8083/sabotadores-demo');
    console.log('✅ Página carregada');
    
    // 2. Aguardar carregamento
    await page.waitForTimeout(3000);
    
    // 3. Verificar se o título está presente
    const title = await page.locator('h1:has-text("Sabotadores do Emagrecimento")').count();
    console.log(`✅ ${title} título(s) encontrado(s)`);
    
    // 4. Verificar se há tabs
    const tabs = await page.locator('[role="tab"]').count();
    console.log(`✅ ${tabs} tabs encontradas`);
    
    // 5. Verificar se há conteúdo na aba de avaliação
    const assessmentContent = await page.locator('[data-state="active"]').count();
    console.log(`✅ ${assessmentContent} aba(s) ativa(s)`);
    
    // 6. Verificar se há perguntas sendo exibidas
    const questions = await page.locator('h3').all();
    console.log(`✅ ${questions.length} elementos h3 encontrados`);
    
    for (let i = 0; i < questions.length; i++) {
      const questionText = await questions[i].textContent();
      console.log(`H3 ${i + 1}: "${questionText}"`);
    }
    
    // 7. Verificar se há botões de navegação
    const navButtons = await page.locator('button').all();
    console.log(`✅ ${navButtons.length} botões encontrados`);
    
    for (let i = 0; i < navButtons.length; i++) {
      const buttonText = await navButtons[i].textContent();
      console.log(`Botão ${i + 1}: "${buttonText}"`);
    }
    
    // 8. Verificar se há elementos de progresso
    const progressElements = await page.locator('[role="progressbar"]').count();
    console.log(`✅ ${progressElements} elementos de progresso encontrados`);
    
    // 9. Verificar se há elementos de formulário
    const formElements = await page.locator('form, [role="form"]').count();
    console.log(`✅ ${formElements} elementos de formulário encontrados`);
    
    // 10. Verificar se há elementos com data-* attributes
    const dataElements = await page.locator('[data-*]').count();
    console.log(`✅ ${dataElements} elementos com data-* attributes`);
    
    // 11. Verificar se há elementos com aria-* attributes
    const ariaElements = await page.locator('[aria-*]').count();
    console.log(`✅ ${ariaElements} elementos com aria-* attributes`);
    
    // 12. Verificar se há elementos com class que contenham "question"
    const questionElements = await page.locator('[class*="question"]').count();
    console.log(`✅ ${questionElements} elementos com class contendo "question"`);
    
    // 13. Verificar se há elementos com class que contenham "scale"
    const scaleElements = await page.locator('[class*="scale"]').count();
    console.log(`✅ ${scaleElements} elementos com class contendo "scale"`);
    
    // 14. Verificar se há elementos com class que contenham "multiple"
    const multipleElements = await page.locator('[class*="multiple"]').count();
    console.log(`✅ ${multipleElements} elementos com class contendo "multiple"`);
    
    // 15. Capturar screenshot
    await page.screenshot({ path: 'component_render.png', fullPage: true });
    console.log('📸 Screenshot salvo como component_render.png');
    
    // 16. Verificar console por erros
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
      if (msg.type() === 'error') {
        console.log('❌ Erro no console:', msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    console.log('\n🎉 TESTE DE RENDERIZAÇÃO COMPLETO!');
    console.log('\n📋 RESUMO:');
    console.log(`✅ ${title} título(s) renderizado(s)`);
    console.log(`✅ ${tabs} tabs funcionando`);
    console.log(`✅ ${questions.length} elementos de conteúdo`);
    console.log(`✅ ${navButtons.length} botões de navegação`);
    console.log(`✅ ${progressElements} elementos de progresso`);
    
    if (consoleMessages.length > 0) {
      console.log(`📝 ${consoleMessages.length} mensagens no console`);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    await page.screenshot({ path: 'component_render_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testComponentRender(); 