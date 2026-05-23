"use client";

import { useEffect, useState } from "react";
import { supabase } from "./Lib/supabaseClient";
import { useRouter } from "next/navigation";

// 🧩 Tipos
interface Publicacion {
  id: string;
  descripcion: string;
  imagen: string;
  usuario_id: string;
  creado_en: string;
}

interface Comentario {
  id: string;
  comentario: string;
  usuario_id: string;
  publicacion_id: string;
  creado_en: string;
}

export default function MVPForm() {
  const [descripcion, setDescripcion] = useState<string>("");
  const [imagen, setImagen] = useState<string>("");
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchPublicaciones = async () => {
    const { data, error } = await supabase
      .from("publicaciones")
      .select("id, descripcion, imagen, usuario_id, creado_en")
      .order("creado_en", { ascending: false });

    if (!error) setPublicaciones(data || []);
  };

  const fetchComentarios = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      setMensaje("⚠️ No hay usuario logueado");
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("comentarios")
      .select("id, comentario, usuario_id, publicacion_id, creado_en")
      .eq("usuario_id", user.id)
      .order("creado_en", { ascending: false });

    setComentarios(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      setMensaje("⚠️ Debes iniciar sesión para subir publicaciones");
      return;
    }

    const { error } = await supabase.from("publicaciones").insert([
      {
        descripcion,
        imagen,
        usuario_id: user.id,
        creado_en: new Date().toISOString(),
      },
    ]);

    if (error) {
      setMensaje("❌ Error al subir publicación: " + error.message);
    } else {
      setMensaje("✅ Publicación subida correctamente");
      setDescripcion("");
      setImagen("");
      fetchPublicaciones();
    }
  };

  useEffect(() => {
    fetchPublicaciones();
    fetchComentarios();
  }, []);

  if (loading) return <p className="text-center text-white">⏳ Cargando...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 rounded-lg bg-black text-white border border-gray-700">
      <h1 className="text-xl font-bold text-center mb-6">Nueva publicación</h1>

      {/* 📋 FORMULARIO */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          placeholder="Escribe un caption..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:outline-none focus:border-gray-400"
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:outline-none focus:border-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          Publicar
        </button>
      </form>

      {/* Mensaje */}
      {mensaje && <p className="text-center mb-4 text-sm">{mensaje}</p>}

      {/* 🧾 LISTADO DE PUBLICACIONES */}
      <h2 className="text-lg font-semibold mb-3 text-center">Mis publicaciones</h2>
      {publicaciones.length === 0 ? (
        <p className="text-center text-gray-400">No has subido publicaciones aún.</p>
      ) : (
        <div className="space-y-4">
          {publicaciones.map((pub) => (
            <div key={pub.id} className="bg-black border border-gray-700 p-4 rounded">
              <p className="text-white">{pub.descripcion}</p>
              {pub.imagen && (
                <img
                  src={pub.imagen}
                  alt="Imagen publicación"
                  className="rounded mt-2 w-full max-w-md object-cover"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Publicado: {new Date(pub.creado_en).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
