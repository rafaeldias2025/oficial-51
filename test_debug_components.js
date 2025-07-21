import { chromium } from 'playwright';

async function testDebugComponents() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();

  try {
    console.log('🔍 Debugando componentes da página...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);

    // Verificar elementos básicos
    console.log('\n=== ELEMENTOS BÁSICOS ===');
    
    const pageTitle = await page.locator('h1');
    if (await pageTitle.isVisible()) {
      console.log('✅ Título da página:', await pageTitle.textContent());
    }

    const card = await page.locator('.bg-netflix-card');
    if (await card.isVisible()) {
      console.log('✅ Card principal encontrado');
    }

    // Verificar primeira pergunta (mais específico)
    console.log('\n=== PRIMEIRA PERGUNTA ===');
    const primeiraPergunta = await page.locator('h3:has-text("Com que frequência você come por motivos emocionais?")');
    if (await primeiraPergunta.isVisible()) {
      console.log('✅ Texto da primeira pergunta:', await primeiraPergunta.textContent());
    } else {
      console.log('❌ Primeira pergunta não encontrada');
    }

    // Verificar se há slider
    console.log('\n=== SLIDER ===');
    const slider = await page.locator('input[type="range"]');
    const sliderCount = await slider.count();
    console.log(`Sliders encontrados: ${sliderCount}`);
    
    if (sliderCount > 0) {
      console.log('✅ Slider encontrado');
      const sliderValue = await slider.getAttribute('value');
      console.log('Valor inicial do slider:', sliderValue);
    } else {
      console.log('❌ Slider não encontrado');
    }

    // Verificar se há radio buttons
    console.log('\n=== RADIO BUTTONS ===');
    const radioButtons = await page.locator('input[type="radio"]');
    const radioCount = await radioButtons.count();
    console.log(`Radio buttons encontrados: ${radioCount}`);
    
    if (radioCount > 0) {
      console.log('✅ Radio buttons encontrados');
      for (let i = 0; i < Math.min(radioCount, 3); i++) {
        const radio = radioButtons.nth(i);
        const id = await radio.getAttribute('id');
        const value = await radio.getAttribute('value');
        console.log(`Radio ${i + 1}: id="${id}", value="${value}"`);
      }
    } else {
      console.log('❌ Radio buttons não encontrados');
    }

    // Verificar se há checkboxes
    console.log('\n=== CHECKBOXES ===');
    const checkboxes = await page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log(`Checkboxes encontrados: ${checkboxCount}`);
    
    if (checkboxCount > 0) {
      console.log('✅ Checkboxes encontrados');
      for (let i = 0; i < Math.min(checkboxCount, 3); i++) {
        const checkbox = checkboxes.nth(i);
        const id = await checkbox.getAttribute('id');
        const checked = await checkbox.isChecked();
        console.log(`Checkbox ${i + 1}: id="${id}", checked=${checked}`);
      }
    } else {
      console.log('❌ Checkboxes não encontrados');
    }

    // Verificar se há tabela
    console.log('\n=== TABELA ===');
    const tabela = await page.locator('table');
    if (await tabela.isVisible()) {
      console.log('✅ Tabela encontrada');
      
      const linhas = await page.locator('table tr');
      const linhasCount = await linhas.count();
      console.log(`Linhas na tabela: ${linhasCount}`);
      
      const celulas = await page.locator('table td, table th');
      const celulasCount = await celulas.count();
      console.log(`Células na tabela: ${celulasCount}`);
    } else {
      console.log('❌ Tabela não encontrada');
    }

    // Verificar botões
    console.log('\n=== BOTÕES ===');
    const botoes = await page.locator('button');
    const botoesCount = await botoes.count();
    console.log(`Botões encontrados: ${botoesCount}`);
    
    for (let i = 0; i < Math.min(botoesCount, 5); i++) {
      const botao = botoes.nth(i);
      const texto = await botao.textContent();
      console.log(`Botão ${i + 1}: "${texto?.trim()}"`);
    }

    // Verificar labels
    console.log('\n=== LABELS ===');
    const labels = await page.locator('label');
    const labelsCount = await labels.count();
    console.log(`Labels encontrados: ${labelsCount}`);
    
    for (let i = 0; i < Math.min(labelsCount, 5); i++) {
      const label = labels.nth(i);
      const texto = await label.textContent();
      console.log(`Label ${i + 1}: "${texto?.trim()}"`);
    }

    // Verificar se há elementos de formulário
    console.log('\n=== ELEMENTOS DE FORMULÁRIO ===');
    const formElements = await page.locator('input, select, textarea');
    const formElementsCount = await formElements.count();
    console.log(`Elementos de formulário encontrados: ${formElementsCount}`);
    
    for (let i = 0; i < Math.min(formElementsCount, 5); i++) {
      const element = formElements.nth(i);
      const type = await element.getAttribute('type');
      const id = await element.getAttribute('id');
      const value = await element.getAttribute('value');
      console.log(`Elemento ${i + 1}: type="${type}", id="${id}", value="${value}"`);
    }

    // Tirar screenshot
    await page.screenshot({ path: 'test_debug_components.png' });
    console.log('\n📸 Screenshot salvo como test_debug_components.png');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    await page.screenshot({ path: 'error_debug_components.png' });
  } finally {
    await browser.close();
  }
}

testDebugComponents(); 