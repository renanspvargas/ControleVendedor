import { useSalesStore } from '../../stores/salesStore';
import { useAuthStore } from '../../stores/authStore';
import { useEmployeesStore } from '../../stores/employeesStore';
import { format, isToday, isYesterday } from 'date-fns';
import { ShoppingBag, GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { USER_ROLES } from '../../constants/roles';

interface SalesHistoryProps {
  salespersonId: string;
  limit?: number;
}

export default function SalesHistory({ salespersonId, limit = 10 }: SalesHistoryProps) {
  const { user } = useAuthStore();
  const { sales, deleteSale, reorderSales } = useSalesStore();
  const { employees } = useEmployeesStore();
  const [draggedSale, setDraggedSale] = useState<string | null>(null);
  
  if (!user) return null;
  
  // Get sales based on user role
  const filteredSales = user.role === USER_ROLES.ADMIN
    ? sales // Show all sales for admin
    : sales.filter(sale => sale.salespersonId === user.id); // Show only user's sales for employees

  // Sort sales by timestamp
  const sortedSales = [...filteredSales]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
  
  if (sortedSales.length === 0) {
    return (
      <div className="rounded-lg border border-light-border bg-white p-6 text-center shadow-md dark:border-dark-border dark:bg-dark-backgroundAlt">
        <p className="text-light-textSecondary dark:text-dark-textSecondary">
          {user.role === USER_ROLES.ADMIN ? 'Nenhuma venda registrada ainda.' : 'Você não registrou nenhuma venda ainda.'}
        </p>
      </div>
    );
  }
  
  // Format the date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) return `Hoje às ${format(date, 'HH:mm')}`;
    if (isYesterday(date)) return `Ontem às ${format(date, 'HH:mm')}`;
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  // Get salesperson name
  const getSalespersonName = (salespersonId: string) => {
    return employees.find(emp => emp.id === salespersonId)?.name || 'Vendedor não encontrado';
  };

  // Handle drag and drop
  const handleDragStart = (saleId: string) => {
    setDraggedSale(saleId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedSale) return;

    const draggedIndex = sortedSales.findIndex(s => s.id === draggedSale);
    if (draggedIndex === index) return;

    reorderSales(draggedSale, index);
  };

  const handleDragEnd = () => {
    setDraggedSale(null);
  };

  // Handle delete
  const handleDelete = (saleId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      deleteSale(saleId);
    }
  };
  
  return (
    <div className="rounded-lg border border-light-border bg-white p-6 shadow-md dark:border-dark-border dark:bg-dark-backgroundAlt">
      <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
        {user.role === USER_ROLES.ADMIN ? 'Histórico de Vendas' : 'Suas Vendas Recentes'}
      </h2>
      
      <div className="space-y-2">
        {sortedSales.map((sale, index) => (
          <div 
            key={sale.id}
            draggable={user.role === USER_ROLES.ADMIN}
            onDragStart={() => handleDragStart(sale.id)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between rounded-md border border-light-border bg-light-backgroundAlt px-4 py-3 dark:border-dark-border dark:bg-dark-background ${
              draggedSale === sale.id ? 'opacity-50' : ''
            } ${user.role === USER_ROLES.ADMIN ? 'cursor-move' : ''}`}
          >
            <div className="flex items-center">
              {user.role === USER_ROLES.ADMIN && (
                <div className="mr-2 text-light-textSecondary dark:text-dark-textSecondary">
                  <GripVertical className="h-4 w-4" />
                </div>
              )}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <span className="text-light-textPrimary dark:text-dark-textPrimary">
                  Venda registrada
                </span>
                {user.role === USER_ROLES.ADMIN && (
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    por {getSalespersonName(sale.salespersonId)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                {formatDate(sale.timestamp)}
              </span>
              {user.role === USER_ROLES.ADMIN && (
                <button
                  onClick={() => handleDelete(sale.id)}
                  className="text-light-textSecondary hover:text-red-600 dark:text-dark-textSecondary dark:hover:text-red-400"
                  title="Excluir venda"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}