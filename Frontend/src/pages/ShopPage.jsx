import React, { useEffect } from "react";
import CategoryBar from "../components/CategoryBar";
import ProductGrid from "../components/ProductGrid";

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter products by active category and search query
  const filteredProducts = products.filter((product) => {
    if (activeCategory && activeCategory !== "all") {
      const catSlug = product.category?.slug || product.category_slug;
      if (catSlug !== activeCategory) {
        return false;
      }
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = product.name?.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const catMatch = product.category?.name?.toLowerCase().includes(query);
      if (!nameMatch && !descMatch && !catMatch) {
        return false;
      }
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

  return (
    <div className="bg-white text-neutral-900 pb-20">
      {/* Page Header */}
      <div className="bg-black text-white py-12 sm:py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            ALEXANDRE LUXE CATALOGUE
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif uppercase tracking-tight text-white mb-2">
            SHOP ALL COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto font-light leading-relaxed">
            Browse our complete catalog of tailored shirts, heavyweight cotton
            tees, and handmade calfskin footwear.
          </p>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="pt-6">
        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          totalCount={sortedProducts.length}
        />
      </div>

      {/* Product Grid Showcase */}
      <ProductGrid
        products={sortedProducts}
        loading={loading}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
        activeCategory={activeCategory}
        wishlistItems={wishlistItems}
        onToggleWishlist={onToggleWishlist}
      />
    </div>
  );
};

export default ShopPage;
