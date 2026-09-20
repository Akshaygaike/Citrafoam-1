'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Sprout, Sparkles, XCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const ingredients = [
  {
    id: 'citric',
    title: 'Food-Grade Citric Acid',
    short: 'Naturally derived from citrus fruits, our primary active agent gently but rapidly dissolves mineral deposits.',
    detail: 'We source only premium, food-grade citric acid that maintains a precise pH of 3.2. This optimal concentration cuts through limescale and tarnishes metals effectively while remaining safe enough for food preparation surfaces. Unlike industrial alternatives, our citric base is 100% biodegradable and derived entirely from natural fermentation processes.',
    icon: FlaskConical,
  },
  {
    id: 'surfactant',
    title: 'Plant-Derived Surfactants',
    short: 'Coconut and corn-derived foam agents create our signature clingy micro-foam.',
    detail: 'Our proprietary foam engine relies on decyl glucoside and coco-glucoside — exceptionally mild surfactants derived from coconuts and corn starch. These agents create a stable micro-foam that clings to vertical surfaces, allowing the active citric acid more time to work without the need for harsh synthetic foaming agents like SLS or SLES.',
    icon: Sprout,
  },
  {
    id: 'botanical',
    title: 'Cold-Pressed Citrus Oils',
    short: 'Therapeutic lemon, orange, and lemongrass oils for natural aroma and active degreasing.',
    detail: 'Rather than relying on artificial perfumes or synthetic phthalates, Citrafoam is scented exclusively with pure, cold-pressed essential oils. These natural plant terpenes work synergistically with our citric acid to break down grease and leave surfaces with a crisp, authentic botanical freshness.',
    icon: Sparkles,
  }
]

const excluded = [
  'Phosphates', 'Chlorine', 'Synthetic Fragrances', 'Parabens', 'Animal Testing'
]

export default function ScienceSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section id="science" className="section-padding bg-porcelain border-b border-neutral-200/60 relative overflow-hidden">
      <div className="container-tight relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#C88A58]/30 shadow-sm text-xs font-semibold text-[#111827] tracking-wide mb-3">
            Pure Ingredient Transparency
          </span>
          <h2 className="font-display text-display-sm text-graphite">
            What Goes In. What Doesn't.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {ingredients.map((item, idx) => {
            const Icon = item.icon
            const isExpanded = expandedId === item.id

            return (
              <motion.div 
                key={item.id}
                className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-300 flex flex-col"
                layout
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-sm",
                  idx === 0 && "bg-[#FDF6EF] text-[#C88A58] border border-[#C88A58]/30",
                  idx === 1 && "bg-emerald-50 text-[#15803D] border border-emerald-200",
                  idx === 2 && "bg-amber-50 text-[#B45309] border border-amber-200"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="font-display font-bold text-lg text-graphite mb-2.5">{item.title}</h3>
                <p className="text-body-sm text-graphite/70 mb-4 leading-relaxed">{item.short}</p>
                
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-neutral-100 mt-2 text-xs text-graphite/80 leading-relaxed pb-4">
                        {item.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="mt-auto pt-2 flex items-center text-xs font-semibold text-[#111827] hover:text-[#C88A58] transition-colors cursor-pointer"
                >
                  {isExpanded ? 'Show Less' : 'Learn More'}
                  <ChevronDown className={cn("ml-1 w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")} />
                </button>
              </motion.div>
            )
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm">
          <h4 className="text-center text-xs font-bold uppercase tracking-wider text-graphite/50 mb-6">
            What We Never Use
          </h4>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {excluded.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-xs sm:text-sm text-graphite/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
