"use client";

import { useState } from "react";
import { supabase } from "../Lib/supabaseClient";

export default function LoginPage() {
  // 📦 Estados tipados con TypeScript
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  // ⚙️ Función para manejar el login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🚀 Autenticar usuario con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ Error al iniciar sesión: " + error.message);
      return;
    }

    // ✅ Si el login es exitoso
    if (data?.user) {
      setMessage("✅ Bienvenido, sesión iniciada correctamente.");
    } else {
      setMessage("⚠️ No se encontró el usuario. Intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4 text-center">Inicio de sesión</h1>

      {/* 📋 Formulario */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Iniciar sesión
        </button>
      </form>

      {/* 💬 Mensajes */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
