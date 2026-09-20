'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, User, Instagram } from 'lucide-react';
import { navLinks } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: 'tween', duration: 0.3, ease: 'easeOut' } },
    exit: { x: '-100%', transition: { type: 'tween', duration: 0.3, ease: 'easeIn' } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.1 }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-graphite/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm h-full bg-porcelain flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 px-6 border-b border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/citrafoam-logo-header.png"
                alt="Citrafoam"
                className="h-7 w-auto object-contain"
              />
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-graphite hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-6">
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div custom={i} variants={itemVariants} initial="hidden" animate="visible" key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="text-3xl font-display font-medium text-graphite hover:text-botanical-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col space-y-4">
              <Link href="/search" onClick={onClose} className="flex items-center space-x-3 text-graphite font-medium">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
              <Link href="/account" onClick={onClose} className="flex items-center space-x-3 text-graphite font-medium">
                <User className="w-5 h-5" />
                <span>Account</span>
              </Link>
              <a
                href="https://www.instagram.com/citrafoam.co?stkn=MTJubGd4YjZ2czd5aA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-graphite font-medium hover:text-[#00AA55] transition-colors"
                aria-label="Citrafoam on Instagram"
              >
                <Instagram className="w-5 h-5 text-[#00AA55]" />
                <span>Instagram (@citrafoam.co)</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
