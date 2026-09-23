'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, Sparkles, MessageSquare, Loader2, Camera, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewMediaItem, processMediaFile } from '@/lib/media-utils';

export interface PurchasedProductItem {
  productId: string;
  productTitle: string;
  image?: string;
  variantName?: string;
}

interface PostPurchaseReviewProps {
  items: PurchasedProductItem[];
  defaultAuthorName?: string;
  orderNumber?: string;
  className?: string;
}

export default function PostPurchaseReview({
  items,
  defaultAuthorName = '',
  orderNumber,
  className = '',
}: PostPurchaseReviewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    items[0]?.productId || ''
  );
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [headline, setHeadline] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>(defaultAuthorName);
  const [attachedMedia, setAttachedMedia] = useState<ReviewMediaItem[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!items || items.length === 0) return null;

  const currentItem =
    items.find((it) => it.productId === selectedProductId) || items[0];
  const isCurrentSubmitted = submittedIds.includes(currentItem.productId);

  const ratingDescriptions: Record<number, string> = {
    1: '1 - Poor formulation',
    2: '2 - Below expectations',
    3: '3 - Satisfactory',
    4: '4 - Very effective',
    5: '5 - Exceptional laboratory quality',
  };

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (attachedMedia.length + files.length > 5) {
      setErrorMessage('You can attach up to 5 photos and video clips.');
      return;
    }

    setIsUploadingMedia(true);
    setErrorMessage(null);

    try {
      const processed = await Promise.all(
        files.map((file) => processMediaFile(file))
      );
      setAttachedMedia((prev) => [...prev, ...processed]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing media file.');
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const removeAttachedMedia = (index: number) => {
    setAttachedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Please share a brief comment about your experience.');
      return;
    }
    if (!authorName.trim()) {
      setErrorMessage('Please provide your name for the verified review.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentItem.productId,
          rating,
          headline: headline.trim() || undefined,
          comment: comment.trim(),
          authorName: authorName.trim(),
          verifiedPurchase: true,
          images: attachedMedia.length > 0 ? attachedMedia : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSubmittedIds((prev) => [...prev, currentItem.productId]);
      setHeadline('');
      setComment('');
      setAttachedMedia([]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xl shadow-black/[0.03] text-left transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF6EF] text-[#B45309] border border-[#C88A58]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C88A58]" />
            Verified Purchase Review
          </div>
          <h3 className="font-display font-bold text-xl text-[#111827]">
            Review Your Formula
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            As a verified buyer, share your direct experience with this batch.
          </p>
        </div>
        {orderNumber && (
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono bg-neutral-100 text-neutral-700">
            #{orderNumber}
          </span>
        )}
      </div>

      {/* Multiple items selector if order contains > 1 product */}
      {items.length > 1 && (
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Select Formula to Review
          </label>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const active = item.productId === currentItem.productId;
              const completed = submittedIds.includes(item.productId);
              return (
                <button
                  key={item.productId}
                  type="button"
                  onClick={() => {
                    setSelectedProductId(item.productId);
                    setErrorMessage(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    active
                      ? 'bg-[#111827] text-white border-[#111827] shadow-sm'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {completed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="truncate max-w-[180px]">{item.productTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Product Card Badge */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/60 mb-6">
        {currentItem.image && (
          <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200/60 flex items-center justify-center p-1 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentItem.image}
              alt={currentItem.productTitle}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-[#111827] truncate">
            {currentItem.productTitle}
          </h4>
          {currentItem.variantName && (
            <p className="text-xs text-neutral-500 truncate">
              {currentItem.variantName}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isCurrentSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-emerald-900 mb-1">
              Thank You for Your Feedback!
            </h4>
            <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
              Your verified review for <strong>{currentItem.productTitle}</strong> has been logged to our batch record.
            </p>
            {items.length > submittedIds.length && (
              <p className="text-xs text-emerald-600 mt-3">
                You can select another formula above to review the rest of your purchase.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
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
                        aria-label={`Rate ${starVal} out of 5 stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'fill-[#C88A58] text-[#C88A58]'
                              : 'fill-neutral-200 text-neutral-200 hover:text-neutral-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-600 ml-2">
                  {ratingDescriptions[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C88A58]/20 focus:border-[#C88A58] transition-all"
              />
            </div>

            {/* Headline */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Headline <span className="font-normal text-neutral-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Dissolved tough limescale instantly"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C88A58]/20 focus:border-[#C88A58] transition-all"
              />
            </div>

            {/* Detailed Comment */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Written Review
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe surface performance, fragrance, dwell time, and overall clean..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#C88A58]/20 focus:border-[#C88A58] transition-all resize-none"
              />
            </div>

            {/* Photos & Videos Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Attach Photos / Video <span className="font-normal text-neutral-400">(Optional)</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-neutral-300 hover:border-[#C88A58] bg-neutral-50 text-xs font-medium text-[#111827] cursor-pointer transition-all">
                  <Camera className="w-4 h-4 text-[#C88A58]" />
                  <span>Upload Photos / Video</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaSelect}
                    disabled={isUploadingMedia}
                    className="hidden"
                  />
                </label>

                {isUploadingMedia && (
                  <div className="flex items-center gap-1.5 text-xs text-[#C88A58]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing media...</span>
                  </div>
                )}
              </div>

              {attachedMedia.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-3">
                  {attachedMedia.map((media, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-xs"
                    >
                      {media.type === 'video' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-1 relative">
                          <video
                            src={media.url}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                          <Play className="w-3.5 h-3.5 fill-white relative z-10" />
                          <span className="text-[8px] font-bold mt-0.5 relative z-10">Video</span>
                        </div>
                      ) : (
                        <img
                          src={media.url}
                          alt="Uploaded preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeAttachedMedia(idx)}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center z-20 text-[10px]"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#111827] text-white font-medium text-sm hover:bg-black active:scale-[0.99] transition-all shadow-md shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 text-[#C88A58]" />
                    <span>Submit Verified Review</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
