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

  // Product Modal Submit (Create or Update)
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
      render: (name, record) => (
        <div>
          <span className="font-serif font-bold text-xs text-black block uppercase tracking-wider">
            {name}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono block">
            ID: #{record.id} • Stock: {record.stock || 50}
          </span>
        </div>
      ),
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
        <div className="flex flex-col gap-1">
          {record.is_featured && (
            <Tag color="gold" className="text-[9px] font-bold px-1.5 py-0">
              HOT DROP
            </Tag>
          )}
          {record.is_new && (
            <Tag color="blue" className="text-[9px] font-bold px-1.5 py-0">
              NEW
            </Tag>
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
          <span className="font-serif font-black uppercase tracking-tight text-lg text-black">
            {editingProduct
              ? `EDIT PRODUCT #${editingProduct.id}`
              : "CREATE NEW LUXURY PRODUCT"}
          </span>
        }
        open={productModalOpen}
        onCancel={() => setProductModalOpen(false)}
        footer={null}
        width={700}
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
                  <span className="text-xs font-bold uppercase">
                    Product Name
                  </span>
                }
                name="name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input
                  placeholder="e.g. Tailored Silk Oxford Shirt"
                  className="text-xs"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase">Category</span>
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
                  <span className="text-xs font-bold uppercase">Price ($)</span>
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
                  <span className="text-xs font-bold uppercase">
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
              <span className="text-xs font-bold uppercase">Image URL</span>
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
              <span className="text-xs font-bold uppercase">Description</span>
            }
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Crafted from 100% pure Mulberry silk..."
              className="text-xs"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="text-xs font-bold uppercase">
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
                  <span className="text-xs font-bold uppercase">
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
                  <span className="text-xs font-bold uppercase">
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
                  <span className="text-xs font-bold uppercase">
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
              className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase"
            >
              {editingProduct ? "Update Product" : "Create Product"}
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
    </div>
  );
};

export default DashboardPage;
