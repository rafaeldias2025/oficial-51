import { chromium } from 'playwright';

async function testRenderDebug() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();

  try {
    console.log('🔍 Debugando renderização dos componentes...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);

    // Verificar se há elementos de slider
    console.log('\n=== VERIFICANDO SLIDER ===');
    const sliderElements = await page.locator('[data-radix-slider-track]');
    const sliderCount = await sliderElements.count();
    console.log(`Elementos de slider encontrados: ${sliderCount}`);
    
    if (sliderCount > 0) {
      console.log('✅ Slider encontrado via data-radix-slider-track');
    } else {
      console.log('❌ Slider não encontrado via data-radix-slider-track');
    }

    // Verificar se há elementos de radio group
    console.log('\n=== VERIFICANDO RADIO GROUP ===');
    const radioGroupElements = await page.locator('[data-radix-collection-item]');
    const radioGroupCount = await radioGroupElements.count();
    console.log(`Elementos de radio group encontrados: ${radioGroupCount}`);
    
    if (radioGroupCount > 0) {
      console.log('✅ Radio group encontrado via data-radix-collection-item');
    } else {
      console.log('❌ Radio group não encontrado via data-radix-collection-item');
    }

    // Verificar se há elementos de checkbox
    console.log('\n=== VERIFICANDO CHECKBOX ===');
    const checkboxElements = await page.locator('[data-state]');
    const checkboxCount = await checkboxElements.count();
    console.log(`Elementos com data-state encontrados: ${checkboxCount}`);
    
    if (checkboxCount > 0) {
      console.log('✅ Elementos com data-state encontrados');
      for (let i = 0; i < Math.min(checkboxCount, 3); i++) {
        const element = checkboxElements.nth(i);
        const state = await element.getAttribute('data-state');
        console.log(`Elemento ${i + 1}: data-state="${state}"`);
      }
    } else {
      console.log('❌ Elementos com data-state não encontrados');
    }

    // Verificar se há elementos de progress
    console.log('\n=== VERIFICANDO PROGRESS ===');
    const progressElements = await page.locator('[data-radix-progress-indicator]');
    const progressCount = await progressElements.count();
    console.log(`Elementos de progress encontrados: ${progressCount}`);
    
    if (progressCount > 0) {
      console.log('✅ Progress encontrado via data-radix-progress-indicator');
    } else {
      console.log('❌ Progress não encontrado via data-radix-progress-indicator');
    }

    // Verificar se há elementos de button
    console.log('\n=== VERIFICANDO BUTTONS ===');
    const buttonElements = await page.locator('button');
    const buttonCount = await buttonElements.count();
    console.log(`Botões encontrados: ${buttonCount}`);
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttonElements.nth(i);
      const text = await button.textContent();
      const className = await button.getAttribute('class');
      console.log(`Botão ${i + 1}: "${text?.trim()}" - class="${className}"`);
    }

    // Verificar se há elementos de card
    console.log('\n=== VERIFICANDO CARDS ===');
    const cardElements = await page.locator('[data-component-name="Card"]');
    const cardCount = await cardElements.count();
    console.log(`Cards encontrados: ${cardCount}`);
    
    if (cardCount > 0) {
      console.log('✅ Cards encontrados');
    } else {
      console.log('❌ Cards não encontrados');
    }

    // Verificar se há elementos de label
    console.log('\n=== VERIFICANDO LABELS ===');
    const labelElements = await page.locator('label');
    const labelCount = await labelElements.count();
    console.log(`Labels encontrados: ${labelCount}`);
    
    for (let i = 0; i < Math.min(labelCount, 3); i++) {
      const label = labelElements.nth(i);
      const text = await label.textContent();
      const htmlFor = await label.getAttribute('for');
      console.log(`Label ${i + 1}: "${text?.trim()}" - for="${htmlFor}"`);
    }

    // Verificar se há elementos de input
    console.log('\n=== VERIFICANDO INPUTS ===');
    const inputElements = await page.locator('input');
    const inputCount = await inputElements.count();
    console.log(`Inputs encontrados: ${inputCount}`);
    
    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputElements.nth(i);
      const type = await input.getAttribute('type');
      const id = await input.getAttribute('id');
      const value = await input.getAttribute('value');
      console.log(`Input ${i + 1}: type="${type}" id="${id}" value="${value}"`);
    }

    // Verificar se há elementos de table
    console.log('\n=== VERIFICANDO TABLES ===');
    const tableElements = await page.locator('table');
    const tableCount = await tableElements.count();
    console.log(`Tabelas encontradas: ${tableCount}`);
    
    if (tableCount > 0) {
      console.log('✅ Tabelas encontradas');
      const table = tableElements.first();
      const rows = await table.locator('tr').count();
      const cells = await table.locator('td, th').count();
      console.log(`Primeira tabela: ${rows} linhas, ${cells} células`);
    } else {
      console.log('❌ Tabelas não encontradas');
    }

    // Verificar se há elementos de div com classes específicas
    console.log('\n=== VERIFICANDO DIVS ESPECÍFICOS ===');
    const spaceY6Elements = await page.locator('.space-y-6');
    const spaceY6Count = await spaceY6Elements.count();
    console.log(`Divs com space-y-6 encontrados: ${spaceY6Count}`);
    
    if (spaceY6Count > 0) {
      console.log('✅ Divs com space-y-6 encontrados');
    } else {
      console.log('❌ Divs com space-y-6 não encontrados');
    }

    // Tirar screenshot
    await page.screenshot({ path: 'test_render_debug.png' });
    console.log('\n📸 Screenshot salvo como test_render_debug.png');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    await page.screenshot({ path: 'error_render_debug.png' });
  } finally {
    await browser.close();
  }
}

testRenderDebug(); 