import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';
import Layout from './components/layout/Layout';

// Lazy loaded components
const AdminLoginPage = lazy(() => import('./pages/owner/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const AdminRegisterPage = lazy(() => import('./pages/owner/AdminRegisterPage'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-register" element={<AdminRegisterPage />} />
        
        {/* Protected routes wrapped in Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sales" element={<SalesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;