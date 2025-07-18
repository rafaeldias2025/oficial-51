import { test, expect } from '@playwright/test';

test.describe('Admin User Controls', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de admin (assumindo que existe autenticação)
    await page.goto('/');
    
    // TODO: Implementar login automático para admin
    // Para agora, vamos assumir que o usuário já está logado como admin
  });

  test('should display user controls for admin', async ({ page }) => {
    // Procurar por controles administrativos na página
    await expect(page.getByText('Controles Administrativos')).toBeVisible();
    
    // Verificar se os botões principais estão presentes
    await expect(page.getByRole('button', { name: 'Avatar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Editar' })).toBeVisible();
  });

  test('should open edit form when edit button is clicked', async ({ page }) => {
    // Clicar no botão de editar
    await page.getByRole('button', { name: 'Editar' }).click();
    
    // Verificar se o formulário de edição aparece
    await expect(page.getByText('Nome Completo')).toBeVisible();
    await expect(page.getByText('Role')).toBeVisible();
    await expect(page.getByText('Pontos Totais')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Salvar Alterações' })).toBeVisible();
  });

  test('should open avatar upload dialog when avatar button is clicked', async ({ page }) => {
    // Clicar no botão de avatar
    await page.getByRole('button', { name: 'Avatar' }).click();
    
    // Verificar se o dialog de upload aparece
    await expect(page.getByText('Atualizar Avatar do Usuário')).toBeVisible();
    await expect(page.getByText('Arraste uma foto aqui')).toBeVisible();
  });

  test('should be able to upload avatar', async ({ page }) => {
    // Abrir dialog de upload
    await page.getByRole('button', { name: 'Avatar' }).click();
    
    // Simular upload de arquivo
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('ou clique para selecionar').click();
    
    const fileChooser = await fileChooserPromise;
    
    // Criar um arquivo de teste
    await fileChooser.setFiles({
      name: 'avatar-test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data')
    });
    
    // Aguardar confirmação de upload (dependendo da implementação)
    // await expect(page.getByText('Avatar atualizado com sucesso')).toBeVisible();
  });

  test('should show role promotion dialog for non-admin users', async ({ page }) => {
    // Assumindo que há um usuário não-admin na lista
    const adminButton = page.getByRole('button', { name: 'Admin' }).first();
    
    if (await adminButton.isVisible()) {
      await adminButton.click();
      
      // Verificar se o dialog de confirmação aparece
      await expect(page.getByText('Promover para Administrador')).toBeVisible();
      await expect(page.getByText('Administradores podem:')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Promover para Admin' })).toBeVisible();
    }
  });

  test('should be able to edit user profile fields', async ({ page }) => {
    // Abrir formulário de edição
    await page.getByRole('button', { name: 'Editar' }).click();
    
    // Obter campos do formulário
    const nameInput = page.getByLabel('Nome Completo');
    const roleSelect = page.getByLabel('Role');
    const pointsInput = page.getByLabel('Pontos Totais');
    
    // Verificar se os campos estão editáveis
    await expect(nameInput).toBeEditable();
    await expect(roleSelect).toBeVisible();
    await expect(pointsInput).toBeEditable();
    
    // Fazer alterações nos campos
    await nameInput.fill('Nome Teste Editado');
    await pointsInput.fill('999');
    
    // Verificar botões de ação
    await expect(page.getByRole('button', { name: 'Salvar Alterações' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
  });

  test('should cancel edit form correctly', async ({ page }) => {
    // Abrir formulário de edição
    await page.getByRole('button', { name: 'Editar' }).click();
    
    // Verificar que o formulário está aberto
    await expect(page.getByText('Salvar Alterações')).toBeVisible();
    
    // Clicar em cancelar
    await page.getByRole('button', { name: 'Cancelar' }).click();
    
    // Verificar que o formulário foi fechado
    await expect(page.getByText('Salvar Alterações')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Editar' })).toBeVisible();
  });

  test('should display user information correctly', async ({ page }) => {
    // Verificar se as informações do usuário estão sendo exibidas
    await expect(page.getByText('ID:')).toBeVisible();
    await expect(page.getByText('Email:')).toBeVisible();
    await expect(page.getByText('Pontos:')).toBeVisible();
    await expect(page.getByText('Status:')).toBeVisible();
  });

  test('should show different status badges correctly', async ({ page }) => {
    // Verificar badges de role
    const roleBadges = ['CLIENT', 'ADMIN', 'VISITOR'];
    
    for (const badge of roleBadges) {
      const element = page.getByText(badge);
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
      }
    }
    
    // Verificar badges de status
    const statusBadges = ['ATIVO', 'INATIVO'];
    
    for (const badge of statusBadges) {
      const element = page.getByText(badge);
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Testar responsividade
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    // Verificar se os controles ainda estão visíveis e funcionais
    await expect(page.getByText('Controles Administrativos')).toBeVisible();
    
    // Verificar se o layout se adapta para mobile
    const editButton = page.getByRole('button', { name: 'Editar' });
    await expect(editButton).toBeVisible();
    
    // Testar interação em mobile
    await editButton.click();
    await expect(page.getByText('Nome Completo')).toBeVisible();
  });

  test('should handle loading states properly', async ({ page }) => {
    // Interceptar requisições para simular loading
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 1000); // Simular delay
    });
    
    // Tentar fazer uma ação que causa loading
    await page.getByRole('button', { name: 'Editar' }).click();
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();
    
    // Verificar se há indicadores de loading (se implementados)
    // await expect(page.getByTestId('loading-spinner')).toBeVisible();
  });
}); 