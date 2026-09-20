'use client';

import React, { useState } from 'react';
import { ReviewData } from '@/types';
import { Star, CheckCircle, Edit3, Loader2 } from 'lucide-react';
import { averageRating, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductReviewsProps {
  reviews: ReviewData[];
  productId: string;
}

export default function ProductReviews({ reviews: initialReviews, productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews || []);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const avgRating = averageRating(reviews.map((r) => r.rating));
  const counts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          headline,
          comment,
          authorName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setReviews([
        {
          id: data.id || `rev-${Date.now()}`,
          productId,
          userId: null,
          rating,
          headline,
          comment,
          images: null,
          verifiedPurchase: true,
          isApproved: true,
          authorName,
          createdAt: new Date(),
        },
        ...reviews,
      ]);

      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your verified review has been published.',
      });
      setHeadline('');
      setComment('');
      setAuthorName('');
      setTimeout(() => setShowForm(false), 2500);
    } catch (err: any) {
      setSubmitMessage({
        type: 'error',
        text: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-12 border-t border-graphite/10">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Left Column: Summary */}
        <div className="w-full md:w-1/3">
          <h2 className="font-display text-heading-lg text-graphite mb-6">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-8">
            <div className="text-display-md font-bold text-graphite">{avgRating.toFixed(1)}</div>
            <div className="flex flex-col gap-1">
              <div className="flex text-brass-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i <= Math.round(avgRating) ? "fill-current" : "fill-transparent text-graphite/20"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-graphite/60">Based on {reviews.length} reviews</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-8">
            {counts.map((c) => (
              <div key={c.stars} className="flex items-center gap-3 text-sm">
                <span className="w-14 text-graphite/70 font-medium">{c.stars} Stars</span>
                <div className="flex-1 h-2 rounded-full bg-graphite/10 overflow-hidden">
                  <div
                    className="h-full bg-brass-400 rounded-full transition-all duration-500"
                    style={{ width: `${reviews.length ? (c.count / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-8 text-right text-graphite/50">{c.count}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full py-3.5 rounded-full border-2 border-graphite text-graphite font-medium hover:bg-graphite hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            {showForm ? 'Close Form' : 'Write a Review'}
          </button>
        </div>

        {/* Right Column: Reviews List & Form */}
        <div className="w-full md:w-2/3">
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <form
                  onSubmit={handleSubmit}
                  className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-graphite/10 space-y-4"
                >
                  <h3 className="font-display text-heading-sm">Write Your Review</h3>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-graphite">Rating</label>
                    <div className="flex gap-2 text-graphite/20">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={cn(
                              "w-7 h-7 cursor-pointer transition-colors",
                              star <= rating
                                ? "text-brass-500 fill-brass-500"
                                : "text-graphite/20 hover:text-brass-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-graphite">Your Name</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-graphite/20 focus:border-botanical-500 outline-none text-sm"
                      placeholder="e.g. Dr. Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-graphite">Headline</label>
                    <input
                      type="text"
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-graphite/20 focus:border-botanical-500 outline-none text-sm"
                      placeholder="e.g. Cuts limescale in one wipe!"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-graphite">Review Comments</label>
                    <textarea
                      rows={4}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-graphite/20 focus:border-botanical-500 outline-none text-sm"
                      placeholder="Share details of your experience with Citrafoam..."
                    />
                  </div>

                  {submitMessage && (
                    <div
                      className={cn(
                        "p-3 rounded-xl text-sm font-medium",
                        submitMessage.type === 'success'
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      )}
                    >
                      {submitMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-botanical-600 text-white rounded-full font-medium hover:bg-botanical-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit Review
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          <div className="flex flex-col gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-graphite/10 pb-6 last:border-0">
                <div className="flex items-center gap-1 text-brass-500 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i <= review.rating ? "fill-current" : "fill-transparent text-graphite/20"
                      )}
                    />
                  ))}
                </div>
                {review.headline && (
                  <h4 className="font-bold text-graphite mb-1.5">{review.headline}</h4>
                )}
                <p className="text-graphite/75 text-sm mb-3 leading-relaxed">{review.comment}</p>
                <div className="flex items-center gap-2 text-xs text-graphite/50">
                  <span className="font-medium text-graphite/80">{review.authorName || 'Verified Customer'}</span>
                  <span>•</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  {review.verifiedPurchase && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Verified Buyer
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="text-center py-12 text-graphite/50 bg-stone-50 rounded-2xl">
                No reviews yet. Be the first to review this formula!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
