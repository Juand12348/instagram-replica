"use client";

import { HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, HeartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";
import MVPForm from "../MVPForm";


export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMVP, setShowMVP] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/login"); // 🚀 Si no hay sesión → login
        return;
      }

      const { data: postsData } = await supabase
        .from("posts")
        .select("id, usuario, contenido, imagen, likes, comentarios");

      if (postsData) setPosts(postsData);
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">⏳ Cargando feed...</p>;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Barra superior estilo Instagram */}
<header className="mt-4 bg-black p-4 flex items-center justify-between">
  {/* Botón izquierda */}
  <PlusCircleIcon className="h-7 w-7 text-white cursor-pointer" />

  {/* Logo centrado */}
  <h1 className="text-2xl font-bold text-white font-[cursive]">Instagram</h1>

  {/* Botón derecha con notificación */}
  <div className="relative">
    <HeartIcon className="h-7 w-7 text-white cursor-pointer" />
    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
  </div>
</header>


      {/* Stories bar */}
      <section className="mt-1 flex gap-4 overflow-x-auto px-4 py-3 bg-black">
        {[
          { usuario: "Tu historia", imagen: "/Fit.jpg", isOwn: true },
          { usuario: "jhoseannybarr...", imagen: "/Perfil1.jpg" },
          { usuario: "camilaquiji_", imagen: "/Perfil2.jpg" },
          { usuario: "neymar", imagen: "/Perfil3.jpg" },
          { usuario: "d.v.d.cracker", imagen: "/Perfil4.jpg" },
          { usuario: "Duki", imagen: "/Perfil5.jpg" },
          { usuario: "Jenny_ifm", imagen: "/Perfil6.jpg" },
        ].map((story, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`w-21 h-21 rounded-full p-[2px] ${
                story.isOwn
                  ? "border-2 border-gray-400"
                  : "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500"
              }`}
            >
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden relative">
                <img
                  src={story.imagen}
                  alt={story.usuario}
                  className="w-full h-full object-cover rounded-full"
                />
                {story.isOwn && (
                  <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    +
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-white mt-1">{story.usuario}</span>
          </div>
        ))}
      </section>

      <section className="max-w-md mx-auto mt-6 space-y-6">
  {/* Post 1 */}
  <article className="bg-black border border-gray-700 rounded-lg">
    <header className="flex items-center p-3">
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="avatar"
        className="h-8 w-8 rounded-full mr-3"
      />
      <span className="text-white font-semibold">futbolcond10</span>
    </header>
    <img
      src="https://i.pinimg.com/736x/1e/fc/41/1efc41cc7fbeafab569a9fd982c0c6ed.jpg"
      alt="post"
      className="w-full object-cover"
    />
    <section className="p-3">
      <p className="text-white">
        PARTIDAZO DE ESTE SEÑOR 🦍 ... El mejor central del mundo
      </p>
      <div className="flex gap-4 mt-2 text-gray-400">
        <span>❤️ 120</span>
        <span>💬 15</span>
      </div>
    </section>
  </article>

  {/* Post 2 */}
  <article className="bg-black border border-gray-700 rounded-lg">
    <header className="flex items-center p-3">
      <img
        src="https://randomuser.me/api/portraits/women/45.jpg"
        alt="avatar"
        className="h-8 w-8 rounded-full mr-3"
      />
      <span className="text-white font-semibold">fashionista</span>
    </header>
    <img
      src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
      alt="post"
      className="w-full object-cover"
    />
    <section className="p-3">
      <p className="text-white">Nuevo outfit ✨ #style #ootd</p>
      <div className="flex gap-4 mt-2 text-gray-400">
        <span>❤️ 340</span>
        <span>💬 42</span>
      </div>
    </section>
  </article>

   <article className="bg-black border border-gray-700 rounded-lg">
    <header className="flex items-center p-3">
      <img
        src="https://i.pinimg.com/736x/c8/5c/32/c85c324066240a77673c40d2d3110ad8.jpg"
        alt="avatar"
        className="h-8 w-8 rounded-full mr-3"
      />
      <span className="text-white font-semibold">juan_martinezn</span>
    </header>
    <img
      src="https://i.pinimg.com/736x/e3/83/46/e38346f2f54a83d250a52314f52bf0d5.jpg"
      alt="post"
      className="w-full object-cover"
    />
    <section className="p-3">
      <p className="text-white">Nuevo outfit ✨ #style #ootd</p>
      <div className="flex gap-4 mt-2 text-gray-400">
        <span>❤️ 340</span>
        <span>💬 42</span>
      </div>
    </section>
  </article>
</section>


      {/* Feed */}
<main className="max-w-md mx-auto mt-6 space-y-6">
  {posts.map((post) => (
    <div key={post.id} className="bg-white border border-gray-300 rounded-md shadow-sm">
      {/* Usuario */}
      <div className="flex items-center p-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <span className="font-semibold text-gray-800">{post.usuario}</span>
      </div>

      {/* Imagen */}
      {post.imagen && (
        <img src={post.imagen} alt="Post" className="w-full max-h-[400px] object-cover" />
      )}

      {/* Contenido */}
      <div className="p-3">
        <p className="text-sm text-gray-800">{post.contenido}</p>
        <div className="flex gap-4 mt-2 text-sm text-gray-600">
          <span>❤️ {post.likes} Me gusta</span>
          <span>💬 {post.comentarios} Comentarios</span>
        </div>
      </div>
    </div>
  ))}
</main>


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



      {showMVP && (
  <div className="fixed inset-0 bg-black bg-opacity-8 flex items-center justify-center z-50">
    <div className="bg-black rounded-lg p-6 max-w-lg w-full text-white">
      <button
        onClick={() => setShowMVP(false)}
        className="absolute top-2 right-2 text-white"
      >
        ✖
      </button>
      <MVPForm /> {/* 👈 Aquí se renderiza tu lógica completa */}
    </div>
  </div>
)}

    </div>
  );
}
