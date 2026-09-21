import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck, ArrowLeft, Package, Clock, Truck, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import AdminOrderManager from '@/components/modules/admin/AdminOrderManager';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/account/login?callbackUrl=/admin/orders');
  }

  // Fetch user role from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email || '' },
    select: { id: true, name: true, email: true, role: true },
  });

  if (user?.role !== 'ADMIN') {
    return (
      <div className="container-tight py-20 min-h-screen text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-display font-bold text-graphite mb-2">Admin Access Required</h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
          Your account ({session.user.email}) does not have administrative privileges to manage customer orders.
        </p>
        <Link
          href="/account"
          className="px-6 py-2.5 bg-[#111827] text-white rounded-full text-xs font-semibold hover:bg-black transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
      </div>
    );
  }

  // Fetch all store orders from Supabase
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
      user: {
        select: { name: true, email: true, phone: true },
      },
    },
  });

  // Calculate live stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : o.totalAmount), 0);
  const unfulfilledCount = orders.filter((o) => o.fulfillmentStatus === 'UNFULFILLED' || o.fulfillmentStatus === 'PROCESSING').length;
  const shippedCount = orders.filter((o) => o.fulfillmentStatus === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.fulfillmentStatus === 'DELIVERED').length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Store Admin Portal
            </span>
            <span className="text-xs text-neutral-400 font-mono">Logged in as {user.email}</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-graphite">Customer Orders &amp; Fulfillment</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Update customer fulfillment statuses, assign courier AWB numbers, and trigger live customer tracking updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="text-xs font-semibold text-neutral-600 hover:text-graphite px-4 py-2.5 rounded-xl border border-neutral-200 bg-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </Link>
          <Link
            href="/track"
            target="_blank"
            className="text-xs font-bold text-white px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-black shadow-xs transition-colors"
          >
            Open Live Tracker
          </Link>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-graphite">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-graphite">{totalOrders}</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Across all registered &amp; guest checkouts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Awaiting Dispatch</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-amber-800">{unfulfilledCount}</p>
          <p className="text-[11px] text-amber-700/80 mt-0.5">Needs bottling, QC, or packing</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">In Transit</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-purple-800">{shippedCount}</p>
          <p className="text-[11px] text-purple-700/80 mt-0.5">Dispatched with courier tracking</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Total Volume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#00AA55]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-emerald-800">{formatPrice(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">{deliveredCount} successfully delivered</p>
        </div>
      </div>

      {/* Orders Manager Table / Cards */}
      <AdminOrderManager initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
