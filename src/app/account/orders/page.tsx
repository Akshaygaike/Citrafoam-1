import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatPrice, parseJsonSafe } from '@/lib/utils';
import { paymentStatusLabels, fulfillmentStatusLabels } from '@/lib/constants';
import { Package, ArrowLeft, Truck, Clock, Search, ArrowRight, MapPin, UserCheck, ShieldCheck } from 'lucide-react';
import OrderReviewAction from '@/components/modules/reviews/OrderReviewAction';

interface OrdersPageProps {
  searchParams?: { email?: string; q?: string; order?: string };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await auth();

  // If customer is not signed in, redirect to login with return callback
  if (!session?.user) {
    redirect('/account/login?callbackUrl=/account/orders');
  }

  const currentUser = session.user;
  const userEmail = currentUser.email?.toLowerCase().trim();
  const userId = currentUser.id;

  // Resolve user ID in database
  let dbUserId = userId;
  if (!dbUserId && userEmail) {
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });
    if (dbUser) dbUserId = dbUser.id;
  }

  // Base query: Strictly orders belonging to this signed-in account
  const accountCondition: any = {
    OR: [
      ...(dbUserId ? [{ userId: dbUserId }] : []),
      ...(userEmail ? [
        { guestEmail: { equals: userEmail, mode: 'insensitive' as const } },
        { user: { email: { equals: userEmail, mode: 'insensitive' as const } } },
      ] : []),
    ],
  };

  const search = (searchParams?.q || searchParams?.order || '').trim();

  let whereClause: any = accountCondition;

  if (search) {
    const clean = search.replace(/^#/, '');
    whereClause = {
      AND: [
        accountCondition,
        {
          OR: [
            { orderNumber: { contains: clean, mode: 'insensitive' as const } },
            { trackingNumber: { contains: clean, mode: 'insensitive' as const } },
            { productName: { contains: clean, mode: 'insensitive' as const } },
          ],
        },
      ],
    };
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
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

  return (
    <div className="container-tight py-12 min-h-screen">
      {/* Header & Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-botanical inline-flex items-center gap-1.5 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-[#00AA55]" />
              Signed In: {currentUser.email}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-graphite">Your Recent Orders</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Review your purchase history, live tracking details, and verified reviews for {currentUser.name || currentUser.email}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/track"
            className="text-xs font-semibold text-neutral-600 hover:text-graphite px-3 py-2 rounded-xl border border-neutral-200 bg-white shadow-xs transition-colors"
          >
            Track by Reference #
          </Link>
          <Link
            href="/account"
            className="text-sm font-medium text-botanical-600 hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Account Overview
          </Link>
        </div>
      </div>

      {/* Account Info Card & Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00AA55] flex items-center justify-center font-bold font-display text-sm border border-emerald-100">
            {(currentUser.name || currentUser.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-graphite text-sm">
                {currentUser.name || 'Citrafoam Customer'}
              </p>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">{currentUser.email}</p>
          </div>
        </div>

        {/* Filter within account orders */}
        <div className="w-full md:w-80">
          <form action="/account/orders" method="GET" className="relative flex items-center">
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Search your orders (#CF, formula)..."
              className="w-full pl-9 pr-20 py-2 bg-stone-50 border border-neutral-200 rounded-xl text-xs text-graphite placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00AA55]/30 focus:border-[#00AA55]"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-[#111827] hover:bg-black text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center border border-white/50 shadow-subtle bg-white">
          <div className="w-16 h-16 bg-botanical-50 text-botanical-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-semibold mb-2">No orders recorded yet</h2>
          <p className="text-graphite/60 mb-6 max-w-sm mx-auto text-sm">
            {search
              ? `No orders matching "${search}" were found under ${currentUser.email}.`
              : `You haven't placed any orders yet under ${currentUser.email}. Experience the precision of natural citric acid micro-foam cleaners for your home.`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-botanical-600 text-white rounded-full font-medium hover:bg-botanical-700 transition-colors shadow-sm text-sm"
            >
              Start Shopping
            </Link>
            <Link
              href="/track"
              className="px-6 py-3.5 bg-neutral-100 text-neutral-700 rounded-full font-medium hover:bg-neutral-200 transition-colors text-sm"
            >
              Track a Guest Order
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Showing {orders.length} Recent Order{orders.length === 1 ? '' : 's'}
            </p>
          </div>

          {orders.map((order) => {
            const payStatus = paymentStatusLabels[order.paymentStatus] || {
              label: order.paymentStatus,
              color: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
            };
            const fulStatus = fulfillmentStatusLabels[order.fulfillmentStatus] || {
              label: order.fulfillmentStatus,
              color: 'bg-blue-50 text-blue-800 border border-blue-200',
            };

            return (
              <div
                key={order.id}
                className="glass p-6 md:p-8 rounded-3xl border border-graphite/10 shadow-subtle bg-white transition-all hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-6 border-b border-graphite/10 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-graphite/50 mb-1">
                      Order Reference
                    </p>
                    <Link
                      href={`/track?order=${order.orderNumber}`}
                      className="font-bold text-graphite text-base hover:text-[#00AA55] transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span>#{order.orderNumber}</span>
                      <span className="text-xs text-[#00AA55] font-normal group-hover:underline">Track Live →</span>
                    </Link>
                    {order.productName && (
                      <p className="text-xs text-neutral-600 mt-1 font-medium max-w-sm truncate">
                        {order.productName}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-graphite/50 mb-1">
                      Placed On
                    </p>
                    <p className="font-medium text-graphite text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-graphite/50 mb-1">
                      Total Billed
                    </p>
                    <p className="font-display font-bold text-graphite text-base">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payStatus.color}`}>
                      {payStatus.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fulStatus.color}`}>
                      {fulStatus.label}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const productImages = parseJsonSafe<string[]>(
                      item.productVariant?.product?.images,
                      []
                    );
                    const imageSrc =
                      productImages[0] ||
                      `/images/products/${item.productVariant?.product?.slug || 'tap-cleaner-limescale-remover'}.jpg`;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-100 p-1.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageSrc}
                            alt={item.productVariant?.product?.title || 'Citrafoam Product'}
                            className="w-full h-full object-contain filter drop-shadow-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-graphite text-sm">
                            {item.productVariant?.product?.title || item.productName || 'Citrafoam Formula'}
                          </p>
                          <p className="text-xs text-graphite/60 mt-0.5">
                            Variant: {item.productVariant?.name || '500ml Bottle'} • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-sm text-graphite">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                          {item.productVariant?.product?.id && (
                            <OrderReviewAction
                              productId={item.productVariant.product.id}
                              productTitle={item.productVariant.product.title}
                              productImage={imageSrc}
                              authorDefaultName={currentUser.name || ''}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking info & Shipping Destination */}
                <div className="mt-6 pt-4 border-t border-graphite/10 space-y-4">
                  {order.shippingAddress && (() => {
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

                    if (!addr.line1 && !addr.name) return null;

                    return (
                      <div className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="text-xs text-neutral-600 leading-relaxed">
                          <p className="font-semibold text-graphite flex items-center gap-1.5 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-[#00AA55]" />
                            <span>Delivery Destination</span>
                          </p>
                          <p className="font-medium text-graphite">{addr.name || currentUser.name || currentUser.email}</p>
                          <p className="text-neutral-500">
                            {[addr.line1, addr.line2, addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                          </p>
                          {addr.phone && <p className="text-neutral-400 mt-0.5">Phone: {addr.phone}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-0.5">
                            Shipping Method
                          </p>
                          <p className="text-xs font-semibold text-emerald-700">Free Express Delivery</p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-graphite/60">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-botanical-600" />
                      <span>
                        Tracking ID:{' '}
                        <strong className="text-graphite font-mono">
                          {order.trackingNumber || `BLR-CF-${order.orderNumber.replace('CF-', '')}`}
                        </strong>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Dispatched via Express Courier • Inspected &amp; Tracked</span>
                      </div>
                      <Link
                        href={`/track?order=${order.orderNumber}`}
                        className="px-4 py-2 bg-[#111827] text-white rounded-full text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5"
                      >
                        <span>View Live Tracker</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
