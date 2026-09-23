import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseJsonSafe } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Synonym map for intelligent search matching
const KEYWORD_MAP: Record<string, string[]> = {
  'tap-cleaner-limescale-remover': [
    'tap', 'limescale', 'scale', 'faucet', 'bathroom', 'shower', 'chrome', 
    'calcium', 'hard water', 'hardwater', 'stain', 'water spot', 'sink', 
    'tiles', 'fitting', 'sanitary', 'salt', 'white stain', 'grout'
  ],
  'copper-brass-bronze-cleaner': [
    'copper', 'brass', 'bronze', 'metal', 'tarnish', 'oxidation', 'pooja', 
    'puja', 'utensil', 'bartan', 'vessel', 'shine', 'idol', 'brassware', 
    'copperware', 'cookware', 'patina', 'blackening'
  ],
  'kitchen-cleaner': [
    'kitchen', 'grease', 'oil', 'degreaser', 'chimney', 'stove', 'gas', 
    'cooktop', 'counter', 'countertop', 'exhaust', 'hob', 'fat', 'food stain', 
    'microwave', 'oven', 'grill', 'fryer'
  ],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().toLowerCase() || '';

    // Fetch all active products
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: { isFeatured: 'desc' },
    });

    if (!query) {
      // If query is empty, return featured products or first 4
      const formatted = products.map((p) => {
        const images = parseJsonSafe<string[]>(p.images, []);
        const defaultVariant = p.variants[0];
        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle,
          category: p.category,
          price: defaultVariant?.price || 0,
          compareAtPrice: defaultVariant?.compareAtPrice || null,
          image: images[0] || `/images/products/${p.slug}.jpg`,
        };
      });
      return NextResponse.json({ products: formatted });
    }

    const queryTerms = query.split(/\s+/).filter(Boolean);

    const matchedProducts = products.filter((product) => {
      const titleLower = product.title.toLowerCase();
      const descLower = product.description.toLowerCase();
      const catLower = product.category.toLowerCase();
      const subtitleLower = (product.subtitle || '').toLowerCase();
      const ingredientsLower = (product.ingredients || '').toLowerCase();
      const synonymList = KEYWORD_MAP[product.slug] || [];

      // Check if any query term matches fields or synonyms
      return queryTerms.some((term) => {
        return (
          titleLower.includes(term) ||
          descLower.includes(term) ||
          catLower.includes(term) ||
          subtitleLower.includes(term) ||
          ingredientsLower.includes(term) ||
          synonymList.some((syn) => syn.includes(term) || term.includes(syn))
        );
      });
    });

    const formatted = matchedProducts.map((p) => {
      const images = parseJsonSafe<string[]>(p.images, []);
      const defaultVariant = p.variants[0];
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        category: p.category,
        price: defaultVariant?.price || 0,
        compareAtPrice: defaultVariant?.compareAtPrice || null,
        image: images[0] || `/images/products/${p.slug}.jpg`,
      };
    });

    return NextResponse.json({ products: formatted, count: formatted.length });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
