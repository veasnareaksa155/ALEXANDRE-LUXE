import React from "react";
import { Modal, Button, Result } from "antd";
import { CheckCircleFilled, CarOutlined } from "@ant-design/icons";

const OrderSuccessModal = ({ open, onClose, orderData }) => {
  if (!orderData) return null;

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered width={550}>
      <div className="py-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-4 shadow-xl">
          <CheckCircleFilled style={{ fontSize: "32px" }} />
        </div>

        <h2 className="text-2xl font-bold font-serif uppercase tracking-tight text-black mb-2">
          ORDER CONFIRMED!
        </h2>

        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-6">
          THANK YOU FOR SHOPPING WITH ALEXANDRE LUXE
        </p>

        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-left text-xs mb-6 space-y-2">
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="font-bold text-neutral-500 uppercase">
              Order Number:
            </span>
            <span className="font-mono font-bold text-black">
              {orderData.order_number}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="font-bold text-neutral-500 uppercase">
              Customer:
            </span>
            <span className="font-semibold text-black">
              {orderData.customer_name}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="font-bold text-neutral-500 uppercase">Email:</span>
            <span className="font-semibold text-black">
              {orderData.customer_email}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="font-bold text-neutral-500 uppercase">
              Total Paid:
            </span>
            <span className="font-extrabold text-black font-sans">
              ${Number(orderData.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-6 font-light">
          A confirmation email with express tracking details has been sent to{" "}
          <strong className="text-black">{orderData.customer_email}</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Button
            type="primary"
            onClick={onClose}
            className="bg-black text-white hover:!bg-neutral-800 font-bold text-xs tracking-widest uppercase h-11 px-6 w-full sm:w-auto"
          >
            CONTINUE SHOPPING
          </Button>

          {onOpenDeliveryTracking && (
            <Button
              onClick={() => {
                onClose();
                onOpenDeliveryTracking(orderData);
              }}
              className="bg-amber-500 hover:!bg-amber-400 text-black border-amber-600 font-extrabold text-xs tracking-widest uppercase h-11 px-6 w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              <CarOutlined className="text-sm" />
              TRACK LIVE DELIVERY 🚚
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OrderSuccessModal;
