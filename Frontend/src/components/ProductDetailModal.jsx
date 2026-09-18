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

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={780}
      centered
      closeIcon={<CloseOutlined className="text-xs sm:text-sm md:text-base" />}
      className="product-detail-modal"
    >
      <div className="flex flex-col md:flex-row gap-3 sm:gap-5 md:gap-7 items-stretch pt-0.5">
        {/* Left: Product Image Showcase - Increased Height on Mobile */}
        <div className="relative w-full md:w-1/2 h-48 sm:h-64 md:h-80 lg:h-96 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          {product.is_new && (
            <span className="absolute top-2.5 left-2.5 bg-black text-white text-[9px] sm:text-xs font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs tracking-wider shadow">
              NEW COLLECTION
            </span>
          )}
        </div>

        {/* Right: Meta & Interactive Options */}
        <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 space-y-2 sm:space-y-0">
          <div>
            {/* Category & Close spacer */}
            <div className="flex items-center justify-between mb-1 pr-6">
              <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest">
                {product.category?.name || "ALEXANDRE LUXE"}
              </span>
            </div>

            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-serif text-black uppercase tracking-tight mb-1 sm:mb-2 pr-6 leading-snug">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline space-x-2 sm:space-x-3 mb-1.5 sm:mb-2.5">
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-black font-sans">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs sm:text-sm md:text-sm lg:text-base text-neutral-400 line-through font-sans">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-xs md:text-xs lg:text-sm text-neutral-600 leading-relaxed mb-2.5 sm:mb-4 font-light line-clamp-2 sm:line-clamp-3">
              {product.description}
            </p>

            {/* Inline Size & Color Options Box */}
            <div className="space-y-2 sm:space-y-3 mb-2.5 sm:mb-4 bg-neutral-50 p-2.5 sm:p-3 md:p-3.5 rounded-md border border-neutral-200">
              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-black">
                      Size:
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-neutral-500">
                      {selectedSize}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded border transition-all ${
                          selectedSize === sz
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-black">
                      Color:
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-neutral-500">
                      {selectedColor}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded border transition-all ${
                          selectedColor === col
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
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
