import { chromium } from 'playwright';

async function testFixedComponents() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testando componentes corrigidos...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);

    // Verificar primeira pergunta (escala)
    console.log('\n=== PRIMEIRA PERGUNTA (ESCALA) ===');
    const primeiraPergunta = await page.locator('h3:has-text("Com que frequência você come por motivos emocionais?")');
    if (await primeiraPergunta.isVisible()) {
      console.log('✅ Primeira pergunta encontrada');
      
      // Verificar se há elementos de slider
      const sliderElements = await page.locator('[data-radix-slider-track]');
      const sliderCount = await sliderElements.count();
      console.log(`Elementos de slider encontrados: ${sliderCount}`);
      
      if (sliderCount > 0) {
        console.log('✅ Slider encontrado');
      } else {
        console.log('❌ Slider não encontrado');
      }
    } else {
      console.log('❌ Primeira pergunta não encontrada');
    }

    // Ir para a segunda pergunta (múltipla escolha)
    console.log('\n=== SEGUNDA PERGUNTA (MÚLTIPLA ESCOLHA) ===');
    const proximaButton = await page.locator('button:has-text("Próxima")');
    if (await proximaButton.isVisible()) {
      await proximaButton.click();
      await page.waitForTimeout(2000);

      const segundaPergunta = await page.locator('h3:has-text("Você costuma se criticar quando não segue a dieta?")');
      if (await segundaPergunta.isVisible()) {
        console.log('✅ Segunda pergunta encontrada');
        
        // Verificar se há radio buttons
        const radioButtons = await page.locator('input[type="radio"]');
        const radioCount = await radioButtons.count();
        console.log(`Radio buttons encontrados: ${radioCount}`);
        
        if (radioCount > 0) {
          console.log('✅ Radio buttons encontrados');
          
          // Clicar no primeiro radio button
          await radioButtons.first().click();
          await page.waitForTimeout(1000);
          console.log('✅ Clicou no primeiro radio button');
          
          // Verificar se foi selecionado
          const selectedRadio = await page.locator('input[type="radio"]:checked');
          if (await selectedRadio.count() > 0) {
            console.log('✅ Radio button selecionado com sucesso');
          } else {
            console.log('❌ Radio button não foi selecionado');
          }
        } else {
          console.log('❌ Radio buttons não encontrados');
        }
      } else {
        console.log('❌ Segunda pergunta não encontrada');
      }
    } else {
      console.log('❌ Botão "Próxima" não encontrado');
    }

    // Ir para a terceira pergunta (matriz)
    console.log('\n=== TERCEIRA PERGUNTA (MATRIZ) ===');
    const proximaButton2 = await page.locator('button:has-text("Próxima")');
    if (await proximaButton2.isVisible()) {
      await proximaButton2.click();
      await page.waitForTimeout(2000);

      const terceiraPergunta = await page.locator('h3:has-text("Classifique estes alimentos de acordo com sua frequência de consumo quando está estressado(a)")');
      if (await terceiraPergunta.isVisible()) {
        console.log('✅ Terceira pergunta encontrada');
        
        // Verificar se há tabela
        const tabela = await page.locator('table');
        if (await tabela.isVisible()) {
          console.log('✅ Tabela encontrada');
          
          // Verificar se há radio buttons na matriz
          const matrixRadioButtons = await page.locator('table input[type="radio"]');
          const matrixRadioCount = await matrixRadioButtons.count();
          console.log(`Radio buttons na matriz encontrados: ${matrixRadioCount}`);
          
          if (matrixRadioCount > 0) {
            console.log('✅ Radio buttons na matriz encontrados');
            
            // Clicar no primeiro radio button da matriz
            await matrixRadioButtons.first().click();
            await page.waitForTimeout(1000);
            console.log('✅ Clicou no primeiro radio button da matriz');
            
            // Verificar se foi selecionado
            const selectedMatrixRadio = await page.locator('table input[type="radio"]:checked');
            if (await selectedMatrixRadio.count() > 0) {
              console.log('✅ Radio button da matriz selecionado com sucesso');
            } else {
              console.log('❌ Radio button da matriz não foi selecionado');
            }
          } else {
            console.log('❌ Radio buttons na matriz não encontrados');
          }
        } else {
          console.log('❌ Tabela não encontrada');
        }
      } else {
        console.log('❌ Terceira pergunta não encontrada');
      }
    } else {
      console.log('❌ Botão "Próxima" não encontrado');
    }

    // Verificar se não há erros no console
    console.log('\n=== VERIFICANDO ERROS ===');
    const logs = await page.evaluate(() => {
      return window.console.logs || [];
    });
    
    const errors = logs.filter(log => log.includes('Error') || log.includes('error'));
    if (errors.length === 0) {
      console.log('✅ Nenhum erro encontrado no console');
    } else {
      console.log('❌ Erros encontrados no console:', errors);
    }

    // Tirar screenshot
    await page.screenshot({ path: 'test_fixed_components.png' });
    console.log('\n📸 Screenshot salvo como test_fixed_components.png');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    await page.screenshot({ path: 'error_fixed_components.png' });
  } finally {
    await browser.close();
  }
}

testFixedComponents(); 