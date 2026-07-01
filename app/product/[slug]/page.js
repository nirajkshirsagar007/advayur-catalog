import Link from "next/link";
import { notFound } from "next/navigation";
import products from "@/data/products.json";

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Pre-populated message text
  const rawMessage = `Hi Advayur! I am visiting your website and I would like to order ${product.name} for ₹${product.price}. Please let me know how to proceed with payment and shipping!`;
  
  // URL encode the message cleanly
  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/917038369618?text=${encodedMessage}`;

  return ( 
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-sans font-semibold tracking-widest uppercase text-emerald-950/50 mb-10">
          <Link href="/" className="hover:text-emerald-800 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-emerald-950">{product.name}</span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Product Visuals */}
          <div className="glass-card rounded-3xl p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="aspect-[4/5] w-full bg-emerald-950/5 rounded-2xl relative overflow-hidden flex items-center justify-center border border-emerald-950/5">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent"></div>
                  
                  {/* Premium botanical graphic element */}
                  <svg className="w-32 h-32 text-emerald-800/20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C8.38,19.9 10.2,19.34 11.75,18.06C14.89,15.5 16,11.5 17,8M12,2A15,15 0 0,0 2,17C2,17 7,12 12,12C12,12 11,17 16,17C21,17 22,2 22,2C22,2 17,2 12,2Z" />
                  </svg>
                </>
              )}

              <span className="absolute top-4 left-4 bg-emerald-950 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                Premium Grade
              </span>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-accent-gold block mb-2">
                Advayur Apothecary
              </span>
              
              <h1 className="font-serif text-4xl md:text-5xl text-emerald-950 font-bold tracking-wide leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price Tag */}
              <div className="inline-flex items-baseline gap-2 py-2 px-4 rounded-xl bg-emerald-950/5 border border-emerald-950/5 mb-8">
                <span className="text-sm font-sans text-emerald-950/60 uppercase tracking-wider font-semibold">Price:</span>
                <span className="text-2xl font-sans font-bold text-emerald-950">₹{product.price}</span>
              </div>

              {/* Description */}
              <div className="border-t border-emerald-950/10 pt-6 mb-8">
                <h3 className="font-serif text-lg text-emerald-950 font-semibold mb-3">About the Remedy</h3>
                <p className="font-sans text-emerald-950/80 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="border-t border-emerald-950/10 pt-6 mb-8">
                <h3 className="font-serif text-lg text-emerald-950 font-semibold mb-4">Proven Benefits</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex gap-3 text-sm text-emerald-950/90 font-sans items-start">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-800/10 flex items-center justify-center text-emerald-800 mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* WhatsApp Checkout Button */}
            <div className="border-t border-emerald-950/10 pt-8 mt-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#25D366' }}
                className="w-full flex items-center justify-center gap-3 text-white font-sans text-base font-bold uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:brightness-95 active:scale-[0.98]"
              >
                {/* Custom WhatsApp Icon SVG */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.966 14.122 1.399 12.01 1.399c-5.437 0-9.863 4.373-9.867 9.803-.001 1.73.457 3.417 1.32 4.937l-1.01 3.693 3.794-.98zM17.65 14.546c-.3-.15-1.774-.865-2.047-.964-.272-.1-.471-.15-.669.15-.198.299-.769.964-.943 1.162-.173.199-.347.223-.647.074-.3-.15-1.267-.462-2.413-1.471-.892-.787-1.493-1.758-1.668-2.056-.173-.299-.018-.46.131-.609.135-.134.3-.349.449-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.523-.075-.15-.669-1.597-.916-2.189-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.168 5.076 4.437.709.301 1.264.482 1.696.618.713.224 1.36.19 1.872.114.571-.085 1.774-.717 2.022-1.412.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                <span>Order via WhatsApp</span>
              </a>
              <p className="text-center text-xs text-emerald-950/40 mt-3 font-sans">
                Secure checkout. Open in WhatsApp to finalize details and shipping address.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
