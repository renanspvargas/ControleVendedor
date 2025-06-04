import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useEmployeesStore } from '../stores/employeesStore';
import { Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  canSell: boolean;
  lastActiveAt?: number;
}

export default function EmployeesPage() {
  const { user } = useAuthStore();
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployeesStore();
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    username: '',
    password: '',
    canSell: true,
  });

  // If not admin, redirect or show access denied
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
            Acesso Negado
          </h1>
          <p className="mt-2 text-light-textSecondary dark:text-dark-textSecondary">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        name: newEmployee.name,
        username: newEmployee.username,
        canSell: newEmployee.canSell,
        ...(newEmployee.password ? { password: newEmployee.password } : {}),
      });
      setEditingEmployee(null);
    } else {
      addEmployee(newEmployee);
    }
    setIsAddingEmployee(false);
    setNewEmployee({ name: '', username: '', password: '', canSell: true });
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      username: employee.username,
      password: '', // Don't show existing password
      canSell: employee.canSell,
    });
    setIsAddingEmployee(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary md:text-3xl">
          Gerenciar Funcionários
        </h1>
        <p className="mt-1 text-light-textSecondary dark:text-dark-textSecondary">
          Adicione e gerencie as contas dos funcionários.
        </p>
      </div>

      {/* Add Employee Button */}
      {!isAddingEmployee && (
        <button
          onClick={() => {
            setIsAddingEmployee(true);
            setEditingEmployee(null);
            setNewEmployee({ name: '', username: '', password: '', canSell: true });
          }}
          className="mb-6 flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Adicionar Funcionário
        </button>
      )}

      {/* Add/Edit Employee Form */}
      {isAddingEmployee && (
        <div className="mb-6 rounded-lg border border-light-border p-4 dark:border-dark-border">
          <h2 className="mb-4 text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary">
            {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                Nome
              </label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                Usuário
              </label>
              <input
                type="text"
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                Senha {editingEmployee && '(deixe em branco para manter a mesma)'}
              </label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                className="mt-1 block w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-textPrimary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-background dark:text-dark-textPrimary"
                {...(!editingEmployee && { required: true })}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="canSell"
                checked={newEmployee.canSell}
                onChange={(e) => setNewEmployee({ ...newEmployee, canSell: e.target.checked })}
                className="h-4 w-4 rounded border-light-border text-primary-600 focus:ring-primary-500 dark:border-dark-border"
              />
              <label
                htmlFor="canSell"
                className="ml-2 block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary"
              >
                Pode registrar vendas
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingEmployee(false);
                  setEditingEmployee(null);
                  setNewEmployee({ name: '', username: '', password: '', canSell: true });
                }}
                className="rounded-md border border-light-border px-4 py-2 text-light-textSecondary hover:bg-light-background dark:border-dark-border dark:text-dark-textSecondary dark:hover:bg-dark-background"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
              >
                {editingEmployee ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employees List */}
      <div className="rounded-lg border border-light-border dark:border-dark-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
            <thead className="bg-light-background dark:bg-dark-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
                  Pode Vender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
                  Ativo Hoje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border bg-white dark:divide-dark-border dark:bg-dark-background">
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-light-textPrimary dark:text-dark-textPrimary">
                    {employee.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-light-textPrimary dark:text-dark-textPrimary">
                    {employee.username}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-light-textPrimary dark:text-dark-textPrimary">
                    <input
                      type="checkbox"
                      checked={employee.canSell}
                      onChange={(e) => updateEmployee(employee.id, { canSell: e.target.checked })}
                      className="h-4 w-4 rounded border-light-border text-primary-600 focus:ring-primary-500 dark:border-dark-border"
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-light-textSecondary dark:text-dark-textSecondary">
                    {employee.canSell ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Sim
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        Não
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-light-textSecondary dark:text-dark-textSecondary">
                    {employee.lastActiveAt ? (
                      <span className={`text-sm ${isToday(employee.lastActiveAt) ? 'text-green-600 dark:text-green-400' : ''}`}>
                        {format(employee.lastActiveAt, isToday(employee.lastActiveAt) ? "'Hoje às' HH:mm" : "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    ) : (
                      <span className="text-sm text-light-textTertiary dark:text-dark-textTertiary">
                        Nunca
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="rounded p-1 text-light-textSecondary hover:bg-light-background hover:text-primary-600 dark:text-dark-textSecondary dark:hover:bg-dark-background dark:hover:text-primary-400"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="rounded p-1 text-light-textSecondary hover:bg-light-background hover:text-red-600 dark:text-dark-textSecondary dark:hover:bg-dark-background dark:hover:text-red-400"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-light-textSecondary dark:text-dark-textSecondary"
                  >
                    Nenhum funcionário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 