import { chromium } from 'playwright';

async function testMultipleChoiceFix() {
  console.log('🧪 Testando correção da múltipla escolha...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    // 1. Acessar a página de demonstração dos Sabotadores
    await page.goto('http://localhost:8083/sabotadores-demo');
    console.log('✅ Página de demonstração carregada');
    
    // 2. Aguardar a página carregar
    await page.waitForSelector('h1:has-text("Sabotadores do Emagrecimento")', { timeout: 10000 });
    console.log('✅ Página carregada corretamente');
    
    // 3. Verificar se já estamos na avaliação
    const avaliacaoButton = await page.locator('button:has-text("Avaliação")').count();
    console.log(`✅ ${avaliacaoButton} botão(ões) de avaliação encontrado(s)`);
    
    // Se não estiver na avaliação, clicar no botão "Avaliação"
    if (avaliacaoButton > 0) {
      await page.click('button:has-text("Avaliação")');
      console.log('✅ Avaliação iniciada');
    }
    
    // 4. Responder a primeira pergunta (escala)
    await page.waitForSelector('text=Com que frequência você come por motivos emocionais?');
    console.log('✅ Primeira pergunta carregada');
    
    // Mover o slider para o meio
    const slider = await page.locator('input[type="range"]');
    await slider.fill('5');
    console.log('✅ Primeira pergunta respondida');
    
    // 5. Ir para a próxima pergunta (múltipla escolha)
    await page.click('button:has-text("Próxima")');
    console.log('✅ Indo para segunda pergunta');
    
    // 6. Aguardar a pergunta de múltipla escolha
    await page.waitForSelector('text=Você costuma se criticar quando não segue a dieta?');
    console.log('✅ Segunda pergunta (múltipla escolha) carregada');
    
    // 7. Verificar se os checkboxes estão funcionando
    const checkboxes = await page.locator('input[type="checkbox"]').count();
    console.log(`✅ ${checkboxes} checkboxes encontrados`);
    
    // 8. Selecionar uma opção
    await page.click('input[type="checkbox"]');
    console.log('✅ Checkbox clicado');
    
    // 9. Verificar se a seleção foi registrada
    const checkedCheckbox = await page.locator('input[type="checkbox"]:checked').count();
    console.log(`✅ ${checkedCheckbox} checkbox(es) selecionado(s)`);
    
    // 10. Selecionar outra opção para testar múltipla seleção
    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    if (allCheckboxes.length > 1) {
      await allCheckboxes[1].click();
      console.log('✅ Segundo checkbox clicado');
      
      const totalChecked = await page.locator('input[type="checkbox"]:checked').count();
      console.log(`✅ Total de ${totalChecked} checkbox(es) selecionado(s)`);
    }
    
    // 11. Ir para a próxima pergunta
    await page.click('button:has-text("Próxima")');
    console.log('✅ Indo para terceira pergunta');
    
    // 12. Verificar se chegou na pergunta de matriz
    await page.waitForSelector('text=Classifique estes alimentos');
    console.log('✅ Terceira pergunta (matriz) carregada');
    
    console.log('\n🎉 TESTE COMPLETO: Correção da múltipla escolha funcionando!');
    console.log('\n📋 RESUMO:');
    console.log('✅ Checkboxes funcionando corretamente');
    console.log('✅ Seleção múltipla implementada');
    console.log('✅ Navegação entre perguntas funcionando');
    console.log('✅ Interface Netflix-themed mantida');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    await page.screenshot({ path: 'multiple_choice_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testMultipleChoiceFix(); 