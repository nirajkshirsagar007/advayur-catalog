import { Playfair_Display, Outfit } from "next/font/google";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import { getGlobalSettings } from "@/lib/settings";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "@/app/[locale]/globals.css";

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
  title: "Admin Panel | Advayur",
  description: "Advayur Admin Panel",
};

export default async function AdminLayout({ children }) {
  const settings = await getGlobalSettings();
  const whatsappNumber = settings.whatsappNumber;
  const messages = await getMessages({ locale: "en" });
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased font-sans">
        <NextIntlClientProvider locale="en" messages={messages}>
          {/* Navigation Bar */}
          <Header whatsappNumber={whatsappNumber} />

          {/* Main Content */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer id="site-footer" className="bg-primary-green text-background/80 border-t border-foreground/10 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-4">
                <Logo className="w-10 h-10 text-accent-gold" showText={true} />
                <p className="text-sm text-background/70 leading-relaxed max-w-sm">
                  {messages.Footer?.desc || "Rooted in ancient beauty rituals, crafted for modern life. Advayur brings you handmade organic soaps, face washes, and lip care to elevate your daily skincare."}
                </p>
              </div>
              <div>
                <h4 className="font-serif text-md text-background tracking-wider mb-4">{messages.Footer?.philosophy || "Philosophy"}</h4>
                <ul className="space-y-2 text-sm text-background/70">
                  <li>{messages.Footer?.p1 || "100% Organic Botanical Extracts"}</li>
                  <li>{messages.Footer?.p2 || "Cold-Pressed Oils & Butters"}</li>
                  <li>{messages.Footer?.p3 || "Traditional Soap Curing Methods"}</li>
                  <li>{messages.Footer?.p4 || "Cruelty-Free & Zero Parabens"}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-serif text-md text-background tracking-wider mb-4">{messages.Footer?.support || "Contact Support"}</h4>
                <p className="text-sm text-background/70 mb-2">{messages.Footer?.q_text || "Have questions about our remedies?"}</p>
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=Hi%20Advayur!%20I%20have%20a%20question%20about%20your%20products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-gold hover:underline text-sm font-medium block mb-4"
                >
                  {messages.Footer?.chat || "Chat on WhatsApp"}
                </a>
                <div className="pt-2 border-t border-background/10">
                  <a 
                    href="/admin/login" 
                    className="text-xs text-background/50 hover:text-accent-gold transition-colors font-medium tracking-wide uppercase"
                  >
                    {messages.Footer?.admin || "Admin Portal \u2192"}
                  </a>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-background/10 text-center text-xs text-background/40">
              {messages.Footer?.copyright ? messages.Footer.copyright.replace("{year}", currentYear) : `\u00A9 ${currentYear} Advayur Wellness. All rights reserved.`}
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
