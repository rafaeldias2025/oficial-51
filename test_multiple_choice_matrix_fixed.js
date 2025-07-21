import { chromium } from 'playwright';

async function testMultipleChoiceMatrixFixed() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testando correções em múltipla escolha e matriz...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);

    // Verificar se a página carregou
    const pageTitle = await page.locator('h1:has-text("Sabotadores do Emagrecimento")');
    if (await pageTitle.isVisible()) {
      console.log('✅ Título da página encontrado');
    } else {
      console.log('❌ Título da página não encontrado');
    }

    // Verificar primeira pergunta (escala)
    const primeiraPergunta = await page.locator('h3:has-text("Com que frequência você come por motivos emocionais?")');
    if (await primeiraPergunta.isVisible()) {
      console.log('✅ Primeira pergunta (escala) encontrada');
      
      // Testar slider
      const slider = await page.locator('input[type="range"]');
      if (await slider.isVisible()) {
        console.log('✅ Slider encontrado');
        
        // Mover o slider
        await slider.fill('5');
        await page.waitForTimeout(1000);
        console.log('✅ Slider movido para valor 5');
      } else {
        console.log('❌ Slider não encontrado');
      }
    } else {
      console.log('❌ Primeira pergunta não encontrada');
    }

    // Ir para a segunda pergunta (múltipla escolha)
    const proximaButton = await page.locator('button:has-text("Próxima")');
    if (await proximaButton.isVisible()) {
      await proximaButton.click();
      await page.waitForTimeout(2000);

      // Verificar segunda pergunta (múltipla escolha)
      const segundaPergunta = await page.locator('h3:has-text("Você costuma se criticar quando não segue a dieta?")');
      if (await segundaPergunta.isVisible()) {
        console.log('✅ Segunda pergunta (múltipla escolha) encontrada');
        
        // Verificar se há opções de múltipla escolha
        const opcoes = await page.locator('input[type="radio"]');
        const opcoesCount = await opcoes.count();
        console.log(`✅ Encontradas ${opcoesCount} opções de múltipla escolha`);
        
        if (opcoesCount > 0) {
          // Clicar na primeira opção
          await opcoes.first().click();
          await page.waitForTimeout(1000);
          console.log('✅ Clicou na primeira opção de múltipla escolha');
          
          // Verificar se a opção foi selecionada
          const opcaoSelecionada = await page.locator('input[type="radio"]:checked');
          if (await opcaoSelecionada.count() > 0) {
            console.log('✅ Opção de múltipla escolha selecionada com sucesso');
          } else {
            console.log('❌ Opção de múltipla escolha não foi selecionada');
          }
        }
      } else {
        console.log('❌ Segunda pergunta não encontrada');
      }
    } else {
      console.log('❌ Botão "Próxima" não encontrado');
    }

    // Ir para a terceira pergunta (matriz)
    const proximaButton2 = await page.locator('button:has-text("Próxima")');
    if (await proximaButton2.isVisible()) {
      await proximaButton2.click();
      await page.waitForTimeout(2000);

      // Verificar terceira pergunta (matriz)
      const terceiraPergunta = await page.locator('h3:has-text("Classifique estes alimentos de acordo com sua frequência de consumo quando está estressado(a)")');
      if (await terceiraPergunta.isVisible()) {
        console.log('✅ Terceira pergunta (matriz) encontrada');
        
        // Verificar se há tabela
        const tabela = await page.locator('table');
        if (await tabela.isVisible()) {
          console.log('✅ Tabela da matriz encontrada');
          
          // Verificar se há células da tabela
          const celulas = await page.locator('td');
          const celulasCount = await celulas.count();
          console.log(`✅ Encontradas ${celulasCount} células na tabela`);
          
          // Verificar se há radio buttons na matriz
          const radioButtons = await page.locator('input[type="radio"]');
          const radioCount = await radioButtons.count();
          console.log(`✅ Encontrados ${radioCount} radio buttons na matriz`);
          
          if (radioCount > 0) {
            // Clicar no primeiro radio button da matriz
            await radioButtons.first().click();
            await page.waitForTimeout(1000);
            console.log('✅ Clicou no primeiro radio button da matriz');
            
            // Verificar se o radio button foi selecionado
            const radioSelecionado = await page.locator('input[type="radio"]:checked');
            if (await radioSelecionado.count() > 0) {
              console.log('✅ Radio button da matriz selecionado com sucesso');
            } else {
              console.log('❌ Radio button da matriz não foi selecionado');
            }
          }
        } else {
          console.log('❌ Tabela da matriz não encontrada');
        }
      } else {
        console.log('❌ Terceira pergunta não encontrada');
      }
    } else {
      console.log('❌ Botão "Próxima" não encontrado');
    }

    // Tirar screenshot
    await page.screenshot({ path: 'test_multiple_choice_matrix_fixed.png' });
    console.log('📸 Screenshot salvo como test_multiple_choice_matrix_fixed.png');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    await page.screenshot({ path: 'error_multiple_choice_matrix_fixed.png' });
  } finally {
    await browser.close();
  }
}

testMultipleChoiceMatrixFixed(); 