import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import EmployeeLoginPage from './pages/EmployeeLoginPage';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PreviewPage = lazy(() => import('./pages/PreviewPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EmployeesPage = lazy(() => import('./pages/EmployeesPage'));
const SalesPage = lazy(() => import('./pages/SalesPage'));

function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/login/funcionario" 
        element={!user ? <EmployeeLoginPage /> : <Navigate to="/sales" />} 
      />
      <Route path="/preview" element={<PreviewPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Admin/Store Owner Routes */}
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<LoadingScreen />}>
                {user?.role === 'admin' ? (
                  <DashboardPage />
                ) : (
                  <Navigate to="/sales" />
                )}
              </Suspense>
            }
          />
          <Route
            path="/funcionarios"
            element={
              <Suspense fallback={<LoadingScreen />}>
                {user?.role === 'admin' ? (
                  <EmployeesPage />
                ) : (
                  <Navigate to="/sales" />
                )}
              </Suspense>
            }
          />
          <Route path="/profile" element={
            <Suspense fallback={<LoadingScreen />}>
              <ProfilePage />
            </Suspense>
          } />

          {/* Employee Routes */}
          <Route
            path="/sales"
            element={
              <Suspense fallback={<LoadingScreen />}>
                {user?.role === 'salesperson' ? (
                  <SalesPage />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Redirect root based on role */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              user
                ? user.role === 'admin'
                  ? '/dashboard'
                  : '/sales'
                : '/login'
            }
          />
        }
      />
      
      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;