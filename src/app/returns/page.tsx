import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Sparkles, 
  Package, 
  Truck,
  ArrowRight,
  Mail,
  HelpCircle
} from 'lucide-react';

export const metadata = {
  title: 'Returns, Replacements & Refund Policy | Citrafoam',
  description: 'Understand Citrafoam 100% satisfaction guarantee, transit damage replacements, return policy, and instant refund processing.',
};

export default function ReturnsRefundsPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen pt-28 pb-20">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-graphite/50 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-graphite font-medium">Returns &amp; Refunds</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00AA55]" />
            100% Satisfaction Guarantee
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-graphite tracking-tight mb-4">
            Returns, Replacements &amp; Refunds
          </h1>
          <p className="text-graphite/70 text-sm sm:text-base leading-relaxed">
            We are dedicated to the highest chemical purity and customer satisfaction. If your order arrives leaking, damaged, or defective, we replace it instantly with zero hassle.
          </p>
          <p className="text-xs text-graphite/40 mt-3 font-medium">
            Effective &amp; Last Updated: September 2026
          </p>
        </div>

        {/* Highlight Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00AA55] mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm text-graphite mb-1">100% Guaranteed</h4>
            <p className="text-xs text-graphite/60">Free replacement for transit damage</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#C88A58] mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm text-graphite mb-1">7-Day Window</h4>
            <p className="text-xs text-graphite/60">Prompt notification upon delivery</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm text-graphite mb-1">No Return Trip</h4>
            <p className="text-xs text-graphite/60">No need to ship leaking bottles back</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm text-graphite mb-1">Fast Refunds</h4>
            <p className="text-xs text-graphite/60">Direct to original payment method</p>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-sm space-y-10 text-graphite/80 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">1</span>
              <h2 className="font-display font-bold text-lg text-graphite">Our Quality &amp; Cleanliness Promise</h2>
            </div>
            <p>
              At Citrafoam, every bottle of Tap Cleaner, Copper &amp; Brass Cleaner, and Kitchen Cleaner is formulated with laboratory-grade organic citric acid and plant-derived surfactants. We rigorously inspect every cap seal, induction liner, and nozzle assembly prior to packaging.
            </p>
            <p>
              If your Citrafoam product does not arrive in pristine condition, or if you encounter any defect, we take immediate responsibility to make things right.
            </p>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">2</span>
              <h2 className="font-display font-bold text-lg text-graphite">Damaged, Leaking, or Defective Items (Transit Guarantee)</h2>
            </div>
            <p>
              In the rare event that rough handling by courier services causes a bottle to crack, leak, or arrive with a broken trigger spray nozzle:
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60">
                <span className="w-5 h-5 rounded-full bg-[#111827] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">A</span>
                <div>
                  <strong className="text-graphite">Take a Quick Photo or Short Video:</strong>
                  <p className="text-xs text-graphite/70 mt-0.5">Capture the shipping label on the outer box and the affected bottle or damaged area.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60">
                <span className="w-5 h-5 rounded-full bg-[#111827] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">B</span>
                <div>
                  <strong className="text-graphite">Send to Customer Care:</strong>
                  <p className="text-xs text-graphite/70 mt-0.5">
                    Email us at <a href="mailto:support@citrafoam.com" className="text-[#00AA55] font-medium underline">support@citrafoam.com</a> or message our Instagram <a href="https://www.instagram.com/citrafoam.co?stkn=MTJubGd4YjZ2czd5aA%3D%3D" target="_blank" rel="noopener noreferrer" className="text-[#00AA55] font-medium underline">@citrafoam.co</a> with your Order Reference ID (e.g. <code>CF-2024-XXXX</code>).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60">
                <span className="w-5 h-5 rounded-full bg-[#111827] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">C</span>
                <div>
                  <strong className="text-graphite">Instant Resolution (Your Choice):</strong>
                  <p className="text-xs text-graphite/70 mt-0.5">We will either dispatch a brand new replacement bottle via express courier within 24 hours at zero cost, or issue a 100% full refund back to your payment account.</p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">3</span>
              <h2 className="font-display font-bold text-lg text-graphite">Why We Do Not Require Returning Leaking Chemical Bottles</h2>
            </div>
            <p>
              Under Indian postal safety guidelines and hazardous liquid transport norms, shipping an open, leaking, or damaged chemical container poses safety and spillage risks to courier handlers and aircraft cargo.
            </p>
            <p>
              Moreover, we believe forcing customers to repack and wait for a reverse pickup of a leaking cleaning bottle is a frustrating experience. Once digital photo/video confirmation is reviewed, you may safely discard or recycle the damaged container—<strong>no return shipment required</strong>.
            </p>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">4</span>
              <h2 className="font-display font-bold text-lg text-graphite">Order Cancellation Policy</h2>
            </div>
            <p>
              We understand plans can change. You can cancel your order anytime before it has been dispatched from our fulfillment facility:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-graphite/70">
              <li>
                <strong>Before Dispatch:</strong> Contact our team or check your order on the <Link href="/track" className="text-[#00AA55] font-medium underline">Live Track</Link> portal. If the order status is <em>Processing / Unfulfilled</em>, the cancellation is executed immediately with a 100% instant refund.
              </li>
              <li>
                <strong>After Dispatch:</strong> Once your consignment has been picked up by the express courier and assigned an AWB tracking code, the parcel cannot be recalled mid-route. You may decline the package at the time of doorstep delivery, and once the carrier logs the return, your refund will be processed immediately.
              </li>
            </ul>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">5</span>
              <h2 className="font-display font-bold text-lg text-graphite">Refund Timelines &amp; Settlement Modes</h2>
            </div>
            <p>
              All approved refunds are credited directly back to the original payment method used during checkout:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-200/80 rounded-xl overflow-hidden">
                <thead className="bg-neutral-50 border-b border-neutral-200/80 text-graphite font-semibold">
                  <tr>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Refund Channel</th>
                    <th className="py-3 px-4">Estimated Settlement Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-graphite/70">
                  <tr>
                    <td className="py-3 px-4 font-medium text-graphite">UPI / QR Code</td>
                    <td className="py-3 px-4">Direct Bank Account via UPI (GPay, PhonePe, Paytm)</td>
                    <td className="py-3 px-4 text-[#00AA55] font-semibold">24 to 48 Hours</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-graphite">Credit / Debit Card</td>
                    <td className="py-3 px-4">Issuing Bank Card Account (Visa, MasterCard, RuPay)</td>
                    <td className="py-3 px-4 text-graphite font-semibold">3 to 5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-graphite">Net Banking</td>
                    <td className="py-3 px-4">Source Bank Account</td>
                    <td className="py-3 px-4 text-graphite font-semibold">3 to 5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-graphite">Digital Wallets</td>
                    <td className="py-3 px-4">Source Wallet Balance</td>
                    <td className="py-3 px-4 text-[#00AA55] font-semibold">24 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-graphite/50 italic">
              * Settlement timelines depend on the processing speeds of the respective banking gateways. We email you an official Razorpay/Bank Refund ARN reference upon initiation.
            </p>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">6</span>
              <h2 className="font-display font-bold text-lg text-graphite">Incorrect Item or Missing Quantity</h2>
            </div>
            <p>
              If your parcel arrived with an incorrect formula (e.g. Kitchen Cleaner instead of Tap Cleaner) or if an item from your order is missing:
            </p>
            <p>
              Please let us know within 7 days of package delivery with a photo of the received box contents. We will dispatch the correct or missing item immediately at zero additional fee via express priority courier.
            </p>
          </section>

          {/* Contact Support Card */}
          <div className="p-6 rounded-2xl bg-[#FDF6EF] border border-[#C88A58]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-base text-graphite">Need to initiate a replacement or refund?</h3>
              <p className="text-xs text-graphite/70">Send us your Order ID and photo proof. We respond promptly within business hours.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/account/orders"
                className="px-4 py-2.5 rounded-full bg-[#111827] text-white hover:bg-black text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>My Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="mailto:support@citrafoam.com"
                className="px-4 py-2.5 rounded-full bg-white text-graphite border border-neutral-300 hover:border-graphite text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#00AA55]" />
                <span>support@citrafoam.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shipping"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-50 text-graphite border border-neutral-300 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-[#00AA55]" />
            <span>Read Shipping &amp; Delivery Policy</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] hover:bg-black text-white rounded-full font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
