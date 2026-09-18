import React, { useState, useEffect } from "react";
import { ConfigProvider, notification } from "antd";
import { luxuryTheme, adminDarkTheme } from "./theme/antdTheme";
import { fetchCategories, fetchProducts } from "./services/api";

import Navbar from "./components/Navbar";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrderSuccessModal from "./components/OrderSuccessModal";
import AuthModal from "./components/AuthModal";
import AdminAuthModal from "./components/AdminAuthModal";
import Footer from "./components/Footer";
import CategoryBar from "./components/CategoryBar";
import ProductGrid from "./components/ProductGrid";

// Full View Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AboutPage from "./pages/AboutPage";
import LookbookPage from "./pages/LookbookPage";
import ContactPage from "./pages/ContactPage";
import UserAccountPage from "./pages/UserAccountPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  // State variables
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Multi-Page SPA View State ('home' | 'shop' | 'about' | 'lookbook' | 'contact')
  const [activePage, setActivePage] = useState("home");

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Authenticated User Profile State (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("alexandre_luxe_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userSessionRole, setUserSessionRole] = useState(() => {
    return currentUser?.role || "user";
  });

  // Save current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(
          "alexandre_luxe_user",
          JSON.stringify(currentUser),
        );
      } else {
        localStorage.removeItem("alexandre_luxe_user");
      }
    } catch (e) {
      console.error("Failed to save user:", e);
    }
  }, [currentUser]);

  // Cart Items State (persisted in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("alexandre_luxe_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist Items State (persisted in localStorage)
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem("alexandre_luxe_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("alexandre_luxe_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [cartItems]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "alexandre_luxe_wishlist",
        JSON.stringify(wishlistItems),
      );
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [wishlistItems]);

  // IntersectionObserver for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    const revealElements = document.querySelectorAll(".scroll-reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [products, loading, activeCategory, activePage]);

  // Load Categories & Products from Backend API
  const loadData = async () => {
    setLoading(true);
    try {
      const [catData, prodData] = await Promise.allSettled([
        fetchCategories(),
        fetchProducts(),
      ]);

      if (catData.status === "fulfilled" && catData.value) {
        setCategories(catData.value);
      }

      if (prodData.status === "fulfilled" && prodData.value) {
        setProducts(prodData.value);
      }
    } catch (error) {
      console.error("API Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart operations
  const handleAddToCart = (
    product,
    quantity = 1,
    size = null,
    color = null,
  ) => {
    const itemSize = size || (product.sizes && product.sizes[0]) || "Standard";
    const itemColor =
      color || (product.colors && product.colors[0]) || "Standard";

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) =>
          i.id === product.id && i.size === itemSize && i.color === itemColor,
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            size: itemSize,
            color: itemColor,
            quantity,
          },
        ];
      }
    });

    notification.success({
      message: "ADDED TO BAG",
      description: `${quantity}x ${product.name} (${itemSize}) added to your shopping bag.`,
      placement: "bottomRight",
      duration: 2.5,
    });
  };

  const handleUpdateQuantity = (id, size, color, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id, size, color);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: newQty }
          : item,
      ),
    );
  };

  const handleRemoveCartItem = (id, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color),
      ),
    );
  };

  const handleBulkRemoveCartItems = (selectedKeys) => {
    const keySet = new Set(selectedKeys);
    setCartItems((prev) =>
      prev.filter(
        (item) => !keySet.has(`${item.id}-${item.size}-${item.color}`),
      ),
    );
    notification.info({
      message: "ITEMS REMOVED",
      description: `${selectedKeys.length} items removed from your shopping bag.`,
      placement: "bottomRight",
      duration: 2,
    });
  };

  // Wishlist Operations
  const handleToggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      notification.info({
        message: "REMOVED FROM WISHLIST",
        description: `${product.name} removed from your saved items.`,
        placement: "bottomRight",
        duration: 2,
      });
    } else {
      setWishlistItems((prev) => [...prev, product]);
      notification.success({
        message: "ADDED TO WISHLIST",
        description: `${product.name} saved to your wishlist.`,
        placement: "bottomRight",
        duration: 2,
      });
    }
  };

  const handleRemoveFromWishlist = (product) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
  };

  const handleBulkRemoveWishlist = (selectedIds) => {
    const idSet = new Set(selectedIds);
    setWishlistItems((prev) => prev.filter((item) => !idSet.has(item.id)));
    notification.info({
      message: "WISHLIST UPDATED",
      description: `${selectedIds.length} items removed from your wishlist.`,
      placement: "bottomRight",
      duration: 2,
    });
  };

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalWishlistCount = wishlistItems.length;

  const handleExploreCategory = (catKey) => {
    setActivePage("shop");
    setActiveCategory(catKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderSuccess = (order) => {
    setCheckoutOpen(false);
    setCartOpen(false);
    setCartItems([]);
    setOrderSuccessData(order);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserSessionRole("user");
    try {
      localStorage.removeItem("alexandre_luxe_user");
    } catch (e) {
      console.error(e);
    }
    setActivePage("home");
    notification.info({
      message: "SIGNED OUT",
      description: "You have been signed out of your account.",
      placement: "bottomRight",
      duration: 2,
    });
  };

  // Automatically redirect Admin users away from Customer Account page to Admin Dashboard
  useEffect(() => {
    if (
      currentUser?.role === "admin" &&
      (activePage === "account" || activePage === "dashboard")
    ) {
      setActivePage("admin");
    }
  }, [currentUser, activePage]);

  // Route Listener for /admin URL entry & URL sync
  useEffect(() => {
    const checkRoute = () => {
      if (
        window.location.pathname === "/admin" ||
        window.location.search.includes("admin")
      ) {
        setActivePage("admin");
      }
    };
    checkRoute();
    window.addEventListener("popstate", checkRoute);
    return () => window.removeEventListener("popstate", checkRoute);
  }, []);

  // Sync browser URL bar with activePage state
  useEffect(() => {
    if (activePage === "admin" && window.location.pathname !== "/admin") {
      window.history.pushState({}, "", "/admin");
    } else if (
      activePage !== "admin" &&
      window.location.pathname === "/admin"
    ) {
      window.history.pushState({}, "", "/");
    }
  }, [activePage]);

  // Handle Admin Isolated Full-Screen Layout vs Store Customer Layout
  if (activePage === "admin") {
    if (currentUser?.role === "admin" || userSessionRole === "admin") {
      return (
        <ConfigProvider theme={luxuryTheme}>
          <AdminDashboardPage
            products={products}
            categories={categories}
            onNavigateStore={() => setActivePage("home")}
            onLogout={handleLogout}
          />
        </ConfigProvider>
      );
    } else {
      return (
        <ConfigProvider theme={adminDarkTheme}>
          <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
            <AdminAuthModal
              open={true}
              onClose={() => setActivePage("home")}
              onLoginSuccess={(userData) => {
                setCurrentUser(userData);
                setUserSessionRole("admin");
                setActivePage("admin");
              }}
            />
          </div>
        </ConfigProvider>
      );
    }
  }

  return (
    <ConfigProvider theme={luxuryTheme}>
      <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased flex flex-col justify-between">
        {/* Header Navigation Bar */}
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => setCartOpen(true)}
          wishlistCount={totalWishlistCount}
          onOpenWishlist={() => setWishlistOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activePage={activePage}
          userRole={userSessionRole}
          user={currentUser}
          onNavigatePage={(pageKey) => {
            setActivePage(pageKey);
            if (pageKey === "shop") {
              setActiveCategory("all");
            }
          }}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-grow">
          {activePage === "home" && (
            <HomePage
              products={products}
              loading={loading}
              onQuickView={(prod) => setSelectedProduct(prod)}
              onAddToCart={handleAddToCart}
              wishlistItems={wishlistItems}
              onToggleWishlist={handleToggleWishlist}
              onExploreCategory={handleExploreCategory}
              onNavigatePage={setActivePage}
            />
          )}

          {activePage === "shop" && (
            <ShopPage
              categories={categories}
              products={products}
              loading={loading}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onQuickView={(prod) => setSelectedProduct(prod)}
              onAddToCart={handleAddToCart}
              wishlistItems={wishlistItems}
              onToggleWishlist={handleToggleWishlist}
            />
          )}

          {activePage === "about" && (
            <AboutPage onNavigateHome={() => setActivePage("home")} />
          )}

          {activePage === "lookbook" && (
            <LookbookPage
              products={products}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
            />
          )}

          {activePage === "contact" && <ContactPage />}

          {(activePage === "account" || activePage === "dashboard") && (
            <UserAccountPage
              user={currentUser}
              onUpdateProfile={(updated) => setCurrentUser(updated)}
              onLogout={handleLogout}
              wishlistItems={wishlistItems}
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setSelectedProduct(prod)}
              onNavigateShop={() => setActivePage("shop")}
            />
          )}
        </main>

        {/* Auth Modal (Login for Client VIP / Admin Dashboard) */}
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(userData) => {
            setCurrentUser(userData);
            setUserSessionRole(userData.role);
            if (userData.role === "admin") {
              setActivePage("admin");
            } else {
              setActivePage("account");
            }
          }}
        />

        {/* Product Quick View Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={
            selectedProduct
              ? wishlistItems.some((i) => i.id === selectedProduct.id)
              : false
          }
          onToggleWishlist={handleToggleWishlist}
        />

        {/* Cart Drawer */}
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveCartItem}
          onBulkRemoveItems={handleBulkRemoveCartItems}
          onProceedToCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />

        {/* Wishlist Drawer */}
        <WishlistDrawer
          open={wishlistOpen}
          onClose={() => setWishlistOpen(false)}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onBulkRemoveWishlist={handleBulkRemoveWishlist}
          onAddToCart={handleAddToCart}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cartItems={cartItems}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* Order Success Modal */}
        <OrderSuccessModal
          open={!!orderSuccessData}
          onClose={() => setOrderSuccessData(null)}
          orderData={orderSuccessData}
        />

        {/* Footer */}
        <div className="scroll-reveal">
          <Footer
            onSelectCategory={(catKey) => {
              setActivePage("shop");
              setActiveCategory(catKey);
            }}
            onNavigatePage={setActivePage}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
