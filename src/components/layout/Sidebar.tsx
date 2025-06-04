import { Home, User, Eye, Settings, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { USER_ROLES } from '../../constants/roles';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const getRoleName = (role: string) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Administrador';
    case USER_ROLES.SALESPERSON:
      return 'Vendedor';
    default:
      return 'Usuário';
  }
};

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-dark-background lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-light-border px-4 dark:border-dark-border">
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">SalesQueue</span>
          <button 
            onClick={toggleSidebar}
            className="rounded-md p-2 text-light-textSecondary hover:bg-light-backgroundAlt dark:text-dark-textSecondary dark:hover:bg-dark-backgroundAlt lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex flex-1 flex-col justify-between p-4">
          {/* Navigation */}
          <nav className="space-y-1">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-light-textPrimary hover:bg-light-backgroundAlt dark:text-dark-textPrimary dark:hover:bg-dark-backgroundAlt'
                }`
              }
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>

            {/* Only show Employees link for admins */}
            {user.role === USER_ROLES.ADMIN && (
              <NavLink 
                to="/employees" 
                className={({ isActive }) =>
                  `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'text-light-textPrimary hover:bg-light-backgroundAlt dark:text-dark-textPrimary dark:hover:bg-dark-backgroundAlt'
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5" />
                Funcionários
              </NavLink>
            )}
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-light-textPrimary hover:bg-light-backgroundAlt dark:text-dark-textPrimary dark:hover:bg-dark-backgroundAlt'
                }`
              }
            >
              <User className="mr-3 h-5 w-5" />
              Perfil
            </NavLink>
            
            <NavLink 
              to="/preview" 
              target="_blank"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-light-textPrimary transition-colors hover:bg-light-backgroundAlt dark:text-dark-textPrimary dark:hover:bg-dark-backgroundAlt"
            >
              <Eye className="mr-3 h-5 w-5" />
              Modo de Visualização
            </NavLink>
          </nav>
          
          {/* User info */}
          <div className="mt-auto border-t border-light-border pt-4 dark:border-dark-border">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                <span className="text-lg font-medium">{user.name?.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">{user.name}</p>
                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                  {getRoleName(user.role || '')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}