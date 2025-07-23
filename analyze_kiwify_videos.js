import puppeteer from 'puppeteer';

async function analyzeKiwifyVideos() {
  console.log('🔍 Analisando página da Kiwify para encontrar vídeos...');
  
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
    
    // Aguardar um pouco para o conteúdo carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Analisar elementos de vídeo
    const videoElements = await page.evaluate(() => {
      const results = {
        videos: [],
        iframes: [],
        dataAttributes: [],
        playerElements: []
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
          title: iframe.title
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
      
      return results;
    });
    
    console.log('\n📊 RESULTADOS DA ANÁLISE:');
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
    
    // Tentar clicar em botões "Assistir" ou "Play"
    console.log('\n🔍 Procurando por botões de vídeo...');
    
    const buttons = await page.evaluate(() => {
      const allButtons = document.querySelectorAll('button, a, [role="button"]');
      const videoButtons = [];
      
      allButtons.forEach((btn, index) => {
        const text = btn.textContent?.toLowerCase() || '';
        const className = btn.className?.toLowerCase() || '';
        const id = btn.id?.toLowerCase() || '';
        
        if (text.includes('assistir') || text.includes('play') || text.includes('vídeo') ||
            className.includes('play') || className.includes('video') ||
            id.includes('play') || id.includes('video')) {
          videoButtons.push({
            index,
            text: btn.textContent,
            className: btn.className,
            id: btn.id,
            tagName: btn.tagName
          });
        }
      });
      
      return videoButtons;
    });
    
    if (buttons.length > 0) {
      console.log('\n🎯 BOTÕES DE VÍDEO ENCONTRADOS:');
      buttons.forEach((btn, index) => {
        console.log(`${index + 1}. ${btn.tagName} - "${btn.text}"`);
        console.log(`   class: ${btn.className}`);
        console.log(`   id: ${btn.id}`);
      });
      
      // Tentar clicar no primeiro botão
      console.log('\n🖱️ Tentando clicar no primeiro botão...');
      await page.click('button, a, [role="button"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se apareceu algum vídeo após o clique
      const afterClick = await page.evaluate(() => {
        const videos = document.querySelectorAll('video');
        const iframes = document.querySelectorAll('iframe');
        return {
          videos: videos.length,
          iframes: iframes.length
        };
      });
      
      console.log(`\n📊 Após o clique:`);
      console.log(`   Vídeos: ${afterClick.videos}`);
      console.log(`   Iframes: ${afterClick.iframes}`);
      
    } else {
      console.log('\n❌ Nenhum botão de vídeo encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a análise:', error.message);
  } finally {
    await browser.close();
  }
}

analyzeKiwifyVideos(); 