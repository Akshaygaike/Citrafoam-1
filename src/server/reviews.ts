'use server'

import { prisma } from '@/lib/prisma'

const PROFANITY_LIST = ['badword1', 'badword2', 'ugly', 'scam'];

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: {
      productId,
      isApproved: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createReview(data: { productId: string, rating: number, headline?: string, comment: string, authorName: string }) {
  const isProfane = PROFANITY_LIST.some(word => 
    data.comment.toLowerCase().includes(word) || 
    (data.headline && data.headline.toLowerCase().includes(word))
  );

  return prisma.review.create({
    data: {
      ...data,
      isApproved: !isProfane
    }
  })
}

export async function getReviewStats(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    select: { rating: true }
  });

  const total = reviews.length;
  if (total === 0) {
    return { average: 0, total: 0, distribution: {1:0, 2:0, 3:0, 4:0, 5:0} };
  }

  const distribution = {1:0, 2:0, 3:0, 4:0, 5:0};
  let sum = 0;

  reviews.forEach(r => {
    distribution[r.rating as keyof typeof distribution]++;
    sum += r.rating;
  });

  return {
    average: Number((sum / total).toFixed(1)),
    total,
    distribution
  };
}
