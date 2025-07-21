const { chromium } = require('playwright');

async function testSabotadoresComplete() {
  console.log('🚀 Iniciando teste completo da ferramenta "Sabotadores do Emagrecimento"...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Acessar a página de demonstração
    console.log('📱 Acessando página de demonstração...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(2000);
    
    // 2. Verificar se a página carregou corretamente
    const title = await page.textContent('h1');
    console.log(`✅ Página carregada: ${title}`);
    
    // 3. Iniciar a avaliação
    console.log('🎯 Iniciando avaliação...');
    
    // Pergunta 1: Escala
    console.log('📊 Respondendo pergunta 1 (Escala)...');
    await page.waitForSelector('input[type="range"]');
    await page.fill('input[type="range"]', '7');
    await page.click('button:has-text("Próxima")');
    await page.waitForTimeout(1000);
    
    // Pergunta 2: Múltipla escolha
    console.log('📋 Respondendo pergunta 2 (Múltipla escolha)...');
    await page.click('input[value="Frequentemente"]');
    await page.click('button:has-text("Próxima")');
    await page.waitForTimeout(1000);
    
    // Pergunta 3: Matriz
    console.log('📊 Respondendo pergunta 3 (Matriz)...');
    await page.click('input[id="Doces e chocolates-Frequentemente"]');
    await page.click('input[id="Fast food-Às vezes"]');
    await page.click('input[id="Salgadinhos-Raramente"]');
    await page.click('input[id="Refrigerantes-Nunca"]');
    await page.click('button:has-text("Próxima")');
    await page.waitForTimeout(1000);
    
    // Pergunta 4: Seleção de imagens
    console.log('🖼️ Respondendo pergunta 4 (Seleção de imagens)...');
    await page.click('div:has-text("Tristeza")');
    await page.click('div:has-text("Culpa")');
    await page.click('button:has-text("Próxima")');
    await page.waitForTimeout(1000);
    
    // Pergunta 5: Desenho
    console.log('🎨 Respondendo pergunta 5 (Desenho)...');
    await page.fill('textarea', 'Sinto-me confiante com meu corpo, mas gostaria de melhorar alguns aspectos.');
    await page.click('button:has-text("Finalizar")');
    await page.waitForTimeout(2000);
    
    // 4. Verificar resultados
    console.log('📊 Verificando resultados...');
    await page.waitForSelector('text=Resultados - Sabotadores do Emagrecimento');
    
    const resultsTitle = await page.textContent('h2');
    console.log(`✅ Resultados carregados: ${resultsTitle}`);
    
    // 5. Verificar gráficos
    console.log('📈 Verificando gráficos...');
    await page.waitForSelector('text=Análise por Categoria');
    await page.waitForSelector('text=Comparação Visual');
    await page.waitForSelector('text=Pontuação Geral');
    console.log('✅ Gráficos carregados corretamente');
    
    // 6. Verificar insights
    console.log('💡 Verificando insights...');
    await page.waitForSelector('text=Insights Identificados');
    console.log('✅ Insights carregados');
    
    // 7. Verificar recomendações
    console.log('🎯 Verificando recomendações...');
    await page.waitForSelector('text=Recomendações Personalizadas');
    console.log('✅ Recomendações carregadas');
    
    // 8. Testar nova avaliação
    console.log('🔄 Testando nova avaliação...');
    await page.click('button:has-text("Fazer Nova Avaliação")');
    await page.waitForTimeout(1000);
    
    const newAssessmentTitle = await page.textContent('h1');
    console.log(`✅ Nova avaliação iniciada: ${newAssessmentTitle}`);
    
    console.log('🎉 Teste completo realizado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    
    // Capturar screenshot em caso de erro
    await page.screenshot({ 
      path: 'error_sabotadores_test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot salvo como error_sabotadores_test.png');
  } finally {
    await browser.close();
  }
}

// Executar o teste
testSabotadoresComplete().catch(console.error); 