"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoWarning } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error en Pokédex:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <IoWarning size={64} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Algo salió mal!
        </h2>
        <p className="text-gray-500 mb-6">
          {error.message || "Ocurrió un error al cargar los datos de Pokémon."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Reintentar
          </button>
          <Link
            href="/pokemon"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
