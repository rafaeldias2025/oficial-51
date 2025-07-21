import { chromium } from 'playwright';

async function debugSabotadoresPage() {
  console.log('🔍 Debugando página dos Sabotadores...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // 1. Acessar a página
    await page.goto('http://localhost:8083/sabotadores-demo');
    console.log('✅ Página carregada');
    
    // 2. Aguardar um pouco para a página carregar completamente
    await page.waitForTimeout(5000);
    
    // 3. Verificar se há algum botão na página
    const allButtons = await page.locator('button').all();
    console.log(`📋 Total de botões encontrados: ${allButtons.length}`);
    
    for (let i = 0; i < allButtons.length; i++) {
      const buttonText = await allButtons[i].textContent();
      console.log(`Botão ${i + 1}: "${buttonText}"`);
    }
    
    // 4. Verificar se há algum texto relacionado a "Sabotadores"
    const sabotadoresText = await page.locator('text=Sabotadores').count();
    console.log(`📋 Textos com "Sabotadores" encontrados: ${sabotadoresText}`);
    
    // 5. Verificar se há algum texto relacionado a "Iniciar"
    const iniciarText = await page.locator('text=Iniciar').count();
    console.log(`📋 Textos com "Iniciar" encontrados: ${iniciarText}`);
    
    // 6. Verificar se há algum texto relacionado a "Avaliação"
    const avaliacaoText = await page.locator('text=Avaliação').count();
    console.log(`📋 Textos com "Avaliação" encontrados: ${avaliacaoText}`);
    
    // 7. Verificar se há algum texto relacionado a "Começar"
    const comecarText = await page.locator('text=Começar').count();
    console.log(`📋 Textos com "Começar" encontrados: ${comecarText}`);
    
    // 8. Verificar se há algum texto relacionado a "Start"
    const startText = await page.locator('text=Start').count();
    console.log(`📋 Textos com "Start" encontrados: ${startText}`);
    
    // 9. Capturar screenshot da página
    await page.screenshot({ path: 'debug_sabotadores_page.png', fullPage: true });
    console.log('📸 Screenshot salvo como debug_sabotadores_page.png');
    
    // 10. Verificar se há erros no console
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
      console.log('📝 Console:', msg.text());
    });
    
    // 11. Aguardar mais um pouco para capturar mensagens do console
    await page.waitForTimeout(2000);
    
    if (consoleMessages.length > 0) {
      console.log('📋 Mensagens do console:', consoleMessages);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o debug:', error);
    await page.screenshot({ path: 'debug_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

debugSabotadoresPage(); 