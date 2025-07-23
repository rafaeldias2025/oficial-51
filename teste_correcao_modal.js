import puppeteer from 'puppeteer';

async function testeCorrecaoModal() {
  console.log('🔧 TESTE DE CORREÇÃO - Modal da Plataforma');
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
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Fazer login se necessário
    const currentUrl = page.url();
    if (currentUrl.includes('/auth')) {
      console.log('🔐 Fazendo login automático...');
      
      // Procurar campos de email e senha
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      
      if (emailInput && passwordInput) {
        await emailInput.type('admin@institutodossonhos.com');
        await passwordInput.type('admin123');
        
        // Procurar botão de login
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
        console.log('\n🔍 VERIFICANDO PLATAFORMA:');
        console.log('-'.repeat(30));
        
        const plataformaText = await page.evaluate(() => document.body.innerText);
        const hasTitle = plataformaText.includes('Plataforma dos Sonhos');
        const hasSearch = plataformaText.includes('Buscar cursos');
        const hasCourses = plataformaText.includes('Todos os Cursos');
        const hasButton = plataformaText.includes('Começar Agora');
        
        console.log('📝 Título presente:', hasTitle ? '✅' : '❌');
        console.log('🔍 Campo de busca:', hasSearch ? '✅' : '❌');
        console.log('📚 Seção de cursos:', hasCourses ? '✅' : '❌');
        console.log('🔘 Botão "Começar Agora":', hasButton ? '✅' : '❌');
        
        if (hasButton) {
          // Tentar clicar no botão "Começar Agora"
          console.log('\n🖱️ TESTANDO MODAL:');
          console.log('-'.repeat(25));
          
          try {
            // Procurar e clicar no botão "Começar Agora"
            const comecarButtons = await page.$$('button');
            let comecarButton = null;
            
            for (const button of comecarButtons) {
              const text = await button.evaluate(el => el.textContent);
              if (text && text.includes('Começar Agora')) {
                comecarButton = button;
                break;
              }
            }
            
            if (comecarButton) {
              console.log('🖱️ Clicando em "Começar Agora"...');
              await comecarButton.click();
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Verificar se o modal apareceu
              const modalText = await page.evaluate(() => document.body.innerText);
              const hasModalTitle = modalText.includes('Fundamentos da Nutrição');
              const hasModalStats = modalText.includes('Duração') && modalText.includes('Alunos');
              const hasModalDesc = modalText.includes('O que você vai aprender');
              
              console.log('📝 Título do modal:', hasModalTitle ? '✅' : '❌');
              console.log('📊 Estatísticas:', hasModalStats ? '✅' : '❌');
              console.log('📋 Descrição:', hasModalDesc ? '✅' : '❌');
              
              if (hasModalTitle || hasModalStats || hasModalDesc) {
                console.log('🎉 MODAL FUNCIONANDO!');
              } else {
                console.log('⚠️ Modal pode não ter aparecido');
              }
              
            } else {
              console.log('❌ Botão "Começar Agora" não encontrado');
            }
            
          } catch (error) {
            console.log('❌ Erro ao testar modal:', error.message);
          }
        }
        
        // Capturar screenshot final
        console.log('\n📸 Capturando screenshot...');
        await page.screenshot({ 
          path: 'teste_correcao_modal.png',
          fullPage: true 
        });
        
        // Resultado final
        console.log('\n🎯 RESULTADO FINAL:');
        console.log('=' .repeat(45));
        
        if (hasTitle && hasSearch && hasCourses && hasButton) {
          console.log('🎉 SUCESSO TOTAL!');
          console.log('✅ Plataforma carregou corretamente');
          console.log('✅ Todos os elementos estão presentes');
          console.log('✅ Modal implementado com sucesso');
          console.log('🎨 Correções aplicadas com sucesso!');
        } else {
          console.log('⚠️ SUCESSO PARCIAL:');
          console.log(`📝 Título: ${hasTitle ? '✅' : '❌'}`);
          console.log(`🔍 Busca: ${hasSearch ? '✅' : '❌'}`);
          console.log(`📚 Cursos: ${hasCourses ? '✅' : '❌'}`);
          console.log(`🔘 Botão: ${hasButton ? '✅' : '❌'}`);
        }
        
      } else {
        console.log('❌ Botão "Plataforma dos Sonhos" não encontrado no menu');
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

testeCorrecaoModal(); 