'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/constants';
import { useCartStore } from '@/store/cart-store';
import { MobileMenu } from './MobileMenu';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { items, isOpen: cartOpen, openCart, closeCart } = useCartStore();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center",
          scrolled ? "bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-sm" : "bg-porcelain/85 backdrop-blur-md"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-graphite hover:text-[#C88A58] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center justify-center flex-1 md:flex-none">
            <Link href="/" className="flex items-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/citrafoam-logo-header.png"
                alt="Citrafoam"
                className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-graphite/80 hover:text-graphite transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C88A58] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/products"
              className="p-2 text-graphite/80 hover:text-graphite transition-colors hidden sm:block"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/account"
              className="p-2 text-graphite/80 hover:text-graphite transition-colors hidden sm:block"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={openCart}
              className="p-2 text-graphite hover:text-[#C88A58] transition-colors relative cursor-pointer"
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#111827] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white/30 shadow-sm animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={closeCart} />
    </>
  );
}
