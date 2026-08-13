import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using the SERVICE ROLE key.
 *
 * ⚠️ SERVER-ONLY. This bypasses Row Level Security. Never import this into a
 * client component and never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 * Use only inside server actions / route handlers that have already verified
 * the caller is an authenticated admin.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin env not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
