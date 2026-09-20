'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Timer, 
  Sparkles, 
  Droplets, 
  CheckCircle2,
  Sparkle
} from 'lucide-react';

const products = [
  {
    id: 'trio',
    title: 'Flagship Trio',
    name: 'The Complete Citrafoam System',
    tag: 'Complete Trio',
    image: '/images/products/tap-cleaner-limescale-remover.jpg',
    subImageLeft: '/images/products/copper-brass-bronze-cleaner.jpg',
    subImageRight: '/images/products/kitchen-cleaner.jpg',
    spec: '3-formula system covering taps, heirloom metals & heavy kitchen grease.',
  },
  {
    id: 'tap',
    title: 'Tap & Limescale',
    name: 'Tap Cleaner & Limescale Remover',
    tag: 'Bathroom & Chrome',
    image: '/images/products/tap-cleaner-limescale-remover.jpg',
    spec: 'Concentrated micro-foam clinging 10x longer to dissolve calcium scale.',
  },
  {
    id: 'metal',
    title: 'Copper & Brass',
    name: 'Copper, Brass & Bronze Cleaner',
    tag: 'Heirloom Polish',
    image: '/images/products/copper-brass-bronze-cleaner.jpg',
    spec: 'Instant verdigris and tarnish dissolution with protective anti-tarnish micro-film.',
  },
  {
    id: 'kitchen',
    title: 'Kitchen Cleaner',
    name: 'Kitchen Cleaner & Degreaser',
    tag: 'Kitchen & Counters',
    image: '/images/products/kitchen-cleaner.jpg',
    spec: 'Plant enzymes encapsulate cooking grease and stovetop splatter in 60 seconds.',
  },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const activeProduct = products[activeTab];

  return (
    <section className="relative bg-porcelain pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-neutral-200/60">
      {/* Warm porcelain studio ambient lighting */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(ellipse 65% 45% at 50% 0%, rgba(200, 138, 88, 0.12) 0%, rgba(251, 251, 253, 0) 70%)'
        }}
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* ─── LEFT COLUMN: 55% Width (lg:col-span-7) ─── */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-7">
            
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-sm text-xs font-semibold text-[#111827] tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Lab-Certified Precision Formulation</span>
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.85rem] font-bold text-[#111827] tracking-tight leading-[1.08]">
                <span className="block">Stop scrubbing.</span>
                <span className="block mt-1 sm:mt-2">
                  Let the{' '}
                  <span className="font-serif italic font-normal text-[#C88A58] pr-1">
                    foam
                  </span>{' '}
                  do the work.
                </span>
              </h1>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl font-normal"
            >
              Ordinary liquid cleaners run down the drain before they can act. Citrafoam’s high-density citric micro-foam clings to vertical surfaces, dissolving years of stubborn limescale and heavy tarnish in 60 seconds — with zero toxic fumes and no elbow grease.
            </motion.p>

            {/* Action Bar (CTAs) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full sm:w-auto"
            >
              <Link
                href="/products"
                className="bg-[#111827] text-white hover:bg-black rounded-full px-8 py-4 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group text-sm sm:text-base cursor-pointer"
              >
                <span>Get Starter Bundle (Save 15%)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Direct Trust Strip Underneath Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-neutral-200/80 w-full max-w-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#111827]">
                    Zero Harsh Fumes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FDF6EF] flex items-center justify-center shrink-0">
                    <Timer className="w-4 h-4 text-[#C88A58]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#111827]">
                    Clings &amp; Acts in 60s
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#B45309]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#111827]">
                    Restores Mirror Shine
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ─── RIGHT COLUMN: 45% Width (lg:col-span-5) ─── */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            
            {/* Studio Luxe Product Pedestal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="relative w-full aspect-[4/3.5] rounded-3xl overflow-hidden shadow-2xl shadow-black/[0.06] border border-neutral-200/80 bg-gradient-to-b from-white via-white/90 to-[#FDF6EF]/40 p-6 flex flex-col justify-between"
            >
              {/* Warm Brushed Copper Glow on Pedestal Base */}
              <div 
                className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 70% 35% at 50% 85%, rgba(200, 138, 88, 0.18) 0%, transparent 70%)'
                }}
              />

              {/* Top Selector Tabs */}
              <div className="relative z-10 flex items-center justify-between w-full pb-2 border-b border-neutral-100">
                <span className="text-xs font-semibold text-[#111827] flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-[#C88A58]" />
                  <span>Citric Micro-Foam</span>
                </span>

                <div className="flex items-center gap-1 bg-neutral-100/80 p-0.5 rounded-full border border-neutral-200/60">
                  {products.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveTab(idx)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                        activeTab === idx
                          ? 'bg-white text-[#111827] shadow-sm font-semibold'
                          : 'text-[#64748B] hover:text-[#111827]'
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Studio Stage Visual */}
              <div className="relative flex-1 flex items-center justify-center my-2">
                <AnimatePresence mode="wait">
                  {activeTab === 0 ? (
                    /* Flagship Trio Showcase */
                    <motion.div
                      key="trio"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      {/* Left Bottle (Copper & Brass) */}
                      <div className="absolute left-[10%] bottom-3 w-[42%] h-[80%] -rotate-6 transition-transform hover:scale-105 duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeProduct.subImageLeft!}
                          alt="Copper & Brass Cleaner"
                          className="w-full h-full object-contain filter drop-shadow-md"
                        />
                      </div>

                      {/* Right Bottle (Kitchen Cleaner) */}
                      <div className="absolute right-[10%] bottom-3 w-[42%] h-[80%] rotate-6 transition-transform hover:scale-105 duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeProduct.subImageRight!}
                          alt="Kitchen Cleaner"
                          className="w-full h-full object-contain filter drop-shadow-md"
                        />
                      </div>

                      {/* Center Bottle (Tap & Limescale Flagship) */}
                      <div className="relative z-10 w-[54%] h-[92%] transition-transform hover:scale-105 duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeProduct.image}
                          alt="Tap Cleaner & Limescale Remover"
                          className="w-full h-full object-contain filter drop-shadow-xl"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    /* Single Dedicated Bottle Focus */
                    <motion.div
                      key={activeProduct.id}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.35 }}
                      className="relative w-full h-full flex items-center justify-center p-2"
                    >
                      <div className="w-[62%] h-[92%] transition-transform hover:scale-105 duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          className="w-full h-full object-contain filter drop-shadow-xl"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Card Footer */}
              <div className="relative z-10 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#111827]">{activeProduct.name}</div>
                  <div className="text-[11px] text-[#64748B]">{activeProduct.spec}</div>
                </div>

                <Link
                  href="/products"
                  className="px-3.5 py-1.5 rounded-full bg-[#111827] text-white text-[11px] font-medium hover:bg-black transition-colors shrink-0 ml-3"
                >
                  Shop Now
                </Link>
              </div>

            </motion.div>

            {/* Apple-Style Floating Spec Card 1 (Top-Right) */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 backdrop-blur-md bg-white/95 border border-neutral-200/90 shadow-2xl shadow-black/[0.06] rounded-2xl p-3 sm:p-3.5 z-30 flex items-center gap-2.5 pointer-events-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#FDF6EF] border border-[#C88A58]/30 flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4 text-[#C88A58]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#111827]">98% Surface Cling</div>
                <div className="text-[10px] text-[#64748B] font-medium">Zero-drip vertical micro-foam</div>
              </div>
            </motion.div>

            {/* Apple-Style Floating Spec Card 2 (Bottom-Left) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-4 backdrop-blur-md bg-white/95 border border-neutral-200/90 shadow-2xl shadow-black/[0.06] rounded-2xl p-3 sm:p-3.5 z-30 flex items-center gap-2.5 pointer-events-none"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#111827]">100% Biodegradable</div>
                <div className="text-[10px] text-[#64748B] font-medium">Plant-Derived Surfactants</div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
