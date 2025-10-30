// !!! Не ставь "use client" здесь
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/** Браузерный клиент. Вызывать ТОЛЬКО в Client Components / хуках. */
export function createClientBrowser(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("createClientBrowser() must be called in the browser");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(url, anon);
}

/** Серверный клиент. Вызывать ТОЛЬКО в Server Components / route handlers. */
export function createClientServer(): SupabaseClient {
  const cookieStore = cookies(); // без await
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anon, {
    cookies: {
      async getAll() {
        return (await cookieStore).getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(async ({ name, value, options }) =>
            (await cookieStore).set(name, value, options),
          );
        } catch {
          /* no-op on edge/prerender */
        }
      },
    },
  });
}
