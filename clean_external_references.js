#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Limpando todas as referências a sistemas externos...');

// Lista de padrões a serem removidos/substituídos
const replacements = [
  // Remover referências aos sistemas
  { from: /SistemaGB/g, to: 'Instituto dos Sonhos' },
  { from: /SistemaTizeCoach/g, to: 'Instituto dos Sonhos' },
  { from: /sistemetizecoach/g, to: 'institutodossonhos' },
  { from: /sistemagb/g, to: 'institutodossonhos' },
  
  // Substituir emails
  { from: /larissabarbosa@gmail\.com/g, to: 'larissa@institutodossonhos.com' },
  { from: /maria\.santos@sistemagb\.com/g, to: 'maria.santos@institutodossonhos.com' },
  { from: /ana\.costa@sistemagb\.com/g, to: 'ana.costa@institutodossonhos.com' },
  { from: /joao\.silva@sistemetizecoach\.com/g, to: 'joao.silva@institutodossonhos.com' },
  
  // Limpar sufixos dos nomes
  { from: / - SistemaGB/g, to: '' },
  { from: / - SistemaTizeCoach/g, to: '' },
];

// Função para processar um arquivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Limpo: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Erro em ${filePath}: ${error.message}`);
  }
}

// Função para processar diretório recursivamente
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Pular node_modules e .git
      if (item !== 'node_modules' && item !== '.git' && !item.startsWith('.')) {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      // Processar apenas arquivos de código e documentação
      const ext = path.extname(item).toLowerCase();
      if (['.js', '.ts', '.tsx', '.jsx', '.md', '.sql', '.json'].includes(ext)) {
        processFile(fullPath);
      }
    }
  });
}

// Começar limpeza
console.log('🎯 Iniciando limpeza...');
processDirectory('./');
console.log('✅ Limpeza concluída!');
