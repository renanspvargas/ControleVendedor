-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stores table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    can_sell BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, user_id)
);

-- Create sales table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) NOT NULL,
    employee_id UUID REFERENCES employees(id) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Stores policies
CREATE POLICY "Donos podem ver suas próprias lojas"
ON stores FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Donos podem gerenciar suas próprias lojas"
ON stores FOR ALL
USING (auth.uid() = owner_id);

-- Employees policies
CREATE POLICY "Donos podem ver funcionários de suas lojas"
ON employees FOR SELECT
USING (
    auth.uid() IN (
        SELECT owner_id FROM stores WHERE id = employees.store_id
    )
);

CREATE POLICY "Donos podem gerenciar funcionários de suas lojas"
ON employees FOR ALL
USING (
    auth.uid() IN (
        SELECT owner_id FROM stores WHERE id = employees.store_id
    )
);

CREATE POLICY "Funcionários podem ver seus próprios dados"
ON employees FOR SELECT
USING (auth.uid() = user_id);

-- Sales policies
CREATE POLICY "Donos podem ver todas as vendas de suas lojas"
ON sales FOR SELECT
USING (
    auth.uid() IN (
        SELECT owner_id FROM stores WHERE id = sales.store_id
    )
);

CREATE POLICY "Funcionários podem ver vendas de sua loja"
ON sales FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM employees WHERE store_id = sales.store_id
    )
);

CREATE POLICY "Funcionários podem registrar vendas"
ON sales FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT user_id FROM employees 
        WHERE id = sales.employee_id 
        AND can_sell = true
        AND is_active = true
    )
);

-- Create indexes for better performance
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_employees_store_id ON employees(store_id);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_sales_store_id ON sales(store_id);
CREATE INDEX idx_sales_employee_id ON sales(employee_id);
CREATE INDEX idx_sales_timestamp ON sales(timestamp);

-- Add custom types to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id); 