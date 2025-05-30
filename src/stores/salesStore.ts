import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export type Salesperson = {
  id: string;
  name: string;
  avatar?: string;
};

export type Sale = {
  id: string;
  salespersonId: string;
  timestamp: number; // Unix timestamp of sale creation
  lastModified: number; // Unix timestamp of last modification
  formattedTime: string; // Human-readable time
  order?: number; // Optional order field for manual sorting
};

type SalesState = {
  salespeople: Salesperson[];
  sales: Sale[];
  addSalesperson: (salesperson: Salesperson) => void;
  updateSalesperson: (id: string, updates: Partial<Salesperson>) => void;
  removeSalesperson: (id: string) => void;
  registerSale: (salespersonId: string) => void;
  deleteSale: (saleId: string) => void;
  reorderSales: (saleId: string, newOrder: number) => void;
  getSalesQueue: () => Salesperson[]; // Returns salespeople ordered by most recent sale
  clearAllSales: () => void;
  recentSalesBySalesperson: (salespersonId: string, limit?: number) => Sale[];
};

// Helper to format timestamp
const formatTimestamp = (timestamp: number): string => {
  return format(new Date(timestamp), 'HH:mm:ss - dd/MM/yyyy');
};

export const useSalesStore = create<SalesState>()(
  persist(
    (set, get) => ({
      salespeople: [],
      sales: [],
      
      addSalesperson: (salesperson) => {
        set(state => ({
          salespeople: [...state.salespeople, salesperson]
        }));
      },
      
      updateSalesperson: (id, updates) => {
        set(state => ({
          salespeople: state.salespeople.map(sp => 
            sp.id === id ? { ...sp, ...updates } : sp
          )
        }));
      },
      
      removeSalesperson: (id) => {
        set(state => ({
          salespeople: state.salespeople.filter(sp => sp.id !== id)
        }));
      },
      
      registerSale: (salespersonId) => {
        const now = Date.now();
        const newSale: Sale = {
          id: `sale-${now}`,
          salespersonId,
          timestamp: now,
          lastModified: now,
          formattedTime: formatTimestamp(now)
        };
        
        set(state => ({
          sales: [newSale, ...state.sales]
        }));
      },

      deleteSale: (saleId) => {
        set(state => ({
          sales: state.sales.filter(sale => sale.id !== saleId)
        }));
      },

      reorderSales: (saleId, newOrder) => {
        set(state => {
          const now = Date.now();
          const sales = [...state.sales];
          const saleIndex = sales.findIndex(s => s.id === saleId);
          if (saleIndex === -1) return state;

          // Remove the sale from its current position
          const [sale] = sales.splice(saleIndex, 1);
          
          // Update the sale with new order and lastModified
          const updatedSale = {
            ...sale,
            order: newOrder,
            lastModified: now
          };

          // Insert the sale at the new position
          sales.splice(newOrder, 0, updatedSale);

          // Update orders for all sales
          const updatedSales = sales.map((s, index) => ({
            ...s,
            order: index
          }));

          return { sales: updatedSales };
        });
      },
      
      getSalesQueue: () => {
        const { salespeople, sales } = get();
        
        // Map of last sale timestamp by salesperson
        const lastSaleMap = new Map<string, number>();
        
        // Find the most recent sale for each salesperson
        sales.forEach(sale => {
          if (!lastSaleMap.has(sale.salespersonId) || 
              sale.timestamp > lastSaleMap.get(sale.salespersonId)!) {
            lastSaleMap.set(sale.salespersonId, sale.timestamp);
          }
        });

        // Get all unique salesperson IDs from both salespeople and sales
        const allSalespersonIds = new Set([
          ...salespeople.map(sp => sp.id),
          ...sales.map(sale => sale.salespersonId)
        ]);
        
        // Create a complete list of salespeople, including those who just made sales
        const completeSalespeople = Array.from(allSalespersonIds).map(id => {
          const existingSalesperson = salespeople.find(sp => sp.id === id);
          if (existingSalesperson) return existingSalesperson;
          
          // If salesperson not in list but has sales, create entry from employee data
          const sale = sales.find(s => s.salespersonId === id);
          if (sale) {
            return {
              id: sale.salespersonId,
              name: 'Vendedor', // This will be updated with actual name from employees store
              avatar: undefined
            };
          }
          return null;
        }).filter((sp): sp is Salesperson => sp !== null);
        
        // Sort salespeople by their most recent sale (oldest first)
        return completeSalespeople.sort((a, b) => {
          const aLastSale = lastSaleMap.get(a.id) || 0;
          const bLastSale = lastSaleMap.get(b.id) || 0;
          return aLastSale - bLastSale; // Oldest sale first
        });
      },
      
      clearAllSales: () => {
        set({ sales: [] });
      },
      
      recentSalesBySalesperson: (salespersonId, limit = 5) => {
        const { sales } = get();
        return sales
          .filter(sale => sale.salespersonId === salespersonId)
          .sort((a, b) => b.lastModified - a.lastModified)
          .slice(0, limit);
      },
    }),
    {
      name: 'sales-storage',
    }
  )
);

// Initialize store with user data when they log in
export const initializeSalesperson = (user: { id: string; name: string; avatar?: string }) => {
  const { salespeople, addSalesperson } = useSalesStore.getState();
  
  // Check if salesperson already exists
  const exists = salespeople.some(sp => sp.id === user.id);
  
  if (!exists) {
    addSalesperson({
      id: user.id,
      name: user.name,
      avatar: user.avatar
    });
  }
};