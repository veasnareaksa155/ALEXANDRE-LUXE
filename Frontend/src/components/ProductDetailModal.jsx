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
    if (product.gallery && Array.isArray(product.gallery)) return [product.image_url, ...product.gallery];
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

  const handleColorSelect = (col, idx) => {
    setSelectedColor(col);
    if (galleryImages[idx]) {
      setActiveImage(galleryImages[idx]);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      closeIcon={<CloseOutlined className="text-xs sm:text-sm md:text-base" />}
      className="product-detail-modal"
    >
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch pt-0.5">
        {/* Left: Product Image Showcase & Gallery Thumbnails */}
        <div className="w-full md:w-1/2 flex flex-col gap-2 flex-shrink-0">
          <div className="relative aspect-[3/4] w-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
            <img
              src={activeImage || product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.is_new && (
              <span className="absolute top-2.5 left-2.5 bg-black text-white text-[9px] sm:text-xs font-mono font-extrabold uppercase px-2.5 py-1 rounded-xs tracking-wider shadow">
                NEW COLLECTION
              </span>
            )}
          </div>

          {/* Gallery Thumbnails (if multiple images exist) */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-12 h-14 rounded overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImage === img ? "border-black scale-105 shadow-sm" : "border-neutral-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
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
