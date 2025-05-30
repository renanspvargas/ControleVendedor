import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';
import { initializeSalesperson } from '../../stores/salesStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    // When a user logs in, initialize them as a salesperson if needed
    if (user) {
      initializeSalesperson(user);
    }
  }, [user]);

  if (!user) {
    // Redirect to main login page if user is not authenticated
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};