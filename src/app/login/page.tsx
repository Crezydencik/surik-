"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Welcome to MeepleCave club");

      // Ждем немного чтобы сессия установилась
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Принудительно обновляем страницу для синхронизации сессии
      window.location.href = "/admin";
    } catch (error) {
      toast.error("Произошла ошибка при входе");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050119] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-[#0e0e1a] rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Meeplecave"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-purple-500 mb-1">
          Настольный клуб
        </h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Войдите для доступа к функциям клуба
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              name="email"
              className="w-full p-3 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm mb-1">
              Пароль
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              name="password"
              className="w-full p-3 bg-black border border-gray-700 rounded-md text-white pr-10 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-400 hover:text-white transition-colors"
              tabIndex={-1}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 transition-all text-white font-medium py-3 rounded-md flex items-center justify-center"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
