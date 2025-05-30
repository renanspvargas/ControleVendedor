import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import SalesHistory from '../components/sales/SalesHistory';
import { useSalesStore } from '../stores/salesStore';
import { User, Mail, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { sales } = useSalesStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  if (!user) return null;
  
  // Count user's sales
  const userSalesCount = sales.filter(sale => sale.salespersonId === user.id).length;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateUser({ name, email });
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary md:text-3xl">
        Your Profile
      </h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-medium">{user.name.charAt(0)}</span>
                  )}
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                {user.name}
              </h2>
              <p className="mt-1 text-light-textSecondary dark:text-dark-textSecondary">
                {user.email}
              </p>
              
              <div className="mt-4 w-full border-t border-light-border pt-4 dark:border-dark-border">
                <div className="flex justify-between">
                  <span className="text-light-textSecondary dark:text-dark-textSecondary">Role</span>
                  <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary capitalize">
                    {user.role}
                  </span>
                </div>
                
                <div className="mt-2 flex justify-between">
                  <span className="text-light-textSecondary dark:text-dark-textSecondary">Total Sales</span>
                  <span className="font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {userSalesCount}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline mt-6 w-full"
                disabled={isEditing}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Edit Profile / Sales History */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="card">
              <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Edit Profile
              </h2>
              
              {successMessage && (
                <div className="mb-4 rounded-md bg-success-50 p-3 text-sm text-success-700 dark:bg-success-700/10 dark:text-success-500">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="label">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-light-textSecondary dark:text-dark-textSecondary">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-light-textSecondary dark:text-dark-textSecondary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center">
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
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-5 w-5" />
                        Save Changes
                      </span>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setName(user.name);
                      setEmail(user.email);
                      setIsEditing(false);
                    }}
                    className="btn-outline"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Your Sales History
              </h2>
              <SalesHistory limit={10} showTitle={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}