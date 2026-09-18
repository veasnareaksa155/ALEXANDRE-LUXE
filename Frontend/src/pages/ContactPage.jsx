import React, { useState, useEffect } from "react";
import { Input, Button, notification, Collapse } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      notification.success({
        message: "MESSAGE SENT",
        description:
          "Thank you for contacting Alexandre Luxe. Our VIP Concierge will respond within 24 hours.",
        placement: "bottomRight",
        duration: 3.5,
      });
    }, 800);
  };

  const faqItems = [
    {
      key: "1",
      label: (
        <span className="font-serif font-bold uppercase text-black text-sm">
          WHAT ARE YOUR WORLDWIDE SHIPPING TIMES?
        </span>
      ),
      children: (
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          Express international shipping via DHL Express takes 2-4 business
          days. Complimentary worldwide shipping applies to all orders over
          $200.
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <span className="font-serif font-bold uppercase text-black text-sm">
          HOW DO RETURNS & EXCHANGES WORK?
        </span>
      ),
      children: (
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          We offer a 30-day complimentary return window. Garments must be unworn
          with original tags attached in original luxury packaging.
        </p>
      ),
    },
    {
      key: "3",
      label: (
        <span className="font-serif font-bold uppercase text-black text-sm">
          WHERE ARE ALEXANDRE LUXE PRODUCTS MANUFACTURED?
        </span>
      ),
      children: (
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          Our shirts are tailored in Paris, heavyweight tees produced in Milan,
          and calfskin footwear Goodyear welted in Porto, Portugal.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white text-neutral-900 pb-20">
      {/* Page Hero Header */}
      <div className="bg-black text-white py-16 sm:py-24 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            VIP CLIENT CARE & SUPPORT
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif uppercase tracking-tight text-white mb-4">
            CONTACT ALEXANDRE LUXE
          </h1>
          <p className="text-sm sm:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Our client advisors are at your service for bespoke sizing
            recommendations, order tracking, and general inquiries.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          {/* Left: Contact Info Card (2 Cols) */}
          <div className="lg:col-span-2 bg-black text-white p-6 sm:p-10 rounded-xl flex flex-col justify-between shadow-2xl">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                DIRECT CHANNELS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif uppercase text-white mb-4">
                PARIS CONCIERGE
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light mb-8">
                Whether requesting private studio appointments or tracking
                bespoke shipments, our VIP team responds within 24 hours.
              </p>

              <div className="space-y-6 text-xs sm:text-sm font-light">
                <div className="flex items-start gap-4">
                  <MailOutlined className="text-xl text-white mt-1" />
                  <div>
                    <span className="font-bold block text-white uppercase text-xs tracking-wider">
                      EMAIL ADVISORS
                    </span>
                    <span className="text-neutral-300">
                      concierge@alexandreluxe.com
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PhoneOutlined className="text-xl text-white mt-1" />
                  <div>
                    <span className="font-bold block text-white uppercase text-xs tracking-wider">
                      WHATSAPP / CONCIERGE
                    </span>
                    <span className="text-neutral-300">+33 1 42 68 55 00</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <EnvironmentOutlined className="text-xl text-white mt-1" />
                  <div>
                    <span className="font-bold block text-white uppercase text-xs tracking-wider">
                      FLAGSHIP STUDIO
                    </span>
                    <span className="text-neutral-300">
                      28 Rue du Faubourg Saint-Honoré, 75008 Paris, France
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-800 mt-8 text-xs text-neutral-400 font-mono uppercase tracking-wider">
              CLIENT HOURS: MON - SAT, 9AM - 8PM CET
            </div>
          </div>

          {/* Right: Contact Form (3 Cols) */}
          <div className="lg:col-span-3 bg-neutral-50 p-6 sm:p-10 rounded-xl border border-neutral-200 shadow-sm">
            <h2 className="text-2xl font-bold font-serif uppercase tracking-tight text-black mb-6">
              SEND US A MESSAGE
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    FULL NAME *
                  </label>
                  <Input
                    size="large"
                    placeholder="e.g. Alexandre Moreau"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-md text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
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
                    className="rounded-md text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  SUBJECT
                </label>
                <Input
                  size="large"
                  placeholder="e.g. Sizing Advice / Custom Order Inquiry"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="rounded-md text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  MESSAGE *
                </label>
                <Input.TextArea
                  rows={5}
                  placeholder="How can our VIP Concierge assist you today?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="rounded-md text-xs sm:text-sm"
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SendOutlined />}
                className="w-full bg-black text-white hover:!bg-neutral-800 border-none font-bold text-xs tracking-widest uppercase h-12 rounded-md shadow-md"
              >
                SUBMIT INQUIRY
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto pt-8">
          <h2 className="text-xl sm:text-2xl font-bold font-serif uppercase tracking-tight text-center text-black mb-6">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <Collapse
            items={faqItems}
            className="bg-white border-neutral-200 rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
