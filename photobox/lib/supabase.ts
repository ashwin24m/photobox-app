/* import { createClient } from "@supabase/supabase-js";

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
 */



import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window === "undefined") {
      // During build/SSR just return a dummy safe client
      return {} as SupabaseClient;
    }
    throw new Error("Supabase environment variables are missing.");
  }

  supabase = createClient(url, key);
  return supabase;
}