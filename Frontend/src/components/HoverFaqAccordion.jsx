import React, { useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const DEFAULT_FAQS = [
  {
    id: "1",
    question: "WHAT ARE YOUR WORLDWIDE SHIPPING TIMES?",
    answer:
      "Express international shipping via DHL Express takes 2-4 business days. Complimentary worldwide shipping applies to all orders over $200 with full transit insurance.",
    badges: ["DHL EXPRESS", "2-4 DAYS", "FREE OVER $200"],
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "2",
    question: "HOW DO RETURNS & EXCHANGES WORK?",
    answer:
      "We offer a 30-day complimentary return window. Garments must be unworn with original tags attached in original luxury packaging with prepaid return labels included.",
    badges: ["30-DAY RETURNS", "COMPLIMENTARY", "EASY EXCHANGE"],
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "3",
    question: "WHERE ARE LEGACY PRODUCTS MANUFACTURED?",
    answer:
      "Our tailored shirts are designed in Paris, heavyweight tees produced in Milan from 280 GSM combed cotton, and calfskin footwear Goodyear welted in Porto, Portugal.",
    badges: ["PARIS ATELIER", "MILAN COTTON", "PORTO FOOTWEAR"],
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "4",
    question: "HOW DO I TRACK MY BESPOKE SHIPMENT?",
    answer:
      "Once dispatched from our atelier, a live DHL Express tracking code is sent via SMS & email. VIP client advisors are available 24/7 for custom order updates.",
    badges: ["24/7 CONCIERGE", "SMS ALERTS", "LIVE TRACKING"],
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80",
  },
];

export default function HoverFaqAccordion({ items = DEFAULT_FAQS }) {
  const [activeId, setActiveId] = useState("1");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2.5">
      {items.map((item) => {
        const isOpen = activeId === item.id;

        return (
          <div
            key={item.id}
            onClick={() => setActiveId(isOpen ? null : item.id)}
            className={`group overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
              isOpen
                ? "bg-white border-neutral-900 shadow-sm"
                : "bg-white border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/50"
            }`}
          >
            {/* Header Bar - Compact Height */}
            <div className="py-3.5 px-4 sm:px-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mini Image Preview (Reveals when open) */}
                {isOpen && (
                  <img
                    src={item.image}
                    alt={item.question}
                    className="w-7 h-7 rounded-md object-cover border border-neutral-200 shrink-0 transition-all"
                  />
                )}

                <h3
                  className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isOpen
                      ? "text-black"
                      : "text-neutral-800 group-hover:text-black"
                  }`}
                >
                  {item.question}
                </h3>
              </div>

              {/* Compact Toggle Button */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? "bg-black text-white rotate-180"
                    : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                }`}
              >
                {isOpen ? (
                  <MinusOutlined style={{ fontSize: "11px" }} />
                ) : (
                  <PlusOutlined style={{ fontSize: "11px" }} />
                )}
              </div>
            </div>

            {/* Expandable Content Container */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden px-4 sm:px-6 ${
                isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"
              }`}
            >
              <div className="pt-2 border-t border-neutral-100 space-y-3">
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                  {item.answer}
                </p>

                {/* Badges */}
                {item.badges && item.badges.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
