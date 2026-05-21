"use client";
// 👆 Este archivo se ejecuta en el cliente (navegador)

import { useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient"; 
import { useRouter } from "next/navigation";

// 🧩 Tipos
interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen: string;
  curso_id: string;
}

interface Curso {
  id: string;
  nombre: string;
}

export default function MVPPage() {
  // -------------------------------
  // 🧠 ESTADOS
  // -------------------------------
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [imagen, setImagen] = useState<string>("");
  const [tipo, setTipo] = useState<string>("tarea");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string>("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // -----------------------------------------
  // 🚀 FUNCIÓN 1: Cargar cursos
  // -----------------------------------------
  const fetchCursos = async () => {
    const { data, error } = await supabase
      .from("cursos")
      .select("id, nombre")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("❌ Error al cargar cursos:", error.message);
    } else {
      setCursos(data || []);
    }
  };

  // -------------------------------------------------
  // 🚀 FUNCIÓN 2: Cargar actividades del estudiante actual
  // -------------------------------------------------
  const fetchActividades = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("❌ Error al obtener usuario:", userError.message);
      setMensaje("⚠️ Error al obtener usuario");
      setLoading(false);
      return;
    }

    const user = userData?.user;
    if (!user) {
      setMensaje("⚠️ No hay usuario logueado");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("actividades")
      .select("id, titulo, descripcion, tipo, imagen, curso_id")
      .eq("estudiante_id", user.id)
      .order("id", { ascending: false });

    if (error) {
      console.error("❌ Error al cargar actividades:", error.message);
    } else {
      setActividades(data || []);
    }
    setLoading(false);
  };

  // -------------------------------------------------
  // 🚀 FUNCIÓN 3: Subir nueva actividad
  // -------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      setMensaje("⚠️ Error al obtener usuario");
      return;
    }

    const user = userData?.user;
    if (!user) {
      setMensaje("⚠️ Debes iniciar sesión para subir actividades");
      return;
    }

    const { error } = await supabase.from("actividades").insert([
      {
        titulo,
        descripcion,
        tipo,
        imagen,
        curso_id: cursoSeleccionado,
        estudiante_id: user.id,
      },
    ]);

    if (error) {
      setMensaje("❌ Error al subir actividad: " + error.message);
    } else {
      setMensaje("✅ Actividad subida correctamente");
      setTitulo("");
      setDescripcion("");
      setImagen("");
      setCursoSeleccionado("");
      fetchActividades(); // 🔄 Actualizamos la lista
    }
  };

  // -------------------------------------------------
  // 🌀 useEffect
  // -------------------------------------------------
  useEffect(() => {
    fetchCursos();
    fetchActividades();
  }, []);

      useEffect(() => {
        const checkUser = async () => {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
        // ❌ No hay usuario logueado → redirige a login
        router.push("/login");
        } else {
        // ✅ Usuario logueado, seguimos con la página
        setLoading(false);
        }
        };
        checkUser();
    }, [router]);

  if (loading) return <p className="text-center">⏳ Cargando...</p>;

  // -------------------------------------------------
  // 🎨 INTERFAZ VISUAL
  // -------------------------------------------------
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-6">
        Subir Actividad (MVP)
      </h1>

      {/* 📋 FORMULARIO */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="tarea">Tarea</option>
          <option value="examen">Examen</option>
          <option value="proyecto">Proyecto</option>
          <option value="participacion">Participación</option>
          <option value="otro">Otro</option>
        </select>

        {/* Selección del curso */}
        <select
          value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
          required
          className="border p-2 rounded"
        >
          <option value="">Selecciona un curso</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.nombre}
            </option>
          ))}
        </select>

        {/* Campo de URL de imagen */}
        <input
          type="text"
          placeholder="URL de imagen"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Subir Actividad
        </button>
      </form>

      {/* Mensaje */}
      {mensaje && <p className="text-center mb-4">{mensaje}</p>}

      {/* 🧾 LISTADO */}
      <h2 className="text-xl font-semibold mb-3 text-center">
        Mis Actividades
      </h2>
      {actividades.length === 0 ? (
        <p className="text-center text-gray-600">
          No has subido actividades aún.
        </p>
      ) : (
        <div className="space-y-4">
          {actividades.map((act) => (
            <div key={act.id} className="border p-4 rounded shadow-sm">
              <h3 className="font-semibold">{act.titulo}</h3>
              <p className="text-gray-700">{act.descripcion}</p>
              <p className="text-sm text-gray-500 mt-1">
                Tipo: {act.tipo.toUpperCase()}
              </p>
              {act.imagen && (
                <img
                  src={act.imagen}
                  alt={act.titulo}
                  className="rounded mt-2 w-full max-w-md object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
