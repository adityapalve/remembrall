import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Server components can read cookies but cannot always write them.
            // Supabase may attempt a refresh during render; server actions and
            // route handlers handle the writable cookie path.
          }
        });
      },
    },
  });
}
