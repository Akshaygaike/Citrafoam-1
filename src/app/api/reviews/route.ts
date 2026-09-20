import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PROFANITY_LIST = ['badword1', 'badword2', 'ugly'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 })
  }

  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit
  })

  return NextResponse.json(reviews)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, rating, headline, comment, authorName, verifiedPurchase, userId } = body

    if (!productId || !rating || !comment || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const isProfane = PROFANITY_LIST.some(word => 
      comment.toLowerCase().includes(word) || 
      (headline && headline.toLowerCase().includes(word))
    );

    const review = await prisma.review.create({
      data: {
        productId,
        rating: Number(rating),
        headline: headline || null,
        comment,
        authorName,
        userId: userId || null,
        verifiedPurchase: verifiedPurchase !== undefined ? Boolean(verifiedPurchase) : true,
        isApproved: !isProfane
      }
    })

    return NextResponse.json(review)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
