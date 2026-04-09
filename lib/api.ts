import type { PokemonDetail, PokemonListResponse } from "@/types/pokemon";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Lightweight in-memory cache to avoid repeat fetches during navigation.
const cache = new Map<string, unknown>();

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const cached = cache.get(url) as T | undefined;
  if (cached) return cached;

  const res = await fetch(url, init);
  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, res.status);
  }

  const data = (await res.json()) as T;
  cache.set(url, data);
  return data;
}

export async function fetchPokemonList(params?: {
  limit?: number;
  offset?: number;
}): Promise<PokemonListResponse> {
  const limit = params?.limit ?? 20;
  const offset = params?.offset ?? 0;
  const url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  return fetchJson<PokemonListResponse>(url);
}

export async function fetchPokemonDetail(name: string): Promise<PokemonDetail> {
  const url = `${POKEAPI_BASE_URL}/pokemon/${encodeURIComponent(name)}`;
  return fetchJson<PokemonDetail>(url);
}

export function __internalClearApiCacheForTests() {
  cache.clear();
}

