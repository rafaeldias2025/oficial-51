import { chromium } from 'playwright';

async function testLixeiraInterface() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Testando interface da lixeira...');
    
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
    const lixeiraElements = await page.locator('[class*="trash"], [class*="lixeira"], [title*="lixeira"], [title*="trash"]').count();
    console.log(`🔍 Elementos relacionados à lixeira encontrados: ${lixeiraElements}`);
    
    // Verificar se há botão da lixeira
    const lixeiraButton = await page.locator('button:has-text("Lixeira")').count();
    console.log(`🗑️ Botão da lixeira encontrado: ${lixeiraButton > 0}`);
    
    // Verificar se há botão pequeno de lixeira
    const lixeiraPequena = await page.locator('[title*="lixeira"], [title*="trash"]').count();
    console.log(`🗑️ Botão pequeno da lixeira encontrado: ${lixeiraPequena > 0}`);
    
    // Verificar se há texto "Lixeira de Segurança"
    const lixeiraSeguranca = await page.locator('text="Lixeira de Segurança"').count();
    console.log(`🛡️ Texto "Lixeira de Segurança" encontrado: ${lixeiraSeguranca > 0}`);
    
    // Verificar se há texto "Lixeira vazia"
    const lixeiraVazia = await page.locator('text="Lixeira vazia"').count();
    console.log(`📭 Texto "Lixeira vazia" encontrado: ${lixeiraVazia > 0}`);
    
    // Verificar se há botão "Restaurar"
    const restaurarButton = await page.locator('button:has-text("Restaurar")').count();
    console.log(`🔄 Botão "Restaurar" encontrado: ${restaurarButton > 0}`);
    
    // Verificar se há botão "Excluir"
    const excluirButton = await page.locator('button:has-text("Excluir")').count();
    console.log(`❌ Botão "Excluir" encontrado: ${excluirButton > 0}`);
    
    // Verificar se há botão "Limpar Tudo"
    const limparButton = await page.locator('button:has-text("Limpar Tudo")').count();
    console.log(`🧹 Botão "Limpar Tudo" encontrado: ${limparButton > 0}`);
    
    // Verificar se há badge com número de perguntas ativas
    const perguntasAtivas = await page.locator('text*="perguntas ativas"').count();
    console.log(`📊 Badge de perguntas ativas encontrado: ${perguntasAtivas > 0}`);
    
    // Fazer screenshot
    await page.screenshot({ path: 'teste-lixeira-interface.png' });
    console.log('📸 Screenshot salvo como teste-lixeira-interface.png');
    
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
    
    // Se encontrou elementos da lixeira, tentar interagir
    if (lixeiraButton > 0) {
      console.log('🎯 Tentando interagir com a lixeira...');
      
      // Clicar no botão da lixeira
      await page.locator('button:has-text("Lixeira")').first().click();
      await page.waitForTimeout(2000);
      
      // Verificar se a interface da lixeira apareceu
      const interfaceLixeira = await page.locator('text="Lixeira de Segurança"').count();
      console.log(`✅ Interface da lixeira apareceu: ${interfaceLixeira > 0}`);
      
      // Fazer screenshot da interface da lixeira
      await page.screenshot({ path: 'teste-lixeira-interface-aberta.png' });
      console.log('📸 Screenshot da lixeira aberta salvo');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await browser.close();
  }
}

testLixeiraInterface(); 