import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Progress, Empty, Checkbox } from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  TagOutlined,
  StarFilled,
} from "@ant-design/icons";

const CartDrawer = ({
  open,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onBulkRemoveItems,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Reset selected keys when drawer opens or cartItems change
  useEffect(() => {
    setSelectedKeys([]);
  }, [open, cartItems.length]);

  const getItemKey = (item) => `${item.id}-${item.size}-${item.color}`;

  const allKeys = cartItems.map(getItemKey);
  const isAllSelected =
    allKeys.length > 0 && selectedKeys.length === allKeys.length;
  const isIndeterminate =
    selectedKeys.length > 0 && selectedKeys.length < allKeys.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedKeys(allKeys);
    } else {
      setSelectedKeys([]);
    }
  };

  const handleItemSelect = (key, checked) => {
    if (checked) {
      setSelectedKeys((prev) => [...prev, key]);
    } else {
      setSelectedKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  const handleBulkDelete = () => {
    if (selectedKeys.length === 0) return;
    if (onBulkRemoveItems) {
      onBulkRemoveItems(selectedKeys);
    } else {
      selectedKeys.forEach((key) => {
        const item = cartItems.find((i) => getItemKey(i) === key);
        if (item) onRemoveItem(item.id, item.size, item.color);
      });
    }
    setSelectedKeys([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const totalItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const freeShippingThreshold = 200;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100),
  );

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "LUXE10") {
      setDiscountAmount(subtotal * 0.1);
    } else {
      setDiscountAmount(0);
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <Drawer
      title={
        <div className="flex items-center space-x-2">
          <ShoppingOutlined style={{ fontSize: "18px", color: "#000" }} />
          <span className="font-serif font-bold text-sm sm:text-base uppercase tracking-wider text-black">
            YOUR SHOPPING BAG
          </span>
          <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            {totalItemCount}
          </span>
        </div>
      }
      extra={
        <button
          onClick={onClose}
          className="text-black hover:text-red-600 transition-colors p-1 flex items-center justify-center cursor-pointer"
          title="Close"
        >
          <CloseOutlined style={{ fontSize: "16px", color: "#000" }} />
        </button>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={440}
      closeIcon={false}
      className="cart-drawer-custom"
    >
      <div className="flex flex-col h-full justify-between -mt-1">
        {/* Top Free Shipping Progress Card */}
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/90 mb-3 shadow-2xs">
          <div className="text-[11px] font-bold text-neutral-800 mb-1.5 flex justify-between items-center font-mono">
            <span className="truncate pr-1">
              {subtotal >= freeShippingThreshold ? (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircleOutlined /> FREE EXPRESS SHIPPING UNLOCKED
                </span>
              ) : (
                `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping`
              )}
            </span>
            <span className="text-black font-black">{progressPercent}%</span>
          </div>
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor="#000000"
            size="small"
            className="m-0"
          />
        </div>

        {/* Multi-select Header Toolbar */}
        {cartItems.length > 0 && (
          <div className="flex items-center justify-between bg-neutral-100/80 px-3 py-1.5 rounded-lg mb-2 border border-neutral-200/70">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              className="text-[11px] font-bold text-neutral-700 uppercase"
            >
              Select All ({cartItems.length})
            </Checkbox>

            {selectedKeys.length > 0 && (
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
                className="text-[10px] font-bold uppercase rounded-md h-6 px-2.5"
              >
                REMOVE ({selectedKeys.length})
              </Button>
            )}
          </div>
        )}

        {/* Cart Items Scroll List */}
        <div className="flex-1 overflow-y-auto pr-1 divide-y divide-neutral-100 space-y-1">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Your luxury bag is currently empty
                  </span>
                }
              />
              <Button
                onClick={onClose}
                className="mt-4 bg-black text-white hover:!bg-neutral-800 font-bold text-xs uppercase tracking-widest h-9 px-6 rounded-lg border-none shadow-sm"
              >
                DISCOVER COLLECTION
              </Button>
            </div>
          ) : (
            cartItems.map((item) => {
              const key = getItemKey(item);
              const isChecked = selectedKeys.includes(key);

              return (
                <div key={key} className="py-3 flex gap-3 items-center group">
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => handleItemSelect(key, e.target.checked)}
                  />

                  {/* Product Thumbnail */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg bg-neutral-100 border border-neutral-200/80 shadow-2xs group-hover:scale-102 transition-transform"
                  />

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-serif font-bold text-neutral-900 uppercase line-clamp-1 tracking-wide">
                          {item.name}
                        </h4>
                        <button
                          onClick={() =>
                            onRemoveItem(item.id, item.size, item.color)
                          }
                          className="text-neutral-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <DeleteOutlined className="text-xs" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono mt-0.5">
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <StarFilled
                            style={{ color: "#fbbf24" }}
                            className="text-[10px]"
                          />
                          <span>
                            {item.rating ||
                              (4.7 + ((item.id || 1) % 4) * 0.1).toFixed(1)}
                          </span>
                        </div>
                        {item.size && (
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                            Color: {item.color}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-extrabold text-black font-mono mt-1">
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Controls & Line Total */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100/80">
                      <div className="flex items-center border border-neutral-200 rounded-md overflow-hidden bg-neutral-50">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1,
                            )
                          }
                          className="w-6 h-6 text-xs font-bold text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold font-mono text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity + 1,
                            )
                          }
                          className="w-6 h-6 text-xs font-bold text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-black text-black font-mono">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Compact Checkout Button */}
        {cartItems.length > 0 && (
          <div className="pt-3 border-t border-neutral-200/90 mt-2 bg-white space-y-2.5">
            {/* Promo Code Input Box */}
            <div className="flex gap-2">
              <Input
                prefix={<TagOutlined className="text-neutral-400 text-xs" />}
                placeholder="Promo Code (Try LUXE10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="text-xs uppercase h-8 rounded-lg"
              />
              <Button
                onClick={handleApplyPromo}
                className="bg-black hover:!bg-neutral-800 text-white text-xs font-bold uppercase h-8 px-4 rounded-lg border-none"
              >
                APPLY
              </Button>
            </div>

            {/* Price Calculations Summary */}
            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/70 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-bold text-black">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount (10% OFF):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Shipping:</span>
                <span className="font-bold text-black">
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-700">FREE</span>
                  ) : (
                    "$15.00"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-black pt-1.5 border-t border-neutral-200">
                <span>TOTAL:</span>
                <span className="text-base text-black">
                  $
                  {(
                    finalTotal + (subtotal >= freeShippingThreshold ? 0 : 15)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Compact & Elegant Proceed to Checkout Button */}
            <div className="flex justify-end pt-0.5">
              <Button
                type="primary"
                onClick={onProceedToCheckout}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                className="w-full bg-black hover:!bg-neutral-800 text-white font-extrabold text-xs tracking-widest uppercase h-9 rounded-lg shadow-md border-none transition-all cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
