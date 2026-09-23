import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, CheckCircle2, ShieldCheck, Heart, Leaf, Package } from 'lucide-react';

export const metadata = {
  title: 'Our Story & Science | Citrafoam',
  description: 'Learn the story behind Citrafoam: natural citric acid chemistry, safe home cleaning, and uncompromising laboratory standards.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen pt-28 pb-20">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-graphite/50 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-graphite font-medium">Our Story</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00AA55]" />
            Simply Natural. Scientifically Proven.
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-graphite tracking-tight mb-4">
            The Story Behind Citrafoam
          </h1>
          <p className="text-graphite/70 text-sm sm:text-base leading-relaxed">
            Born out of a simple conviction: you shouldn&apos;t have to breathe corrosive fumes or expose your hands to toxic acids just to have spotless taps, shining brass, and a grease-free kitchen.
          </p>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-sm space-y-8 text-graphite/80 text-sm leading-relaxed mb-12">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-graphite">Harnessing Organic Citric Acid</h2>
            <p>
              Most commercial bathroom and tap cleaners rely on hydrochloric acid (HCl) or aggressive bleach. While they might strip limescale, they also etch delicate chrome coatings, release noxious airborne fumes, and damage household plumbing and septic systems over time.
            </p>
            <p>
              At Citrafoam Labs, we engineered an advanced foaming delivery vehicle centered around <strong>pure organic citric acid</strong> and coconut-derived surfactants. The dense foam clings to vertical surfaces—faucets, shower glass, copper pots, and kitchen tiles—allowing the citric acid to actively chelate calcium and magnesium ions without aggressive scrubbing or corrosive runoff.
            </p>
          </section>

          <hr className="border-neutral-100" />

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00AA55] mx-auto mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-graphite mb-1">Plant-Derived</h3>
              <p className="text-xs text-graphite/60">Bio-based citric active agents that biodegrade naturally.</p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#C88A58] mx-auto mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-graphite mb-1">Non-Corrosive</h3>
              <p className="text-xs text-graphite/60">Zero hydrochloric acid. Gentle on chrome, tiles, and skin.</p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-graphite mb-1">Safe for Families</h3>
              <p className="text-xs text-graphite/60">No choking vapours. Fresh natural citrus essence.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111827] hover:bg-black text-white rounded-full font-medium text-sm transition-all shadow-md"
          >
            <Package className="w-4 h-4" />
            <span>Discover The Formulas</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
