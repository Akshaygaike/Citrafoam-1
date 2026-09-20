"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import type { ReviewData } from "@/types";
import { averageRating, cn } from "@/lib/utils";

interface ReviewsSectionProps {
  reviews: ReviewData[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  const avg = averageRating(reviews.map((r) => r.rating));
  const total = reviews.length;

  const counts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <section id="reviews" className="section-padding bg-porcelain border-b border-neutral-200/60">
      <div className="container-wide">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#C88A58]/30 shadow-sm text-xs font-semibold text-[#111827] tracking-wide mb-3">
            Real Verified Experience
          </span>
          <h2 className="font-display text-display-sm text-graphite">
            Trusted by Thousands
          </h2>
        </div>

        {/* Stats Bar */}
        <div className="max-w-3xl mx-auto mb-16 bg-white rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-neutral-200/80">
          <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/3">
            <div className="text-5xl font-display font-bold text-graphite mb-2">
              {avg.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    i < Math.round(avg)
                      ? "text-[#C88A58] fill-[#C88A58]"
                      : "text-neutral-200"
                  )}
                />
              ))}
            </div>
            <div className="text-xs text-graphite/60 font-medium">
              Based on {total} verified reviews
            </div>
          </div>

          <div className="w-full md:w-2/3 flex flex-col gap-2">
            {counts.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 w-12 text-graphite/80 font-medium text-xs">
                  {rating}{" "}
                  <Star className="w-3 h-3 text-[#C88A58] fill-[#C88A58]" />
                </div>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C88A58] rounded-full transition-all duration-500"
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                  />
                </div>
                <div className="w-8 text-right text-graphite/50 text-xs">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="break-inside-avoid bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/80 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "w-4 h-4",
                      index < review.rating
                        ? "text-[#C88A58] fill-[#C88A58]"
                        : "text-neutral-200"
                    )}
                  />
                ))}
              </div>

              {review.headline && (
                <h4 className="font-display font-bold text-graphite mb-2">
                  {review.headline}
                </h4>
              )}

              <p className="text-body-sm text-graphite/80 mb-6 leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold text-xs text-graphite">
                  {review.authorName || "Anonymous"}
                </div>
                {review.verifiedPurchase && (
                  <div className="flex items-center gap-1 text-[#15803D] font-semibold text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Purchase
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
