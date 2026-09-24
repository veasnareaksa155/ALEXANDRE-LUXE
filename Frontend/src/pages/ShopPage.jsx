import React, { useState, useEffect } from "react";
import { Drawer, Button, Select, Empty, Skeleton } from "antd";
import { FilterOutlined, SlidersOutlined } from "@ant-design/icons";
import CategoryBar from "../components/CategoryBar";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";

const ShopPage = ({
  categories = [],
  products = [],
  loading = false,
  activeCategory = "all",
  onSelectCategory,
  searchQuery = "",
  onSearchChange,
  sortBy = "latest",
  onSortChange,
  onQuickView,
  onAddToCart,
  wishlistItems = [],
  onToggleWishlist,
}) => {
  // Advanced Filter States
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedStatus, setSelectedStatus] = useState([]); // "new", "sale"
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleToggleColor = (colorHex) => {
    setSelectedColors((prev) =>
      prev.includes(colorHex)
        ? prev.filter((c) => c !== colorHex)
        : [...prev, colorHex],
    );
  };

  const handleResetFilters = () => {
    if (onSelectCategory) onSelectCategory("all");
    if (onSearchChange) onSearchChange("");
    setPriceRange([0, 300]);
    setSelectedStatus([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  // Filter products dynamically based on all left sidebar filters
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    if (activeCategory && activeCategory !== "all") {
      const catSlug = product.category?.slug || product.category_slug;
      if (catSlug !== activeCategory) return false;
    }

    // 2. Search Query Filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = product.name?.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const catMatch = product.category?.name?.toLowerCase().includes(query);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }

    // 3. Price Range Filter
    const price = Number(product.price);
    if (price < priceRange[0] || price > priceRange[1]) return false;

    // 4. Special Drops / Sale Status Filter
    if (selectedStatus.length > 0) {
      const matchesNew = selectedStatus.includes("new") && product.is_new;
      const matchesSale =
        selectedStatus.includes("sale") &&
        product.original_price &&
        Number(product.original_price) > Number(product.price);
      if (!matchesNew && !matchesSale) return false;
    }

    // 5. Sizes Filter
    if (selectedSizes.length > 0) {
      const prodSizes =
        product.sizes && product.sizes.length > 0
          ? product.sizes
          : ["S", "M", "L", "XL"];
      const hasMatchingSize = selectedSizes.some((sz) =>
        prodSizes.includes(sz),
      );
      if (!hasMatchingSize) return false;
    }

    return true;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") {
      return Number(a.price) - Number(b.price);
    }
    if (sortBy === "price_desc") {
      return Number(b.price) - Number(a.price);
    }
    return b.id - a.id;
  });

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case "shirt":
        return "TAILORED SHIRTS COLLECTION";
      case "t-shirt":
        return "LUXURY T-SHIRTS COLLECTION";
      case "shoes":
        return "FOOTWEAR & SHOES COLLECTION";
      default:
        return "EXPLORE ALL COLLECTIONS";
    }
  };

  const wishlistIds = new Set(wishlistItems.map((item) => item.id));

  return (
    <div className="bg-white text-neutral-900 pb-20">
      {/* Page Header */}
      <div className="bg-black text-white py-12 sm:py-16 px-4 text-center scroll-reveal">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            PARISIAN LUXURY ATELIER
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif uppercase tracking-tight text-white mb-2">
            SHOP ALL COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto font-light leading-relaxed">
            Filter our complete catalogue of tailored shirts, heavyweight cotton
            tees, and handmade calfskin footwear by price, sizes, and special
            drops.
          </p>
        </div>
      </div>

      {/* Top Search & Category Pills Bar */}
      <div className="pt-6 scroll-reveal relative z-30">
        <CategoryBar
          categories={categories}
          products={products}
          wishlistItems={wishlistItems}
          onQuickView={onQuickView}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          totalCount={sortedProducts.length}
        />
      </div>

      {/* Main Layout: Left Filter Sidebar + Right Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-reveal">
        {/* Mobile Filter Toggle & Controls Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-1">
              CATALOGUE SHOWCASE
            </span>
            <h2 className="text-xl sm:text-3xl font-bold font-serif text-black uppercase tracking-tight">
              {getCategoryTitle()}
            </h2>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Button Trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-neutral-800 cursor-pointer"
            >
              <SlidersOutlined className="text-amber-400" />
              <span>FILTER & SORT ({sortedProducts.length})</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 whitespace-nowrap hidden sm:inline-block">
                Sort:
              </span>
              <Select
                value={sortBy}
                onChange={onSortChange}
                options={[
                  { value: "latest", label: "Latest Arrivals" },
                  { value: "price_asc", label: "Price: Low to High" },
                  { value: "price_desc", label: "Price: High to Low" },
                ]}
                className="w-40 sm:w-48 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar (Desktop View) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar
              products={products}
              activeCategory={activeCategory}
              onSelectCategory={onSelectCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedStatus={selectedStatus}
              onToggleStatus={handleToggleStatus}
              selectedSizes={selectedSizes}
              onToggleSize={handleToggleSize}
              selectedColors={selectedColors}
              onToggleColor={handleToggleColor}
              onResetFilters={handleResetFilters}
              totalCount={sortedProducts.length}
            />
          </div>

          {/* Right Product Showcase Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="p-3 border border-neutral-200 rounded-2xl bg-white shadow-xs"
                  >
                    <Skeleton.Image
                      active
                      className="!w-full !h-48 sm:!h-64 mb-3 rounded-xl"
                    />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="py-20 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 p-6">
                <Empty
                  description={
                    <div className="space-y-3">
                      <span className="text-sm font-bold text-neutral-700 uppercase tracking-wider block">
                        No products match your active filter criteria.
                      </span>
                      <button
                        onClick={handleResetFilters}
                        className="bg-black text-white hover:bg-amber-400 hover:text-black text-xs font-extrabold px-5 py-2.5 rounded-full tracking-widest uppercase transition-all shadow-md cursor-pointer"
                      >
                        RESET ALL FILTERS
                      </button>
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 scroll-reveal-stagger">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlistIds.has(product.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-over Drawer Filter */}
      <Drawer
        title={
          <div className="flex items-center gap-2 font-serif uppercase tracking-wider text-black">
            <FilterOutlined className="text-amber-500" />
            <span>PRODUCT FILTERS</span>
          </div>
        }
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={320}
        styles={{ body: { padding: "16px" } }}
      >
        <FilterSidebar
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            onSelectCategory(cat);
            setMobileDrawerOpen(false);
          }}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          selectedStatus={selectedStatus}
          onToggleStatus={handleToggleStatus}
          selectedSizes={selectedSizes}
          onToggleSize={handleToggleSize}
          selectedColors={selectedColors}
          onToggleColor={handleToggleColor}
          onResetFilters={handleResetFilters}
          totalCount={sortedProducts.length}
        />
      </Drawer>
    </div>
  );
};

export default ShopPage;
