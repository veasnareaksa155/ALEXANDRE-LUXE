import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const CategoryBar = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery = "",
  onSearchChange,
  totalCount,
}) => {
  const options = [
    { label: "ALL PRODUCTS", value: "all" },
    { label: "SHIRTS", value: "shirt" },
    { label: "T-SHIRTS", value: "t-shirt" },
    { label: "SHOES", value: "shoes" },
  ];

  return (
    <div className="bg-neutral-50 border-y border-neutral-200 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills / Segmented Buttons */}
        <div className="flex items-center space-x-2.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {options.map((option) => {
            const isActive = activeCategory === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onSelectCategory(option.value)}
                className={`px-5 py-2.5 text-xs sm:text-sm font-extrabold tracking-wider uppercase rounded-full transition-all duration-300 whitespace-nowrap shadow-sm ${
                  isActive
                    ? "bg-black text-white shadow-md scale-105"
                    : "bg-white text-neutral-800 hover:bg-neutral-200 border border-neutral-300"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Right Search Input & Count Tag */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto justify-end">
          {onSearchChange && (
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search products in shop..."
                prefix={<SearchOutlined className="text-neutral-400" />}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                allowClear
                className="rounded-full border-neutral-300 hover:border-black focus:border-black text-xs py-1.5"
              />
            </div>
          )}

          <div className="text-xs sm:text-sm font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
            <span>RESULTS:</span>
            <span className="bg-black text-white px-3 py-1 rounded-full font-extrabold text-xs sm:text-sm">
              {totalCount} ITEMS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
