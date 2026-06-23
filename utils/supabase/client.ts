import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseAnonKey } from '@/lib/env';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = getSupabaseAnonKey();

export const createClient = () => createBrowserClient(supabaseUrl!, supabaseKey!);