"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function Header({ whatsappNumber = "917038369618" }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname(); // e.g., /en/about or /hi/about

  const handleLanguageChange = (e) => {
    const nextLocale = e.target.value;
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.replace(`/${nextLocale}${currentPathWithoutLocale}`);
  };

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Check if we are on the home page
    const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
    
    if (isHomePage) {
      if (targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(`/${locale}/#${targetId === "home" ? "" : targetId}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-foreground/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href={`/${locale}`} className="group flex items-center">
            <Logo className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" showText={true} />
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto mr-8 items-center gap-8 font-sans text-sm font-medium text-foreground/80">
          <a href={`/${locale}`} onClick={(e) => handleScroll(e, 'home')} className="hover:text-primary-green transition-colors">{t("home")}</a>
          <a href={`/${locale}/#about`} onClick={(e) => handleScroll(e, 'about')} className="hover:text-primary-green transition-colors">{t("about")}</a>
          <a href={`/${locale}/#catalog`} onClick={(e) => handleScroll(e, 'catalog')} className="hover:text-primary-green transition-colors">{t("catalog")}</a>
          <a href={`/${locale}/#contact`} onClick={(e) => handleScroll(e, 'contact')} className="hover:text-primary-green transition-colors">{t("contact")}</a>
        </nav>
        
        {/* Desktop CTA & Language Switcher */}
        <div className="hidden md:flex items-center gap-4">
          <select 
            value={locale} 
            onChange={handleLanguageChange}
            className="bg-transparent border border-foreground/20 text-foreground text-sm rounded-md px-2 py-1 outline-none focus:border-primary-green cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="mr">MR</option>
          </select>
          
          <a 
            href={`https://wa.me/${whatsappNumber}?text=Hi%20Advayur!%20I%20have%20a%20question%20about%20your%20products.`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-primary-green hover:opacity-95 text-white text-xs font-semibold px-4 py-2 rounded-full tracking-wider uppercase transition-all duration-200"
          >
            {t("inquire")}
          </a>
        </div>

        {/* Mobile Hamburger Button & Language Switcher */}
        <div className="flex md:hidden items-center gap-3">
          <select 
            value={locale} 
            onChange={handleLanguageChange}
            className="bg-transparent border border-foreground/20 text-foreground text-xs rounded-md px-1 py-1 outline-none"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="mr">MR</option>
          </select>
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
              href={`/${locale}`} 
              onClick={(e) => handleScroll(e, 'home')}
              className="hover:text-primary-green py-2 border-b border-foreground/5 transition-colors"
            >
              {t("home")}
            </a>
            <a 
              href={`/${locale}/#about`} 
              onClick={(e) => handleScroll(e, 'about')}
              className="hover:text-primary-green py-2 border-b border-foreground/5 transition-colors"
            >
              {t("about")}
            </a>
            <a 
              href={`/${locale}/#catalog`} 
              onClick={(e) => handleScroll(e, 'catalog')}
              className="hover:text-primary-green py-2 border-b border-foreground/5 transition-colors"
            >
              {t("catalog")}
            </a>
            <a 
              href={`/${locale}/#contact`} 
              onClick={(e) => handleScroll(e, 'contact')}
              className="hover:text-primary-green py-2 border-b border-foreground/5 transition-colors"
            >
              {t("contact")}
            </a>
            
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hi%20Advayur!%20I%20have%20a%20question%20about%20your%20products.`}
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-primary-green text-white text-sm font-semibold py-3 rounded-xl tracking-wider uppercase shadow-sm"
            >
              {t("inquire_whatsapp")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
