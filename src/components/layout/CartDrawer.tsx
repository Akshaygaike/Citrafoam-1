'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles, Check } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCartStore } from '@/store/cart-store';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CartDrawer({ isOpen: propsIsOpen, onClose: propsOnClose }: CartDrawerProps) {
  const {
    items,
    isOpen: storeIsOpen,
    closeCart,
    removeItem,
    updateQuantity,
    addItem,
    subtotal: getSubtotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Use store's isOpen unless explicitly controlled
  const isDrawerOpen = propsIsOpen !== undefined ? propsIsOpen : storeIsOpen;
  const handleClose = propsOnClose || closeCart;

  const rawSubtotal = getSubtotal();
  const discount = couponApplied ? rawSubtotal * 0.1 : 0;
  const subtotal = Math.max(0, rawSubtotal - discount);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const isEmpty = items.length === 0;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.trim().toUpperCase() === 'CITRAFOAM10') {
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon. Try "CITRAFOAM10" for 10% off.');
    }
  };

  const handleAddCrossSell = () => {
    addItem({
      variantId: 'cross-sell-cloth-3pack',
      productId: 'microfiber-polishing-cloths',
      productSlug: 'tap-cleaner-limescale-remover',
      productTitle: 'Ultra-Dense Microfiber Polishing Cloths (Set of 3)',
      variantName: '350 GSM Double-Sided',
      price: 299,
      compareAtPrice: 399,
      quantity: 1,
      image: '/images/products/tap-cleaner-limescale-remover.jpg',
      maxQuantity: 50,
    });
  };

  const hasCrossSellInCart = items.some(
    (item) => item.variantId === 'cross-sell-cloth-3pack'
  );

  return (
    <Sheet
      isOpen={isDrawerOpen}
      onClose={handleClose}
      title={`Your Cart (${itemCount})`}
      className="w-full sm:w-[460px]"
    >
      <div className="flex flex-col h-full bg-porcelain">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-24 h-24 bg-[#FDF6EF] text-[#C88A58] border border-[#C88A58]/20 rounded-full flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-xs">
              <h3 className="text-xl font-display font-semibold text-graphite">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm">
                Explore our citric-powered cleaners to restore and protect your surfaces.
              </p>
            </div>
            <Link
              href="/products"
              onClick={handleClose}
              className="px-8 py-3.5 bg-[#111827] hover:bg-black text-white rounded-full font-medium text-sm transition-all shadow-md"
            >
              Browse The Collection
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="p-5 bg-white border-b border-gray-200">
              <ProgressBar
                current={subtotal}
                target={FREE_SHIPPING_THRESHOLD}
                showLabel={true}
              />
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.variantId}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 bg-white p-4 rounded-2xl shadow-subtle border border-gray-100"
                  >
                    <div className="w-20 h-20 bg-stone-50 rounded-2xl overflow-hidden relative flex-shrink-0 flex items-center justify-center border border-neutral-100 p-2">
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
                          // Fallback to jpg product image if anything fails
                          const target = e.currentTarget;
                          if (item.productSlug && !target.src.includes(`${item.productSlug}.jpg`)) {
                            target.src = `/images/products/${item.productSlug}.jpg`;
                          }
                        }}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-graphite text-sm line-clamp-1">
                            {item.productTitle}
                          </h4>
                          <p className="text-xs text-graphite/50 mt-0.5">
                            {item.variantName}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-porcelain">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors text-graphite"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-graphite">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors text-graphite"
                            disabled={item.quantity >= item.maxQuantity}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-semibold text-sm text-graphite">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Cross-sell Upsell Card */}
              {!hasCrossSellInCart && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-botanical-50/40 border border-emerald-200/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-botanical-600 shadow-sm flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-graphite">
                        Microfiber Polishing Cloth (3-Pk)
                      </p>
                      <p className="text-[11px] text-graphite/60">
                        Zero streaks on chrome &amp; copper •{' '}
                        <strong className="text-emerald-700 font-bold">
                          {formatPrice(299)}
                        </strong>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddCrossSell}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-sm"
                  >
                    + Add
                  </button>
                </div>
              )}

              {/* Instant Coupon Code input */}
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo code (try CITRAFOAM10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase tracking-wider rounded-xl border border-gray-200 focus:border-botanical-500 outline-none bg-white font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-4 py-2 bg-graphite text-white text-xs font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </form>
                {couponApplied && (
                  <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                    <Check className="w-3 h-3" /> 10% discount applied!
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-red-500 font-medium mt-1.5">
                    {couponError}
                  </p>
                )}
              </div>
            </div>

            {/* Footer / Summary */}
            <div className="p-5 bg-white border-t border-gray-200 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-graphite/70 text-xs">
                  <span>Subtotal</span>
                  <span className="font-medium text-graphite">
                    {formatPrice(rawSubtotal)}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 text-xs">
                    <span>Discount (CITRAFOAM10)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-graphite/70 text-xs">
                  <span>Shipping</span>
                  <span className="font-medium text-graphite">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      'Calculated at checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-graphite pt-2 border-t border-gray-100">
                  <span>Estimated Total</span>
                  <span className="font-display text-lg">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={handleClose}
                  className="py-3 text-center border border-neutral-300 text-neutral-800 hover:border-neutral-400 rounded-full font-medium text-xs transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={handleClose}
                  className="py-3 bg-[#111827] hover:bg-black text-white rounded-full font-medium text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
