"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

export default function Header({ whatsappNumber = "917038369618" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-foreground/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href="/" className="group flex items-center">
            <Logo className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" showText={true} />
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto mr-8 items-center gap-8 font-sans text-sm font-medium text-foreground/80">
          <a href="/" className="hover:text-primary-green transition-colors">Home</a>
          <a href="/#about" className="hover:text-primary-green transition-colors">About</a>
          <a href="/#catalog" className="hover:text-primary-green transition-colors">Products</a>
          <a href="/#contact-support" className="hover:text-primary-green transition-colors">Contact</a>
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href={`https://wa.me/${whatsappNumber}?text=Hi%20Advayur!%20I%20have%20a%20question%20about%20your%20products.`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-primary-green hover:opacity-95 text-white text-xs font-semibold px-4 py-2 rounded-full tracking-wider uppercase transition-all duration-200"
          >
            Inquire
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground hover:text-primary-green focus:outline-none p-2 rounded-lg cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                /* Cross icon */
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                /* Hamburger icon */
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-foreground/10 px-4 pt-2 pb-6 space-y-3 shadow-lg absolute w-full left-0 animate-fade-in-down">
          <div className="flex flex-col gap-4 py-2 font-medium text-base text-foreground/80">
            <a 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="hover:text-primary-green py-2 border-b border-foreground/5 transition-colors"
            >
              Home
            </a>
            <a 
              href="/#about" 
              onClick={() => setIsOpen(false)}
              className="hover:text-primary-green py-2 border-b border-foreground/5 transition-colors"
            >
              About
            </a>
            <a 
              href="/#catalog" 
              onClick={() => setIsOpen(false)}
              className="hover:text-primary-green py-2 border-b border-foreground/5 transition-colors"
            >
              Products
            </a>
            <a 
              href="/#contact-support" 
              onClick={() => setIsOpen(false)}
              className="hover:text-primary-green py-2 border-b border-foreground/5 transition-colors"
            >
              Contact
            </a>
            
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hi%20Advayur!%20I%20have%20a%20question%20about%20your%20products.`}
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-primary-green text-white text-sm font-semibold py-3 rounded-xl tracking-wider uppercase shadow-sm"
            >
              Inquire via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
