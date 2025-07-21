import { chromium } from 'playwright';

async function testButtonFunctionality() {
  console.log('🧪 Testando funcionalidade do botão "Criar Sabotadores"...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // Acessar a página
    await page.goto('http://localhost:8083/admin/tools');
    console.log('✅ Página carregada');
    
    // Aguardar o botão aparecer
    await page.waitForSelector('button:has-text("Criar Sabotadores")', { timeout: 10000 });
    console.log('✅ Botão "Criar Sabotadores" encontrado');
    
    // Clicar no botão
    await page.click('button:has-text("Criar Sabotadores")');
    console.log('✅ Botão clicado');
    
    // Aguardar um pouco para ver se há algum erro
    await page.waitForTimeout(3000);
    
    // Verificar se há mensagens de erro no console
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
      console.log('📝 Console:', msg.text());
    });
    
    // Verificar se a ferramenta foi criada (procurar por "Sabotadores do Emagrecimento" na lista)
    const toolExists = await page.locator('text=Sabotadores do Emagrecimento').count() > 0;
    
    if (toolExists) {
      console.log('🎉 SUCCESS: Ferramenta "Sabotadores do Emagrecimento" foi criada com sucesso!');
    } else {
      console.log('⚠️  Ferramenta não encontrada na lista. Verificando logs...');
      
      // Verificar se há erros
      const errorMessages = consoleMessages.filter(msg => 
        msg.includes('error') || msg.includes('Error') || msg.includes('❌')
      );
      
      if (errorMessages.length > 0) {
        console.log('❌ Erros encontrados:', errorMessages);
      } else {
        console.log('ℹ️  Nenhum erro encontrado no console');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    await page.screenshot({ path: 'button_test_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testButtonFunctionality(); 