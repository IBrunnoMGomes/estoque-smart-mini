
import { supabase } from '@/integrations/supabase/client';

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // We're now using the client from integrations/supabase
};

export { supabase };
