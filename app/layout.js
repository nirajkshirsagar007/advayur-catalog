import { Playfair_Display, Outfit } from "next/font/google";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
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
  title: "Advayur | Natural Ayurvedic Wellness",
  description:
    "Explore Advayur's collection of Ayurvedic wellness and personal care products crafted with natural ingredients and inspired by traditional Ayurvedic wisdom. Discover quality, purity, and holistic care for everyday living.",
  keywords:
    "Advayur, Ayurveda, Ayurvedic wellness, Natural products, Herbal products, Personal care, Herbal skincare, Holistic wellness, Natural ingredients, Traditional Ayurveda",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer id="contact" className="bg-primary-green text-background/80 border-t border-foreground/10 py-12 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <Logo className="w-10 h-10 text-accent-gold" showText={true} />
              <p className="text-sm text-background/70 leading-relaxed max-w-sm">
                Rooted in ancient beauty rituals, crafted for modern life. Advayur brings you handmade organic soaps, face washes, and lip care to elevate your daily skincare.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-md text-background tracking-wider mb-4">Philosophy</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>100% Organic Botanical Extracts</li>
                <li>Cold-Pressed Oils &amp; Butters</li>
                <li>Traditional Soap Curing Methods</li>
                <li>Cruelty-Free &amp; Zero Parabens</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-md text-background tracking-wider mb-4">Contact Support</h4>
              <p className="text-sm text-background/70 mb-2">Have questions about our remedies?</p>
              <a 
                href="https://wa.me/917038369618?text=Hi%20Advayur!%20I%20have%20a%20question%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-gold hover:underline text-sm font-medium block mb-4"
              >
                Chat on WhatsApp
              </a>
              <div className="pt-2 border-t border-background/10">
                <a 
                  href="/admin/login" 
                  className="text-xs text-background/50 hover:text-accent-gold transition-colors font-medium tracking-wide uppercase"
                >
                  Admin Portal &rarr;
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-background/10 text-center text-xs text-background/40">
            &copy; {new Date().getFullYear()} Advayur Wellness. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
