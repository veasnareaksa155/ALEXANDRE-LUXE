import React, { useState } from "react";
import { Rate, Collapse, Tag } from "antd";
import {
  StarFilled,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  CustomerServiceOutlined,
  CheckCircleOutlined,
  TagOutlined,
  ArrowRightOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";

const HomePage = ({
  products = [],
  loading = false,
  onQuickView,
  onAddToCart,
  wishlistItems = [],
  onToggleWishlist,
  onExploreCategory,
  onNavigatePage,
}) => {
  const [activeTab, setActiveTab] = useState("viral"); // "viral" | "discount"

  // Filter products for Home Page curations
  const viralProducts = products
    .filter((p) => p.is_featured || p.is_new)
    .slice(0, 4);
  const discountProducts = products
    .filter(
      (p) => p.original_price && Number(p.original_price) > Number(p.price),
    )
    .slice(0, 4);

  // Fallback to slice if filters yield empty
  const displayProducts =
    activeTab === "viral"
      ? viralProducts.length > 0
        ? viralProducts
        : products.slice(0, 4)
      : discountProducts.length > 0
        ? discountProducts
        : products.slice(0, 4);

  // Customer Ratings & Reviews
  const reviews = [
    {
      id: 1,
      name: "Jean-Luc M.",
      location: "Paris, France",
      rating: 5,
      productName: "Tailored Silk Oxford Shirt",
      comment:
        "The drape and lustre of the Mulberry silk is unmatched. Outstanding tailoring—fits like bespoke.",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      location: "London, UK",
      rating: 5,
      productName: "Heavyweight Boxy Cotton Tee",
      comment:
        "280 GSM cotton feels heavy, luxury, and holds its shape perfectly after washing. 10/10 streetwear staple.",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 3,
      name: "Marco Rossi",
      location: "Milan, Italy",
      rating: 5,
      productName: "Luxury Leather Oxford Derby Shoes",
      comment:
        "Goodyear welted perfection. Calfskin leather is buttery soft right out of the box with zero break-in pain.",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
  ];

  // FAQ Items
  const faqItems = [
    {
      key: "1",
      label: (
        <span className="font-serif font-bold uppercase text-black text-xs sm:text-sm">
          HOW LONG DOES WORLDWIDE EXPRESS SHIPPING TAKE?
        </span>
      ),
      children: (
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          Express shipments via DHL Express deliver in 2–4 business days
          worldwide. Tracking details are dispatched immediately via email.
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <span className="font-serif font-bold uppercase text-black text-xs sm:text-sm">
          WHAT IS YOUR RETURN & EXCHANGE POLICY?
        </span>
      ),
      children: (
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          We offer a 30-day complimentary return and size exchange guarantee.
          Items must be unworn in original luxury packaging with tags intact.
        </p>
      ),
    },
    {
      key: "3",
      label: (
        <span className="font-serif font-bold uppercase text-black text-xs sm:text-sm">
          ARE THE GARMENTS INDEED 100% ORGANIC & HANDMADE?
        </span>
      ),
      children: (
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          Yes. Our shirts utilize certified 100% Mulberry silk, tees are knitted
          from 280 GSM combed cotton, and footwear is Goodyear welted in Porto
          ateliers.
        </p>
      ),
    },
  ];

  // Instagram Feed Photos
  const instaPhotos = [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80",
  ];

  return (
    <div className="bg-white text-neutral-900 pb-16">
      {/* 1. Animated Hero Carousel */}
      <HeroSlider onExploreCategory={onExploreCategory} />

      {/* 2. Trust & Value Badges Bar */}
      <div className="bg-neutral-900 text-white py-4 px-4 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider">
            <ThunderboltOutlined className="text-base text-yellow-400" />
            <span>EXPRESS SHIPPING</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider">
            <SafetyCertificateOutlined className="text-base text-emerald-400" />
            <span>ARTISAN QUALITY</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider">
            <CheckCircleOutlined className="text-base text-blue-400" />
            <span>30-DAY RETURNS</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider">
            <CustomerServiceOutlined className="text-base text-purple-400" />
            <span>24/7 VIP CONCIERGE</span>
          </div>
        </div>
      </div>

      {/* 3. Curated Home Product Showcase: Viral Drops & Discounts */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12"
        id="products-section"
      >
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            CURATED SELECTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-black mb-4">
            FEATURED DROPS & SPECIAL OFFERS
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mb-6" />

          {/* Curation Filter Tabs */}
          <div className="inline-flex p-1 bg-neutral-100 rounded-full border border-neutral-200">
            <button
              onClick={() => setActiveTab("viral")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeTab === "viral"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <ThunderboltOutlined />
              <span>🔥 VIRAL & HOT DROPS</span>
            </button>
            <button
              onClick={() => setActiveTab("discount")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeTab === "discount"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <TagOutlined />
              <span>🏷️ SPECIAL OFFERS ({discountProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid (Only 4 Curated Products) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-neutral-100 h-80 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isWishlisted={wishlistItems.some((i) => i.id === product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}

        {/* View Full Collection Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => onExploreCategory("all")}
            className="bg-black text-white hover:bg-neutral-800 font-extrabold text-xs tracking-widest uppercase px-8 h-11 rounded-md shadow-md transition-all hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>EXPLORE ENTIRE CATALOGUE ({products.length} ITEMS)</span>
            <ArrowRightOutlined />
          </button>
        </div>
      </div>

      {/* 4. Luxury Atelier Craftsmanship Section */}
      <div className="bg-neutral-50 py-16 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden shadow-xl border border-neutral-200">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"
                alt="Artisan Sourcing"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                UNCOMPROMISING QUALITY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-black">
                MASTER TAILORING & HAND-CRAFTED LEATHER
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                Alexandre Luxe operates on a zero-compromise quality standard.
                We source 100% Mulberry silk for tailored shirts, 280 GSM combed
                cotton for boxy tees, and full-grain calfskin with Goodyear welt
                construction for derby shoes.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Tag
                  color="black"
                  className="px-3 py-1 text-xs uppercase font-bold"
                >
                  100% Mulberry Silk
                </Tag>
                <Tag
                  color="black"
                  className="px-3 py-1 text-xs uppercase font-bold"
                >
                  280 GSM Heavyweight Cotton
                </Tag>
                <Tag
                  color="black"
                  className="px-3 py-1 text-xs uppercase font-bold"
                >
                  Goodyear Welted Footwear
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Verified Client Reviews & Ratings Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            CLIENT SATISFACTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-black mb-2">
            VERIFIED CLIENT REVIEWS
          </h2>
          <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarFilled key={i} className="text-sm" />
            ))}
            <span className="text-xs font-bold text-black ml-2 font-mono">
              4.98 / 5.0 (2,450+ REVIEWS)
            </span>
          </div>
          <div className="w-12 h-0.5 bg-black mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-black">
                        {rev.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-light block">
                        {rev.location}
                      </span>
                    </div>
                  </div>
                  {rev.verified && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircleOutlined /> VERIFIED
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-amber-400 mb-2">
                  <Rate
                    disabled
                    defaultValue={rev.rating}
                    className="text-xs"
                  />
                </div>

                <p className="text-xs text-neutral-700 italic font-light leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono font-bold uppercase">
                PURCHASED: {rev.productName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. FAQ Accordion Section */}
      <div className="bg-neutral-50 py-16 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tight text-black mb-2">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="w-12 h-0.5 bg-black mx-auto" />
          </div>

          <Collapse
            items={faqItems}
            className="bg-white border-neutral-200 rounded-xl shadow-xs"
          />
        </div>
      </div>

      {/* 7. Instagram Style Gallery Grid */}
      <div className="pt-16">
        <div className="text-center mb-8 px-4">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            @ALEXANDRE.LUXE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tight text-black flex items-center justify-center gap-2">
            <InstagramOutlined />
            <span>JOIN OUR STYLE COMMUNITY</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {instaPhotos.map((url, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden bg-neutral-100"
            >
              <img
                src={url}
                alt="Instagram look"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                <InstagramOutlined className="text-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
