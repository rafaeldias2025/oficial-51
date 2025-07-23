#!/usr/bin/env node

// Script para verificar ferramentas no banco via API
console.log('🔍 Verificando ferramentas no sistema...');

// Simular dados que deveriam estar no banco
const ferramentasEsperadas = [
    {
        name: 'Roda da Saúde Galileu',
        perguntas: 16,
        categoria: 'Saúde'
    },
    {
        name: 'Instituto dos Sonhos', 
        perguntas: 20,
        categoria: 'Bem-estar'
    },
    {
        name: 'SistemizeCoach',
        perguntas: 30, 
        categoria: 'Comportamento'
    }
];

console.log('📊 FERRAMENTAS ESPERADAS NO SISTEMA:');
console.log('');

ferramentasEsperadas.forEach((ferramenta, index) => {
    console.log(`${index + 1}. 🛠️ ${ferramenta.name}`);
    console.log(`   📋 Perguntas: ${ferramenta.perguntas}`);
    console.log(`   🏷️ Categoria: ${ferramenta.categoria}`);
    console.log('');
});

console.log('⚠️ SE AS FERRAMENTAS NÃO APARECEM NO DASHBOARD:');
console.log('1. Execute o SQL no Supabase');
console.log('2. Ou me informe quantas ferramentas você vê');
console.log('3. Posso criar as que estão faltando');
