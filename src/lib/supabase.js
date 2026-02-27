import { createClient } from '@supabase/supabase-js';

// Mengambil kunci akses dari file .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Membuat koneksi resmi ke Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);