import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (email: string, password: string, metadata: { name: string; role: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user, error: null });
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return {
        success: false,
        message: 'Erro ao fazer login. Por favor, verifique suas credenciais.',
      };
    }
  },

  signUp: async (email: string, password: string, metadata) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Cadastro realizado com sucesso! Verifique seu email.',
      };
    } catch (error) {
      set({ error: error.message });
      return {
        success: false,
        message: 'Erro ao criar conta. Por favor, tente novamente.',
      };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, error: null });
    } catch (error) {
      set({ error: error.message });
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