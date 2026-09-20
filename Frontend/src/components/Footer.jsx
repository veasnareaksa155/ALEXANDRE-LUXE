import React from "react";
import { Input, Button } from "antd";
import {
  ArrowRightOutlined,
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const Footer = ({ onSelectCategory, onNavigatePage }) => {
  const handleCategoryNav = (catKey) => {
    if (onNavigatePage) onNavigatePage("shop");
    onSelectCategory(catKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageNav = (pageKey) => {
    if (onNavigatePage) onNavigatePage(pageKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Grid Layout - Column 1 gets 2 columns width on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-neutral-800">
          {/* Column 1: Brand Info & Logo */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div
              className="flex items-center space-x-3 mb-4 cursor-pointer"
              onClick={() => handlePageNav("home")}
            >
              <img
                src="/images/LOGO.png"
                alt="Legacy Store"
                className="h-10 sm:h-12 w-auto filter invert brightness-200 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="font-serif text-lg sm:text-xl lg:text-2xl tracking-wider font-extrabold text-white uppercase whitespace-nowrap">
                LEGACY STORE
              </span>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal mb-6 max-w-sm">
              Curated luxury apparel featuring tailored shirts, heavyweight
              cotton tees, and handmade Italian leather sneakers.
            </p>
            <div className="flex space-x-5 text-neutral-300">
              <a
                href="#"
                className="hover:text-white transition-colors"
                title="Instagram"
              >
                <InstagramOutlined style={{ fontSize: "22px" }} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                title="Twitter"
              >
                <TwitterOutlined style={{ fontSize: "22px" }} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                title="Facebook"
              >
                <FacebookOutlined style={{ fontSize: "22px" }} />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white mb-4 font-mono">
              COLLECTIONS
            </h4>
            <ul className="space-y-3 text-sm text-neutral-300 font-medium">
              <li>
                <button
                  onClick={() => handleCategoryNav("all")}
                  className="hover:text-white transition-colors text-left"
                >
                  All Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("shirt")}
                  className="hover:text-white transition-colors text-left"
                >
                  Tailored Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("t-shirt")}
                  className="hover:text-white transition-colors text-left"
                >
                  Heavyweight T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("shoes")}
                  className="hover:text-white transition-colors text-left"
                >
                  Handmade Footwear & Shoes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Pages */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white mb-4 font-mono">
              CLIENT CARE
            </h4>
            <ul className="space-y-3 text-sm text-neutral-300 font-medium">
              <li>
                <button
                  onClick={() => handlePageNav("about")}
                  className="hover:text-white transition-colors text-left"
                >
                  About Legacy Store
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageNav("lookbook")}
                  className="hover:text-white transition-colors text-left"
                >
                  Lookbook & Models
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageNav("contact")}
                  className="hover:text-white transition-colors text-left"
                >
                  VIP Contact & Concierge
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Express Worldwide Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Privileges */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white mb-4 font-mono">
              LUXE PRIVILEGES
            </h4>
            <p className="text-sm text-neutral-300 mb-4 font-normal leading-relaxed">
              Subscribe to receive exclusive access to drop releases & sales.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="footer-newsletter-input h-11"
              />
              <Button
                type="primary"
                icon={
                  <ArrowRightOutlined
                    style={{ color: "#000000", fontSize: "16px" }}
                  />
                }
                className="footer-newsletter-btn h-11 px-5"
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-neutral-400 font-mono font-medium">
          <p>
            &copy; {new Date().getFullYear()} LEGACY STORE. ALL RIGHTS
            RESERVED.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>AMEX</span>
            <span>APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
