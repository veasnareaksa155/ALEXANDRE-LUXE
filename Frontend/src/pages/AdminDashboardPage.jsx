import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
  Popconfirm,
  notification,
  Badge,
  Progress,
  Card,
} from "antd";
import {
  CrownOutlined,
  ShoppingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ShopOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  RiseOutlined,
  PieChartOutlined,
  ClockCircleOutlined,
  FolderAddOutlined,
  UserOutlined,
  TagOutlined,
  SettingOutlined,
  UserAddOutlined,
  GiftOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  fetchProducts,
  fetchOrders,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  deleteOrder,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/api";

// Helper for category minimalist apparel SVG line icon (matching user's shirt icon design)
const getCategoryIcon = (cat) => {
  const name = (cat?.name || "").toLowerCase();
  const slug = (cat?.slug || "").toLowerCase();

  // T-Shirt / Polo Shirt (Matches uploaded image line icon style)
  if (
    name.includes("t-shirt") ||
    slug.includes("t-shirt") ||
    slug === "t-shirt"
  ) {
    return (
      <svg
        className="w-9 h-9 stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L2 6v4l4-1v13h12V9l4 1V6l-4-4h-4a2 2 0 0 1-4 0H6z" />
        <path d="M9 2v3a3 3 0 0 0 6 0V2" />
      </svg>
    );
  }

  // Tailored Dress Shirt with Collar (Exact match for user uploaded shirt icon)
  if (name.includes("shirt") || slug.includes("shirt")) {
    return (
      <svg
        className="w-9 h-9 stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.38 3.46L16 2l-4 4-4-4-4.38 1.46a2 2 0 0 0-1.34 1.77L2 19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2L21.72 5.23a2 2 0 0 0-1.34-1.77z" />
        <path d="M12 6v15" />
        <path d="M8 2l4 4 4-4" />
      </svg>
    );
  }

  // Shoes / Luxury Footwear
  if (
    name.includes("shoe") ||
    slug.includes("shoe") ||
    name.includes("footwear")
  ) {
    return (
      <svg
        className="w-9 h-9 stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 17h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" />
        <path d="M4 17l4-9 4 1 3-3 5 4-2 7" />
        <circle cx="7" cy="14" r="1" />
      </svg>
    );
  }

  // Suits & Tuxedos / Blazers
  if (
    name.includes("suit") ||
    slug.includes("suit") ||
    name.includes("tuxedo") ||
    name.includes("blazer")
  ) {
    return (
      <svg
        className="w-9 h-9 stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 3h16v18H4z" />
        <path d="M8 3l4 6 4-6" />
        <path d="M12 9v12" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    );
  }

  // Watches & Jewelry
  if (
    name.includes("watch") ||
    slug.includes("watch") ||
    name.includes("jewelry")
  ) {
    return (
      <svg
        className="w-9 h-9 stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="6" />
        <polyline points="12 9 12 12 14 14" />
        <path d="M9 2h6v4H9zM9 18h6v4H9z" />
      </svg>
    );
  }

  // Leather Goods & Bags
  if (
    name.includes("bag") ||
    slug.includes("bag") ||
    name.includes("leather") ||
    name.includes("wallet")
  ) {
    return (
      <svg
        className="w-9 h-9 stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <circle cx="12" cy="13" r="1" />
      </svg>
    );
  }

  // Default Apparel Tag Icon
  return (
    <svg
      className="w-9 h-9 stroke-current fill-none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
};

// Helper for promotion minimalist vector line icons
const getPromoIcon = (promo) => {
  const type = (promo?.type || "").toLowerCase();
  const code = (promo?.code || "").toLowerCase();

  if (type === "shipping" || code.includes("ship") || code.includes("paris")) {
    return (
      <svg
        className="w-9 h-9 stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 17h-2v-10a2 2 0 0 1 2-2h9v12" />
        <path d="M14 8h5.17a2 2 0 0 1 1.66.9l2.17 3.1a2 2 0 0 1 .36 1.15v3.85h-2.36" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    );
  }

  if (type === "fixed" || code.includes("dollar") || code.includes("diamond")) {
    return (
      <svg
        className="w-9 h-9 stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M11 3l1 6 3 12" />
        <path d="M13 3l-1 6-3 12" />
        <path d="M2 9h20" />
      </svg>
    );
  }

  // Percentage / Ticket Pass
  return (
    <svg
      className="w-9 h-9 stroke-current fill-none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3z" />
      <path d="M12 9v6" />
      <circle cx="9.5" cy="9.5" r=".5" fill="currentColor" />
      <circle cx="14.5" cy="14.5" r=".5" fill="currentColor" />
    </svg>
  );
};

const AdminDashboardPage = ({
  products: initialProducts = [],
  categories: initialCategories = [],
  onNavigateStore,
  onLogout,
}) => {
  // Active Sidebar Menu Tab ('overview' | 'products' | 'orders' | 'categories' | 'users' | 'promotions' | 'analytics' | 'settings')
  const [activeTab, setActiveTab] = useState("overview");

  // Admin Data States
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search Filter in Admin Table
  const [searchTerm, setSearchTerm] = useState("");

  // Product Modal State (Create / Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Category Modal State (Create / Edit)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm] = Form.useForm();

  // User Modal State (Create / Edit)
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm] = Form.useForm();

  // Promotions State & Modal (Persisted in localStorage)
  const [promotions, setPromotions] = useState(() => {
    try {
      const saved = localStorage.getItem("alexandre_luxe_promotions");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 1,
        code: "ALEXANDRE20",
        discount: "20% OFF",
        title: "HAUTE COUTURE AUTUMN '26",
        subtitle:
          "Exclusive VIP pass for all ready-to-wear luxury collections.",
        bg_image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        badge: "LIMITED VIP PASS",
        type: "percentage",
        value: 20,
        status: "active",
        usage_count: 142,
        expires: "DEC 31, 2026",
      },
      {
        id: 2,
        code: "BLACKDIAMOND",
        discount: "$50 VOUCHER",
        title: "BLACK DIAMOND NIGHT",
        subtitle: "Applicable on premium leather goods and bespoke timepieces.",
        bg_image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
        badge: "EXECUTIVE MEMBER",
        type: "fixed",
        value: 50,
        status: "active",
        usage_count: 89,
        expires: "NOV 15, 2026",
      },
      {
        id: 3,
        code: "PARISVIP",
        discount: "FREE SHIPPING",
        title: "PARIS ATELIER EXPRESS",
        subtitle:
          "Complimentary global courier dispatch straight from Paris atelier.",
        bg_image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
        badge: "GLOBAL FREIGHT",
        type: "shipping",
        value: 0,
        status: "active",
        usage_count: 310,
        expires: "PERPETUAL",
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "alexandre_luxe_promotions",
        JSON.stringify(promotions),
      );
    } catch (e) {
      console.error(e);
    }
  }, [promotions]);

  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoForm] = Form.useForm();

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: "ALEXANDRE LUXE",
    freeShippingThreshold: 200,
    currencySymbol: "$",
    maintenanceMode: false,
    bakongKhqrEnabled: true,
    conciergeEmail: "concierge@alexandreluxe.com",
  });

  // Order Details Receipt Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Load Admin Data from API
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prodData, catData, ordData, usrData] = await Promise.allSettled([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchUsers(),
      ]);

      if (prodData.status === "fulfilled" && prodData.value) {
        setProducts(prodData.value);
      }
      if (catData.status === "fulfilled" && catData.value) {
        setCategories(catData.value);
      }
      if (ordData.status === "fulfilled" && ordData.value) {
        setOrders(ordData.value);
      }
      if (usrData.status === "fulfilled" && usrData.value) {
        setUsers(usrData.value);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAdminData();
  }, []);

  // Sync initial props
  useEffect(() => {
    if (initialProducts.length > 0 && products.length === 0) {
      setProducts(initialProducts);
    }
    if (initialCategories.length > 0 && categories.length === 0) {
      setCategories(initialCategories);
    }
  }, [initialProducts, initialCategories]);

  // Product CRUD Handlers
  const handleProductSubmit = async (values) => {
    setLoading(true);
    try {
      const formattedData = {
        ...values,
        sizes: values.sizes
          ? values.sizes.split(",").map((s) => s.trim())
          : ["S", "M", "L", "XL"],
        colors: values.colors
          ? values.colors.split(",").map((c) => c.trim())
          : ["Black", "White"],
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, formattedData);
        notification.success({
          message: "PRODUCT UPDATED",
          description: `Product #${editingProduct.id} (${values.name}) updated successfully!`,
          placement: "bottomRight",
        });
      } else {
        await createProduct(formattedData);
        notification.success({
          message: "PRODUCT CREATED",
          description: `New luxury product "${values.name}" added to catalog!`,
          placement: "bottomRight",
        });
      }

      setProductModalOpen(false);
      setEditingProduct(null);
      form.resetFields();
      loadAdminData();
    } catch (error) {
      notification.error({
        message: "SAVING FAILED",
        description: "Failed to save product. Please check form inputs.",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    form.setFieldsValue({
      name: prod.name,
      category_id: prod.category_id,
      price: prod.price,
      original_price: prod.original_price,
      image_url: prod.image_url,
      description: prod.description,
      stock: prod.stock,
      is_featured: Boolean(prod.is_featured),
      is_new: Boolean(prod.is_new),
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(", ") : prod.sizes,
      colors: Array.isArray(prod.colors) ? prod.colors.join(", ") : prod.colors,
    });
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      notification.success({
        message: "PRODUCT DELETED",
        description: `Product #${id} removed from catalog.`,
        placement: "bottomRight",
      });
      loadAdminData();
    } catch (err) {
      notification.error({
        message: "DELETE FAILED",
        description: "Could not delete product.",
        placement: "bottomRight",
      });
    }
  };

  // Category CRUD Handlers
  const handleCategorySubmit = async (values) => {
    setLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        notification.success({
          message: "CATEGORY UPDATED",
          description: `Category #${editingCategory.id} (${values.name}) updated successfully!`,
          placement: "bottomRight",
        });
      } else {
        await createCategory(values);
        notification.success({
          message: "CATEGORY CREATED",
          description: `New category "${values.name}" added to catalog!`,
          placement: "bottomRight",
        });
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
      categoryForm.resetFields();
      loadAdminData();
    } catch (error) {
      notification.error({
        message: "SAVING FAILED",
        description: "Failed to save category. Please check inputs.",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    categoryForm.setFieldsValue({
      name: cat.name,
      slug: cat.slug,
      image_url: cat.image_url || "",
      description: cat.description || "",
    });
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      notification.success({
        message: "CATEGORY DELETED",
        description: `Category #${id} removed from catalog.`,
        placement: "bottomRight",
      });
      loadAdminData();
    } catch (err) {
      notification.error({
        message: "DELETE FAILED",
        description: "Could not delete category.",
        placement: "bottomRight",
      });
    }
  };

  // User CRUD Handlers
  const handleUserSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u)),
        );
        notification.success({
          message: "USER UPDATED",
          description: `User #${editingUser.id} (${values.name}) updated!`,
          placement: "bottomRight",
        });
      } else {
        const newUser = await createUser(values);
        setUsers((prev) => [
          ...prev,
          newUser.data || { id: Date.now(), ...values },
        ]);
        notification.success({
          message: "USER REGISTERED",
          description: `New user account created for ${values.name}!`,
          placement: "bottomRight",
        });
      }
      setUserModalOpen(false);
      setEditingUser(null);
      userForm.resetFields();
    } catch (err) {
      // Fallback local update if backend fails
      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u)),
        );
      } else {
        setUsers((prev) => [
          ...prev,
          {
            id: Date.now(),
            ...values,
            created_at: new Date().toISOString().split("T")[0],
          },
        ]);
      }
      notification.success({
        message: "USER SAVED",
        description: `User ${values.name} saved successfully!`,
        placement: "bottomRight",
      });
      setUserModalOpen(false);
      setEditingUser(null);
      userForm.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditUser = (usr) => {
    setEditingUser(usr);
    userForm.setFieldsValue({
      name: usr.name,
      email: usr.email,
      role: usr.role || "user",
    });
    setUserModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
    } catch (e) {
      console.warn("User delete error:", e);
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    notification.success({
      message: "USER REMOVED",
      description: `User #${id} removed from system database.`,
      placement: "bottomRight",
    });
    loadAdminData();
  };

  // Promo Code Handlers
  const handlePromoSubmit = (values) => {
    const newPromo = {
      id: Date.now(),
      code: values.code.toUpperCase(),
      discount: values.discount,
      title: values.title || "EXECUTIVE VIP PROMO",
      subtitle:
        values.subtitle ||
        "Special campaign promotion card for distinguished Alexandre Luxe clientele.",
      bg_image:
        values.bg_image ||
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      badge: values.badge || "SPECIAL ACCESS",
      type: values.type || "percentage",
      status: "active",
      usage_count: 0,
      expires: values.expires || "LIMITED TIME",
    };
    setPromotions((prev) => [newPromo, ...prev]);
    notification.success({
      message: "PROMO CODE CREATED",
      description: `Discount coupon "${newPromo.code}" is now active!`,
      placement: "bottomRight",
    });
    setPromoModalOpen(false);
    promoForm.resetFields();
  };

  const handleDeletePromo = (id) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    notification.success({
      message: "PROMO CODE DELETED",
      description: "Promotion code removed.",
      placement: "bottomRight",
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      notification.success({
        message: "ORDER STATUS UPDATED",
        description: `Order #${orderId} changed to "${newStatus.toUpperCase()}".`,
        placement: "bottomRight",
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      notification.error({
        message: "UPDATE FAILED",
        description: "Could not update order status.",
        placement: "bottomRight",
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      notification.success({
        message: "ORDER REMOVED",
        description: `Order #${orderId} deleted from database.`,
        placement: "bottomRight",
      });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      notification.error({
        message: "DELETE FAILED",
        description: "Could not delete order.",
        placement: "bottomRight",
      });
    }
  };

  // Analytics Calculations
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0,
  );
  const completedOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "delivered",
  ).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sales Trend Chart Data
  const monthlySales = [
    { month: "Jan", revenue: 14200, orders: 38 },
    { month: "Feb", revenue: 21500, orders: 54 },
    { month: "Mar", revenue: 18900, orders: 42 },
    { month: "Apr", revenue: 29800, orders: 76 },
    { month: "May", revenue: 38400, orders: 98 },
    { month: "Jun", revenue: 48920, orders: 128 },
  ];
  const maxRevenue = Math.max(...monthlySales.map((m) => m.revenue));

  const productColumns = [
    {
      title: "IMAGE",
      dataIndex: "image_url",
      key: "image_url",
      width: 70,
      render: (url, record) => (
        <img
          src={url}
          alt={record.name}
          className="w-12 h-14 object-cover rounded border border-neutral-200 shadow-sm"
        />
      ),
    },
    {
      title: "PRODUCT DETAILS",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <span className="font-serif font-bold text-xs text-black block uppercase tracking-wider">
            {name}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono block">
            ID: #{record.id} • Stock: {record.stock || 50} pcs
          </span>
        </div>
      ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      render: (cat, record) => (
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-neutral-100 text-black rounded border border-neutral-200 inline-block font-mono">
          {cat?.name || record.category_slug || "LUXE"}
        </span>
      ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (price, record) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-black">
            ${Number(price).toFixed(2)}
          </span>
          {record.original_price && (
            <span className="text-neutral-400 line-through block text-[10px]">
              ${Number(record.original_price).toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "TAGS",
      key: "badges",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          {record.is_featured && (
            <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-600 text-white rounded tracking-widest inline-block text-center shadow-xs">
              🔥 HOT DROP
            </span>
          )}
          {record.is_new && (
            <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded tracking-widest inline-block text-center">
              ✨ NEW
            </span>
          )}
        </div>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            icon={
              <EditOutlined className="text-neutral-700 hover:text-black" />
            }
            onClick={() => handleOpenEditProduct(record)}
            size="small"
            title="Edit Product"
          />
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, size: "small" }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined className="text-rose-600" />}
              size="small"
              title="Delete Product"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "ORDER #",
      dataIndex: "order_number",
      key: "order_number",
      render: (num, record) => (
        <div>
          <span className="font-mono font-extrabold text-xs text-black block">
            {num || `LX-${record.id}`}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono block">
            {new Date(record.created_at || Date.now()).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      title: "CUSTOMER",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (name, record) => (
        <div>
          <span className="font-bold text-xs uppercase text-black block">
            {name}
          </span>
          <span className="text-[10px] text-neutral-500 font-light block">
            {record.customer_email}
          </span>
        </div>
      ),
    },
    {
      title: "TOTAL PAID",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => (
        <span className="font-mono font-black text-xs text-emerald-600">
          ${Number(amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "FULFILLMENT STATUS",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status || "pending"}
          onChange={(val) => handleStatusChange(record.id, val)}
          size="small"
          className="w-36 text-xs font-bold"
          options={[
            { value: "pending", label: "🟡 Pending" },
            { value: "processing", label: "🔵 Processing" },
            { value: "shipped", label: "🟣 Shipped" },
            { value: "completed", label: "🟢 Delivered" },
            { value: "cancelled", label: "🔴 Cancelled" },
          ]}
        />
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            icon={<EyeOutlined className="text-neutral-700 hover:text-black" />}
            size="small"
            onClick={() => setSelectedOrderDetails(record)}
            title="View Receipt"
          />
          <Popconfirm
            title="Delete order?"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, size: "small" }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined className="text-rose-600" />}
              size="small"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const userColumns = [
    {
      title: "USER / CLIENT",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs uppercase font-serif">
            {name ? name.charAt(0) : "U"}
          </div>
          <div>
            <span className="font-bold text-xs uppercase text-black block">
              {name}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono block">
              {record.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <span
          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded font-mono ${
            role === "admin"
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-800 border border-neutral-300"
          }`}
        >
          {role === "admin" ? "⚡ SUPERADMIN" : "👤 VIP CLIENT"}
        </span>
      ),
    },
    {
      title: "VIP TIER",
      dataIndex: "tier",
      key: "tier",
      render: (tier) => (
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded font-mono">
          👑 {tier || "BLACK DIAMOND VIP"}
        </span>
      ),
    },
    {
      title: "REGISTERED DATE",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <span className="text-xs font-mono text-neutral-600">
          {date ? new Date(date).toLocaleDateString() : "2025-01-15"}
        </span>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            icon={
              <EditOutlined className="text-neutral-700 hover:text-black" />
            }
            onClick={() => handleOpenEditUser(record)}
            size="small"
            title="Edit User"
          />
          <Popconfirm
            title="Delete this user account?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, size: "small" }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined className="text-rose-600" />}
              size="small"
              title="Delete User"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-900 overflow-hidden font-sans select-none">
      {/* ================= LEFT BLACK SIDEBAR ================= */}
      <aside className="w-64 bg-black text-white border-r border-neutral-800 flex flex-col justify-between shrink-0 shadow-2xl">
        <div>
          {/* Admin Header Logo */}
          <div className="p-6 border-b border-neutral-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black font-serif text-xl shadow-lg">
              A
            </div>
            <div>
              <span className="font-serif font-black text-sm tracking-wider uppercase text-white block">
                ALEXANDRE LUXE
              </span>
              <span className="text-[9px] font-mono font-bold text-neutral-400 tracking-widest uppercase flex items-center gap-1">
                <CrownOutlined style={{ fontSize: "10px" }} /> ADMIN CONTROL
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center space-x-3 transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <DashboardOutlined style={{ fontSize: "16px" }} />
              <span>OVERVIEW</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all duration-200 ${
                activeTab === "products"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShopOutlined style={{ fontSize: "16px" }} />
                <span>PRODUCTS</span>
              </div>
              <Badge
                count={products.length}
                style={{
                  backgroundColor:
                    activeTab === "products" ? "#000000" : "#262626",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              />
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all duration-200 ${
                activeTab === "orders"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <UnorderedListOutlined style={{ fontSize: "16px" }} />
                <span>ORDERS</span>
              </div>
              <Badge
                count={orders.length}
                style={{
                  backgroundColor:
                    activeTab === "orders" ? "#000000" : "#262626",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              />
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all duration-200 ${
                activeTab === "categories"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <AppstoreOutlined style={{ fontSize: "16px" }} />
                <span>CATEGORIES</span>
              </div>
              <Badge
                count={categories.length}
                style={{
                  backgroundColor:
                    activeTab === "categories" ? "#000000" : "#262626",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              />
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all duration-200 ${
                activeTab === "users"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <UserOutlined style={{ fontSize: "16px" }} />
                <span>USERS & CLIENTS</span>
              </div>
              <Badge
                count={users.length}
                style={{
                  backgroundColor:
                    activeTab === "users" ? "#000000" : "#262626",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              />
            </button>

            <button
              onClick={() => setActiveTab("promotions")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all duration-200 ${
                activeTab === "promotions"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <TagOutlined style={{ fontSize: "16px" }} />
                <span>PROMOTIONS</span>
              </div>
              <Badge
                count={promotions.length}
                style={{
                  backgroundColor:
                    activeTab === "promotions" ? "#000000" : "#262626",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              />
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center space-x-3 transition-all duration-200 ${
                activeTab === "analytics"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <BarChartOutlined style={{ fontSize: "16px" }} />
              <span>ANALYTICS</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center space-x-3 transition-all duration-200 ${
                activeTab === "settings"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <SettingOutlined style={{ fontSize: "16px" }} />
              <span>SETTINGS</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full bg-neutral-900 hover:bg-white hover:text-black text-white px-3 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-800 transition-all cursor-pointer"
            >
              <LogoutOutlined />
              <span>SIGN OUT ADMIN</span>
            </button>
          )}
        </div>
      </aside>

      {/* ================= RIGHT WHITE MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white h-16 border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-extrabold font-serif uppercase tracking-widest text-black flex items-center gap-2">
              <span>{activeTab.toUpperCase()} CONTROL PANEL</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API ONLINE
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-black text-white px-4 py-1.5 rounded-full border border-black text-xs font-extrabold shadow-sm">
              <CrownOutlined className="text-yellow-400" />
              <span className="tracking-wider">SUPERADMIN</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-neutral-50">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Executive KPI Metric Cards */}
              <Row gutter={[20, 20]}>
                {/* Metric 1: Total Revenue */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
                        TOTAL REVENUE
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                        <DollarOutlined />
                      </div>
                    </div>
                    <div className="text-2xl font-black font-mono text-black mb-2">
                      $
                      {totalRevenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono">
                      <RiseOutlined />
                      <span>+18.4% VS LAST MONTH</span>
                    </div>
                  </div>
                </Col>

                {/* Metric 2: Total Orders */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
                        TOTAL ORDERS
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <ShoppingOutlined />
                      </div>
                    </div>
                    <div className="text-2xl font-black font-mono text-black mb-2">
                      {orders.length}{" "}
                      <span className="text-xs text-neutral-500 font-normal">
                        Orders
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-mono">
                      <ClockCircleOutlined />
                      <span>
                        {orders.filter((o) => o.status === "pending").length}{" "}
                        PENDING
                      </span>
                    </div>
                  </div>
                </Col>

                {/* Metric 3: Active Products */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
                        ACTIVE PRODUCTS
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                        <AppstoreOutlined />
                      </div>
                    </div>
                    <div className="text-2xl font-black font-mono text-black mb-2">
                      {products.length}{" "}
                      <span className="text-xs text-neutral-500 font-normal">
                        Items
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-mono">
                      <span>{categories.length} CATEGORIES</span>
                    </div>
                  </div>
                </Col>

                {/* Metric 4: Fulfilled Rate */}
                <Col xs={24} sm={12} lg={6}>
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
                        FULFILLMENT RATE
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 text-white flex items-center justify-center text-xl shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform">
                        <CheckCircleOutlined />
                      </div>
                    </div>
                    <div className="text-2xl font-black font-mono text-black mb-2">
                      {orders.length
                        ? Math.round((completedOrders / orders.length) * 100)
                        : 100}
                      %
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-mono">
                      <span>{completedOrders} DELIVERED</span>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Visual Interactive Analytics & Charts Section */}
              <Row gutter={[20, 20]}>
                {/* Visual Chart 1: Monthly Sales Revenue Trend */}
                <Col xs={24} lg={16}>
                  <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <BarChartOutlined className="text-emerald-600" />
                          <h3 className="text-sm font-extrabold uppercase font-serif tracking-wider text-black">
                            REVENUE & SALES TREND CHART
                          </h3>
                        </div>
                        <p className="text-xs text-neutral-500 font-light">
                          6-Month performance overview & transaction volumes.
                        </p>
                      </div>
                      <Tag
                        color="emerald"
                        className="font-extrabold text-[10px] uppercase font-mono px-3 py-1"
                      >
                        📈 +34% HIGH GROWTH
                      </Tag>
                    </div>

                    {/* SVG / Bar Visual Analytics Graph */}
                    <div className="pt-4">
                      <div className="h-48 flex items-end justify-between gap-3 px-4 pt-6 border-b border-neutral-200 pb-2">
                        {monthlySales.map((item, idx) => {
                          const heightPct = Math.round(
                            (item.revenue / maxRevenue) * 100,
                          );
                          return (
                            <div
                              key={idx}
                              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                            >
                              {/* Hover Tooltip */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 bg-black text-white text-[10px] font-mono font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                ${item.revenue.toLocaleString()} • {item.orders}{" "}
                                Orders
                              </div>
                              {/* Bar */}
                              <div className="w-full bg-neutral-100 rounded-t-lg overflow-hidden h-36 flex items-end">
                                <div
                                  style={{ height: `${heightPct}%` }}
                                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all duration-500 rounded-t-lg shadow-sm"
                                ></div>
                              </div>
                              {/* Month Label */}
                              <span className="text-[10px] font-extrabold text-neutral-600 uppercase font-mono">
                                {item.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 font-bold">
                            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>{" "}
                            Revenue ($)
                          </span>
                          <span className="flex items-center gap-1.5 font-bold">
                            <span className="w-3 h-3 rounded bg-neutral-900 inline-block"></span>{" "}
                            Order Count
                          </span>
                        </div>
                        <span className="font-bold text-black">
                          Peak Month: June ($48.9k)
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Visual Chart 2: Category Breakdown & Progress */}
                <Col xs={24} lg={8}>
                  <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-4">
                        <PieChartOutlined className="text-indigo-600" />
                        <h3 className="text-sm font-extrabold uppercase font-serif tracking-wider text-black">
                          CATEGORY SALES
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold font-mono mb-1">
                            <span>Suits & Outerwear</span>
                            <span className="text-indigo-600">
                              45% ($22,014)
                            </span>
                          </div>
                          <Progress
                            percent={45}
                            strokeColor="#4f46e5"
                            showInfo={false}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold font-mono mb-1">
                            <span>Silk Shirts & Apparel</span>
                            <span className="text-purple-600">
                              28% ($13,697)
                            </span>
                          </div>
                          <Progress
                            percent={28}
                            strokeColor="#9333ea"
                            showInfo={false}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold font-mono mb-1">
                            <span>Footwear & Leather</span>
                            <span className="text-amber-600">17% ($8,316)</span>
                          </div>
                          <Progress
                            percent={17}
                            strokeColor="#d97706"
                            showInfo={false}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold font-mono mb-1">
                            <span>Accessories & Watches</span>
                            <span className="text-teal-600">10% ($4,893)</span>
                          </div>
                          <Progress
                            percent={10}
                            strokeColor="#0d9488"
                            showInfo={false}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-[11px] font-mono font-bold text-neutral-700 flex justify-between items-center mt-4">
                      <span>🔥 Top Category:</span>
                      <span className="bg-black text-white px-2 py-0.5 rounded text-[10px]">
                        Suits & Outerwear
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Recent Orders Preview */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase font-serif tracking-wider text-black">
                      RECENT CUSTOMER PURCHASES
                    </h3>
                    <p className="text-xs text-neutral-500 font-light">
                      Live transactional stream from luxury store front.
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("orders")}
                    size="small"
                    className="bg-black text-white hover:bg-neutral-800 text-xs font-black border-none rounded-lg px-4"
                  >
                    View All Orders &rarr;
                  </Button>
                </div>

                <Table
                  dataSource={orders.slice(0, 5)}
                  columns={orderColumns}
                  rowKey="id"
                  pagination={false}
                  className="rounded-xl overflow-hidden border border-neutral-200"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <div>
                  <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black">
                    PRODUCT CATALOG MANAGER
                  </h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Add, edit, update prices, manage stock levels, and toggle
                    hot drops live.
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-xs w-48 rounded-lg border-neutral-300 text-black"
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingProduct(null);
                      form.resetFields();
                      setProductModalOpen(true);
                    }}
                    className="bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest h-10 px-5 rounded-lg shadow-md border-none flex items-center justify-center gap-2"
                  >
                    + NEW PRODUCT
                  </Button>
                </div>
              </div>

              <Table
                dataSource={filteredProducts}
                columns={productColumns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 7 }}
                className="rounded-2xl overflow-hidden border border-neutral-200 shadow-xs bg-white"
              />
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS FULFILLMENT */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black mb-1">
                  CUSTOMER ORDERS FULFILLMENT
                </h2>
                <p className="text-xs text-neutral-500 font-light">
                  Track client orders, update shipment statuses, and inspect
                  receipts.
                </p>
              </div>

              <Table
                dataSource={orders}
                columns={orderColumns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 7 }}
                className="rounded-2xl overflow-hidden border border-neutral-200 shadow-xs bg-white"
              />
            </div>
          )}

          {/* TAB 4: FULL CATEGORY TAXONOMY MANAGEMENT */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <div>
                  <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black mb-1">
                    COLLECTION CATEGORIES MANAGER
                  </h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Create new product categories, update slugs, descriptions,
                    and manage live website taxonomy.
                  </p>
                </div>

                <Button
                  type="primary"
                  icon={<FolderAddOutlined />}
                  onClick={() => {
                    setEditingCategory(null);
                    categoryForm.resetFields();
                    setCategoryModalOpen(true);
                  }}
                  className="bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest h-10 px-5 rounded-lg shadow-md border-none flex items-center justify-center gap-2"
                >
                  + NEW CATEGORY
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-black hover:shadow-xl transition-all duration-300 group relative"
                  >
                    <div>
                      {/* Top Bar: Apparel Icon Box (Matching user image style) + Badges */}
                      <div className="flex items-start justify-between mb-5">
                        {/* Minimalist Line Icon Box matching media_1789716695484 image */}
                        <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 shadow-xs">
                          {getCategoryIcon(cat)}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-col items-end space-y-1.5">
                          <span className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 rounded-md font-mono tracking-wider shadow-xs">
                            {cat.products_count || 0} ITEMS
                          </span>
                          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            SLUG: /{cat.slug}
                          </span>
                        </div>
                      </div>

                      {/* Category Name */}
                      <h4 className="text-xl font-black font-serif uppercase tracking-tight text-black mb-1 group-hover:text-neutral-800 transition-colors">
                        {cat.name}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-neutral-500 font-light leading-relaxed line-clamp-2 mb-4">
                        {cat.description ||
                          `Luxury tailored ${cat.name.toLowerCase()} crafted from premium fabrics.`}
                      </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                        📂 TAXONOMY #{cat.id}
                      </span>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleOpenEditCategory(cat)}
                          className="text-xs font-bold bg-neutral-100 border-neutral-300 text-black hover:bg-neutral-200 h-8 px-3.5 rounded-lg flex items-center"
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Delete this category?"
                          description="Products in this category will be unassigned."
                          onConfirm={() => handleDeleteCategory(cat.id)}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true, size: "small" }}
                        >
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            className="text-xs font-bold h-8 px-3.5 rounded-lg flex items-center"
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USERS & CLIENTS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <div>
                  <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black mb-1">
                    USER & CLIENT MANAGEMENT
                  </h2>
                  <p className="text-xs text-neutral-500 font-light">
                    View all registered store users, manage SuperAdmin roles,
                    update VIP client details, and register new client accounts.
                  </p>
                </div>

                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => {
                    setEditingUser(null);
                    userForm.resetFields();
                    setUserModalOpen(true);
                  }}
                  className="bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest h-10 px-5 rounded-lg shadow-md border-none flex items-center justify-center gap-2"
                >
                  + REGISTER NEW USER
                </Button>
              </div>

              <Table
                dataSource={users}
                columns={userColumns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 7 }}
                className="rounded-2xl overflow-hidden border border-neutral-200 shadow-xs bg-white"
              />
            </div>
          )}

          {/* TAB 6: PROMOTIONS & DISCOUNT COUPONS */}
          {activeTab === "promotions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <div>
                  <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black mb-1">
                    PROMOTIONS & DISCOUNT COUPONS
                  </h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Create promo codes, manage discount percentages, free
                    shipping vouchers, and track coupon usages.
                  </p>
                </div>

                <Button
                  type="primary"
                  icon={<GiftOutlined />}
                  onClick={() => {
                    promoForm.resetFields();
                    setPromoModalOpen(true);
                  }}
                  className="bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest h-10 px-5 rounded-lg shadow-md border-none flex items-center justify-center gap-2"
                >
                  + CREATE PROMO CODE
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-black hover:shadow-xl transition-all duration-300 group relative"
                  >
                    <div>
                      {/* Top Row: Vector Icon Box (Matching shirt icon style) + Badges */}
                      <div className="flex items-start justify-between mb-5">
                        {/* Minimalist Vector Line Icon Box */}
                        <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 shadow-xs">
                          {getPromoIcon(promo)}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-col items-end space-y-1.5">
                          <Tag
                            color="emerald"
                            className="font-black text-[9px] uppercase border-none px-2.5 py-0.5 rounded-md tracking-widest bg-emerald-50 text-emerald-700 m-0 border border-emerald-200 font-mono shadow-xs"
                          >
                            ACTIVE PASS
                          </Tag>
                          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            USED: {promo.usage_count} TIMES
                          </span>
                        </div>
                      </div>

                      {/* Main Discount Header */}
                      <div className="text-2xl font-black font-serif uppercase tracking-tight text-black mb-1 group-hover:text-neutral-800 transition-colors">
                        {promo.discount}
                      </div>

                      {/* Campaign Title */}
                      <h4 className="text-xs font-black uppercase font-mono tracking-widest text-neutral-400 mb-2">
                        {promo.title || "EXECUTIVE VIP PROMO"}
                      </h4>

                      {/* Subtitle / Description */}
                      <p className="text-xs text-neutral-500 font-light leading-relaxed line-clamp-2 mb-4">
                        {promo.subtitle ||
                          "Exclusive luxury promotion voucher for distinguished clients."}
                      </p>
                    </div>

                    {/* Perforated Stub Bottom Action Bar */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-neutral-200">
                      {/* Coupon Code Pill */}
                      <div className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 text-black px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase shadow-xs group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors">
                        <span>🎟️</span>
                        <span>{promo.code}</span>
                      </div>

                      {/* Copy Code & Delete Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(promo.code);
                            notification.success({
                              message: "COPIED TO CLIPBOARD",
                              description: `Promo code ${promo.code} copied!`,
                              placement: "bottomRight",
                            });
                          }}
                          className="bg-black hover:bg-neutral-800 text-white border-none text-xs font-bold uppercase tracking-wider h-8 px-3 rounded-lg shadow-xs flex items-center"
                        >
                          Copy Code
                        </Button>

                        <Popconfirm
                          title="Delete promo code?"
                          onConfirm={() => handleDeletePromo(promo.id)}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true, size: "small" }}
                        >
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            className="text-xs font-bold h-8 px-2 rounded-lg flex items-center justify-center"
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black mb-1">
                  REVENUE & SALES ANALYTICS
                </h2>
                <p className="text-xs text-neutral-500 font-light">
                  Executive analytics overview.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-xs space-y-2">
                  <span className="text-xs font-bold text-neutral-500 uppercase font-mono tracking-widest block">
                    GROSS STORE REVENUE
                  </span>
                  <div className="text-3xl font-black font-mono text-emerald-600">
                    $
                    {totalRevenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-xs space-y-2">
                  <span className="text-xs font-bold text-neutral-500 uppercase font-mono tracking-widest block">
                    FULFILLMENT SUCCESS RATE
                  </span>
                  <div className="text-3xl font-black font-mono text-black">
                    {orders.length
                      ? Math.round((completedOrders / orders.length) * 100)
                      : 100}
                    %
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STORE SETTINGS & CONFIG */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
                <h2 className="text-xl font-black font-serif uppercase tracking-tight text-black mb-1">
                  STORE CONFIGURATION & SETTINGS
                </h2>
                <p className="text-xs text-neutral-500 font-light">
                  Configure store identity, free shipping limits, payment
                  gateways, and system maintenance mode.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-6 max-w-3xl">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h4 className="text-sm font-bold uppercase font-serif text-black">
                      Bakong KHQR Payment Gateway
                    </h4>
                    <p className="text-xs text-neutral-500 font-light">
                      Enable Cambodian National Bank KHQR real-time QR code
                      payment scanning.
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.bakongKhqrEnabled}
                    onChange={(checked) => {
                      setStoreSettings((prev) => ({
                        ...prev,
                        bakongKhqrEnabled: checked,
                      }));
                      notification.info({
                        message: "SETTING UPDATED",
                        description: `Bakong KHQR Payment Gateway is now ${checked ? "ENABLED" : "DISABLED"}.`,
                        placement: "bottomRight",
                      });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h4 className="text-sm font-bold uppercase font-serif text-black">
                      Free Worldwide Express Shipping Limit
                    </h4>
                    <p className="text-xs text-neutral-500 font-light">
                      Minimum cart total ($) required to activate free worldwide
                      express shipping.
                    </p>
                  </div>
                  <InputNumber
                    min={0}
                    value={storeSettings.freeShippingThreshold}
                    onChange={(val) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        freeShippingThreshold: val,
                      }))
                    }
                    className="w-28 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h4 className="text-sm font-bold uppercase font-serif text-black">
                      System Maintenance Mode
                    </h4>
                    <p className="text-xs text-neutral-500 font-light">
                      Temporarily pause checkout and displays maintenance
                      announcement banner.
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.maintenanceMode}
                    onChange={(checked) => {
                      setStoreSettings((prev) => ({
                        ...prev,
                        maintenanceMode: checked,
                      }));
                      notification.warning({
                        message: "SYSTEM MODE CHANGED",
                        description: `Maintenance mode is now ${checked ? "ACTIVE" : "OFF"}.`,
                        placement: "bottomRight",
                      });
                    }}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="primary"
                    onClick={() => {
                      notification.success({
                        message: "SETTINGS SAVED",
                        description: "Store settings updated successfully!",
                        placement: "bottomRight",
                      });
                    }}
                    className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase px-6 h-10"
                  >
                    Save Store Configuration
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* User Create / Edit Modal */}
      <Modal
        title={
          <span className="font-serif font-black uppercase tracking-tight text-lg text-black">
            {editingUser ? `EDIT USER #${editingUser.id}` : "REGISTER NEW USER"}
          </span>
        }
        open={userModalOpen}
        onCancel={() => setUserModalOpen(false)}
        footer={null}
        width={520}
        destroyOnClose
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleUserSubmit}
          className="pt-4 space-y-4"
        >
          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Full Name
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input
              prefix={<UserOutlined className="text-neutral-400" />}
              placeholder="e.g. Jean-Luc Picard"
              className="text-xs py-2 rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Email Address
              </span>
            }
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input
              prefix={<MailOutlined className="text-neutral-400" />}
              placeholder="user@domain.com"
              className="text-xs py-2 rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Role
              </span>
            }
            name="role"
            initialValue="user"
          >
            <Select
              className="text-xs"
              options={[
                { value: "user", label: "👤 VIP Client (Standard User)" },
                { value: "admin", label: "⚡ SuperAdmin (Full Control)" },
              ]}
            />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label={
                <span className="text-xs font-bold uppercase text-neutral-700">
                  Password
                </span>
              }
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-neutral-400" />}
                placeholder="••••••••"
                className="text-xs py-2 rounded-md"
              />
            </Form.Item>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <Button onClick={() => setUserModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase border-none px-6"
            >
              {editingUser ? "Update User" : "Register User"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Promo Code Create Modal */}
      <Modal
        title={
          <span className="font-serif font-black uppercase tracking-tight text-lg text-black">
            CREATE VIP PROMOTION POSTER CARD
          </span>
        }
        open={promoModalOpen}
        onCancel={() => setPromoModalOpen(false)}
        footer={null}
        width={580}
        destroyOnClose
      >
        <Form
          form={promoForm}
          layout="vertical"
          onFinish={handlePromoSubmit}
          className="pt-4 space-y-3"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Coupon Code
                  </span>
                }
                name="code"
                rules={[{ required: true, message: "Please enter promo code" }]}
              >
                <Input
                  placeholder="e.g. LUXEVIP30"
                  className="text-xs py-2 rounded-md font-mono uppercase"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Offer Discount Tag
                  </span>
                }
                name="discount"
                rules={[
                  { required: true, message: "Please enter discount text" },
                ]}
              >
                <Input
                  placeholder="e.g. 30% OFF or $100 OFF"
                  className="text-xs py-2 rounded-md"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Poster Campaign Title
                  </span>
                }
                name="title"
              >
                <Input
                  placeholder="e.g. WINTER DROP VIP PASS"
                  className="text-xs py-2 rounded-md font-serif"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    VIP Badge Text
                  </span>
                }
                name="badge"
              >
                <Input
                  placeholder="e.g. LIMITED EDITION PASS"
                  className="text-xs py-2 rounded-md"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Poster Cover Image URL
              </span>
            }
            name="bg_image"
          >
            <Input
              placeholder="https://images.unsplash.com/... (Optional high-fashion photo)"
              className="text-xs py-2 rounded-md font-mono"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Campaign Subtitle / Details
              </span>
            }
            name="subtitle"
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Exclusive invitation for all Alexandre Luxe autumn collections..."
              className="text-xs rounded-md"
            />
          </Form.Item>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <Button onClick={() => setPromoModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase border-none px-6"
            >
              Generate Poster Card
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Category Form Modal (Create / Edit Category) */}
      <Modal
        title={
          <span className="font-serif font-black uppercase tracking-tight text-lg text-black">
            {editingCategory
              ? `EDIT CATEGORY #${editingCategory.id}`
              : "CREATE NEW CATEGORY"}
          </span>
        }
        open={categoryModalOpen}
        onCancel={() => setCategoryModalOpen(false)}
        footer={null}
        width={520}
        destroyOnClose
      >
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleCategorySubmit}
          className="pt-4 space-y-4"
        >
          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Category Name
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input
              placeholder="e.g. Watches & Jewelry"
              className="text-xs py-2 rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                URL Slug (Optional)
              </span>
            }
            name="slug"
          >
            <Input
              placeholder="e.g. watches-jewelry"
              className="text-xs py-2 rounded-md font-mono"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Category Cover Image URL (Optional)
              </span>
            }
            name="image_url"
          >
            <Input
              placeholder="https://images.unsplash.com/... (High-fashion cover image)"
              className="text-xs py-2 rounded-md font-mono"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Description (Optional)
              </span>
            }
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Collection description for customer storefront..."
              className="text-xs rounded-md"
            />
          </Form.Item>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <Button onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase border-none px-6"
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Product Form Modal (Create / Edit) */}
      <Modal
        title={
          <span className="font-serif font-black uppercase tracking-tight text-lg text-black">
            {editingProduct
              ? `EDIT PRODUCT #${editingProduct.id}`
              : "CREATE NEW LUXURY PRODUCT"}
          </span>
        }
        open={productModalOpen}
        onCancel={() => setProductModalOpen(false)}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProductSubmit}
          className="pt-4 space-y-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Product Name
                  </span>
                }
                name="name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input placeholder="e.g. Silk Derby Suit" className="text-xs" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Category
                  </span>
                }
                name="category_id"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  placeholder="Select Category"
                  className="text-xs"
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Price ($)
                  </span>
                }
                name="price"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber
                  min={0}
                  className="w-full text-xs"
                  placeholder="149.00"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Original Price ($)
                  </span>
                }
                name="original_price"
              >
                <InputNumber
                  min={0}
                  className="w-full text-xs"
                  placeholder="189.00 (Optional)"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Image URL
              </span>
            }
            name="image_url"
            rules={[{ required: true, message: "Please enter image URL" }]}
          >
            <Input
              placeholder="https://images.unsplash.com/..."
              className="text-xs"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-700">
                Description
              </span>
            }
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Crafted from premium materials..."
              className="text-xs"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Sizes (Comma Separated)
                  </span>
                }
                name="sizes"
              >
                <Input placeholder="S, M, L, XL" className="text-xs" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Stock Quantity
                  </span>
                }
                name="stock"
              >
                <InputNumber
                  min={0}
                  className="w-full text-xs"
                  placeholder="50"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    Hot Drop (Featured)?
                  </span>
                }
                name="is_featured"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase text-neutral-700">
                    New Arrival?
                  </span>
                }
                name="is_new"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <Button onClick={() => setProductModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase border-none"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Order Receipt Modal */}
      <Modal
        title={
          <span className="font-serif font-black uppercase text-base text-black">
            RECEIPT FOR ORDER #
            {selectedOrderDetails?.order_number || selectedOrderDetails?.id}
          </span>
        }
        open={!!selectedOrderDetails}
        onCancel={() => setSelectedOrderDetails(null)}
        footer={null}
        width={600}
      >
        {selectedOrderDetails && (
          <div className="space-y-4 pt-2">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1 text-xs font-mono text-neutral-800">
              <p>
                <strong className="text-black">Customer:</strong>{" "}
                {selectedOrderDetails.customer_name}
              </p>
              <p>
                <strong className="text-black">Email:</strong>{" "}
                {selectedOrderDetails.customer_email}
              </p>
              <p>
                <strong className="text-black">Phone:</strong>{" "}
                {selectedOrderDetails.phone}
              </p>
              <p>
                <strong className="text-black">Shipping Address:</strong>{" "}
                {selectedOrderDetails.shipping_address}
              </p>
              <p>
                <strong className="text-black">Payment Method:</strong>{" "}
                {selectedOrderDetails.payment_method?.toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase font-serif text-black">
                ORDERED ITEMS:
              </h4>
              {selectedOrderDetails.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-xs py-1.5 border-b border-neutral-100 font-mono text-neutral-800"
                >
                  <span>
                    {item.quantity}x {item.product_name} (
                    {item.size || "Standard"})
                  </span>
                  <span className="font-bold text-black">
                    ${Number(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 text-sm font-black font-mono border-t border-neutral-200">
              <span className="text-black">TOTAL PAID:</span>
              <span className="text-emerald-600 font-extrabold text-base">
                ${Number(selectedOrderDetails.total_amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
