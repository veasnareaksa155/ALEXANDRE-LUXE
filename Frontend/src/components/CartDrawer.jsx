import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Progress, Empty, Checkbox } from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
  CloseOutlined,
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
      // Fallback
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
  const freeShippingThreshold = 200;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100),
  );

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "LUXE10") {
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
          <ShoppingOutlined style={{ fontSize: "20px" }} />
          <span className="font-serif font-bold text-base uppercase tracking-wider text-black">
            YOUR SHOPPING BAG (
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)})
          </span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={480}
      closeIcon={<CloseOutlined style={{ fontSize: "18px", color: "#000" }} />}
      className="cart-drawer"
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top Free Shipping Progress Bar */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-3">
          <div className="text-xs font-bold text-black mb-1 flex justify-between">
            <span>
              {subtotal >= freeShippingThreshold
                ? "🎉 YOU QUALIFY FOR FREE EXPRESS SHIPPING!"
                : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping`}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor="#000000"
          />
        </div>

        {/* Multi-select Header Controls */}
        {cartItems.length > 0 && (
          <div className="flex items-center justify-between bg-neutral-100 px-3 py-2 rounded-md mb-2 border border-neutral-200">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              className="text-xs font-bold text-black uppercase"
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
                className="text-xs font-bold uppercase rounded"
              >
                DELETE ({selectedKeys.length})
              </Button>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto pr-1 divide-y divide-neutral-100">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <Empty description="Your shopping bag is empty." />
              <Button
                onClick={onClose}
                className="mt-4 bg-black text-white font-bold text-xs uppercase"
              >
                START SHOPPING
              </Button>
            </div>
          ) : (
            cartItems.map((item) => {
              const key = getItemKey(item);
              const isChecked = selectedKeys.includes(key);

              return (
                <div key={key} className="py-4 flex gap-3 items-center">
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => handleItemSelect(key, e.target.checked)}
                  />

                  {/* Thumbnail */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded bg-neutral-100 border border-neutral-200"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold font-serif text-black uppercase line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() =>
                            onRemoveItem(item.id, item.size, item.color)
                          }
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
                        {item.size && (
                          <span className="mr-2">Size: {item.size}</span>
                        )}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>

                      <div className="text-xs font-extrabold text-black mt-0.5">
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-300 rounded overflow-hidden">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1,
                            )
                          }
                          className="px-2 py-0.5 text-xs font-bold bg-neutral-100 hover:bg-neutral-200"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">
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
                          className="px-2 py-0.5 text-xs font-bold bg-neutral-100 hover:bg-neutral-200"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-black font-sans">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-3 border-t border-neutral-200 mt-2 bg-white">
            {/* Promo Code Input */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Promo Code (Try LUXE10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="text-xs uppercase"
              />
              <Button
                onClick={handleApplyPromo}
                className="bg-black text-white text-xs font-bold uppercase"
              >
                APPLY
              </Button>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1 text-xs mb-3">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-bold text-black">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount (10% OFF):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Shipping:</span>
                <span className="font-bold text-black">
                  {subtotal >= freeShippingThreshold ? "FREE" : "$15.00"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-black pt-1 border-t border-neutral-200">
                <span>TOTAL:</span>
                <span>
                  $
                  {(
                    finalTotal + (subtotal >= freeShippingThreshold ? 0 : 15)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              onClick={onProceedToCheckout}
              className="bg-black text-white hover:!bg-neutral-800 font-bold text-xs tracking-widest uppercase h-12 rounded-md shadow-lg"
            >
              PROCEED TO CHECKOUT
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
