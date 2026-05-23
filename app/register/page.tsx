"use client";

import { useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mensaje, setMensaje] = useState<string | null>(null);

  // 🚀 Registro
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMensaje("❌ " + error.message);
      return;
    }

    const user = data.user;
    if (!user) {
      setMensaje("❌ No se pudo crear el usuario en Auth");
      return;
    }

    const { error: insertError } = await supabase.from("usuarios").insert([
      {
        id: user.id,
        username,
        nombre,
        correo: email,
        foto_perfil: null,
        biografia: null,
        creado_en: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      setMensaje("❌ Error insertando perfil: " + insertError.message);
      return;
    }

    // 🚀 Mensaje de confirmación
    setMensaje("✅ Cuenta creada. Revisa tu correo y confirma antes de iniciar sesión.");

    // 👉 Aquí ya NO redirigimos automáticamente al Home
    // El flujo correcto es: Register → Login → Home
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-50 bg-white border border-gray-300 p-6 rounded-md shadow-md">
      {/* Logo arriba */}
      <div className="flex justify-center mb-6">
        <img src="/Logo2.png" alt="Instagram" className="h-12 w-auto" />
      </div>

      <h1 className="text-xl font-bold mb-4 text-center font-sans text-gray-800">
        Crear cuenta
      </h1>
      <p className="text-center text-gray-600 mb-6 font-sans">
        Regístrate para ver fotos y videos de tus amigos.
      </p>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
  <input
    type="text"
    placeholder="Nombre completo"
    value={nombre}
    onChange={(e) => setNombre(e.target.value)}
    className="border border-gray-300 p-2 rounded text-sm font-sans 
               placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
    required
  />

  <input
    type="text"
    placeholder="Nombre de usuario"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="border border-gray-300 p-2 rounded text-sm font-sans 
               placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
    required
  />

  <input
    type="email"
    placeholder="Correo electrónico"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="border border-gray-300 p-2 rounded text-sm font-sans 
               placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
    required
  />

  <input
    type="password"
    placeholder="Contraseña (mínimo 6 caracteres)"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="border border-gray-300 p-2 rounded text-sm font-sans 
               placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
    required
  />

  <button
    type="submit"
    className="bg-[#0095f6] text-white py-2 rounded font-semibold hover:bg-blue-600 transition font-sans"
  >
    Registrarse
  </button>
</form>


      {mensaje && (
        <p className="mt-4 text-center text-sm text-red-500 font-sans">{mensaje}</p>
      )}

      <p className="mt-4 text-center text-sm font-sans">
        <span className="font-semibold text-gray-900">¿Ya tienes cuenta?</span>{" "}
        <button onClick={() => router.push("/login")} className="text-blue-500 font-semibold">
          Inicia sesión
        </button>
      </p>

      {/* Footer estilo Instagram */}
      <div className="mt-6 text-gray-500 text-xs text-center font-sans">Meta © 2026</div>
    </div>
  );
}
