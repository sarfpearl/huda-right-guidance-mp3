import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (uses the public anon key — safe for the client).
 * Only used by client components once Supabase is connected. In seed mode
 * nothing calls this.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase env not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }
  return createBrowserClient(url, anonKey);
}
