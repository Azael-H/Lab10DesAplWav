import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { GiSpaceship } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Rick & Morty - Next.js",
  description: "Explora los personajes del universo Rick & Morty",
};

export default function RickAndMortyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
      <nav className="bg-black bg-opacity-40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/rickandmorty"
            className="text-green-400 text-2xl font-bold hover:text-green-300 transition flex items-center gap-2"
          >
            <GiSpaceship size={30} />
            Rick &amp; Morty
          </Link>
          <Link
            href="/rickandmorty/search"
            className="flex items-center gap-2 text-white bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition font-semibold"
          >
            <IoSearch size={18} />
            Buscar personajes
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
