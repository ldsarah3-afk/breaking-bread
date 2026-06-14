import { createClient } from "@supabase/supabase-js";

// Set NEXT_PUBLIC_SUPABASE_URL to your Supabase project URL
// Set NEXT_PUBLIC_SUPABASE_ANON_KEY to your Supabase anon/public key
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
