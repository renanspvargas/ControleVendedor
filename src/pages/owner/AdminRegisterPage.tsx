import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { USER_ROLES } from '../../constants/roles';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function StoreOwnerRegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register({
        email,
        password,
        name,
        role: USER_ROLES.ADMIN,
        store_name: storeName
      });
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao criar conta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-light-backgroundAlt transition-colors duration-300 dark:bg-dark-backgroundAlt">
      {/* Header with theme toggle */}
      <header className="flex items-center justify-between p-4">
        <div className="text-2xl font-bold text-primary-600 dark:text-primary-500">
          SalesQueue
        </div>
        <ThemeToggle />
      </header>
      
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-in">
          <div className="rounded-xl border border-light-border bg-white p-8 shadow-md dark:border-dark-border dark:bg-dark-background">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                Registro de Administrador
              </h2>
              <p className="mt-2 text-light-textSecondary dark:text-dark-textSecondary">
                Crie sua conta para gerenciar sua loja
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-error-50 p-3 text-sm text-error-700 dark:bg-error-700/10 dark:text-error-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  Seu Nome
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                />
              </div>

              <div>
                <label htmlFor="store-name" className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  Nome da Loja
                </label>
                <input
                  id="store-name"
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Registrando...' : 'Registrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 