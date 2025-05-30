import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEmployeesStore } from './employeesStore';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'salesperson';
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: async (username: string, password: string) => {
        // Get employees store
        const employeesStore = useEmployeesStore.getState();
        const { employees, updateLastActive } = employeesStore;

        // Check if it's the admin
        if (username === 'admin' && password === 'admin') {
          set({
            user: {
              id: 'admin',
              name: 'Administrador',
              role: 'admin',
            },
          });
          return { success: true };
        }

        // Check if it's an employee
        const employee = employees.find(
          (emp) => emp.username === username && emp.password === password
        );

        if (employee) {
          // Update lastActiveAt timestamp for employee
          updateLastActive(employee.id);
          
          set({
            user: {
              id: employee.id,
              name: employee.name,
              role: 'salesperson',
            },
          });
          return { success: true };
        }

        return {
          success: false,
          message: 'Usuário ou senha incorretos.',
        };
      },
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);