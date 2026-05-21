"use client";

import { useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Verificar sesión
  useEffect(() => {

    const checkUser = async () => {

      const { data } =
        await supabase.auth.getUser();

      if (data.user) {
        router.push("/feed");
      } else {
        setLoading(false);
      }
    };

    checkUser();

  }, [router]);

  if (loading) {
    return (
      <p className="text-center mt-10">
        Verificando sesión...
      </p>
    );
  }

  // Registro
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setMensaje(null);

    // 1. Crear usuario en Supabase Auth
    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      setMensaje("❌ " + error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setMensaje("❌ No se pudo crear el usuario");
      return;
    }

    // 2. Guardar perfil en tabla usuarios
    const { error: insertError } =
      await supabase
        .from("usuarios")
        .insert([
          {
            id: user.id,
            nombre,
            username,
            correo: email,
          },
        ]);

    if (insertError) {
      setMensaje(
        "❌ Error guardando perfil: " +
          insertError.message
      );
      return;
    }

    setMensaje(
      "✅ Cuenta creada correctamente"
    );

    // 3. Redirigir
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (

    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow">

      <h1 className="text-2xl font-bold mb-6 text-center">
        Crear cuenta
      </h1>

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4"
      >

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Registrarse
        </button>

      </form>

      {mensaje && (
        <p className="mt-4 text-center">
          {mensaje}
        </p>
      )}

      {/* Login */}
      <p className="mt-4 text-center">

        ¿Ya tienes cuenta?{" "}

        <button
          onClick={() =>
            router.push("/login")
          }
          className="text-blue-600 underline"
        >
          Inicia sesión
        </button>

      </p>

    </div>
  );
}