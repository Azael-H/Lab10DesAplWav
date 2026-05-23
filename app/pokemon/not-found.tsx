import Link from "next/link";
import { IoSearch } from "react-icons/io5";

export default function PokemonNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <IoSearch size={64} className="mx-auto text-purple-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Pokémon no encontrado
        </h2>
        <p className="text-gray-500 mb-2 text-6xl font-black text-purple-200">
          404
        </p>
        <p className="text-gray-500 mb-6">
          El Pokémon que buscas no existe en nuestra base de datos.
        </p>
        <Link
          href="/pokemon"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          ← Volver al Pokédex
        </Link>
      </div>
    </div>
  );
}
