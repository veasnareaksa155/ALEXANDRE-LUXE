import React, { useRef } from "react";
import { Carousel } from "antd";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const HeroSlider = ({ onExploreCategory }) => {
  const carouselRef = useRef(null);

  const slides = [
    {
      id: 1,
      categoryKey: "shirt",
      tag: "AUTUMN / WINTER 2026",
      title: "TAILORED SILK & OXFORD SHIRTS",
      description:
        "Hand-crafted from 100% Mulberry silk & French linen for sophisticated drape and luxury.",
      bgImage:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80",
      buttonText: "EXPLORE SHIRTS",
    },
    {
      id: 2,
      categoryKey: "t-shirt",
      tag: "ESSENTIAL LUXURY",
      title: "HEAVYWEIGHT COTTON TEES",
      description:
        "280 GSM combed cotton featuring modern boxy fits and subtle streetwear aesthetic.",
      bgImage:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1920&q=80",
      buttonText: "SHOP T-SHIRTS",
    },
    {
      id: 3,
      categoryKey: "shoes",
      tag: "ITALIAN HANDMADE",
      title: "MINIMAL FOOTWEAR COLLECTION",
      description:
        "Full-grain calfskin sneakers & derby shoes with custom Margom rubber soles.",
      bgImage:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1920&q=80",
      buttonText: "DISCOVER SHOES",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black text-white group select-none">
      {/* Carousel component with Dragging & Smooth Seamless Slide */}
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={5000}
        draggable={true}
        swipeToSlide={true}
        touchMove={true}
        effect="scrollx"
        className="hero-carousel cursor-grab active:cursor-grabbing w-full"
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative h-[320px] sm:h-[420px] md:h-[500px] w-full overflow-hidden bg-neutral-900"
          >
            {/* Background Image - 100% Full Container Coverage */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />

            {/* Dark Gradient Overlay for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 w-full h-full" />

            {/* Slide Content */}
            <div className="relative max-w-7xl mx-auto h-full px-5 sm:px-14 md:px-20 flex flex-col justify-center items-start text-left z-10 pointer-events-auto">
              <span className="inline-block px-2.5 py-0.5 sm:px-3.5 sm:py-1 bg-white text-black text-[9px] sm:text-xs font-extrabold tracking-widest uppercase mb-2 sm:mb-3 rounded shadow-md">
                {slide.tag}
              </span>

              <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-2 sm:mb-4 leading-tight max-w-2xl font-serif">
                {slide.title}
              </h1>

              <p className="text-xs sm:text-base md:text-xl text-neutral-200 mb-4 sm:mb-6 max-w-xl leading-relaxed font-medium line-clamp-2">
                {slide.description}
              </p>

              {/* Compact Tailored CTA Button */}
              <button
                onClick={() => onExploreCategory(slide.categoryKey)}
                className="bg-white text-black hover:bg-neutral-200 active:scale-95 border-none font-extrabold text-[10px] sm:text-xs md:text-sm tracking-wider sm:tracking-widest uppercase px-3.5 sm:px-7 md:px-9 h-8 sm:h-10 md:h-12 rounded-md sm:rounded-lg shadow-lg flex items-center gap-1.5 sm:gap-2 transition-all duration-300 hover:scale-105"
              >
                <span>{slide.buttonText}</span>
                <ArrowRightOutlined className="text-[10px] sm:text-xs md:text-sm" />
              </button>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Floating Navigation Arrows - Centered */}
      <button
        onClick={() => carouselRef.current?.prev()}
        className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 p-0 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/30"
        aria-label="Previous Slide"
        title="Previous Slide"
      >
        <LeftOutlined style={{ fontSize: "14px" }} />
      </button>

      <button
        onClick={() => carouselRef.current?.next()}
        className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 p-0 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/30"
        aria-label="Next Slide"
        title="Next Slide"
      >
        <RightOutlined style={{ fontSize: "14px" }} />
      </button>
    </div>
  );
};

export default HeroSlider;
