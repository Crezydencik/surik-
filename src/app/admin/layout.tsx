"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Toaster } from "sonner";

// ✅ импортируем типы из supabase-js
import type { Session, AuthError } from "@supabase/supabase-js";

type SessionResponse = {
  data: { session: Session | null };
  error: AuthError | null;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // быстрый таймаут
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 2000),
        );

        const sessionPromise: Promise<SessionResponse> =
          supabase.auth.getSession();

        // ✅ теперь race строго типизирован
        const result = await Promise.race([sessionPromise, timeoutPromise]);

        if (!mounted) return;

        if ("data" in result && !result.data.session && !isLoginPage) {
          router.replace("/admin/login");
          return;
        }

        if ("data" in result && result.data.session && isLoginPage) {
          router.replace("/admin");
          return;
        }
      } catch (error) {
        console.log("Auth check:", error);
        if (!isLoginPage && mounted) {
          router.replace("/admin/login");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, isLoginPage, supabase, router]);

  // Показываем скелетон вместо полной загрузки
  if (loading && !isLoginPage) {
    return (
      <div className="flex h-screen bg-black text-white">
        {/* Скелетон сайдбара */}
        <div className="w-64 bg-[#0A0A0A] p-4">
          <div className="h-8 bg-gray-800 rounded mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
        </div>

        {/* Скелетон контента */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-[#0A0A0A] border-b border-gray-800 animate-pulse"></div>
          <div className="flex-1 p-6">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

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
