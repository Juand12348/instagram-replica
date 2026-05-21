"use client";

import { useState, useEffect } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🚀 Verificar si ya hay usuario logueado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        // ✅ Usuario logueado → redirige a perfil
        router.push("/user");
      } else {
        // ❌ No hay usuario → puede registrarse
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Verificando sesión...</p>;

  // 🚀 Manejar registro
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMensaje("❌ Error en registro: " + error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setMensaje("⚠️ No se pudo obtener el ID del usuario.");
      return;
    }

    const { error: insertError } = await supabase.from("estudiantes").insert([
      {
        id: userId,
        nombre,
        correo: email,
        telefono,
      },
    ]);

    if (insertError) {
      setMensaje(
        "⚠️ Usuario autenticado pero no guardado en la tabla: " +
          insertError.message
      );
      return;
    }

    setMensaje(
      "✅ Usuario registrado y guardado correctamente. Revisa tu correo para confirmar."
    );

    // 🔄 Redirigir al perfil después de registro
    router.push("/user");
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

      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}

              de registro a login
      {/* 🔗 Enlace a la página de login */}
      <p className="mt-4 text-center">
      ¿Ya tienes cuenta?{" "}
      <button
      onClick={() => router.push("/login")}
      className="text-blue-600 underline"
      >
      Inicia sesión aquí
      </button>
      </p>

      de login a registro
      {/* 🔗 Enlace a la página de registro */}
      <p className="mt-4 text-center">
      ¿No tienes cuenta?{" "}
      <button
      onClick={() => router.push("/register")}
      className="text-blue-600 underline"
      >
      Regístrate aquí
      </button>
      </p>
    </div>
  );
}
