import puppeteer from 'puppeteer';

async function extractKiwifyVideosAdvanced() {
  console.log('🔍 Extraindo URLs de vídeos da Kiwify (Versão Avançada)...');
  
  try {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--remote-debugging-port=9222']
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport para desktop
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🌐 Navegando para a Kiwify...');
    await page.goto('https://dashboard.kiwify.com/members-area/1c686acb-0953-4f57-86db-97fe542964c2?tab=courses&course=83b472c7-a1ab-4de4-9fb8-9a61faf62a4e');
    
    console.log('⏳ Aguardando carregamento da página...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🔍 Verificando se há login necessário...');
    
    // Verificar se precisa fazer login
    const loginButton = await page.$('button[type="submit"], input[type="submit"], .login-button, .btn-login');
    if (loginButton) {
      console.log('⚠️  Página de login detectada. Aguardando login manual...');
      console.log('⏳ Aguardando 60 segundos para você fazer login...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
    
    console.log('🔍 Analisando estrutura da página...');
    
    // Extrair informações detalhadas da página
    const pageInfo = await page.evaluate(() => {
      const info = {
        title: document.title,
        url: window.location.href,
        elements: {
          videos: document.querySelectorAll('video').length,
          iframes: document.querySelectorAll('iframe').length,
          buttons: document.querySelectorAll('button').length,
          links: document.querySelectorAll('a').length,
          divs: document.querySelectorAll('div').length
        },
        text: document.body.innerText.substring(0, 500),
        html: document.body.innerHTML.substring(0, 1000)
      };
      
      console.log('📊 Informações da página:', info);
      return info;
    });
    
    console.log('📊 ESTRUTURA DA PÁGINA:');
    console.log('============================================================');
    console.log(`Título: ${pageInfo.title}`);
    console.log(`URL: ${pageInfo.url}`);
    console.log(`Vídeos: ${pageInfo.elements.videos}`);
    console.log(`Iframes: ${pageInfo.elements.iframes}`);
    console.log(`Botões: ${pageInfo.elements.buttons}`);
    console.log(`Links: ${pageInfo.elements.links}`);
    console.log(`Divs: ${pageInfo.elements.divs}`);
    console.log('============================================================');
    
    // Tentar diferentes estratégias para encontrar vídeos
    console.log('🔍 Estratégia 1: Procurando elementos de vídeo diretos...');
    const directVideos = await page.evaluate(() => {
      const videos = [];
      const videoElements = document.querySelectorAll('video, source[type*="video"]');
      videoElements.forEach(video => {
        videos.push({
          type: 'direct-video',
          src: video.src || video.getAttribute('src'),
          alt: video.alt || 'Vídeo',
          tag: video.tagName
        });
      });
      return videos;
    });
    
    console.log('🔍 Estratégia 2: Procurando iframes de vídeo...');
    const iframeVideos = await page.evaluate(() => {
      const videos = [];
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        const src = iframe.src;
        if (src && (src.includes('youtube') || src.includes('vimeo') || src.includes('video') || src.includes('player'))) {
          videos.push({
            type: 'iframe-video',
            src: src,
            title: iframe.title || 'Vídeo em iframe',
            width: iframe.width,
            height: iframe.height
          });
        }
      });
      return videos;
    });
    
    console.log('🔍 Estratégia 3: Procurando links de vídeo...');
    const linkVideos = await page.evaluate(() => {
      const videos = [];
      const links = document.querySelectorAll('a[href*="video"], a[href*="youtube"], a[href*="vimeo"], a[href*="player"]');
      links.forEach(link => {
        videos.push({
          type: 'link-video',
          href: link.href,
          text: link.textContent.trim(),
          title: link.title || 'Link de vídeo'
        });
      });
      return videos;
    });
    
    console.log('🔍 Estratégia 4: Procurando botões de vídeo...');
    const buttonVideos = await page.evaluate(() => {
      const videos = [];
      const buttons = document.querySelectorAll('button, .btn, [role="button"]');
      buttons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes('vídeo') || text.includes('video') || text.includes('play') || text.includes('assistir') || text.includes('watch')) {
          videos.push({
            type: 'button-video',
            text: button.textContent.trim(),
            dataUrl: button.getAttribute('data-url'),
            dataVideo: button.getAttribute('data-video'),
            onclick: button.getAttribute('onclick')
          });
        }
      });
      return videos;
    });
    
    console.log('🔍 Estratégia 5: Procurando elementos com data attributes...');
    const dataVideos = await page.evaluate(() => {
      const videos = [];
      const elements = document.querySelectorAll('[data-video], [data-src*="video"], [data-url*="video"], [data-player]');
      elements.forEach(element => {
        videos.push({
          type: 'data-video',
          dataVideo: element.getAttribute('data-video'),
          dataSrc: element.getAttribute('data-src'),
          dataUrl: element.getAttribute('data-url'),
          dataPlayer: element.getAttribute('data-player'),
          text: element.textContent.trim(),
          tag: element.tagName,
          className: element.className
        });
      });
      return videos;
    });
    
    console.log('🔍 Estratégia 6: Procurando por classes específicas de vídeo...');
    const classVideos = await page.evaluate(() => {
      const videos = [];
      const selectors = [
        '.video', '.player', '.media', '.content-video', '.video-player',
        '.kiwify-video', '.course-video', '.lesson-video', '.module-video'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          videos.push({
            type: 'class-video',
            selector: selector,
            text: element.textContent.trim(),
            className: element.className,
            innerHTML: element.innerHTML.substring(0, 200)
          });
        });
      });
      return videos;
    });
    
    // Combinar todos os resultados
    const allVideos = [
      ...directVideos,
      ...iframeVideos,
      ...linkVideos,
      ...buttonVideos,
      ...dataVideos,
      ...classVideos
    ];
    
    console.log('📊 RESULTADOS DA EXTRAÇÃO:');
    console.log('============================================================');
    
    if (allVideos.length === 0) {
      console.log('❌ Nenhum vídeo encontrado');
      console.log('💡 Sugestões:');
      console.log('   - Verifique se você está logado na Kiwify');
      console.log('   - Navegue até a seção de vídeos do curso');
      console.log('   - Verifique se o curso tem vídeos disponíveis');
      console.log('   - Tente navegar para diferentes seções do curso');
    } else {
      console.log(`✅ Encontrados ${allVideos.length} elementos relacionados a vídeos:`);
      allVideos.forEach((video, index) => {
        console.log(`\n${index + 1}. [${video.type.toUpperCase()}]`);
        console.log(`   Texto: ${video.text || 'N/A'}`);
        if (video.src) console.log(`   Src: ${video.src}`);
        if (video.href) console.log(`   Href: ${video.href}`);
        if (video.dataVideo) console.log(`   Data-video: ${video.dataVideo}`);
        if (video.dataSrc) console.log(`   Data-src: ${video.dataSrc}`);
        if (video.dataUrl) console.log(`   Data-url: ${video.dataUrl}`);
        console.log('   ---');
      });
    }
    
    // Tirar screenshot
    await page.screenshot({ 
      path: 'kiwify_advanced_analysis.png',
      fullPage: true 
    });
    console.log('📸 Screenshot salvo como "kiwify_advanced_analysis.png"');
    
    console.log('✅ Análise concluída! Navegador permanecerá aberto.');
    
  } catch (error) {
    console.error('❌ Erro na análise:', error.message);
  }
}

extractKiwifyVideosAdvanced(); 