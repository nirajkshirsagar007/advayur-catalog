export default function Logo({ className = "w-10 h-10", showText = true }) {
  return (
    <div className="flex items-center gap-3">
      {/* Premium Leaf Logo Emblem */}
      <svg
        className={`${className} text-emerald-800`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shadow background */}
        <circle cx="50" cy="50" r="46" fill="currentColor" fillOpacity="0.03" />
        
        {/* Gold Accent Ring */}
        <circle cx="50" cy="50" r="44" stroke="#b38b4d" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
        
        {/* First Leaf (Deep Emerald) */}
        <path
          d="M50 20C50 20 68 35 68 54C68 70 56 80 50 80C44 80 32 70 32 54C32 35 50 20 50 20Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
        
        {/* Second Leaf (Gold/Warm overlay) */}
        <path
          d="M50 20C50 20 62 38 60 56C58 72 50 78 50 78C50 78 42 72 40 56C38 38 50 20 50 20Z"
          fill="#b38b4d"
          fillOpacity="0.9"
        />
        
        {/* Leaf Vein Center Lines */}
        <path
          d="M50 20V78"
          stroke="#fdfbf7"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Delicate side veins */}
        <path
          d="M50 38Q56 42 58 46"
          stroke="#fdfbf7"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M50 48Q58 52 59 58"
          stroke="#fdfbf7"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M50 42Q44 46 42 50"
          stroke="#fdfbf7"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M50 52Q42 56 41 62"
          stroke="#fdfbf7"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-serif text-2xl tracking-widest text-emerald-950 font-bold uppercase transition-colors">
            Advayur
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold font-sans font-medium -mt-1">
            Pure Ayurvedic Wellness
          </span>
        </div>
      )}
    </div>
  );
}
