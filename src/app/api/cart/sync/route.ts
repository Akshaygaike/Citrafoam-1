import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items format" },
        { status: 400 }
      );
    }

    const validItems = [];
    const invalidItems = [];
    const warnings: string[] = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        invalidItems.push(item);
        warnings.push(`Variant ${item.variantId} no longer exists.`);
        continue;
      }

      if (variant.inventoryCount < item.quantity) {
        warnings.push(
          `Insufficient inventory for ${variant.name}. Only ${variant.inventoryCount} available.`
        );
        if (variant.inventoryCount > 0) {
          validItems.push({
            ...item,
            quantity: variant.inventoryCount,
            price: variant.price,
          });
        } else {
          invalidItems.push(item);
        }
        continue;
      }

      validItems.push({
        ...item,
        price: variant.price, // Return current price to prevent tampering
      });
    }

    return NextResponse.json({ validItems, invalidItems, warnings });
  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
