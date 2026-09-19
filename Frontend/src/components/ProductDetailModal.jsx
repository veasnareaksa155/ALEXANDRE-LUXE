import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import {
  ShoppingOutlined,
  CloseOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";

const ProductDetailModal = ({
  product,
  open,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  // Color mapping dictionary for visual color swatch circles
  const colorMap = {
    black: "#171717",
    white: "#FFFFFF",
    charcoal: "#36454F",
    burgundy: "#6b1d2f",
    navy: "#0a192f",
    emerald: "#0d5c3a",
    gold: "#d4af37",
    beige: "#e8e0d5",
    gray: "#6b7280",
    grey: "#6b7280",
    red: "#991b1b",
    blue: "#1e3a8a",
    brown: "#4a2e1b",
    "black/white": "#171717",
  };

  // Gallery images array (fallback to main image if no gallery)
  const galleryImages = React.useMemo(() => {
    if (!product) return [];
    if (product.images && Array.isArray(product.images)) return product.images;
    if (product.gallery && Array.isArray(product.gallery))
      return [product.image_url, ...product.gallery];
    return [product.image_url];
  }, [product]);

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      setActiveImage(product.image_url);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Helper function to map colors to luxury apparel variant photos
  const getColorImageUrl = (colorName, categoryName, defaultImg) => {
    if (!colorName) return defaultImg;
    const col = colorName.toLowerCase().trim();
    const cat = (categoryName || "").toLowerCase().trim();

    if (product?.color_images && product.color_images[colorName]) {
      return product.color_images[colorName];
    }

    if (col.includes("white")) {
      if (cat.includes("t-shirt") || cat.includes("tee")) {
        return "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80";
      }
      if (cat.includes("shirt")) {
        return "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80";
      }
      if (cat.includes("shoe") || cat.includes("footwear")) {
        return "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80";
      }
      return "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80";
    }

    if (col.includes("black")) {
      if (cat.includes("t-shirt") || cat.includes("tee")) {
        return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";
      }
      if (cat.includes("shirt")) {
        return "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80";
      }
      if (cat.includes("shoe")) {
        return "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80";
      }
      return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";
    }

    if (col.includes("navy") || col.includes("blue")) {
      return "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80";
    }

    if (
      col.includes("charcoal") ||
      col.includes("gray") ||
      col.includes("grey")
    ) {
      return "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80";
    }

    if (col.includes("burgundy") || col.includes("red")) {
      return "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80";
    }

    if (col.includes("brown") || col.includes("tan") || col.includes("beige")) {
      return "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80";
    }

    return defaultImg;
  };

  const handleColorSelect = (col, idx) => {
    setSelectedColor(col);
    const targetImage =
      product?.color_images?.[col] ||
      (galleryImages[idx] && galleryImages[idx] !== product?.image_url
        ? galleryImages[idx]
        : getColorImageUrl(col, product?.category?.name, product?.image_url));
    setActiveImage(targetImage);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  const modelImage = React.useMemo(() => {
    if (product?.model_image_url) return product.model_image_url;
    const cat = (product?.category?.name || "").toLowerCase();
    const name = (product?.name || "").toLowerCase();

    if (cat.includes("t-shirt") || cat.includes("tee") || name.includes("tee") || name.includes("t-shirt")) {
      return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80";
    }
    if (cat.includes("shirt") || name.includes("shirt")) {
      return "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80";
    }
    if (cat.includes("shoe") || cat.includes("footwear") || name.includes("shoe") || name.includes("sneaker")) {
      return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
    }
    if (cat.includes("bag") || name.includes("bag") || name.includes("leather")) {
      return "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80";
    }
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
  }, [product]);

  const isShowingModel = activeImage === modelImage;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={840}
      centered
      closeIcon={<CloseOutlined className="text-xs sm:text-sm md:text-base" />}
      className="product-detail-modal"
    >
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch pt-0.5">
        {/* Left: Product & Model Lookbook Showcase */}
        <div className="w-full md:w-1/2 flex flex-col gap-2 flex-shrink-0">
          <div className="relative aspect-[3/4] w-full bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200 shadow-md group">
            <img
              src={activeImage || product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              {product.is_new && !isShowingModel && (
                <span className="bg-black text-white text-[9px] sm:text-xs font-mono font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md">
                  NEW COLLECTION
                </span>
              )}
              {isShowingModel && (
                <span className="bg-amber-500 text-black text-[9px] sm:text-xs font-mono font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md flex items-center gap-1">
                  👤 MODEL LOOKBOOK • ON-BODY
                </span>
              )}
            </div>
          </div>

          {/* Model & Flat Lay View Selector Thumbnails */}
          <div className="flex items-center gap-2 pt-1">
            {/* View Mode 1: Product Flat Lay */}
            <button
              onClick={() => setActiveImage(product.image_url)}
              className={`flex-1 py-1.5 px-3 rounded-lg border text-[11px] font-mono font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !isShowingModel
                  ? "bg-black text-white border-black shadow-xs"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-black"
              }`}
            >
              <span>👔 PRODUCT SHOT</span>
            </button>

            {/* View Mode 2: Model On-Body Lookbook */}
            <button
              onClick={() => setActiveImage(modelImage)}
              className={`flex-1 py-1.5 px-3 rounded-lg border text-[11px] font-mono font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isShowingModel
                  ? "bg-amber-500 text-black border-amber-500 shadow-xs"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-black"
              }`}
            >
              <span>👤 MODEL FIT</span>
            </button>
          </div>
        </div>

        {/* Right: Meta & Interactive Options */}
        <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 space-y-2 sm:space-y-0">
          <div>
            {/* Category */}
            <div className="flex items-center justify-between mb-1 pr-6">
              <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest">
                {product.category?.name || "ALEXANDRE LUXE"}
              </span>
            </div>

            <h2 className="text-base sm:text-lg md:text-xl font-bold font-serif text-black uppercase tracking-tight mb-1 sm:mb-2 pr-6 leading-snug">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl font-black text-black font-sans">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs sm:text-sm text-neutral-400 line-through font-sans">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed mb-3 sm:mb-4 font-light line-clamp-3">
              {product.description}
            </p>

            {/* Inline Size & Color Options Box */}
            <div className="space-y-3 mb-3 sm:mb-4 bg-neutral-50 p-3 sm:p-4 rounded-lg border border-neutral-200">
              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">
                      SIZE:
                    </span>
                    <span className="text-xs font-mono font-bold text-black">
                      {selectedSize}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-mono font-extrabold rounded border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? "bg-black text-white border-black shadow-sm"
                            : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector with Visual Swatches & Image Switcher */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">
                      COLOR:
                    </span>
                    <span className="text-xs font-mono font-bold text-black">
                      {selectedColor}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((col, idx) => {
                      const hexColor = colorMap[col.toLowerCase()] || "#000000";
                      const isSelected = selectedColor === col;
                      return (
                        <button
                          key={col}
                          onClick={() => handleColorSelect(col, idx)}
                          className={`px-3 py-1.5 text-xs font-extrabold rounded border transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black shadow-sm"
                              : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-neutral-400 shrink-0"
                            style={{ backgroundColor: hexColor }}
                          />
                          <span>{col}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Combined Quantity, Add to Bag & Wishlist Action Row */}
          <div className="pt-2 sm:pt-3 border-t border-neutral-200 flex items-center gap-2 sm:gap-3">
            {/* Quantity Controller */}
            <div className="flex items-center border border-neutral-300 rounded-md overflow-hidden h-8.5 sm:h-9.5 md:h-10.5 bg-neutral-50 flex-shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-5.5 sm:w-6.5 md:w-7.5 h-full flex items-center justify-center font-bold text-xs md:text-sm hover:bg-neutral-200 transition-colors"
              >
                -
              </button>
              <span className="font-bold text-xs md:text-sm px-2 text-center min-w-[18px] sm:min-w-[22px]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-5.5 sm:w-6.5 md:w-7.5 h-full flex items-center justify-center font-bold text-xs md:text-sm hover:bg-neutral-200 transition-colors"
              >
                +
              </button>
            </div>

            {/* Native Clean Add to Bag Button */}
            <button
              onClick={handleAdd}
              className="flex-1 bg-black text-white hover:bg-neutral-800 active:scale-[0.99] font-bold text-xs md:text-xs lg:text-sm tracking-wide uppercase h-8.5 sm:h-9.5 md:h-10.5 rounded-md shadow-sm px-3 sm:px-5 md:px-6 flex items-center justify-center gap-2 transition-all min-w-0"
            >
              <ShoppingOutlined className="text-xs sm:text-sm md:text-base flex-shrink-0" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                ADD TO BAG - ${(Number(product.price) * quantity).toFixed(2)}
              </span>
            </button>

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => onToggleWishlist(product)}
              className={`h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 md:h-10.5 md:w-10.5 flex items-center justify-center border rounded-md transition-all flex-shrink-0 ${
                isWishlisted
                  ? "border-red-200 bg-red-50 text-red-500 shadow-sm"
                  : "border-neutral-300 hover:border-black text-neutral-700 bg-white"
              }`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isWishlisted ? (
                <HeartFilled
                  style={{ color: "#ff4d4f" }}
                  className="text-xs sm:text-sm md:text-base"
                />
              ) : (
                <HeartOutlined className="text-xs sm:text-sm md:text-base" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
