const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY não configuradas');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// Formas com nomes baseados nas imagens
const formas = [
  { nome: 'oval', preco: 15.00 },
  { nome: 'quadrado', preco: 15.00 },
  { nome: 'urso', preco: 18.00 },
  { nome: 'oval-desenho', preco: 18.00 },
  { nome: 'quadradinho-desenho', preco: 18.00 },
  { nome: 'flor-pequena', preco: 16.00 }
];

async function addFormas() {
  console.log('🔄 Adicionando formas ao Supabase...\n');

  for (const forma of formas) {
    try {
      // Verificar se forma já existe
      const { data: existing } = await supabase
        .from('formas')
        .select('nome')
        .eq('nome', forma.nome)
        .single();

      if (existing) {
        console.log(`⏭️  Forma "${forma.nome}" já existe, pulando...`);
        continue;
      }

      // Inserir forma
      const { data, error } = await supabase
        .from('formas')
        .insert([forma]);

      if (error) {
        console.error(`❌ Erro ao adicionar forma "${forma.nome}":`, error.message);
      } else {
        console.log(`✅ Forma "${forma.nome}" adicionada com sucesso! (R$ ${forma.preco.toFixed(2)})`);
      }
    } catch (err) {
      console.error(`❌ Erro inesperado para "${forma.nome}":`, err.message);
    }
  }

  console.log('\n✨ Processo concluído!');
  process.exit(0);
}

addFormas();
