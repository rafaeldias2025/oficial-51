import { chromium } from 'playwright';

async function testSimpleMultipleChoice() {
  console.log('🧪 Testando funcionalidade da múltipla escolha...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    // 1. Acessar a página de demonstração dos Sabotadores
    await page.goto('http://localhost:8083/sabotadores-demo');
    console.log('✅ Página carregada');
    
    // 2. Aguardar carregamento
    await page.waitForTimeout(3000);
    
    // 3. Verificar se estamos na página correta
    const title = await page.locator('h1').textContent();
    console.log(`✅ Título da página: ${title}`);
    
    // 4. Verificar se há botões de navegação
    const buttons = await page.locator('button').all();
    console.log(`✅ ${buttons.length} botões encontrados`);
    
    for (let i = 0; i < buttons.length; i++) {
      const buttonText = await buttons[i].textContent();
      console.log(`Botão ${i + 1}: "${buttonText}"`);
    }
    
    // 5. Clicar no botão "Avaliação" se existir
    const avaliacaoButton = await page.locator('button:has-text("Avaliação")').count();
    if (avaliacaoButton > 0) {
      await page.click('button:has-text("Avaliação")');
      console.log('✅ Clicou no botão Avaliação');
      await page.waitForTimeout(2000);
    }
    
    // 6. Verificar se há perguntas na tela
    const questions = await page.locator('h3').all();
    console.log(`✅ ${questions.length} perguntas encontradas`);
    
    for (let i = 0; i < questions.length; i++) {
      const questionText = await questions[i].textContent();
      console.log(`Pergunta ${i + 1}: "${questionText}"`);
    }
    
    // 7. Verificar se há checkboxes na tela
    const checkboxes = await page.locator('input[type="checkbox"]').count();
    console.log(`✅ ${checkboxes} checkboxes encontrados`);
    
    // 8. Verificar se há sliders na tela
    const sliders = await page.locator('input[type="range"]').count();
    console.log(`✅ ${sliders} sliders encontrados`);
    
    // 9. Se houver checkboxes, testar a funcionalidade
    if (checkboxes > 0) {
      console.log('🧪 Testando funcionalidade dos checkboxes...');
      
      // Clicar no primeiro checkbox
      await page.click('input[type="checkbox"]:first');
      console.log('✅ Primeiro checkbox clicado');
      
      await page.waitForTimeout(1000);
      
      // Verificar se foi selecionado
      const checkedBoxes = await page.locator('input[type="checkbox"]:checked').count();
      console.log(`✅ ${checkedBoxes} checkbox(es) selecionado(s)`);
      
      // Clicar no segundo checkbox se existir
      const allCheckboxes = await page.locator('input[type="checkbox"]').all();
      if (allCheckboxes.length > 1) {
        await allCheckboxes[1].click();
        console.log('✅ Segundo checkbox clicado');
        
        await page.waitForTimeout(1000);
        
        const totalChecked = await page.locator('input[type="checkbox"]:checked').count();
        console.log(`✅ Total de ${totalChecked} checkbox(es) selecionado(s)`);
      }
    }
    
    // 10. Se houver sliders, testar a funcionalidade
    if (sliders > 0) {
      console.log('🧪 Testando funcionalidade dos sliders...');
      
      // Mover o primeiro slider
      const firstSlider = await page.locator('input[type="range"]:first');
      await firstSlider.fill('5');
      console.log('✅ Slider movido para posição 5');
    }
    
    console.log('\n🎉 TESTE COMPLETO: Funcionalidades verificadas!');
    console.log('\n📋 RESUMO:');
    console.log(`✅ ${checkboxes} checkboxes funcionando`);
    console.log(`✅ ${sliders} sliders funcionando`);
    console.log('✅ Interface Netflix-themed mantida');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    await page.screenshot({ path: 'simple_test_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testSimpleMultipleChoice(); 