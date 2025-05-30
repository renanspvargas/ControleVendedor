import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';
import { initializeSalesperson } from '../../stores/salesStore';

export default function ProtectedRoute() {
  const { user } = useAuthStore();
  
  useEffect(() => {
    // When a user logs in, initialize them as a salesperson if needed
    if (user) {
      initializeSalesperson(user);
    }
  }, [user]);

  if (!user) {
    // Redirect to main login page if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render child routes
  return <Outlet />;
}