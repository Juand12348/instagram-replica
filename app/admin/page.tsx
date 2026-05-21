"use client";

import { useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Usuario {
  id: string;
  nombre: string;
  username: string;
  correo: string;
}

interface Publicacion {
  id: string;
  descripcion: string | null;
  imagen: string;
  creado_en: string;

  usuario: {
    nombre: string;
    username: string;
  }[];
}

export default function AdminPage() {

  const router = useRouter();

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

  const [publicaciones, setPublicaciones] =
    useState<Publicacion[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  // Verificar admin
  useEffect(() => {

    const verificarAdmin =
      async () => {

        const {
          data,
        } =
          await supabase
            .auth
            .getUser();

        const user =
          data.user;

        if (!user) {
          router.push("/login");
          return;
        }

        if (
          user.email !==
          "daniel.diazd@uniagustiniana.edu.co"
        ) {
          router.push("/feed");
          return;
        }

        await Promise.all([
          fetchUsuarios(),
          fetchPublicaciones(),
        ]);

        setLoading(false);

      };

    verificarAdmin();

  }, []);

  // Obtener usuarios
  const fetchUsuarios =
    async () => {

      const {
        data,
        error,
      } =
        await supabase
          .from("usuarios")
          .select(`
            id,
            nombre,
            username,
            correo
          `)
          .order(
            "nombre"
          );

      if (error) {
        setMessage(
          "❌ " +
          error.message
        );
        return;
      }

      setUsuarios(
        data || []
      );
    };

  // Obtener publicaciones
  const fetchPublicaciones =
    async () => {

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "publicaciones"
          )
          .select(`
            id,
            descripcion,
            imagen,
            creado_en,

            usuario:usuarios(
              nombre,
              username
            )
          `)
          .order(
            "creado_en",
            {
              ascending:
                false,
            }
          );

      if (error) {

        setMessage(
          "❌ " +
          error.message
        );

        return;
      }

      setPublicaciones(
        (data ||
          []) as Publicacion[]
      );
    };

  // Eliminar publicación
  const eliminarPublicacion =
    async (
      id: string
    ) => {

      const {
        error,
      } =
        await supabase
          .from(
            "publicaciones"
          )
          .delete()
          .eq(
            "id",
            id
          );

      if (error) {

        setMessage(
          "❌ " +
          error.message
        );

        return;
      }

      setMessage(
        "✅ Publicación eliminada"
      );

      fetchPublicaciones();
    };

  if (loading) {
    return (
      <p className="text-center mt-10">
        Cargando...
      </p>
    );
  }

  return (

    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Panel Admin
      </h1>

      {message && (
        <p className="mb-4 text-green-600">
          {message}
        </p>
      )}

      {/* Usuarios */}

      <section>

        <h2 className="text-xl mb-4">
          Usuarios
        </h2>

        <table className="w-full border">

          <thead>

            <tr>

              <th className="border p-2">
                Nombre
              </th>

              <th className="border p-2">
                Username
              </th>

              <th className="border p-2">
                Correo
              </th>

            </tr>

          </thead>

          <tbody>

            {usuarios.map(
              (
                usuario
              ) => (

                <tr
                  key={
                    usuario.id
                  }
                >

                  <td className="border p-2">
                    {
                      usuario.nombre
                    }
                  </td>

                  <td className="border p-2">
                    @
                    {
                      usuario.username
                    }
                  </td>

                  <td className="border p-2">
                    {
                      usuario.correo
                    }
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </section>

      {/* Publicaciones */}

      <section className="mt-10">

        <h2 className="text-xl mb-4">
          Publicaciones
        </h2>

        <div className="grid gap-6">

          {publicaciones.map(
            (
              p
            ) => (

              <div
                key={
                  p.id
                }
                className="border p-4 rounded"
              >

                <p className="font-bold">

                  {
                    p.usuario?.[0]
                      ?.nombre
                  }

                  {" "}

                  @

                  {
                    p.usuario?.[0]
                      ?.username
                  }

                </p>

                <img
                  src={
                    p.imagen
                  }
                  alt=""
                  className="
                    w-60
                    rounded
                    mt-2
                  "
                />

                <p className="mt-2">
                  {
                    p.descripcion
                  }
                </p>

                <button
                  onClick={() =>
                    eliminarPublicacion(
                      p.id
                    )
                  }
                  className="
                    mt-3
                    bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded
                  "
                >
                  Eliminar
                </button>

              </div>

            )
          )}

        </div>

      </section>

    </div>
  );
}