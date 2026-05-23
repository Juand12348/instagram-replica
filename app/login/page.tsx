"use client";

import { useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMensaje("❌ " + error.message);
      return;
    }

    const user = data.user;
    if (!user) {
      setMensaje("❌ Usuario no encontrado");
      return;
    }

    if (!user.confirmed_at) {
      setMensaje("⚠️ Debes confirmar tu correo antes de acceder.");
      return;
    }

    // 🚀 Aquí ya no importa si el perfil existe o no, siempre va al Home
    setMensaje(`✅ Bienvenido ${user.email}`);
    setTimeout(() => {
      router.push("/home"); // 👈 siempre redirige al Home
    }, 1000);
  };

  return (
    <div className="flex w-full">
      {/* Columna izquierda */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold mb-4 font-sans">Instagram</h1>
        <p className="text-lg text-gray-700 mb-6 text-center font-sans">
          Mira los momentos cotidianos de tus mejores amigos.
        </p>
        <div className="flex gap-4">
          <div className="w-24 h-40 bg-gray-200 rounded-md"></div>
          <div className="w-24 h-40 bg-gray-200 rounded-md"></div>
          <div className="w-24 h-40 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex justify-center mb-8">
          <img src="/Logo2.png" alt="Instagram" className="h-30 w-auto mt-20" />
        </div>

        {/* Caja de login */}
        <div className="w-full max-w-sm bg-white border border-gray-300 p-6 rounded-md shadow-md">
          <h1 className="text-center text-4xl font-bold text-black mb-8 font-sans">
            Instagram
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Número de celular, nombre de usuario o correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-sans placeholder-gray-700 text-gray-900"
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-sans placeholder-gray-700 text-gray-900"
              required
            />

            <button
              type="submit"
              className="bg-[#0095f6] text-white py-2 rounded font-semibold hover:bg-blue-600 transition font-sans"
            >
              Iniciar sesión
            </button>
          </form>

          {mensaje && (
            <p className="mt-4 text-center text-sm text-red-500">{mensaje}</p>
          )}

          <div className="mt-4 text-center">
            <button className="text-blue-500 text-sm font-medium">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="px-2 text-gray-500 text-xs">O</span>
            <div className="border-t border-gray-300 w-full"></div>
          </div>

          <div className="mt-4 text-center">
            <button className="text-blue-700 font-semibold text-sm">
              Iniciar sesión con Facebook
            </button>
          </div>
        </div>

        {/* Caja de registro */}
        <div className="w-full max-w-sm mt-4 bg-white border border-gray-300 p-4 text-center rounded-md shadow-md">
          <p className="font-sans text-gray-800">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-blue-500 font-semibold"
            >
              Crear cuenta nueva
            </button>
          </p>
        </div>

        {/* Footer estilo Instagram */}
        <div className="mt-6 text-gray-500 text-xs font-sans">Meta © 2026</div>
      </div>
    </div>
  );
}
