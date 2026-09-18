import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Radio, notification } from "antd";
import {
  LockOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { submitOrder } from "../services/api";

const CheckoutModal = ({ open, onClose, cartItems, onOrderSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const shippingFee = subtotal >= 200 ? 0 : 15;
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const orderPayload = {
        customer_name: values.fullName,
        customer_email: values.email,
        phone: values.phone,
        shipping_address: values.address,
        payment_method: values.paymentMethod || "card",
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
        })),
      };

      const response = await submitOrder(orderPayload);
      setLoading(false);
      form.resetFields();
      onOrderSuccess(response.data);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Order Submission Failed",
        description:
          "Could not process order. Please try again or check network connection.",
        placement: "bottomRight",
      });
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      title={
        <div className="flex items-center space-x-2 border-b border-neutral-200 pb-3">
          <LockOutlined style={{ fontSize: "18px" }} />
          <span className="font-serif font-bold text-lg uppercase tracking-wider">
            SECURE CHECKOUT - ALEXANDRE LUXE
          </span>
        </div>
      }
      closeIcon={<CloseOutlined style={{ fontSize: "18px", color: "#000" }} />}
    >
      <div className="pt-4">
        {/* Order Summary Box */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-6">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            <span>ORDER SUMMARY ({cartItems.length} ITEMS)</span>
            <span>TOTAL: ${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex -space-x-2 overflow-hidden py-1">
            {cartItems.map((item, idx) => (
              <img
                key={idx}
                src={item.image_url}
                alt={item.name}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
              />
            ))}
          </div>
        </div>

        {/* Shipping & Customer Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ paymentMethod: "bakong" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span className="text-xs font-bold uppercase tracking-wider">
                  Full Name
                </span>
              }
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input placeholder="John Doe" className="text-xs" />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-xs font-bold uppercase tracking-wider">
                  Email Address
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="john@example.com" className="text-xs" />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase tracking-wider">
                Phone Number
              </span>
            }
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+1 (555) 000-0000" className="text-xs" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase tracking-wider">
                Shipping Address
              </span>
            }
            name="address"
            rules={[
              {
                required: true,
                message: "Please enter complete shipping address",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="123 Luxury Ave, Suite 400, New York, NY"
              className="text-xs"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase tracking-wider">
                Payment Option
              </span>
            }
            name="paymentMethod"
          >
            <Radio.Group className="w-full flex flex-col space-y-2">
              <div className="p-3.5 border-2 border-red-500/20 bg-red-50/30 rounded-xl flex items-center justify-between cursor-pointer hover:border-red-500 transition-colors">
                <Radio
                  value="bakong"
                  className="font-extrabold text-xs text-red-900"
                >
                  🔴 Bakong KHQR (ABA Bank, Acleda, Wing, Canadia, All Cambodian
                  Banks)
                </Radio>
                <span className="text-[10px] font-mono font-black text-red-600 bg-red-100 px-2 py-0.5 rounded tracking-widest uppercase">
                  ⚡ INSTANT KHQR
                </span>
              </div>
              <div className="p-3 border border-neutral-300 rounded-xl flex items-center justify-between cursor-pointer">
                <Radio value="card" className="font-semibold text-xs">
                  Credit / Debit Card (Visa, Mastercard, Amex)
                </Radio>
                <span className="text-xs text-neutral-400 font-mono">
                  💳 SECURE
                </span>
              </div>
              <div className="p-3 border border-neutral-300 rounded-xl flex items-center justify-between cursor-pointer">
                <Radio value="cod" className="font-semibold text-xs">
                  Cash on Delivery (COD)
                </Radio>
                <span className="text-xs text-neutral-400 font-mono">
                  📦 PAY ON DELIVERY
                </span>
              </div>
            </Radio.Group>
          </Form.Item>

          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
            <Button onClick={onClose} className="text-xs font-bold uppercase">
              CANCEL
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-black text-white hover:!bg-neutral-800 font-bold text-xs tracking-widest uppercase h-12 px-8 rounded-xl shadow-md border-none"
            >
              PLACE ORDER - ${totalAmount.toFixed(2)}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
