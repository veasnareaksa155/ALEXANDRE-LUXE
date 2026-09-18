import React, { useState } from "react";
import { Badge, Drawer, Input } from "antd";
import {
  ShoppingOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  HeartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  CameraOutlined,
  MailOutlined,
  UserOutlined,
  CrownOutlined,
} from "@ant-design/icons";

const Navbar = ({
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  searchQuery,
  onSearchChange,
  activePage,
  userRole,
  user,
  onNavigatePage,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const handleHomeClick = () => {
    onNavigatePage("home");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShopClick = () => {
    onNavigatePage("shop");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageClick = (pageKey) => {
    onNavigatePage(pageKey);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = () => {
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(true);
    } else {
      handleHomeClick();
    }
  };

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    onSearchChange(val);
    if (val && activePage !== "shop") {
      onNavigatePage("shop");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all duration-300">
      {/* Top Banner */}
      <div className="hidden sm:block bg-black text-white text-xs py-2 px-4 text-center font-medium tracking-widest uppercase">
        <span>
          ✨ Free Worldwide Express Shipping on Orders Over $200 | Alexandre
          Luxe
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Navigation (Desktop Site Pages) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button
              onClick={handleHomeClick}
              className={`text-xs font-bold tracking-wider uppercase transition-colors duration-200 relative py-1 ${
                activePage === "home"
                  ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              HOME
            </button>

            <button
              onClick={handleShopClick}
              className={`text-xs font-bold tracking-wider uppercase transition-colors duration-200 relative py-1 ${
                activePage === "shop"
                  ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              SHOP & COLLECTIONS
            </button>

            <button
              onClick={() => handlePageClick("about")}
              className={`text-xs font-bold tracking-wider uppercase transition-colors duration-200 relative py-1 ${
                activePage === "about"
                  ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              ABOUT
            </button>

            <button
              onClick={() => handlePageClick("lookbook")}
              className={`text-xs font-bold tracking-wider uppercase transition-colors duration-200 relative py-1 ${
                activePage === "lookbook"
                  ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              LOOKBOOK & MODELS
            </button>

            <button
              onClick={() => handlePageClick("contact")}
              className={`text-xs font-bold tracking-wider uppercase transition-colors duration-200 relative py-1 ${
                activePage === "contact"
                  ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              CONTACT
            </button>
          </nav>

          {/* Center Brand Logo */}
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <img
              src="/images/LOGO.png"
              alt="Alexandre Luxe"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                // Fallback text if logo fails
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="hidden font-serif text-xl sm:text-2xl tracking-widest uppercase font-bold text-black whitespace-nowrap">
              ALEXANDRE LUXE
            </span>
          </div>

          {/* Right Actions (Inline Expanding Search, Dashboard, Wishlist & Cart) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Inline Smooth Expanding Search Bar */}
            <div className="relative flex items-center">
              {/* Expandable Input Box (Expands to the left on the same row) */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
                  showSearchMobile
                    ? "w-40 sm:w-52 md:w-60 opacity-100 mr-1"
                    : "w-0 opacity-0 pointer-events-none"
                }`}
              >
                <Input
                  placeholder="Search items..."
                  suffix={
                    <button
                      onClick={() => {
                        onSearchChange("");
                        setShowSearchMobile(false);
                      }}
                      className="text-neutral-400 hover:text-black transition-colors flex items-center justify-center p-0.5"
                      title="Close search"
                    >
                      <CloseOutlined
                        style={{ fontSize: "12px", color: "#666" }}
                      />
                    </button>
                  }
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full text-xs !rounded-full border-neutral-300 py-1.5 pl-4 pr-2.5 shadow-xs hover:border-black focus:border-black transition-all"
                  autoFocus={showSearchMobile}
                />
              </div>

              {/* Search Toggle Icon Button */}
              <button
                onClick={() => {
                  if (showSearchMobile && !searchQuery) {
                    setShowSearchMobile(false);
                  } else {
                    setShowSearchMobile(!showSearchMobile);
                  }
                }}
                className={`p-2 rounded-full transition-colors leading-none flex items-center justify-center ${
                  showSearchMobile
                    ? "text-black bg-neutral-100"
                    : "text-black hover:bg-neutral-100"
                }`}
                aria-label="Search items"
                title="Search items"
              >
                <SearchOutlined style={{ fontSize: "18px" }} />
              </button>
            </div>

            {/* Account Button */}
            <button
              onClick={() => {
                if (user && (user.role === "admin" || userRole === "admin")) {
                  onNavigatePage("admin");
                } else if (user) {
                  onNavigatePage("account");
                } else if (onOpenAuthModal) {
                  onOpenAuthModal();
                } else {
                  handlePageClick("account");
                }
              }}
              className={`w-10 h-10 p-0 rounded-full flex items-center justify-center border transition-all duration-300 leading-none shadow-xs font-serif font-bold text-sm ${
                activePage === "account" || activePage === "admin"
                  ? "bg-black text-white border-black"
                  : user
                    ? "bg-neutral-900 text-white border-black hover:bg-neutral-800"
                    : "bg-neutral-100 text-black border-neutral-200 hover:bg-neutral-200"
              }`}
              aria-label="User Account Portal"
              title={
                user?.role === "admin"
                  ? `Logged in as ${user.name} - View Admin Dashboard`
                  : user
                    ? `Logged in as ${user.name} - View VIP Account`
                    : "Sign In or Register VIP Account"
              }
            >
              {user && user.name ? (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <UserOutlined style={{ fontSize: "17px" }} />
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative w-10 h-10 p-0 bg-neutral-100 text-black rounded-full hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center border border-neutral-200 shadow-sm leading-none"
              aria-label="View Wishlist"
              title="View Wishlist"
            >
              <Badge
                count={wishlistCount}
                showZero={false}
                overflowCount={99}
                color="#000000"
                style={{ color: "#ffffff", fontWeight: "bold" }}
              >
                <HeartOutlined style={{ fontSize: "18px", color: "#000000" }} />
              </Badge>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative w-10 h-10 p-0 bg-black text-white rounded-full hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center shadow-sm leading-none"
              aria-label="View Shopping Cart"
            >
              <Badge
                count={cartCount}
                showZero={false}
                overflowCount={99}
                color="#ffffff"
                style={{ color: "#000000", fontWeight: "bold" }}
              >
                <ShoppingOutlined
                  style={{ fontSize: "19px", color: "#ffffff" }}
                />
              </Badge>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title={
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/images/LOGO.png" alt="Logo" className="h-8 w-auto" />
            <span className="font-serif text-base font-bold tracking-widest">
              ALEXANDRE LUXE
            </span>
          </div>
        }
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
        closeIcon={false}
      >
        <div className="flex flex-col space-y-4 pt-2">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            PAGES & NAVIGATION
          </p>

          <button
            onClick={handleHomeClick}
            className={`w-full text-left text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded flex items-center justify-between ${
              activePage === "home"
                ? "bg-black text-white"
                : "bg-neutral-50 hover:bg-neutral-100 text-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <HomeOutlined />
              <span>HOME</span>
            </div>
            <span>&rarr;</span>
          </button>

          <button
            onClick={handleShopClick}
            className={`w-full text-left text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded flex items-center justify-between ${
              activePage === "shop"
                ? "bg-black text-white"
                : "bg-neutral-50 hover:bg-neutral-100 text-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <AppstoreOutlined />
              <span>SHOP & COLLECTIONS</span>
            </div>
            <span>&rarr;</span>
          </button>

          <button
            onClick={() => handlePageClick("about")}
            className={`w-full text-left text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded flex items-center justify-between ${
              activePage === "about"
                ? "bg-black text-white"
                : "bg-neutral-50 hover:bg-neutral-100 text-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <InfoCircleOutlined />
              <span>ABOUT US</span>
            </div>
            <span>&rarr;</span>
          </button>

          <button
            onClick={() => handlePageClick("lookbook")}
            className={`w-full text-left text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded flex items-center justify-between ${
              activePage === "lookbook"
                ? "bg-black text-white"
                : "bg-neutral-50 hover:bg-neutral-100 text-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <CameraOutlined />
              <span>LOOKBOOK & MODELS</span>
            </div>
            <span>&rarr;</span>
          </button>

          <button
            onClick={() => handlePageClick("contact")}
            className={`w-full text-left text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded flex items-center justify-between ${
              activePage === "contact"
                ? "bg-black text-white"
                : "bg-neutral-50 hover:bg-neutral-100 text-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <MailOutlined />
              <span>CONTACT US</span>
            </div>
            <span>&rarr;</span>
          </button>

          <div className="pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 mb-1">VIP Concierge Care</p>
            <p className="text-xs font-semibold text-black">
              concierge@alexandreluxe.com
            </p>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
