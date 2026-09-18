import React, { useState, useEffect } from "react";
import { Drawer, Button, Empty, Checkbox } from "antd";
import {
  HeartOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  CloseOutlined,
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
          <HeartOutlined style={{ fontSize: "20px", color: "#000000" }} />
          <span className="font-serif font-bold text-base uppercase tracking-wider text-black">
            YOUR WISHLIST ({wishlistItems.length})
          </span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={450}
      closeIcon={<CloseOutlined style={{ fontSize: "18px", color: "#000" }} />}
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
                onClick={onClose}
                className="mt-4 bg-black text-white font-bold text-xs uppercase"
              >
                EXPLORE COLLECTIONS
              </Button>
            </div>
          ) : (
            wishlistItems.map((item) => {
              const isChecked = selectedIds.includes(item.id);

              return (
                <div key={item.id} className="py-4 flex gap-3 items-center">
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) =>
                      handleItemSelect(item.id, e.target.checked)
                    }
                  />

                  {/* Thumbnail */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded bg-neutral-100 border border-neutral-200"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between h-20 py-0.5">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold font-serif text-black uppercase line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(item)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          title="Remove from wishlist"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>

                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                        {item.category?.name || "ALEXANDRE LUXE"}
                      </span>

                      <div className="text-xs font-extrabold text-black mt-0.5">
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
                      className="bg-black text-white hover:!bg-neutral-800 text-[10px] font-bold uppercase tracking-wider h-7 self-start"
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
              className="border-black text-black font-bold text-xs tracking-widest uppercase h-11"
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
