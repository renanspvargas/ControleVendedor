import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
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
                Área do Lojista
              </h2>
              <p className="mt-2 text-light-textSecondary dark:text-dark-textSecondary">
                Entre para gerenciar sua loja
              </p>
            </div>
            
            {error && (
              <div className="mb-4 rounded-md bg-error-50 p-3 text-sm text-error-700 dark:bg-error-700/10 dark:text-error-500">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary"
                >
                  Usuário
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                />
              </div>
              
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  É funcionário?{' '}
                  <Link
                    to="/login/funcionario"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Clique aqui
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}