'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { formatPrice, FREE_SHIPPING_THRESHOLD, shippingCost } from '@/lib/utils';
import { CheckCircle, CreditCard, Banknote, ChevronRight, MapPin, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PostPurchaseReview, { PurchasedProductItem } from '@/components/modules/reviews/PostPurchaseReview';

export default function CheckoutPage() {
  const { items, subtotal: getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrder, setPlacedOrder] = useState<{
    orderNumber: string;
    totalAmount: number;
    email: string;
  } | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedProductItem[]>([]);

  const rawSubtotal = getSubtotal();
  const [couponCode, setCouponCode] = useState('CITRAFOAM10');
  const discount = couponCode === 'CITRAFOAM10' ? rawSubtotal * 0.1 : 0;
  const subtotal = Math.max(0, rawSubtotal - discount);
  const shipping = shippingCost(subtotal);
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    line1: 'B-304, Palm Grove Heights',
    line2: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
    country: 'IN',
    paymentMethod: 'cod' as 'card' | 'cod',
  });

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.email) {
          const parts = (data.user.name || '').trim().split(' ');
          const first = parts[0] || '';
          const last = parts.slice(1).join(' ') || '';
          setFormData((prev) => ({
            ...prev,
            firstName: first || prev.firstName || 'Customer',
            lastName: last || prev.lastName,
            email: data.user.email || prev.email,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            firstName: prev.firstName || 'Priya',
            lastName: prev.lastName || 'Sharma',
            email: prev.email || 'priya.sharma@example.com',
            phone: prev.phone || '+91-9876543210',
          }));
        }
      })
      .catch(() => {
        setFormData((prev) => ({
          ...prev,
          firstName: prev.firstName || 'Priya',
          lastName: prev.lastName || 'Sharma',
          email: prev.email || 'priya.sharma@example.com',
          phone: prev.phone || '+91-9876543210',
        }));
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shipping: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod === 'card' ? 'stripe' : 'cod',
        couponCode: couponCode || undefined,
      };

      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      const purchased: PurchasedProductItem[] = items.map((item) => ({
        productId: item.productId,
        productTitle: item.productTitle,
        image: item.image,
        variantName: item.variantName,
      }));
      setPurchasedItems(purchased);

      setPlacedOrder({
        orderNumber: data.orderNumber,
        totalAmount: data.totalAmount,
        email: formData.email,
      });

      clearCart();
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="container-tight pt-28 pb-16 text-center min-h-[75vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-200/60 shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FDF6EF] text-[#B45309] border border-[#C88A58]/30 mb-3">
          Order Confirmed
        </span>
        <h1 className="font-display text-display-sm text-[#111827] mb-2">
          Thank you for choosing Citrafoam!
        </h1>
        <p className="text-body-md text-neutral-500 mb-1">
          Order <strong className="text-[#111827]">#{placedOrder.orderNumber}</strong>
        </p>
        <p className="text-sm text-neutral-500 max-w-md mb-8">
          A confirmation and tracking link have been dispatched to{' '}
          <strong className="text-[#111827]">{placedOrder.email}</strong>. Total billed:{' '}
          <strong className="text-[#111827]">{formatPrice(placedOrder.totalAmount)}</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link
            href={`/track?order=${placedOrder.orderNumber}`}
            className="px-6 py-3 bg-[#111827] text-white rounded-full font-medium hover:bg-black transition-colors text-sm shadow-sm"
          >
            Track My Order
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 bg-white border border-neutral-200 text-[#111827] rounded-full font-medium hover:bg-neutral-50 transition-colors text-sm"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Post-purchase Write a Review Section */}
        {purchasedItems.length > 0 && (
          <div className="w-full mt-4">
            <PostPurchaseReview
              items={purchasedItems}
              defaultAuthorName={`${formData.firstName} ${formData.lastName}`.trim()}
              orderNumber={placedOrder.orderNumber}
            />
          </div>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-tight py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-display text-display-sm text-graphite mb-4">Your cart is empty</h1>
        <p className="text-graphite/60 mb-6">Add Citrafoam formulas before proceeding to checkout.</p>
        <Link
          href="/products"
          className="px-8 py-3.5 bg-botanical-600 text-white rounded-full font-medium text-sm hover:bg-botanical-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-porcelain min-h-screen pt-28 pb-16">
      <div className="container-wide">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? 'text-botanical-600 font-bold' : 'text-graphite/40'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= 1 ? 'bg-botanical-600 text-white' : 'bg-graphite/10'
              }`}
            >
              1
            </div>
            <span>Shipping</span>
          </div>
          <ChevronRight className="w-5 h-5 text-graphite/20" />
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? 'text-botanical-600 font-bold' : 'text-graphite/40'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= 2 ? 'bg-botanical-600 text-white' : 'bg-graphite/10'
              }`}
            >
              2
            </div>
            <span>Payment &amp; Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left Column (Forms) */}
          <div>
            {step === 1 && (
              <form
                onSubmit={handleNextStep}
                className="space-y-4 bg-white p-8 rounded-3xl shadow-subtle border border-graphite/5"
              >
                <h2 className="font-display text-heading-md mb-4 text-graphite">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                      First Name
                    </label>
                    <input
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                      Last Name
                    </label>
                    <input
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                      Email Address
                    </label>
                    <input
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                    Street Address
                  </label>
                  <input
                    required
                    name="line1"
                    value={formData.line1}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                    Apartment, suite, unit (optional)
                  </label>
                  <input
                    name="line2"
                    value={formData.line2}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                      City
                    </label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-3 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                      State
                    </label>
                    <input
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-3 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5">
                      PIN Code
                    </label>
                    <input
                      required
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-3 py-3 rounded-xl border border-graphite/20 outline-none focus:border-botanical-500 bg-transparent text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-graphite text-white rounded-2xl font-medium hover:bg-black transition-colors mt-6 text-sm"
                >
                  Continue to Payment Options
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-subtle border border-graphite/5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-display font-medium text-base text-graphite">
                      Shipping Destination
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-botanical-600 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-graphite/70 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-botanical-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-graphite">
                        {formData.firstName} {formData.lastName} ({formData.phone})
                      </p>
                      <p>{formData.line1}, {formData.line2}</p>
                      <p>
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                      <p className="text-xs text-graphite/50 mt-1">{formData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-subtle border border-graphite/5">
                  <h3 className="font-display text-heading-md mb-6 text-graphite">
                    Select Payment Method
                  </h3>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'card'
                          ? 'border-botanical-600 bg-botanical-50/50 shadow-sm'
                          : 'border-graphite/15 hover:border-graphite/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className="w-4 h-4 text-botanical-600"
                      />
                      <CreditCard className="w-5 h-5 text-botanical-600" />
                      <div className="flex-1">
                        <span className="font-medium text-graphite text-sm block">
                          Card / UPI / NetBanking (Stripe Secure)
                        </span>
                        <span className="text-xs text-graphite/50">
                          Encrypted 256-bit payment gateway
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod'
                          ? 'border-botanical-600 bg-botanical-50/50 shadow-sm'
                          : 'border-graphite/15 hover:border-graphite/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="w-4 h-4 text-botanical-600"
                      />
                      <Banknote className="w-5 h-5 text-botanical-600" />
                      <div className="flex-1">
                        <span className="font-medium text-graphite text-sm block">
                          Cash on Delivery (Pay on Delivery)
                        </span>
                        <span className="text-xs text-graphite/50">
                          Verify package and pay upon arrival
                        </span>
                      </div>
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-botanical-600 text-white rounded-2xl font-medium hover:bg-botanical-700 transition-colors mt-8 text-base disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Confirming Order...
                      </>
                    ) : (
                      `Complete Order • ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Order Summary) */}
          <div>
            <div className="bg-white p-8 rounded-3xl shadow-subtle border border-graphite/5 sticky top-24">
              <h2 className="font-display text-heading-sm mb-6 text-graphite">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-graphite/10 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-stone-50 shrink-0 relative overflow-hidden flex items-center justify-center border border-neutral-100 p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.image
                            ? item.image.replace(/\.svg$/, '.jpg')
                            : `/images/products/${item.productSlug || 'tap-cleaner-limescale-remover'}.jpg`
                        }
                        alt={item.productTitle}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (item.productSlug && !target.src.includes(`${item.productSlug}.jpg`)) {
                            target.src = `/images/products/${item.productSlug}.jpg`;
                          }
                        }}
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#111827] text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-xs text-graphite line-clamp-1">
                        {item.productTitle}
                      </h4>
                      <p className="text-[11px] text-graphite/50">{item.variantName}</p>
                    </div>
                    <div className="text-sm font-semibold text-graphite">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-graphite/10">
                <div className="flex justify-between text-graphite/70 text-xs">
                  <span>Subtotal</span>
                  <span className="font-medium text-graphite">{formatPrice(rawSubtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 text-xs font-semibold">
                    <span>Discount (CITRAFOAM10)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-graphite/70 text-xs">
                  <span>Shipping</span>
                  <span className="font-medium text-graphite">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="font-medium text-base text-graphite">Grand Total</span>
                <span className="font-display text-heading-lg text-graphite">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
