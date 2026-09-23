import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductWithVariants } from '@/types';
import ProductGallery from '@/components/modules/pdp/ProductGallery';
import ProductInfo from '@/components/modules/pdp/ProductInfo';
import HowItWorks from '@/components/modules/pdp/HowItWorks';
import ProductReviews from '@/components/modules/pdp/ProductReviews';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  let product = await prisma.product.findUnique({
    where: { slug: params.slug }
  });

  if (!product && (params.slug === 'heavy-duty-limescale-eliminator' || params.slug === 'tap-cleaner-limescale-remover')) {
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: 'tap-cleaner-limescale-remover' },
          { slug: 'heavy-duty-limescale-eliminator' }
        ]
      }
    });
  }

  if (!product && (params.slug === 'copper-brass-brilliant-polish' || params.slug === 'copper-brass-bronze-cleaner')) {
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: 'copper-brass-bronze-cleaner' },
          { slug: 'copper-brass-brilliant-polish' }
        ]
      }
    });
  }

  if (!product && (params.slug === 'all-surface-kitchen-degreaser' || params.slug === 'kitchen-cleaner')) {
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: 'kitchen-cleaner' },
          { slug: 'all-surface-kitchen-degreaser' }
        ]
      }
    });
  }

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.title} | Citrafoam`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.substring(0, 160),
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const reviewsInclude = {
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' as const },
  };

  let product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      variants: true,
      reviews: reviewsInclude,
    }
  }) as unknown as ProductWithVariants | null;

  if (!product && (params.slug === 'heavy-duty-limescale-eliminator' || params.slug === 'tap-cleaner-limescale-remover')) {
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: 'tap-cleaner-limescale-remover' },
          { slug: 'heavy-duty-limescale-eliminator' }
        ]
      },
      include: {
        variants: true,
        reviews: reviewsInclude,
      }
    }) as unknown as ProductWithVariants | null;
  }

  if (!product && (params.slug === 'copper-brass-brilliant-polish' || params.slug === 'copper-brass-bronze-cleaner')) {
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: 'copper-brass-bronze-cleaner' },
          { slug: 'copper-brass-brilliant-polish' }
        ]
      },
      include: {
        variants: true,
        reviews: reviewsInclude,
      }
    }) as unknown as ProductWithVariants | null;
  }

  if (!product && (params.slug === 'all-surface-kitchen-degreaser' || params.slug === 'kitchen-cleaner')) {
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: 'kitchen-cleaner' },
          { slug: 'all-surface-kitchen-degreaser' }
        ]
      },
      include: {
        variants: true,
        reviews: reviewsInclude,
      }
    }) as unknown as ProductWithVariants | null;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container-wide pt-28 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        <div className="relative">
          <ProductGallery product={product} />
        </div>
        <div>
          <ProductInfo product={product} />
        </div>
      </div>
      
      <div className="mb-20">
        <HowItWorks />
      </div>

      <div id="customer-reviews">
        <ProductReviews
          productId={product.id}
          productTitle={product.title}
          reviews={product.reviews}
        />
      </div>
    </div>
  );
}
