import { useAuthStore } from '../stores/authStore';
import { useSalesStore } from '../stores/salesStore';
import { useEmployeesStore } from '../stores/employeesStore';
import SalesButton from '../components/sales/SalesButton';
import SalesQueue from '../components/sales/SalesQueue';
import SalesHistory from '../components/sales/SalesHistory';
import { Users, ShoppingBag, Clock, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { startOfDay } from 'date-fns';
import { USER_ROLES } from '../constants/roles';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const sales = useSalesStore((state) => state.sales);
  const employees = useEmployeesStore((state) => state.employees);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  if (!user) return null;
  
  // Get today's start timestamp
  const todayStart = startOfDay(new Date()).getTime();
  
  // Get employees active today (logged in or made sales)
  const activeEmployeesToday = employees.filter(emp => {
    const hasLoggedInToday = emp.lastActiveAt && emp.lastActiveAt >= todayStart;
    const hasSalesToday = sales.some(sale => 
      sale.salespersonId === emp.id && 
      sale.timestamp >= todayStart
    );
    return hasLoggedInToday || hasSalesToday;
  });

  // Count only employees with canSell permission
  const activeSalespeopleCount = employees.filter(emp => emp.canSell).length;

  // Get active employees for dropdown
  const activeEmployees = employees.filter(emp => emp.canSell);

  // Set initial selected employee when component mounts or when active employees change
  useEffect(() => {
    if (user.role === USER_ROLES.ADMIN && activeEmployees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(activeEmployees[0].id);
    } else if (user.role !== USER_ROLES.ADMIN) {
      setSelectedEmployee(user.id);
    }
  }, [user.role, user.id, activeEmployees, selectedEmployee]);

  // Get selected employee data
  const selectedEmployeeData = activeEmployees.find(emp => emp.id === selectedEmployee);
  
  // Disable register button if no valid employee is selected
  const isRegisterDisabled = user.role === USER_ROLES.ADMIN && !selectedEmployeeData;
  
  const totalSales = sales.length;
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary md:text-3xl">
            Painel de Controle
          </h1>
          <p className="mt-1 text-light-textSecondary dark:text-dark-textSecondary">
            Bem-vindo(a), {user.name}. Registre suas vendas e acompanhe a fila.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card slide-in">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  Total de Vendedores
                </p>
                <p className="mt-1 text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                  {activeSalespeopleCount}
                </p>
              </div>
              <div className="rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="card slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  Vendedores Ativos Hoje
                </p>
                <p className="mt-1 text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                  {activeEmployeesToday.length}
                </p>
              </div>
              <div className="rounded-full bg-secondary-100 p-3 text-secondary-600 dark:bg-secondary-900/20 dark:text-secondary-400">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="card slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  Total de Vendas Hoje
                </p>
                <p className="mt-1 text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                  {sales.filter(sale => sale.timestamp >= todayStart).length}
                </p>
              </div>
              <div className="rounded-full bg-accent-100 p-3 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Register Sale Section */}
          <div className="scale-in">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Registrar Venda
              </h2>
              <p className="mt-1 text-light-textSecondary dark:text-dark-textSecondary">
                {user.role === USER_ROLES.ADMIN 
                  ? 'Selecione um vendedor e clique no botão abaixo para registrar uma venda.'
                  : 'Clique no botão abaixo quando realizar uma venda para atualizar a fila.'}
              </p>
            </div>

            {user.role === USER_ROLES.ADMIN && (
              <div className="mb-4">
                <label htmlFor="employee" className="mb-2 block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  Selecionar Vendedor
                </label>
                <select
                  id="employee"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                >
                  <option value="">Selecione um vendedor</option>
                  {activeEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
                {isRegisterDisabled && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Selecione um vendedor para registrar a venda
                  </p>
                )}
              </div>
            )}
            
            <SalesButton
              salespersonId={selectedEmployee}
              salespersonName={selectedEmployeeData?.name}
              disabled={isRegisterDisabled}
            />
          </div>
          
          {/* Sales Queue Section */}
          <div className="scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Fila de Atendimento
              </h2>
              <p className="mt-1 text-light-textSecondary dark:text-dark-textSecondary">
                O vendedor no topo da fila deve atender o próximo cliente.
              </p>
            </div>
            
            <SalesQueue />
            
            <div className="mt-4 flex justify-end">
              <a 
                href="/preview" 
                target="_blank" 
                className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <Eye className="mr-1 h-4 w-4" />
                Modo de Visualização
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}