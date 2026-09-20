import React from "react";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  StarFilled,
} from "@ant-design/icons";

const ProductCard = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100,
      )
    : 0;

  const rating =
    product.rating || (4.7 + ((product.id || 1) % 4) * 0.1).toFixed(1);
  const reviewsCount =
    product.reviews_count || (((product.id || 1) * 23) % 180) + 24;

  return (
    <div className="group bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Subtle Backdrop Blur & Soft Dark Tint Overlay on Hover */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[5]" />

        {/* Status Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.is_new && (
            <span className="bg-black text-white text-[10px] sm:text-xs font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs tracking-wider shadow">
              NEW
            </span>
          )}
          {product.is_featured && (
            <span className="bg-neutral-900 text-white text-[10px] sm:text-xs font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs tracking-wider shadow">
              HOT
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs tracking-wider shadow">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Centered Quick View Button Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="pointer-events-auto bg-black/85 hover:bg-black text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300 border border-white/20 backdrop-blur-md cursor-pointer"
            title="Quick View"
          >
            <EyeOutlined className="text-sm" />
            <span>QUICK VIEW</span>
          </button>
        </div>

        {/* Top Right Action Icon (Wishlist Heart Only) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 hover:bg-white text-black transition-all duration-200 cursor-pointer"
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isWishlisted ? (
              <HeartFilled
                style={{ color: "#ff4d4f" }}
                className="text-xs sm:text-sm"
              />
            ) : (
              <HeartOutlined className="text-xs sm:text-sm" />
            )}
          </button>
        </div>
      </div>

      {/* Product Details Container */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-widest block">
              {product.category?.name || "ALEXANDRE LUXE"}
            </span>

            {/* Rating Stars */}
            <div className="flex items-center gap-0.5">
              <StarFilled
                style={{ color: "#fbbf24" }}
                className="text-[10px] sm:text-xs text-amber-400"
              />
              <span className="text-[10px] sm:text-xs font-bold font-mono text-neutral-800">
                {rating}
              </span>
              <span className="text-[9px] text-neutral-400 font-mono">
                ({reviewsCount})
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-bold text-black hover:text-neutral-600 cursor-pointer line-clamp-1 mb-1.5 sm:mb-2 font-serif transition-colors"
          >
            {product.name}
          </h3>

          {/* Sizes preview */}
          {product.sizes && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.sizes.map((sz) => (
                <span
                  key={sz}
                  className="text-[9px] sm:text-[10px] font-mono font-semibold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200"
                >
                  {sz}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-neutral-100 mt-1">
          <div className="flex items-baseline space-x-1.5 sm:space-x-2">
            <span className="text-sm sm:text-base font-black text-black font-sans">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-sans">
                ${Number(product.original_price).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-black hover:bg-neutral-800 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition-all transform hover:scale-105 cursor-pointer"
          >
            <ShoppingCartOutlined className="text-xs sm:text-sm" />
            <span>+ ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
