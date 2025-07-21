import { chromium } from 'playwright';

async function debugPageContent() {
  console.log('🔍 Debugando conteúdo da página...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // Acessar a página
    await page.goto('http://localhost:8083/admin/tools');
    console.log('✅ Página carregada');
    
    // Aguardar um pouco para a página carregar completamente
    await page.waitForTimeout(5000);
    
    // Verificar se há algum botão na página
    const allButtons = await page.locator('button').all();
    console.log(`📋 Total de botões encontrados: ${allButtons.length}`);
    
    for (let i = 0; i < allButtons.length; i++) {
      const buttonText = await allButtons[i].textContent();
      console.log(`Botão ${i + 1}: "${buttonText}"`);
    }
    
    // Verificar se há algum texto relacionado a "Sabotadores"
    const sabotadoresText = await page.locator('text=Sabotadores').count();
    console.log(`📋 Textos com "Sabotadores" encontrados: ${sabotadoresText}`);
    
    // Verificar se há algum texto relacionado a "Criar"
    const criarText = await page.locator('text=Criar').count();
    console.log(`📋 Textos com "Criar" encontrados: ${criarText}`);
    
    // Verificar se há algum texto relacionado a "Ferramentas"
    const ferramentasText = await page.locator('text=Ferramentas').count();
    console.log(`📋 Textos com "Ferramentas" encontrados: ${ferramentasText}`);
    
    // Capturar screenshot da página
    await page.screenshot({ path: 'debug_page_content.png', fullPage: true });
    console.log('📸 Screenshot salvo como debug_page_content.png');
    
    // Verificar se há erros no console
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
      console.log('📝 Console:', msg.text());
    });
    
    // Aguardar mais um pouco para capturar mensagens do console
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

debugPageContent(); 