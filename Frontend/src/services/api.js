import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://alexandre-luxe.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Resilient native fetch helper (bypasses buggy browser extension XHR monkey-patches)
const requestFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const fetchCategories = async () => {
  try {
    const data = await requestFetch("/categories");
    if (data && data.data) {
      try {
        localStorage.setItem("lx_cached_categories", JSON.stringify(data.data));
      } catch (e) {}
      return data.data;
    }
  } catch (error) {
    console.warn("Fetch categories via fetch failed, trying fallback:", error);
    try {
      const response = await api.get("/categories");
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (e) {}
    try {
      const cached = localStorage.getItem("lx_cached_categories");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
  }
  return [];
};

export const createCategory = async (categoryData) => {
  try {
    return await requestFetch("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  } catch (error) {
    const response = await api.post("/categories", categoryData);
    return response.data;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    return await requestFetch(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  } catch (error) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  }
};

export const deleteCategory = async (id) => {
  try {
    return await requestFetch(`/categories/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export const fetchProducts = async (params = {}) => {
  try {
    let queryString = "";
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      queryString = `?${searchParams.toString()}`;
    }
    const data = await requestFetch(`/products${queryString}`);
    if (data && data.data) {
      try {
        if (!params || Object.keys(params).length === 0) {
          localStorage.setItem("lx_cached_products", JSON.stringify(data.data));
        }
      } catch (e) {}
      return data.data;
    }
  } catch (error) {
    console.warn("Fetch products via fetch failed, trying fallback:", error);
    try {
      const response = await api.get("/products", { params });
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (e) {}
    try {
      const cached = localStorage.getItem("lx_cached_products");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
  }
  return [];
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching product #${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product #${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product #${id}:`, error);
    throw error;
  }
};

export const submitOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};

export const fetchOrders = async (userEmail = null) => {
  try {
    const url = userEmail
      ? `/orders?email=${encodeURIComponent(userEmail)}`
      : "/orders";
    const response = await api.get(url);
    if (response.data && response.data.data) {
      if (userEmail) {
        try {
          localStorage.setItem(
            `lx_cached_orders_${userEmail}`,
            JSON.stringify(response.data.data),
          );
        } catch (e) {}
      }
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (userEmail) {
      try {
        const cached = localStorage.getItem(`lx_cached_orders_${userEmail}`);
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order #${id} status:`, error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order #${id}:`, error);
    throw error;
  }
};

// User Management API Functions
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user #${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user #${id}:`, error);
    throw error;
  }
};

// Bakong KHQR Payment API Functions
export const generateBakongKhqr = async (orderId, amount, currency = "USD") => {
  try {
    const response = await api.post("/bakong/generate-khqr", {
      order_id: orderId,
      amount,
      currency,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating Bakong KHQR:", error);
    throw error;
  }
};

export const checkBakongPaymentStatus = async (md5, orderId = null) => {
  try {
    const response = await api.post("/bakong/check-status", {
      md5,
      order_id: orderId,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking Bakong payment status:", error);
    throw error;
  }
};

export default api;
