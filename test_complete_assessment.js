import { chromium } from 'playwright';

async function testCompleteAssessment() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testando finalização completa da avaliação...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);

    // Verificar se a página carregou
    console.log('\n=== VERIFICANDO PÁGINA ===');
    const pageTitle = await page.locator('h1:has-text("Sabotadores do Emagrecimento")');
    if (await pageTitle.isVisible()) {
      console.log('✅ Página carregada com sucesso');
    } else {
      console.log('❌ Página não carregou');
      return;
    }

    // Verificar se há perguntas sendo exibidas
    console.log('\n=== VERIFICANDO PERGUNTAS ===');
    const primeiraPergunta = await page.locator('h3:has-text("Com que frequência você come por motivos emocionais?")');
    if (await primeiraPergunta.isVisible()) {
      console.log('✅ Primeira pergunta encontrada');
    } else {
      console.log('❌ Primeira pergunta não encontrada');
      return;
    }

    // Responder a primeira pergunta (escala)
    console.log('\n=== RESPONDENDO PRIMEIRA PERGUNTA ===');
    const slider = await page.locator('[data-radix-slider-track]');
    if (await slider.isVisible()) {
      console.log('✅ Slider encontrado');
      
      // Clicar no meio do slider para definir um valor
      const sliderBounds = await slider.boundingBox();
      if (sliderBounds) {
        await page.mouse.click(sliderBounds.x + sliderBounds.width / 2, sliderBounds.y + sliderBounds.height / 2);
        console.log('✅ Clicou no slider');
      }
    } else {
      console.log('❌ Slider não encontrado');
    }

    // Navegar para a próxima pergunta
    console.log('\n=== NAVEGANDO PARA PRÓXIMA PERGUNTA ===');
    const proximaButton = await page.locator('button:has-text("Próxima")');
    if (await proximaButton.isVisible()) {
      await proximaButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Clicou em "Próxima"');
    } else {
      console.log('❌ Botão "Próxima" não encontrado');
      return;
    }

    // Verificar segunda pergunta (múltipla escolha)
    console.log('\n=== RESPONDENDO SEGUNDA PERGUNTA ===');
    const segundaPergunta = await page.locator('h3:has-text("Você costuma se criticar quando não segue a dieta?")');
    if (await segundaPergunta.isVisible()) {
      console.log('✅ Segunda pergunta encontrada');
      
      // Clicar em uma opção de múltipla escolha
      const radioButtons = await page.locator('input[type="radio"]');
      const radioCount = await radioButtons.count();
      console.log(`Encontrados ${radioCount} radio buttons`);
      
      if (radioCount > 0) {
        await radioButtons.first().click();
        console.log('✅ Clicou em uma opção de múltipla escolha');
      } else {
        console.log('❌ Radio buttons não encontrados');
      }
    } else {
      console.log('❌ Segunda pergunta não encontrada');
    }

    // Navegar para a próxima pergunta
    console.log('\n=== NAVEGANDO PARA TERCEIRA PERGUNTA ===');
    const proximaButton2 = await page.locator('button:has-text("Próxima")');
    if (await proximaButton2.isVisible()) {
      await proximaButton2.click();
      await page.waitForTimeout(2000);
      console.log('✅ Clicou em "Próxima" novamente');
    } else {
      console.log('❌ Botão "Próxima" não encontrado');
      return;
    }

    // Verificar terceira pergunta (matriz)
    console.log('\n=== RESPONDENDO TERCEIRA PERGUNTA ===');
    const terceiraPergunta = await page.locator('h3:has-text("Classifique estes alimentos")');
    if (await terceiraPergunta.isVisible()) {
      console.log('✅ Terceira pergunta encontrada');
      
      // Clicar em uma opção da matriz
      const matrixRadioButtons = await page.locator('table input[type="radio"]');
      const matrixRadioCount = await matrixRadioButtons.count();
      console.log(`Encontrados ${matrixRadioCount} radio buttons na matriz`);
      
      if (matrixRadioCount > 0) {
        await matrixRadioButtons.first().click();
        console.log('✅ Clicou em uma opção da matriz');
      } else {
        console.log('❌ Radio buttons da matriz não encontrados');
      }
    } else {
      console.log('❌ Terceira pergunta não encontrada');
    }

    // Navegar rapidamente pelas perguntas restantes para chegar ao final
    console.log('\n=== NAVEGANDO RAPIDAMENTE PELAS PERGUNTAS ===');
    let questionCount = 4;
    const maxQuestions = 20; // Limite para evitar loop infinito
    
    while (questionCount < maxQuestions) {
      const proximaButton = await page.locator('button:has-text("Próxima")');
      if (await proximaButton.isVisible()) {
        await proximaButton.click();
        await page.waitForTimeout(500);
        questionCount++;
        console.log(`✅ Navegou para pergunta ${questionCount}`);
      } else {
        console.log(`✅ Chegou ao final na pergunta ${questionCount}`);
        break;
      }
    }

    // Verificar se há botão "Finalizar"
    console.log('\n=== VERIFICANDO BOTÃO FINALIZAR ===');
    const finalizarButton = await page.locator('button:has-text("Finalizar")');
    if (await finalizarButton.isVisible()) {
      console.log('✅ Botão "Finalizar" encontrado');
      
      // Tentar clicar no botão finalizar
      await finalizarButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Clicou em "Finalizar"');
      
      // Verificar se apareceu algum alerta ou erro
      const alert = await page.locator('.alert, .error, [role="alert"], .toast');
      if (await alert.isVisible()) {
        const alertText = await alert.textContent();
        console.log('⚠️ Alerta encontrado:', alertText);
      } else {
        console.log('✅ Nenhum alerta encontrado');
      }
      
      // Verificar se mudou para a aba de resultados
      const resultsTab = await page.locator('[data-state="active"]:has-text("Resultados")');
      if (await resultsTab.isVisible()) {
        console.log('✅ Mudou para a aba de resultados');
      } else {
        console.log('❌ Não mudou para a aba de resultados');
      }
    } else {
      console.log('❌ Botão "Finalizar" não encontrado');
    }

    // Verificar logs do console para erros
    console.log('\n=== VERIFICANDO LOGS DO CONSOLE ===');
    const logs = await page.evaluate(() => {
      return window.console.logs || [];
    });
    
    const errors = logs.filter(log => 
      log.includes('Error') || 
      log.includes('error') || 
      log.includes('usuário') || 
      log.includes('user') || 
      log.includes('autenticado')
    );
    
    if (errors.length > 0) {
      console.log('⚠️ Erros encontrados no console:', errors);
    } else {
      console.log('✅ Nenhum erro encontrado no console');
    }

    // Tirar screenshot
    await page.screenshot({ path: 'test_complete_assessment.png' });
    console.log('\n📸 Screenshot salvo como test_complete_assessment.png');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    await page.screenshot({ path: 'error_complete_assessment.png' });
  } finally {
    await browser.close();
  }
}

testCompleteAssessment(); 