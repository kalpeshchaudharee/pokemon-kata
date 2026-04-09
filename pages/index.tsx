import { useEffect, useState } from "react";
import { fetchPokemonList } from "@/lib/api";
import type { NamedAPIResource } from "@/types/pokemon";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<NamedAPIResource[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonList({ limit: 20, offset: 0 });
        if (!cancelled) setItems(data.results);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-base font-medium text-zinc-600 dark:text-zinc-300">
          Loading…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-base font-medium text-red-700 dark:text-red-300">
          Failed to load Pokémon.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Pokédex</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Browse Pokémon and open a card for details.
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li
              key={p.name}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="font-medium capitalize">{p.name}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
