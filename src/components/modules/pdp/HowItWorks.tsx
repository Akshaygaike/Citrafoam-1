'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SprayCan, Timer, Sparkles, Sun } from 'lucide-react';

const steps = [
  {
    icon: SprayCan,
    title: 'Spray',
    desc: 'Spray Citrafoam directly onto the surface from 15cm',
  },
  {
    icon: Timer,
    title: 'Cling',
    desc: 'The micro-foam clings for up to 10 minutes without dripping',
  },
  {
    icon: Sparkles,
    title: 'Wipe',
    desc: 'Wipe with a damp microfibre cloth in circular motions',
  },
  {
    icon: Sun,
    title: 'Shine',
    desc: 'Rinse and enjoy a streak-free, sparkling finish',
  }
];

export default function HowItWorks() {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="font-display text-heading-lg text-graphite mb-4">How It Works</h2>
        <p className="text-body-lg text-graphite/60">Four simple steps to a pristine home.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Desktop connecting line */}
        <div className="hidden lg:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-botanical-100 via-botanical-200 to-botanical-100 z-0" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass p-6 rounded-2xl relative z-10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-botanical-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-glow">
                {idx + 1}
              </div>
              <div className="w-16 h-16 rounded-full bg-botanical-50 flex items-center justify-center text-botanical-600 mb-4">
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-heading-sm text-graphite mb-2">{step.title}</h3>
              <p className="text-sm text-graphite/70">{step.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  );
}
