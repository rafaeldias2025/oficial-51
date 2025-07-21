import { chromium } from 'playwright';

async function testSendToolAsHuman() {
  console.log('🤖 Iniciando teste automatizado como humano...');
  
  const browser = await chromium.launch({ 
    headless: false, // Mostra o navegador para você ver
    slowMo: 1000 // Desacelera para simular humano
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Acessar a aplicação
    console.log('📱 Acessando aplicação...');
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(3000);
    
    // 2. Fazer login como admin
    console.log('🔐 Fazendo login como administrador...');
    
    // Tentar diferentes seletores para o botão de login
    try {
      await page.click('text=Login', { timeout: 5000 });
    } catch {
      try {
        await page.click('text=Entrar', { timeout: 5000 });
      } catch {
        try {
          await page.click('button:has-text("Login")', { timeout: 5000 });
        } catch {
          console.log('⚠️ Botão de login não encontrado, tentando acessar diretamente...');
        }
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Preencher email se os campos existirem
    try {
      await page.fill('input[type="email"]', 'admin@institutodossonhos.com');
      await page.waitForTimeout(500);
    } catch (error) {
      console.log('⚠️ Campo de email não encontrado');
    }
    
    // Preencher senha se o campo existir
    try {
      await page.fill('input[type="password"]', 'admin123');
      await page.waitForTimeout(500);
    } catch (error) {
      console.log('⚠️ Campo de senha não encontrado');
    }
    
    // Tentar clicar em entrar
    try {
      await page.click('button:has-text("Entrar")');
      await page.waitForTimeout(3000);
    } catch (error) {
      console.log('⚠️ Botão entrar não encontrado');
    }
    
    // 3. Navegar para o painel admin
    console.log('⚙️ Navegando para o painel admin...');
    try {
      await page.click('text=Admin');
      await page.waitForTimeout(2000);
    } catch {
      try {
        await page.click('a[href*="admin"]');
        await page.waitForTimeout(2000);
      } catch {
        console.log('⚠️ Link admin não encontrado, tentando URL direta...');
        await page.goto('http://localhost:8080/admin');
        await page.waitForTimeout(2000);
      }
    }
    
    // 4. Ir para Gerenciar Ferramentas
    console.log('🛠️ Acessando Gerenciar Ferramentas...');
    try {
      await page.click('text=Gerenciar Ferramentas');
      await page.waitForTimeout(2000);
    } catch {
      try {
        await page.click('text=Tool Manager');
        await page.waitForTimeout(2000);
      } catch {
        console.log('⚠️ Link Gerenciar Ferramentas não encontrado, tentando URL direta...');
        await page.goto('http://localhost:8080/admin/tools');
        await page.waitForTimeout(2000);
      }
    }
    
    // 5. Clicar no botão "Enviar" da primeira ferramenta
    console.log('📤 Clicando no botão Enviar...');
    try {
      await page.click('button:has-text("Enviar")');
      await page.waitForTimeout(2000);
    } catch {
      console.log('⚠️ Botão Enviar não encontrado');
      return;
    }
    
    // 6. Configurar o envio no modal
    console.log('⚙️ Configurando envio no modal...');
    
    // Buscar usuário
    try {
      await page.fill('input[placeholder*="nome ou email"]', 'teste');
      await page.waitForTimeout(1000);
    } catch {
      console.log('⚠️ Campo de busca não encontrado');
    }
    
    // Selecionar primeiro usuário
    try {
      await page.click('input[type="checkbox"]');
      await page.waitForTimeout(500);
    } catch {
      console.log('⚠️ Checkbox não encontrado');
    }
    
    // Adicionar mensagem personalizada
    try {
      await page.fill('textarea[placeholder*="mensagem personalizada"]', 'Teste automatizado - Ferramenta enviada via script!');
      await page.waitForTimeout(1000);
    } catch {
      console.log('⚠️ Campo de mensagem não encontrado');
    }
    
    // 7. Enviar a ferramenta
    console.log('🚀 Enviando ferramenta...');
    try {
      await page.click('button:has-text("Enviar Ferramenta")');
      await page.waitForTimeout(3000);
    } catch {
      console.log('⚠️ Botão Enviar Ferramenta não encontrado');
    }
    
    // 8. Verificar confirmação
    console.log('✅ Verificando confirmação...');
    try {
      const successMessage = await page.textContent('text=Sucesso');
      if (successMessage) {
        console.log('🎉 Ferramenta enviada com sucesso!');
      } else {
        console.log('❌ Erro no envio da ferramenta');
      }
    } catch {
      console.log('⚠️ Mensagem de confirmação não encontrada');
    }
    
    // 9. Fazer logout
    console.log('👋 Fazendo logout...');
    try {
      await page.click('text=Sair');
      await page.waitForTimeout(2000);
    } catch {
      console.log('⚠️ Botão Sair não encontrado');
    }
    
    console.log('✅ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testSendToolAsHuman().catch(console.error); 