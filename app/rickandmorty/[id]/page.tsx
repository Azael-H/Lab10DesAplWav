// ISR: revalida cada 10 días. SSG: generateStaticParams genera todas las rutas en build time.
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Character, CharacterListResponse } from "@/types/rickandmorty";
import { GiSpaceship } from "react-icons/gi";
import {
  IoHeart,
  IoSkull,
  IoHelpCircle,
  IoPlanet,
  IoLocation,
  IoFilm,
  IoCalendar,
  IoPerson,
  IoMale,
  IoFemale,
  IoTransgender,
  IoSearch,
} from "react-icons/io5";

export const revalidate = 864000; // ISR: revalida cada 10 días

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate: 864000 },
  });
  if (!res.ok) notFound();
  return res.json();
}

export async function generateStaticParams() {
  // SSG: genera rutas estáticas para todos los personajes (fetch secuencial)
  try {
    const firstRes = await fetch("https://rickandmortyapi.com/api/character");
    if (!firstRes.ok) return [];
    const firstData: CharacterListResponse = await firstRes.json();
    const totalPages = firstData.info.pages;

    let allCharacters = [...firstData.results];

    // Fetch secuencial para no saturar la API durante el build
    for (let page = 2; page <= totalPages; page++) {
      const res = await fetch(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );
      if (!res.ok) break;
      const data: CharacterListResponse = await res.json();
      allCharacters = [...allCharacters, ...data.results];
    }

    return allCharacters.map((c) => ({ id: String(c.id) }));
  } catch {
    // Si falla, Next.js generará las páginas on-demand con ISR
    return [];
  }
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  return {
    title: `${character.name} - Rick & Morty`,
    description: `${character.species} · ${character.status} · ${character.gender}`,
  };
}

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  Alive: {
    label: "Vivo",
    icon: <IoHeart />,
    color: "text-green-400",
    bg: "bg-green-900",
  },
  Dead: {
    label: "Muerto",
    icon: <IoSkull />,
    color: "text-red-400",
    bg: "bg-red-900",
  },
  unknown: {
    label: "Desconocido",
    icon: <IoHelpCircle />,
    color: "text-gray-400",
    bg: "bg-gray-700",
  },
};

const genderIcons: Record<string, React.ReactNode> = {
  Male: <IoMale className="inline" />,
  Female: <IoFemale className="inline" />,
  Genderless: <IoTransgender className="inline" />,
  unknown: <IoHelpCircle className="inline" />,
};

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  const statusInfo = statusConfig[character.status] ?? statusConfig["unknown"];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-green-900 to-teal-900 p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative">
                <Image
                  src={character.image}
                  alt={character.name}
                  width={200}
                  height={200}
                  className="rounded-2xl border-4 border-green-500 shadow-lg shadow-green-900"
                />
                <span
                  className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${statusInfo.bg} ${statusInfo.color} flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full border border-current`}
                >
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {character.name}
                </h1>
                <p className="text-green-400 text-xl font-semibold">
                  {character.species}
                  {character.type ? ` - ${character.type}` : ""}
                </p>
                <p className="text-gray-400 mt-1 flex items-center gap-1 justify-center md:justify-start">
                  {genderIcons[character.gender]} {character.gender}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Personaje #{character.id}
                </p>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
                <IoPlanet /> Origen
              </h3>
              <p className="text-white font-semibold">{character.origin.name}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
                <IoLocation /> Última ubicación
              </h3>
              <p className="text-white font-semibold">
                {character.location.name}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
                <IoPerson /> Datos personales
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong className="text-white">Especie:</strong>{" "}
                  {character.species}
                </p>
                <p>
                  <strong className="text-white">Tipo:</strong>{" "}
                  {character.type || "N/A"}
                </p>
                <p>
                  <strong className="text-white">Género:</strong>{" "}
                  {character.gender}
                </p>
                <p>
                  <strong className="text-white">Estado:</strong>{" "}
                  {character.status}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
                <IoCalendar /> Creación en la API
              </h3>
              <p className="text-white">
                {new Date(character.created).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 md:col-span-2">
              <h3 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
                <IoFilm /> Apariciones
              </h3>
              <p className="text-gray-400 mb-3">
                Aparece en{" "}
                <strong className="text-white">
                  {character.episode.length}
                </strong>{" "}
                episodios
              </p>
              <div className="flex flex-wrap gap-2">
                {character.episode.map((ep) => {
                  const epNum = ep.split("/").pop();
                  return (
                    <span
                      key={ep}
                      className="bg-gray-700 text-green-400 text-xs font-bold px-2 py-1 rounded-lg border border-gray-600"
                    >
                      EP {epNum}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex gap-4">
            <Link
              href="/rickandmorty"
              className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              <GiSpaceship /> Volver a la lista
            </Link>
            <Link
              href="/rickandmorty/search"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              <IoSearch /> Buscar otro personaje
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
