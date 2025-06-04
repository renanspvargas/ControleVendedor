import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole } from '../constants/roles';

export interface User extends SupabaseUser {
  name?: string;
  avatar?: string;
  role_id: number;
  role?: {
    id: number;
    name: UserRole;
  };
  store_name?: string;
  admin?: AdminData;
}

export interface AdminData {
  id: string;
  user_id: string;
  name: string;
  company_name: string;
  created_at: string;
  updated_at: string;
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
  email: string;
  name: string | null;
  avatar: string | null;
  role_id: number;
  admin_id: string;
  created_at: string;
  updated_at: string;
  role?: {
    id: number;
    name: UserRole;
  };
  admin?: {
    id: string;
    company_name: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role_id: number;
  role?: {
    id: number;
    name: UserRole;
  };
  store_name?: string;
}

export interface Database {
  public: {
    Tables: {
      tab_roles: {
        Row: {
          id: number;
          name: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      tab_employees: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar: string | null;
          role_id: number;
          admin_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar?: string | null;
          role_id: number;
          admin_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar?: string | null;
          role_id?: number;
          admin_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tab_admin: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          company_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          company_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tab_sales: {
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
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 