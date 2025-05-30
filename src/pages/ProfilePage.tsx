import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import SalesHistory from '../components/sales/SalesHistory';
import { useSalesStore } from '../stores/salesStore';
import { User, Mail, Save } from 'lucide-react';
import defaultAvatar from '../assets/default-avatar.png';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { sales } = useSalesStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  if (!user) return null;
  
  // Count user's sales
  const userSalesCount = sales.filter(sale => sale.salespersonId === user.id).length;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      await updateUser({ name, email });
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={user?.avatar || defaultAvatar}
              alt={`Avatar de ${user?.name || 'Usuário'}`}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{user?.name || 'Usuário'}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}