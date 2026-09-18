import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Form, Input, notification } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  CrownOutlined,
  HeartOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CarOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  EditOutlined,
  LogoutOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { fetchOrders } from "../services/api";

const UserAccountPage = ({
  user: currentUser,
  onUpdateProfile,
  onLogout,
  wishlistItems = [],
  onAddToCart,
  onQuickView,
  onNavigateShop,
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Active User Profile object with fallbacks
  const profile = currentUser || {
    name: "Alexandre De-Luxe",
    email: "vip.alexandre@luxe.com",
    tier: "BLACK DIAMOND VIP",
    memberSince: "2024",
    phone: "+33 1 42 68 55 00",
    address: "75 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
  };

  if (currentUser?.role === "admin") {
    return (
      <div className="min-h-[70vh] bg-neutral-950 text-white flex flex-col items-center justify-center p-8 text-center">
        <CrownOutlined className="text-5xl text-yellow-400 mb-4" />
        <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-white mb-2">
          SUPERADMIN CONTROL SESSION ACTIVE
        </h2>
        <p className="text-xs text-neutral-400 max-w-md mb-6 font-light leading-relaxed">
          You are currently logged in with SuperAdmin privileges. Admin accounts do not have customer VIP purchase profiles or personal order tracking.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {onNavigateShop && (
            <Button
              onClick={onNavigateShop}
              className="bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700 text-xs font-bold uppercase tracking-wider h-10 px-6"
            >
              BROWSE STORE CATALOG
            </Button>
          )}
          {onLogout && (
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={onLogout}
              className="text-xs font-bold uppercase tracking-wider h-10 px-6"
            >
              SIGN OUT ADMIN
            </Button>
          )}
        </div>
      </div>
    );
  }

  const loadCustomerOrders = async () => {
    setLoading(true);
    try {
      const ordData = await fetchOrders();
      if (ordData) {
        setOrders(ordData);
      }
    } catch (err) {
      console.error("Error loading customer orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCustomerOrders();
  }, []);

  const handleOpenEditModal = () => {
    form.setFieldsValue({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || "+33 1 42 68 55 00",
      address:
        profile.address ||
        "75 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
    });
    setEditModalOpen(true);
  };

  const handleSaveProfile = (values) => {
    const updated = {
      ...profile,
      ...values,
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    notification.success({
      message: "VIP PROFILE UPDATED",
      description:
        "Your personal account details have been updated successfully.",
      placement: "bottomRight",
      duration: 2.5,
    });

    setEditModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return (
          <Tag color="emerald" className="font-bold text-[10px] uppercase">
            <CheckCircleOutlined className="mr-1" /> DELIVERED
          </Tag>
        );
      case "shipped":
        return (
          <Tag color="purple" className="font-bold text-[10px] uppercase">
            <CarOutlined className="mr-1" /> SHIPPED
          </Tag>
        );
      case "processing":
        return (
          <Tag color="processing" className="font-bold text-[10px] uppercase">
            <SyncOutlined spin className="mr-1" /> IN PREPARATION
          </Tag>
        );
      default:
        return (
          <Tag color="gold" className="font-bold text-[10px] uppercase">
            <ClockCircleOutlined className="mr-1" /> PENDING
          </Tag>
        );
    }
  };

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
      title: "ITEMS",
      key: "items",
      render: (_, record) => (
        <span className="text-xs font-medium text-neutral-700">
          {record.items ? `${record.items.length} Luxury Items` : "1 Item"}
        </span>
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
      title: "DELIVERY STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: "RECEIPT",
      key: "receipt",
      width: 90,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => setSelectedOrderDetails(record)}
          className="text-xs font-semibold text-neutral-600 hover:text-black"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white text-neutral-900 pb-20 min-h-screen">
      {/* Header Banner */}
      <div className="bg-black text-white py-12 px-4 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1 font-mono">
              ALEXANDRE LUXE CLIENT PORTAL
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-serif uppercase tracking-tight text-white flex items-center gap-3">
              <UserOutlined />
              <span>MY VIP ACCOUNT</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Tag
              color="gold"
              className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-yellow-500/30"
            >
              <CrownOutlined className="mr-1.5" />
              {profile.tier || "BLACK DIAMOND VIP"}
            </Tag>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* User Profile Card */}
        <div className="bg-neutral-50 rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shrink-0">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1 flex-wrap gap-2">
                <h2 className="text-xl font-bold font-serif uppercase tracking-tight text-black">
                  {profile.name}
                </h2>
                <Button
                  onClick={handleOpenEditModal}
                  size="small"
                  icon={<EditOutlined />}
                  className="text-[10px] font-bold uppercase tracking-wider bg-white border-neutral-300 text-black hover:bg-neutral-100"
                >
                  EDIT PROFILE
                </Button>
                {onLogout && (
                  <Button
                    onClick={onLogout}
                    size="small"
                    danger
                    icon={<LogoutOutlined />}
                    className="text-[10px] font-bold uppercase tracking-wider border-red-200 bg-red-50 hover:bg-red-100 text-red-600"
                  >
                    SIGN OUT
                  </Button>
                )}
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                📧 {profile.email} • 📞 {profile.phone || "+33 1 42 68 55 00"}
              </p>
              <p className="text-xs text-neutral-600 font-light mt-1">
                📍{" "}
                {profile.address ||
                  "75 Rue du Faubourg Saint-Honoré, 75008 Paris, France"}
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
                VIP MEMBERSHIP
              </span>
              <span className="text-lg font-black font-mono text-emerald-600">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                PERSONAL PURCHASES
              </span>
              <h3 className="text-xl font-bold font-serif uppercase tracking-tight text-black">
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
            <div className="bg-neutral-50 py-16 text-center rounded-xl border border-dashed border-neutral-300 space-y-3">
              <ShoppingOutlined className="text-4xl text-neutral-400" />
              <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                No orders placed yet. Explore our haute couture collections!
              </p>
              {onNavigateShop && (
                <Button
                  onClick={onNavigateShop}
                  type="primary"
                  className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase px-6"
                >
                  EXPLORE SHOP & COLLECTIONS
                </Button>
              )}
            </div>
          ) : (
            <Table
              dataSource={orders}
              columns={orderColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-xs"
            />
          )}
        </div>

        {/* Wishlist Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                SAVED FAVORITES
              </span>
              <h3 className="text-xl font-bold font-serif uppercase tracking-tight text-black flex items-center gap-2">
                <HeartOutlined className="text-red-500" />
                <span>MY SAVED WISHLIST ({wishlistItems.length})</span>
              </h3>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-neutral-50 py-12 text-center rounded-xl border border-dashed border-neutral-300">
              <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                Your wishlist is empty. Tap the heart icon on any piece to save
                it here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wishlistItems.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white p-3.5 rounded-xl border border-neutral-200 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-full h-44 object-cover rounded-lg mb-2.5 cursor-pointer"
                    onClick={() => onQuickView && onQuickView(prod)}
                  />
                  <h4 className="text-xs font-bold text-black line-clamp-1 mb-1 font-serif uppercase">
                    {prod.name}
                  </h4>
                  <span className="font-mono text-xs font-black text-black block mb-3">
                    ${Number(prod.price).toFixed(2)}
                  </span>
                  <Button
                    type="primary"
                    onClick={() => onAddToCart && onAddToCart(prod)}
                    size="small"
                    className="w-full bg-black text-white hover:bg-neutral-800 text-[10px] font-extrabold uppercase tracking-wider py-1.5"
                  >
                    + ADD TO BAG
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit VIP Profile Modal */}
      <Modal
        title={
          <span className="font-serif font-black uppercase tracking-tight text-lg text-black">
            EDIT VIP CLIENT PROFILE
          </span>
        }
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        width={540}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveProfile}
          className="pt-3 space-y-3"
        >
          <Form.Item
            name="name"
            label={
              <span className="text-xs font-bold uppercase">Full Name</span>
            }
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              prefix={<IdcardOutlined className="text-neutral-400" />}
              className="text-xs py-2 rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span className="text-xs font-bold uppercase">Email Address</span>
            }
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input
              prefix={<MailOutlined className="text-neutral-400" />}
              className="text-xs py-2 rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span className="text-xs font-bold uppercase">Phone Number</span>
            }
          >
            <Input
              prefix={<PhoneOutlined className="text-neutral-400" />}
              className="text-xs py-2 rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label={
              <span className="text-xs font-bold uppercase">
                Shipping Address
              </span>
            }
          >
            <Input.TextArea
              rows={3}
              prefix={<HomeOutlined className="text-neutral-400" />}
              className="text-xs rounded-md"
            />
          </Form.Item>

          <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-200">
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase px-6"
            >
              Save Profile Changes
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
                <strong>Address:</strong>{" "}
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
                  className="flex justify-between items-center text-xs py-1.5 border-b border-neutral-100 font-mono"
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

            <div className="flex justify-between items-center pt-3 text-sm font-black font-mono border-t border-black">
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

export default UserAccountPage;
