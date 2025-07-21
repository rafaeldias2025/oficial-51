import { chromium } from 'playwright';

async function testSimpleLixeira() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Teste simples da lixeira...');
    
    // Navegar para a página dos sabotadores
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);
    
    // Verificar se a página carregou
    const title = await page.title();
    console.log(`📄 Título da página: ${title}`);
    
    // Verificar se há algum texto relacionado aos sabotadores
    const sabotadoresText = await page.locator('text="Teste dos Sabotadores"').count();
    console.log(`✅ Texto "Teste dos Sabotadores" encontrado: ${sabotadoresText > 0}`);
    
    // Verificar se há perguntas
    const perguntaText = await page.locator('text="Eu sempre escolho roupas"').count();
    console.log(`✅ Primeira pergunta encontrada: ${perguntaText > 0}`);
    
    // Verificar se há botões de opção
    const opcoesButtons = await page.locator('button:has-text("Concordo Fortemente")').count();
    console.log(`✅ Botões de opção encontrados: ${opcoesButtons}`);
    
    // Verificar se há algum elemento com "lixeira" ou "trash"
    const lixeiraElements = await page.locator('[class*="trash"], [class*="lixeira"], [title*="lixeira"]').count();
    console.log(`🔍 Elementos relacionados à lixeira encontrados: ${lixeiraElements}`);
    
    // Fazer screenshot
    await page.screenshot({ path: 'teste-lixeira-screenshot.png' });
    console.log('📸 Screenshot salvo como teste-lixeira-screenshot.png');
    
    // Verificar console por erros
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
      if (msg.type() === 'error') {
        console.log(`❌ Erro no console: ${msg.text()}`);
      }
    });
    
    await page.waitForTimeout(2000);
    console.log(`📊 Total de logs no console: ${consoleLogs.length}`);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await browser.close();
  }
}

testSimpleLixeira(); 