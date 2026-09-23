import React from 'react';
import Link from 'next/link';
import { Mail, Instagram, MapPin, Clock, MessageSquare, ChevronRight, ArrowRight, Truck } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Citrafoam Customer Care',
  description: 'Get in touch with Citrafoam Customer Support for order assistance, shipping queries, or bulk inquiries.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen pt-28 pb-20">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-graphite/50 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-graphite font-medium">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5 text-[#00AA55]" />
            We&apos;re Here to Help
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-graphite tracking-tight mb-4">
            Contact Citrafoam Support
          </h1>
          <p className="text-graphite/70 text-sm sm:text-base leading-relaxed">
            Have questions about our citric acid cleaners, tracking your dispatch, or transit replacements? Reach out to our customer care team.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Email Support */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00AA55]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-graphite">Email Support</h3>
                <p className="text-xs text-graphite/60 mt-1">For order queries, feedback, or transit replacements</p>
              </div>
              <p className="text-sm font-semibold text-graphite pt-2">
                <a href="mailto:support@citrafoam.com" className="text-[#00AA55] hover:underline">support@citrafoam.com</a>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 text-xs text-graphite/50 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Responses within 12–24 business hours</span>
            </div>
          </div>

          {/* Instagram Care */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00AA55]/10 border border-[#00AA55]/20 flex items-center justify-center text-[#00AA55]">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-graphite">Official Instagram</h3>
                <p className="text-xs text-graphite/60 mt-1">Direct message us for quick support and cleaning tips</p>
              </div>
              <p className="text-sm font-semibold text-graphite pt-2">
                <a 
                  href="https://www.instagram.com/citrafoam.co?stkn=MTJubGd4YjZ2czd5aA%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00AA55] hover:underline"
                >
                  @citrafoam.co
                </a>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 text-xs text-graphite/50 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Mon – Sat, 9:00 AM – 7:00 PM IST</span>
            </div>
          </div>

        </div>

        {/* Quick Links Box */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs">
          <h3 className="font-display font-bold text-base text-graphite mb-4">Quick Self-Service Portals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link 
              href="/track"
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 transition-colors group flex flex-col justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-graphite block mb-1 group-hover:text-[#00AA55] transition-colors">Track Consignment</span>
                <span className="text-[11px] text-graphite/60 block">Check live AWB delivery status</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-[#00AA55] font-medium gap-1">
                <span>Open Tracker</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/shipping"
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 transition-colors group flex flex-col justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-graphite block mb-1 group-hover:text-[#00AA55] transition-colors">Shipping Policy</span>
                <span className="text-[11px] text-graphite/60 block">PAN-India timelines &amp; packaging</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-[#00AA55] font-medium gap-1">
                <span>View Policy</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/returns"
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 transition-colors group flex flex-col justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-graphite block mb-1 group-hover:text-[#00AA55] transition-colors">Returns &amp; Refunds</span>
                <span className="text-[11px] text-graphite/60 block">Transit damage &amp; replacements</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-[#00AA55] font-medium gap-1">
                <span>View Guarantee</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
