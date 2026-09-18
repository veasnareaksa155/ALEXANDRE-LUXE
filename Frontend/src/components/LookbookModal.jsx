import React, { useState } from "react";
import { Modal, Tag } from "antd";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";

const LookbookModal = ({ open, onClose, onSelectProduct, products = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const lookbookItems = [
    {
      id: 1,
      title: "AUTUMN TAILORED LINEN SHIRT",
      category: "shirt",
      modelName: "Model: Alexandre M.",
      location: "Paris Atelier",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      featuredProductId: 1,
    },
    {
      id: 2,
      category: "t-shirt",
      title: "STREET LUXE HEAVYWEIGHT TEE",
      modelName: "Model: Sofia K.",
      location: "Milan Studio",
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
      featuredProductId: 3,
    },
    {
      id: 3,
      category: "shoes",
      title: "HANDMADE LEATHER DERBY SHOES",
      modelName: "Model: Lucas R.",
      location: "Porto Workshop",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      featuredProductId: 5,
    },
    {
      id: 4,
      category: "shirt",
      title: "MONOCHROME SILK OXFORD DRESS",
      modelName: "Model: Elena V.",
      location: "Monaco Shoot",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      featuredProductId: 2,
    },
    {
      id: 5,
      category: "t-shirt",
      title: "MINIMALIST GRAPHIC OVERSIZED TEE",
      modelName: "Model: Marcus B.",
      location: "Berlin Gallery",
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      featuredProductId: 4,
    },
    {
      id: 6,
      category: "shoes",
      title: "CALFSKIN RETRO HIGH-TOP SNEAKERS",
      modelName: "Model: David K.",
      location: "Tokyo Runway",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      featuredProductId: 6,
    },
  ];

  const filteredItems =
    activeFilter === "all"
      ? lookbookItems
      : lookbookItems.filter((i) => i.category === activeFilter);

  const handleItemClick = (featuredId) => {
    const found = products.find((p) => p.id === featuredId);
    if (found && onSelectProduct) {
      onSelectProduct(found);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      closeIcon={<CloseOutlined className="text-xs sm:text-sm md:text-base" />}
      className="lookbook-modal"
    >
      <div className="py-2 sm:py-4 px-1 max-h-[82vh] overflow-y-auto pr-2">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            EDITORIAL COLLECTION 2026
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-black">
            LOOKBOOK & MODELS
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3 mb-4" />

          {/* Category Filter Pills */}
          <div className="flex justify-center flex-wrap gap-2">
            {["all", "shirt", "t-shirt", "shoes"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === cat
                    ? "bg-black text-white shadow"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat === "all" ? "ALL LOOKS" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.featuredProductId)}
              className="group relative bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Gradient Overlay & Tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-3 left-3">
                <Tag
                  color="black"
                  className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border-none"
                >
                  {item.location}
                </Tag>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-widest block mb-0.5">
                  {item.modelName}
                </span>
                <h3 className="text-xs sm:text-sm font-bold uppercase font-serif tracking-tight leading-snug mb-2">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded w-fit group-hover:bg-white group-hover:text-black transition-colors">
                  <EyeOutlined />
                  <span>VIEW PIECE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default LookbookModal;
