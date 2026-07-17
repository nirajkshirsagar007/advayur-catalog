"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Home() {
  const tHero = useTranslations("Hero");
  const tCatalog = useTranslations("Catalog");
  const tAbout = useTranslations("About");
  const tFeatures = useTranslations("Features");
  const tTestimonials = useTranslations("Testimonials");
  const tFAQ = useTranslations("FAQ");
  const tContact = useTranslations("Contact");
  const locale = useLocale();

  const [activeFilter, setActiveFilter] = useState("all");
  const [productsList, setProductsList] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("917038369618");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductsList(data);
        }
      })
      .catch((err) => console.error("Failed to load live catalog:", err));

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.whatsappNumber) {
          setWhatsappNumber(data.whatsappNumber);
        }
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const filteredProducts = productsList.filter((product) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "soaps" && product.category === "Soap") return true;
    if (activeFilter === "facewash" && product.category === "Face Wash") return true;
    if (activeFilter === "lipcare" && product.category === "Lip Care") return true;
    if (activeFilter === "candles" && product.category === "Candles") return true;
    return false;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-28 md:pt-32 md:pb-36 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-green/10 via-background to-background border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/10 bg-background/50 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse"></span>
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-foreground/80">
              {tHero("badge")}
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-foreground tracking-tight leading-tight max-w-4xl mx-auto font-semibold">
            {tHero("title1")} <span className="italic text-primary-green">{tHero("title2")}</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-foreground/75 font-sans max-w-3xl mx-auto leading-relaxed">
            {tHero("subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#catalog"
              className="bg-primary-green hover:opacity-95 text-white font-sans text-sm font-semibold px-8 py-3.5 rounded-full tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              {tHero("explore_btn")}
            </a>
            <a
              href="#about"
              className="border border-foreground/20 hover:border-foreground/40 text-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-full tracking-wider uppercase transition-all duration-300 bg-background/20 hover:bg-background/80"
            >
              {tHero("philosophy_btn")}
            </a>
          </div>
        </div>

        {/* Dynamic backgrounds design */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-green/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-accent-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-foreground/5 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="font-serif text-lg italic text-accent-gold block mb-2">{tAbout("subheading")}</span>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold tracking-wide mb-6">
              {tAbout("title")}
            </h2>
            <p className="text-foreground/80 font-sans leading-relaxed text-base mb-6">
              {tAbout("desc1")}
            </p>
            <div className="h-px w-24 bg-accent-gold"></div>
          </div>
          <div className="glass-card rounded-3xl p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold">{tAbout("promise_title")}</h3>
            <p className="text-foreground/75 font-sans leading-relaxed text-sm">
              {tAbout("promise_desc")}
            </p>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-green font-sans">
              {tAbout("promise_tags")}
            </span>
          </div>
        </div>
      </section>

      {/* Why Choose Advayur Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-foreground/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground tracking-wide font-semibold">
            {tFeatures("title")}
          </h2>
          <div className="h-0.5 w-16 bg-accent-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover-lift">
            <span className="text-3xl block mb-4">🌿</span>
            <h3 className="font-serif text-lg font-bold mb-2">{tFeatures("f1_title")}</h3>
            <p className="text-foreground/70 text-sm font-sans leading-relaxed">
              {tFeatures("f1_desc")}
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover-lift">
            <span className="text-3xl block mb-4">🌱</span>
            <h3 className="font-serif text-lg font-bold mb-2">{tFeatures("f2_title")}</h3>
            <p className="text-foreground/70 text-sm font-sans leading-relaxed">
              {tFeatures("f2_desc")}
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover-lift">
            <span className="text-3xl block mb-4">🛡️</span>
            <h3 className="font-serif text-lg font-bold mb-2">{tFeatures("f3_title")}</h3>
            <p className="text-foreground/70 text-sm font-sans leading-relaxed">
              {tFeatures("f3_desc")}
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-2xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover-lift">
            <span className="text-3xl block mb-4">💚</span>
            <h3 className="font-serif text-lg font-bold mb-2">{tFeatures("f4_title")}</h3>
            <p className="text-foreground/70 text-sm font-sans leading-relaxed">
              {tFeatures("f4_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-foreground/5 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground tracking-wide font-semibold">
            {tCatalog("title")}
          </h2>
          <div className="h-0.5 w-16 bg-accent-gold mx-auto mt-4"></div>
          <p className="mt-4 text-foreground/60 font-sans">
            {tCatalog("subtitle")}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 font-sans">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeFilter === "all"
              ? "bg-primary-green text-white shadow-md"
              : "border border-foreground/10 text-foreground hover:bg-foreground/5 bg-background"
              }`}
          >
            {tCatalog("filter_all")}
          </button>
          <button
            onClick={() => setActiveFilter("soaps")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeFilter === "soaps"
              ? "bg-primary-green text-white shadow-md"
              : "border border-foreground/10 text-foreground hover:bg-foreground/5 bg-background"
              }`}
          >
            {tCatalog("filter_soaps")}
          </button>
          <button
            onClick={() => setActiveFilter("facewash")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeFilter === "facewash"
              ? "bg-primary-green text-white shadow-md"
              : "border border-foreground/10 text-foreground hover:bg-foreground/5 bg-background"
              }`}
          >
            {tCatalog("filter_facewash")}
          </button>
          <button
            onClick={() => setActiveFilter("lipcare")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeFilter === "lipcare"
              ? "bg-primary-green text-white shadow-md"
              : "border border-foreground/10 text-foreground hover:bg-foreground/5 bg-background"
              }`}
          >
            {tCatalog("filter_lipcare")}
          </button>
          <button
            onClick={() => setActiveFilter("candles")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeFilter === "candles"
              ? "bg-primary-green text-white shadow-md"
              : "border border-foreground/10 text-foreground hover:bg-foreground/5 bg-background"
              }`}
          >
            {tCatalog("filter_candles")}
          </button>
        </div>

        {/* Product Cards Grid */}
        {activeFilter === "candles" && filteredProducts.length === 0 ? (
          /* Premium Teaser for Scented Candles */
          <div className="max-w-4xl mx-auto glass-card rounded-3xl p-10 md:p-16 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-gold via-secondary-sage to-accent-gold"></div>
            <span className="text-5xl block mb-6 animate-pulse">🕯️</span>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-gold block mb-2 font-sans">
              {tCatalog("sneak_peek")}
            </span>
            <h3 className="font-serif text-3xl text-foreground font-semibold mb-4">
              {tCatalog("candles_title")}
            </h3>
            <p className="text-foreground/75 font-sans leading-relaxed max-w-xl mx-auto mb-8 text-base">
              {tCatalog("candles_desc")}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green/10 border border-primary-green/20 text-xs font-sans font-bold text-primary-green uppercase tracking-wide">
              <span>{tCatalog("coming_soon")}</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const productName = product[`name_${locale}`] || product.name;
              const productDesc = product[`description_${locale}`] || product.description;
              const productBenefits = product[`benefits_${locale}`] || product.benefits || [];

              return (
                <div
                  key={product.id}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between hover-lift border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300"
                >
                  <div>
                    {/* Visual Placeholders */}
                    <div className="aspect-[4/5] w-full bg-foreground/5 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-foreground/5">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent"></div>
                          <svg className="w-16 h-16 text-primary-green/20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C8.38,19.9 10.2,19.34 11.75,18.06C14.89,15.5 16,11.5 17,8M12,2A15,15 0 0,0 2,17C2,17 7,12 12,12C12,12 11,17 16,17C21,17 22,2 22,2C22,2 17,2 12,2Z" />
                          </svg>
                        </>
                      )}

                      {/* Category Pill */}
                      <span className="absolute bottom-3 left-3 bg-background/90 text-foreground text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-foreground/5">
                        {product.category || "Ayurveda"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl text-foreground font-medium group-hover:text-primary-green transition-colors">
                      {productName}
                    </h3>

                    <p className="mt-2 text-foreground/65 font-sans text-sm line-clamp-2 leading-relaxed">
                      {productDesc}
                    </p>

                    {/* Features Tags */}
                    {product.features && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {product.features.map((feature, idx) => (
                          <span key={idx} className="bg-primary-green/5 text-primary-green text-[10px] font-sans font-semibold px-2 py-0.5 rounded border border-primary-green/10">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Benefits Preview */}
                    <div className="mt-4 pt-4 border-t border-foreground/5">
                      <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-primary-green/60 mb-2">{tCatalog("key_benefits")}</p>
                      <ul className="space-y-1">
                        {productBenefits.slice(0, 2).map((benefit, index) => (
                          <li key={index} className="text-xs text-foreground/85 font-sans flex items-start gap-1.5">
                            <span className="text-secondary-sage mt-0.5">•</span>
                            <span className="line-clamp-1">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-foreground/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-sans text-foreground/50 uppercase tracking-widest block">{tCatalog("price")}</span>
                      <span className="font-sans text-lg font-bold text-foreground">₹{product.price}</span>
                    </div>

                    <Link
                      href={`/${locale}/product/${product.slug}`}
                      className="bg-primary-green hover:opacity-95 text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-full tracking-wider uppercase transition-colors"
                    >
                      {tCatalog("view_details")}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-foreground/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-serif text-lg italic text-accent-gold block mb-2">{tTestimonials("subheading")}</span>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground tracking-wide font-semibold">
            {tTestimonials("title")}
          </h2>
          <div className="h-0.5 w-16 bg-accent-gold mx-auto mt-4"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center glass-card p-10 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] relative">
          <span className="text-6xl text-primary-green/10 absolute top-4 left-6 font-serif">“</span>
          <p className="font-serif text-xl italic text-foreground/85 leading-relaxed relative z-10">
            {tTestimonials("quote")}
          </p>
          <div className="h-px w-12 bg-accent-gold mx-auto my-6"></div>
          <span className="text-xs font-bold uppercase tracking-widest font-sans text-foreground/60">
            {tTestimonials("verified")}
          </span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-foreground/5">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground tracking-wide font-semibold">
            {tFAQ("title")}
          </h2>
          <div className="h-0.5 w-16 bg-accent-gold mx-auto mt-4"></div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/60">
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">{tFAQ("q1")}</h3>
            <p className="text-sm text-foreground/75 font-sans leading-relaxed">
              {tFAQ("a1")}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/60">
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">{tFAQ("q2")}</h3>
            <p className="text-sm text-foreground/75 font-sans leading-relaxed">
              {tFAQ("a2")}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/60">
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">{tFAQ("q3")}</h3>
            <p className="text-sm text-foreground/75 font-sans leading-relaxed">
              {tFAQ("a3")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-primary-green text-background py-24 relative overflow-hidden scroll-mt-20 min-h-[80vh] flex flex-col justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="font-serif text-lg italic text-accent-gold block mb-2">{tContact("subheading")}</span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-6">{tContact("title")}</h2>
          <p className="text-background/80 font-sans max-w-2xl mx-auto leading-relaxed mb-8">
            {tContact("desc")}
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hi%20Advayur!%20I%20have%20a%20question%20about%20your%20products.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent-gold text-white font-sans text-sm font-bold uppercase tracking-wider py-4 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            {tContact("btn")}
          </a>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>
    </div>
  );
}
