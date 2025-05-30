import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSalesStore } from '../stores/salesStore';
import { useEmployeesStore } from '../stores/employeesStore';
import SalesButton from '../components/sales/SalesButton';
import SalesQueue from '../components/sales/SalesQueue';

export default function SalesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sales } = useSalesStore();
  const { employees } = useEmployeesStore();

  useEffect(() => {
    // Redirect to employee login if not authenticated or not a salesperson
    if (!user || user.role !== 'salesperson') {
      navigate('/login/funcionario');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Get employee data to check if they can sell
  const employeeData = employees.find(emp => emp.id === user.id);
  const canSell = employeeData?.canSell ?? false;

  // Count user's sales
  const userSalesCount = sales.filter(sale => sale.salespersonId === user.id).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary md:text-3xl">
          Registrar Venda
        </h1>
        <p className="mt-1 text-light-textSecondary dark:text-dark-textSecondary">
          Olá, {user.name}. Você registrou {userSalesCount} {userSalesCount === 1 ? 'venda' : 'vendas'} hoje.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Sales Queue Section */}
        <div className="rounded-lg border border-light-border p-6 dark:border-dark-border">
          <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
            Fila de Atendimento
          </h2>
          <p className="mb-6 text-light-textSecondary dark:text-dark-textSecondary">
            O vendedor no topo da fila deve atender o próximo cliente.
          </p>
          <SalesQueue />
        </div>

        {/* Register Sale Section */}
        {canSell ? (
          <div className="rounded-lg border border-light-border p-6 dark:border-dark-border">
            <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
              Registrar Nova Venda
            </h2>
            <p className="mb-6 text-light-textSecondary dark:text-dark-textSecondary">
              Clique no botão abaixo quando realizar uma venda para atualizar a fila.
            </p>
            <SalesButton
              salespersonId={user.id}
              salespersonName={user.name}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-light-border p-6 dark:border-dark-border">
            <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
              Acesso Restrito
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Você não tem permissão para registrar vendas. Entre em contato com o administrador.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 