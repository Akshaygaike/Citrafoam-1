'use client';

import React, { useEffect } from 'react';
import { ReviewMediaItem } from '@/lib/media-utils';
import { X, ChevronLeft, ChevronRight, Star, CheckCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReviewMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: ReviewMediaItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  reviewMeta?: {
    authorName?: string | null;
    rating?: number;
    headline?: string | null;
    comment?: string;
    verifiedPurchase?: boolean;
    date?: string;
  };
}

export default function ReviewMediaModal({
  isOpen,
  onClose,
  mediaList,
  currentIndex,
  onNavigate,
  reviewMeta,
}: ReviewMediaModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < mediaList.length - 1) {
        onNavigate(currentIndex + 1);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, mediaList.length, onClose, onNavigate]);

  if (!isOpen || mediaList.length === 0) return null;

  const currentMedia = mediaList[currentIndex] || mediaList[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          title="Close viewer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Counter Badge */}
        {mediaList.length > 1 && (
          <div className="absolute top-5 left-5 z-50 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
            {currentIndex + 1} / {mediaList.length}
          </div>
        )}

        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < mediaList.length - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Center Content */}
        <div className="w-full max-w-4xl flex flex-col items-center justify-center max-h-[92vh]">
          <div className="relative flex items-center justify-center w-full max-h-[70vh] mb-4">
            {currentMedia.type === 'video' ? (
              <video
                key={currentMedia.url}
                src={currentMedia.url}
                controls
                autoPlay
                playsInline
                className="max-h-[68vh] max-w-full rounded-2xl shadow-2xl bg-black object-contain border border-white/10"
              />
            ) : (
              <img
                key={currentMedia.url}
                src={currentMedia.url}
                alt="Customer review photo"
                className="max-h-[68vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            )}
          </div>

          {/* Review Details Card */}
          {reviewMeta && (
            <div className="w-full bg-neutral-900/95 border border-white/10 p-4 sm:p-5 rounded-2xl text-left max-h-[22vh] overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">
                    {reviewMeta.authorName || 'Verified Customer'}
                  </span>
                  {reviewMeta.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      Verified Purchase
                    </span>
                  )}
                </div>

                {reviewMeta.rating && (
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          'w-3.5 h-3.5',
                          s <= reviewMeta.rating!
                            ? 'fill-amber-400 text-amber-500'
                            : 'fill-transparent text-neutral-600'
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {reviewMeta.headline && (
                <h4 className="text-white font-bold text-xs sm:text-sm mb-1">
                  {reviewMeta.headline}
                </h4>
              )}

              {reviewMeta.comment && (
                <p className="text-neutral-300 text-xs leading-relaxed line-clamp-3">
                  {reviewMeta.comment}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
