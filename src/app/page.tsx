import { prisma } from "@/lib/prisma";
import type { ProductWithVariants } from "@/types";

import HeroSection from "@/components/modules/hero/HeroSection";
import FoamEngine from "@/components/modules/foam-engine/FoamEngine";
import ProductShowcase from "@/components/modules/product-grid/ProductShowcase";
import ScienceSection from "@/components/modules/science/ScienceSection";

export const metadata = {
  title: "Citrafoam | Precision Citric Acid Cleaners",
  description:
    "Premium citric acid-powered foam cleaners that dissolve limescale, restore copper & brass, and leave every surface sparkling.",
};

export default async function HomePage() {
  // Fetch featured products with variants
  const dbProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      variants: true,
      reviews: {
        where: { isApproved: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  // Map to typed products
  const products: ProductWithVariants[] = dbProducts.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
    })),
    reviews: p.reviews.map((r) => ({
      ...r,
      rating: Number(r.rating),
    })),
  }));

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FoamEngine />
      <ProductShowcase products={products} />
      <ScienceSection />
    </div>
  );
}
