'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles, Package, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchResultItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  'Tap Cleaner',
  'Limescale',
  'Kitchen Degreaser',
  'Copper & Brass',
  'Bathroom Fittings',
  'Chimney Grease',
  '500ml Bottle',
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch search results with debouncing
  useEffect(() => {
    if (!isOpen) return;

    if (!query.trim()) {
      // Fetch default featured list
      setIsLoading(true);
      fetch('/api/products/search')
        .then((res) => res.json())
        .then((data) => {
          setResults(data.products || []);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.products || []);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }, 180);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    startTransition(() => {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-16 sm:pt-24 px-4">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-graphite/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden flex flex-col z-10 max-h-[85vh] animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="Product Search"
      >
        {/* Search Header Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center px-5 py-4 border-b border-neutral-100">
          <Search className="w-5 h-5 text-graphite/40 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulas, surfaces (tap, limescale, grease, copper)..."
            className="w-full bg-transparent text-sm sm:text-base text-graphite placeholder:text-graphite/40 focus:outline-none font-medium"
          />
          {isLoading && (
            <Loader2 className="w-4 h-4 text-[#00AA55] animate-spin mr-2 flex-shrink-0" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-graphite/40 hover:text-graphite transition-colors mr-2"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-graphite/60 hover:text-graphite bg-neutral-100 hover:bg-neutral-200 transition-colors flex-shrink-0"
          >
            ESC
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-3 bg-[#FBF9F5] border-b border-neutral-100 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-graphite/50 uppercase tracking-wider flex-shrink-0">
              Suggestions:
            </span>
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  query.toLowerCase() === suggestion.toLowerCase()
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'bg-white text-graphite/70 border border-neutral-200/80 hover:border-graphite/30 hover:text-graphite'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {results.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-graphite/50 font-medium px-2 pb-1">
                <span>
                  {query.trim() ? `Found ${results.length} matching formulas` : 'Featured Formulations'}
                </span>
                {query.trim() && (
                  <button
                    onClick={handleSubmit}
                    className="text-[#00AA55] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View all on catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-center justify-between p-3 rounded-2xl hover:bg-[#FBF9F5] border border-transparent hover:border-neutral-200/70 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-stone-50 border border-neutral-100 p-1.5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = `/images/products/${product.slug}.jpg`;
                        }}
                      />
                    </div>
                    {/* Details */}
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-semibold text-[#00AA55] mb-1">
                        {product.category}
                      </span>
                      <h4 className="font-display font-bold text-sm text-graphite group-hover:text-[#00AA55] transition-colors leading-snug">
                        {product.title}
                      </h4>
                      <p className="text-xs text-graphite/50 line-clamp-1">
                        500ml Bottle • Citric Acid Formulation
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="font-display font-bold text-sm text-graphite block">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[11px] text-graphite/40 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#111827] group-hover:text-white flex items-center justify-center text-graphite transition-all flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() && !isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-graphite/40 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-graphite">
                No formulas matched &ldquo;{query}&rdquo;
              </h3>
              <p className="text-xs text-graphite/60 max-w-sm mx-auto">
                Try searching by surface type like <strong>tap</strong>, <strong>copper</strong>, <strong>grease</strong>, or <strong>limescale</strong>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-graphite transition-colors"
                >
                  Clear search &amp; view all
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer info bar */}
        {query.trim() && results.length > 0 && (
          <div className="p-3.5 bg-neutral-50 border-t border-neutral-100 text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-xs font-semibold text-graphite hover:text-[#00AA55] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Press <strong>Enter</strong> or click here to see full results for &ldquo;{query}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
