import React, { useEffect, useRef, useState } from "react";
import {
  TrophyOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Snowfall from "../components/Snowfall";

const AboutPage = ({ onNavigateHome }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const handleLoadedMetadata = () => {
      video.currentTime = 0;
    };
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    let animationFrameId;
    const updateVideoProgress = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable > 0) {
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
        setScrollProgress(progress);

        if (video.duration && !isNaN(video.duration)) {
          const targetTime = progress * video.duration;
          if (Math.abs(video.currentTime - targetTime) > 0.03) {
            video.currentTime = targetTime;
          }
        }
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateVideoProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateVideoProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-[#0d0f12]">
      {/* Originkit Snowfall Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-85">
        <Snowfall
          count={240}
          speedMin={0.6}
          speedMax={2.5}
          sizeMin={1.5}
          sizeMax={3.8}
          opacityMin={30}
          opacityMax={90}
          color="#ffffff"
          direction="down"
        />
      </div>

      {/* Pinned DiviMotion Video Scroll Header Section */}
      <div ref={containerRef} className="relative h-[150vh] w-full z-10">
        {/* Sticky Viewport Canvas */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            src="https://divimotion.com/wp-content/uploads/2026/08/mathal-web.mp4"
            playsInline
            muted
            preload="auto"
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: Math.max(0.2, 0.85 - scrollProgress * 0.7) }}
          />

          {/* Dark luxury gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-black/40 to-black/70 pointer-events-none" />

          {/* Centered Luxury Brand Hero Caption (Visible on top of video) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 pointer-events-none z-10"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 2),
              transform: `translateY(${-scrollProgress * 60}px)`,
            }}
          >
            <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 uppercase tracking-[0.35em] mb-4">
              PARISIAN LUXURY ATELIER
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif italic max-w-5xl leading-tight uppercase text-white drop-shadow-2xl">
              "Elegance is not about being noticed, it's about being
              remembered."
            </h1>
          </div>

          {/* Interactive Scroll Indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500 pointer-events-none z-10"
            style={{ opacity: scrollProgress > 0.6 ? 0 : 1 }}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-300">
              SCROLL TO SCRUB VIDEO
            </span>
            <div className="w-5 h-9 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Narrative & Story Section (Divi Motion Demo 08 Layout - Seamless Overlay) */}
      <div className="relative z-20 py-16 sm:py-24 border-b border-neutral-800/70 -mt-32 sm:-mt-40 bg-[#0d0f12]/80 backdrop-blur-md">
        <div className="max-w-[1290px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Subtitle: SINCE 2015 */}
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-amber-400 font-bold mb-6 block text-center">
            SINCE 2015
          </span>

          {/* Stats Background Image */}
          <div className="mb-10 flex justify-center">
            <img
              src="https://divimotion.com/wp-content/uploads/2026/08/Stats-Background.png"
              alt="Stats Background"
              className="h-16 w-auto object-contain opacity-90 filter drop-shadow"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* Main Headline (Italiana / Serif font) */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-serif uppercase tracking-tight text-white leading-[1.05] text-center max-w-[1100px] mb-16 sm:mb-24">
            TIMELESS FASHION STORIES THAT DEFINE MODERN STYLE WITH CREATIVE
            VISION AND GLOBAL IMPACT.
          </h2>

          {/* 2-Column Editorial Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start w-full max-w-[1290px]">
            {/* Left Column */}
            <div className="flex flex-col space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/90 bg-neutral-900/60 backdrop-blur-md">
                <img
                  src="https://divimotion.com/wp-content/uploads/2026/08/Rectangle-240649638.png"
                  alt="Fashion Concept Atelier"
                  className="w-full h-auto max-h-[350px] object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80";
                  }}
                />
              </div>

              <p className="text-neutral-300 font-sans text-sm sm:text-base leading-relaxed font-light tracking-wide">
                We transform bold fashion concepts into striking visual
                campaigns that elevate brands, inspire confidence, and create
                unforgettable experiences through innovative styling, and
                premium production.
              </p>

              <div>
                <button
                  onClick={onNavigateHome}
                  className="text-neutral-200 hover:text-amber-400 text-xs sm:text-sm uppercase tracking-widest font-mono border-b border-neutral-400 hover:border-amber-400 pb-1 transition-all inline-flex items-center gap-2 cursor-pointer group"
                >
                  <span>MORE ABOUT US</span>
                  <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/90 bg-neutral-900/60 backdrop-blur-md">
                <img
                  src="https://divimotion.com/wp-content/uploads/2026/08/Rectangle-240649637.png"
                  alt="High Fashion Visual Campaign"
                  className="w-full h-auto max-h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Pillars Grid & CTA Banner */}
      <div className="relative z-20 max-w-[1290px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-neutral-900/60 p-8 sm:p-12 rounded-3xl border border-neutral-800 text-center shadow-2xl backdrop-blur-md">
          <div className="p-4">
            <TrophyOutlined className="text-4xl text-amber-400 mb-4" />
            <h3 className="font-bold text-base uppercase tracking-wider text-white mb-2 font-serif">
              FINEST RAW MATERIALS
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Mulberry silk, 280 GSM combed cotton & Goodyear welted calfskin.
            </p>
          </div>

          <div className="p-4 border-y md:border-y-0 md:border-x border-neutral-800">
            <SafetyCertificateOutlined className="text-4xl text-amber-400 mb-4" />
            <h3 className="font-bold text-base uppercase tracking-wider text-white mb-2 font-serif">
              ETHICAL & SUSTAINABLE
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Zero-waste small batch production with fair artisan wages.
            </p>
          </div>

          <div className="p-4">
            <EnvironmentOutlined className="text-4xl text-amber-400 mb-4" />
            <h3 className="font-bold text-base uppercase tracking-wider text-white mb-2 font-serif">
              PARISIAN DESIGN STUDIO
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Headquartered at 28 Rue du Faubourg Saint-Honoré, Paris.
            </p>
          </div>
        </div>

        {/* CTA Footer Banner */}
        <div className="mt-16 bg-gradient-to-r from-neutral-900/90 via-black/80 to-neutral-900/90 text-white p-10 sm:p-16 rounded-3xl border border-neutral-800 text-center flex flex-col items-center shadow-2xl backdrop-blur-md">
          <h3 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight mb-3">
            EXPLORE THE COLLECTION
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mb-8 font-light">
            Discover tailored shirts, essential heavyweight tees, and handmade
            footwear.
          </p>
          <button
            onClick={onNavigateHome}
            className="bg-white text-black hover:bg-amber-400 font-extrabold text-xs tracking-widest uppercase px-8 h-12 rounded-full shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
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
