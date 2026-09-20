'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, X, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderReviewActionProps {
  productId: string;
  productTitle: string;
  productImage?: string;
  authorDefaultName?: string;
}

export default function OrderReviewAction({
  productId,
  productTitle,
  productImage,
  authorDefaultName = '',
}: OrderReviewActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState(authorDefaultName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please enter your review comments.');
      return;
    }
    if (!authorName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          headline: headline.trim() || undefined,
          comment: comment.trim(),
          authorName: authorName.trim(),
          verifiedPurchase: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-neutral-200 text-[#111827] hover:border-[#C88A58] hover:text-[#C88A58] hover:shadow-sm transition-all"
      >
        <Star className="w-3.5 h-3.5 text-[#C88A58] fill-[#C88A58]/20" />
        <span>Write a Review</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xl overflow-hidden text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Product Info */}
              <div className="flex items-center gap-3 mb-5 pr-8">
                {productImage && (
                  <div className="w-12 h-12 bg-neutral-50 rounded-xl border border-neutral-200/70 p-1 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImage}
                      alt={productTitle}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <span className="text-[11px] font-semibold text-[#B45309] bg-[#FDF6EF] px-2.5 py-0.5 rounded-full border border-[#C88A58]/20 inline-block mb-1">
                    Verified Customer
                  </span>
                  <h3 className="font-display font-bold text-base text-[#111827] truncate max-w-[280px]">
                    {productTitle}
                  </h3>
                </div>
              </div>

              {isSubmitted ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-base text-emerald-900 mb-1">
                    Review Submitted!
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Thank you for your feedback. Your verified review is recorded.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Your Rating
                    </label>
                    <div
                      className="flex items-center gap-1.5"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled =
                          hoverRating > 0 ? starVal <= hoverRating : starVal <= rating;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            className="p-1 hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                isFilled
                                  ? 'fill-[#C88A58] text-[#C88A58]'
                                  : 'fill-neutral-200 text-neutral-200'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C88A58]/20 focus:border-[#C88A58]"
                    />
                  </div>

                  {/* Headline */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      Headline <span className="font-normal text-neutral-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Unmatched shine on antique copper"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C88A58]/20 focus:border-[#C88A58]"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      Review Comment
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share how the formula performed on your surfaces..."
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C88A58]/20 focus:border-[#C88A58] resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-2.5 rounded-full border border-neutral-200 text-neutral-600 text-xs font-medium hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-full bg-[#111827] text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5 text-[#C88A58]" />
                          <span>Submit Verified Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
