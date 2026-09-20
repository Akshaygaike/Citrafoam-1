import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    let product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        variants: true,
        reviews: true,
      }
    })

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
          reviews: true,
        }
      })
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
          reviews: true,
        }
      })
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
          reviews: true,
        }
      })
    }

    if (!product) {
      return new NextResponse(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
