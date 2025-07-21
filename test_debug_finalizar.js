import { chromium } from 'playwright';

async function testDebugFinalizar() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testando debug do botão Finalizar...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);

    // Navegar rapidamente para a última pergunta
    console.log('\n=== NAVEGANDO PARA ÚLTIMA PERGUNTA ===');
    for (let i = 0; i < 10; i++) {
      const proximaButton = await page.locator('button:has-text("Próxima")');
      if (await proximaButton.isVisible()) {
        await proximaButton.click();
        await page.waitForTimeout(500);
        console.log(`✅ Navegou para pergunta ${i + 2}`);
      } else {
        console.log(`✅ Chegou ao final na pergunta ${i + 1}`);
        break;
      }
    }

    // Verificar se há botão "Finalizar"
    console.log('\n=== VERIFICANDO BOTÃO FINALIZAR ===');
    const finalizarButton = await page.locator('button:has-text("Finalizar")');
    if (await finalizarButton.isVisible()) {
      console.log('✅ Botão "Finalizar" encontrado');
      
      // Verificar o texto do botão
      const buttonText = await finalizarButton.textContent();
      console.log('🔍 Texto do botão:', buttonText);
      
      // Clicar no botão finalizar
      await finalizarButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Clicou em "Finalizar"');
      
      // Verificar se apareceu algum alerta
      const alert = await page.locator('.alert, .error, [role="alert"], .toast');
      if (await alert.isVisible()) {
        const alertText = await alert.textContent();
        console.log('⚠️ Alerta encontrado:', alertText);
      } else {
        console.log('✅ Nenhum alerta encontrado');
      }
      
      // Verificar se mudou para a aba de resultados
      const resultsTab = await page.locator('button[data-state="active"]:has-text("Resultados")');
      if (await resultsTab.isVisible()) {
        console.log('✅ Mudou para a aba de resultados');
      } else {
        console.log('❌ Não mudou para a aba de resultados');
      }
    } else {
      console.log('❌ Botão "Finalizar" não encontrado');
    }

    // Aguardar um pouco para ver os logs
    console.log('\n=== AGUARDANDO LOGS ===');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    await page.screenshot({ path: 'error_debug_finalizar.png' });
  } finally {
    await browser.close();
  }
}

testDebugFinalizar(); 