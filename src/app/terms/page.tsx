import React from 'react';
import Link from 'next/link';
import { FileText, ChevronRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Citrafoam',
  description: 'Terms and Conditions governing the purchase and use of Citrafoam natural cleaning formulas.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen pt-28 pb-20">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-graphite/50 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-graphite font-medium">Terms of Service</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <FileText className="w-3.5 h-3.5 text-[#00AA55]" />
            Official Terms &amp; Conditions
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-graphite tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-graphite/70 text-sm sm:text-base leading-relaxed">
            Welcome to Citrafoam Labs. These terms govern your use of our storefront and purchase of our citric acid cleaning formulas.
          </p>
          <p className="text-xs text-graphite/40 mt-3 font-medium">
            Effective &amp; Last Updated: September 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-sm space-y-8 text-graphite/80 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-graphite">1. Product Usage &amp; Directions</h2>
            <p>
              Citrafoam formulas are specialized organic cleaning solutions formulated for specific surfaces (e.g. bathroom fittings, limescale, copper/brass utensils, kitchen grease). Always review the application directions, recommended dwell times, and test on an inconspicuous spot before broad use.
            </p>
          </section>

          <hr className="border-neutral-100" />

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-graphite">2. Pricing &amp; Orders</h2>
            <p>
              All prices listed on Citrafoam (₹250 for 500ml Tap Cleaner, ₹200 for 500ml Copper Cleaner, ₹250 for 500ml Kitchen Cleaner) are in Indian Rupees (INR) and inclusive of applicable taxes. We reserve the right to revise pricing or promotional discounts at any time prior to order confirmation.
            </p>
          </section>

          <hr className="border-neutral-100" />

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-graphite">3. Shipping &amp; Replacement Guarantees</h2>
            <p>
              Deliveries are governed by our <Link href="/shipping" className="text-[#00AA55] font-medium underline">Shipping Policy</Link>. In the event of transit damage or leaks, customers are protected by our <Link href="/returns" className="text-[#00AA55] font-medium underline">Returns &amp; Refund Policy</Link> guaranteeing an immediate free replacement or full refund upon photo verification.
            </p>
          </section>

          <hr className="border-neutral-100" />

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-graphite">4. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts of Maharashtra, India.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
