import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types/supabase';
import { UserRole } from '../constants/roles';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; name: string; role: UserRole; store_name?: string }) => Promise<void>;
  updateUser: (data: { name?: string; avatar?: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!user) throw new Error('Usuário não encontrado');

      // Buscar dados adicionais do usuário na tabela tab_users, incluindo a role
      const { data: userData, error: userError } = await supabase
        .from('tab_users')
        .select(`
          *,
          role:tab_roles(*)
        `)
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      set({ user: { ...user, ...userData } as unknown as User });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erro ao fazer login');
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erro ao fazer logout');
    }
  },

  register: async ({ email, password, name, role, store_name }) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!user) throw new Error('Erro ao criar usuário');

      // Buscar o role_id baseado no nome da role
      const { data: roleData, error: roleError } = await supabase
        .from('tab_roles')
        .select('id')
        .eq('name', role)
        .single();

      if (roleError) throw roleError;
      if (!roleData) throw new Error('Role não encontrada');

      // Inserir dados adicionais na tabela tab_users
      const { error: insertError } = await supabase
        .from('tab_users')
        .insert([
          {
            id: user.id,
            email,
            name,
            role_id: roleData.id,
            store_name
          }
        ]);

      if (insertError) throw insertError;

      // Buscar os dados completos do usuário, incluindo a role
      const { data: userData, error: userError } = await supabase
        .from('tab_users')
        .select(`
          *,
          role:tab_roles(*)
        `)
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      set({ user: { ...user, ...userData } as unknown as User });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erro ao registrar usuário');
    }
  },

  updateUser: async (data) => {
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data
      });

      if (authError) throw authError;

      const currentUser = get().user;
      if (!currentUser) throw new Error('Usuário não encontrado');

      // Atualizar dados na tabela tab_users
      const { error: updateError } = await supabase
        .from('tab_users')
        .update(data)
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      // Buscar dados atualizados do usuário
      const { data: userData, error: userError } = await supabase
        .from('tab_users')
        .select(`
          *,
          role:tab_roles(*)
        `)
        .eq('id', currentUser.id)
        .single();

      if (userError) throw userError;

      set({ user: { ...currentUser, ...userData } as unknown as User });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erro ao atualizar usuário');
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true, message: 'Email de recuperação enviado com sucesso!' };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'Erro ao enviar email de recuperação' };
    }
  }
}));

// Listener para mudanças na sessão
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    // Buscar dados adicionais do usuário quando a sessão mudar
    const { data: userData, error } = await supabase
      .from('tab_users')
      .select(`
        *,
        role:tab_roles(*)
      `)
      .eq('id', session.user.id)
      .single();

    if (!error && userData) {
      useAuthStore.setState({ 
        user: { ...session.user, ...userData } as unknown as User 
      });
    } else {
      useAuthStore.setState({ user: session.user as User });
    }
  } else {
    useAuthStore.setState({ user: null });
  }
});