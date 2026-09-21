'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatPrice, parseJsonSafe } from '@/lib/utils';
import { Truck, CheckCircle2, Clock, Search, MapPin, ExternalLink, Loader2, Sparkles, AlertCircle, Save } from 'lucide-react';

interface OrderItem {
  id: string;
  productName?: string | null;
  quantity: number;
  unitPrice: number;
  productVariant?: {
    name: string;
    product?: {
      title: string;
      slug: string;
      images: string;
    };
  };
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  productName?: string | null;
  guestEmail?: string | null;
  shippingAddress: string;
  totalAmount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber?: string | null;
  createdAt: string | Date;
  items: OrderItem[];
  user?: {
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

interface Props {
  initialOrders: AdminOrder[];
}

export default function AdminOrderManager({ initialOrders }: Props) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; text: string; type: 'success' | 'error' } | null>(null);

  // Local state for edits on each order
  const [editStates, setEditStates] = useState<{
    [orderId: string]: {
      fulfillmentStatus: string;
      paymentStatus: string;
      trackingNumber: string;
    };
  }>(() => {
    const map: any = {};
    for (const o of initialOrders) {
      map[o.id] = {
        fulfillmentStatus: o.fulfillmentStatus,
        paymentStatus: o.paymentStatus,
        trackingNumber: o.trackingNumber || '',
      };
    }
    return map;
  });

  const handleFieldChange = (orderId: string, field: string, value: string) => {
    setEditStates((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (orderId: string) => {
    setUpdatingId(orderId);
    setMessage(null);

    const currentEdit = editStates[orderId];

    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          fulfillmentStatus: currentEdit.fulfillmentStatus,
          paymentStatus: currentEdit.paymentStatus,
          trackingNumber: currentEdit.trackingNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      // Update local orders list
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                fulfillmentStatus: currentEdit.fulfillmentStatus,
                paymentStatus: currentEdit.paymentStatus,
                trackingNumber: currentEdit.trackingNumber,
              }
            : o
        )
      );

      setMessage({ id: orderId, text: 'Status updated & live for customer!', type: 'success' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ id: orderId, text: err.message, type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      o.orderNumber.toLowerCase().includes(term) ||
      (o.guestEmail && o.guestEmail.toLowerCase().includes(term)) ||
      (o.productName && o.productName.toLowerCase().includes(term));

    const matchesStatus =
      filterStatus === 'ALL' || o.fulfillmentStatus.toUpperCase() === filterStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'SHIPPED':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'UNFULFILLED':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls: Search and Status Filters */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by #order, email, formula..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-neutral-200 rounded-xl text-xs text-graphite placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00AA55]/30 focus:border-[#00AA55]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'UNFULFILLED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center">
          <p className="text-neutral-500 text-sm">No orders matching your filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const edit = editStates[order.id] || {
              fulfillmentStatus: order.fulfillmentStatus,
              paymentStatus: order.paymentStatus,
              trackingNumber: order.trackingNumber || '',
            };

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

            const isSaving = updatingId === order.id;
            const msg = message?.id === order.id ? message : null;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-neutral-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-display text-graphite">
                        #{order.orderNumber}
                      </h2>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                          order.fulfillmentStatus
                        )}`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/track?order=${order.orderNumber}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>Customer Live Tracker</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                  </div>
                </div>

                {/* Body Details: Items & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-b border-neutral-100">
                  {/* Left: Customer & Delivery Address */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00AA55]" />
                      <span>Customer &amp; Shipping Destination</span>
                    </p>
                    <p className="font-semibold text-graphite text-sm">
                      {addr.name || order.user?.name || 'Customer'}
                    </p>
                    <p className="text-xs text-neutral-600 font-mono mt-0.5">
                      {order.guestEmail || order.user?.email}
                    </p>
                    {addr.phone && <p className="text-xs text-neutral-500 mt-0.5">Phone: {addr.phone}</p>}
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {[addr.line1, addr.line2, addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  {/* Right: Ordered Formulas */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Purchased Items ({order.items.length})
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-graphite">
                            {item.productVariant?.product?.title || item.productName || 'Citrafoam Formula'}
                            <span className="text-neutral-400 ml-1.5">
                              ({item.productVariant?.name || '500ml'} × {item.quantity})
                            </span>
                          </span>
                          <span className="font-semibold text-graphite">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-neutral-100 flex justify-between text-xs font-bold text-graphite">
                        <span>Total Billed:</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Quick Status Controls */}
                <div className="pt-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    {/* Fulfillment Status Select */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Fulfillment Status
                      </label>
                      <select
                        value={edit.fulfillmentStatus}
                        onChange={(e) => handleFieldChange(order.id, 'fulfillmentStatus', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-neutral-200 rounded-xl text-xs font-semibold text-graphite focus:outline-none focus:ring-2 focus:ring-[#00AA55]/30 focus:border-[#00AA55]"
                      >
                        <option value="UNFULFILLED">🟡 UNFULFILLED (Placed)</option>
                        <option value="PROCESSING">🔵 PROCESSING (Bottled &amp; QC)</option>
                        <option value="SHIPPED">🟣 SHIPPED (Dispatched / In Transit)</option>
                        <option value="DELIVERED">🟢 DELIVERED (Doorstep)</option>
                        <option value="CANCELLED">🔴 CANCELLED</option>
                      </select>
                    </div>

                    {/* Payment Status Select */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Payment Status
                      </label>
                      <select
                        value={edit.paymentStatus}
                        onChange={(e) => handleFieldChange(order.id, 'paymentStatus', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-neutral-200 rounded-xl text-xs font-semibold text-graphite focus:outline-none focus:ring-2 focus:ring-[#00AA55]/30 focus:border-[#00AA55]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </div>

                    {/* Tracking AWB Number Input */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-botanical-600" />
                        <span>Courier AWB Tracking #</span>
                      </label>
                      <input
                        type="text"
                        value={edit.trackingNumber}
                        onChange={(e) => handleFieldChange(order.id, 'trackingNumber', e.target.value)}
                        placeholder="e.g. DELHIVERY-89124..."
                        className="w-full px-3 py-2 bg-stone-50 border border-neutral-200 rounded-xl text-xs font-mono text-graphite placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00AA55]/30 focus:border-[#00AA55]"
                      />
                    </div>
                  </div>

                  {/* Save Action & Feedback */}
                  <div className="flex items-center gap-3 self-end lg:self-center">
                    {msg && (
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                          msg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {msg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        <span>{msg.text}</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleSave(order.id)}
                      disabled={isSaving}
                      className="px-5 py-2.5 bg-[#00AA55] hover:bg-[#008f47] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Update Order</span>
                        </>
                      )}
                    </button>
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
