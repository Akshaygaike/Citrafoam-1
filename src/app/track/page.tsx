import React from 'react';
import Link from 'next/link';
import { trackOrder } from '@/server/orders';
import { prisma } from '@/lib/prisma';
import { formatPrice, parseJsonSafe } from '@/lib/utils';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import OrderReviewAction from '@/components/modules/reviews/OrderReviewAction';

interface TrackPageProps {
  searchParams: { order?: string; q?: string };
}

export const metadata = {
  title: 'Track Your Order | Citrafoam',
  description: 'Live order tracking and delivery status for your Citrafoam natural citric acid cleaners.',
};

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const query = searchParams.order || searchParams.q || '';
  
  // Find order if query provided, else find latest order as a reference
  let order = query ? await trackOrder(query) : null;
  
  // If no specific query was entered, fetch the latest order to offer quick lookup suggestion
  let sampleOrder = null;
  if (!order) {
    sampleOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true, guestEmail: true },
    });
  }

  // Determine timeline progress based on fulfillmentStatus
  const status = order?.fulfillmentStatus || 'UNFULFILLED';
  const isDelivered = status === 'DELIVERED';
  const isShipped = status === 'SHIPPED' || isDelivered;
  const isProcessing = status === 'PROCESSING' || isShipped;

  const trackingId = order?.trackingNumber || (order ? `BLR-CF-${order.orderNumber.replace('CF-', '')}` : '');

  return (
    <div className="bg-porcelain min-h-screen pt-28 pb-20">
      <div className="container-tight px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-3 shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#00AA55]" />
            Live Dispatch &amp; Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-graphite tracking-tight">
            Track Your Order
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Enter your order reference number (e.g. <strong className="text-graphite">CF-2024-XXXX</strong>) or email address to view live dispatch and delivery updates.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <form action="/track" method="GET" className="relative flex items-center">
            <input
              type="text"
              name="order"
              defaultValue={query}
              placeholder="Enter Order ID (e.g. CF-2024-1234) or Email..."
              className="w-full pl-12 pr-28 py-4 bg-white border border-neutral-200 rounded-2xl shadow-sm text-sm text-graphite placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00AA55]/30 focus:border-[#00AA55] transition-all"
              required
            />
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Track
            </button>
          </form>

          {sampleOrder && !query && (
            <div className="mt-3 text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
              <span>Try tracking recent order:</span>
              <Link
                href={`/track?order=${sampleOrder.orderNumber}`}
                className="text-[#00AA55] font-semibold hover:underline"
              >
                #{sampleOrder.orderNumber}
              </Link>
            </div>
          )}
        </div>

        {/* If query was submitted but no order found */}
        {query && !order && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
              <AlertCircle className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="text-xl font-display font-semibold text-graphite mb-1">
              No Order Found for &ldquo;{query}&rdquo;
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              Please verify your order reference number (from your checkout confirmation or email) or try searching with your email address.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/track"
                className="px-5 py-2.5 bg-neutral-100 text-neutral-700 rounded-full text-xs font-semibold hover:bg-neutral-200 transition-colors"
              >
                Clear Search
              </Link>
              <Link
                href="/account/orders"
                className="px-5 py-2.5 bg-[#111827] text-white rounded-full text-xs font-semibold hover:bg-black transition-colors"
              >
                View Order History
              </Link>
            </div>
          </div>
        )}

        {/* Order Details & Tracking Timeline */}
        {order && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Status Summary Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-100 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Order Reference
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Verified Purchase
                    </span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-graphite">
                    #{order.orderNumber}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00AA55] animate-pulse" />
                    <span>Payment: {order.paymentStatus}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/60">
                    Status: {order.fulfillmentStatus}
                  </div>
                </div>
              </div>

              {/* Live Tracking Visual Stepper */}
              <div className="pt-8 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">
                  Live Fulfillment Progress
                </p>

                <div className="grid grid-cols-4 relative gap-2">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-1 bg-neutral-100 -z-0">
                    <div
                      className="h-full bg-[#00AA55] transition-all duration-700"
                      style={{
                        width: isDelivered ? '100%' : isShipped ? '66%' : isProcessing ? '33%' : '15%',
                      }}
                    />
                  </div>

                  {/* Step 1: Confirmed */}
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#00AA55] text-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-graphite mt-2">Placed</span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Step 2: Formulation QC */}
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        isProcessing
                          ? 'bg-[#00AA55] text-white'
                          : 'bg-white border-2 border-neutral-300 text-neutral-400'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-graphite mt-2">Bottled &amp; QC</span>
                    <span className="text-[10px] text-neutral-400">500ml Precision</span>
                  </div>

                  {/* Step 3: Dispatched */}
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        isShipped
                          ? 'bg-[#00AA55] text-white'
                          : 'bg-white border-2 border-neutral-300 text-neutral-400'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-graphite mt-2">Dispatched</span>
                    <span className="text-[10px] text-neutral-400">Express Transit</span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        isDelivered
                          ? 'bg-[#00AA55] text-white'
                          : 'bg-white border-2 border-neutral-300 text-neutral-400'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-graphite mt-2">Delivered</span>
                    <span className="text-[10px] text-neutral-400">Doorstep</span>
                  </div>
                </div>
              </div>

              {/* Courier Banner */}
              <div className="mt-8 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Truck className="w-4 h-4 text-[#00AA55]" />
                  <span>
                    Express Courier AWB:{' '}
                    <strong className="font-mono text-graphite">{trackingId}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Inspected &amp; Handled with Cold-Chain Safety</span>
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-sm">
              <h3 className="font-display font-bold text-lg text-graphite mb-4">
                Ordered Formulas ({order.items.length})
              </h3>

              <div className="divide-y divide-neutral-100">
                {order.items.map((item) => {
                  const productImages = parseJsonSafe<string[]>(
                    item.productVariant?.product?.images,
                    []
                  );
                  const imageSrc =
                    productImages[0] ||
                    `/images/products/${item.productVariant?.product?.slug || 'tap-cleaner-limescale-remover'}.jpg`;

                  return (
                    <div key={item.id} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-100 p-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageSrc}
                          alt={item.productVariant?.product?.title || 'Citrafoam Formula'}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-graphite text-sm truncate">
                          {item.productVariant?.product?.title || item.productName || 'Citrafoam Formula'}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {item.productVariant?.name || '500ml Bottle'} • Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-graphite">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                        {item.productVariant?.product?.id && (
                          <OrderReviewAction
                            productId={item.productVariant.product.id}
                            productTitle={item.productVariant.product.title}
                            productImage={imageSrc}
                            authorDefaultName={order.guestEmail?.split('@')[0] || ''}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing breakdown */}
              <div className="mt-6 pt-4 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.totalAmount + order.discountAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#00AA55] font-medium">
                    <span>Discount Applied</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Express Shipping</span>
                  <span className="text-[#00AA55] font-medium">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-100 text-sm font-bold text-graphite">
                  <span>Total Billed</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            {order.shippingAddress && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-sm">
                <h3 className="font-display font-bold text-lg text-graphite mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00AA55]" />
                  Shipping Destination
                </h3>
                {(() => {
                  const addr = parseJsonSafe<{
                    name?: string;
                    line1?: string;
                    line2?: string;
                    city?: string;
                    state?: string;
                    zip?: string;
                    phone?: string;
                    email?: string;
                  }>(order.shippingAddress, {});

                  return (
                    <div className="text-xs text-neutral-600 leading-relaxed">
                      {addr.name && <p className="font-bold text-graphite text-sm mb-1">{addr.name}</p>}
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>
                        {addr.city}, {addr.state} — {addr.zip}
                      </p>
                      {addr.phone && <p className="mt-1 text-neutral-400">Phone: {addr.phone}</p>}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Back to Shopping or Order History */}
            <div className="flex justify-center gap-4 pt-4">
              <Link
                href="/account/orders"
                className="px-6 py-3 bg-white border border-neutral-200 text-neutral-800 rounded-full font-medium hover:bg-neutral-50 transition-colors text-xs shadow-xs"
              >
                View All Orders
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 bg-[#111827] text-white rounded-full font-medium hover:bg-black transition-colors text-xs shadow-sm flex items-center gap-1.5"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
