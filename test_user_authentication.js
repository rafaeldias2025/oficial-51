import { chromium } from 'playwright';

async function testUserAuthentication() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testando autenticação do usuário...');
    await page.goto('http://localhost:8083/sabotadores-demo');
    await page.waitForTimeout(3000);

    // Verificar se a página carregou
    console.log('\n=== VERIFICANDO PÁGINA ===');
    const pageTitle = await page.locator('h1:has-text("Sabotadores do Emagrecimento")');
    if (await pageTitle.isVisible()) {
      console.log('✅ Página carregada com sucesso');
    } else {
      console.log('❌ Página não carregou');
    }

    // Verificar se há botão de login/logout
    console.log('\n=== VERIFICANDO AUTENTICAÇÃO ===');
    const loginButton = await page.locator('button:has-text("Login")');
    const logoutButton = await page.locator('button:has-text("Logout")');
    const userMenu = await page.locator('[data-testid="user-menu"]');
    
    if (await loginButton.isVisible()) {
      console.log('✅ Botão de login encontrado - usuário não autenticado');
      
      // Tentar fazer login (se necessário)
      await loginButton.click();
      await page.waitForTimeout(2000);
      
      // Verificar se apareceu o formulário de login
      const loginForm = await page.locator('input[type="email"]');
      if (await loginForm.isVisible()) {
        console.log('✅ Formulário de login apareceu');
        
        // Preencher dados de login (usando dados de teste)
        await loginForm.fill('test@example.com');
        const passwordInput = await page.locator('input[type="password"]');
        if (await passwordInput.isVisible()) {
          await passwordInput.fill('password123');
          
          const submitButton = await page.locator('button:has-text("Entrar")');
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(3000);
            console.log('✅ Tentativa de login realizada');
          }
        }
      }
    } else if (await logoutButton.isVisible() || await userMenu.isVisible()) {
      console.log('✅ Usuário já está autenticado');
    } else {
      console.log('⚠️ Não foi possível determinar o status de autenticação');
    }

    // Verificar se há mensagens de erro relacionadas ao usuário
    console.log('\n=== VERIFICANDO CONSOLE ===');
    const logs = await page.evaluate(() => {
      return window.console.logs || [];
    });
    
    const userErrors = logs.filter(log => 
      log.includes('usuário') || 
      log.includes('user') || 
      log.includes('autenticado') || 
      log.includes('login')
    );
    
    if (userErrors.length > 0) {
      console.log('⚠️ Erros relacionados ao usuário encontrados:', userErrors);
    } else {
      console.log('✅ Nenhum erro relacionado ao usuário encontrado');
    }

    // Tentar navegar pelas perguntas para ver se há problemas
    console.log('\n=== TESTANDO NAVEGAÇÃO ===');
    const proximaButton = await page.locator('button:has-text("Próxima")');
    if (await proximaButton.isVisible()) {
      console.log('✅ Botão "Próxima" encontrado');
      
      // Clicar algumas vezes para navegar pelas perguntas
      for (let i = 0; i < 3; i++) {
        if (await proximaButton.isVisible()) {
          await proximaButton.click();
          await page.waitForTimeout(1000);
          console.log(`✅ Navegou para pergunta ${i + 2}`);
        } else {
          console.log(`⚠️ Botão "Próxima" não encontrado na pergunta ${i + 2}`);
          break;
        }
      }
    } else {
      console.log('❌ Botão "Próxima" não encontrado');
    }

    // Verificar se há botão "Finalizar"
    console.log('\n=== VERIFICANDO FINALIZAÇÃO ===');
    const finalizarButton = await page.locator('button:has-text("Finalizar")');
    if (await finalizarButton.isVisible()) {
      console.log('✅ Botão "Finalizar" encontrado');
      
      // Tentar clicar no botão finalizar para ver se há erro de usuário
      await finalizarButton.click();
      await page.waitForTimeout(2000);
      
      // Verificar se apareceu algum alerta ou erro
      const alert = await page.locator('.alert, .error, [role="alert"]');
      if (await alert.isVisible()) {
        const alertText = await alert.textContent();
        console.log('⚠️ Alerta encontrado:', alertText);
      } else {
        console.log('✅ Nenhum alerta encontrado ao finalizar');
      }
    } else {
      console.log('❌ Botão "Finalizar" não encontrado');
    }

    // Tirar screenshot
    await page.screenshot({ path: 'test_user_authentication.png' });
    console.log('\n📸 Screenshot salvo como test_user_authentication.png');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    await page.screenshot({ path: 'error_user_authentication.png' });
  } finally {
    await browser.close();
  }
}

testUserAuthentication(); 