import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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
        role: 'user'
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
                Criar nova conta
              </h2>
              <p className="mt-2 text-light-textSecondary dark:text-dark-textSecondary">
                Join SalesQueue to manage your sales
              </p>
            </div>
            
            {error && (
              <div className="mb-4 rounded-md bg-error-50 p-3 text-sm text-error-700 dark:bg-error-700/10 dark:text-error-500">
                {error}
              </div>
            )}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="label">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="label">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="Create a password"
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
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Confirm your password"
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
                    I agree to the{' '}
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="btn-primary relative mt-2 w-full"
                disabled={isLoading}
              >
                <span className="flex items-center justify-center">
                  {isLoading ? (
                    <svg className="h-5 w-5 animate-spin\" viewBox="0 0 24 24">
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
                      <UserPlus className="mr-2 h-5 w-5" />
                      Criar conta
                    </>
                  )}
                </span>
              </button>
              
              <div className="mt-4 text-center text-sm">
                <p className="text-light-textSecondary dark:text-dark-textSecondary">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    Sign in
                  </Link>
                </p>
                
                <p className="mt-6 text-xs text-light-textSecondary dark:text-dark-textSecondary">
                  For demo purposes, registration will create a temporary account.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}