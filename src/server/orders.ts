"use server";

import { prisma } from "@/lib/prisma";
import type { ShippingAddress } from "@/types";
import { generateOrderNumber, shippingCost } from "@/lib/utils";

export async function createOrder(data: {
  items: { variantId: string; quantity: number }[];
  shipping: ShippingAddress;
  paymentMethod: string;
  couponCode?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const orderItemsData: {
      productVariantId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
    }[] = [];
    const productTitles: string[] = [];

    // Validate all items and compute subtotal
    for (const item of data.items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found`);
      }
      if (variant.inventoryCount < item.quantity) {
        throw new Error(
          `Insufficient stock for ${variant.name}. Available: ${variant.inventoryCount}`
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

      // Decrement inventory
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { inventoryCount: { decrement: item.quantity } },
      });
    }

    // Calculate discount
    const discountAmount =
      data.couponCode === "CITRAFOAM10" ? subtotal * 0.1 : 0;

    // Calculate shipping
    const shipping = shippingCost(subtotal - discountAmount);

    // Calculate total
    const totalAmount = subtotal - discountAmount + shipping;

    // Create order with items
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        productName: Array.from(new Set(productTitles)).join(", "),
        shippingAddress: JSON.stringify(data.shipping),
        totalAmount,
        discountAmount,
        paymentStatus: "PENDING",
        fulfillmentStatus: "UNFULFILLED",
        couponCode: data.couponCode || null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
      },
    });

    return order;
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
    },
  });
}

export async function getUserOrders(userIdOrEmail: string) {
  return prisma.order.findMany({
    where: {
      OR: [
        { userId: userIdOrEmail },
        { guestEmail: { equals: userIdOrEmail, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
    },
  });
}

export async function trackOrder(query: string) {
  const clean = query.trim().replace(/^#/, "");
  if (!clean) return null;

  return prisma.order.findFirst({
    where: {
      OR: [
        { orderNumber: { equals: clean, mode: "insensitive" } },
        { trackingNumber: { equals: clean, mode: "insensitive" } },
        { guestEmail: { equals: clean, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
    },
  });
}
