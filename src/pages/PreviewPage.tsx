import { useEffect, useState } from 'react';
import { useSalesStore } from '../stores/salesStore';
import { useEmployeesStore } from '../stores/employeesStore';
import { Clock } from 'lucide-react';
import SalesQueue from '../components/sales/SalesQueue';

export default function PreviewPage() {
  const { sales, getSalesQueue } = useSalesStore();
  const { employees } = useEmployeesStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showHeader, setShowHeader] = useState(true);
  const [queue, setQueue] = useState<any[]>([]);
  
  // Update queue whenever sales or employees change
  useEffect(() => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const salesQueue = getSalesQueue();
    
    // Filter and map the queue to include only active employees with correct names
    const filteredQueue = salesQueue
      .map(person => {
        const employee = employees.find(emp => emp.id === person.id);
        if (!employee?.canSell) return null;
        
        const hasLoggedInToday = employee.lastActiveAt && employee.lastActiveAt >= todayStart;
        const hasSalesToday = sales.some(
          sale => sale.salespersonId === employee.id && sale.timestamp >= todayStart
        );
        
        if (!hasLoggedInToday && !hasSalesToday) return null;
        
        return {
          ...person,
          name: employee.name // Use the correct name from employees store
        };
      })
      .filter(Boolean);
    
    setQueue(filteredQueue);
  }, [getSalesQueue, sales, employees]);
  
  // Get the next employee in queue
  const nextEmployee = queue[0];
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format current time
  const formattedTime = currentTime.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const formattedDate = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="min-h-screen bg-dark-background text-dark-textPrimary">
      {/* Top bar with controls */}
      <div className="fixed left-0 top-0 z-10 flex w-full items-center justify-between bg-dark-background bg-opacity-90 p-4 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-900/30 text-primary-400">
            <Clock className="h-6 w-6" />
          </div>
          <div className="ml-3">
            <div className="text-xl font-semibold text-dark-textPrimary">
              {formattedTime}
            </div>
            <div className="text-sm text-dark-textSecondary">
              {formattedDate}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowHeader(!showHeader)}
            className="rounded-lg bg-dark-backgroundAlt px-3 py-2 text-sm font-medium text-dark-textPrimary hover:bg-opacity-80"
          >
            {showHeader ? 'Ocultar Cabeçalho' : 'Mostrar Cabeçalho'}
          </button>
          
          <a 
            href="/dashboard" 
            className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Sair da Visualização
          </a>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex min-h-screen flex-col items-center justify-center p-4 pt-20">
        <div className="w-full max-w-5xl">
          {showHeader && (
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-dark-textPrimary">
                Fila de Vendas
              </h1>
              <p className="text-xl text-dark-textSecondary">
                Ordem atual para atendimento
              </p>
            </div>
          )}
          
          {/* Next in Queue Card - Simplified */}
          {nextEmployee && (
            <div className="mb-12 animate-pulse-slow overflow-hidden rounded-2xl border-4 border-primary-500 bg-primary-500/10 p-8 dark:border-primary-400 dark:bg-primary-900/20">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-medium tracking-wide text-primary-700/80 dark:text-primary-300/80">
                  PRÓXIMO ATENDIMENTO
                </h2>
                <p className="mt-4 text-7xl font-bold leading-none text-primary-600 dark:text-primary-400">
                  {nextEmployee.name}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <SalesQueue showHeader={false} />
          </div>
          
          <div className="mt-8 text-center text-dark-textSecondary">
            <p>Última atualização: {new Date(Math.max(...sales.map(s => s.timestamp), 0)).toLocaleString('pt-BR') || 'Sem vendas ainda'}</p>
            <p className="mt-2 text-sm">Esta tela é atualizada automaticamente quando os vendedores registram novas vendas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}