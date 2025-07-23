import puppeteer from 'puppeteer';

async function extractVideoUrlsFromCurrentPage() {
  console.log('🔍 Extraindo URLs de vídeos da página atual da Kiwify...');
  
  try {
    // Abrir novo navegador
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--remote-debugging-port=9222']
    });
    
    const page = await browser.newPage();
    await page.goto('https://dashboard.kiwify.com/members-area/1c686acb-0953-4f57-86db-97fe542964c2?tab=courses&course=83b472c7-a1ab-4de4-9fb8-9a61faf62a4e');
    
    console.log('⏳ Aguardando você fazer login...');
    console.log('⏳ Aguardando 30 segundos...');
    
    // Usar setTimeout em vez de waitForTimeout
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    console.log('🔍 Analisando a página em busca de vídeos...');
    
    // Extrair URLs de vídeos
    const videoUrls = await page.evaluate(() => {
      const urls = [];
      
      // Procurar por elementos de vídeo
      const videoElements = document.querySelectorAll('video');
      console.log(`Encontrados ${videoElements.length} elementos de vídeo`);
      videoElements.forEach(video => {
        if (video.src) {
          urls.push({
            type: 'video',
            url: video.src,
            text: video.alt || 'Vídeo'
          });
        }
      });

      // Procurar por iframes de vídeo
      const iframes = document.querySelectorAll('iframe');
      console.log(`Encontrados ${iframes.length} iframes`);
      iframes.forEach(iframe => {
        if (iframe.src && (iframe.src.includes('youtube') || iframe.src.includes('vimeo') || iframe.src.includes('video'))) {
          urls.push({
            type: 'iframe',
            url: iframe.src,
            text: iframe.title || 'Vídeo em iframe'
          });
        }
      });

      // Procurar por links que contenham vídeo
      const links = document.querySelectorAll('a[href*="video"], a[href*="youtube"], a[href*="vimeo"]');
      console.log(`Encontrados ${links.length} links de vídeo`);
      links.forEach(link => {
        urls.push({
          type: 'link',
          url: link.href,
          text: link.textContent.trim() || 'Link de vídeo'
        });
      });

      // Procurar por botões que possam abrir vídeos
      const buttons = document.querySelectorAll('button, .btn, [role="button"]');
      console.log(`Encontrados ${buttons.length} botões`);
      buttons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes('vídeo') || text.includes('video') || text.includes('play') || text.includes('assistir')) {
          urls.push({
            type: 'button',
            url: button.getAttribute('data-url') || button.getAttribute('href') || 'Botão de vídeo',
            text: button.textContent.trim()
          });
        }
      });

      // Procurar por elementos com data attributes de vídeo
      const dataElements = document.querySelectorAll('[data-video], [data-src*="video"], [data-url*="video"]');
      console.log(`Encontrados ${dataElements.length} elementos com data attributes`);
      dataElements.forEach(element => {
        const videoUrl = element.getAttribute('data-video') || element.getAttribute('data-src') || element.getAttribute('data-url');
        if (videoUrl) {
          urls.push({
            type: 'data-attribute',
            url: videoUrl,
            text: element.textContent.trim() || 'Vídeo via data attribute'
          });
        }
      });

      // Procurar por elementos com classes que indiquem vídeo
      const videoClasses = document.querySelectorAll('.video, .player, .media, .content-video');
      console.log(`Encontrados ${videoClasses.length} elementos com classes de vídeo`);
      videoClasses.forEach(element => {
        const videoSrc = element.querySelector('video')?.src || element.querySelector('iframe')?.src;
        if (videoSrc) {
          urls.push({
            type: 'video-class',
            url: videoSrc,
            text: element.textContent.trim() || 'Vídeo via classe'
          });
        }
      });

      return urls;
    });

    console.log('📊 URLs DE VÍDEO ENCONTRADAS:');
    console.log('============================================================');
    
    if (videoUrls.length === 0) {
      console.log('❌ Nenhuma URL de vídeo encontrada');
      console.log('💡 Dicas:');
      console.log('   - Verifique se você está logado na Kiwify');
      console.log('   - Navegue até a seção de vídeos do curso');
      console.log('   - Aguarde o carregamento completo da página');
    } else {
      videoUrls.forEach((item, index) => {
        console.log(`${index + 1}. [${item.type.toUpperCase()}] ${item.text}`);
        console.log(`   URL: ${item.url}`);
        console.log('   ---');
      });
    }

    // Tirar screenshot da página
    await page.screenshot({ 
      path: 'kiwify_current_page_videos.png',
      fullPage: true 
    });
    console.log('📸 Screenshot salvo como "kiwify_current_page_videos.png"');

    console.log('✅ Extração concluída! Navegador permanecerá aberto.');
    
    // Manter o navegador aberto
    // await browser.close();

  } catch (error) {
    console.error('❌ Erro ao extrair URLs:', error.message);
  }
}

extractVideoUrlsFromCurrentPage(); 