import { chromium } from 'playwright';

async function testLixeiraSabotadores() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Testando sistema de lixeira de segurança...');
    
    // Navegar para a página dos sabotadores
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(2000);
    
    // Verificar se o botão da lixeira está visível
    const lixeiraButton = await page.locator('button:has-text("Lixeira")');
    const lixeiraVisible = await lixeiraButton.isVisible();
    console.log(`${lixeiraVisible ? '✅' : '❌'} Botão da lixeira visível`);
    
    // Clicar no botão da lixeira
    await lixeiraButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar se a interface da lixeira aparece
    const lixeiraInterface = await page.locator('text="Lixeira de Segurança"');
    const interfaceVisible = await lixeiraInterface.isVisible();
    console.log(`${interfaceVisible ? '✅' : '❌'} Interface da lixeira visível`);
    
    // Verificar se mostra "Lixeira vazia"
    const lixeiraVazia = await page.locator('text="Lixeira vazia"');
    const vaziaVisible = await lixeiraVazia.isVisible();
    console.log(`${vaziaVisible ? '✅' : '❌'} Lixeira vazia inicialmente`);
    
    // Fechar a lixeira
    const fecharButton = await page.locator('button:has-text("Fechar")');
    await fecharButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar se há botão de lixeira pequeno ao lado da pergunta
    const lixeiraPequena = await page.locator('button[title="Mover para lixeira de segurança"]');
    const pequenaVisible = await lixeiraPequena.isVisible();
    console.log(`${pequenaVisible ? '✅' : '❌'} Botão de lixeira pequeno visível`);
    
    // Clicar no botão de lixeira pequeno para mover uma pergunta
    await lixeiraPequena.first().click();
    await page.waitForTimeout(1000);
    
    // Verificar se apareceu toast de sucesso
    const toast = await page.locator('text="Pergunta movida para a lixeira de segurança"');
    const toastVisible = await toast.isVisible();
    console.log(`${toastVisible ? '✅' : '❌'} Toast de confirmação apareceu`);
    
    // Abrir lixeira novamente para verificar se a pergunta foi movida
    await lixeiraButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar se há perguntas na lixeira
    const perguntaNaLixeira = await page.locator('text="Eu sempre escolho roupas que mais disfarçam meu excesso de peso."');
    const perguntaVisible = await perguntaNaLixeira.isVisible();
    console.log(`${perguntaVisible ? '✅' : '❌'} Pergunta movida para lixeira`);
    
    // Testar botão restaurar
    const restaurarButton = await page.locator('button:has-text("Restaurar")');
    await restaurarButton.first().click();
    await page.waitForTimeout(1000);
    
    // Verificar toast de restauração
    const toastRestauracao = await page.locator('text="Pergunta restaurada com sucesso"');
    const restauracaoVisible = await toastRestauracao.isVisible();
    console.log(`${restauracaoVisible ? '✅' : '❌'} Pergunta restaurada com sucesso`);
    
    // Verificar se a lixeira voltou a estar vazia
    const lixeiraVaziaNovamente = await page.locator('text="Lixeira vazia"');
    const vaziaNovamente = await lixeiraVaziaNovamente.isVisible();
    console.log(`${vaziaNovamente ? '✅' : '❌'} Lixeira vazia após restauração`);
    
    console.log('🎉 Teste da lixeira de segurança concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await browser.close();
  }
}

testLixeiraSabotadores(); 