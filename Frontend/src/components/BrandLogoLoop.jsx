import React from "react";
import {
  CrownOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const PURE_IMAGES = [
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
];

const BIG_LETTERS = [
  "ALEXANDRE LUXE ★",
  "HAUTE COUTURE ★",
  "PARIS ★",
  "MILANO ★",
  "TOKYO ★",
  "NEW YORK ★",
  "MULBERRY SILK ★",
  "BESPOKE TAILORING ★",
  "LEGACY STORE ★",
];

const BrandLogoLoop = () => {
  // Duplicate arrays for seamless 60fps infinite marquee loops
  const marqueeImages = [...PURE_IMAGES, ...PURE_IMAGES, ...PURE_IMAGES];

  const marqueeLetters = [...BIG_LETTERS, ...BIG_LETTERS, ...BIG_LETTERS];

  return (
    <section className="py-14 sm:py-20 bg-black text-white relative overflow-hidden border-y border-neutral-800">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-90 pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-800/80">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <CrownOutlined className="text-amber-400" />
              <span>KINETIC DUAL-MOTION GALLERY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-white">
              HAUTE COUTURE KINETIC SHOWCASE
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mt-1 font-light leading-relaxed">
              Experience seamless counter-scrolling imagery and giant Parisian
              luxury typography in motion.
            </p>
          </div>

          {/* Concentric Spinning Circular Emblem */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center aspect-square">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/50 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border border-neutral-700 animate-spin-reverse" />

            <svg
              className="absolute inset-0 w-full h-full animate-spin-slow aspect-square"
              viewBox="0 0 120 120"
            >
              <path
                id="kineticCirclePath"
                d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                fill="none"
              />
              <text className="text-[7px] font-mono font-bold fill-amber-400 uppercase tracking-[0.22em]">
                <textPath href="#kineticCirclePath" startOffset="0%">
                  ★ ALEXANDRE LUXE ★ PARIS ★ MILAN ★ TOKYO ★ NEW YORK ★
                </textPath>
              </text>
            </svg>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)] z-10 p-2 transition-transform duration-300 hover:scale-105">
              <img
                src="/images/LOGO.png"
                alt="Alexandre Luxe Emblem"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: GIANT KINETIC LETTERS SCROLLING RIGHT (➡️) */}
      <div className="relative w-full overflow-hidden mb-6 py-2 group">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

        <div className="animate-marquee-right flex gap-8 sm:gap-12 items-center">
          {marqueeLetters.map((letterText, idx) => (
            <span
              key={`letter-${idx}`}
              className="text-5xl sm:text-7xl lg:text-8xl font-black font-serif uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-white to-neutral-500 shrink-0 whitespace-nowrap opacity-90 hover:opacity-100 hover:text-amber-300 transition-all select-none cursor-pointer"
            >
              {letterText}
            </span>
          ))}
        </div>
      </div>

      {/* ROW 2: PURE IMAGE CARDS SCROLLING LEFT (⬅️ - NO TEXT ON CARDS) */}
      <div className="relative w-full overflow-hidden py-3 group">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

        <div className="animate-marquee-infinite flex gap-4 sm:gap-6 items-center">
          {marqueeImages.map((imgUrl, idx) => (
            <div
              key={`img-${idx}`}
              className="w-56 sm:w-64 h-72 sm:h-80 rounded-2xl overflow-hidden relative group/card shrink-0 border border-neutral-800 hover:border-amber-400/70 shadow-2xl transition-all duration-500 cursor-pointer"
            >
              {/* Pure High-Fashion Image (NO TEXT OVERLAY) */}
              <img
                src={imgUrl}
                alt="Haute Couture Photography"
                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Soft Subtle Gloss Highlight on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Feature Badges Footer Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-neutral-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs">
            <SafetyCertificateOutlined className="text-amber-400 text-base" />
            <span className="font-mono font-semibold uppercase tracking-wider">
              100% Authentic Guaranteed
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs">
            <GlobalOutlined className="text-amber-400 text-base" />
            <span className="font-mono font-semibold uppercase tracking-wider">
              Worldwide Express Shipping
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs">
            <ThunderboltOutlined className="text-amber-400 text-base" />
            <span className="font-mono font-semibold uppercase tracking-wider">
              Bakong KHQR Instant Checkout
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs">
            <CrownOutlined className="text-amber-400 text-base" />
            <span className="font-mono font-semibold uppercase tracking-wider">
              VIP Concierge Service
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogoLoop;
