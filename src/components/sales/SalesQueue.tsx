import { useSalesStore, type Salesperson } from '../../stores/salesStore';
import { useEmployeesStore } from '../../stores/employeesStore';
import { useEffect, useState } from 'react';
import { startOfDay } from 'date-fns';

type SalesQueueProps = {
  limit?: number;
  showHeader?: boolean;
  compact?: boolean;
};

export default function SalesQueue({ limit, showHeader = true, compact = false }: SalesQueueProps) {
  const { getSalesQueue, sales } = useSalesStore();
  const { employees } = useEmployeesStore();
  const [queue, setQueue] = useState<Salesperson[]>([]);
  
  // Calculate today's sales for a specific employee
  const getTodaySalesCount = (employeeId: string) => {
    const todayStart = startOfDay(new Date()).getTime();
    return sales.filter(sale => 
      sale.salespersonId === employeeId && 
      sale.timestamp >= todayStart
    ).length;
  };

  // Update queue whenever sales change
  useEffect(() => {
    const salesQueue = getSalesQueue();
    const todayStart = startOfDay(new Date()).getTime();
    
    // Filter queue to only include employees that:
    // 1. Have canSell permission
    // 2. Are active today (logged in or made sales today)
    const filteredQueue = salesQueue.filter(person => {
      const employee = employees.find(emp => emp.id === person.id);
      if (!employee?.canSell) return false;
      
      const hasLoggedInToday = employee.lastActiveAt && employee.lastActiveAt >= todayStart;
      const hasSalesToday = sales.some(sale => 
        sale.salespersonId === employee.id && 
        sale.timestamp >= todayStart
      );
      
      return hasLoggedInToday || hasSalesToday;
    }).map(person => {
      // Update person data with current employee information
      const employee = employees.find(emp => emp.id === person.id);
      if (employee) {
        return {
          ...person,
          name: employee.name // Ensure we always use the current employee name
        };
      }
      return person;
    });
    
    setQueue(limit ? filteredQueue.slice(0, limit) : filteredQueue);
  }, [getSalesQueue, sales, limit, employees]);
  
  if (queue.length === 0) {
    return (
      <div className="rounded-lg border border-light-border bg-white p-6 text-center shadow-md dark:border-dark-border dark:bg-dark-backgroundAlt">
        <p className="text-light-textSecondary dark:text-dark-textSecondary">
          Nenhum vendedor ativo na fila ainda.
        </p>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg border border-light-border bg-white shadow-md dark:border-dark-border dark:bg-dark-backgroundAlt ${compact ? 'p-3' : 'p-6'}`}>
      {showHeader && (
        <h2 className={`mb-4 font-semibold text-light-textPrimary dark:text-dark-textPrimary ${compact ? 'text-lg' : 'text-xl'}`}>
          Fila de Atendimento
        </h2>
      )}
      
      <div className="space-y-2">
        {queue.map((person, index) => (
          <div 
            key={person.id}
            className={`flex items-center justify-between rounded-md border ${
              index === 0 
                ? 'border-primary-300 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20' 
                : 'border-light-border bg-light-backgroundAlt dark:border-dark-border dark:bg-dark-background'
            } ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
          >
            <div className="flex items-center">
              <div className={`flex items-center justify-center rounded-full ${
                index === 0 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-light-border text-light-textPrimary dark:bg-dark-border dark:text-dark-textPrimary'
                } ${compact ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'}`}>
                {index + 1}
              </div>
              
              <div className={`ml-3 flex items-center ${compact ? 'space-x-2' : 'space-x-3'}`}>
                <div className={`flex items-center justify-center overflow-hidden rounded-full bg-light-backgroundAlt dark:bg-dark-background ${compact ? 'h-6 w-6' : 'h-8 w-8'}`}>
                  {person.avatar ? (
                    <img src={person.avatar} alt={person.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{person.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${compact ? 'text-sm' : 'text-base'} ${
                    index === 0 
                      ? 'text-primary-700 dark:text-primary-400' 
                      : 'text-light-textPrimary dark:text-dark-textPrimary'
                  }`}>
                    {person.name}
                  </span>
                  <span className={`rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300`}>
                    {getTodaySalesCount(person.id)} vendas hoje
                  </span>
                </div>
              </div>
            </div>
            
            {index === 0 && (
              <span className={`rounded-full bg-primary-100 px-2 py-1 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 ${compact ? 'text-xs' : 'text-sm'}`}>
                Próximo
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}