export const siteConfig = {
  name: "Citrafoam",
  tagline: "The Precision of Chemistry. The Purity of Nature.",
  description:
    "Premium, lab-tested citric acid-powered foam cleaners. Natural, effective, and sustainable home care.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/og-image.jpg",
  creator: "Citrafoam Labs",
  keywords: [
    "citric acid cleaner",
    "natural cleaner",
    "limescale remover",
    "copper polish",
    "brass polish",
    "eco-friendly cleaner",
    "foam cleaner",
    "biodegradable cleaner",
    "home care",
    "Citrafoam",
  ],
  links: {
    instagram: "https://www.instagram.com/citrafoam.co?stkn=MTJubGd4YjZ2czd5aA%3D%3D",
  },
};

export const navLinks = [
  { label: "Shop", href: "/products" },
  { label: "Our Science", href: "/#science" },
  { label: "Order History", href: "/account/orders" },
  { label: "Track Order", href: "/track" },
] as const;

export const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Tap Cleaner & Limescale Remover", href: "/products/tap-cleaner-limescale-remover" },
    { label: "Copper, Brass & Bronze Cleaner", href: "/products/copper-brass-bronze-cleaner" },
    { label: "Kitchen Cleaner", href: "/products/kitchen-cleaner" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Ingredients", href: "/#science" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Track Order", href: "/track" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const productCategories = [
  { label: "All", value: "all" },
  { label: "Bathroom", value: "Bathroom" },
  { label: "Kitchen", value: "Kitchen" },
  { label: "Metal Care", value: "Metal Care" },
] as const;

export const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "text-amber-600 bg-amber-50" },
  PAID: { label: "Paid", color: "text-emerald-600 bg-emerald-50" },
  FAILED: { label: "Failed", color: "text-red-600 bg-red-50" },
  REFUNDED: { label: "Refunded", color: "text-blue-600 bg-blue-50" },
};

export const fulfillmentStatusLabels: Record<string, { label: string; color: string }> = {
  UNFULFILLED: { label: "Processing", color: "text-gray-600 bg-gray-50" },
  PROCESSING: { label: "Packing", color: "text-amber-600 bg-amber-50" },
  SHIPPED: { label: "Shipped", color: "text-blue-600 bg-blue-50" },
  DELIVERED: { label: "Delivered", color: "text-emerald-600 bg-emerald-50" },
  CANCELLED: { label: "Cancelled", color: "text-red-600 bg-red-50" },
};
