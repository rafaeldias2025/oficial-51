import { chromium } from 'playwright';

async function testMultipleChoiceMatrixErrors() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Testando erros em múltipla escolha e matriz...');
    
    // Navegar para a página dos sabotadores
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);
    
    // Verificar se a página carregou
    const title = await page.title();
    console.log(`📄 Título da página: ${title}`);
    
    // Verificar se há algum texto relacionado aos sabotadores
    const sabotadoresText = await page.locator('text="Sabotadores do Emagrecimento"').count();
    console.log(`✅ Texto "Sabotadores do Emagrecimento" encontrado: ${sabotadoresText > 0}`);
    
    // Verificar se há perguntas
    const perguntaText = await page.locator('text="Com que frequência você come por motivos emocionais"').count();
    console.log(`✅ Primeira pergunta encontrada: ${perguntaText > 0}`);
    
    // Verificar se há slider (primeira pergunta é scale)
    const slider = await page.locator('[role="slider"]').count();
    console.log(`🎚️ Slider encontrado: ${slider}`);
    
    // Clicar no botão "Próxima" para ir para a segunda pergunta (múltipla escolha)
    const proximaButton = await page.locator('button:has-text("Próxima")');
    if (await proximaButton.isVisible()) {
      await proximaButton.click();
      await page.waitForTimeout(2000);
      
      // Verificar se chegou na segunda pergunta (múltipla escolha)
      const segundaPergunta = await page.locator('text="Você costuma se criticar quando não segue a dieta"').count();
      console.log(`✅ Segunda pergunta (múltipla escolha) encontrada: ${segundaPergunta > 0}`);
      
      // Verificar se há checkboxes
      const checkboxes = await page.locator('input[type="checkbox"]').count();
      console.log(`☑️ Checkboxes encontrados: ${checkboxes}`);
      
      // Verificar se há opções de resposta
      const opcoes = await page.locator('text="Sempre", text="Frequentemente", text="Às vezes", text="Raramente", text="Nunca"').count();
      console.log(`📝 Opções de resposta encontradas: ${opcoes}`);
      
      // Tentar clicar em uma opção
      try {
        const primeiraOpcao = await page.locator('text="Sempre"').first();
        await primeiraOpcao.click();
        await page.waitForTimeout(1000);
        console.log(`✅ Clique na primeira opção realizado`);
      } catch (error) {
        console.log(`❌ Erro ao clicar na primeira opção: ${error.message}`);
      }
      
      // Ir para a terceira pergunta (matriz)
      const proximaButton2 = await page.locator('button:has-text("Próxima")');
      if (await proximaButton2.isVisible()) {
        await proximaButton2.click();
        await page.waitForTimeout(2000);
        
        // Verificar se chegou na terceira pergunta (matriz)
        const terceiraPergunta = await page.locator('text="Classifique estes alimentos"').count();
        console.log(`✅ Terceira pergunta (matriz) encontrada: ${terceiraPergunta > 0}`);
        
        // Verificar se há tabela
        const tabela = await page.locator('table').count();
        console.log(`📊 Tabela encontrada: ${tabela}`);
        
        // Verificar se há radio buttons
        const radioButtons = await page.locator('input[type="radio"]').count();
        console.log(`🔘 Radio buttons encontrados: ${radioButtons}`);
        
        // Verificar se há linhas da matriz
        const linhas = await page.locator('text="Doces e chocolates", text="Fast food", text="Salgadinhos", text="Refrigerantes"').count();
        console.log(`📋 Linhas da matriz encontradas: ${linhas}`);
        
        // Verificar se há colunas da matriz
        const colunas = await page.locator('text="Nunca", text="Raramente", text="Às vezes", text="Frequentemente", text="Sempre"').count();
        console.log(`📊 Colunas da matriz encontradas: ${colunas}`);
        
        // Tentar clicar em uma opção da matriz
        try {
          const primeiraRadio = await page.locator('input[type="radio"]').first();
          await primeiraRadio.click();
          await page.waitForTimeout(1000);
          console.log(`✅ Clique no primeiro radio button realizado`);
        } catch (error) {
          console.log(`❌ Erro ao clicar no radio button: ${error.message}`);
        }
      }
    }
    
    // Fazer screenshot
    await page.screenshot({ path: 'teste-multiple-choice-matrix.png' });
    console.log('📸 Screenshot salvo como teste-multiple-choice-matrix.png');
    
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

testMultipleChoiceMatrixErrors(); 