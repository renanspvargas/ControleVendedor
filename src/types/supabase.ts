import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole } from '../constants/roles';

export interface User extends SupabaseUser {
  name?: string;
  avatar?: string;
  role?: UserRole;
  store_name?: string;
}

export interface Store {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  store_name?: string;
  canSell: boolean;
  lastActiveAt?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  store_name?: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar: string | null;
          role: UserRole;
          store_name?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar?: string | null;
          role?: UserRole;
          store_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar?: string | null;
          role?: UserRole;
          store_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          salesperson_id: string;
          timestamp: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          salesperson_id: string;
          timestamp?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          salesperson_id?: string;
          timestamp?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 