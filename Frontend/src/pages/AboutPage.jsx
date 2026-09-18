import React, { useEffect } from "react";
import {
  TrophyOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const AboutPage = ({ onNavigateHome }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-neutral-900 pb-20">
      {/* Page Hero Header */}
      <div className="bg-black text-white py-16 sm:py-24 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            HERITAGE & CRAFTSMANSHIP
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif uppercase tracking-tight text-white mb-4">
            ABOUT ALEXANDRE LUXE
          </h1>
          <p className="text-sm sm:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Redefining modern luxury apparel through quiet elegance,
            hand-crafted Mulberry silk, and Italian artisan footwear.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Editorial Story Image Banner */}
        <div className="relative h-64 sm:h-96 md:h-[480px] w-full rounded-xl overflow-hidden mb-12 shadow-2xl border border-neutral-200">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
            alt="Alexandre Luxe Atelier"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
            <p className="text-white text-base sm:text-2xl md:text-3xl font-serif italic max-w-3xl leading-relaxed">
              "Elegance is not about being noticed, it's about being
              remembered."
            </p>
          </div>
        </div>

        {/* Brand Narrative Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16 text-neutral-700 text-sm sm:text-base leading-relaxed font-light">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              OUR FOUNDING VISION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black uppercase tracking-tight">
              QUIET LUXURY, UNCOMPROMISING FIT
            </h2>
            <p>
              Founded with a singular vision, Alexandre Luxe redefines modern
              luxury through minimalist silhouettes and meticulous construction.
              We cater to discerning individuals who demand perfection in every
              seam.
            </p>
            <p>
              Every garment in our catalog represents months of pattern
              refining, sourcing certified organic textiles, Mulberry silk, and
              full-grain Italian leathers that mature beautifully over time.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              ARTISAN HERITAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black uppercase tracking-tight">
              HAND-CRAFTED ATELIERS
            </h2>
            <p>
              From our custom 280 GSM heavyweight cotton tees to Goodyear welted
              footwear, each product is crafted in small-batch family workshops
              across Paris, Milan, and Porto.
            </p>
            <p>
              By prioritizing ethical small-batch production, we eliminate
              unnecessary inventory waste while guaranteeing that every piece
              delivered to you undergoes rigorous quality control.
            </p>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-50 p-8 sm:p-12 rounded-xl border border-neutral-200 text-center mb-16 shadow-sm">
          <div className="p-4">
            <TrophyOutlined className="text-4xl text-black mb-3" />
            <h3 className="font-bold text-base uppercase tracking-wider text-black mb-2 font-serif">
              FINEST RAW MATERIALS
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Mulberry silk, 280 GSM combed cotton & Goodyear welted calfskin.
            </p>
          </div>

          <div className="p-4 border-y md:border-y-0 md:border-x border-neutral-200">
            <SafetyCertificateOutlined className="text-4xl text-black mb-3" />
            <h3 className="font-bold text-base uppercase tracking-wider text-black mb-2 font-serif">
              ETHICAL & SUSTAINABLE
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Zero-waste small batch production with fair artisan wages.
            </p>
          </div>

          <div className="p-4">
            <EnvironmentOutlined className="text-4xl text-black mb-3" />
            <h3 className="font-bold text-base uppercase tracking-wider text-black mb-2 font-serif">
              PARISIAN DESIGN STUDIO
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Headquartered at 28 Rue du Faubourg Saint-Honoré, Paris.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-black text-white p-8 sm:p-12 rounded-xl text-center flex flex-col items-center">
          <h3 className="text-xl sm:text-3xl font-extrabold font-serif uppercase tracking-tight mb-3">
            EXPLORE THE COLLECTION
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mb-6 font-light">
            Discover tailored shirts, essential heavyweight tees, and handmade
            footwear.
          </p>
          <button
            onClick={onNavigateHome}
            className="bg-white text-black hover:bg-neutral-200 font-extrabold text-xs tracking-widest uppercase px-8 h-11 rounded-md shadow-lg transition-all flex items-center gap-2"
          >
            <span>SHOP ALL PRODUCTS</span>
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
