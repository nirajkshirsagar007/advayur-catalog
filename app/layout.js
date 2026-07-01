import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Advayur | Premium Ayurvedic Catalog",
  description: "Explore Advayur's premium range of authentic Ayurvedic products crafted to revitalize, nourish, and restore wellness naturally.",
  keywords: "Ayurveda, Organic Wellness, Advayur, Herbal Remedies, Skin Care, Wellness Tonic",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-amber-50 text-emerald-950">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-amber-50/80 backdrop-blur-md border-b border-emerald-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="/" className="group flex flex-col">
                <span className="font-serif text-2xl tracking-widest text-emerald-950 font-bold uppercase transition-colors group-hover:text-emerald-800">
                  Advayur
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold font-sans font-medium -mt-1">
                  Pure Ayurvedic Wellness
                </span>
              </a>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-medium text-emerald-950/80">
              <a href="/" className="hover:text-emerald-800 transition-colors">Home</a>
              <a href="#about" className="hover:text-emerald-800 transition-colors">Our Philosophy</a>
              <a href="#contact" className="hover:text-emerald-800 transition-colors">Support</a>
            </nav>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://wa.me/91XXXXXXXXXX" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-xs font-semibold px-4 py-2 rounded-full tracking-wider uppercase transition-colors duration-200"
              >
                Inquire
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer id="contact" className="bg-emerald-950 text-amber-50/80 border-t border-emerald-900/20 py-12 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-xl text-amber-50 tracking-wider mb-4">ADVAYUR</h3>
              <p className="text-sm text-amber-50/60 leading-relaxed max-w-sm">
                Rooted in ancient wisdom, crafted for modern life. Advayur brings you pure botanical remedies to align mind, body, and spirit.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-md text-amber-50 tracking-wider mb-4">Philosophy</h4>
              <ul className="space-y-2 text-sm text-amber-50/60">
                <li>100% Organic Ingredients</li>
                <li>Ethically Sourced Herbs</li>
                <li>Traditional Formulation</li>
                <li>Cruelty-Free & Natural</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-md text-amber-50 tracking-wider mb-4">Contact Support</h4>
              <p className="text-sm text-amber-50/60 mb-2">Have questions about our remedies?</p>
              <a 
                href="https://wa.me/91XXXXXXXXXX?text=Hi%20Advayur!%20I%20have%20a%20question%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-gold hover:underline text-sm font-medium"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-amber-50/10 text-center text-xs text-amber-50/40">
            &copy; {new Date().getFullYear()} Advayur Wellness. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
