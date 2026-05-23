"use client";

import { useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  HeartIcon,
  UserCircleIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

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

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [biografia, setBiografia] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMVP, setShowMVP] = useState(false);

  const fetchUsuario = async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      router.push("/login");
      return;
    }
    const user = authData.user;
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, username, correo, foto_perfil, biografia")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setMensaje("❌ Error cargando perfil: " + error.message);
      setLoading(false);
      return;
    }
    if (!data) {
      setMensaje("");
      setLoading(false);
      return;
    }

    setUsuario(data);
    setNombre(data.nombre || "");
    setUsername(data.username || "");
    setBiografia(data.biografia || "");
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const { error } = await supabase
      .from("usuarios")
      .update({ nombre, username, biografia })
      .eq("id", usuario.id);

    if (error) {
      setMensaje("❌ " + error.message);
      return;
    }

    setMensaje("✅ Perfil actualizado");
    fetchUsuario();
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <p className="text-center text-white">⏳ Cargando...</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
  {/* Header estilo Instagram */}
  <header className="flex items-center justify-between p-4 border-b border-gray-800">
    {/* Izquierda */}
    <PlusCircleIcon className="h-7 w-7 text-white cursor-pointer" />

    {/* Centro */}
    <h1 className="text-xl font-bold">{usuario?.username}</h1>

    {/* Derecha */}
    <div className="flex items-center gap-4">
      <div className="relative">
        <BellIcon className="h-6 w-6 text-white cursor-pointer" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
          9+
        </span>
      </div>
      <Bars3Icon className="h-6 w-6 text-white cursor-pointer" />
    </div>
  </header>

  {/* Perfil */}
  {usuario && (
    <section className="p-4">
      {/* Avatar + Stats */}
      <div className="flex items-center gap-6">
        <img
          src={
            usuario.foto_perfil ||
            "https://i.pinimg.com/736x/e3/83/46/e38346f2f54a83d250a52314f52bf0d5.jpg"
          }
          alt="avatar"
          className="h-24 w-24 rounded-full border-2 border-gray-700"
        />
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-bold">0</p>
            <p className="text-gray-400 text-sm">Publicaciones</p>
          </div>
          <div>
            <p className="font-bold">579</p>
            <p className="text-gray-400 text-sm">Seguidores</p>
          </div>
          <div>
            <p className="font-bold">183</p>
            <p className="text-gray-400 text-sm">Seguidos</p>
          </div>
        </div>
      </div>

      {/* Nombre + Bio */}
      <div className="mt-3">
        <p className="font-semibold">{usuario.nombre}</p>
        <p className="text-sm mt-1">{usuario.biografia}</p>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 bg-gray-800 text-white py-1 rounded">
          Editar perfil
        </button>
        <button className="flex-1 bg-gray-800 text-white py-1 rounded">
          Compartir perfil
        </button>
        <button className="flex-1 bg-gray-800 text-white py-1 rounded">
          Agregar
        </button>
      </div>

      {/* Highlights simulados */}
      <section className="flex gap-4 mt-6">
        {["Nuevo", "Are you Ready", "MDB"].map((label, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-2 border-gray-700 flex items-center justify-center">
              <span className="text-xs">{label[0]}</span>
            </div>
            <p className="text-xs mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* Grid de publicaciones dummy */}
      <section className="grid grid-cols-3 gap-1 mt-6">
        <img src="/Perfil1.jpg" alt="post" className="w-full h-32 object-cover" />
        <img src="/Perfil2.jpg" alt="post" className="w-full h-32 object-cover" />
        <img src="/Perfil3.jpg" alt="post" className="w-full h-32 object-cover" />
      </section>
    </section>
  )}

  {/* Formulario de edición */}
  {usuario && (
    <form onSubmit={handleUpdate} className="flex flex-col gap-4 px-4 mt-6">
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        className="bg-black border border-gray-700 p-2 rounded text-white"
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="bg-black border border-gray-700 p-2 rounded text-white"
      />
      <textarea
        value={biografia}
        onChange={(e) => setBiografia(e.target.value)}
        placeholder="Biografía"
        className="bg-black border border-gray-700 p-2 rounded text-white"
      />
      <input
        type="email"
        value={usuario.correo}
        readOnly
        className="bg-gray-800 border border-gray-700 p-2 rounded text-gray-400"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Guardar
      </button>
    </form>
  )}

  {mensaje && <p className="mt-4 text-center">{mensaje}</p>}

  {/* Footer navegación */}
  <footer className="fixed bottom-0 w-full bg-black border-t border-gray-800 p-4 flex justify-around">
    <button onClick={() => router.push("/home")} className="text-white">
      <HomeIcon className="h-9 w-9" />
    </button>
    <button className="text-white">
      <MagnifyingGlassIcon className="h-9 w-9" />
    </button>
    <button onClick={() => setShowMVP(true)} className="text-white">
      <PlusCircleIcon className="h-9 w-9" />
    </button>
    <button className="text-white">
      <HeartIcon className="h-9 w-9" />
    </button>
    <button onClick={() => router.push("/profile")}>
      <UserCircleIcon className="h-9 w-9" />
    </button>
  </footer>
</div>
  );
}
