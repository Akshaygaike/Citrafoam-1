import React from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Citrafoam',
  description: 'Learn how Citrafoam protects your privacy and personal data in compliance with data privacy standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen pt-28 pb-20">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-graphite/50 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-graphite font-medium">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-[#00AA55]" />
            Your Data Is Encrypted &amp; Protected
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-graphite tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-graphite/70 text-sm sm:text-base leading-relaxed">
            Citrafoam is committed to honoring and safeguarding your personal information. We never sell or rent your data to third parties.
          </p>
          <p className="text-xs text-graphite/40 mt-3 font-medium">
            Effective &amp; Last Updated: September 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-sm space-y-8 text-graphite/80 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-graphite">1. Information We Collect</h2>
            <p>
              When you purchase or interact with Citrafoam, we collect necessary transactional information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-graphite/70">
              <li><strong>Contact Information:</strong> Full name, shipping destination address, email, and phone number.</li>
              <li><strong>Transaction Details:</strong> Items purchased, order amounts, and payment transaction references.</li>
              <li><strong>Reviews &amp; Media:</strong> Feedback ratings, comments, and photos or videos you voluntarily upload with your reviews.</li>
            </ul>
          </section>

          <hr className="border-neutral-100" />

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-graphite">2. How We Use Your Information</h2>
            <p>
              Your data is exclusively used to fulfill your purchase and provide customer care:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-graphite/70">
              <li>Processing, bottling, and express dispatching your Citrafoam cleaner orders.</li>
              <li>Generating AWB shipping labels and sending real-time tracking SMS and email alerts.</li>
              <li>Providing replacement or refund support for transit issues.</li>
              <li>Displaying honest verified buyer reviews and media on product pages.</li>
            </ul>
          </section>

          <hr className="border-neutral-100" />

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-graphite">3. Payment &amp; Banking Security</h2>
            <p>
              Citrafoam does not store or process your complete credit card numbers, UPI PINs, or banking passwords on our servers. All financial transactions are securely processed through PCI-DSS Level 1 compliant payment gateways (such as Razorpay / Cashfree) with end-to-end 256-bit SSL encryption.
            </p>
          </section>

          <hr className="border-neutral-100" />

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-graphite">4. Data Retention &amp; Rights</h2>
            <p>
              You have the right to request access to, correction of, or deletion of your stored account data at any time by contacting us at <a href="mailto:support@citrafoam.com" className="text-[#00AA55] font-medium underline">support@citrafoam.com</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
