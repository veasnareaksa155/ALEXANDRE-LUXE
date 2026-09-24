import React from "react";
import {
  FilterOutlined,
  ReloadOutlined,
  CheckOutlined,
  TagOutlined,
  ThunderboltOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Slider } from "antd";

const FilterSidebar = ({
  products = [],
  activeCategory = "all",
  onSelectCategory,
  priceRange = [0, 300],
  onPriceChange,
  selectedStatus = [], // "new", "sale"
  onToggleStatus,
  selectedSizes = [], // "S", "M", "L", "XL"
  onToggleSize,
  selectedColors = [], // hex or color names
  onToggleColor,
  onResetFilters,
  totalCount = 0,
}) => {
  // Compute category item counts
  const categoryCounts = {
    all: products.length,
    shirt: products.filter(
      (p) => (p.category?.slug || p.category_slug) === "shirt",
    ).length,
    "t-shirt": products.filter(
      (p) => (p.category?.slug || p.category_slug) === "t-shirt",
    ).length,
    shoes: products.filter(
      (p) => (p.category?.slug || p.category_slug) === "shoes",
    ).length,
  };

  const categoryOptions = [
    { label: "ALL COLLECTIONS", value: "all", count: categoryCounts.all },
    { label: "TAILORED SHIRTS", value: "shirt", count: categoryCounts.shirt },
    {
      label: "LUXURY T-SHIRTS",
      value: "t-shirt",
      count: categoryCounts["t-shirt"],
    },
    { label: "SHOES & FOOTWEAR", value: "shoes", count: categoryCounts.shoes },
  ];

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  const colorOptions = [
    { name: "Monochrome Black", hex: "#000000" },
    { name: "Crisp White", hex: "#FFFFFF" },
    { name: "Parisian Amber", hex: "#F59E0B" },
    { name: "Navy Blue", hex: "#1E293B" },
    { name: "Burgundy Red", hex: "#781D2E" },
  ];

  const hasActiveFilters =
    activeCategory !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < 300 ||
    selectedStatus.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0;

  return (
    <aside className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xl shadow-black/5 space-y-6 text-neutral-900">
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-amber-500 text-sm sm:text-base" />
          <h3 className="font-serif font-black uppercase text-sm sm:text-base text-black tracking-wider">
            FILTER CATALOGUE
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[10px] sm:text-xs font-mono font-bold uppercase text-neutral-500 hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset All Filters"
          >
            <ReloadOutlined className="text-[10px]" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* 1. Category Tree */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-3">
          COLLECTION CATEGORY
        </h4>
        <div className="space-y-1.5">
          {categoryOptions.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-md transform scale-[1.02]"
                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:text-black border border-neutral-200/60"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-amber-400 text-black font-extrabold"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Slider */}
      <div className="pt-2 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
            <DollarOutlined className="text-amber-500" />
            PRICE RANGE ($)
          </h4>
          <span className="text-xs font-mono font-bold text-black bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          range
          min={0}
          max={300}
          step={5}
          value={priceRange}
          onChange={onPriceChange}
          styles={{
            track: { background: "#000000" },
            handle: { borderColor: "#000000", backgroundColor: "#F59E0B" },
          }}
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
          <span>$0</span>
          <span>$150</span>
          <span>$300+</span>
        </div>
      </div>

      {/* 3. Status Badges Toggle */}
      <div className="pt-2 border-t border-neutral-100">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-3">
          SPECIAL DROPS & OFFERS
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onToggleStatus("new")}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedStatus.includes("new")
                ? "bg-black text-white shadow-md border-2 border-black"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <ThunderboltOutlined className="text-amber-400" />
            <span>NEW DROPS</span>
          </button>

          <button
            onClick={() => onToggleStatus("sale")}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedStatus.includes("sale")
                ? "bg-red-600 text-white shadow-md border-2 border-red-600"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <TagOutlined className="text-white" />
            <span>SPECIAL SALE</span>
          </button>
        </div>
      </div>

      {/* 4. Sizes Swatches Grid */}
      <div className="pt-2 border-t border-neutral-100">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-3">
          SELECT SIZE
        </h4>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((sz) => {
            const isSelected = selectedSizes.includes(sz);
            return (
              <button
                key={sz}
                onClick={() => onToggleSize(sz)}
                className={`w-10 h-10 rounded-xl text-xs font-mono font-extrabold uppercase transition-all cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? "bg-black text-amber-400 border-2 border-black shadow-md scale-105"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200"
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Color Accent Swatches */}
      <div className="pt-2 border-t border-neutral-100">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-3">
          COLOR SWATCHES
        </h4>
        <div className="flex items-center gap-2.5">
          {colorOptions.map((col) => {
            const isSelected = selectedColors.includes(col.hex);
            return (
              <button
                key={col.hex}
                onClick={() => onToggleColor(col.hex)}
                title={col.name}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center border ${
                  col.hex === "#FFFFFF"
                    ? "border-neutral-400"
                    : "border-transparent"
                } ${isSelected ? "scale-125 ring-2 ring-amber-400 ring-offset-2" : "hover:scale-110"}`}
                style={{ backgroundColor: col.hex }}
              >
                {isSelected && (
                  <CheckOutlined
                    className={`text-[10px] ${
                      col.hex === "#FFFFFF" ? "text-black" : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono">
        <span className="text-neutral-500 font-semibold uppercase">
          MATCHING ITEMS
        </span>
        <span className="font-extrabold text-black bg-amber-400 px-2.5 py-0.5 rounded-full">
          {totalCount} PRODUCTS
        </span>
      </div>
    </aside>
  );
};

export default FilterSidebar;
