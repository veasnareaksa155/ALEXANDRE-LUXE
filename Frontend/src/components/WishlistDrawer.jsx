import React, { useState, useEffect } from "react";
import { Drawer, Button, Empty, Checkbox } from "antd";
import {
  HeartOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  CloseOutlined,
  StarFilled,
} from "@ant-design/icons";

const WishlistDrawer = ({
  open,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onBulkRemoveWishlist,
  onAddToCart,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  // Reset selection when drawer opens or items change
  useEffect(() => {
    setSelectedIds([]);
  }, [open, wishlistItems.length]);

  const allIds = wishlistItems.map((item) => item.id);
  const isAllSelected =
    allIds.length > 0 && selectedIds.length === allIds.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < allIds.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleItemSelect = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (onBulkRemoveWishlist) {
      onBulkRemoveWishlist(selectedIds);
    } else {
      selectedIds.forEach((id) => {
        const item = wishlistItems.find((i) => i.id === id);
        if (item) onRemoveFromWishlist(item);
      });
    }
    setSelectedIds([]);
  };

  const handleBulkAddToCart = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => {
      const item = wishlistItems.find((i) => i.id === id);
      if (item) {
        onAddToCart(item);
        if (onRemoveFromWishlist) onRemoveFromWishlist(item);
      }
    });
    setSelectedIds([]);
  };

  return (
    <Drawer
      title={
        <div className="flex items-center space-x-2">
          <HeartOutlined style={{ fontSize: "18px", color: "#000000" }} />
          <span className="font-serif font-bold text-sm sm:text-base uppercase tracking-wider text-black">
            YOUR WISHLIST
          </span>
          <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            {wishlistItems.length}
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
      className="wishlist-drawer"
    >
      <div className="flex flex-col h-full justify-between">
        {/* Multi-select Header Bar */}
        {wishlistItems.length > 0 && (
          <div className="flex items-center justify-between bg-neutral-100 px-3 py-2 rounded-md mb-3 border border-neutral-200">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              className="text-xs font-bold text-black uppercase"
            >
              Select All ({wishlistItems.length})
            </Checkbox>

            {selectedIds.length > 0 && (
              <div className="flex gap-1.5">
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={handleBulkDelete}
                  className="text-xs font-bold uppercase rounded"
                >
                  DELETE ({selectedIds.length})
                </Button>
                <Button
                  type="primary"
                  size="small"
                  icon={<ShoppingOutlined />}
                  onClick={handleBulkAddToCart}
                  className="bg-black text-white hover:!bg-neutral-800 text-xs font-bold uppercase rounded border-none"
                >
                  ADD ({selectedIds.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto pr-1 divide-y divide-neutral-100">
          {wishlistItems.length === 0 ? (
            <div className="py-20 text-center">
              <Empty
                description={
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Your wishlist is currently empty.
                  </span>
                }
              />
              <Button
                type="primary"
                onClick={onClose}
                className="mt-4 bg-black text-white hover:!bg-neutral-800 hover:!text-white font-bold text-xs uppercase tracking-widest h-10 px-6 rounded-lg border-none shadow-sm transition-all duration-200 cursor-pointer"
              >
                EXPLORE COLLECTIONS
              </Button>
            </div>
          ) : (
            wishlistItems.map((item) => {
              const isChecked = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="py-3 flex gap-3.5 items-stretch group border-b border-neutral-100/80 last:border-none"
                >
                  {/* Selection Checkbox (Vertically Centered with Image like Bag) */}
                  <div className="flex items-center justify-center self-center shrink-0 my-auto">
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) =>
                        handleItemSelect(item.id, e.target.checked)
                      }
                      className="flex items-center justify-center m-0 p-0 [&_.ant-checkbox]:top-0"
                    />
                  </div>

                  {/* Thumbnail Container */}
                  <div className="w-20 rounded-xl bg-neutral-100 border border-neutral-200/80 overflow-hidden shrink-0 self-stretch flex items-center justify-center shadow-2xs">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-center gap-1 mb-0.5">
                        <h4 className="text-xs font-bold font-serif text-black uppercase line-clamp-1 tracking-wide m-0 leading-none">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(item)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer flex items-center justify-center"
                          title="Remove from wishlist"
                        >
                          <DeleteOutlined className="text-xs" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                        <span className="uppercase tracking-widest truncate">
                          {item.category?.name || "ALEXANDRE LUXE"}
                        </span>
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
                      </div>

                      <div className="text-xs font-extrabold text-black mt-1">
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </div>

                    {/* Move to Cart Button */}
                    <Button
                      type="primary"
                      size="small"
                      icon={<ShoppingOutlined />}
                      onClick={() => {
                        onAddToCart(item);
                        onRemoveFromWishlist(item);
                      }}
                      className="bg-black text-white hover:!bg-neutral-800 hover:!text-white text-[10px] font-bold uppercase tracking-wider h-7 px-3 rounded-lg border-none shadow-xs mt-2 self-start transition-all cursor-pointer"
                    >
                      ADD TO BAG
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="pt-3 border-t border-neutral-200 mt-2">
            <Button
              block
              onClick={onClose}
              className="border-black text-black hover:!bg-black hover:!text-white hover:!border-black font-bold text-xs tracking-widest uppercase h-11 rounded-lg transition-all cursor-pointer"
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default WishlistDrawer;
