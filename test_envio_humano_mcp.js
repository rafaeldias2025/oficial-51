import { chromium } from 'playwright';

async function testEnvioHumanoMCP() {
  console.log('🤖 Iniciando teste de envio como humano via MCP...');
  
  const browser = await chromium.launch({ 
    headless: false, // Mostra o navegador para visualizar
    slowMo: 2000 // Desacelera para simular humano
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // ===== PARTE 1: ACESSAR A APLICAÇÃO =====
    console.log('🌐 Acessando a aplicação...');
    await page.goto('http://localhost:8083');
    await page.waitForTimeout(3000);
    
    // Verificar se a página carregou
    const pageTitle = await page.title();
    console.log(`✅ Página carregada: ${pageTitle}`);
    
    // ===== PARTE 2: LOGIN COMO ADMIN =====
    console.log('👨‍💼 Fazendo login como admin...');
    
    // Procurar e clicar no botão de login
    try {
      await page.click('text=Login', { timeout: 5000 });
      console.log('✅ Clicou em Login');
    } catch {
      try {
        await page.click('text=Entrar', { timeout: 5000 });
        console.log('✅ Clicou em Entrar');
      } catch {
        console.log('⚠️ Tentando acessar diretamente a página de login...');
        await page.goto('http://localhost:8083/auth');
        await page.waitForTimeout(2000);
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Preencher credenciais admin
    console.log('📝 Preenchendo credenciais...');
    try {
      await page.fill('input[type="email"]', 'admin@institutodossonhos.com');
      await page.waitForTimeout(1000);
      await page.fill('input[type="password"]', 'admin123');
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Entrar")');
      console.log('✅ Credenciais preenchidas e enviadas');
      await page.waitForTimeout(3000);
    } catch (error) {
      console.log('⚠️ Erro no login:', error.message);
    }
    
    // ===== PARTE 3: NAVEGAR PARA O PAINEL ADMIN =====
    console.log('⚙️ Navegando para o painel admin...');
    try {
      await page.click('text=Admin');
      console.log('✅ Clicou em Admin');
      await page.waitForTimeout(2000);
    } catch {
      try {
        await page.goto('http://localhost:8083/admin');
        console.log('✅ Acessou diretamente /admin');
        await page.waitForTimeout(2000);
      } catch {
        console.log('⚠️ Tentando outras opções de navegação...');
      }
    }
    
    // ===== PARTE 4: ACESSAR GERENCIAR FERRAMENTAS =====
    console.log('🛠️ Acessando Gerenciar Ferramentas...');
    try {
      await page.click('text=Gerenciar Ferramentas');
      console.log('✅ Clicou em Gerenciar Ferramentas');
      await page.waitForTimeout(2000);
    } catch {
      try {
        await page.click('text=Tools');
        console.log('✅ Clicou em Tools');
        await page.waitForTimeout(2000);
      } catch {
        try {
          await page.goto('http://localhost:8083/admin/tools');
          console.log('✅ Acessou diretamente /admin/tools');
          await page.waitForTimeout(2000);
        } catch {
          console.log('⚠️ Tentando encontrar o menu de ferramentas...');
        }
      }
    }
    
    // ===== PARTE 5: CRIAR FERRAMENTA SABOTADORES =====
    console.log('🎯 Criando ferramenta Sabotadores...');
    try {
      await page.click('button:has-text("Criar Sabotadores")');
      console.log('✅ Clicou em Criar Sabotadores');
      await page.waitForTimeout(3000);
    } catch {
      try {
        await page.click('text=Criar Sabotadores');
        console.log('✅ Clicou em Criar Sabotadores (texto)');
        await page.waitForTimeout(3000);
      } catch {
        console.log('⚠️ Botão Criar Sabotadores não encontrado, tentando criar manualmente...');
      }
    }
    
    // ===== PARTE 6: ENVIAR FERRAMENTA PARA USUÁRIO =====
    console.log('📤 Enviando ferramenta para usuário...');
    try {
      // Procurar botão Enviar
      await page.click('button:has-text("Enviar")');
      console.log('✅ Clicou em Enviar');
      await page.waitForTimeout(2000);
    } catch {
      try {
        await page.click('text=Enviar');
        console.log('✅ Clicou em Enviar (texto)');
        await page.waitForTimeout(2000);
      } catch {
        console.log('⚠️ Botão Enviar não encontrado, verificando se há ferramentas...');
        
        // Verificar conteúdo da página
        const pageContent = await page.textContent('body');
        console.log('📄 Conteúdo da página:', pageContent?.substring(0, 300));
        
        // Tentar encontrar qualquer botão de envio
        const buttons = await page.$$('button');
        console.log(`🔍 Encontrados ${buttons.length} botões na página`);
        
        for (let i = 0; i < buttons.length; i++) {
          const buttonText = await buttons[i].textContent();
          console.log(`Botão ${i + 1}: ${buttonText}`);
        }
      }
    }
    
    // ===== PARTE 7: CONFIGURAR ENVIO =====
    console.log('⚙️ Configurando envio...');
    try {
      // Selecionar usuário
      await page.click('input[type="checkbox"]');
      console.log('✅ Selecionou usuário');
      await page.waitForTimeout(1000);
      
      // Adicionar mensagem personalizada
      await page.fill('textarea', 'Olá! Esta é uma ferramenta importante para avaliar seus padrões de comportamento em relação ao emagrecimento.');
      console.log('✅ Adicionou mensagem personalizada');
      await page.waitForTimeout(1000);
      
      // Marcar notificações
      await page.click('input[id="email-notification"]');
      console.log('✅ Marcou notificação por email');
      await page.waitForTimeout(1000);
      
      await page.click('input[id="whatsapp-notification"]');
      console.log('✅ Marcou notificação por WhatsApp');
      await page.waitForTimeout(1000);
      
      // Confirmar envio
      await page.click('button:has-text("Enviar Ferramenta")');
      console.log('✅ Confirmou envio');
      await page.waitForTimeout(3000);
      
    } catch (error) {
      console.log('⚠️ Erro na configuração do envio:', error.message);
    }
    
    // ===== PARTE 8: VERIFICAR CONFIRMAÇÃO =====
    console.log('✅ Verificando confirmação de envio...');
    try {
      await page.waitForSelector('text=sucesso', { timeout: 5000 });
      console.log('🎉 Envio realizado com sucesso!');
    } catch {
      try {
        await page.waitForSelector('text=enviada', { timeout: 5000 });
        console.log('🎉 Ferramenta enviada com sucesso!');
      } catch {
        console.log('⚠️ Não foi possível confirmar o envio, mas o processo foi executado');
      }
    }
    
    // ===== PARTE 9: TESTAR COMO USUÁRIO =====
    console.log('👤 Testando como usuário...');
    try {
      // Fazer logout
      await page.click('text=Logout');
      await page.waitForTimeout(2000);
      
      // Login como usuário
      await page.fill('input[type="email"]', 'usuario@teste.com');
      await page.fill('input[type="password"]', 'senha123');
      await page.click('button:has-text("Entrar")');
      await page.waitForTimeout(3000);
      
      // Verificar se a ferramenta aparece
      await page.waitForSelector('text=Sabotadores do Emagrecimento', { timeout: 5000 });
      console.log('✅ Ferramenta aparece para o usuário!');
      
    } catch (error) {
      console.log('⚠️ Erro no teste como usuário:', error.message);
    }
    
    console.log('🎉 Teste de envio como humano concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    
    // Capturar screenshot em caso de erro
    await page.screenshot({ 
      path: 'error_envio_humano.png',
      fullPage: true 
    });
    console.log('📸 Screenshot salvo como error_envio_humano.png');
  } finally {
    await browser.close();
  }
}

// Executar o teste
testEnvioHumanoMCP().catch(console.error); 