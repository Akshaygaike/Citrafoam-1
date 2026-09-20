'use client'

import { motion } from 'framer-motion'
import { Leaf, Droplets, Shield } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { value: '78%', label: 'Less Plastic Per Refill', icon: Leaf },
  { value: '100%', label: 'Biodegradable Formula', icon: Droplets },
  { value: '3x', label: 'Longer Tarnish Protection', icon: Shield },
]

export default function SustainabilityBanner() {
  return (
    <section id="sustainability" className="relative section-padding bg-graphite text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-botanical-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="container-wide relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <motion.div 
            className="flex-1 text-center lg:text-left max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-display-sm mb-6">
              Less Plastic.<br />
              <span className="text-emerald-400">More Power.</span>
            </h2>
            <p className="text-body-lg text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Our concentrate-first approach eliminates shipping water around the globe. Keep your forever bottle, just add tap water and our precision-dosed citric pods.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-graphite bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-glow"
            >
              Explore Sustainable Formulas
            </Link>
          </motion.div>

          <motion.div 
            className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="glass-strong bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="font-display text-4xl font-bold text-emerald-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-white/70">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
