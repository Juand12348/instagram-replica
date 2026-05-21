"use client";

import { useEffect, useState } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Estudiante {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
}

interface Curso {
  id: string;
  nombre: string;
}

interface Actividad {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  nota: number | null;
  imagen: string | null;
  creado_en: string;
  estudiante: Estudiante[]; 
  curso: Curso[];   
}

export default function AdminPage() {
  const router = useRouter();

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      await Promise.all([
        fetchActividades(),
        fetchEstudiantes(),
      ]);

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const fetchActividades = async () => {
    const { data, error } = await supabase
      .from("actividades")
      .select(`
        id,
        titulo,
        descripcion,
        tipo,
        nota,
        imagen,
        creado_en,
        estudiante:estudiantes!estudiante_id(
          id,
          nombre,
          correo,
          telefono
        ),
        curso:cursos!curso_id(
          id,
          nombre
        )
      `)
      .order("creado_en", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("❌ Error cargando actividades");
      return;
    }

    setActividades(data as Actividad[]);
  };

  const fetchEstudiantes = async () => {
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .order("nombre");

    if (error) {
      console.error(error);
      setMessage("❌ Error cargando estudiantes");
      return;
    }

    setEstudiantes(data);
  };

  const actualizarNota = async (
    id: string,
    nota: number
  ) => {
    const { error } = await supabase
      .from("actividades")
      .update({ nota })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("✅ Nota actualizada");
    fetchActividades();
  };

  const actualizarEstudiante = async (
    id: string,
    nombre: string,
    telefono: string | null
  ) => {
    const { error } = await supabase
      .from("estudiantes")
      .update({
        nombre,
        telefono,
      })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("✅ Estudiante actualizado");

    await Promise.all([
      fetchEstudiantes(),
      fetchActividades(),
    ]);
  };

  const actualizarNotaLocal = (
    id: string,
    nota: number
  ) => {
    setActividades((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, nota }
          : a
      )
    );
  };

  const actualizarEstudianteLocal = (
    id: string,
    campo: "nombre" | "telefono",
    valor: string
  ) => {
    setEstudiantes((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              [campo]: valor,
            }
          : e
      )
    );
  };

  if (loading) {
    return (
      <p className="text-center mt-10">
        Cargando...
      </p>
    );
  }

        useEffect(() => {
        const verificarAdmin = async () => {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
        // ❌ No hay usuario logueado → redirige a login
        router.push("/login");
        } else if (data.user.email !== "daniel.diazd@uniagustiniana.edu.co") {
        // ❌ Usuario logueado, pero no es el autorizado → cambiar por su usuario
        router.push("/login");
        } else {
        // ✅ Usuario autorizado, cargamos datos
        fetchActividades();
        fetchEstudiantes();
        }
        };
        verificarAdmin();
        }, [router]);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Panel Administrativo
      </h1>

      {message && (
        <p className="mb-4 text-green-600">
          {message}
        </p>
      )}

      <section className="mb-10">
        <h2 className="text-xl mb-4">
          Actividades
        </h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Curso</th>
              <th>Actividad</th>
              <th>Tipo</th>
              <th>Nota</th>
              <th>Imagen</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {actividades.map((act) => (
              <tr key={act.id}>
                <td>{act.estudiante?.[0]?.nombre}</td>

                <td>{act.curso?.[0]?.nombre}</td>

                <td>{act.titulo}</td>

                <td>{act.tipo}</td>

                <td>
                  <input
                    type="number"
                    value={act.nota ?? ""}
                    min={0}
                    max={5}
                    step={0.1}
                    onChange={(e) =>
                      actualizarNotaLocal(
                        act.id,
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td>
                  {act.imagen && (
                    <img
                      src={act.imagen}
                      alt="actividad"
                      className="w-20"
                    />
                  )}
                </td>

                <td>
                  <button
                    onClick={() =>
                      actualizarNota(
                        act.id,
                        act.nota ?? 0
                      )
                    }
                    className="bg-blue-600 text-white px-3 py-1"
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl mb-4">
          Estudiantes
        </h2>

        <table className="w-full border">

          <tbody>
            {estudiantes.map((est) => (
              <tr key={est.id}>

                <td>
                  <input
                    value={est.nombre}
                    onChange={(e) =>
                      actualizarEstudianteLocal(
                        est.id,
                        "nombre",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  {est.correo}
                </td>

                <td>
                  <input
                    value={
                      est.telefono ?? ""
                    }
                    onChange={(e) =>
                      actualizarEstudianteLocal(
                        est.id,
                        "telefono",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <button
                    onClick={() =>
                      actualizarEstudiante(
                        est.id,
                        est.nombre,
                        est.telefono
                      )
                    }
                    className="bg-green-600 text-white px-3 py-1"
                  >
                    Guardar
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </section>

    </div>
  );
}