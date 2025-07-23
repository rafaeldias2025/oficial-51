import puppeteer from 'puppeteer';

async function manualVideoExtraction() {
  console.log('🔍 Abrindo navegador para extração manual de vídeos...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  
  try {
    // Acessar a página da Kiwify
    await page.goto('https://members.kiwify.com/05056cab-973b-432a-9be5-bd600e48dcd3/9f81ebfc-ac84-4c35-9257-da5667074a99/d76e6638-8a4f-4e58-89df-de70b3afaba2?club=1c686acb-0953-4f57-86db-97fe542964c2', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ Página carregada');
    console.log('📝 INSTRUÇÕES:');
    console.log('   1. Faça login na Kiwify');
    console.log('   2. Navegue até os vídeos');
    console.log('   3. Clique em cada vídeo para abrir');
    console.log('   4. Quando um vídeo aparecer, pressione ENTER no terminal');
    console.log('   5. O script vai extrair a URL do vídeo');
    console.log('   6. Repita para cada vídeo');
    console.log('   7. Digite "sair" para terminar');
    
    const allVideoUrls = [];
    
    // Loop para extrair vídeos manualmente
    while (true) {
      console.log('\n⏳ Aguardando você abrir um vídeo...');
      console.log('Pressione ENTER quando o vídeo estiver aberto, ou digite "sair" para terminar:');
      
      // Aguardar input do usuário (simulado com timeout)
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Extrair informações do vídeo atual
      const videoInfo = await page.evaluate(() => {
        const iframes = document.querySelectorAll('iframe');
        const videos = document.querySelectorAll('video');
        
        const results = [];
        
        iframes.forEach((iframe, index) => {
          results.push({
            type: 'iframe',
            index,
            src: iframe.src,
            title: iframe.title,
            width: iframe.width,
            height: iframe.height
          });
        });
        
        videos.forEach((video, index) => {
          results.push({
            type: 'video',
            index,
            src: video.src,
            poster: video.poster,
            currentSrc: video.currentSrc
          });
        });
        
        return results;
      });
      
      if (videoInfo.length > 0) {
        console.log(`\n🎥 VÍDEO ENCONTRADO:`);
        videoInfo.forEach((video, index) => {
          console.log(`   ${index + 1}. ${video.type}: ${video.src}`);
          console.log(`      title: ${video.title}`);
          
          allVideoUrls.push({
            videoUrl: video.src,
            videoTitle: video.title,
            videoType: video.type,
            timestamp: new Date().toISOString()
          });
        });
        
        // Capturar screenshot do vídeo
        await page.screenshot({ path: `video_${allVideoUrls.length}.png` });
        console.log(`📸 Screenshot salvo como "video_${allVideoUrls.length}.png"`);
        
      } else {
        console.log('❌ Nenhum vídeo encontrado na página atual');
      }
      
      // Perguntar se quer continuar
      console.log('\nDeseja continuar extraindo mais vídeos? (s/n)');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
  } catch (error) {
    console.error('❌ Erro durante a extração:', error.message);
  }
}

manualVideoExtraction(); 