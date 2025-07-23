import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function startChromeDebug() {
  console.log('🚀 Iniciando Chrome com debug...');
  
  try {
    // Fechar Chrome existente
    console.log('🔄 Fechando Chrome existente...');
    await execAsync('pkill -f "Google Chrome"');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Abrir Chrome com debug
    console.log('🖥️ Abrindo Chrome com debug na porta 9222...');
    await execAsync('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug');
    
    console.log('✅ Chrome iniciado com debug!');
    console.log('💡 Agora você pode executar os testes de captura');
    
  } catch (error) {
    console.error('❌ Erro ao iniciar Chrome:', error);
  }
}

startChromeDebug(); 