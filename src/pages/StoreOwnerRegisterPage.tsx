import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Eye, EyeOff, Store } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function StoreOwnerRegisterPage() {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.storeName.trim()) {
      setError('Por favor, insira o nome da loja');
      return;
    }
    
    if (!formData.ownerName.trim()) {
      setError('Por favor, insira o nome do proprietário');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Por favor, insira um email');
      return;
    }
    
    if (!formData.password) {
      setError('Por favor, insira uma senha');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    
    if (!acceptTerms) {
      setError('Por favor, aceite os termos de uso');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const result = await signUp(formData.email, formData.password, {
        name: formData.ownerName,
        role: 'store_owner',
        store_name: formData.storeName
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Erro no cadastro. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-light-backgroundAlt transition-colors duration-300 dark:bg-dark-backgroundAlt">
      <header className="flex items-center justify-between p-4">
        <div className="text-2xl font-bold text-primary-600 dark:text-primary-500">
          SalesQueue
        </div>
        <ThemeToggle />
      </header>
      
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="rounded-xl border border-light-border bg-white p-8 shadow-md dark:border-dark-border dark:bg-dark-background">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                Cadastrar Nova Loja
              </h2>
              <p className="mt-2 text-light-textSecondary dark:text-dark-textSecondary">
                Crie sua conta para gerenciar suas vendas
              </p>
            </div>
            
            {error && (
              <div className="mb-4 rounded-md bg-error-50 p-3 text-sm text-error-700 dark:bg-error-700/10 dark:text-error-500">
                {error}
              </div>
            )}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                  Nome da Loja
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                  placeholder="Nome da sua loja"
                />
              </div>
              
              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                  Nome do Proprietário
                </label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                    placeholder="Crie uma senha forte"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-light-textSecondary dark:text-dark-textSecondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                  Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                  placeholder="Confirme sua senha"
                />
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-light-border text-primary-600 focus:ring-primary-500 dark:border-dark-border dark:text-primary-500 dark:focus:ring-primary-400"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-light-textSecondary dark:text-dark-textSecondary">
                    Aceito os{' '}
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                      Termos de Uso
                    </a>{' '}
                    e{' '}
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                      Política de Privacidade
                    </a>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                <span className="flex items-center">
                  {loading ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <Store className="mr-2 h-5 w-5" />
                      Criar Conta
                    </>
                  )}
                </span>
              </button>
              
              <div className="mt-4 text-center text-sm">
                <p className="text-light-textSecondary dark:text-dark-textSecondary">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    Faça login
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