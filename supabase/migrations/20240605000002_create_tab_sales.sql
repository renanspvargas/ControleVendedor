create table tab_sales (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references tab_stores(id) not null,
  employee_id uuid references tab_employees(id) not null,
  amount decimal(10,2) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilita a extensão para triggers de updated_at
create extension if not exists moddatetime schema extensions;

-- Cria trigger para atualizar updated_at automaticamente
create trigger handle_updated_at before update on tab_sales
  for each row execute procedure moddatetime (updated_at);

-- Índices para melhorar performance
create index idx_sales_store_id on tab_sales(store_id);
create index idx_sales_employee_id on tab_sales(employee_id);

-- Políticas de segurança (RLS)
alter table tab_sales enable row level security;

-- Funcionários podem ver suas próprias vendas
create policy "Funcionários podem ver suas próprias vendas"
on tab_sales for select
using (employee_id = auth.uid());

-- Funcionários podem registrar suas próprias vendas
create policy "Funcionários podem registrar suas próprias vendas"
on tab_sales for insert
with check (
  employee_id = auth.uid() and
  store_id = (
    select store_id from tab_employees 
    where id = auth.uid()
  )
);

-- Admins podem ver todas as vendas da loja
create policy "Admins podem ver todas as vendas da loja"
on tab_sales for select
using (
  exists (
    select 1 from tab_employees
    where id = auth.uid()
    and store_id = tab_sales.store_id
    and role = 'admin'
  )
);

-- Admins podem registrar vendas para qualquer funcionário da loja
create policy "Admins podem registrar vendas para qualquer funcionário"
on tab_sales for insert
with check (
  exists (
    select 1 from tab_employees
    where id = auth.uid()
    and store_id = tab_sales.store_id
    and role = 'admin'
  ) and
  exists (
    select 1 from tab_employees
    where id = tab_sales.employee_id
    and store_id = tab_sales.store_id
  )
); 