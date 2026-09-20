export interface ProductWithVariants {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  ingredients: string | null;
  usageInstructions: string | null;
  category: string;
  isFeatured: boolean;
  images: string;
  variants: ProductVariant[];
  reviews: ReviewData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  inventoryCount: number;
}

export interface ReviewData {
  id: string;
  productId: string;
  userId: string | null;
  rating: number;
  headline: string | null;
  comment: string;
  images: string | null;
  verifiedPurchase: boolean;
  isApproved: boolean;
  authorName: string | null;
  createdAt: Date;
}

export interface CartItem {
  variantId: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  variantName: string;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  image: string;
  maxQuantity: number;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  productName?: string | null;
  totalAmount: number;
  discountAmount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
  couponCode: string | null;
  createdAt: Date;
  items: OrderItemData[];
}

export interface OrderItemData {
  id: string;
  productName?: string | null;
  quantity: number;
  unitPrice: number;
  productVariant: {
    name: string;
    sku: string;
    product: {
      title: string;
      slug: string;
      images: string;
    };
  };
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CheckoutFormData {
  shipping: ShippingAddress;
  paymentMethod: "stripe" | "cod";
  couponCode?: string;
}
