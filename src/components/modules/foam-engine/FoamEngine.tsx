'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Droplets, Leaf, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    id: 'foam',
    title: 'Active Citric Micro-Foam',
    description: 'Our proprietary foam engine aerates the citric solution, allowing it to cling to vertical surfaces up to 10x longer than liquid sprays for deep penetration.',
    icon: Droplets,
  },
  {
    id: 'eco',
    title: 'Zero Toxic Residue',
    description: 'Formulated completely free of phosphates, chlorine, and synthetic fragrances. 100% biodegradable and safe for waterways, pets, and your family.',
    icon: Leaf,
  },
  {
    id: 'power',
    title: 'Rapid Mineral Dissolution',
    description: 'Cuts through years of stubborn copper tarnish, hard water stains, and limescale buildup in seconds, restoring the original brilliance of your surfaces.',
    icon: Zap,
  }
]

function FeatureCard({
  feature,
  index,
  scrollYProgress,
}: {
  feature: (typeof features)[0]
  index: number
  scrollYProgress: any
}) {
  const start = index * 0.33
  const peak = start + 0.165
  const end = start + 0.33

  const opacity = useTransform(
    scrollYProgress,
    [start - 0.1, start, peak, end, end + 0.1],
    [0, 1, 1, 1, 0]
  )

  const scale = useTransform(
    scrollYProgress,
    [start - 0.1, start, peak, end, end + 0.1],
    [0.8, 1, 1, 1, 0.8]
  )

  const y = useTransform(
    scrollYProgress,
    [start - 0.1, start, peak, end, end + 0.1],
    [50, 0, 0, 0, -50]
  )

  const Icon = feature.icon

  return (
    <motion.div
      key={feature.id}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity, scale, y }}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-neutral-200/80 shadow-2xl shadow-black/[0.04] rounded-3xl p-8 md:p-12 max-w-2xl w-full flex flex-col items-center text-center pointer-events-auto">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm",
          index === 0 && "bg-[#FDF6EF] text-[#C88A58] border border-[#C88A58]/30",
          index === 1 && "bg-emerald-50 text-[#15803D] border border-emerald-200",
          index === 2 && "bg-amber-50 text-[#B45309] border border-amber-200/70"
        )}>
          <Icon className="w-9 h-9" />
        </div>
        <h3 className="font-display text-heading-lg text-graphite mb-4">{feature.title}</h3>
        <p className="text-body-md text-graphite/70 leading-relaxed max-w-lg">
          {feature.description}
        </p>

        {/* Technical animation breakdown */}
        <div className="mt-8 w-full h-32 rounded-2xl bg-gradient-to-b from-[#FBFBFD] to-stone-50/80 relative overflow-hidden border border-neutral-200/80 flex items-center justify-center">
          {index === 0 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-60">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2 border-[#C88A58]/40"
                  initial={{ width: 0, height: 0, opacity: 1 }}
                  animate={{ width: '150%', height: '150%', opacity: 0 }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}
          {index === 1 && (
            <div className="flex items-center justify-center space-x-6">
              <Leaf className="w-10 h-10 text-[#15803D]/60 animate-pulse" />
              <Droplets className="w-10 h-10 text-[#C88A58]/60 animate-pulse delay-75" />
            </div>
          )}
          {index === 2 && (
            <div className="absolute inset-0 flex items-center p-6">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#C88A58] via-[#E9AE78] to-white overflow-hidden rounded-full relative">
                <motion.div
                  className="absolute top-0 left-0 h-full w-1/4 bg-white shadow-[0_0_12px_rgba(255,255,255,1)]"
                  animate={{ left: ['-25%', '125%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ProgressDot({
  index,
  smoothProgress,
  total,
}: {
  index: number
  smoothProgress: any
  total: number
}) {
  const start = index * 0.33
  const end = start + 0.33

  const opacity = useTransform(smoothProgress, (v: number) =>
    (v >= start && v < end) || (index === total - 1 && v >= 0.95) ? 1 : 0.2
  )

  return (
    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[#111827] rounded-full"
        style={{ opacity }}
      />
    </div>
  )
}

export default function FoamEngine() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-porcelain border-b border-neutral-200/60">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col pt-24 pb-12">
        <div className="container-tight mx-auto text-center z-20 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#C88A58]/30 shadow-sm text-xs font-semibold text-[#111827] tracking-wide mb-4">
            The Science of Micro-Foam
          </span>
          <h2 className="font-display text-display-sm text-graphite">The Foam Engine</h2>
        </div>

        <div className="flex-1 relative container-tight mx-auto w-full flex items-center justify-center">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          {features.map((_, index) => (
            <ProgressDot
              key={index}
              index={index}
              smoothProgress={smoothProgress}
              total={features.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
