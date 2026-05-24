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

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Verificar admin
  useEffect(() => {
    const verificarAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push("/login");
        return;
      }

      // 🔹 Lista de correos permitidos
      const allowedAdmins = [
        "daniel.diazd@uniagustiniana.edu.co",
        // agrega más correos aquí si quieres
      ];

      // ✅ Corrección: validamos que email exista y sea string
      if (!user.email || !allowedAdmins.includes(user.email)) {
        router.push("/home");
        return;
      }

      await Promise.all([fetchUsuarios(), fetchPublicaciones()]);
      setLoading(false);
    };

    verificarAdmin();
  }, []);

  // Obtener usuarios
  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, username, correo")
      .order("nombre");

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    setUsuarios(data || []);
  };

  // Obtener publicaciones
  const fetchPublicaciones = async () => {
    const { data, error } = await supabase
      .from("publicaciones")
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
      .order("creado_en", { ascending: false });

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    setPublicaciones((data || []) as Publicacion[]);
  };

  // Eliminar publicación
  const eliminarPublicacion = async (id: string) => {
    const { error } = await supabase
      .from("publicaciones")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    setMessage("✅ Publicación eliminada");
    fetchPublicaciones();
  };

  if (loading) {
    return <p className="text-center mt-10">⏳ Cargando...</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header estilo Instagram */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Panel Administrativo</h1>
        <button
          onClick={() => router.push("/home")}
          className="bg-gray-800 px-3 py-1 rounded"
        >
          Volver
        </button>
      </header>

      <main className="p-6 space-y-10">
        {message && <p className="mb-4 text-green-500">{message}</p>}

        {/* Usuarios */}
        <section>
          <h2 className="text-lg font-semibold mb-4">👥 Usuarios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usuarios.map((u) => (
              <div key={u.id} className="bg-gray-900 p-4 rounded-lg">
                <p className="font-bold">{u.nombre}</p>
                <p className="text-gray-400">@{u.username}</p>
                <p className="text-sm text-gray-500">{u.correo}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Publicaciones */}
        <section>
          <h2 className="text-lg font-semibold mb-4">🖼 Publicaciones</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicaciones.map((p) => (
              <div key={p.id} className="bg-gray-900 p-4 rounded-lg">
                <p className="font-bold">
                  {p.usuario?.[0]?.nombre} @{p.usuario?.[0]?.username}
                </p>
                <img
                  src={p.imagen}
                  alt="post"
                  className="w-full h-48 object-cover rounded mt-2"
                />
                <p className="mt-2 text-sm">{p.descripcion}</p>
                <button
                  onClick={() => eliminarPublicacion(p.id)}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
