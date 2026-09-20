"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice, discountPercentage, parseJsonSafe, cn } from "@/lib/utils";
import type { ProductWithVariants } from "@/types";
import { useCartStore } from "@/store/cart-store";

interface ProductShowcaseProps {
  products: ProductWithVariants[];
}

export default function ProductShowcase({ products }: ProductShowcaseProps) {
  const addItem = useCartStore((state) => state.addItem);

  const getCategoryColor = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes("bathroom")) return "from-blue-50/40 to-slate-50";
    if (c.includes("kitchen")) return "from-amber-50/40 to-stone-50";
    if (c.includes("metal")) return "from-[#FDF6EF]/60 to-stone-50";
    return "from-stone-50 to-white";
  };

  return (
    <section className="section-padding bg-[#F8F9FA] relative border-b border-neutral-200/60">
      <div className="container-wide">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#C88A58]/30 shadow-sm text-xs font-semibold text-[#111827] tracking-wide mb-3">
            The Precision Lineup
          </span>
          <h2 className="font-display text-display-sm text-graphite mb-3">
            The Collection
          </h2>
          <p className="text-body-lg text-graphite/60 max-w-2xl mx-auto">
            Precision-formulated for every surface in your home
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, index) => {
            const defaultVariant = product.variants[0];
            if (!defaultVariant) return null;

            const images = parseJsonSafe<string[]>(product.images, []);
            const hasDiscount =
              defaultVariant.compareAtPrice &&
              defaultVariant.compareAtPrice > defaultVariant.price;
            const discount = hasDiscount
              ? discountPercentage(
                  defaultVariant.price,
                  defaultVariant.compareAtPrice!
                )
              : 0;

            const handleAddToCart = (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({
                variantId: defaultVariant.id,
                productId: product.id,
                productSlug: product.slug,
                productTitle: product.title,
                variantName: defaultVariant.name,
                price: defaultVariant.price,
                compareAtPrice: defaultVariant.compareAtPrice,
                quantity: 1,
                image: images[0] || `/images/products/${product.slug}.jpg`,
                maxQuantity: defaultVariant.inventoryCount,
              });
            };

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/[0.06] transition-all duration-300 hover:-translate-y-1"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="flex-1 flex flex-col"
                >
                  {/* Image area */}
                  <div
                    className={cn(
                      "aspect-[4/3.5] w-full relative bg-gradient-to-b flex items-center justify-center p-6 overflow-hidden border-b border-neutral-100",
                      getCategoryColor(product.category)
                    )}
                  >
                    {hasDiscount && (
                      <span className="absolute top-4 left-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold bg-[#111827] text-white z-10 shadow-sm">
                        {discount}% OFF
                      </span>
                    )}
                    <span className="absolute top-4 right-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold bg-white/90 backdrop-blur-md text-[#111827] border border-neutral-200/80 shadow-sm z-10">
                      {product.category}
                    </span>

                    {/* Crisp Product Bottle Graphic */}
                    <div className="w-full h-full flex items-center justify-center p-2 transition-transform duration-500 group-hover:scale-105">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images[0] || '/images/products/tap-cleaner-limescale-remover.jpg'}
                        alt={product.title}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="font-display font-bold text-lg text-graphite mb-1.5 truncate">
                      {product.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-body-sm text-graphite/60 line-clamp-2 mb-4 flex-1">
                      {product.subtitle || product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-2 border-t border-neutral-100">
                      <span className="font-display font-bold text-xl text-graphite">
                        {formatPrice(defaultVariant.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-graphite/40 line-through">
                          {formatPrice(defaultVariant.compareAtPrice!)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Add to Cart */}
                <div className="px-6 pb-6">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 rounded-full font-medium text-sm text-center transition-all bg-[#111827] text-white hover:bg-black active:scale-[0.98] flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-medium text-[#111827] bg-white border border-neutral-300 hover:border-neutral-400 hover:bg-stone-50 transition-all shadow-sm"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
