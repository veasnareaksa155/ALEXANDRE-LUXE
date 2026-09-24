import React, { useState, useEffect, useRef } from "react";
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
  Card,
  Row,
  Col,
  Statistic,
  Popconfirm,
  notification,
  Badge,
  Tabs,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  SolutionOutlined,
  EyeOutlined,
  UploadOutlined,
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
} from "../services/api";
import {
  uploadToCloudinary,
  parseGalleryUrls,
  getCloudinaryConfig,
  saveCloudinaryConfig,
} from "../services/cloudinary";

const DashboardPage = ({
  products: initialProducts = [],
  categories: initialCategories = [],
  wishlistItems = [],
  onAddToCart,
  onQuickView,
  initialSession = "user",
}) => {
  // Session Mode State: 'user' | 'admin'
  const [activeSession, setActiveSession] = useState(initialSession);

  // Sync initialSession prop when role login changes
  useEffect(() => {
    if (initialSession) {
      setActiveSession(initialSession);
    }
  }, [initialSession]);

  // Admin Data States
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product Modal State (Create / Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // File Input Refs for Media Uploader
  // File Input Refs & Cloudinary Upload Indicators
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const singleCardInputRef = useRef(null);
  const cardIndexToReplaceRef = useRef(0);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingCardIdx, setUploadingCardIdx] = useState(null);
  const [cloudinaryModalOpen, setCloudinaryModalOpen] = useState(false);
  const [cloudinaryConfig, setCloudinaryConfigState] = useState(() =>
    getCloudinaryConfig(),
  );
  useEffect(() => {
    const active = getCloudinaryConfig();
    if (
      active.cloudName !== cloudinaryConfig.cloudName ||
      active.uploadPreset !== cloudinaryConfig.uploadPreset
    ) {
      setCloudinaryConfigState(active);
    }
  }, []);
  const [cloudinaryForm] = Form.useForm();

  // Order Details Modal State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // User Profile Mock State
  const [userProfile] = useState({
    name: "Alexandre De-Luxe",
    email: "vip.alexandre@luxe.com",
    tier: "BLACK DIAMOND VIP",
    memberSince: "2024",
    phone: "+33 1 42 68 55 00",
    address: "75 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
  });

  // Load Admin Data from API
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prodData, catData, ordData] = await Promise.allSettled([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
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
    } catch (err) {
      console.error("Error loading dashboard data:", err);
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

  // Product Modal Submit (Create or Update)  // Product CRUD Handlers
  const handleProductSubmit = async (values) => {
    setLoading(true);
    try {
      const galleryList = parseGalleryUrls(values.gallery);

      const formattedData = {
        ...values,
        stock:
          values.stock !== undefined && values.stock !== null
            ? Number(values.stock)
            : 0,
        sizes: values.sizes
          ? typeof values.sizes === "string"
            ? values.sizes
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : values.sizes
          : ["S", "M", "L", "XL"],
        colors: values.colors
          ? typeof values.colors === "string"
            ? values.colors
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
            : values.colors
          : ["Black", "Grey"],
        gallery: galleryList,
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
          description: `New luxury product "${values.name}" created successfully!`,
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

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);

    const defaultAngleFallbacks = [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    ];

    let galleryList = [];
    if (Array.isArray(prod.gallery) && prod.gallery.length > 0) {
      galleryList = prod.gallery.filter(Boolean);
    } else if (typeof prod.gallery === "string" && prod.gallery.trim()) {
      galleryList = parseGalleryUrls(prod.gallery);
    } else if (Array.isArray(prod.images) && prod.images.length > 0) {
      galleryList = prod.images.filter(Boolean);
    } else {
      galleryList = [];
    }

    form.setFieldsValue({
      name: prod.name,
      category_id: prod.category_id,
      price: prod.price,
      original_price: prod.original_price,
      image_url: prod.image_url,
      description: prod.description,
      stock:
        prod.stock !== undefined && prod.stock !== null
          ? Number(prod.stock)
          : 0,
      is_featured: Boolean(prod.is_featured),
      is_new: Boolean(prod.is_new),
      sizes: Array.isArray(prod.sizes)
        ? prod.sizes.join(", ")
        : prod.sizes || "S, M, L, XL",
      colors: Array.isArray(prod.colors)
        ? prod.colors.join(", ")
        : prod.colors || "Black, Grey",
      gallery: JSON.stringify(galleryList),
    });
    setProductModalOpen(true);
  };

  // Delete Product
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

  // Order Status Change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      notification.success({
        message: "ORDER STATUS UPDATED",
        description: `Order #${orderId} set to "${newStatus.toUpperCase()}".`,
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

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      notification.success({
        message: "ORDER REMOVED",
        description: `Order #${orderId} deleted.`,
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

  // Admin Analytics Calculations
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0,
  );
  const completedOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "delivered",
  ).length;

  // Table Columns for Admin Products Management
  const productColumns = [
    {
      title: "IMAGE",
      dataIndex: "image_url",
      key: "image_url",
      width: 80,
      render: (url, record) => (
        <img
          src={url}
          alt={record.name}
          className="w-12 h-14 object-cover rounded border border-neutral-200"
        />
      ),
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "name",
      key: "name",
      render: (name, record) => {
        const stockNum =
          record.stock !== undefined && record.stock !== null
            ? Number(record.stock)
            : 0;

        let stockBadge = null;
        if (stockNum === 0) {
          stockBadge = (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300 shadow-xs">
              🚨 OUT OF STOCK (0 pcs)
            </span>
          );
        } else if (stockNum <= 5) {
          stockBadge = (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-xs animate-pulse">
              ⚠️ LOW STOCK ({stockNum} pcs)
            </span>
          );
        } else if (stockNum <= 10) {
          stockBadge = (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-yellow-100 text-yellow-900 border border-yellow-300 shadow-xs">
              ⚡ LIMITED ({stockNum} pcs)
            </span>
          );
        } else {
          stockBadge = (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
              ✓ IN STOCK ({stockNum} pcs)
            </span>
          );
        }

        return (
          <div className="py-1 space-y-1">
            <span className="font-sans font-black text-sm text-neutral-900 block uppercase tracking-wide">
              {name}
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs text-neutral-500 font-bold">
                ID: #{record.id}
              </span>
              <span className="text-neutral-300">•</span>
              {stockBadge}
            </div>
          </div>
        );
      },
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      render: (cat, record) => (
        <Tag
          color="black"
          className="text-[10px] uppercase font-bold px-2 py-0.5"
        >
          {cat?.name || record.category_slug || "LUXE"}
        </Tag>
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
      key: "tags",
      render: (_, record) => (
        <div className="flex flex-col gap-1.5 items-start">
          {record.is_new && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              NEW COLLECTION
            </span>
          )}
          {record.is_featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs">
              <span className="text-xs">🔥</span>
              HOT DROP
            </span>
          )}
          {!record.is_new && !record.is_featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider bg-neutral-50 text-neutral-600 border border-neutral-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
              STANDARD
            </span>
          )}
        </div>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            icon={<EditOutlined className="text-neutral-700" />}
            onClick={() => handleOpenEditProduct(record)}
            size="small"
            title="Edit Product"
          />
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, size: "small" }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              title="Delete Product"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Table Columns for Admin Orders Management
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
      title: "CLIENT",
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
      title: "TOTAL",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => (
        <span className="font-mono font-black text-xs text-black">
          ${Number(amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status || "pending"}
          onChange={(val) => handleStatusChange(record.id, val)}
          size="small"
          className="w-32 text-xs font-bold"
          options={[
            { value: "pending", label: "🟡 Pending" },
            { value: "processing", label: "🔵 Processing" },
            { value: "shipped", label: "🟣 Shipped" },
            { value: "completed", label: "🟢 Completed" },
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
            icon={<EyeOutlined />}
            size="small"
            onClick={() => setSelectedOrderDetails(record)}
            title="View Receipt"
          />
          <Popconfirm
            title="Delete this order?"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, size: "small" }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white text-neutral-900 pb-20 min-h-screen">
      {/* Top Session Selector Header */}
      <div className="bg-black text-white py-10 px-4 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1 font-mono">
              ALEXANDRE LUXE PLATFORM DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-white flex items-center gap-3">
              {activeSession === "user" ? (
                <>
                  <UserOutlined />
                  <span>CLIENT VIP PORTAL</span>
                </>
              ) : (
                <>
                  <CrownOutlined className="text-yellow-400" />
                  <span>ADMIN MANAGEMENT PANEL</span>
                </>
              )}
            </h1>
          </div>

          {/* Session Switcher Segmented Buttons */}
          <div className="bg-neutral-900 p-1.5 rounded-full border border-neutral-800 flex items-center space-x-2 shadow-xl">
            <button
              onClick={() => setActiveSession("user")}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeSession === "user"
                  ? "bg-white text-black shadow-lg scale-105"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <UserOutlined />
              <span>👤 USER SESSION</span>
            </button>

            <button
              onClick={() => setActiveSession("admin")}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeSession === "admin"
                  ? "bg-white text-black shadow-lg scale-105"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <CrownOutlined />
              <span>⚡ ADMIN SESSION</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* ================= SESSION 1: USER / CUSTOMER PORTAL ================= */}
        {activeSession === "user" && (
          <div className="space-y-10">
            {/* User Profile Card */}
            <div className="bg-neutral-50 rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                  A
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-xl font-bold font-serif uppercase tracking-tight text-black">
                      {userProfile.name}
                    </h2>
                    <Tag
                      color="black"
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5"
                    >
                      <CrownOutlined className="text-yellow-400 mr-1" />
                      {userProfile.tier}
                    </Tag>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono">
                    {userProfile.email} • Member Since {userProfile.memberSince}
                  </p>
                  <p className="text-xs text-neutral-600 font-light mt-1">
                    📍 {userProfile.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="bg-white p-4 rounded-xl border border-neutral-200 text-center flex-1 md:flex-initial">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                    WISHLIST ITEMS
                  </span>
                  <span className="text-lg font-black font-mono text-black">
                    {wishlistItems.length} SAVED
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-neutral-200 text-center flex-1 md:flex-initial">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                    VIP TIER STATUS
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-600">
                    DIAMOND
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Orders History Table */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                    PERSONAL PURCHASES
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-serif uppercase tracking-tight text-black">
                    MY ORDER HISTORY & TRACKING
                  </h3>
                </div>
                <Tag
                  color="black"
                  className="text-xs uppercase font-bold px-3 py-1"
                >
                  {orders.length} TOTAL ORDERS
                </Tag>
              </div>

              {orders.length === 0 ? (
                <div className="bg-neutral-50 py-12 text-center rounded-xl border border-dashed border-neutral-300">
                  <ShoppingOutlined className="text-3xl text-neutral-400 mb-2" />
                  <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                    No order history recorded yet. Explore our latest
                    collections!
                  </p>
                </div>
              ) : (
                <Table
                  dataSource={orders}
                  columns={orderColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-xs"
                />
              )}
            </div>

            {/* Saved Wishlist Grid */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                    SAVED FAVORITES
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-serif uppercase tracking-tight text-black flex items-center gap-2">
                    <HeartOutlined className="text-red-500" />
                    <span>MY WISHLIST ({wishlistItems.length})</span>
                  </h3>
                </div>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="bg-neutral-50 py-12 text-center rounded-xl border border-dashed border-neutral-300">
                  <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                    Your wishlist is empty. Tap the heart icon on any product to
                    save it here!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wishlistItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white p-3 rounded-lg border border-neutral-200 flex flex-col justify-between"
                    >
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-40 object-cover rounded mb-2 cursor-pointer"
                        onClick={() => onQuickView(prod)}
                      />
                      <h4 className="text-xs font-bold text-black line-clamp-1 mb-1 font-serif uppercase">
                        {prod.name}
                      </h4>
                      <span className="font-mono text-xs font-black text-black block mb-2">
                        ${Number(prod.price).toFixed(2)}
                      </span>
                      <Button
                        type="primary"
                        onClick={() => onAddToCart(prod)}
                        size="small"
                        className="w-full bg-black text-white hover:bg-neutral-800 text-[10px] font-extrabold uppercase tracking-wider"
                      >
                        + ADD TO BAG
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SESSION 2: ADMIN MANAGEMENT DASHBOARD ================= */}
        {activeSession === "admin" && (
          <div className="space-y-10">
            {/* KPI Executive Analytics Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Card className="border-neutral-200 shadow-xs rounded-xl bg-neutral-900 text-white">
                  <Statistic
                    title={
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                        TOTAL SALES REVENUE
                      </span>
                    }
                    value={totalRevenue}
                    precision={2}
                    prefix={
                      <DollarOutlined className="text-emerald-400 mr-1" />
                    }
                    valueStyle={{
                      color: "#ffffff",
                      fontWeight: "900",
                      fontFamily: "monospace",
                    }}
                  />
                </Card>
              </Col>

              <Col xs={12} sm={6}>
                <Card className="border-neutral-200 shadow-xs rounded-xl bg-white">
                  <Statistic
                    title={
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                        TOTAL CUSTOMER ORDERS
                      </span>
                    }
                    value={orders.length}
                    prefix={<ShoppingOutlined className="text-black mr-1" />}
                    valueStyle={{
                      color: "#000000",
                      fontWeight: "900",
                      fontFamily: "monospace",
                    }}
                  />
                </Card>
              </Col>

              <Col xs={12} sm={6}>
                <Card className="border-neutral-200 shadow-xs rounded-xl bg-white">
                  <Statistic
                    title={
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                        ACTIVE PRODUCTS
                      </span>
                    }
                    value={products.length}
                    prefix={<AppstoreOutlined className="text-black mr-1" />}
                    valueStyle={{
                      color: "#000000",
                      fontWeight: "900",
                      fontFamily: "monospace",
                    }}
                  />
                </Card>
              </Col>

              <Col xs={12} sm={6}>
                <Card className="border-neutral-200 shadow-xs rounded-xl bg-white">
                  <Statistic
                    title={
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                        FULFILLED ORDERS
                      </span>
                    }
                    value={completedOrders}
                    prefix={
                      <CheckCircleOutlined className="text-emerald-600 mr-1" />
                    }
                    valueStyle={{
                      color: "#16a34a",
                      fontWeight: "900",
                      fontFamily: "monospace",
                    }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Admin Management Tabs (Products, Orders, Categories) */}
            <Tabs
              defaultActiveKey="1"
              type="card"
              size="large"
              items={[
                {
                  key: "1",
                  label: (
                    <span className="font-extrabold uppercase text-xs tracking-wider">
                      📦 PRODUCT CATALOG MANAGEMENT ({products.length})
                    </span>
                  ),
                  children: (
                    <div className="pt-4">
                      {/* Action Bar */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-lg font-bold font-serif uppercase tracking-tight text-black">
                            PRODUCT MANAGEMENT TABLE
                          </h3>
                          <p className="text-xs text-neutral-500 font-light">
                            Create, update, or delete products live in the
                            Laravel backend database.
                          </p>
                        </div>

                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            setEditingProduct(null);
                            form.resetFields();
                            setProductModalOpen(true);
                          }}
                          className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-widest h-10 px-6 rounded-md shadow-md"
                        >
                          ADD NEW LUXURY PRODUCT
                        </Button>
                      </div>

                      {/* Products Table */}
                      <Table
                        dataSource={products}
                        columns={productColumns}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 6 }}
                        className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-xs"
                      />
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <span className="font-extrabold uppercase text-xs tracking-wider">
                      🛍️ CUSTOMER ORDERS FULFILMENT ({orders.length})
                    </span>
                  ),
                  children: (
                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-bold font-serif uppercase tracking-tight text-black">
                            CUSTOMER ORDERS & SHIPMENTS
                          </h3>
                          <p className="text-xs text-neutral-500 font-light">
                            Manage order statuses (Pending, Processing, Shipped,
                            Delivered) in real-time.
                          </p>
                        </div>
                      </div>

                      <Table
                        dataSource={orders}
                        columns={orderColumns}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 6 }}
                        className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-xs"
                      />
                    </div>
                  ),
                },
                {
                  key: "3",
                  label: (
                    <span className="font-extrabold uppercase text-xs tracking-wider">
                      🏷️ CATEGORY BREAKDOWN ({categories.length})
                    </span>
                  ),
                  children: (
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono block">
                              CATEGORY SLUG: {cat.slug}
                            </span>
                            <h4 className="text-lg font-extrabold font-serif uppercase text-black">
                              {cat.name}
                            </h4>
                          </div>
                          <Tag
                            color="black"
                            className="text-xs font-bold uppercase px-3 py-1"
                          >
                            {cat.products_count || 4} ITEMS
                          </Tag>
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* Product Form Modal (Create / Edit) */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-md">
              {editingProduct ? (
                <EditOutlined className="text-lg" />
              ) : (
                <PlusOutlined className="text-lg" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {editingProduct
                    ? `EDITING CATALOG ITEM #${editingProduct.id}`
                    : "NEW CATALOG ADDITION"}
                </span>
              </div>
              <h3 className="text-lg font-black font-serif uppercase tracking-tight text-neutral-900 m-0 leading-tight">
                {editingProduct
                  ? `EDIT: ${editingProduct.name}`
                  : "CREATE LUXURY ITEM"}
              </h3>
            </div>
          </div>
        }
        open={productModalOpen}
        onCancel={() => setProductModalOpen(false)}
        footer={null}
        width={960}
        centered
        destroyOnClose
        className="luxury-edit-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProductSubmit}
          className="pt-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* LEFT CARD: Media & Multi-Image Gallery */}
            <div className="md:col-span-5 bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200/80 space-y-3.5">
              <h4 className="text-xs font-mono font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1.5 m-0 pb-2 border-b border-neutral-200/60">
                <EyeOutlined className="text-neutral-700" />
                <span>1. MEDIA & MULTI-IMAGE GALLERY</span>
              </h4>

              {/* Form items for hidden/synced image_url & gallery values */}
              <Form.Item name="image_url" hidden>
                <Input />
              </Form.Item>

              <Form.Item name="gallery" hidden>
                <Input />
              </Form.Item>

              {/* Multi-Image Interactive Visual Gallery Component */}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.gallery !== currentValues.gallery ||
                  prevValues.image_url !== currentValues.image_url
                }
              >
                {({ getFieldValue, setFieldsValue }) => {
                  const mainCoverUrl = getFieldValue("image_url") || "";
                  const galleryRaw = getFieldValue("gallery") || "";
                  const galleryUrls = parseGalleryUrls(galleryRaw);

                  const updateGalleryInForm = (newUrls) => {
                    const cleaned = Array.from(
                      new Set(newUrls.filter(Boolean)),
                    );
                    setFieldsValue({ gallery: JSON.stringify(cleaned) });
                  };

                  // File upload handler for Main Cover Image via Cloudinary
                  const handleCoverFileUpload = async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;

                    setUploadingCover(true);
                    try {
                      const result = await uploadToCloudinary(
                        file,
                        cloudinaryConfig,
                      );
                      if (result.success && result.url) {
                        setFieldsValue({ image_url: result.url });
                        notification.success({
                          message: result.isCloudinary
                            ? "CLOUDINARY UPLOAD SUCCESS"
                            : "COVER PHOTO UPDATED",
                          description: result.isCloudinary
                            ? "Cover photo stored on Cloudinary CDN!"
                            : "Cover photo preview ready.",
                          placement: "bottomRight",
                        });
                      }
                    } catch (err) {
                      console.error("Cover upload error:", err);
                    } finally {
                      setUploadingCover(false);
                      e.target.value = "";
                    }
                  };

                  // File upload handler for adding new Gallery Images via Cloudinary
                  const handleGalleryFilesUpload = async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;

                    setUploadingGallery(true);
                    try {
                      const newUploadedUrls = [];
                      for (const file of files) {
                        const result = await uploadToCloudinary(
                          file,
                          cloudinaryConfig,
                        );
                        if (result.success && result.url) {
                          newUploadedUrls.push(result.url);
                        }
                      }
                      if (newUploadedUrls.length > 0) {
                        updateGalleryInForm([
                          ...galleryUrls,
                          ...newUploadedUrls,
                        ]);
                        notification.success({
                          message: "GALLERY STORED ON CLOUDINARY",
                          description: `${newUploadedUrls.length} image(s) uploaded to Cloudinary!`,
                          placement: "bottomRight",
                        });
                      }
                    } catch (err) {
                      console.error("Gallery upload error:", err);
                    } finally {
                      setUploadingGallery(false);
                      e.target.value = "";
                    }
                  };

                  // File upload handler for replacing a single card's image via Cloudinary
                  const handleSingleCardFileUpload = async (
                    e,
                    indexToReplace,
                  ) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;

                    setUploadingCardIdx(indexToReplace);
                    try {
                      const result = await uploadToCloudinary(
                        file,
                        cloudinaryConfig,
                      );
                      if (result.success && result.url) {
                        const updated = [...galleryUrls];
                        updated[indexToReplace] = result.url;
                        updateGalleryInForm(updated);
                        notification.success({
                          message: "CLOUDINARY IMAGE REPLACED",
                          description: `Card #${indexToReplace + 1} updated on Cloudinary CDN!`,
                          placement: "bottomRight",
                        });
                      }
                    } catch (err) {
                      console.error("Single card replace upload error:", err);
                    } finally {
                      setUploadingCardIdx(null);
                      e.target.value = "";
                    }
                  };

                  const setAsMainCover = (urlToSet) => {
                    const currentMain = getFieldValue("image_url");
                    let updatedGallery = galleryUrls.filter(
                      (u) => u !== urlToSet,
                    );
                    if (
                      currentMain &&
                      currentMain !== urlToSet &&
                      !updatedGallery.includes(currentMain)
                    ) {
                      updatedGallery.unshift(currentMain);
                    }
                    setFieldsValue({
                      image_url: urlToSet,
                      gallery: JSON.stringify(updatedGallery),
                    });
                  };

                  const removeGalleryImage = (indexToRemove) => {
                    const updated = galleryUrls.filter(
                      (_, idx) => idx !== indexToRemove,
                    );
                    updateGalleryInForm(updated);
                  };

                  const autoFillMultiAngles = () => {
                    const presets = [
                      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
                    ];
                    updateGalleryInForm(presets);
                  };

                  return (
                    <div className="space-y-3.5">
                      {/* Main Cover Image Hero Card */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-800">
                            Primary Cover Photo
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Click image to upload (Cloudinary CDN)
                          </span>
                        </div>

                        <div
                          onClick={() =>
                            coverInputRef.current &&
                            coverInputRef.current.click()
                          }
                          className="relative w-full h-36 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md group cursor-pointer flex items-center justify-center"
                          title="Click to upload new cover image file to Cloudinary"
                        >
                          {uploadingCover ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 gap-1 bg-black/80 z-30">
                              <span className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                              <span className="text-xs font-mono font-bold">
                                Uploading to Cloudinary... ☁️
                              </span>
                            </div>
                          ) : mainCoverUrl ? (
                            <img
                              src={mainCoverUrl}
                              alt="Main Cover"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-1">
                              <UploadOutlined className="text-2xl" />
                              <span className="text-xs font-bold">
                                Upload Cover Photo
                              </span>
                            </div>
                          )}

                          {/* Cover Badge */}
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-amber-400 text-black text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded shadow">
                              MAIN COVER
                            </span>
                          </div>

                          {/* Hover Overlay with Upload Icon */}
                          {!uploadingCover && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 z-20">
                              <UploadOutlined className="text-2xl text-amber-400" />
                              <span className="text-xs font-black uppercase tracking-wider">
                                Upload to Cloudinary ☁️
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Hidden cover file input */}
                        <input
                          type="file"
                          ref={coverInputRef}
                          accept="image/*"
                          onChange={handleCoverFileUpload}
                          style={{ display: "none" }}
                        />
                      </div>

                      {/* Gallery Multi-Angle Images Header */}
                      <div className="space-y-2 pt-1 border-t border-neutral-200/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black uppercase text-neutral-800 tracking-wider">
                              Gallery Angle Images
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                              {galleryUrls.length}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              type="text"
                              size="small"
                              onClick={autoFillMultiAngles}
                              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 rounded px-2 py-0.5"
                            >
                              ✨ Presets
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              loading={uploadingGallery}
                              onClick={() =>
                                galleryInputRef.current &&
                                galleryInputRef.current.click()
                              }
                              icon={<UploadOutlined />}
                              className="text-[10px] bg-black hover:bg-neutral-800 font-bold rounded px-2.5"
                            >
                              ☁️ Upload Cloudinary
                            </Button>
                          </div>
                        </div>

                        {/* Hidden gallery file input */}
                        <input
                          type="file"
                          ref={galleryInputRef}
                          accept="image/*"
                          multiple
                          onChange={handleGalleryFilesUpload}
                          style={{ display: "none" }}
                        />

                        {/* Visual Image Thumbnail Grid */}
                        <div className="grid grid-cols-3 gap-2.5 max-h-[210px] overflow-y-auto pr-1 scrollbar-thin">
                          {galleryUrls.map((url, idx) => {
                            const isReplacingThis = uploadingCardIdx === idx;
                            return (
                              <div
                                key={idx}
                                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-2xs group hover:shadow-md transition-all"
                              >
                                {isReplacingThis ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 gap-1 bg-black/80 p-1 text-center">
                                    <span className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                                    <span className="text-[8px] font-mono font-bold">
                                      Cloudinary... ☁️
                                    </span>
                                  </div>
                                ) : (
                                  <img
                                    src={url}
                                    alt={`Gallery ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80";
                                    }}
                                  />
                                )}

                                {/* Index Badge */}
                                <span className="absolute top-1 left-1 bg-black/80 text-[8px] font-mono font-bold text-white px-1.5 py-0.5 rounded z-30">
                                  #{idx + 1}
                                </span>

                                {/* Top Right Action Icons (z-30 to stay above hover overlay) */}
                                <div className="absolute top-1 right-1 flex items-center gap-1 z-30">
                                  <Tooltip title="Set as Main Cover Photo">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAsMainCover(url);
                                      }}
                                      className="w-5 h-5 rounded bg-black/80 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center text-[10px] transition-colors cursor-pointer shadow-md"
                                    >
                                      ★
                                    </button>
                                  </Tooltip>

                                  <Tooltip title="Remove Image">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeGalleryImage(idx);
                                      }}
                                      className="w-5 h-5 rounded bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer shadow-md"
                                    >
                                      <DeleteOutlined />
                                    </button>
                                  </Tooltip>
                                </div>

                                {/* Hover Overlay to Replace Single Card Photo */}
                                {!isReplacingThis && (
                                  <div
                                    onClick={() => {
                                      cardIndexToReplaceRef.current = idx;
                                      if (singleCardInputRef.current)
                                        singleCardInputRef.current.click();
                                    }}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white cursor-pointer z-20"
                                    title="Click to replace this photo file on Cloudinary"
                                  >
                                    <UploadOutlined className="text-base text-amber-400 mb-0.5" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">
                                      Replace ☁️
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Add Photo Dashed Dropzone Card */}
                          <div
                            onClick={() =>
                              galleryInputRef.current &&
                              galleryInputRef.current.click()
                            }
                            className="aspect-[3/4] rounded-xl border-2 border-dashed border-neutral-300 hover:border-black bg-white hover:bg-neutral-100/70 flex flex-col items-center justify-center cursor-pointer transition-all p-2 text-center group"
                            title="Click to upload photo files to Cloudinary"
                          >
                            <UploadOutlined className="text-xl text-neutral-500 group-hover:text-black group-hover:scale-110 transition-transform mb-1" />
                            <span className="text-[10px] font-extrabold text-neutral-700 group-hover:text-black uppercase tracking-wider">
                              + Add Photo
                            </span>
                          </div>
                        </div>

                        {/* Hidden single card replace input */}
                        <input
                          type="file"
                          ref={singleCardInputRef}
                          accept="image/*"
                          onChange={(e) =>
                            handleSingleCardFileUpload(
                              e,
                              cardIndexToReplaceRef.current,
                            )
                          }
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  );
                }}
              </Form.Item>
            </div>

            {/* RIGHT CARD: Product General Information & Specifications */}
            <div className="md:col-span-7 bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200/80 space-y-3.5">
              <h4 className="text-xs font-mono font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1.5 m-0 pb-2 border-b border-neutral-200/60">
                <AppstoreOutlined className="text-neutral-700" />
                <span>2. PRODUCT DETAILS & SPECIFICATIONS</span>
              </h4>

              <Row gutter={12}>
                <Col span={14}>
                  <Form.Item
                    label={
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                        Product Name
                      </span>
                    }
                    name="name"
                    rules={[
                      { required: true, message: "Please enter product name" },
                    ]}
                    className="mb-2.5"
                  >
                    <Input
                      placeholder="e.g. Minimalist Charcoal Linen Shirt"
                      className="text-xs py-1.5 rounded-lg font-sans font-semibold"
                    />
                  </Form.Item>
                </Col>

                <Col span={10}>
                  <Form.Item
                    label={
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                        Category
                      </span>
                    }
                    name="category_id"
                    rules={[
                      { required: true, message: "Please select category" },
                    ]}
                    className="mb-2.5"
                  >
                    <Select
                      placeholder="Select Category"
                      className="text-xs rounded-lg"
                      options={categories.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                        Price ($)
                      </span>
                    }
                    name="price"
                    rules={[{ required: true, message: "Please enter price" }]}
                    className="mb-2.5"
                  >
                    <InputNumber
                      min={0}
                      precision={2}
                      prefix="$"
                      className="w-full text-xs py-0.5 rounded-lg font-mono font-bold"
                      placeholder="119.00"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label={
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                        Original Price ($)
                      </span>
                    }
                    name="original_price"
                    className="mb-2.5"
                  >
                    <InputNumber
                      min={0}
                      precision={2}
                      prefix="$"
                      className="w-full text-xs py-0.5 rounded-lg font-mono"
                      placeholder="149.00"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label={
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                        Stock Quantity
                      </span>
                    }
                    name="stock"
                    className="mb-2.5"
                  >
                    <InputNumber
                      min={0}
                      className="w-full text-xs py-0.5 rounded-lg font-mono font-black"
                      placeholder="30"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                        Sizes (Comma Separated)
                      </span>
                    }
                    name="sizes"
                    className="mb-2.5"
                  >
                    <Input
                      placeholder="e.g. S, M, L, XL"
                      className="text-xs py-1.5 rounded-lg font-mono"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                        Colors (Comma Separated)
                      </span>
                    }
                    name="colors"
                    className="mb-2.5"
                  >
                    <Input
                      placeholder="e.g. Charcoal, Off-White"
                      className="text-xs py-1.5 rounded-lg font-mono"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                    Item Description
                  </span>
                }
                name="description"
                className="mb-3"
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Crafted from premium luxury materials..."
                  className="text-xs rounded-lg font-sans leading-relaxed"
                />
              </Form.Item>

              {/* Switches Row */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider block text-amber-900 flex items-center gap-1">
                      <span>🔥</span> HOT DROP
                    </span>
                    <span className="text-[9px] text-amber-700/80 block font-light">
                      Highlight in featured drops
                    </span>
                  </div>
                  <Form.Item name="is_featured" valuePropName="checked" noStyle>
                    <Switch size="small" />
                  </Form.Item>
                </div>

                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider block text-emerald-900 flex items-center gap-1">
                      <span>✨</span> NEW ARRIVAL
                    </span>
                    <span className="text-[9px] text-emerald-700/80 block font-light">
                      Mark as new release tag
                    </span>
                  </div>
                  <Form.Item name="is_new" valuePropName="checked" noStyle>
                    <Switch size="small" />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-neutral-200">
            <Button
              onClick={() => setProductModalOpen(false)}
              className="h-9 px-5 rounded-xl font-bold text-xs uppercase text-neutral-600 hover:text-black border-neutral-300"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<CheckCircleOutlined />}
              className="h-9 px-7 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider border-none shadow-md"
            >
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Order Details Receipt Modal */}
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
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-1 text-xs font-mono">
              <p>
                <strong>Customer:</strong> {selectedOrderDetails.customer_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrderDetails.customer_email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrderDetails.phone}
              </p>
              <p>
                <strong>Shipping Address:</strong>{" "}
                {selectedOrderDetails.shipping_address}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
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
                  className="flex justify-between items-center text-xs py-1 border-b border-neutral-100 font-mono"
                >
                  <span>
                    {item.quantity}x {item.product_name} (
                    {item.size || "Standard"})
                  </span>
                  <span className="font-bold">
                    ${Number(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 text-sm font-black font-mono border-t border-black">
              <span>TOTAL PAID:</span>
              <span>
                ${Number(selectedOrderDetails.total_amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Cloudinary Storage Settings Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <span className="text-xl">☁️</span>
            <div>
              <span className="font-serif font-black uppercase text-base text-black block">
                CLOUDINARY CDN STORAGE CONFIG
              </span>
              <span className="text-[10px] font-mono text-neutral-400 font-normal">
                Direct Unsigned Upload API Settings
              </span>
            </div>
          </div>
        }
        open={cloudinaryModalOpen}
        onCancel={() => setCloudinaryModalOpen(false)}
        footer={null}
        width={480}
        centered
        destroyOnClose
      >
        <Form
          form={cloudinaryForm}
          layout="vertical"
          initialValues={cloudinaryConfig}
          onFinish={(values) => {
            const saved = saveCloudinaryConfig(
              values.cloudName,
              values.uploadPreset,
            );
            if (saved) {
              setCloudinaryConfigState(saved);
              notification.success({
                message: "CLOUDINARY CONFIG SAVED",
                description: `Connected to Cloudinary account (${saved.cloudName})!`,
                placement: "bottomRight",
              });
            }
            setCloudinaryModalOpen(false);
          }}
          className="pt-2 space-y-3.5"
        >
          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-800">
                Cloudinary Cloud Name
              </span>
            }
            name="cloudName"
            rules={[
              { required: true, message: "Please enter Cloudinary cloud name" },
            ]}
          >
            <Input
              placeholder="e.g. dqls5p3qw"
              className="text-xs py-2 rounded-lg font-mono font-bold"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase text-neutral-800">
                Unsigned Upload Preset
              </span>
            }
            name="uploadPreset"
            rules={[
              {
                required: true,
                message: "Please enter Cloudinary upload preset",
              },
            ]}
          >
            <Input
              placeholder="e.g. alexandre_luxe or ml_default"
              className="text-xs py-2 rounded-lg font-mono font-bold"
            />
          </Form.Item>

          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed">
            <div className="font-bold flex items-center gap-1">
              <span>💡 Quick Cloudinary Setup Guide:</span>
            </div>
            <p className="m-0 text-[11px] text-amber-900">
              1. Log into your free account at{" "}
              <a
                href="https://cloudinary.com"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-black underline"
              >
                Cloudinary.com
              </a>
              .<br />
              2. Go to <strong>Settings</strong> → <strong>Upload</strong> tab →
              Scroll down to <strong>Upload Presets</strong>.<br />
              3. Click <strong>Add Upload Preset</strong> and set Mode to{" "}
              <strong className="text-amber-950">Unsigned</strong>.<br />
              4. Copy your <strong>Cloud Name</strong> and{" "}
              <strong>Upload Preset Name</strong> into the fields above!
            </p>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200">
            <Button
              onClick={() => setCloudinaryModalOpen(false)}
              className="text-xs font-bold uppercase"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase px-5 rounded-lg border-none"
            >
              Save Credentials
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
