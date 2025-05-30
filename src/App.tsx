import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy loaded components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const EmployeesPage = lazy(() => import('./pages/EmployeesPage'));
const StoreOwnerRegisterPage = lazy(() => import('./pages/StoreOwnerRegisterPage'));
const EmployeeLoginPage = lazy(() => import('./pages/EmployeeLoginPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/store-owner-register" element={<StoreOwnerRegisterPage />} />
          <Route path="/employee-login" element={<EmployeeLoginPage />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;