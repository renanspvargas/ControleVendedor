create table tab_stores (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilita a extensão para triggers de updated_at
create extension if not exists moddatetime schema extensions;

-- Cria trigger para atualizar updated_at automaticamente
create trigger handle_updated_at before update on tab_stores
  for each row execute procedure moddatetime (updated_at);

-- Políticas de segurança (RLS)
alter table tab_stores enable row level security; 