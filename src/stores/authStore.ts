import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; name: string; role: string; store_name?: string }) => Promise<void>;
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

      set({ user: user as User });
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
        options: {
          data: {
            name,
            role,
            store_name
          },
        },
      });

      if (error) throw error;

      set({ user: user as User });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erro ao registrar usuário');
    }
  },

  updateUser: async (data) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });

      if (error) throw error;

      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erro ao atualizar usuário');
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Instruções de recuperação enviadas para seu email.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao enviar email de recuperação.',
      };
    }
  },
}));

// Listener para mudanças na sessão
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.setState({ user: session?.user || null });
});