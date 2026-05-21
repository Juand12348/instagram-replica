"use client";

import { useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Usuario {
  id: string;
  nombre: string;
  username: string;
  correo: string;
  foto_perfil: string | null;
  biografia: string | null;
}

export default function UsuarioPage() {

  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [nombre, setNombre] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [biografia, setBiografia] =
    useState("");

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  // Cargar perfil
  const fetchUsuario = async () => {

    const {
      data: authData,
    } = await supabase.auth.getUser();

    const user = authData.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from("usuarios")
      .select(`
        id,
        nombre,
        username,
        correo,
        foto_perfil,
        biografia
      `)
      .eq("id", user.id)
      .single();

    if (error) {
      setMensaje(
        "❌ Error cargando perfil"
      );
      setLoading(false);
      return;
    }

    setUsuario(data);

    setNombre(data.nombre);

    setUsername(
      data.username
    );

    setBiografia(
      data.biografia || ""
    );

    setLoading(false);
  };

  // Actualizar perfil
  const handleUpdate = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!usuario) return;

    const { error } =
      await supabase
        .from("usuarios")
        .update({
          nombre,
          username,
          biografia,
        })
        .eq(
          "id",
          usuario.id
        );

    if (error) {
      setMensaje(
        "❌ " +
        error.message
      );
      return;
    }

    setMensaje(
      "✅ Perfil actualizado"
    );

    fetchUsuario();
  };

  // Verificar sesión
  useEffect(() => {
    fetchUsuario();
  }, []);

  // Cerrar sesión
  const handleLogout =
    async () => {

      await supabase.auth
        .signOut();

      router.push(
        "/login"
      );
    };

  if (loading) {
    return (
      <p className="text-center">
        Cargando...
      </p>
    );
  }

  return (

    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">

      <h1 className="text-2xl font-bold text-center mb-6">
        Mi Perfil
      </h1>

      {usuario && (

        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            value={nombre}
            onChange={(e) =>
              setNombre(
                e.target.value
              )
            }
            placeholder="Nombre"
            className="border p-2 rounded"
          />

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            placeholder="Username"
            className="border p-2 rounded"
          />

          <textarea
            value={biografia}
            onChange={(e) =>
              setBiografia(
                e.target.value
              )
            }
            placeholder="Biografía"
            className="border p-2 rounded"
          />

          <input
            type="email"
            value={
              usuario.correo
            }
            readOnly
            className="
              border
              p-2
              rounded
              bg-gray-100
            "
          />

          <button
            type="submit"
            className="
              bg-blue-600
              text-white
              p-2
              rounded
            "
          >
            Guardar
          </button>

        </form>

      )}

      <button
        onClick={handleLogout}
        className="
          mt-4
          w-full
          bg-gray-500
          text-white
          p-2
          rounded
        "
      >
        Cerrar sesión
      </button>

      {mensaje && (
        <p className="mt-4 text-center">
          {mensaje}
        </p>
      )}

    </div>
  );
}