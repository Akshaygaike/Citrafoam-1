'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ReviewData } from '@/types';
import {
  Star,
  CheckCircle,
  ThumbsUp,
  ShieldCheck,
  Filter,
  Loader2,
  AlertCircle,
  X,
  PlusCircle,
  Camera,
  Play,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewMediaItem, parseReviewMedia, processMediaFile } from '@/lib/media-utils';
import ReviewMediaModal from '@/components/modules/reviews/ReviewMediaModal';

interface ProductReviewsProps {
  reviews: ReviewData[];
  productId: string;
  productTitle: string;
}

export default function ProductReviews({
  reviews: initialReviews,
  productId,
  productTitle,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews || []);
  const [showForm, setShowForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterWithMediaOnly, setFilterWithMediaOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  // Media Modal Viewer State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMediaList, setActiveMediaList] = useState<ReviewMediaItem[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeReviewMeta, setActiveReviewMeta] = useState<any>(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [attachedMedia, setAttachedMedia] = useState<ReviewMediaItem[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Sync latest reviews from server on mount
  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching latest reviews:', err);
      });
  }, [productId]);

  // Calculations
  const totalReviews = reviews.length;
  const avgRating = useMemo(() => {
    if (totalReviews === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / totalReviews) * 10) / 10;
  }, [reviews, totalReviews]);

  const verifiedCount = useMemo(() => {
    return reviews.filter((r) => r.verifiedPurchase).length;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, r.rating));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  // Aggregate all customer photos & videos for the top gallery (Amazon style)
  const allCustomerMedia = useMemo(() => {
    const list: { media: ReviewMediaItem; review: ReviewData }[] = [];
    reviews.forEach((r) => {
      const items = parseReviewMedia(r.images);
      items.forEach((m) => {
        list.push({ media: m, review: r });
      });
    });
    return list;
  }, [reviews]);

  const reviewsWithMediaCount = useMemo(() => {
    return reviews.filter((r) => parseReviewMedia(r.images).length > 0).length;
  }, [reviews]);

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (filterRating !== null && r.rating !== filterRating) return false;
        if (filterVerifiedOnly && !r.verifiedPurchase) return false;
        if (filterWithMediaOnly && parseReviewMedia(r.images).length === 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        // Default 'recent'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [reviews, filterRating, filterVerifiedOnly, filterWithMediaOnly, sortBy]);

  const handleHelpfulClick = (reviewId: string) => {
    if (votedMap[reviewId]) return;
    setHelpfulMap((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    setVotedMap((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
  };

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (attachedMedia.length + files.length > 5) {
      setSubmitMessage({
        type: 'error',
        text: 'You can attach up to 5 photos and video clips per review.',
      });
      return;
    }

    setIsUploadingMedia(true);
    setSubmitMessage(null);

    try {
      const processed = await Promise.all(
        files.map((file) => processMediaFile(file))
      );
      setAttachedMedia((prev) => [...prev, ...processed]);
    } catch (err: any) {
      setSubmitMessage({
        type: 'error',
        text: err.message || 'Error processing media file.',
      });
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const removeAttachedMedia = (index: number) => {
    setAttachedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const ratingLabels: Record<number, string> = {
    5: '5 - Exceptional laboratory quality',
    4: '4 - Very effective & fast',
    3: '3 - Satisfactory cleaning',
    2: '2 - Below expectations',
    1: '1 - Poor formulation',
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setSubmitMessage({
        type: 'error',
        text: 'Please write your review comments.',
      });
      return;
    }
    if (!authorName.trim()) {
      setSubmitMessage({
        type: 'error',
        text: 'Please enter your name.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

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
          images: attachedMedia.length > 0 ? attachedMedia : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      const newReview: ReviewData = {
        id: data.id || `rev-${Date.now()}`,
        productId,
        userId: data.userId || null,
        rating: Number(rating),
        headline: headline.trim() || null,
        comment: comment.trim(),
        images: attachedMedia.length > 0 ? JSON.stringify(attachedMedia) : null,
        verifiedPurchase: true,
        isApproved: true,
        authorName: authorName.trim(),
        createdAt: new Date(),
      };

      setReviews((prev) => [newReview, ...prev]);
      setSubmitMessage({
        type: 'success',
        text: '✓ Review submitted! Your verified feedback is now live below.',
      });
      setHeadline('');
      setComment('');
      setAuthorName('');
      setAttachedMedia([]);
      setTimeout(() => {
        setShowForm(false);
        setSubmitMessage(null);
      }, 2500);
    } catch (err: any) {
      setSubmitMessage({
        type: 'error',
        text: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to generate avatar color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-emerald-600 text-white',
      'bg-amber-600 text-white',
      'bg-teal-600 text-white',
      'bg-cyan-700 text-white',
      'bg-indigo-600 text-white',
      'bg-neutral-800 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <section
      id="customer-reviews"
      className="py-16 border-t border-neutral-200/80 scroll-mt-24"
    >
      {/* Lightbox Media Modal */}
      <ReviewMediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mediaList={activeMediaList}
        currentIndex={activeMediaIndex}
        onNavigate={(idx) => setActiveMediaIndex(idx)}
        reviewMeta={activeReviewMeta}
      />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-200/70">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#B45309] uppercase bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#FDE68A] inline-block mb-2">
            Real Customer Experiences
          </span>
          <h2 className="font-display text-heading-lg text-graphite">
            Customer Reviews &amp; Ratings
          </h2>
          <p className="text-sm text-graphite/60 mt-1">
            Verified ratings and authentic feedback for {productTitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-3.5 py-2 rounded-xl self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>100% Verified Buyer Community</span>
        </div>
      </div>

      {/* Amazon-style "Reviews with Images & Videos" Strip */}
      {allCustomerMedia.length > 0 && (
        <div className="mb-12 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm sm:text-base text-graphite flex items-center gap-2">
              <Camera className="w-4 h-4 text-botanical-600" />
              Customer Photos &amp; Videos ({allCustomerMedia.length})
            </h3>
            <span className="text-xs text-graphite/50">Click to enlarge</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {allCustomerMedia.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const mediaList = allCustomerMedia.map((x) => x.media);
                  setActiveMediaList(mediaList);
                  setActiveMediaIndex(idx);
                  const r = item.review;
                  setActiveReviewMeta({
                    authorName: r.authorName,
                    rating: r.rating,
                    headline: r.headline,
                    comment: r.comment,
                    verifiedPurchase: r.verifiedPurchase,
                    date: new Date(r.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  });
                  setModalOpen(true);
                }}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-neutral-200 hover:border-botanical-500 hover:shadow-md transition-all group/item cursor-pointer flex-shrink-0 bg-neutral-900"
              >
                {item.media.type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-2 text-center relative">
                    <video
                      src={item.media.url}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white relative z-10 group-hover/item:scale-110 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </div>
                    <span className="text-[9px] font-bold bg-black/80 px-1.5 py-0.5 rounded text-white mt-1 relative z-10">
                      Video
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.media.url}
                    alt="Customer upload"
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Amazon/Flipkart Ratings Summary & Breakdown (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-sm">
            <h3 className="font-display font-bold text-base text-graphite mb-4">
              Overall Customer Rating
            </h3>

            {totalReviews > 0 ? (
              <>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-4xl font-extrabold text-graphite">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm font-medium text-graphite/50">out of 5</span>
                </div>

                {/* Stars Row */}
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-5 h-5',
                        star <= Math.round(avgRating)
                          ? 'fill-amber-400 text-amber-500'
                          : 'fill-transparent text-neutral-300'
                      )}
                    />
                  ))}
                </div>

                <p className="text-xs text-graphite/60 mb-6">
                  Based on {totalReviews} verified rating{totalReviews === 1 ? '' : 's'} (
                  {verifiedCount} verified purchase{verifiedCount === 1 ? '' : 's'})
                </p>
              </>
            ) : (
              <div className="mb-6">
                <div className="flex items-center gap-1 text-neutral-300 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-transparent text-neutral-300"
                    />
                  ))}
                </div>
                <p className="text-xs text-graphite/60">
                  No customer ratings yet for this formula.
                </p>
              </div>
            )}

            {/* Star Distribution Bars (Amazon/Flipkart style) */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const pct =
                  totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                const isSelected = filterRating === stars;

                return (
                  <button
                    key={stars}
                    onClick={() =>
                      setFilterRating(isSelected ? null : stars)
                    }
                    className={cn(
                      'w-full flex items-center gap-3 text-xs text-left group py-1 px-1.5 rounded-lg transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-300'
                        : 'hover:bg-neutral-50 text-graphite/70'
                    )}
                  >
                    <span className="w-12 text-graphite/80 font-medium group-hover:text-botanical-700">
                      {stars} star
                    </span>

                    {/* Progress Bar Track */}
                    <div className="flex-1 h-3 rounded-full bg-neutral-100 overflow-hidden relative">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          isSelected
                            ? 'bg-amber-500'
                            : 'bg-amber-400 group-hover:bg-amber-500'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <span className="w-9 text-right text-graphite/60 group-hover:text-graphite font-mono">
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>

            {filterRating !== null && (
              <button
                onClick={() => setFilterRating(null)}
                className="mt-3 text-xs text-botanical-700 hover:underline font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear {filterRating}-star filter
              </button>
            )}
          </div>

          {/* Amazon-style "Review this product" Box */}
          <div className="bg-[#FAF8F5] p-6 sm:p-7 rounded-3xl border border-[#EBE4D8] space-y-3.5">
            <h3 className="font-display font-bold text-base text-graphite">
              Review this product
            </h3>
            <p className="text-xs text-graphite/70 leading-relaxed">
              Share your cleaning results, stain removal photos, videos, and experience
              with fellow homeowners.
            </p>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  setTimeout(() => {
                    document
                      .getElementById('write-review-form')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="w-full py-3 px-5 rounded-2xl bg-white border border-neutral-300 text-graphite font-semibold text-xs hover:bg-neutral-50 hover:border-graphite shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-botanical-600" />
              {showForm ? 'Close Review Form' : 'Write a customer review'}
            </button>
          </div>
        </div>

        {/* Right Column: Filters & Reviews List (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive Review Form with Photo & Video Upload */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                id="write-review-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-botanical-500/40 shadow-lg shadow-black/[0.03] space-y-5"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <h3 className="font-display text-heading-sm text-graphite">
                        Create Review for {productTitle}
                      </h3>
                      <p className="text-xs text-graphite/60 mt-0.5">
                        Your review will help other customers make an informed choice.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="p-1 rounded-full text-graphite/40 hover:text-graphite hover:bg-neutral-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Star Rating Picker */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-graphite/70 mb-2">
                      Overall Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const activeVal = hoverRating || rating;
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={cn(
                                'w-8 h-8 transition-colors',
                                star <= activeVal
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'fill-transparent text-neutral-300'
                              )}
                            />
                          </button>
                        );
                      })}
                      <span className="ml-3 text-xs font-semibold text-graphite/70">
                        {ratingLabels[hoverRating || rating]}
                      </span>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-graphite/70 mb-1.5">
                      Your Name or Public Nickname <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-botanical-500 focus:ring-2 focus:ring-botanical-500/20 outline-none"
                    />
                  </div>

                  {/* Review Headline */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-graphite/70 mb-1.5">
                      Add a Headline (Summary)
                    </label>
                    <input
                      type="text"
                      placeholder="What's most important to know? e.g. Sparkling clean taps in 3 minutes!"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-botanical-500 focus:ring-2 focus:ring-botanical-500/20 outline-none"
                    />
                  </div>

                  {/* Review Comments */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-graphite/70 mb-1.5">
                      Write Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="What did you like or dislike? How did you use this product on limescale, brass, or grease?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-botanical-500 focus:ring-2 focus:ring-botanical-500/20 outline-none"
                    />
                  </div>

                  {/* Photo & Video Upload Area (Amazon/Flipkart style) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-graphite/70 mb-1.5">
                      Add Photos or Video (Optional)
                    </label>
                    <p className="text-xs text-graphite/50 mb-2.5">
                      Show your cleaning results, before &amp; after surfaces, or foam spray in action.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-300 hover:border-botanical-500 bg-neutral-50/60 hover:bg-neutral-50 text-graphite text-xs font-medium cursor-pointer transition-all">
                        <Camera className="w-4 h-4 text-botanical-600" />
                        <span>Upload Photos / Video</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleMediaSelect}
                          className="hidden"
                          disabled={isUploadingMedia}
                        />
                      </label>

                      {isUploadingMedia && (
                        <div className="flex items-center gap-1.5 text-xs text-botanical-600 font-medium">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing media...</span>
                        </div>
                      )}

                      <span className="text-xs text-graphite/40">
                        Max 5 files (JPG, PNG, MP4, WebM up to 15MB)
                      </span>
                    </div>

                    {/* Previews of attached media */}
                    {attachedMedia.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3 pt-2">
                        {attachedMedia.map((media, idx) => (
                          <div
                            key={idx}
                            className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-xs group/thumb"
                          >
                            {media.type === 'video' ? (
                              <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-1 relative">
                                <video
                                  src={media.url}
                                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                                />
                                <Play className="w-4 h-4 fill-white relative z-10" />
                                <span className="text-[9px] font-bold mt-0.5 relative z-10">
                                  Video
                                </span>
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
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center z-20 shadow-xs cursor-pointer"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Feedback Alert */}
                  {submitMessage && (
                    <div
                      className={cn(
                        'p-3.5 rounded-xl text-xs font-medium flex items-center gap-2',
                        submitMessage.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      )}
                    >
                      {submitMessage.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                      <span>{submitMessage.text}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-graphite hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploadingMedia}
                      className="px-6 py-2.5 rounded-xl bg-botanical-600 text-white text-xs font-semibold hover:bg-botanical-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      Submit Review
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Bar (Flipkart / Amazon style) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs">
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-graphite/70 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>

              <button
                onClick={() => {
                  setFilterRating(null);
                  setFilterVerifiedOnly(false);
                  setFilterWithMediaOnly(false);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                  filterRating === null && !filterVerifiedOnly && !filterWithMediaOnly
                    ? 'bg-white text-graphite shadow-sm border border-neutral-300 font-semibold'
                    : 'text-graphite/60 hover:text-graphite'
                )}
              >
                All ({reviews.length})
              </button>

              <button
                onClick={() =>
                  setFilterRating(filterRating === 5 ? null : 5)
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1',
                  filterRating === 5
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                    : 'text-graphite/60 hover:text-graphite'
                )}
              >
                <span>5 ★</span>
                <span className="text-graphite/40">({ratingCounts[5] || 0})</span>
              </button>

              <button
                onClick={() =>
                  setFilterRating(filterRating === 4 ? null : 4)
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1',
                  filterRating === 4
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                    : 'text-graphite/60 hover:text-graphite'
                )}
              >
                <span>4 ★</span>
                <span className="text-graphite/40">({ratingCounts[4] || 0})</span>
              </button>

              <button
                onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1',
                  filterVerifiedOnly
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                    : 'text-graphite/60 hover:text-graphite'
                )}
              >
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Verified Purchases ({verifiedCount})</span>
              </button>

              {reviewsWithMediaCount > 0 && (
                <button
                  onClick={() => setFilterWithMediaOnly(!filterWithMediaOnly)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1',
                    filterWithMediaOnly
                      ? 'bg-botanical-100 text-botanical-900 border border-botanical-300 font-semibold'
                      : 'text-graphite/60 hover:text-graphite'
                  )}
                >
                  <Camera className="w-3 h-3 text-botanical-700" />
                  <span>With Photos / Videos ({reviewsWithMediaCount})</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-graphite/60 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-xs text-graphite font-medium outline-none focus:border-botanical-500 cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          {/* Customer Reviews List (Amazon & Flipkart Card Design) */}
          <div className="space-y-6">
            {filteredReviews.map((review) => {
              const author = review.authorName?.trim() || 'Verified Customer';
              const initial = author.charAt(0).toUpperCase() || 'C';
              const helpfulVotes = (helpfulMap[review.id] || 0) + (review.rating === 5 ? 3 : 1);
              const hasVoted = votedMap[review.id];
              const reviewMedia = parseReviewMedia(review.images);

              const reviewDate = new Date(review.createdAt).toLocaleDateString(
                'en-IN',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              );

              return (
                <div
                  key={review.id}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/80 shadow-sm space-y-3.5 hover:border-neutral-300 transition-colors"
                >
                  {/* Top Line: User Avatar, Name & Location */}
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0',
                        getAvatarColor(author)
                      )}
                    >
                      {initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-graphite">
                          {author}
                        </span>
                        {review.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating & Headline (Amazon style) */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-4 h-4',
                            i <= review.rating
                              ? 'fill-amber-400 text-amber-500'
                              : 'fill-transparent text-neutral-300'
                          )}
                        />
                      ))}
                    </div>

                    <h4 className="font-bold text-sm text-graphite">
                      {review.headline || (review.rating === 5 ? 'Exceptional results' : 'Good product')}
                    </h4>
                  </div>

                  {/* Metadata: Date, Purchase Context */}
                  <div className="text-xs text-graphite/50 flex flex-wrap items-center gap-2">
                    <span>Reviewed in India on {reviewDate}</span>
                    <span>•</span>
                    <span className="text-graphite/70 font-medium">
                      Formula: 500ml Bottle
                    </span>
                  </div>

                  {/* Comment Body */}
                  <p className="text-sm text-graphite/80 leading-relaxed whitespace-pre-line pt-1">
                    {review.comment}
                  </p>

                  {/* Customer Review Photos & Videos Thumbnail Row */}
                  {reviewMedia.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {reviewMedia.map((m, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setActiveMediaList(reviewMedia);
                            setActiveMediaIndex(idx);
                            setActiveReviewMeta({
                              authorName: author,
                              rating: review.rating,
                              headline: review.headline,
                              comment: review.comment,
                              verifiedPurchase: review.verifiedPurchase,
                              date: reviewDate,
                            });
                            setModalOpen(true);
                          }}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-neutral-200 hover:border-botanical-500 hover:shadow-md transition-all group/item cursor-pointer flex-shrink-0 bg-neutral-900"
                        >
                          {m.type === 'video' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-2 text-center relative">
                              <video
                                src={m.url}
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                              />
                              <div className="w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white relative z-10 group-hover/item:scale-110 transition-transform">
                                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                              </div>
                              <span className="text-[9px] font-bold bg-black/80 px-1.5 py-0.5 rounded text-white mt-1 relative z-10">
                                Video
                              </span>
                            </div>
                          ) : (
                            <img
                              src={m.url}
                              alt="Review photo"
                              className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Flipkart / Amazon style Helpful footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleHelpfulClick(review.id)}
                        disabled={hasVoted}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium cursor-pointer',
                          hasVoted
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-neutral-200 text-graphite/70 hover:border-neutral-300 hover:text-graphite shadow-2xs'
                        )}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{hasVoted ? 'Helpful ✓' : 'Helpful'}</span>
                      </button>

                      <span className="text-graphite/50 text-[11px]">
                        {helpfulVotes} {helpfulVotes === 1 ? 'person' : 'people'} found this helpful
                      </span>
                    </div>

                    <button
                      type="button"
                      className="text-graphite/40 hover:text-graphite text-[11px] hover:underline"
                    >
                      Report
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredReviews.length === 0 && (
              <div className="text-center py-14 px-6 bg-white rounded-3xl border border-dashed border-neutral-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
                </div>
                <h4 className="font-display font-bold text-base text-graphite">
                  No reviews match your filter
                </h4>
                <p className="text-xs text-graphite/60 max-w-sm mx-auto">
                  {filterRating !== null
                    ? `There are currently no ${filterRating}-star reviews for this formula.`
                    : 'Be the first verified customer to share your thoughts!'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setFilterRating(null);
                      setFilterVerifiedOnly(false);
                      setFilterWithMediaOnly(false);
                      setShowForm(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-graphite text-white text-xs font-semibold hover:bg-black transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
