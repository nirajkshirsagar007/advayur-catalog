import Link from "next/link";
import products from "@/data/products.json";

export default function Home() {
  return (
    <div className="bg-amber-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-amber-50 to-amber-50 border-b border-emerald-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-950/10 bg-amber-50/50 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse"></span>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-emerald-950/80">
              Handmade Bath &amp; Beauty Rituals
            </span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-emerald-950 tracking-tight leading-tight max-w-4xl mx-auto font-semibold">
            Pure Ayurvedic Skincare &amp; <span className="italic text-emerald-900">Daily Glow</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-emerald-950/70 font-sans max-w-2xl mx-auto leading-relaxed">
            Experience luxury handmade soaps, purifying face washes, and nourishing lip care crafted to rejuvenate, protect, and heal your skin naturally.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a 
              href="#catalog"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-sm font-semibold px-8 py-3.5 rounded-full tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Explore our soaps &amp; skincare
            </a>
            <a 
              href="#about"
              className="border border-emerald-950/20 hover:border-emerald-950/40 text-emerald-950 font-sans text-sm font-semibold px-8 py-3.5 rounded-full tracking-wider uppercase transition-all duration-300 bg-amber-50/20 hover:bg-amber-50/80"
            >
              Our Heritage
            </a>
          </div>
        </div>

        {/* Dynamic backgrounds design */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-800/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-accent-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Catalog Grid Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-emerald-950 tracking-wide font-semibold">
            Signature Bath &amp; Beauty Remedies
          </h2>
          <div className="h-0.5 w-16 bg-accent-gold mx-auto mt-4"></div>
          <p className="mt-4 text-emerald-950/60 font-sans">
            Hand-crafted in micro-batches with cold-pressed botanical oils, organic butters, and skin-purifying herbs.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover-lift border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300"
            >
              <div>
                {/* Visual Placeholders */}
                <div className="aspect-[4/5] w-full bg-emerald-950/5 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-emerald-950/5">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent"></div>
                      
                      {/* Subtle Ayurvedic leaf outline representation using pure CSS/SVG */}
                      <svg className="w-16 h-16 text-emerald-800/20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C8.38,19.9 10.2,19.34 11.75,18.06C14.89,15.5 16,11.5 17,8M12,2A15,15 0 0,0 2,17C2,17 7,12 12,12C12,12 11,17 16,17C21,17 22,2 22,2C22,2 17,2 12,2Z" />
                      </svg>
                    </>
                  )}
                  
                  {/* Category Pill */}
                  <span className="absolute bottom-3 left-3 bg-amber-50/90 text-emerald-950 text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-emerald-950/5">
                    100% Organic
                  </span>
                </div>

                <h3 className="font-serif text-xl text-emerald-950 font-medium group-hover:text-emerald-800 transition-colors">
                  {product.name}
                </h3>
                
                <p className="mt-2 text-emerald-950/65 font-sans text-sm line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Benefits Preview */}
                <div className="mt-4 pt-4 border-t border-emerald-900/5">
                  <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-900/60 mb-2">Key Benefits</p>
                  <ul className="space-y-1">
                    {product.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index} className="text-xs text-emerald-950/80 font-sans flex items-start gap-1.5">
                        <span className="text-emerald-800 mt-0.5">•</span>
                        <span className="line-clamp-1">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-900/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-sans text-emerald-950/50 uppercase tracking-widest block">Price</span>
                  <span className="font-sans text-lg font-bold text-emerald-950">₹{product.price}</span>
                </div>
                
                <Link 
                  href={`/product/${product.slug}`}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-full tracking-wider uppercase transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Heritage Section */}
      <section id="about" className="bg-emerald-950 text-amber-50 py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="font-serif text-lg italic text-accent-gold block mb-2">Our Heritage &amp; Promise</span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-6">Ancient Skincare Wisdom for Modern Rituals</h2>
          <p className="text-amber-50/70 font-sans max-w-3xl mx-auto leading-relaxed mb-8">
            At Advayur, we believe that glowing, healthy skin comes from feeding it pure, living nutrition. 
            Every single batch of our handmade bathing soaps, refreshing face washes, and lip balms is created using cold-pressed oils, 
            fresh botanicals, and traditional Ayurvedic fermentation processes designed to cleanse without stripping your skin.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-amber-50/10">
            <div>
              <p className="font-serif text-2xl text-accent-gold font-bold">100%</p>
              <p className="text-xs font-sans uppercase tracking-widest text-amber-50/50 mt-1">Cold-Pressed Oils</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-accent-gold font-bold">Zero</p>
              <p className="text-xs font-sans uppercase tracking-widest text-amber-50/50 mt-1">Chemical Foaming Agents</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-accent-gold font-bold">Small</p>
              <p className="text-xs font-sans uppercase tracking-widest text-amber-50/50 mt-1">Batch Formulated</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-accent-gold font-bold">Pure</p>
              <p className="text-xs font-sans uppercase tracking-widest text-amber-50/50 mt-1">Forest-Sourced Honey &amp; Herbs</p>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>
      </section>
    </div>
  );
}
