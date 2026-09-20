'use client';

import React, { useState } from 'react';
import { ProductWithVariants } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, parseJsonSafe } from '@/lib/utils';
import { Sparkles, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  product: ProductWithVariants;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Parse images JSON safely
  const parsed = parseJsonSafe<string[]>(product.images, []);
  
  // Resolve image paths
  const resolvedImages = parsed.length > 0 
    ? parsed
    : ['/images/products/tap-cleaner-limescale-remover.jpg'];

  const activeImage = resolvedImages[activeIdx] || resolvedImages[0];

  return (
    <div className="sticky top-24 flex flex-col gap-4">
      {/* Main Image Display */}
      <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-white via-porcelain to-emerald-50/40 border border-graphite/10 flex items-center justify-center relative overflow-hidden shadow-card group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full p-8 flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        {/* Hover overlay details */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-graphite/80 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-botanical-600" />
          <span>Studio Capture</span>
        </div>

        <div className="absolute bottom-4 right-4 p-2 rounded-full glass text-graphite/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-4 h-4" />
        </div>
      </div>

      {/* Thumbnails Row */}
      {resolvedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {resolvedImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "aspect-square rounded-2xl flex items-center justify-center bg-white border p-2 overflow-hidden transition-all duration-200",
                activeIdx === idx
                  ? "border-botanical-600 ring-2 ring-botanical-500/30 shadow-sm"
                  : "border-graphite/10 hover:border-graphite/30 opacity-70 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
