import React from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Package, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  PhoneCall,
  Mail,
  ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | Citrafoam',
  description: 'Learn about Citrafoam PAN-India shipping coverage, delivery timelines, leak-proof packaging, and order tracking.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen pt-28 pb-20">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-graphite/50 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-graphite font-medium">Shipping Policy</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#00AA55]" />
            PAN-India Express Logistics
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-graphite tracking-tight mb-4">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-graphite/70 text-sm sm:text-base leading-relaxed">
            Every bottle of Citrafoam is formulated to laboratory standards, sealed for zero transit leakage, and dispatched via express couriers across India.
          </p>
          <p className="text-xs text-graphite/40 mt-3 font-medium">
            Effective &amp; Last Updated: September 2026
          </p>
        </div>

        {/* Highlight Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00AA55] mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm text-graphite mb-1">Free Express</h4>
            <p className="text-xs text-graphite/60">On all prepaid orders across India</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#C88A58] mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm text-graphite mb-1">24h Dispatch</h4>
            <p className="text-xs text-graphite/60">Dispatched within 24 hours (Mon–Sat)</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm text-graphite mb-1">19,000+ PINs</h4>
            <p className="text-xs text-graphite/60">Comprehensive coverage across all states</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm text-graphite mb-1">Leak-Proof</h4>
            <p className="text-xs text-graphite/60">Induction-sealed safety packaging</p>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-sm space-y-10 text-graphite/80 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">1</span>
              <h2 className="font-display font-bold text-lg text-graphite">Pan-India Delivery Coverage</h2>
            </div>
            <p>
              Citrafoam delivers to all serviceable postal codes across India, covering over 19,000+ PIN codes across all states and Union Territories. We ensure reliable delivery to metropolitan hubs, tier-2, tier-3 cities, and district headquarters.
            </p>
            <p className="text-xs text-graphite/60 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60">
              <strong>Please Note:</strong> We currently do not offer international shipping outside India. All orders are dispatched from our central laboratory in Maharashtra.
            </p>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">2</span>
              <h2 className="font-display font-bold text-lg text-graphite">Order Processing &amp; Dispatch Schedule</h2>
            </div>
            <p>
              Each bottle of Citrafoam is freshly blended and quality inspected prior to boxing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-graphite/70">
              <li>
                <strong>Orders placed before 2:00 PM IST (Monday to Saturday):</strong> Processed, inspected, and handed over to our express logistics partner on the same day.
              </li>
              <li>
                <strong>Orders placed after 2:00 PM IST or on Sundays / National Holidays:</strong> Dispatched on the next immediate business day.
              </li>
              <li>
                Orders are not processed on Sundays and gazetted public holidays.
              </li>
            </ul>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">3</span>
              <h2 className="font-display font-bold text-lg text-graphite">Estimated Transit &amp; Delivery Timelines</h2>
            </div>
            <p>
              Estimated delivery times depend on your geographical location and courier connectivity:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-200/80 rounded-xl overflow-hidden">
                <thead className="bg-neutral-50 border-b border-neutral-200/80 text-graphite font-semibold">
                  <tr>
                    <th className="py-3 px-4">Destination Region</th>
                    <th className="py-3 px-4">Key Cities / Hubs</th>
                    <th className="py-3 px-4">Estimated Delivery Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-graphite/70">
                  <tr>
                    <td className="py-3 px-4 font-medium text-graphite">Metro Cities</td>
                    <td className="py-3 px-4">Mumbai, Delhi NCR, Bengaluru, Pune, Hyderabad, Chennai, Kolkata</td>
                    <td className="py-3 px-4 text-[#00AA55] font-semibold">2 – 4 Business Days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-graphite">Tier 2 &amp; Tier 3 Cities</td>
                    <td className="py-3 px-4">Ahmedabad, Jaipur, Lucknow, Chandigarh, Surat, Indore, Nagpur, etc.</td>
                    <td className="py-3 px-4 text-graphite font-semibold">3 – 5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-graphite">Special &amp; Remote Hubs</td>
                    <td className="py-3 px-4">North-Eastern States, Jammu &amp; Kashmir, Island territories</td>
                    <td className="py-3 px-4 text-graphite font-semibold">5 – 7 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-graphite/50 italic">
              * Delivery times are estimated business days and may occasionally experience minor delays during extreme weather, regional festivals, or courier route disruptions.
            </p>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">4</span>
              <h2 className="font-display font-bold text-lg text-graphite">Leak-Proof &amp; Eco-Conscious Packaging Standards</h2>
            </div>
            <p>
              Liquid cleaning formulations require specialized packaging to prevent accidental spillage or transit pressure changes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00AA55] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-graphite/70">
                  <strong>Induction Heat Seal:</strong> Every bottle mouth is hermetically sealed to prevent any atmospheric or liquid leakage.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00AA55] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-graphite/70">
                  <strong>Secondary Shrink Band:</strong> Caps are locked with a tamper-evident PVC sleeve to ensure zero loosening during transit.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00AA55] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-graphite/70">
                  <strong>Shock-Absorbing Cushioning:</strong> Biodegradable honeycomb and corrugated buffers protect bottles from drops and vibrations.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00AA55] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-graphite/70">
                  <strong>Eco-Friendly Cardboard:</strong> Outer cartons are 100% recyclable, FSC-certified unbleached kraft paperboard.
                </span>
              </div>
            </div>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">5</span>
              <h2 className="font-display font-bold text-lg text-graphite">Live Tracking &amp; Delivery Notifications</h2>
            </div>
            <p>
              We believe in total transparency throughout your order&apos;s journey:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-graphite/70">
              <li>
                <strong>Instant SMS &amp; Email:</strong> As soon as your order is packaged and assigned an Air Waybill (AWB) number, you receive an automated confirmation with the direct tracking link.
              </li>
              <li>
                <strong>Live Tracking Portal:</strong> You can enter your Order Reference (e.g. <code>CF-2024-XXXX</code>) or your email address anytime on our dedicated <Link href="/track" className="text-[#00AA55] underline font-medium hover:text-emerald-700">Live Track Order</Link> page.
              </li>
              <li>
                <strong>Customer Account:</strong> Registered users can view full shipment history, AWB codes, and live progress inside <Link href="/account/orders" className="text-[#00AA55] underline font-medium hover:text-emerald-700">Account Orders</Link>.
              </li>
            </ul>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">6</span>
              <h2 className="font-display font-bold text-lg text-graphite">Address Modifications &amp; Delivery Attempts</h2>
            </div>
            <p>
              Please ensure your complete delivery address (house/flat number, street name, landmark, and 6-digit postal PIN code) and active mobile number are entered accurately at checkout.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-graphite/70">
              <li>
                <strong>Address Corrections:</strong> If you spot a typo in your address or phone number, please contact us immediately within 2 hours of order placement. Once dispatched, rerouting requires coordination with the courier hub.
              </li>
              <li>
                <strong>Delivery Attempts:</strong> Couriers make up to 3 delivery attempts. The delivery associate will call your registered contact number prior to doorstep delivery.
              </li>
            </ul>
          </section>

          <hr className="border-neutral-100" />

          {/* Section 7 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00AA55] font-bold text-xs flex items-center justify-center">7</span>
              <h2 className="font-display font-bold text-lg text-graphite">Transit Damage or Non-Receipt</h2>
            </div>
            <p>
              In the unlikely event that your package arrives visibly damaged, leaking, or if the tracking shows delivered but you have not received it:
            </p>
            <p>
              Please notify us within 7 days of delivery. Under our <Link href="/returns" className="text-[#00AA55] font-semibold underline hover:text-emerald-700">Returns &amp; Replacement Policy</Link>, we will dispatch a brand-new replacement bottle immediately with zero hassle.
            </p>
          </section>

          {/* Contact Support Card */}
          <div className="p-6 rounded-2xl bg-[#FDF6EF] border border-[#C88A58]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-base text-graphite">Have a question regarding your shipment?</h3>
              <p className="text-xs text-graphite/70">Our logistics desk is available Mon–Sat from 9:00 AM to 7:00 PM IST.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/track"
                className="px-4 py-2.5 rounded-full bg-[#111827] text-white hover:bg-black text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </Link>
              <a
                href="https://www.instagram.com/citrafoam.co?stkn=MTJubGd4YjZ2czd5aA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-white text-graphite border border-neutral-300 hover:border-graphite text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Instagram Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] hover:bg-black text-white rounded-full font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Explore Our Cleaners</span>
          </Link>
          <Link
            href="/returns"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-50 text-graphite border border-neutral-300 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#00AA55]" />
            <span>View Returns &amp; Refund Policy</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
