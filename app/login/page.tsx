"use client";

import { useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    // 1. Login con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    const user = data.user;
    if (!user) {
      setMessage("❌ Usuario no encontrado");
      return;
    }

    // 🚨 Validar confirmación de correo
    if (!user.confirmed_at) {
      setMessage("⚠️ Debes confirmar tu correo antes de acceder al MVP.");
      return;
    }

    // 2. Buscar perfil en tabla usuarios por id
    const { data: perfil, error: perfilError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", user.id) // 👈 usar id de Auth
      .single();

    if (perfilError || !perfil) {
      setMessage("⚠️ Sesión iniciada, pero tu perfil no está completo. Completa tu perfil en MVP.");
      // Igual deja entrar al MVP
      setTimeout(() => {
        router.push("/mvp");
      }, 1000);
      return;
    }

    setMessage(`✅ Bienvenido ${perfil.nombre}`);

    // 3. Redirigir al MVP
    setTimeout(() => {
      router.push("/mvp");
    }, 1000);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded"
        >
          Entrar
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}

      {/* Botón de registro */}
      <div className="mt-6 text-center">
        <p>
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-600 underline"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
