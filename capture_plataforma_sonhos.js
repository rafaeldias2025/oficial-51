import puppeteer from 'puppeteer';

async function capturePlataformaSonhos() {
  console.log('📸 Capturando plataforma dos sonhos...');
  
  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null
    });
    
    console.log('✅ Conectado ao Chrome existente!');
    
    const pages = await browser.pages();
    let page = pages[0] || await browser.newPage();
    
    // 1. Navegar para a página de login
    console.log('📱 Navegando para http://localhost:5173/auth...');
    await page.goto('http://localhost:5173/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log('🔗 URL atual:', currentUrl);
    
    // 2. Fazer login
    if (currentUrl.includes('/auth')) {
      console.log('🔐 Fazendo login...');
      
      // Procurar campos de login
      const emailInput = await page.$('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]');
      const passwordInput = await page.$('input[type="password"]');
      
      // Procurar botão de login
      const buttons = await page.$$('button');
      let loginButton = null;
      
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && text.includes('Entrar')) {
          loginButton = button;
          break;
        }
      }
      
      if (emailInput && passwordInput && loginButton) {
        console.log('✅ Campos de login encontrados');
        
        // Preencher credenciais
        await emailInput.type('admin@institutodossonhos.com');
        await passwordInput.type('admin123');
        
        console.log('📝 Credenciais preenchidas');
        
        // Clicar em entrar
        await loginButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('✅ Login realizado');
        
        // 3. Navegar para dashboard
        console.log('📱 Navegando para dashboard...');
        await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const dashboardUrl = page.url();
        console.log('🔗 URL do dashboard:', dashboardUrl);
        
        // 4. Procurar pelo botão "Plataforma dos Sonhos"
        console.log('🔍 Procurando pelo botão "Plataforma dos Sonhos"...');
        const dashboardButtons = await page.$$('button');
        let plataformaButton = null;
        
        for (const button of dashboardButtons) {
          const text = await button.evaluate(el => el.textContent);
          if (text && text.includes('Plataforma dos Sonhos')) {
            plataformaButton = button;
            console.log('✅ Encontrou o botão "Plataforma dos Sonhos"!');
            break;
          }
        }
        
        if (plataformaButton) {
          // 5. Clicar no botão
          console.log('🖱️ Clicando no botão "Plataforma dos Sonhos"...');
          await plataformaButton.click();
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // 6. Capturar screenshot
          console.log('📸 Capturando screenshot...');
          await page.screenshot({ 
            path: 'plataforma_sonhos_atual.png',
            fullPage: true 
          });
          
          console.log('✅ Screenshot salvo como "plataforma_sonhos_atual.png"');
          
          // 7. Listar elementos da página
          console.log('🔍 Elementos encontrados na página:');
          const allButtons = await page.$$('button');
          const allTexts = await page.$$('h1, h2, h3, p');
          
          console.log(`📋 Botões: ${allButtons.length}`);
          console.log(`📋 Textos: ${allTexts.length}`);
          
          for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
            const buttonText = await allButtons[i].evaluate(el => el.textContent);
            console.log(`  Botão ${i + 1}: "${buttonText}"`);
          }
          
        } else {
          console.log('❌ Botão "Plataforma dos Sonhos" não encontrado');
          
          // Listar todos os botões para debug
          console.log('🔍 Botões encontrados na página:');
          for (let i = 0; i < dashboardButtons.length; i++) {
            const buttonText = await dashboardButtons[i].evaluate(el => el.textContent);
            console.log(`  ${i + 1}. "${buttonText}"`);
          }
        }
        
      } else {
        console.log('❌ Campos de login não encontrados');
      }
      
    } else {
      console.log('❌ Não está na página de login');
    }
    
    await browser.disconnect();
    console.log('✅ Desconectado do Chrome');
    
  } catch (error) {
    console.error('❌ Erro durante a captura:', error);
  }
}

capturePlataformaSonhos(); 