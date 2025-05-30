import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Variáveis de ambiente necessárias não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função para executar as migrations
async function runMigrations() {
  try {
    // Criar tabela de migrations se não existir
    const { error: createTableError } = await supabase.rpc('create_migrations_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createTableError) {
      throw createTableError;
    }

    // Ler arquivos de migration
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Verificar migrations já executadas
    const { data: executedMigrations, error: fetchError } = await supabase
      .from('migrations')
      .select('name');

    if (fetchError) {
      throw fetchError;
    }

    const executedFiles = new Set(executedMigrations?.map(m => m.name) || []);

    // Executar migrations pendentes
    for (const file of files) {
      if (!executedFiles.has(file)) {
        console.log(`Executando migration: ${file}`);
        
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        // Executar migration
        const { error: migrationError } = await supabase.rpc('run_migration', {
          sql
        });

        if (migrationError) {
          throw new Error(`Erro ao executar migration ${file}: ${migrationError.message}`);
        }

        // Registrar migration executada
        const { error: insertError } = await supabase
          .from('migrations')
          .insert({ name: file });

        if (insertError) {
          throw insertError;
        }

        console.log(`Migration ${file} executada com sucesso`);
      }
    }

    console.log('Todas as migrations foram executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrations:', error);
    process.exit(1);
  }
}

// Executar migrations
runMigrations(); 