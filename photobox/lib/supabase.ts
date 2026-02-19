import { createClient } from "@supabase/supabase-js";

let supabaseClient: any = null;

export function getSupabase() {

  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {

    throw new Error(
      "Supabase env vars missing. Check Vercel Environment Variables."
    );

  }

  supabaseClient = createClient(
    supabaseUrl,
    supabaseKey
  );

  return supabaseClient;

}
