"use client";

import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { supabase } from "../app/Lib/supabaseClient";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}>
        {/* 🔹 Barra superior solo en /mvp y /user */}
        {user && (pathname === "/mvp" || pathname === "/user") && (
          <nav className="bg-white border-b border-gray-300 p-4 flex gap-6 justify-center shadow-sm">
            <Link href="/mvp" className="text-blue-600 font-semibold hover:underline">
              MVP
            </Link>
            <Link href="/user" className="text-blue-600 font-semibold hover:underline">
              Usuario
            </Link>
          </nav>
        )}

        {/* 🔹 Contenido principal */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
