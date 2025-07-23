import puppeteer from 'puppeteer';

async function extractAllVideoUrls() {
  console.log('🔍 Extraindo URLs de todos os vídeos da Kiwify...');
  
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
    console.log('⏳ Aguardando 15 segundos para você fazer login...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Encontrar todos os botões de vídeo
    const videoButtons = await page.evaluate(() => {
      const buttons = [];
      const allElements = document.querySelectorAll('button, a, [role="button"], [class*="play"], [class*="video"]');
      
      allElements.forEach((el, index) => {
        const text = el.textContent?.toLowerCase() || '';
        const className = el.className?.toLowerCase() || '';
        const id = el.id?.toLowerCase() || '';
        
        if (text.includes('assistir') || text.includes('play') || text.includes('vídeo') ||
            className.includes('play') || className.includes('video') ||
            id.includes('play') || id.includes('video') ||
            text.includes('01') || text.includes('02') || text.includes('03') ||
            text.includes('04') || text.includes('05') || text.includes('06')) {
          buttons.push({
            index,
            text: el.textContent,
            className: el.className,
            id: el.id,
            tagName: el.tagName,
            isVisible: el.offsetParent !== null
          });
        }
      });
      
      return buttons;
    });
    
    console.log(`\n🎯 Encontrados ${videoButtons.length} botões de vídeo:`);
    videoButtons.forEach((btn, index) => {
      console.log(`${index + 1}. ${btn.tagName} - "${btn.text}" (visível: ${btn.isVisible})`);
    });
    
    const allVideoUrls = [];
    
    // Clicar em cada botão e extrair URL do vídeo
    for (let i = 0; i < videoButtons.length; i++) {
      const button = videoButtons[i];
      console.log(`\n🖱️ Clicando no botão ${i + 1}: "${button.text}"`);
      
      try {
        // Tentar clicar no botão
        await page.click(`button, a, [role="button"], [class*="play"], [class*="video"]`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se apareceu um vídeo
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
          console.log(`✅ Vídeo encontrado após clicar em "${button.text}":`);
          videoInfo.forEach((video, index) => {
            console.log(`   ${index + 1}. ${video.type}: ${video.src}`);
            console.log(`      title: ${video.title}`);
            allVideoUrls.push({
              buttonText: button.text,
              videoUrl: video.src,
              videoTitle: video.title,
              videoType: video.type
            });
          });
        } else {
          console.log(`❌ Nenhum vídeo encontrado após clicar em "${button.text}"`);
        }
        
        // Aguardar um pouco antes do próximo clique
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log(`❌ Erro ao clicar no botão ${i + 1}:`, error.message);
      }
    }
    
    // Mostrar todas as URLs encontradas
    console.log('\n📊 TODAS AS URLs DE VÍDEO ENCONTRADAS:');
    console.log('='.repeat(60));
    
    if (allVideoUrls.length > 0) {
      allVideoUrls.forEach((video, index) => {
        console.log(`${index + 1}. Botão: "${video.buttonText}"`);
        console.log(`   URL: ${video.videoUrl}`);
        console.log(`   Título: ${video.videoTitle}`);
        console.log(`   Tipo: ${video.videoType}`);
        console.log('');
      });
      
      // Salvar URLs em arquivo
      const fs = await import('fs');
      const urlsData = {
        timestamp: new Date().toISOString(),
        totalVideos: allVideoUrls.length,
        videos: allVideoUrls
      };
      
      fs.writeFileSync('kiwify_video_urls.json', JSON.stringify(urlsData, null, 2));
      console.log('💾 URLs salvas em "kiwify_video_urls.json"');
      
    } else {
      console.log('❌ Nenhuma URL de vídeo encontrada');
    }
    
    // Capturar screenshot final
    await page.screenshot({ path: 'kiwify_all_videos_final.png', fullPage: true });
    console.log('\n📸 Screenshot final salvo como "kiwify_all_videos_final.png"');
    
    console.log('\n✅ Extração concluída! Navegador permanecerá aberto.');
    
    // Manter o navegador aberto
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Erro durante a extração:', error.message);
  }
}

extractAllVideoUrls(); 