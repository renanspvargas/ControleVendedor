import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  name?: string;
  avatar?: string;
  role?: string;
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
  store_id: string;
  user_id: string;
  name: string;
  can_sell: boolean;
  is_active: boolean;
  last_active_at: string;
  created_at: string;
  updated_at: string;
} 