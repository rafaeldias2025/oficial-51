import { chromium } from 'playwright';

async function testLixeiraSabotadoresFinal() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testando sistema de lixeira no SabotadoresEmagrecimento...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);

    // Verificar se a página carregou
    const pageTitle = await page.locator('h1:has-text("Sabotadores do Emagrecimento")');
    if (await pageTitle.isVisible()) {
      console.log('✅ Título da página encontrado');
    } else {
      console.log('❌ Título da página não encontrado');
    }

    // Verificar se o botão da lixeira está visível
    const lixeiraButton = await page.locator('button:has-text("Lixeira")');
    if (await lixeiraButton.isVisible()) {
      console.log('✅ Botão da lixeira visível');
      
      // Clicar no botão da lixeira
      await lixeiraButton.click();
      await page.waitForTimeout(2000);

      // Verificar se a interface da lixeira apareceu
      const lixeiraInterface = await page.locator('text="Lixeira de Segurança"');
      if (await lixeiraInterface.isVisible()) {
        console.log('✅ Interface da lixeira apareceu');
      } else {
        console.log('❌ Interface da lixeira não apareceu');
      }

      // Verificar se há perguntas na lixeira (deve estar vazia inicialmente)
      const lixeiraVazia = await page.locator('text="Lixeira vazia"');
      if (await lixeiraVazia.isVisible()) {
        console.log('✅ Lixeira está vazia (correto)');
      } else {
        console.log('❌ Lixeira não está vazia');
      }

      // Fechar a lixeira
      const fecharButton = await page.locator('button:has-text("Fechar")');
      if (await fecharButton.isVisible()) {
        await fecharButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Lixeira fechada');
      }

    } else {
      console.log('❌ Botão da lixeira não encontrado');
    }

    // Verificar se há perguntas sendo exibidas
    const primeiraPergunta = await page.locator('h3:has-text("Com que frequência você come por motivos emocionais?")');
    if (await primeiraPergunta.isVisible()) {
      console.log('✅ Primeira pergunta encontrada');
      
      // Verificar se há botão de lixeira na pergunta
      const lixeiraPergunta = await page.locator('button[title="Mover para lixeira de segurança"]');
      if (await lixeiraPergunta.isVisible()) {
        console.log('✅ Botão de lixeira na pergunta encontrado');
        
        // Clicar no botão de lixeira da pergunta
        await lixeiraPergunta.click();
        await page.waitForTimeout(2000);
        console.log('✅ Clicou no botão de lixeira da pergunta');
        
        // Verificar se a pergunta foi movida para a lixeira
        const lixeiraButton2 = await page.locator('button:has-text("Lixeira")');
        if (await lixeiraButton2.isVisible()) {
          await lixeiraButton2.click();
          await page.waitForTimeout(2000);
          
          // Verificar se a pergunta aparece na lixeira (usando seletor mais específico)
          const perguntaNaLixeira = await page.locator('.bg-orange-50 p.text-sm:has-text("Com que frequência você come por motivos emocionais?")');
          if (await perguntaNaLixeira.isVisible()) {
            console.log('✅ Pergunta movida para a lixeira com sucesso');
            
            // Testar restaurar a pergunta
            const restaurarButton = await page.locator('button:has-text("Restaurar")');
            if (await restaurarButton.isVisible()) {
              await restaurarButton.click();
              await page.waitForTimeout(2000);
              console.log('✅ Pergunta restaurada com sucesso');
            }
          } else {
            console.log('❌ Pergunta não apareceu na lixeira');
          }
        }
      } else {
        console.log('❌ Botão de lixeira na pergunta não encontrado');
      }
    } else {
      console.log('❌ Primeira pergunta não encontrada');
    }

    // Tirar screenshot
    await page.screenshot({ path: 'test_lixeira_sabotadores_final.png' });
    console.log('📸 Screenshot salvo como test_lixeira_sabotadores_final.png');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    await page.screenshot({ path: 'error_lixeira_sabotadores_final.png' });
  } finally {
    await browser.close();
  }
}

testLixeiraSabotadoresFinal(); 