import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSalesStore } from '../stores/salesStore';
import { Sun, Moon, Trash2, Save, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { clearAllSales } = useSalesStore();
  
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleClearSales = () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      return;
    }
    
    clearAllSales();
    setIsConfirmingClear(false);
    setSuccessMessage('All sales data has been cleared successfully.');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary md:text-3xl">
        Settings
      </h1>
      
      {successMessage && (
        <div className="mb-6 rounded-md bg-success-50 p-4 text-success-700 dark:bg-success-700/10 dark:text-success-500">
          {successMessage}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Appearance */}
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
            Appearance
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                Theme
              </p>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Choose between light and dark theme
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={toggleTheme}
                className={`flex items-center rounded-lg px-4 py-2 transition-colors ${
                  !isDarkMode 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'bg-light-backgroundAlt text-light-textPrimary hover:bg-light-border dark:bg-dark-background dark:text-dark-textPrimary dark:hover:bg-dark-backgroundAlt'
                }`}
              >
                <Sun className="mr-2 h-5 w-5" />
                Light
              </button>
              
              <button
                onClick={toggleTheme}
                className={`flex items-center rounded-lg px-4 py-2 transition-colors ${
                  isDarkMode 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'bg-light-backgroundAlt text-light-textPrimary hover:bg-light-border dark:bg-dark-background dark:text-dark-textPrimary dark:hover:bg-dark-backgroundAlt'
                }`}
              >
                <Moon className="mr-2 h-5 w-5" />
                Dark
              </button>
            </div>
          </div>
        </div>
        
        {/* Data Management */}
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
            Data Management
          </h2>
          
          <div className="border-b border-light-border pb-4 dark:border-dark-border">
            <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
              Reset Sales Data
            </p>
            <p className="mt-1 text-sm text-light-textSecondary dark:text-dark-textSecondary">
              Clear all sales history and reset the queue. This action cannot be undone.
            </p>
            
            {isConfirmingClear ? (
              <div className="mt-4 rounded-md bg-error-50 p-4 dark:bg-error-700/10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-error-700 dark:text-error-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-error-700 dark:text-error-500">
                      Are you sure you want to clear all sales data?
                    </h3>
                    <div className="mt-2 flex space-x-3">
                      <button
                        onClick={handleClearSales}
                        className="flex items-center rounded-md bg-error-700 px-3 py-2 text-sm font-medium text-white hover:bg-error-800 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 dark:bg-error-600 dark:hover:bg-error-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Yes, Clear Data
                      </button>
                      <button
                        onClick={() => setIsConfirmingClear(false)}
                        className="rounded-md bg-white px-3 py-2 text-sm font-medium text-light-textPrimary shadow-sm hover:bg-light-backgroundAlt dark:bg-dark-background dark:text-dark-textPrimary dark:hover:bg-dark-backgroundAlt"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClearSales}
                className="mt-4 flex items-center rounded-md bg-error-100 px-4 py-2 text-sm font-medium text-error-700 hover:bg-error-200 dark:bg-error-900/20 dark:text-error-500 dark:hover:bg-error-900/30"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Sales Data
              </button>
            )}
          </div>
          
          <div className="mt-4">
            <p className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
              Export Data
            </p>
            <p className="mt-1 text-sm text-light-textSecondary dark:text-dark-textSecondary">
              Download all sales data as a JSON file.
            </p>
            
            <button
              className="mt-4 flex items-center rounded-md bg-light-backgroundAlt px-4 py-2 text-sm font-medium text-light-textPrimary hover:bg-light-border dark:bg-dark-background dark:text-dark-textPrimary dark:hover:bg-dark-backgroundAlt"
            >
              <Save className="mr-2 h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
        
        {/* About */}
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
            About
          </h2>
          
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            SalesQueue v1.0.0
          </p>
          <p className="mt-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
            A simple application to manage sales order in retail stores.
          </p>
        </div>
      </div>
    </div>
  );
}