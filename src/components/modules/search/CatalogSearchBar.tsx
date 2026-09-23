'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function CatalogSearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto mb-8">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-graphite/40 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tap cleaner, limescale, kitchen, copper..."
          className="w-full pl-11 pr-20 py-2.5 bg-white border border-neutral-200/90 rounded-full text-xs sm:text-sm text-graphite placeholder:text-graphite/40 shadow-xs focus:outline-none focus:border-[#00AA55] focus:ring-2 focus:ring-[#00AA55]/10 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 text-graphite/40 hover:text-graphite p-1"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1.5 px-3 py-1.5 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-semibold transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
