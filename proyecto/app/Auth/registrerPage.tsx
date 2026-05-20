"use client";

import { useState } from "react";
import { supabase } from "../Lib/supabaseClient";

export default function RegisterPage() {
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🚀 Registrar al usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("❌ Error en registro: " + error.message);
      return;
    }

    // ⚠️ Verificar ID de usuario
    const userId = data.user?.id;
    if (!userId) {
      setMessage("⚠️ No se pudo obtener el ID del usuario.");
      return;
    }

    // 📘 Insertar datos en la tabla 'estudiantes'
    const { error: insertError } = await supabase.from("estudiantes").insert([
      {
        id: userId, // Usamos el mismo ID de autenticación
        nombre,
        correo: email,
        telefono,
      },
    ]);

    if (insertError) {
      setMessage(
        "⚠️ Usuario autenticado pero no guardado en la tabla: " +
          insertError.message
      );
      return;
    }

    // ✅ Éxito
    setMessage(
      "✅ Usuario registrado y guardado correctamente. Revisa tu correo para confirmar."
    );
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4 text-center">
        Registro de estudiante
      </h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
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

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Registrarse
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
