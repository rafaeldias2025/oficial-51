import puppeteer from 'puppeteer';
import fs from 'fs';

const KIWIFY_URL = 'https://dashboard.kiwify.com/members-area/1c686acb-0953-4f57-86db-97fe542964c2?tab=courses&course=83b472c7-a1ab-4de4-9fb8-9a61faf62a4e';

async function navigateAndExtractVideos() {
  console.log('🔍 Navegando para a dashboard da Kiwify...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Configurar timeout maior
    page.setDefaultTimeout(30000);
    
    console.log('🌐 Carregando página da Kiwify...');
    await page.goto(KIWIFY_URL, { waitUntil: 'networkidle2' });
    
    console.log('✅ Página carregada');
    console.log('⏳ Aguardando 10 segundos para carregamento completo...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Aguardar login se necessário
    console.log('🔐 Verificando se precisa de login...');
    const buttons = await page.$$('button');
    let loginButton = null;
    for (const button of buttons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && text.toLowerCase().includes('entrar')) {
        loginButton = button;
        break;
      }
    }
    
    if (loginButton) {
      console.log('⚠️  Página de login detectada. Aguardando login manual...');
      console.log('📝 Por favor, faça login e navegue até os vídeos...');
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 segundos para login
    }
    
    console.log('🔍 Procurando por elementos de vídeo...');
    
    // Extrair todos os iframes primeiro
    const iframes = await page.$$eval('iframe', (frames) => {
      return frames.map((frame, index) => {
        const src = frame.src;
        const title = frame.title || `Vídeo ${index + 1}`;
        const width = frame.width;
        const height = frame.height;
        return { src, title, width, height, type: 'iframe' };
      });
    });
    
    // Procurar por elementos de vídeo
    const videos = await page.$$eval('video', (videoElements) => {
      return videoElements.map((video, index) => {
        const src = video.src;
        const poster = video.poster;
        const title = video.title || `Vídeo ${index + 1}`;
        return { src, poster, title, type: 'video' };
      });
    });
    
    // Procurar por elementos com data-video
    const dataVideos = await page.$$eval('[data-video]', (elements) => {
      return elements.map((element, index) => {
        const dataVideo = element.getAttribute('data-video');
        const title = element.title || element.textContent?.trim() || `Vídeo ${index + 1}`;
        return { src: dataVideo, title, type: 'data-video' };
      });
    });
    
    // Procurar por botões de play/vídeo
    const playButtons = await page.$$eval('button, a, div', (elements) => {
      const videoButtons = [];
      elements.forEach((element, index) => {
        const text = element.textContent?.toLowerCase() || '';
        const className = element.className?.toLowerCase() || '';
        const id = element.id?.toLowerCase() || '';
        
        if (text.includes('play') || text.includes('assistir') || text.includes('vídeo') ||
            className.includes('play') || className.includes('video') || className.includes('player') ||
            id.includes('play') || id.includes('video') || id.includes('player')) {
          videoButtons.push({
            text: element.textContent?.trim(),
            className: element.className,
            id: element.id,
            type: 'button'
          });
        }
      });
      return videoButtons;
    });
    
    // Procurar por scripts que contenham URLs de vídeo
    const scripts = await page.$$eval('script', (scriptElements) => {
      const videoScripts = [];
      scriptElements.forEach((script, index) => {
        const content = script.textContent || '';
        if (content.includes('youtube.com') || content.includes('video') || content.includes('player')) {
          videoScripts.push({
            content: content.substring(0, 200) + '...',
            type: 'script'
          });
        }
      });
      return videoScripts;
    });
    
    // Salvar resultados
    const results = {
      timestamp: new Date().toISOString(),
      url: KIWIFY_URL,
      iframes,
      videos,
      dataVideos,
      playButtons,
      scripts
    };
    
    fs.writeFileSync('kiwify_video_results.json', JSON.stringify(results, null, 2));
    
    console.log('\n📊 RESULTADOS DA EXTRAÇÃO:');
    console.log('==================================================');
    
    if (iframes.length > 0) {
      console.log(`🖼️  ${iframes.length} IFRAMES ENCONTRADOS:`);
      iframes.forEach((iframe, index) => {
        console.log(`${index + 1}. src: ${iframe.src}`);
        console.log(`   title: ${iframe.title}`);
        console.log(`   size: ${iframe.width}x${iframe.height}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum iframe encontrado');
    }
    
    if (videos.length > 0) {
      console.log(`🎥 ${videos.length} ELEMENTOS <VIDEO> ENCONTRADOS:`);
      videos.forEach((video, index) => {
        console.log(`${index + 1}. src: ${video.src}`);
        console.log(`   poster: ${video.poster}`);
        console.log(`   title: ${video.title}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum elemento <video> encontrado');
    }
    
    if (dataVideos.length > 0) {
      console.log(`📹 ${dataVideos.length} ELEMENTOS COM DATA-VIDEO:`);
      dataVideos.forEach((dataVideo, index) => {
        console.log(`${index + 1}. data-video: ${dataVideo.src}`);
        console.log(`   title: ${dataVideo.title}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum elemento com data-video encontrado');
    }
    
    if (playButtons.length > 0) {
      console.log(`🎮 ${playButtons.length} BOTÕES DE VÍDEO ENCONTRADOS:`);
      playButtons.forEach((button, index) => {
        console.log(`${index + 1}. text: "${button.text}"`);
        console.log(`   class: ${button.className}`);
        console.log(`   id: ${button.id}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum botão de vídeo encontrado');
    }
    
    if (scripts.length > 0) {
      console.log(`📜 ${scripts.length} SCRIPTS COM VÍDEO ENCONTRADOS:`);
      scripts.forEach((script, index) => {
        console.log(`${index + 1}. content: ${script.content}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum script com vídeo encontrado');
    }
    
    // Tirar screenshot
    await page.screenshot({ path: 'kiwify_dashboard.png', fullPage: true });
    console.log('📸 Screenshot salvo como "kiwify_dashboard.png"');
    
    console.log('\n💾 Resultados salvos em "kiwify_video_results.json"');
    console.log('✅ Navegação concluída! Navegador permanecerá aberto.');
    
    // Manter navegador aberto para análise manual
    console.log('\n🔍 Navegador permanecerá aberto para análise manual...');
    console.log('Pressione Ctrl+C para fechar quando terminar.');
    
    // Aguardar indefinidamente
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Erro durante a navegação:', error.message);
  } finally {
    // Não fechar o navegador automaticamente
    // await browser.close();
  }
}

navigateAndExtractVideos().catch(console.error); 