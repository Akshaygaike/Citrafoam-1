import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { footerLinks } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-graphite text-white pt-16 pb-8 border-t border-graphite/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/citrafoam-logo-header.png"
                alt="Citrafoam"
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Premium, citric acid-powered foam cleaners for a scientifically cleaner home.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/citrafoam.co?stkn=MTJubGd4YjZ2czd5aA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Citrafoam on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Youtube"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-white">Shop Formulas</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4 text-white">Science &amp; Mission</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4 text-white">Customer Care</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Citrafoam Labs. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
