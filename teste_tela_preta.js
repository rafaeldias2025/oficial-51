import puppeteer from 'puppeteer';

async function testeTelaCorrigida() {
  console.log('🔄 TESTE - Correção da Tela Preta');
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
      console.log('\n🔍 VERIFICANDO CONTEÚDO:');
      console.log('-'.repeat(40));
      
      // Capturar screenshot
      console.log('\n📸 Capturando screenshot...');
      await page.screenshot({ 
        path: 'tela_corrigida.png',
        fullPage: true 
      });
      
      // Verificar se o texto NOVO CONTEÚDO está visível
      const textoVisivel = await page.evaluate(() => {
        const elementos = Array.from(document.querySelectorAll('h1, h2'));
        return elementos.some(el => 
          el.innerText.includes('NOVO CONTEÚDO') || 
          el.innerText.includes('MENSALMENTE')
        );
      });
      
      console.log('📝 Texto "NOVO CONTEÚDO" visível:', textoVisivel ? '✅' : '❌');
      
      if (textoVisivel) {
        console.log('\n🎉 SUCESSO! A tela não está mais preta.');
      } else {
        console.log('\n⚠️ ATENÇÃO: O texto principal ainda não está visível.');
      }
    } else {
      console.log('❌ Botão "Plataforma dos Sonhos" não encontrado');
    }
    
    await browser.disconnect();
    console.log('\n✅ Teste finalizado!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testeTelaCorrigida(); 