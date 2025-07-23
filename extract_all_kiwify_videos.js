import puppeteer from 'puppeteer';

async function extractAllKiwifyVideos() {
  console.log('🔍 Extraindo todas as URLs de vídeo da Kiwify...');
  
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
    console.log('⏳ Aguardando 10 segundos para você fazer login...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Extrair todas as URLs de vídeo
    const allVideos = await page.evaluate(() => {
      const results = {
        iframes: [],
        dataAttributes: [],
        scriptTags: [],
        networkRequests: []
      };
      
      // 1. Procurar por todos os iframes
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe, index) => {
        results.iframes.push({
          index,
          src: iframe.src,
          dataSrc: iframe.dataset.src,
          title: iframe.title,
          width: iframe.width,
          height: iframe.height,
          className: iframe.className,
          id: iframe.id
        });
      });
      
      // 2. Procurar por elementos com data-video
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
      
      // 3. Procurar por scripts que podem conter URLs de vídeo
      const scripts = document.querySelectorAll('script');
      scripts.forEach((script, index) => {
        const content = script.textContent || '';
        if (content.includes('youtube') || content.includes('video') || content.includes('embed')) {
          results.scriptTags.push({
            index,
            content: content.substring(0, 500) + '...'
          });
        }
      });
      
      // 4. Procurar por elementos com URLs de vídeo
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el, index) => {
        const attributes = el.attributes;
        for (let i = 0; i < attributes.length; i++) {
          const attr = attributes[i];
          const value = attr.value;
          if (value.includes('youtube') || value.includes('video') || value.includes('embed')) {
            results.networkRequests.push({
              index,
              tagName: el.tagName,
              attributeName: attr.name,
              attributeValue: value,
              className: el.className,
              id: el.id
            });
          }
        }
      });
      
      return results;
    });
    
    console.log('\n📊 TODAS AS URLs DE VÍDEO ENCONTRADAS:');
    console.log('='.repeat(60));
    
    if (allVideos.iframes.length > 0) {
      console.log('\n🖼️ IFRAMES ENCONTRADOS:');
      allVideos.iframes.forEach((iframe, index) => {
        console.log(`${index + 1}. src: ${iframe.src}`);
        console.log(`   title: ${iframe.title}`);
        console.log(`   size: ${iframe.width}x${iframe.height}`);
        console.log(`   class: ${iframe.className}`);
        console.log(`   id: ${iframe.id}`);
        console.log('');
      });
    } else {
      console.log('\n❌ Nenhum iframe encontrado');
    }
    
    if (allVideos.dataAttributes.length > 0) {
      console.log('\n📋 ELEMENTOS COM DATA-VIDEO:');
      allVideos.dataAttributes.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName} - data-video: ${el.dataVideo}`);
        console.log(`   class: ${el.className}`);
        console.log(`   id: ${el.id}`);
        console.log('');
      });
    } else {
      console.log('\n❌ Nenhum elemento com data-video encontrado');
    }
    
    if (allVideos.scriptTags.length > 0) {
      console.log('\n📜 SCRIPTS COM URLs DE VÍDEO:');
      allVideos.scriptTags.forEach((script, index) => {
        console.log(`${index + 1}. Script ${script.index}:`);
        console.log(`   ${script.content}`);
        console.log('');
      });
    } else {
      console.log('\n❌ Nenhum script com URLs de vídeo encontrado');
    }
    
    if (allVideos.networkRequests.length > 0) {
      console.log('\n🌐 ELEMENTOS COM URLs DE VÍDEO:');
      allVideos.networkRequests.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName} - ${el.attributeName}: ${el.attributeValue}`);
        console.log(`   class: ${el.className}`);
        console.log(`   id: ${el.id}`);
        console.log('');
      });
    } else {
      console.log('\n❌ Nenhum elemento com URLs de vídeo encontrado');
    }
    
    // Tentar clicar em botões para revelar mais vídeos
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
      
      // Tentar clicar em alguns botões para revelar vídeos
      console.log('\n🖱️ Tentando clicar em botões para revelar vídeos...');
      
      for (let i = 0; i < Math.min(3, buttons.length); i++) {
        try {
          await page.click(`button, a, [role="button"]`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verificar se apareceram novos vídeos
          const newVideos = await page.evaluate(() => {
            const iframes = document.querySelectorAll('iframe');
            return Array.from(iframes).map(iframe => ({
              src: iframe.src,
              title: iframe.title
            }));
          });
          
          if (newVideos.length > 0) {
            console.log(`\n🎥 Novos vídeos encontrados após clique ${i + 1}:`);
            newVideos.forEach((video, index) => {
              console.log(`   ${index + 1}. ${video.title}: ${video.src}`);
            });
          }
        } catch (error) {
          console.log(`Erro ao clicar no botão ${i + 1}:`, error.message);
        }
      }
    }
    
    // Capturar screenshot final
    await page.screenshot({ path: 'kiwify_all_videos.png', fullPage: true });
    console.log('\n📸 Screenshot final salvo como "kiwify_all_videos.png"');
    
    console.log('\n✅ Extração concluída! Navegador permanecerá aberto.');
    
    // Manter o navegador aberto
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Erro durante a extração:', error.message);
  }
}

extractAllKiwifyVideos(); 