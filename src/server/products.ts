"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts(category?: string) {
  const where = category && category !== "all" ? { category } : {};
  return prisma.product.findMany({
    where,
    include: {
      variants: true,
      reviews: {
        where: { isApproved: true },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      variants: true,
      reviews: {
        where: { isApproved: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRelatedProducts(
  productId: string,
  category: string
) {
  return prisma.product.findMany({
    where: {
      category,
      id: { not: productId },
    },
    take: 4,
    include: {
      variants: true,
      reviews: {
        where: { isApproved: true },
      },
    },
  });
}
