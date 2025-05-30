-- Função para executar migrations com privilégios elevados
CREATE OR REPLACE FUNCTION run_migration(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com privilégios do criador
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Função para criar tabela de migrations
CREATE OR REPLACE FUNCTION create_migrations_table(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Garantir que apenas service_role pode executar estas funções
REVOKE ALL ON FUNCTION run_migration(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_migrations_table(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION run_migration(text) TO service_role;
GRANT EXECUTE ON FUNCTION create_migrations_table(text) TO service_role; 