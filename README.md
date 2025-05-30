# SalesQueue - Sistema de Gerenciamento de Fila de Vendas

Sistema para gerenciamento de fila de vendedores, permitindo o controle de vendas e organização da ordem de atendimento.

## Configuração do Ambiente

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Conta no Supabase

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

### Instalação
1. Clone o repositório
```bash
git clone https://github.com/renanspvargas/ControleVendedor.git
cd ControleVendedor
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

## Deploy

### Vercel (Recomendado)
1. Faça fork do repositório
2. Conecte com sua conta Vercel
3. Configure as variáveis de ambiente no painel da Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Manual
1. Build do projeto
```bash
npm run build
# ou
yarn build
```

2. Inicie o servidor de produção
```bash
npm start
# ou
yarn start
```

## Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Configure as políticas de segurança (RLS)
4. Copie as credenciais do projeto para as variáveis de ambiente

### Políticas de Segurança Recomendadas

```sql
-- Exemplo de política para vendas
CREATE POLICY "Usuários podem ver apenas suas próprias vendas"
ON sales
FOR SELECT
USING (auth.uid() = salesperson_id);

-- Exemplo de política para funcionários
CREATE POLICY "Apenas donos podem gerenciar funcionários"
ON employees
FOR ALL
USING (auth.uid() IN (
  SELECT id FROM users
  WHERE role = 'store_owner'
));
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
├── contexts/      # Contextos React
├── lib/           # Bibliotecas e configurações
├── pages/         # Páginas da aplicação
├── stores/        # Estados globais (Zustand)
└── styles/        # Estilos globais e temas
```

## Funcionalidades

- ✅ Autenticação segura com Supabase
- ✅ Registro de donos de loja
- ✅ Gerenciamento de funcionários
- ✅ Controle de vendas
- ✅ Fila de vendedores
- ✅ Tema claro/escuro
- ✅ Interface responsiva

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 