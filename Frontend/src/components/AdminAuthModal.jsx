import React, { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import {
  CrownOutlined,
  LockOutlined,
  MailOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const AdminAuthModal = ({ open, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userData = {
        role: "admin",
        name: "SuperAdmin Alexandre",
        email: values.email || "admin@alexandreluxe.com",
      };

      notification.success({
        message: "ADMIN ACCESS GRANTED",
        description: "Welcome to Alexandre Luxe Admin Management Panel.",
        placement: "bottomRight",
        duration: 2.5,
      });

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    }, 400);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={460}
      centered
      destroyOnClose
      className="admin-auth-modal"
    >
      <div className="p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-700 text-yellow-400 flex items-center justify-center text-2xl mx-auto shadow-lg">
          <CrownOutlined />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest block">
            ⚡ SUPERADMIN GATE
          </span>
          <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-black">
            ADMIN PORTAL ACCESS
          </h2>
          <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto mt-1">
            Enter administrative key credentials to manage products, orders, and
            system analytics.
          </p>
        </div>

        <Form
          layout="vertical"
          initialValues={{
            email: "admin@alexandreluxe.com",
            password: "adminpassword",
          }}
          onFinish={handleAdminLogin}
          className="text-left pt-2 space-y-3"
        >
          <Form.Item
            name="email"
            label={
              <span className="text-xs font-bold uppercase">Admin Email</span>
            }
            rules={[{ required: true, message: "Please enter admin email" }]}
          >
            <Input
              prefix={<MailOutlined className="text-neutral-400" />}
              placeholder="admin@alexandreluxe.com"
              className="text-xs py-2 rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className="text-xs font-bold uppercase">
                Admin Key / Passkey
              </span>
            }
            rules={[{ required: true, message: "Please enter passkey" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-neutral-400" />}
              placeholder="••••••••"
              className="text-xs py-2 rounded-md"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-widest h-11 rounded-md shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <CrownOutlined className="text-yellow-400" />
            <span>AUTHENTICATE & ENTER ADMIN</span>
            <ArrowRightOutlined />
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default AdminAuthModal;
