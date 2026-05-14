import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://taktdocvoeirfghwoioo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRha3Rkb2N2b2VpcmZnaHdvaW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTUxNjksImV4cCI6MjA5NDMzMTE2OX0.6e2Jb6ePY4Dg7sHactXwuGCySYNMIu04vsT-QmJbEl8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
