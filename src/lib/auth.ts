import { supabase } from './supabase';

/**
 * Generates a deterministic dummy email for username-only login.
 * Supabase requires an email for traditional auth.
 */
export function getDummyEmail(username: string) {
  return `${username.toLowerCase().trim()}@kadhitari.private`;
}

export async function isUsernameAvailable(username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle();
  
  if (error) {
    console.error("Availability check error:", error);
    return false;
  }
  
  return !data;
}

export async function getProfileByUsername(username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle();
  
  if (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
  
  return data;
}
