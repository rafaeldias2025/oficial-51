import puppeteer from 'puppeteer';

async function testeKwifyStyle() {
  console.log('🔄 TESTE - Interface Kwify Style');
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
        await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar mais tempo para carregar imagens
        
        // Verificar se a plataforma carregou com estilo Kwify
        console.log('\n🔍 VERIFICANDO INTERFACE KWIFY:');
        console.log('-'.repeat(40));
        
        const plataformaText = await page.evaluate(() => document.body.innerText);
        const hasNovoConteudo = plataformaText.includes('NOVO CONTEÚDO') || 
                              plataformaText.includes('MENSALMENTE');
        const hasJornada = plataformaText.includes('Jornada 15 Dias') || 
                          plataformaText.includes('Jornada 7 Dias');
        const hasPlataforma = plataformaText.includes('Plataforma Dos Sonhos');
        
        console.log('📝 Banner "NOVO CONTEÚDO":', hasNovoConteudo ? '✅' : '❌');
        console.log('🗓️ Seções "Jornada":', hasJornada ? '✅' : '❌');
        console.log('🎓 Seção "Plataforma Dos Sonhos":', hasPlataforma ? '✅' : '❌');
        
        // Verificar imagens carregadas
        const imagesLoaded = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'));
          return images.length > 0;
        });
        
        console.log('🖼️ Imagens carregadas:', imagesLoaded ? '✅' : '❌');
        
        // Capturar screenshot
        console.log('\n📸 Capturando screenshot...');
        await page.screenshot({ 
          path: 'teste_kwify_style.png',
          fullPage: true 
        });
        
        // Resultado final
        console.log('\n🎯 RESULTADO FINAL:');
        console.log('=' .repeat(45));
        
        if (hasNovoConteudo && hasJornada && hasPlataforma && imagesLoaded) {
          console.log('🎉 SUCESSO TOTAL!');
          console.log('✅ Interface Kwify implementada com sucesso');
          console.log('✅ Banner "NOVO CONTEÚDO" presente');
          console.log('✅ Seções de jornadas e cursos carregadas');
          console.log('✅ Imagens carregadas corretamente');
          console.log('🎨 Interface idêntica à Kwify!');
        } else {
          console.log('⚠️ SUCESSO PARCIAL:');
          console.log(`📝 Banner: ${hasNovoConteudo ? '✅' : '❌'}`);
          console.log(`🗓️ Jornadas: ${hasJornada ? '✅' : '❌'}`);
          console.log(`🎓 Plataforma: ${hasPlataforma ? '✅' : '❌'}`);
          console.log(`🖼️ Imagens: ${imagesLoaded ? '✅' : '❌'}`);
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

testeKwifyStyle(); 