"use client";
import "../../i18n"; // Подключение локализации
import "./styles/globals.css";
import Navbar from "../components/navbar";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "../components/theme-provider";
import Footer from "../components/footer";
import { usePathname } from "next/navigation";
import { GlobalToaster } from "../components/GlobalToaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const pathname = usePathname(); // ✅
  const isAdmin = pathname.startsWith("/admin"); // ✅
  return (
    <html lang={i18n.language} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#050119] w-full max-[400px]:w-[122%]">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />
          <main className=" w-full">{children}</main>
          {!isAdmin && <Footer />} {/* ✅ не показываем футер в админке */}
          <GlobalToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
