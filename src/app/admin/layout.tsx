"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Toaster } from "sonner";

// типы из supabase-js
import type { AuthError, Session } from "@supabase/supabase-js";
import { createClientBrowser } from "../../lib/supabase/server";

type RaceResult = { kind: "ok"; session: Session | null } | { kind: "timeout" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = useMemo(() => createClientBrowser(), []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      // считаем isLoginPage внутри эффекта — не нужен в deps
      const isLoginPage = pathname === "/admin/login";

      try {
        const timeoutPromise = new Promise<RaceResult>((resolve) =>
          setTimeout(() => resolve({ kind: "timeout" }), 2000),
        );

        const sessionPromise = supabase.auth
          .getSession()
          .then(
            (res: {
              data: { session: Session | null };
              error: AuthError | null;
            }) => {
              return { kind: "ok", session: res.data.session } as RaceResult;
            },
          );
        const result = await Promise.race([sessionPromise, timeoutPromise]);

        if (!mounted) return;

        if (result.kind === "timeout") {
          // при таймауте считаем, что не залогинен
          if (!isLoginPage) router.replace("/admin/login");
          return;
        }

        // result.kind === "ok"
        const hasSession = !!result.session;

        if (!hasSession && !isLoginPage) {
          router.replace("/admin/login");
          return;
        }
        if (hasSession && isLoginPage) {
          router.replace("/admin");
          return;
        }
      } catch (err: unknown) {
        console.log("Auth check error:", err);
        if (mounted && pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
    // deps: всё, что реально используется внутри
  }, [pathname, router, supabase]);

  // Скелетон во время проверки авторизации (кроме страницы логина)
  if (loading && pathname !== "/admin/login") {
    return (
      <div className="flex h-screen bg-black text-white">
        <div className="w-64 bg-[#0A0A0A] p-4">
          <div className="h-8 bg-gray-800 rounded mb-4 animate-pulse" />
          <div className="h-6 bg-gray-800 rounded mb-2 animate-pulse" />
          <div className="h-6 bg-gray-800 rounded mb-2 animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-[#0A0A0A] border-b border-gray-800 animate-pulse" />
          <div className="flex-1 p-6">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4 animate-pulse" />
            <div className="h-4 bg-gray-800 rounded w-full mb-2 animate-pulse" />
            <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const isLoginPage = pathname === "/admin/login";

  return (
    <>
      {isLoginPage ? (
        <div className="min-h-screen bg-[#050119]">
          {children}
          <Toaster position="top-right" richColors closeButton />
        </div>
      ) : (
        <div className="flex h-screen bg-black text-white">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6 bg-[#0A0A0A]">
              {children}
            </main>
          </div>
          <Toaster position="top-right" richColors closeButton />
        </div>
      )}
    </>
  );
}
