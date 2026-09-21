import { redirect } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Package, MapPin, Settings, ChevronRight, LogOut, ShieldCheck, ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/account/login');
  }

  // Fetch full user profile & stats from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email || '' },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          items: {
            include: {
              productVariant: {
                include: { product: true }
              }
            }
          }
        }
      },
      _count: {
        select: { orders: true, reviews: true }
      }
    }
  });

  const links = [
    {
      title: 'Order History',
      description: `${user?._count.orders || 0} order${(user?._count.orders || 0) === 1 ? '' : 's'} recorded`,
      icon: <Package className="w-6 h-6 text-botanical-600" />,
      href: '/account/orders'
    },
    {
      title: 'Addresses',
      description: 'Manage shipping and delivery addresses',
      icon: <MapPin className="w-6 h-6 text-botanical-600" />,
      href: '/account/orders'
    },
    {
      title: 'Verified Reviews',
      description: `${user?._count.reviews || 0} product review${(user?._count.reviews || 0) === 1 ? '' : 's'}`,
      icon: <Star className="w-6 h-6 text-botanical-600" />,
      href: '/account/orders'
    }
  ];

  return (
    <div className="container-tight py-12 min-h-screen">
      {/* Header Profile Section */}
      <div className="mb-10 p-8 rounded-3xl glass border border-white/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-botanical-100 text-botanical-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Citrafoam Account
            </span>
            {user?.role === 'ADMIN' && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                ADMIN
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-graphite">
            Welcome back, {user?.name || session.user.name || 'Friend'}
          </h1>
          <p className="text-graphite/60 font-sans text-sm mt-1">
            {user?.email || session.user.email} {user?.phone ? `• ${user.phone}` : ''}
          </p>
        </div>

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/account/login' });
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-graphite/15 text-sm font-medium text-graphite/70 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>

      {/* Admin Order Management Banner */}
      {user?.role === 'ADMIN' && (
        <div className="mb-10 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Admin Controls
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-graphite">Customer Orders &amp; Fulfillment Manager</h2>
            <p className="text-xs text-neutral-600 mt-1 max-w-xl">
              You have administrator privileges. Update customer order statuses (Unfulfilled, Processing, Shipped, Delivered) and set courier tracking AWB numbers in real time.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="px-6 py-3 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-2xl shadow-sm transition-all whitespace-nowrap"
          >
            Manage Customer Orders →
          </Link>
        </div>
      )}

      {/* Navigation Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {links.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group glass p-6 rounded-2xl flex items-start justify-between hover:shadow-card-hover transition-all duration-300 border border-white/60"
          >
            <div className="flex flex-col">
              <div className="bg-botanical-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <h2 className="text-lg font-bold font-display text-graphite mb-1">
                {link.title}
              </h2>
              <p className="text-sm text-graphite/60 font-sans">
                {link.description}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-graphite/40 group-hover:text-botanical-600 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Recent Activity / Orders Preview */}
      <div className="glass p-8 rounded-3xl border border-white/60">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-graphite flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-botanical-600" />
            Recent Account Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-botanical-700 hover:underline"
          >
            View Full Tracking &rarr;
          </Link>
        </div>

        {user?.orders && user.orders.length > 0 ? (
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-white/60 border border-graphite/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-graphite">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-graphite/60">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} • {order.items.length} item(s)
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-display font-bold text-base text-graphite">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <Link
                    href={`/account/orders?query=${encodeURIComponent(order.orderNumber)}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-botanical-50 text-botanical-700 hover:bg-botanical-100 transition-colors"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-graphite/60 mb-4 font-sans">
              You haven't placed any orders with this account yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 rounded-full bg-botanical-600 text-white font-medium text-sm hover:bg-botanical-700 transition-colors"
            >
              Explore Citric Formulas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
