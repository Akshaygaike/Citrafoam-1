import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import type { ShippingAddress } from "@/types";
import { generateOrderNumber, shippingCost as calcShipping } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shipping, paymentMethod, couponCode } = body as {
      items: { variantId: string; quantity: number }[];
      shipping: ShippingAddress;
      paymentMethod: "stripe" | "cod";
      couponCode?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItemsData: {
      productVariantId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
    }[] = [];
    const productTitles: string[] = [];

    // Re-fetch and validate from DB
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} not found` },
          { status: 400 }
        );
      }

      if (variant.inventoryCount < item.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock for ${variant.name}. Available: ${variant.inventoryCount}`,
          },
          { status: 400 }
        );
      }

      subtotal += variant.price * item.quantity;
      const title = variant.product?.title || variant.name;
      productTitles.push(title);

      orderItemsData.push({
        productVariantId: variant.id,
        productName: title,
        quantity: item.quantity,
        unitPrice: variant.price,
      });
    }

    // Apply discount
    const discountAmount =
      couponCode === "CITRAFOAM10" ? subtotal * 0.1 : 0;

    // Calculate shipping
    const shippingAmount = calcShipping(subtotal - discountAmount);

    // Total
    const totalAmount = subtotal - discountAmount + shippingAmount;

    const session = await auth();
    let userId = session?.user?.id;
    if (!userId && shipping.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: shipping.email },
        select: { id: true },
      });
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    const orderNumber = generateOrderNumber();

    // Create Order in DB with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement inventory
      for (const item of orderItemsData) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: { inventoryCount: { decrement: item.quantity } },
        });
      }

      return await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          productName: Array.from(new Set(productTitles)).join(", "),
          shippingAddress: JSON.stringify(shipping),
          totalAmount,
          discountAmount,
          paymentStatus: "PENDING",
          fulfillmentStatus: "UNFULFILLED",
          couponCode: couponCode || null,
          guestEmail: shipping.email,
          items: {
            create: orderItemsData,
          },
        },
      });
    });

    if (paymentMethod === "stripe") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // convert to paise
        currency: "inr",
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
      });

      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientSecret: paymentIntent.client_secret,
        totalAmount,
      });
    } else {
      // COD — mark as pending
      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount,
      });
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Checkout error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
