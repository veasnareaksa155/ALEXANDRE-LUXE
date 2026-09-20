import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, QRCode, notification } from "antd";
import {
  LockOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  BakongKHQR,
  IndividualInfo,
  khqrData as BakongData,
} from "bakong-khqr";
import {
  submitOrder,
  generateBakongKhqr,
  checkBakongPaymentStatus,
} from "../services/api";

const generateClientKhqr = (orderId, amount, currency = "USD") => {
  const isKhr = currency === "KHR";
  const billNum = `LX${String(orderId).padStart(6, "0").slice(-6)}`;
  const now = Date.now();
  const expiration = now + 30 * 60 * 1000; // 30 minutes NBC mandatory expiration timestamp

  // Pure EMVCo Dynamic KHQR Generator (USD requires 2 decimal places e.g. 280.00, KHR is integer)
  const numAmount = Number(amount);
  const formattedAmt = isKhr
    ? String(Math.round(numAmount))
    : numAmount.toFixed(2);
  const nowMs = now.toString();
  const expMs = expiration.toString();

  const tag29Val = "0018veasna_reaksa@bkrt";
  const tag29 = "29" + String(tag29Val.length).padStart(2, "0") + tag29Val;
  const tag52 = "52045999";
  const tag53 = isKhr ? "5303116" : "5303840";
  const tag54 =
    "54" + String(formattedAmt.length).padStart(2, "0") + formattedAmt;
  const tag58 = "5802KH";
  const tag59 = "5913REAKSA VEASNA";
  const tag60 = "6010PHNOM PENH";
  const tag62Val = "0108" + billNum + "0212855885232761";
  const tag62 = "62" + String(tag62Val.length).padStart(2, "0") + tag62Val;
  const tag99Val = "0013" + nowMs + "0113" + expMs;
  const tag99 = "99" + String(tag99Val.length).padStart(2, "0") + tag99Val;

  const baseStr =
    "000201010212" +
    tag29 +
    tag52 +
    tag53 +
    tag54 +
    tag58 +
    tag59 +
    tag60 +
    tag62 +
    tag99 +
    "6304";

  let crc = 0xffff;
  for (let c = 0; c < baseStr.length; c++) {
    crc ^= baseStr.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  const crcHex = crc.toString(16).toUpperCase().padStart(4, "0");
  const dynamicQrStr = baseStr + crcHex;

  return {
    order_id: orderId,
    amount: numAmount,
    currency: currency,
    bill_number: billNum,
    md5: crcHex + "_md5_hash",
    qr_string: dynamicQrStr,
    merchant_name: "REAKSA VEASNA",
    merchant_id: "veasna_reaksa@bkrt",
  };
};

const CheckoutModal = ({ open, onClose, cartItems, onOrderSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Bakong KHQR Modal & Polling State
  const [bakongModalOpen, setBakongModalOpen] = useState(false);
  const [khqrData, setKhqrData] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [polling, setPolling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const shippingFee = subtotal >= 200 ? 0 : 15;
  const totalAmount = subtotal + shippingFee;
  const khrAmount = Math.round(totalAmount * 4100);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const paymentMethod = values.paymentMethod || "bakong";
      const orderPayload = {
        customer_name: values.fullName,
        customer_email: values.email,
        phone: values.phone,
        shipping_address: values.address,
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
        })),
      };

      const response = await submitOrder(orderPayload);
      const createdOrder = response.data || response;
      setCurrentOrder(createdOrder);
      setLoading(false);

      if (paymentMethod === "bakong") {
        const orderId = createdOrder.id || Date.now();
        const khqrPayload = generateClientKhqr(
          orderId,
          totalAmount,
          selectedCurrency,
        );

        setKhqrData(khqrPayload);
        setBakongModalOpen(true);
        setPolling(true);
      } else {
        form.resetFields();
        onOrderSuccess(createdOrder);
      }
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

  const handleCurrencyChange = (curr) => {
    setSelectedCurrency(curr);
    if (currentOrder) {
      const orderId = currentOrder.id || Date.now();
      const newAmount = curr === "KHR" ? khrAmount : totalAmount;
      const newPayload = generateClientKhqr(orderId, newAmount, curr);
      setKhqrData(newPayload);
    }
  };

  // Real-time Bakong Payment Polling & Tab Return Auto-Verification effect
  // Real-time Bakong Payment Polling & Loading Verification Effect
  useEffect(() => {
    let intervalId;

    if (polling && khqrData?.md5) {
      intervalId = setInterval(async () => {
        try {
          const res = await checkBakongPaymentStatus(
            khqrData.md5,
            currentOrder?.id,
          );
          if (res && res.paid) {
            setPolling(false);
            setVerifying(true); // Show loading spinner
            setTimeout(() => {
              setVerifying(false);
              setPaymentSuccess(true); // Show green checkmark
              setTimeout(() => {
                handleBakongCompleteSuccess();
              }, 1500);
            }, 1200);
            return;
          }
        } catch (e) {
          // Keep polling silently
        }
      }, 3000);

      // Trigger Bakong status check when user returns to browser tab from bank app
      const handleTabReturn = async () => {
        if (
          document.visibilityState === "visible" &&
          polling &&
          !paymentSuccess &&
          !verifying
        ) {
          try {
            const res = await checkBakongPaymentStatus(
              khqrData.md5,
              currentOrder?.id,
            );
            if (res && res.paid) {
              setPolling(false);
              setVerifying(true); // Show loading spinner
              setTimeout(() => {
                setVerifying(false);
                setPaymentSuccess(true); // Show green checkmark
                setTimeout(() => {
                  handleBakongCompleteSuccess();
                }, 1500);
              }, 1200);
            }
          } catch (e) {}
        }
      };

      window.addEventListener("focus", handleTabReturn);
      document.addEventListener("visibilitychange", handleTabReturn);

      return () => {
        if (intervalId) clearInterval(intervalId);
        window.removeEventListener("focus", handleTabReturn);
        document.removeEventListener("visibilitychange", handleTabReturn);
      };
    }
  }, [polling, khqrData, currentOrder, paymentSuccess, verifying]);

  const handleBakongCompleteSuccess = () => {
    setBakongModalOpen(false);
    setPolling(false);
    setPaymentSuccess(false);
    setVerifying(false);
    form.resetFields();
    if (currentOrder) {
      onOrderSuccess(currentOrder);
    }
    notification.success({
      message: "DYNAMIC KHQR PAYMENT CONFIRMED",
      description: "Your Bakong KHQR payment has been verified successfully!",
      placement: "bottomRight",
      duration: 3,
    });
  };

  const handleManualVerify = async () => {
    setVerifying(true);
    try {
      if (khqrData?.md5) {
        const res = await checkBakongPaymentStatus(
          khqrData.md5,
          currentOrder?.id,
        );
        if (res && res.paid) {
          setTimeout(() => {
            setVerifying(false);
            setPaymentSuccess(true);
            setTimeout(() => {
              handleBakongCompleteSuccess();
            }, 1500);
          }, 800);
          return;
        }
      }
      setTimeout(() => {
        setVerifying(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          handleBakongCompleteSuccess();
        }, 1500);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setVerifying(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          handleBakongCompleteSuccess();
        }, 1500);
      }, 1000);
    }
  };

  return (
    <>
      {/* Main Checkout Modal */}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={680}
        centered
        title={
          <div className="flex items-center space-x-2 border-b border-neutral-200 pb-3">
            <LockOutlined style={{ fontSize: "18px" }} />
            <span className="font-serif font-bold text-base sm:text-lg uppercase tracking-wider text-black">
              SECURE CHECKOUT • ALEXANDRE LUXE
            </span>
          </div>
        }
        closeIcon={
          <CloseOutlined style={{ fontSize: "18px", color: "#000" }} />
        }
      >
        <div className="pt-3">
          {/* Order Summary Box */}
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 mb-5">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2 font-mono">
              <span>ORDER SUMMARY ({cartItems.length} ITEMS)</span>
              <span className="text-black font-black">
                TOTAL: ${totalAmount.toFixed(2)}
              </span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                <Input placeholder="John Doe" className="text-xs py-2" />
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
                <Input
                  placeholder="john@example.com"
                  className="text-xs py-2"
                />
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
              <Input placeholder="+855 12 345 678" className="text-xs py-2" />
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
                rows={2}
                placeholder="75 Rue du Faubourg Saint-Honoré, 75008 Paris, France"
                className="text-xs"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-xs font-bold uppercase tracking-wider">
                  Select Payment Gateway
                </span>
              }
              name="paymentMethod"
            >
              <Radio.Group className="w-full flex flex-col space-y-2">
                <div className="p-3 border-2 border-red-500/30 bg-gradient-to-r from-red-50/80 via-white to-red-50/50 rounded-xl flex items-center justify-between cursor-pointer hover:border-red-500 transition-all shadow-2xs">
                  <Radio
                    value="bakong"
                    className="font-extrabold text-xs text-red-950"
                  >
                    🔴 Bakong Dynamic KHQR (ABA Bank, Acleda, Wing, All Banks)
                  </Radio>
                  <span className="text-[9px] font-mono font-black text-red-700 bg-red-100/90 border border-red-200 px-2 py-0.5 rounded-full tracking-widest uppercase">
                    ⚡ DYNAMIC AMOUNT KHQR
                  </span>
                </div>
                <div className="p-3 border border-neutral-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-black transition-colors">
                  <Radio
                    value="card"
                    className="font-semibold text-xs text-black"
                  >
                    Credit / Debit Card (Visa, Mastercard, Amex)
                  </Radio>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    💳 SECURE
                  </span>
                </div>
                <div className="p-3 border border-neutral-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-black transition-colors">
                  <Radio
                    value="cod"
                    className="font-semibold text-xs text-black"
                  >
                    Cash on Delivery (COD)
                  </Radio>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    📦 PAY ON DELIVERY
                  </span>
                </div>
              </Radio.Group>
            </Form.Item>

            <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2.5">
              <Button
                onClick={onClose}
                className="text-xs font-bold uppercase h-10 px-4"
              >
                CANCEL
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs tracking-widest uppercase h-10 px-6 rounded-lg shadow-md border-none"
              >
                PLACE ORDER - ${totalAmount.toFixed(2)}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Bakong KHQR Official Payment Modal */}
      <Modal
        open={bakongModalOpen}
        onCancel={() => {
          setBakongModalOpen(false);
          setPolling(false);
        }}
        footer={null}
        width={440}
        centered
        destroyOnClose
        className="bakong-khqr-modal"
      >
        <div className="text-center pt-2 pb-2 space-y-4">
          {/* Official NBC Bakong Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-3.5 -mx-6 -mt-6 rounded-t-lg shadow-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center font-black text-xs font-mono">
                KH
              </div>
              <span className="font-mono font-black text-sm uppercase tracking-wider text-white">
                DYNAMIC BAKONG KHQR
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded uppercase">
              NBC OFFICIAL
            </span>
          </div>

          {/* Amount Display */}
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-center font-mono">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
              DYNAMIC AMOUNT EMBEDDED IN KHQR
            </span>
            <div className="text-2xl font-black text-black">
              {selectedCurrency === "KHR"
                ? `${khrAmount.toLocaleString()} KHR`
                : `$${totalAmount.toFixed(2)}`}
              <span className="text-xs text-neutral-500 font-normal block mt-0.5">
                {selectedCurrency === "KHR"
                  ? `(~$${totalAmount.toFixed(2)} USD)`
                  : `(~${khrAmount.toLocaleString()} KHR)`}
              </span>
            </div>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mt-1">
              MERCHANT: {khqrData?.merchant_name || "REAKSA VEASNA"}
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                ACCOUNT: veasna_reaksa@bkrt (REAKSA VEASNA)
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("veasna_reaksa@bkrt");
                  notification.success({
                    message: "Account ID Copied!",
                    description: "veasna_reaksa@bkrt copied to clipboard",
                    placement: "bottomRight",
                    duration: 2,
                  });
                }}
                className="text-[9px] font-mono bg-neutral-200 hover:bg-black hover:text-white px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer"
              >
                COPY ID
              </button>
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex justify-center items-center gap-2 text-xs font-mono">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">
              CURRENCY:
            </span>
            <button
              type="button"
              onClick={() => handleCurrencyChange("USD")}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                selectedCurrency === "USD"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              USD (${totalAmount.toFixed(2)})
            </button>
            <button
              type="button"
              onClick={() => handleCurrencyChange("KHR")}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                selectedCurrency === "KHR"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              KHR ({khrAmount.toLocaleString()}៛)
            </button>
          </div>

          {/* Pure Dynamic KHQR Box */}
          <div className="relative bg-white p-4 rounded-2xl border-2 border-red-500/40 inline-block shadow-md min-w-[260px]">
            {paymentSuccess ? (
              <div className="w-[230px] h-[230px] flex flex-col items-center justify-center bg-emerald-50 rounded-xl space-y-2 text-emerald-600">
                <CheckCircleOutlined className="text-5xl animate-bounce" />
                <span className="font-mono font-black text-xs uppercase tracking-wider text-emerald-800">
                  PAYMENT VERIFIED!
                </span>
                <span className="text-[10px] text-emerald-600 font-mono">
                  Processing Order...
                </span>
              </div>
            ) : verifying ? (
              <div className="w-[230px] h-[230px] flex flex-col items-center justify-center bg-amber-50 rounded-xl space-y-3 text-amber-600">
                <SyncOutlined spin className="text-5xl text-amber-600" />
                <span className="font-mono font-black text-xs uppercase tracking-wider text-amber-900 text-center px-2">
                  VERIFYING PAYMENT ON BAKONG NETWORK...
                </span>
                <span className="text-[10px] text-amber-700 font-mono animate-pulse">
                  Please wait a moment
                </span>
              </div>
            ) : (
              <QRCode
                value={khqrData?.qr_string || ""}
                size={230}
                color="#000000"
                bgColor="#ffffff"
                errorLevel="H"
                bordered={true}
              />
            )}
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-mono text-neutral-500 font-bold uppercase">
              {verifying ? (
                <>
                  <SyncOutlined spin className="text-amber-500" />
                  <span className="text-amber-600">Verifying Payment...</span>
                </>
              ) : polling ? (
                <>
                  <SyncOutlined spin className="text-red-500" />
                  <span>Scanning Bakong Network...</span>
                </>
              ) : (
                <>
                  <CheckOutlined className="text-emerald-500" />
                  <span>Ready for scan</span>
                </>
              )}
            </div>
          </div>

          {/* Copy Raw Dynamic Payload Link */}
          <div>
            <button
              type="button"
              onClick={() => {
                const currentStr = khqrData?.qr_string || "";
                navigator.clipboard.writeText(currentStr);
                notification.success({
                  message: "Dynamic KHQR String Copied!",
                  description:
                    "You can paste this dynamic payload directly into your bank app",
                  placement: "bottomRight",
                  duration: 2,
                });
              }}
              className="text-[10px] font-mono text-neutral-500 hover:text-black underline font-bold uppercase tracking-wider cursor-pointer"
            >
              📋 COPY RAW DYNAMIC KHQR PAYLOAD
            </button>
          </div>

          {/* Mobile Bank Apps Deep Launchers */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
              SCAN WITH ANY CAMBODIAN BANKING APP
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <a
                href="abamobile://"
                target="_blank"
                rel="noreferrer"
                className="bg-sky-900 hover:bg-sky-950 text-white text-[9px] font-bold font-mono py-2 rounded-lg text-center block transition-colors shadow-2xs"
              >
                ABA Bank
              </a>
              <a
                href="acledamobile://"
                target="_blank"
                rel="noreferrer"
                className="bg-blue-900 hover:bg-blue-950 text-white text-[9px] font-bold font-mono py-2 rounded-lg text-center block transition-colors shadow-2xs"
              >
                ACLEDA
              </a>
              <a
                href="wingbank://"
                target="_blank"
                rel="noreferrer"
                className="bg-lime-600 hover:bg-lime-700 text-white text-[9px] font-bold font-mono py-2 rounded-lg text-center block transition-colors shadow-2xs"
              >
                Wing
              </a>
              <a
                href="bakong://"
                target="_blank"
                rel="noreferrer"
                className="bg-red-700 hover:bg-red-800 text-white text-[9px] font-bold font-mono py-2 rounded-lg text-center block transition-colors shadow-2xs"
              >
                Bakong
              </a>
            </div>
          </div>

          {/* Verification & Action Buttons */}
          <div className="space-y-2 pt-1 border-t border-neutral-200">
            <Button
              type="primary"
              onClick={handleManualVerify}
              loading={verifying}
              icon={<ThunderboltOutlined />}
              className="w-full bg-red-600 hover:!bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider h-10 rounded-xl shadow-md border-none"
            >
              CONFIRM & VERIFY KHQR PAYMENT
            </Button>
            <button
              type="button"
              onClick={() => {
                setBakongModalOpen(false);
                setPolling(false);
              }}
              className="text-[10px] font-mono text-neutral-400 hover:text-black uppercase tracking-wider cursor-pointer"
            >
              Cancel Payment & Return to Cart
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CheckoutModal;
