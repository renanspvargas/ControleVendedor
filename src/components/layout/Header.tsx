import { Bell, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import ThemeToggle from '../ui/ThemeToggle';

type HeaderProps = {
  toggleSidebar: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-light-border bg-white px-4 shadow-sm transition-colors duration-300 dark:border-dark-border dark:bg-dark-background dark:shadow-dark-sm md:px-6">
      {/* Left side - Logo & Hamburger */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 block rounded-md p-2 text-light-textSecondary hover:bg-light-backgroundAlt dark:text-dark-textSecondary dark:hover:bg-dark-backgroundAlt lg:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-primary-600 dark:text-primary-500">SalesQueue</span>
        </Link>
      </div>
      
      {/* Right side - Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Theme toggle */}
        <ThemeToggle />
        
        {/* Notifications */}
        <button className="relative rounded-full p-2 text-light-textSecondary hover:bg-light-backgroundAlt dark:text-dark-textSecondary dark:hover:bg-dark-backgroundAlt">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary-500"></span>
        </button>
        
        {/* Settings */}
        <Link to="/settings" className="rounded-full p-2 text-light-textSecondary hover:bg-light-backgroundAlt dark:text-dark-textSecondary dark:hover:bg-dark-backgroundAlt">
          <Settings className="h-5 w-5" />
        </Link>
        
        {/* User profile */}
        <div className="relative flex items-center">
          <Link to="/profile" className="flex items-center space-x-2 rounded-full p-1 hover:bg-light-backgroundAlt dark:hover:bg-dark-backgroundAlt">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium">{user?.name?.charAt(0)}</span>
              )}
            </div>
            <span className="hidden text-sm font-medium md:block">{user?.name}</span>
          </Link>
        </div>
        
        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="rounded-full p-2 text-light-textSecondary hover:bg-light-backgroundAlt dark:text-dark-textSecondary dark:hover:bg-dark-backgroundAlt"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}