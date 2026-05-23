// SSG + ISR: se genera en build time y se revalida cada 10 días.
// El caché es manejado por Next.js a nivel de segmento con `revalidate`.
import Link from "next/link";
import Image from "next/image";
import { CharacterListResponse, SimpleCharacter } from "@/types/rickandmorty";
import { IoSearch, IoWarning } from "react-icons/io5";
import { GiSpaceship } from "react-icons/gi";

// ISR: Next.js cachea la página y la revalida cada 10 días
export const revalidate = 864000;

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

async function getCharacters(): Promise<SimpleCharacter[]> {
  try {
    const res = await fetch("https://rickandmortyapi.com/api/character?page=1");
    if (!res.ok) return [];
    const data: CharacterListResponse = await res.json();
    return data.results.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      status: c.status,
      species: c.species,
    }));
  } catch {
    return [];
  }
}

export default async function RickAndMortyPage() {
  const characters = await getCharacters();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
            <GiSpaceship size={44} />
            Personajes (SSG)
            {characters.length > 0 && (
              <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full ml-2">
                {characters.length} personajes
              </span>
            )}
          </h1>
          <Link
            href="/rickandmorty/search"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-3 rounded-xl transition"
          >
            <IoSearch size={20} />
            Buscar todos
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-20">
            <IoWarning size={60} className="mx-auto text-yellow-500 mb-4" />
            <p className="text-gray-400 text-xl">
              No se pudieron cargar los personajes. Intenta más tarde.
            </p>
            <Link
              href="/rickandmorty/search"
              className="inline-block mt-6 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              Ir a la búsqueda
            </Link>
          </div>
        ) : (
          <>
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
                        priority={false}
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
            <p className="text-gray-500 text-center mt-10 text-sm">
              Usa{" "}
              <Link
                href="/rickandmorty/search"
                className="text-green-400 underline"
              >
                Buscar personajes
              </Link>{" "}
              para explorar los más de 800 personajes del universo Rick &amp; Morty.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
