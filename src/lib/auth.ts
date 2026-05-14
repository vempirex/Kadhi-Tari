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
    .maybeSingle();
  
  if (error) {
    console.error("Availability check error:", error);
    return false; // Treat errors as "taken" to be safe, or handle differently
  }
  
  return !data; // If no data is found, the username is available
}
