'use client'

import { useState, useRef, useEffect } from 'react'
import { GripVertical, Sparkles, Droplets } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percentage = (x / rect.width) * 100
    setPosition(percentage)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    updatePosition(e.clientX)
  }

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      updatePosition(e.clientX)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging])

  return (
    <section ref={sectionRef} className="section-padding bg-white overflow-hidden">
      <motion.div
        className="container-wide"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-center mb-12">
          <span className="badge-botanical mb-3 inline-block">Real Results</span>
          <h2 className="font-display text-display-sm text-graphite mb-3">
            See The Transformation
          </h2>
          <p className="text-body-lg text-graphite/60 max-w-2xl mx-auto">
            Drag the precision divider to reveal the molecular cleaning power of active citric foam.
          </p>
        </div>

        {/* Main Interactive Draggable Slider */}
        <div
          ref={containerRef}
          className="relative max-w-4xl mx-auto aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-card select-none cursor-ew-resize group border border-graphite/10"
          onPointerDown={handlePointerDown}
        >
          {/* Layer 1: Before (Limescale & Hardwater Buildup) */}
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/limescale-before-after.svg"
              alt="Untreated Limescale"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
          <span className="absolute top-6 left-6 px-3.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md z-10 pointer-events-none border border-white/20">
            BEFORE • 3 Yrs Limescale
          </span>

          {/* Layer 2: After (Pure Chrome Restore with clipPath) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/limescale-before-after.svg"
              alt="Restored Chrome Mirror Finish"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'right' }}
            />
          </div>
          <span className="absolute top-6 right-6 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-glow z-10 pointer-events-none">
            AFTER • Citrafoam Pure Shine
          </span>

          {/* Draggable Divider Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.4)] z-20 pointer-events-none"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full border-2 border-emerald-500 shadow-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <GripVertical className="w-5 h-5 text-emerald-700" />
            </div>
          </div>
        </div>

        {/* 2-Column Side-by-Side Specific Applications */}
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Showcase 1: Bathroom Chrome */}
          <div className="rounded-3xl overflow-hidden glass p-6 flex flex-col gap-4 border border-graphite/5 shadow-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-botanical-600" />
                <h3 className="font-display font-semibold text-graphite text-base">
                  Bathroom Chrome &amp; Glass
                </h3>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Single Spray
              </span>
            </div>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden relative border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/limescale-action.svg"
                alt="Bathroom Chrome Restored"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-graphite/60 leading-relaxed">
              Citric micro-foam clings vertically to shower screens and taps, converting insoluble calcium deposits into easily rinsed calcium citrate.
            </p>
          </div>

          {/* Showcase 2: Copper & Brass Restoration */}
          <div className="rounded-3xl overflow-hidden glass p-6 flex flex-col gap-4 border border-graphite/5 shadow-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brass-600" />
                <h3 className="font-display font-semibold text-graphite text-base">
                  Heirloom Copper &amp; Brass
                </h3>
              </div>
              <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                Zero Scratch
              </span>
            </div>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden relative border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/copper-before-after.svg"
                alt="Copper Tarnish Lifted"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-graphite/60 leading-relaxed">
              Dissolves oxidised verdigris in under 2 minutes without harsh abrasive scratching, depositing an invisible anti-tarnish micro-film.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
