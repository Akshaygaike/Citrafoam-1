import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatPrice, parseJsonSafe } from '@/lib/utils';
import { ProductWithVariants } from '@/types';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const category = searchParams.category || 'All';
  const sort = searchParams.sort || 'Featured';

  // Fetch products with variants and reviews
  const products = (await prisma.product.findMany({
    include: {
      variants: true,
      reviews: true,
    },
  })) as unknown as ProductWithVariants[];

  let filteredProducts = products;
  if (category !== 'All') {
    filteredProducts = products.filter((p) =>
      p.category?.toLowerCase().includes(category.toLowerCase().replace(' ', '-'))
    );
  }

  if (sort === 'Price Low-High') {
    filteredProducts.sort(
      (a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
    );
  } else if (sort === 'Price High-Low') {
    filteredProducts.sort(
      (a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
    );
  } else if (sort === 'Newest') {
    filteredProducts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return (
    <div className="container-wide pt-28 pb-16">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#C88A58]/30 shadow-sm text-xs font-semibold text-[#111827] tracking-wide mb-3">
          Surface-Specific Science
        </span>
        <h1 className="font-display text-display-md text-graphite mb-3">
          The Full Collection
        </h1>
        <p className="font-sans text-body-lg text-graphite/60 max-w-2xl mx-auto">
          Discover our range of food-grade citric acid cleaners and active micro-foams.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {['All', 'Bathroom', 'Kitchen', 'Metal Care'].map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat}&sort=${sort}`}
              className={`px-4 py-2 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-[#111827] text-white border-[#111827] shadow-sm'
                  : 'bg-white text-graphite border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-graphite/60 font-medium">Sort by:</span>
          {['Featured', 'Price Low-High', 'Price High-Low', 'Newest'].map((s) => (
            <Link
              key={s}
              href={`/products?category=${category}&sort=${s}`}
              className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                sort === s
                  ? 'font-bold text-[#111827] bg-neutral-100'
                  : 'text-graphite/70 hover:text-graphite'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const defaultVariant = product.variants[0];
          const price = defaultVariant?.price || 0;
          const compareAt = defaultVariant?.compareAtPrice;
          const images = parseJsonSafe<string[]>(product.images, []);
          const firstImage = images[0] || '/images/products/tap-cleaner-limescale-remover.jpg';

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-black/[0.06] transition-all duration-300 hover:-translate-y-1 border border-neutral-200/80"
            >
              <div className="aspect-square rounded-2xl mb-4 bg-gradient-to-b from-[#FDF6EF]/40 to-stone-50/60 relative overflow-hidden flex items-center justify-center p-6 border border-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={firstImage}
                  alt={product.title}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-white/90 backdrop-blur-md text-[#111827] border border-neutral-200/80 shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-graphite group-hover:text-[#C88A58] transition-colors line-clamp-1">
                {product.title}
              </h3>
              <p className="text-xs text-graphite/60 mb-4 line-clamp-2 mt-1">
                {product.subtitle}
              </p>

              <div className="mt-auto flex items-baseline justify-between pt-3 border-t border-neutral-100">
                <div>
                  <span className="font-display font-bold text-lg text-graphite">
                    {formatPrice(price)}
                  </span>
                  {compareAt && (
                    <span className="text-xs text-graphite/40 line-through ml-1.5">
                      {formatPrice(compareAt)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#111827] group-hover:text-[#C88A58] transition-colors">
                  View Formula &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
