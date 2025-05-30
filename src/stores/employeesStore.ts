import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfDay } from 'date-fns';

interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  canSell: boolean;
  lastActiveAt?: number; // Timestamp of last activity
}

interface EmployeesStore {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  updateLastActive: (id: string) => void;
}

export const useEmployeesStore = create<EmployeesStore>()(
  persist(
    (set) => ({
      employees: [],
      addEmployee: (employee) => {
        set((state) => ({
          employees: [
            ...state.employees,
            {
              ...employee,
              id: crypto.randomUUID(),
            },
          ],
        }));
      },
      updateEmployee: (id, employee) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...employee } : emp
          ),
        }));
      },
      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        }));
      },
      updateLastActive: (id) => {
        set((state) => {
          const now = Date.now();
          const todayStart = startOfDay(new Date()).getTime();
          
          return {
            employees: state.employees.map((emp) => {
              if (emp.id !== id) return emp;
              
              // Se não tem lastActiveAt ou se o último acesso foi antes de hoje,
              // atualiza o timestamp
              if (!emp.lastActiveAt || emp.lastActiveAt < todayStart) {
                return { ...emp, lastActiveAt: now };
              }
              
              return emp;
            }),
          };
        });
      },
    }),
    {
      name: 'employees-storage',
    }
  )
); 