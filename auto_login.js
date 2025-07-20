// Script para automatizar login no sistema
// Execute este script no console do navegador (F12)

console.log('🤖 Automatizando login...');

// Preencher campos de login
const emailField = document.querySelector('input[type="email"], input[name="email"], #email');
const passwordField = document.querySelector('input[type="password"], input[name="password"], #password');
const loginButton = document.querySelector('button[type="submit"], input[type="submit"], button:contains("Entrar")');

if (emailField && passwordField) {
    emailField.value = 'admin@sonhos.com';
    passwordField.value = 'admin123';
    
    console.log('✅ Campos preenchidos!');
    console.log('📧 Email: admin@sonhos.com');
    console.log('🔒 Senha: admin123');
    
    if (loginButton) {
        console.log('🚀 Clicando em entrar...');
        loginButton.click();
    } else {
        console.log('⚠️ Botão de login não encontrado. Pressione Enter ou clique manualmente.');
    }
} else {
    console.log('❌ Campos de login não encontrados');
    console.log('🔍 Elementos encontrados:', {
        email: !!emailField,
        password: !!passwordField,
        button: !!loginButton
    });
}
