export interface RickAndMortyInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RickAndMortyLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: RickAndMortyLocation;
  location: RickAndMortyLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterListResponse {
  info: RickAndMortyInfo;
  results: Character[];
}

export interface SimpleCharacter {
  id: number;
  name: string;
  image: string;
  status: Character["status"];
  species: string;
}
