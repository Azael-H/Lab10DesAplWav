"use client";
// CSR: Búsqueda en tiempo real usando hooks de React (useState, useEffect)

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Character, CharacterListResponse } from "@/types/rickandmorty";
import { IoSearch, IoClose } from "react-icons/io5";
import { GiSpaceship } from "react-icons/gi";

const statusOptions = ["", "alive", "dead", "unknown"] as const;
const genderOptions = ["", "female", "male", "genderless", "unknown"] as const;

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

export default function SearchPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // Busca cada vez que cambia cualquier filtro
  useEffect(() => {
    const controller = new AbortController();

    async function search() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (status) params.append("status", status);
      if (type) params.append("type", type);
      if (gender) params.append("gender", gender);

      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character?${params.toString()}`,
          { signal: controller.signal }
        );

        if (res.status === 404) {
          setCharacters([]);
          setTotalCount(0);
          setError("No se encontraron personajes con esos filtros.");
        } else if (!res.ok) {
          throw new Error("Error al buscar personajes");
        } else {
          const data: CharacterListResponse = await res.json();
          setCharacters(data.results);
          setTotalCount(data.info.count);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Error al conectar con la API.");
        }
      } finally {
        setLoading(false);
      }
    }

    // Debounce de 400ms para el campo de texto
    const timer = setTimeout(search, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [name, status, type, gender]);

  function clearFilters() {
    setName("");
    setStatus("");
    setType("");
    setGender("");
  }

  const hasFilters = name || status || type || gender;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <GiSpaceship size={40} className="text-green-400" />
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Búsqueda de Personajes (CSR)
          </h1>
        </div>

        {/* Filtros */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nombre */}
            <div className="relative">
              <IoSearch
                size={16}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg pl-9 pr-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            >
              <option value="">Estado (todos)</option>
              {statusOptions.slice(1).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            {/* Type */}
            <input
              type="text"
              placeholder="Tipo (ej: Parasite)..."
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            />

            {/* Gender */}
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            >
              <option value="">Género (todos)</option>
              {genderOptions.slice(1).map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-400 text-sm">
                {totalCount > 0
                  ? `${totalCount} resultado(s) encontrado(s)`
                  : ""}
              </span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition"
              >
                <IoClose size={16} />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Resultados */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
            <p className="text-green-400 mt-4">Buscando personajes...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">{error}</p>
          </div>
        )}

        {!loading && !error && characters.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {characters.map((character) => (
              <Link
                key={character.id}
                href={`/rickandmorty/${character.id}`}
                className="transform transition hover:scale-105"
              >
                <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-green-500 hover:shadow-lg hover:shadow-green-900 cursor-pointer">
                  <div className="relative">
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                    <span
                      className={`absolute top-2 right-2 ${statusColors[character.status] ?? "bg-gray-400"} text-white text-xs font-bold px-2 py-1 rounded-full`}
                    >
                      {character.status}
                    </span>
                  </div>
                  <div className="p-3">
                    <h2 className="text-white font-bold text-sm truncate">
                      {character.name}
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">
                      {character.species}
                    </p>
                    <p className="text-gray-500 text-xs">#{character.id}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && characters.length === 0 && !hasFilters && (
          <div className="text-center py-20 text-gray-500">
            <IoSearch size={60} className="mx-auto mb-4 opacity-40" />
            <p className="text-xl">
              Escribe un nombre o selecciona un filtro para buscar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
