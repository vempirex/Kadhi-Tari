/**
 * NEW AUTH SYSTEM - CLEAN IMPLEMENTATION
 */

import { supabase } from './supabase';

/**
 * Generates a hidden internal email for Supabase Auth.
 * Format: [username]@kadhitari.app
 */
export function generateInternalEmail(username: string): string {
  const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
  return `${cleanUsername}@kadhitari.app`;
}

/**
 * Checks if a username is available.
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  if (!username || username.length < 3) return false;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    console.error("Username check failed:", error);
    return false;
  }

  return !data;
}
