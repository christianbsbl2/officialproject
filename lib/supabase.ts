import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          school: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          school: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          school?: string;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          type: 'bullying' | 'harassment' | 'violence' | 'other';
          status: 'pending' | 'reviewed' | 'resolved';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          type: 'bullying' | 'harassment' | 'violence' | 'other';
          status?: 'pending' | 'reviewed' | 'resolved';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          type?: 'bullying' | 'harassment' | 'violence' | 'other';
          status?: 'pending' | 'reviewed' | 'resolved';
          created_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string;
          url: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          url: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          url?: string;
          category?: string;
          created_at?: string;
        };
      };
    };
  };
};