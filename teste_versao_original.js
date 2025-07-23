import puppeteer from 'puppeteer';

async function testeVersaoOriginal() {
  console.log('🔄 TESTE - Versão Original da Plataforma');
  console.log('=' .repeat(45));
  
  try {
    // Conectar ao Chrome
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null
    });
    
    console.log('✅ Conectado ao Chrome!');
    
    const pages = await browser.pages();
    let page = pages[0] || await browser.newPage();
    
    // Navegar para o dashboard
    console.log('\n📱 Navegando para o dashboard...');
    await page.goto('http://localhost:8080/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Fazer login se necessário
    const currentUrl = page.url();
    if (currentUrl.includes('/auth')) {
      console.log('🔐 Fazendo login automático...');
      
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      
      if (emailInput && passwordInput) {
        await emailInput.type('admin@institutodossonhos.com');
        await passwordInput.type('admin123');
        
        const buttons = await page.$$('button');
        for (const button of buttons) {
          const text = await button.evaluate(el => el.textContent);
          if (text && text.includes('Entrar')) {
            await button.click();
            await new Promise(resolve => setTimeout(resolve, 3000));
            break;
          }
        }
      }
    }
    
    // Verificar se chegou no dashboard
    console.log('🔍 Verificando se está no dashboard...');
    const pageText = await page.evaluate(() => document.body.innerText);
    const isDashboard = pageText.includes('Dashboard') || pageText.includes('Plataforma dos Sonhos');
    
    console.log('📍 Está no dashboard:', isDashboard ? '✅' : '❌');
    
    if (isDashboard) {
      // Procurar botão da Plataforma dos Sonhos
      console.log('\n🔍 Procurando botão "Plataforma dos Sonhos"...');
      
      const buttons = await page.$$('button');
      let plataformaButton = null;
      
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && text.includes('Plataforma dos Sonhos')) {
          plataformaButton = button;
          console.log('✅ Botão encontrado!');
          break;
        }
      }
      
      if (plataformaButton) {
        // Clicar no botão
        console.log('🖱️ Clicando no botão...');
        await plataformaButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se a plataforma carregou
        console.log('\n🔍 VERIFICANDO PLATAFORMA ORIGINAL:');
        console.log('-'.repeat(40));
        
        const plataformaText = await page.evaluate(() => document.body.innerText);
        const hasModules = plataformaText.includes('MÓDULO 1: FUNDAMENTOS') || 
                          plataformaText.includes('MÓDULO 2: NUTRIÇÃO') ||
                          plataformaText.includes('MÓDULO 3: FITNESS');
        const hasCourses = plataformaText.includes('7 CHAVES') || 
                          plataformaText.includes('12 CHÁS') ||
                          plataformaText.includes('JEJUM INTERMITENTE');
        const hasAddButton = plataformaText.includes('Adicionar Conteúdo') || 
                           plataformaText.includes('+');
        
        console.log('📚 Módulos presentes:', hasModules ? '✅' : '❌');
        console.log('🎓 Cursos presentes:', hasCourses ? '✅' : '❌');
        console.log('➕ Botão adicionar:', hasAddButton ? '✅' : '❌');
        
        // Capturar screenshot
        console.log('\n📸 Capturando screenshot...');
        await page.screenshot({ 
          path: 'teste_versao_original.png',
          fullPage: true 
        });
        
        // Resultado final
        console.log('\n🎯 RESULTADO FINAL:');
        console.log('=' .repeat(45));
        
        if (hasModules && hasCourses) {
          console.log('🎉 SUCESSO TOTAL!');
          console.log('✅ Versão original restaurada');
          console.log('✅ Módulos carregando corretamente');
          console.log('✅ Cursos aparecendo');
          console.log('🎨 Interface original funcionando!');
        } else {
          console.log('⚠️ SUCESSO PARCIAL:');
          console.log(`📚 Módulos: ${hasModules ? '✅' : '❌'}`);
          console.log(`🎓 Cursos: ${hasCourses ? '✅' : '❌'}`);
          console.log(`➕ Botão: ${hasAddButton ? '✅' : '❌'}`);
        }
        
      } else {
        console.log('❌ Botão "Plataforma dos Sonhos" não encontrado');
      }
      
    } else {
      console.log('❌ Não conseguiu acessar o dashboard');
    }
    
    await browser.disconnect();
    console.log('\n✅ Teste finalizado!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testeVersaoOriginal(); 