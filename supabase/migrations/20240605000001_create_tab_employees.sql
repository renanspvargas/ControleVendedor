create table tab_employees (
  id uuid primary key references auth.users(id),
  store_id uuid references tab_stores(id) not null,
  name text not null,
  role text not null check (role in ('admin', 'employee')),
  email text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilita a extensão para triggers de updated_at
create extension if not exists moddatetime schema extensions;

-- Cria trigger para atualizar updated_at automaticamente
create trigger handle_updated_at before update on tab_employees
  for each row execute procedure moddatetime (updated_at);

-- Índice para melhorar performance de buscas por store_id
create index idx_employees_store_id on tab_employees(store_id);

-- Políticas de segurança (RLS)
alter table tab_employees enable row level security;

-- Funcionários podem ver seus próprios dados
create policy "Funcionários podem ver seus próprios dados"
on tab_employees for select
using (auth.uid() = id);

-- Admins podem ver todos os funcionários de sua loja
create policy "Admins podem ver funcionários de sua loja"
on tab_employees for select
using (
  exists (
    select 1 from tab_employees as admin
    where admin.id = auth.uid()
    and admin.store_id = tab_employees.store_id
    and admin.role = 'admin'
  )
);

-- Admins podem gerenciar funcionários de sua loja
create policy "Admins podem gerenciar funcionários"
on tab_employees for all
using (
  exists (
    select 1 from tab_employees as admin
    where admin.id = auth.uid()
    and admin.store_id = tab_employees.store_id
    and admin.role = 'admin'
  )
); 