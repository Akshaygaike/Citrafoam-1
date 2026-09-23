'use client';

import React, { useState } from 'react';
import { ProductWithVariants } from '@/types';
import { cn, formatPrice, parseJsonSafe } from '@/lib/utils';
import { Minus, Plus, ShoppingBag, Truck, Shield, Award, Sparkles, Calendar, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { AnimatePresence, motion } from 'framer-motion';

interface ProductInfoProps {
  product: ProductWithVariants;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const images = parseJsonSafe<string[]>(product.images, []);
  
  const discount = selectedVariant?.compareAtPrice 
    ? Math.round(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100) 
    : 0;

  const handleAdd = () => {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice,
      quantity,
      image: images[0] || `/images/products/${product.slug}.jpg`,
      maxQuantity: selectedVariant.inventoryCount,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Delivery estimation (2-3 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const reviews = product.reviews || [];
  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10
        ) / 10
      : 5.0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white border border-neutral-200 text-[#111827] shadow-sm">
            {product.category}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200/60">
            <Sparkles className="w-3 h-3 text-[#15803D]" />
            Batch Freshness: Dosed This Week
          </span>
        </div>
        <h1 className="font-display text-display-sm text-graphite">{product.title}</h1>
        <p className="font-sans text-body-lg text-graphite/60 mt-2">{product.subtitle}</p>

        {/* Amazon/Flipkart Rating Summary Link */}
        <div className="mt-3">
          <a
            href="#customer-reviews"
            className="inline-flex items-center gap-2.5 text-xs text-graphite/70 hover:text-botanical-700 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/90 px-2 py-0.5 rounded-md text-amber-900 font-bold text-xs">
              <span>{avgRating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            </div>

            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-3.5 h-3.5',
                    star <= Math.round(avgRating)
                      ? 'fill-amber-400 text-amber-500'
                      : 'fill-transparent text-neutral-300'
                  )}
                />
              ))}
            </div>

            <span className="text-graphite/60 group-hover:underline font-medium">
              {reviews.length} customer {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </a>
        </div>
      </div>

      {/* Pricing Header */}
      <div className="flex items-end gap-3 py-4 border-y border-neutral-200/70">
        <span className="font-display text-heading-lg text-graphite font-bold">
          {formatPrice(selectedVariant.price)}
        </span>
        {selectedVariant?.compareAtPrice && (
          <span className="text-lg text-graphite/40 line-through mb-1">
            {formatPrice(selectedVariant.compareAtPrice)}
          </span>
        )}
        {discount > 0 && (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-[#111827] text-white mb-2 shadow-sm">
            Save {discount}%
          </span>
        )}
      </div>

      <p className="text-body-md text-graphite/70 leading-relaxed">
        {product.description.substring(0, 240)}...
      </p>

      {/* Variant / Volume Selector */}
      {product.variants.length > 1 && (
        <div className="flex flex-col gap-3">
          <span className="font-medium text-graphite text-sm">Select Format / Volume</span>
          <div className="grid grid-cols-2 gap-3">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                  selectedVariant?.id === variant.id
                    ? "border-[#111827] bg-white ring-1 ring-[#111827] shadow-sm"
                    : "border-neutral-200 hover:border-neutral-400 bg-white"
                )}
              >
                <div className="font-medium text-sm text-graphite">{variant.name}</div>
                <div className="text-xs text-graphite/60 mt-0.5">
                  {formatPrice(variant.price)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center border border-neutral-300 rounded-full bg-white h-12">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-full flex items-center justify-center text-graphite/60 hover:text-graphite transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium text-sm">{quantity}</span>
          <button
            onClick={() =>
              setQuantity(
                Math.min(selectedVariant?.inventoryCount || 99, quantity + 1)
              )
            }
            className="w-12 h-full flex items-center justify-center text-graphite/60 hover:text-graphite transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 h-12 bg-[#111827] hover:bg-black text-white rounded-full font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2 font-semibold text-white"
              >
                ✓ Added to Cart!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart • {formatPrice(selectedVariant.price * quantity)}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Real-time Inventory and Estimated Delivery */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2 text-xs">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              (selectedVariant?.inventoryCount || 0) > 20
                ? "bg-[#15803D] animate-pulse"
                : "bg-amber-500"
            )}
          />
          <span className="text-graphite/80 font-medium">
            {(selectedVariant?.inventoryCount || 0) > 20
              ? `In Stock (${selectedVariant.inventoryCount} units available)`
              : `Low Stock — Only ${selectedVariant.inventoryCount} units left in batch`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-graphite/60">
          <Calendar className="w-3.5 h-3.5 text-[#C88A58]" />
          <span>
            Estimated Delivery: <strong>{formattedDelivery}</strong> with express courier dispatch
          </span>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200/70 mt-2">
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-[#FDF6EF] border border-[#C88A58]/30 flex items-center justify-center text-[#C88A58]">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-graphite">Free shipping &gt; ₹999</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-[#FDF6EF] border border-[#C88A58]/30 flex items-center justify-center text-[#C88A58]">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-graphite">30-Day Pure Clean Guarantee</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#15803D]">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-graphite">100% Biodegradable</span>
        </div>
      </div>
    </div>
  );
}
