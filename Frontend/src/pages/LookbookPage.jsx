import React, { useState, useEffect } from "react";
import { Tag } from "antd";
import {
  EyeOutlined,
  CameraOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const LookbookPage = ({ onSelectProduct, products = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Curated Luxury Campaign Model Outfits
  const lookbookItems = [
    {
      id: 1,
      title: "AUTUMN TAILORED SILK OXFORD LOOK",
      category: "shirt",
      modelName: "ALEXANDRE M.",
      modelSpecs: "6'1\" (185 cm) • Wearing Size L",
      location: "PARIS ATELIER",
      season: "A/W 2026 CAMPAIGN",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      featuredProductId: 1,
      styledItems: ["Monochrome Silk Oxford Shirt", "Custom Pearl Buttons"],
      isFeaturedHero: true,
    },
    {
      id: 2,
      category: "t-shirt",
      title: "URBAN HEAVYWEIGHT STREET TEE",
      modelName: "SOFIA K.",
      modelSpecs: "5'9\" (176 cm) • Wearing Size M",
      location: "MILAN STUDIO",
      season: "CAPSULE DROP 04",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      featuredProductId: 5,
      styledItems: ["Essential Heavyweight Black Tee", "280 GSM Cotton"],
    },
    {
      id: 3,
      category: "shirt",
      title: "MINIMALIST CHARCOAL LINEN STYLE",
      modelName: "MARCO ROSSI",
      modelSpecs: "6'2\" (188 cm) • Wearing Size XL",
      location: "FLORENCE ESTATE",
      season: "LUXE RESORT 2026",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      featuredProductId: 3,
      styledItems: ["Minimalist Charcoal Linen Shirt", "Italian Collar"],
    },
    {
      id: 4,
      category: "shirt",
      title: "SATIN BLACK BUTTON DOWN EDITORIAL",
      modelName: "ELENA V.",
      modelSpecs: "5'10\" (178 cm) • Wearing Size S",
      location: "MONACO RUNWAY",
      season: "COUTURE EDITION",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
      featuredProductId: 4,
      styledItems: ["Oversized Black Satin Button Down"],
    },
    {
      id: 5,
      category: "t-shirt",
      title: "BOXY MONOCHROME GRAPHIC FIT",
      modelName: "MARCUS B.",
      modelSpecs: "6'0\" (183 cm) • Wearing Size L",
      location: "BERLIN GALLERY",
      season: "STREETWEAR DROP 02",
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      featuredProductId: 7,
      styledItems: ["Minimalist Monochrome Graphic Tee"],
    },
    {
      id: 6,
      category: "shoes",
      title: "WHITE CALFSKIN SNEAKER LOOKBOOK",
      modelName: "LUCAS R.",
      modelSpecs: "6'1\" (185 cm) • Wearing EU 42",
      location: "PORTO ATELIER",
      season: "FOOTWEAR SERIES",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
      featuredProductId: 9,
      styledItems: ["Minimalist White Calfskin Leather Sneakers"],
    },
    {
      id: 7,
      category: "shirt",
      title: "ITALIAN DRESS SHIRT BESPOKE FIT",
      modelName: "DAVID K.",
      modelSpecs: "6'3\" (191 cm) • Wearing Size L",
      location: "TOKYO GINZA",
      season: "HAUTE SELECTION",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
      featuredProductId: 2,
      styledItems: ["Classic Luxe White Dress Shirt"],
    },
    {
      id: 8,
      category: "shoes",
      title: "TRIPLE BLACK RUNNER FOOTWEAR LOOK",
      modelName: "SARAH JENKINS",
      modelSpecs: "5'11\" (180 cm) • Wearing EU 41",
      location: "LONDON SOHO",
      season: "URBAN RUNNER 2026",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
      featuredProductId: 10,
      styledItems: ["Black Edition Runner Sneakers"],
    },
  ];

  const featuredHeroLook = lookbookItems[0];

  const filteredItems =
    activeFilter === "all"
      ? lookbookItems
      : lookbookItems.filter((i) => i.category === activeFilter);

  const handleItemClick = (featuredId) => {
    const found = products.find((p) => p.id === featuredId);
    if (found && onSelectProduct) {
      onSelectProduct(found);
    } else if (products.length > 0 && onSelectProduct) {
      onSelectProduct(products[0]);
    }
  };

  return (
    <div className="bg-white text-neutral-900 pb-20">
      {/* 1. Header Banner */}
      <div className="bg-black text-white py-14 sm:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            HIGH FASHION CAMPAIGN 2026
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif uppercase tracking-tight text-white mb-3">
            LOOKBOOK & MODELS
          </h1>
          <p className="text-xs sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Discover real human models styling our tailored silk shirts, 280 GSM
            cotton tees, and Goodyear welted footwear. Tap any look to shop the
            exact outfit.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* 2. Full-Bleed Big Hero Model Showcase Banner */}
        <div
          onClick={() => handleItemClick(featuredHeroLook.featuredProductId)}
          className="group relative bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-neutral-800 mb-14 transition-all duration-500"
        >
          <div className="relative h-[480px] sm:h-[600px] w-full overflow-hidden">
            <img
              src={featuredHeroLook.image}
              alt={featuredHeroLook.title}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
          </div>

          {/* Top Badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2 z-10">
            <Tag
              color="black"
              className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-black text-white border border-neutral-700"
            >
              🔥 FEATURED MODEL LOOK
            </Tag>
            <Tag
              color="black"
              className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-white/20 backdrop-blur-md text-white border border-white/30"
            >
              <EnvironmentOutlined /> {featuredHeroLook.location}
            </Tag>
          </div>

          {/* Bottom Model Details Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-neutral-300 uppercase tracking-widest">
                <UserOutlined />
                <span>{featuredHeroLook.modelName}</span>
                <span>•</span>
                <span>{featuredHeroLook.modelSpecs}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase font-serif tracking-tight text-white leading-tight">
                {featuredHeroLook.title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-lg leading-relaxed">
                Featured piece: {featuredHeroLook.styledItems.join(" & ")}.
                Tailored with Mulberry silk and Italian craft precision.
              </p>
            </div>

            <button className="bg-white text-black hover:bg-neutral-200 font-extrabold text-xs sm:text-sm uppercase tracking-widest px-6 py-3.5 rounded-lg shadow-xl transition-all hover:scale-105 inline-flex items-center space-x-2 whitespace-nowrap">
              <EyeOutlined />
              <span>SHOP THIS EXACT OUTFIT</span>
              <ArrowRightOutlined />
            </button>
          </div>
        </div>

        {/* 3. Category Filter Pills */}
        <div className="flex justify-center flex-wrap gap-2.5 mb-10">
          {[
            { label: "ALL MODEL LOOKS", value: "all" },
            { label: "SHIRTS COLLECTION", value: "shirt" },
            { label: "T-SHIRTS COLLECTION", value: "t-shirt" },
            { label: "FOOTWEAR & SHOES", value: "shoes" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 whitespace-nowrap shadow-xs ${
                activeFilter === cat.value
                  ? "bg-black text-white shadow-md scale-105"
                  : "bg-white text-neutral-800 hover:bg-neutral-100 border border-neutral-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 4. Big High-Impact Editorial Model Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.featuredProductId)}
              className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Tall Model Portrait Image Container */}
              <div className="aspect-[3/4] w-full overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette Overlay for Crisp Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              </div>

              {/* Location Tag Top Left */}
              <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                <Tag
                  color="black"
                  className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-black/80 backdrop-blur-md text-white border border-neutral-700"
                >
                  <EnvironmentOutlined /> {item.location}
                </Tag>
              </div>

              {/* Model Info Overlay Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-10">
                {/* Model Name & Specs */}
                <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold text-neutral-300 uppercase tracking-widest mb-1.5 font-mono">
                  <UserOutlined className="text-yellow-400" />
                  <span>MODEL: {item.modelName}</span>
                  <span>•</span>
                  <span>{item.modelSpecs}</span>
                </div>

                {/* Look Title */}
                <h3 className="text-lg sm:text-2xl font-bold uppercase font-serif tracking-tight leading-snug mb-2 text-white">
                  {item.title}
                </h3>

                {/* Styled Items List */}
                <p className="text-xs text-neutral-300 font-light mb-4 line-clamp-1">
                  Styling: {item.styledItems.join(", ")}
                </p>

                {/* Action Button */}
                <div className="flex items-center gap-2 text-xs font-extrabold text-black bg-white px-4 py-2.5 rounded-md w-fit group-hover:bg-neutral-200 transition-all shadow-md uppercase tracking-wider">
                  <EyeOutlined />
                  <span>VIEW OUTFIT DETAILS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LookbookPage;
