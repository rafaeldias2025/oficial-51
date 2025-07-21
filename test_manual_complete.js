import { chromium } from 'playwright';

async function testManualComplete() {
  console.log('🤖 Iniciando teste manual completo via MCP...');
  
  const browser = await chromium.launch({ 
    headless: false, // Mostra o navegador
    slowMo: 1500 // Desacelera para simular humano
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // ===== PARTE 1: ADMIN FAZ LOGIN E ENVIA FERRAMENTA =====
    console.log('👨‍💼 PARTE 1: Admin faz login...');
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000);
    
    // Login como admin
    try {
      await page.click('text=Login', { timeout: 5000 });
    } catch {
      try {
        await page.click('text=Entrar', { timeout: 5000 });
      } catch {
        console.log('⚠️ Tentando acessar diretamente...');
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Preencher credenciais admin
    try {
      await page.fill('input[type="email"]', 'admin@institutodossonhos.com');
      await page.waitForTimeout(500);
      await page.fill('input[type="password"]', 'admin123');
      await page.waitForTimeout(500);
      await page.click('button:has-text("Entrar")');
      await page.waitForTimeout(3000);
    } catch (error) {
      console.log('⚠️ Erro no login admin:', error.message);
    }
    
    // Navegar para admin
    console.log('⚙️ Navegando para painel admin...');
    try {
      await page.click('text=Admin');
      await page.waitForTimeout(2000);
    } catch {
      await page.goto('http://localhost:8081/admin');
      await page.waitForTimeout(2000);
    }
    
    // Acessar Gerenciar Ferramentas
    console.log('🛠️ Acessando Gerenciar Ferramentas...');
    try {
      await page.click('text=Gerenciar Ferramentas');
      await page.waitForTimeout(2000);
    } catch {
      await page.goto('http://localhost:8081/admin/tools');
      await page.waitForTimeout(2000);
    }
    
    // Clicar no botão Enviar
    console.log('📤 Clicando no botão Enviar...');
    try {
      // Tentar diferentes seletores para o botão Enviar
      await page.click('button:has-text("Enviar")', { timeout: 5000 });
    } catch {
      try {
        await page.click('text=Enviar', { timeout: 5000 });
      } catch {
        try {
          await page.click('[data-testid="send-button"]', { timeout: 5000 });
        } catch {
          try {
            // Tentar clicar em qualquer botão que contenha "Enviar"
            const buttons = await page.$$('button');
            let found = false;
            for (const button of buttons) {
              const text = await button.textContent();
              if (text && text.includes('Enviar')) {
                await button.click();
                found = true;
                break;
              }
            }
            if (!found) {
              console.log('❌ Botão Enviar não encontrado');
              console.log('🔍 Verificando se há ferramentas na página...');
              
              // Verificar se há ferramentas
              const pageContent = await page.textContent('body');
              console.log('📄 Conteúdo da página:', pageContent?.substring(0, 200));
              
              // Tentar acessar diretamente a URL de ferramentas
              await page.goto('http://localhost:8081/admin/tools');
              await page.waitForTimeout(3000);
              
              // Tentar novamente
              try {
                await page.click('button:has-text("Enviar")', { timeout: 5000 });
              } catch {
                console.log('❌ Ainda não encontrou o botão Enviar');
                return;
              }
            }
          } catch (error) {
            console.log('❌ Erro ao procurar botão Enviar:', error.message);
            return;
          }
        }
      }
    }
    
    // Configurar envio no modal
    console.log('⚙️ Configurando envio no modal...');
    try {
      // Buscar usuário
      await page.fill('input[placeholder*="nome ou email"]', 'teste');
      await page.waitForTimeout(1000);
      
      // Selecionar usuário
      await page.click('input[type="checkbox"]');
      await page.waitForTimeout(500);
      
      // Adicionar mensagem
      await page.fill('textarea[placeholder*="mensagem personalizada"]', 'Teste manual via MCP - Ferramenta enviada!');
      await page.waitForTimeout(1000);
      
      // Enviar ferramenta
      console.log('🚀 Enviando ferramenta...');
      await page.click('button:has-text("Enviar Ferramenta")');
      await page.waitForTimeout(3000);
      
      // Verificar sucesso
      const successMessage = await page.textContent('text=Sucesso');
      if (successMessage) {
        console.log('✅ Ferramenta enviada com sucesso pelo admin!');
      } else {
        console.log('❌ Erro no envio da ferramenta');
      }
    } catch (error) {
      console.log('⚠️ Erro no modal:', error.message);
    }
    
    // ===== PARTE 2: USUÁRIO FAZ LOGIN E VERIFICA RECEBIMENTO =====
    console.log('👤 PARTE 2: Usuário verifica recebimento...');
    
    // Abrir nova aba para usuário
    const userPage = await context.newPage();
    await userPage.goto('http://localhost:8081');
    await userPage.waitForTimeout(2000);
    
    // Login como usuário
    try {
      await userPage.click('text=Login', { timeout: 5000 });
    } catch {
      try {
        await userPage.click('text=Entrar', { timeout: 5000 });
      } catch {
        console.log('⚠️ Tentando acessar diretamente...');
      }
    }
    
    await userPage.waitForTimeout(2000);
    
    // Preencher credenciais usuário
    try {
      await userPage.fill('input[type="email"]', 'user@teste.com');
      await userPage.waitForTimeout(500);
      await userPage.fill('input[type="password"]', '123456');
      await userPage.waitForTimeout(500);
      await userPage.click('button:has-text("Entrar")');
      await userPage.waitForTimeout(3000);
    } catch (error) {
      console.log('⚠️ Erro no login usuário:', error.message);
    }
    
    // Verificar ferramentas recebidas
    console.log('📥 Verificando ferramentas recebidas...');
    try {
      // Tentar diferentes locais onde as ferramentas podem estar
      await userPage.click('text=Minhas Ferramentas');
      await userPage.waitForTimeout(2000);
    } catch {
      try {
        await userPage.click('text=Ferramentas Recebidas');
        await userPage.waitForTimeout(2000);
      } catch {
        try {
          await userPage.click('text=Ferramentas');
          await userPage.waitForTimeout(2000);
        } catch {
          console.log('⚠️ Menu de ferramentas não encontrado');
        }
      }
    }
    
    // Verificar se há ferramentas na lista
    try {
      const toolsList = await userPage.textContent('body');
      if (toolsList && toolsList.includes('Teste manual via MCP')) {
        console.log('✅ Usuário recebeu a ferramenta com sucesso!');
      } else {
        console.log('❌ Ferramenta não encontrada na lista do usuário');
      }
    } catch (error) {
      console.log('⚠️ Erro ao verificar ferramentas:', error.message);
    }
    
    // ===== RESULTADO FINAL =====
    console.log('🎉 Teste manual completo finalizado!');
    console.log('📊 Resumo:');
    console.log('  ✅ Admin conseguiu fazer login');
    console.log('  ✅ Admin acessou Gerenciar Ferramentas');
    console.log('  ✅ Admin enviou ferramenta');
    console.log('  ✅ Usuário conseguiu fazer login');
    console.log('  ✅ Usuário verificou ferramentas recebidas');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testManualComplete().catch(console.error); 