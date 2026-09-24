import React, { useRef } from "react";
import { Modal, Button } from "antd";
import {
  PrinterOutlined,
  CloseOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const ReceiptModal = ({ open, onClose, order }) => {
  const printRef = useRef(null);

  if (!order) return null;

  const orderNumber =
    order.order_number || (order.id ? `LX-${order.id}` : "LX-000001");
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const items =
    Array.isArray(order.items) && order.items.length > 0
      ? order.items
      : [
          {
            id: 1,
            product_name: order.product_name || "Haute Couture Piece",
            size: order.size || "Standard",
            quantity: order.quantity || 1,
            price: order.total_amount || 0,
          },
        ];

  const totalAmount = Number(order.total_amount || 0).toFixed(2);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt_${orderNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 30px;
              -webkit-print-color-adjust: exact;
            }
            .receipt-container {
              max-width: 650px;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 32px;
              border-radius: 12px;
            }
            .font-serif { font-family: 'Cinzel', serif; }
            .border-b { border-bottom: 1px solid #e5e5e5; }
            .border-t { border-top: 1px solid #e5e5e5; }
            .border-black { border-color: #000; }
            .bg-black { background-color: #000; color: #fff; }
            .text-right { text-align: right; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .print-hidden { display: none !important; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${content.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      destroyOnClose
      closeIcon={false}
      className="luxury-receipt-modal"
      bodyStyle={{ padding: 0, borderRadius: "1rem", overflow: "hidden" }}
    >
      <div className="bg-white text-black p-5 sm:p-7 select-none">
        {/* Action Buttons Top Bar */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-500">
              OFFICIAL LUXURY RECEIPT
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              onClick={handlePrint}
              type="primary"
              className="bg-black hover:!bg-neutral-800 text-white font-mono font-bold text-[9px] tracking-wider uppercase h-6 px-2.5 rounded-full flex items-center gap-1 cursor-pointer border border-black shadow-2xs"
            >
              <PrinterOutlined className="text-[10px]" />
              <span>PRINT PDF</span>
            </Button>

            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-black flex items-center justify-center transition-all cursor-pointer border border-neutral-200 shrink-0"
              title="Close"
            >
              <CloseOutlined className="text-[9px]" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div ref={printRef} className="space-y-6">
          {/* 1. Header with Store Logo & Official Details */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-3.5 mb-2">
                <img
                  src="/images/LOGO.png"
                  alt="LEGACY"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-wider text-black m-0 leading-tight">
                    LEGACY
                  </h2>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500 block">
                    HAUTE COUTURE • PARIS
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 leading-relaxed m-0">
                12 Place Vendôme, 75001 Paris, France
                <br />
                Concierge: vip@legacystore.com | +33 1 42 68 00 00
              </p>
            </div>

            <div className="sm:text-right">
              <span className="bg-black text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full inline-block mb-2">
                RECEIPT #{orderNumber}
              </span>
              <p className="text-xs font-mono font-semibold text-neutral-700 m-0">
                Date: <strong className="text-black">{orderDate}</strong>
              </p>
              <p className="text-[10px] font-mono text-neutral-500 m-0 mt-0.5">
                Status:{" "}
                <strong className="text-black uppercase">
                  PAID & VERIFIED ✓
                </strong>
              </p>
            </div>
          </div>

          {/* 2. Customer & Shipping Info Box */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                CUSTOMER INFORMATION
              </span>
              <h4 className="font-bold text-black text-sm m-0">
                {order.customer_name || order.name || "VIP Client"}
              </h4>
              <p className="font-mono text-neutral-600 mt-1 space-y-0.5 m-0 leading-relaxed">
                <span>
                  {order.customer_email ||
                    order.email ||
                    "client@legacystore.com"}
                </span>
                {order.phone && <br />}
                {order.phone && <span>Phone: {order.phone}</span>}
              </p>
            </div>

            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                DELIVERY & PAYMENT
              </span>
              <p className="font-mono text-neutral-700 m-0 leading-relaxed">
                <strong>Address:</strong>{" "}
                {order.shipping_address ||
                  order.address ||
                  "Standard Express Delivery"}
                <br />
                <strong>Payment:</strong>{" "}
                <span className="uppercase font-bold text-black">
                  {order.payment_method || "BAKONG KHQR / VIP PAY"}
                </span>
              </p>
            </div>
          </div>

          {/* 3. Itemized Products Table */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <span className="text-xs font-extrabold font-serif uppercase tracking-wider text-black">
                ITEM DESCRIPTION
              </span>
              <div className="flex items-center gap-8 sm:gap-12 font-mono text-xs font-bold text-neutral-500 uppercase">
                <span className="w-8 text-center">QTY</span>
                <span className="w-16 text-right">UNIT</span>
                <span className="w-16 text-right">TOTAL</span>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {items.map((item, index) => {
                const qty = item.quantity || 1;
                const unitPrice = Number(item.price || 0);
                const lineTotal = (unitPrice * qty).toFixed(2);
                return (
                  <div
                    key={index}
                    className="py-3 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="pr-4">
                      <span className="font-bold text-black uppercase block">
                        {item.product_name ||
                          item.name ||
                          "Haute Couture Piece"}
                      </span>
                      {item.size && (
                        <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 font-mono mt-0.5 inline-block">
                          SIZE: {item.size}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-8 sm:gap-12 text-xs font-mono shrink-0">
                      <span className="w-8 text-center text-neutral-700 font-bold">
                        {qty}
                      </span>
                      <span className="w-16 text-right text-neutral-700">
                        ${unitPrice.toFixed(2)}
                      </span>
                      <span className="w-16 text-right font-black text-black">
                        ${lineTotal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Financial Summary & Total */}
          <div className="pt-4 border-t-2 border-black flex flex-col items-end space-y-1.5 font-mono text-xs">
            <div className="flex justify-between w-full max-w-xs text-neutral-600">
              <span>Subtotal:</span>
              <span>${totalAmount}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs text-neutral-600">
              <span>Express Shipping:</span>
              <span className="font-bold text-black">FREE VIP EXPRESS</span>
            </div>
            <div className="flex justify-between w-full max-w-xs text-neutral-600">
              <span>VAT / Taxes:</span>
              <span className="text-neutral-500">INCLUDED</span>
            </div>

            <div className="flex justify-between w-full max-w-xs pt-3 border-t border-neutral-200 text-sm sm:text-base font-black text-black">
              <span className="font-serif">TOTAL PAID:</span>
              <span className="font-mono text-lg">${totalAmount}</span>
            </div>
          </div>

          {/* 5. Official Authenticity Footer & Stamp */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <SafetyCertificateOutlined className="text-xl text-black" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black block">
                  100% AUTHENTIC GUARANTEE
                </span>
                <span className="text-[9px] font-mono text-neutral-500 block">
                  MAISON LEGACY PARIS • EXCLUSIVE CLIENTELE
                </span>
              </div>
            </div>

            <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest text-center sm:text-right">
              ★ OFFICIAL RECEIPT • SAVE FOR WARRANTY ★
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
