create table tab_queue (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references tab_stores(id) not null,
  employee_id uuid references tab_employees(id) not null,
  status text not null check (status in ('waiting', 'in_progress', 'completed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilita a extensão para triggers de updated_at
create extension if not exists moddatetime schema extensions;

-- Cria trigger para atualizar updated_at automaticamente
create trigger handle_updated_at before update on tab_queue
  for each row execute procedure moddatetime (updated_at);

-- Índices para melhorar performance
create index idx_queue_store_id on tab_queue(store_id);
create index idx_queue_employee_id on tab_queue(employee_id);
create index idx_queue_status on tab_queue(status);

-- Políticas de segurança (RLS)
alter table tab_queue enable row level security;

-- Funcionários podem ver a fila de sua loja
create policy "Funcionários podem ver a fila de sua loja"
on tab_queue for select
using (
  exists (
    select 1 from tab_employees
    where id = auth.uid()
    and store_id = tab_queue.store_id
  )
);

-- Funcionários podem atualizar seus próprios registros na fila
create policy "Funcionários podem atualizar seus registros na fila"
on tab_queue for update
using (employee_id = auth.uid());

-- Admins podem gerenciar toda a fila da loja
create policy "Admins podem gerenciar a fila da loja"
on tab_queue for all
using (
  exists (
    select 1 from tab_employees
    where id = auth.uid()
    and store_id = tab_queue.store_id
    and role = 'admin'
  )
); 