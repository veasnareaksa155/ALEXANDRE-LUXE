/**
 * Delivery & Shipping Fee Configuration Service
 * Manages store delivery prices and free shipping thresholds
 */

export const getDeliverySettings = () => {
  try {
    const saved = localStorage.getItem("lx_delivery_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.standardDeliveryFee !== "undefined") {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse local delivery settings:", e);
  }

  return {
    standardDeliveryFee: 2.0,
    expressDeliveryFee: 5.0,
    freeShippingThreshold: 50.0,
    currencySymbol: "$",
    deliveryNotes:
      "Phnom Penh Express (1-2 Hours) & Nationwide Delivery (24 Hours)",
  };
};

export const saveDeliverySettings = (settings) => {
  try {
    const config = {
      standardDeliveryFee: Number(settings.standardDeliveryFee || 0),
      expressDeliveryFee: Number(settings.expressDeliveryFee || 0),
      freeShippingThreshold: Number(settings.freeShippingThreshold || 0),
      currencySymbol: settings.currencySymbol || "$",
      deliveryNotes:
        settings.deliveryNotes || "Phnom Penh Express & Nationwide Delivery",
    };
    localStorage.setItem("lx_delivery_settings", JSON.stringify(config));
    return config;
  } catch (e) {
    console.error("Failed to save delivery settings:", e);
    return null;
  }
};
