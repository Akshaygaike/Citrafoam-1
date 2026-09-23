import React from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronRight, Truck, ShieldCheck, Sparkles, Package } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions (FAQs) | Citrafoam',
  description: 'Find answers to common questions about Citrafoam citric acid cleaners, application instructions, shipping, and order guarantees.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What makes Citrafoam different from ordinary chemical cleaners?",
      a: "Citrafoam uses pure, pharmaceutical-grade organic citric acid coupled with coconut-derived biodegradable foaming surfactants. Unlike harsh hydrochloric acid or bleach cleaners, Citrafoam is non-fuming, non-corrosive to skin, safe for septic tanks, yet chemically dissolves mineral limescale, calcium, and hard water deposits effortlessly."
    },
    {
      q: "How long does delivery take across India?",
      a: "Metro cities (Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, Chennai, Kolkata) typically receive deliveries within 2 to 4 business days. Other cities and district headquarters take 3 to 5 business days. All orders placed before 2:00 PM IST (Mon–Sat) are dispatched the same day."
    },
    {
      q: "What if my bottle arrives leaking or damaged in transit?",
      a: "Under our 100% Transit Guarantee, we take full responsibility. Simply snap a photo or short video of the damaged bottle and send it to support@citrafoam.com or DM us on Instagram @citrafoam.co with your Order ID. We will immediately dispatch a brand-new replacement bottle at zero cost—no need to return the damaged liquid bottle!"
    },
    {
      q: "Can I use the Tap Cleaner on chrome and stainless steel fittings?",
      a: "Yes! Citrafoam Tap Cleaner is specially engineered for chrome plating, stainless steel (SS 304/316), and brass fixtures. Simply spray the foam, allow it to dwell for 2 to 3 minutes to dissolve calcium minerals, gently wipe with a sponge, and rinse with water."
    },
    {
      q: "How do I track my order?",
      a: "You can track your order at any moment on our Live Track Order page (/track) by entering your Order Reference ID (e.g. CF-2024-XXXX) or your email address. You will also receive automatic SMS and Email updates containing your courier AWB tracking link."
    },
    {
      q: "Can I cancel my order?",
      a: "Yes, you can cancel your order anytime before it has been dispatched from our lab. Once cancelled, a 100% full refund is instantly issued back to your original payment method (UPI / Cards / Net Banking)."
    }
  ];

  return (
    <div className="bg-[#FBF9F5] min-h-screen pt-28 pb-20">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-graphite/50 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-graphite font-medium">FAQs</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#00AA55]" />
            Frequently Asked Questions
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-graphite tracking-tight mb-4">
            Answers &amp; Help
          </h1>
          <p className="text-graphite/70 text-sm sm:text-base leading-relaxed">
            Everything you need to know about our natural citric acid formulas, shipping, and guarantees.
          </p>
        </div>

        {/* FAQ Accordion / Cards */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
              <h3 className="font-display font-bold text-base text-graphite mb-2.5 flex items-start gap-2.5">
                <span className="text-[#00AA55] font-bold">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-graphite/70 text-sm leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-[#FDF6EF] rounded-3xl p-8 border border-[#C88A58]/25 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-display font-bold text-base text-graphite">Still have questions?</h3>
            <p className="text-xs text-graphite/70 mt-1">Our support team is always glad to assist you.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full bg-[#111827] text-white hover:bg-black text-xs font-semibold transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/shipping"
              className="px-5 py-2.5 rounded-full bg-white text-graphite border border-neutral-300 hover:border-graphite text-xs font-semibold transition-colors"
            >
              Shipping Policy
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
