import React, { useState } from "react";
import { Modal, Input, Button, notification } from "antd";
import {
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";

const ContactModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      notification.warning({
        message: "MISSING INFORMATION",
        description: "Please fill in all required fields.",
        placement: "bottomRight",
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      onClose();
      notification.success({
        message: "MESSAGE SENT",
        description:
          "Thank you for contacting Alexandre Luxe. Our VIP Concierge will respond within 24 hours.",
        placement: "bottomRight",
        duration: 3,
      });
    }, 800);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      closeIcon={<CloseOutlined className="text-xs sm:text-sm md:text-base" />}
      className="contact-modal"
    >
      <div className="py-2 sm:py-4 px-1 max-h-[82vh] overflow-y-auto pr-2">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            CLIENT CONCIERGE & SUPPORT
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-serif uppercase tracking-tight text-black">
            CONTACT ALEXANDRE LUXE
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left: Contact Details Card */}
          <div className="md:col-span-2 bg-black text-white p-5 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold font-serif uppercase text-white mb-4">
                VIP CLIENT CARE
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light mb-6">
                Our dedicated client advisor team is available to assist with
                bespoke sizing, order tracking, and custom inquiries.
              </p>

              <div className="space-y-4 text-xs font-light">
                <div className="flex items-start gap-3">
                  <MailOutlined className="text-sm mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white uppercase text-[10px] tracking-wider">
                      EMAIL
                    </span>
                    <span className="text-neutral-300">
                      concierge@alexandreluxe.com
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneOutlined className="text-sm mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white uppercase text-[10px] tracking-wider">
                      PHONE / WHATSAPP
                    </span>
                    <span className="text-neutral-300">+33 1 42 68 55 00</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <EnvironmentOutlined className="text-sm mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white uppercase text-[10px] tracking-wider">
                      FLAGSHIP STUDIO
                    </span>
                    <span className="text-neutral-300">
                      28 Rue du Faubourg Saint-Honoré, Paris
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800 mt-6 text-[10px] text-neutral-400 uppercase tracking-wider">
              CLIENT HOURS: MON - SAT, 9AM - 8PM CET
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  FULL NAME *
                </label>
                <Input
                  size="large"
                  placeholder="e.g. Alexandre Moreau"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  EMAIL ADDRESS *
                </label>
                <Input
                  size="large"
                  type="email"
                  placeholder="e.g. alexandre@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  SUBJECT
                </label>
                <Input
                  size="large"
                  placeholder="e.g. Sizing Advice / Custom Order"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  MESSAGE *
                </label>
                <Input.TextArea
                  rows={4}
                  placeholder="How can our VIP Concierge assist you today?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="rounded-md text-xs"
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SendOutlined />}
                className="w-full bg-black text-white hover:!bg-neutral-800 border-none font-bold text-xs tracking-widest uppercase h-11 rounded-md shadow-md"
              >
                SEND MESSAGE
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ContactModal;
