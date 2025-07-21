const { chromium } = require('playwright');

async function testSemanalButton() {
  console.log('🤖 Testando botão Semanal...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Acessar o dashboard
    console.log('🌐 Acessando dashboard...');
    await page.goto('http://localhost:8083/dashboard');
    await page.waitForTimeout(3000);
    
    // 2. Verificar se a página carregou
    const pageTitle = await page.title();
    console.log(`✅ Página carregada: ${pageTitle}`);
    
    // 3. Procurar o botão Semanal
    console.log('🔍 Procurando botão Semanal...');
    
    try {
      await page.waitForSelector('text=📊 Semanal', { timeout: 5000 });
      console.log('✅ Botão Semanal encontrado!');
      
      // 4. Clicar no botão Semanal
      console.log('🖱️ Clicando no botão Semanal...');
      await page.click('text=📊 Semanal');
      await page.waitForTimeout(2000);
      
      // 5. Verificar se a página de avaliação semanal carregou
      console.log('📊 Verificando se a avaliação semanal carregou...');
      await page.waitForSelector('text=Avaliação Semanal', { timeout: 5000 });
      console.log('✅ Página de avaliação semanal carregou!');
      
      // 6. Verificar se há campos para preencher
      console.log('📝 Verificando campos da avaliação...');
      await page.waitForSelector('text=Aprendizado da Semana', { timeout: 5000 });
      console.log('✅ Campos de avaliação encontrados!');
      
      // 7. Testar preenchimento de um campo
      console.log('✏️ Testando preenchimento...');
      await page.fill('textarea', 'Esta semana foi muito produtiva!');
      console.log('✅ Campo preenchido com sucesso!');
      
      console.log('🎉 Teste do botão Semanal concluído com sucesso!');
      
    } catch (error) {
      console.log('❌ Botão Semanal não encontrado:', error.message);
      
      // Verificar se há outros botões na página
      const buttons = await page.$$('button');
      console.log(`🔍 Encontrados ${buttons.length} botões na página`);
      
      for (let i = 0; i < buttons.length; i++) {
        const buttonText = await buttons[i].textContent();
        console.log(`Botão ${i + 1}: ${buttonText}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    
    // Capturar screenshot em caso de erro
    await page.screenshot({ 
      path: 'error_semanal_test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot salvo como error_semanal_test.png');
  } finally {
    await browser.close();
  }
}

// Executar o teste
testSemanalButton().catch(console.error); 