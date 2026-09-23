'use client';

import React from 'react';
import { useCartStore } from '@/store/cart-store';
import Link from 'next/link';
import { formatPrice, FREE_SHIPPING_THRESHOLD, cn } from '@/lib/utils';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal: getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div className="container-tight py-24 text-center min-h-[65vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-[#FDF6EF] text-[#C88A58] border border-[#C88A58]/20 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-display text-display-sm text-graphite mb-3">Your cart is empty</h1>
        <p className="text-body-lg text-graphite/60 mb-8 max-w-md">
          Explore our collection of natural citric acid-powered foam cleaners and surface polishes.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#111827] hover:bg-black text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-wide pt-28 pb-16">
      <h1 className="font-display text-display-md text-graphite mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-sm items-center"
            >
              <div className="w-20 h-20 bg-stone-50 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-100 flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    item.image
                      ? item.image.replace(/\.svg$/, '.jpg')
                      : `/images/products/${item.productSlug || 'tap-cleaner-limescale-remover'}.jpg`
                  }
                  alt={item.productTitle}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (item.productSlug && !target.src.includes(`${item.productSlug}.jpg`)) {
                      target.src = `/images/products/${item.productSlug}.jpg`;
                    }
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productSlug}`} className="font-semibold text-sm sm:text-base text-graphite hover:text-[#C88A58] transition-colors truncate block">
                  {item.productTitle}
                </Link>
                <div className="text-xs text-graphite/60 mt-0.5">{item.variantName}</div>
                <div className="text-xs font-semibold text-graphite mt-1">
                  {formatPrice(item.price)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 rounded-full bg-white h-9">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-8 h-full flex items-center justify-center text-graphite/60 hover:text-graphite cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-graphite/60 hover:text-graphite cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-graphite/40 hover:text-red-500 transition-colors p-2 cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm sticky top-24">
            <h2 className="font-display font-bold text-xl text-graphite mb-6">Order Summary</h2>

            {/* Free shipping bar */}
            <div className="mb-6 p-4 rounded-2xl bg-[#FDF6EF]/70 border border-[#C88A58]/20">
              <div className="flex justify-between text-xs mb-2 font-semibold">
                <span className="text-graphite">Free Express Shipping</span>
                <span className={remaining <= 0 ? "text-[#15803D]" : "text-[#B45309]"}>
                  {remaining <= 0 ? 'Unlocked!' : `${formatPrice(remaining)} away`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    remaining <= 0 ? "bg-[#15803D]" : "bg-[#C88A58]"
                  )}
                />
              </div>
            </div>

            <div className="space-y-3.5 text-sm mb-6 pb-6 border-b border-neutral-100">
              <div className="flex justify-between text-xs">
                <span className="text-graphite/70">Subtotal</span>
                <span className="font-semibold text-graphite">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-graphite/70">Estimated Shipping</span>
                <span className="font-medium text-graphite">
                  {remaining <= 0 ? (
                    <span className="text-[#15803D] font-bold">FREE</span>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-8">
              <span className="font-semibold text-base text-graphite">Total</span>
              <span className="font-display font-bold text-2xl text-graphite">{formatPrice(subtotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-[#111827] text-white hover:bg-black rounded-full font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-6 space-y-2.5 text-xs text-graphite/70 font-medium">
              <Link href="/shipping" className="flex items-center gap-2 hover:text-graphite transition-colors group">
                <Truck className="w-4 h-4 text-[#C88A58] group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline">Express courier dispatch within 24 hours</span>
              </Link>
              <Link href="/returns" className="flex items-center gap-2 hover:text-graphite transition-colors group">
                <ShieldCheck className="w-4 h-4 text-[#C88A58] group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline">100% Transit Guarantee &amp; Easy Returns</span>
              </Link>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>100% Non-Toxic &amp; Plant-Derived</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
