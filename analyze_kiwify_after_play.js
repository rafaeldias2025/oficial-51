import puppeteer from 'puppeteer';

async function analyzeKiwifyAfterPlay() {
  console.log('🔍 Analisando página da Kiwify após clicar em Play...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Acessar a página da Kiwify
    await page.goto('https://members.kiwify.com/05056cab-973b-432a-9be5-bd600e48dcd3/9f81ebfc-ac84-4c35-9257-da5667074a99/d76e6638-8a4f-4e58-89df-de70b3afaba2?club=1c686acb-0953-4f57-86db-97fe542964c2', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ Página carregada');
    console.log('⏳ Aguardando 5 segundos para você fazer login e clicar em Play...');
    
    // Aguardar 5 segundos para você fazer login e clicar em Play
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Analisar elementos de vídeo após o Play
    const videoElements = await page.evaluate(() => {
      const results = {
        videos: [],
        iframes: [],
        dataAttributes: [],
        playerElements: [],
        allElements: []
      };
      
      // 1. Procurar por elementos <video>
      const videos = document.querySelectorAll('video');
      videos.forEach((video, index) => {
        results.videos.push({
          index,
          src: video.src,
          poster: video.poster,
          currentSrc: video.currentSrc,
          innerHTML: video.innerHTML
        });
      });
      
      // 2. Procurar por iframes
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe, index) => {
        results.iframes.push({
          index,
          src: iframe.src,
          dataSrc: iframe.dataset.src,
          title: iframe.title,
          width: iframe.width,
          height: iframe.height
        });
      });
      
      // 3. Procurar por elementos com data-video
      const dataVideoElements = document.querySelectorAll('[data-video]');
      dataVideoElements.forEach((el, index) => {
        results.dataAttributes.push({
          index,
          tagName: el.tagName,
          dataVideo: el.dataset.video,
          className: el.className,
          id: el.id
        });
      });
      
      // 4. Procurar por elementos de player
      const playerSelectors = [
        '.player', '.video-player', '.media-player',
        '[class*="player"]', '[class*="video"]',
        '[id*="player"]', '[id*="video"]'
      ];
      
      playerSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          results.playerElements.push({
            index,
            selector,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            innerHTML: el.innerHTML.substring(0, 200) + '...'
          });
        });
      });
      
      // 5. Procurar por todos os elementos que podem conter vídeo
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el, index) => {
        const tagName = el.tagName.toLowerCase();
        const className = el.className?.toLowerCase() || '';
        const id = el.id?.toLowerCase() || '';
        const innerHTML = el.innerHTML?.toLowerCase() || '';
        
        if (tagName === 'video' || tagName === 'iframe' || 
            className.includes('video') || className.includes('player') ||
            id.includes('video') || id.includes('player') ||
            innerHTML.includes('video') || innerHTML.includes('player')) {
          results.allElements.push({
            index,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            innerHTML: el.innerHTML.substring(0, 100) + '...'
          });
        }
      });
      
      return results;
    });
    
    console.log('\n📊 RESULTADOS DA ANÁLISE APÓS PLAY:');
    console.log('='.repeat(50));
    
    if (videoElements.videos.length > 0) {
      console.log('\n🎥 ELEMENTOS <VIDEO> ENCONTRADOS:');
      videoElements.videos.forEach((video, index) => {
        console.log(`${index + 1}. src: ${video.src}`);
        console.log(`   poster: ${video.poster}`);
        console.log(`   currentSrc: ${video.currentSrc}`);
      });
    } else {
      console.log('\n❌ Nenhum elemento <video> encontrado');
    }
    
    if (videoElements.iframes.length > 0) {
      console.log('\n🖼️ IFRAMES ENCONTRADOS:');
      videoElements.iframes.forEach((iframe, index) => {
        console.log(`${index + 1}. src: ${iframe.src}`);
        console.log(`   data-src: ${iframe.dataSrc}`);
        console.log(`   title: ${iframe.title}`);
        console.log(`   size: ${iframe.width}x${iframe.height}`);
      });
    } else {
      console.log('\n❌ Nenhum iframe encontrado');
    }
    
    if (videoElements.dataAttributes.length > 0) {
      console.log('\n📋 ELEMENTOS COM DATA-VIDEO:');
      videoElements.dataAttributes.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName} - data-video: ${el.dataVideo}`);
        console.log(`   class: ${el.className}`);
        console.log(`   id: ${el.id}`);
      });
    } else {
      console.log('\n❌ Nenhum elemento com data-video encontrado');
    }
    
    if (videoElements.playerElements.length > 0) {
      console.log('\n🎮 ELEMENTOS DE PLAYER:');
      videoElements.playerElements.forEach((el, index) => {
        console.log(`${index + 1}. ${el.selector}`);
        console.log(`   ${el.tagName} - class: ${el.className}`);
        console.log(`   id: ${el.id}`);
      });
    } else {
      console.log('\n❌ Nenhum elemento de player encontrado');
    }
    
    if (videoElements.allElements.length > 0) {
      console.log('\n🔍 ELEMENTOS RELACIONADOS A VÍDEO:');
      videoElements.allElements.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName} - class: ${el.className}`);
        console.log(`   id: ${el.id}`);
      });
    } else {
      console.log('\n❌ Nenhum elemento relacionado a vídeo encontrado');
    }
    
    // Capturar screenshot da página
    await page.screenshot({ path: 'kiwify_after_play.png', fullPage: true });
    console.log('\n📸 Screenshot salvo como "kiwify_after_play.png"');
    
  } catch (error) {
    console.error('❌ Erro durante a análise:', error.message);
  } finally {
    await browser.close();
  }
}

analyzeKiwifyAfterPlay(); 