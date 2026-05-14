import { supabase } from './supabase';

export async function getEmailFromUsername(username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single();
  
  if (error || !data) return null;
  return data.email;
}

export async function isUsernameAvailable(username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();
  
  return !data && error?.code === 'PGRST116'; // PGRST116 is 'no rows returned'
}
