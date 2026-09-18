import React from "react";
import { Modal } from "antd";
import {
  CloseOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const AboutModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={780}
      centered
      closeIcon={<CloseOutlined className="text-xs sm:text-sm md:text-base" />}
      className="about-modal"
    >
      <div className="py-2 sm:py-4 px-1">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            HERITAGE & CRAFTSMANSHIP
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-black">
            ABOUT ALEXANDRE LUXE
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </div>

        {/* Hero Brand Story Image */}
        <div className="relative h-48 sm:h-72 w-full rounded-lg overflow-hidden mb-6 sm:mb-8 border border-neutral-200">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
            alt="Alexandre Luxe Atelier"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
            <p className="text-white text-sm sm:text-xl font-serif italic max-w-xl leading-relaxed">
              "Elegance is not about being noticed, it's about being
              remembered."
            </p>
          </div>
        </div>

        {/* Brand Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-neutral-700 text-xs sm:text-sm leading-relaxed font-light">
          <div>
            <h3 className="text-base font-bold font-serif uppercase text-black mb-2">
              OUR PHILOSOPHY
            </h3>
            <p className="mb-3">
              Founded with a singular vision, Alexandre Luxe redefines modern
              elegance through uncompromising quality, timeless silhouettes, and
              minimalist aesthetics. We design for individuals who appreciate
              quiet luxury.
            </p>
            <p>
              Every piece in our collection represents months of meticulous
              tailoring, sourcing the world’s finest organic textiles and
              full-grain leathers to deliver garments that endure gracefully
              across seasons.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold font-serif uppercase text-black mb-2">
              ARTISAN CRAFTSMANSHIP
            </h3>
            <p className="mb-3">
              From our tailored Mulberry silk shirts to Goodyear welted
              footwear, each product is hand-assembled by master artisans with
              decades of heritage techniques.
            </p>
            <p>
              We prioritize sustainable small-batch production runs to eliminate
              waste and guarantee that every item meeting your hands is flawless
              in construction and fit.
            </p>
          </div>
        </div>

        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50 p-4 sm:p-6 rounded-lg border border-neutral-200 text-center mb-6">
          <div className="p-2">
            <TrophyOutlined className="text-2xl text-black mb-2" />
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-black mb-1">
              PREMIUM MATERIALS
            </h4>
            <p className="text-[11px] text-neutral-500 font-light">
              100% Mulberry Silk, 280 GSM Heavyweight Cotton & Calfskin
            </p>
          </div>

          <div className="p-2 border-y sm:border-y-0 sm:border-x border-neutral-200">
            <SafetyCertificateOutlined className="text-2xl text-black mb-2" />
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-black mb-1">
              SUSTAINABLE LUXURY
            </h4>
            <p className="text-[11px] text-neutral-500 font-light">
              Ethically sourced, zero-waste small batch production
            </p>
          </div>

          <div className="p-2">
            <EnvironmentOutlined className="text-2xl text-black mb-2" />
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-black mb-1">
              GLOBAL ATELIERS
            </h4>
            <p className="text-[11px] text-neutral-500 font-light">
              Crafted in Paris, Milan & Porto artisan workshops
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;
