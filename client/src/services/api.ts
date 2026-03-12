// Base URL for your API
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://api.lumierecosmetics.site/api";
// : "http://ec2-54-169-103-14.ap-southeast-1.compute.amazonaws.com:3000/api";
// Generic fetch function with error handling and retry logic
async function fetchAPI(endpoint: string, options?: RequestInit) {
  let attempt = 0;
  const maxRetries = 3;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (true) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        credentials: "include", // Ensure cookies are sent
        ...options,
      });

      // If server error (5xx), throw to trigger retry
      if (response.status >= 500) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        // Create error object for client errors (4xx)
        const error = new Error(data.message || "Something went wrong");
        throw error;
      }

      return data;
    } catch (error: any) {
      attempt++;

      // Determine if we should retry
      // Retry on network errors (TypeError) or Server Errors (5xx)
      // Do NOT retry on Client Errors (4xx) (which fall through to here but won't match the check below unless message was "Server Error")
      const isNetworkError = error instanceof TypeError;
      const isServerError =
        error.message && error.message.includes("Server Error");

      if (attempt <= maxRetries && (isNetworkError || isServerError)) {
        // Wait 1 second before retrying
        await delay(1000);
        continue;
      }

      console.error("API Error:", error);
      throw error;
    }
  }
}
// Product API functions
export const productAPI = {
  // Get all products
  getAll: async () => {
    return fetchAPI("/products");
  },
  // Get single product
  getById: async (id: string) => {
    return fetchAPI(`/products/${id}`);
  },
  // Create product
  create: async (productData: any) => {
    return fetchAPI("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },
  // Update product
  update: async (id: string, productData: any) => {
    return fetchAPI(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },
  // Delete product
  delete: async (id: string) => {
    return fetchAPI(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// Category API functions
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    return fetchAPI("/categories");
  },
  // Get single category
  getById: async (id: string) => {
    return fetchAPI(`/categories/${id}`);
  },
  // Create category
  create: async (categoryData: any) => {
    return fetchAPI("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },
  // Update category
  update: async (id: string, categoryData: any) => {
    return fetchAPI(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  },
  // Delete category
  delete: async (id: string) => {
    return fetchAPI(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// Upload API functions
export const uploadAPI = {
  // Upload image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  },

  // Upload mutiple images
  uploadImages: async (files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(`${API_URL}/upload/images`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  },

  // Upload texture
  uploadTexture: async (file: File) => {
    const formData = new FormData();
    formData.append("texture", file);

    const response = await fetch(`${API_URL}/upload/texture`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  },

  // Upload Model
  uploadProductModel: async (file: File) => {
    const formData = new FormData();
    formData.append("productModel", file);

    const response = await fetch(`${API_URL}/upload/model`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  },
};

// Order API functions
export const orderAPI = {
  // Create order (for logged in users)
  create: async (orderData: any) => {
    return fetchAPI("/orders/create", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },
  // Create guest order (for guests)
  createGuest: async (orderData: any) => {
    return fetchAPI("/orders/create-guest", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },
  // Get all orders (Admin)
  getAll: async () => {
    return fetchAPI("/orders");
  },
  // Get user orders
  getUserOrders: async () => {
    return fetchAPI("/orders/my-orders");
  },
  // Get single order
  getById: async (id: string) => {
    return fetchAPI(`/orders/${id}`);
  },
  // Update order status
  updateStatus: async (id: string, status: string) => {
    return fetchAPI(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// Cart API functions
export const cartAPI = {
  get: async () => fetchAPI("/cart"),
  add: async (productId: string, quantity: number = 1) =>
    fetchAPI("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),
  update: async (productId: string, quantity: number) =>
    fetchAPI("/cart/update", {
      method: "PUT",
      body: JSON.stringify({ productId, quantity }),
    }),
  remove: async (productId: string) =>
    fetchAPI(`/cart/${productId}`, { method: "DELETE" }),
  clear: async () => fetchAPI("/cart", { method: "DELETE" }),
};

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    return fetchAPI("/dashboard/stats");
  },
  // Get recent orders
  getRecentOrders: async (limit: number = 5) => {
    return fetchAPI(`/dashboard/recent-orders?limit=${limit}`);
  },
};

// User API functions
export const userAPI = {
  // Get all users
  getAllUsers: async () => {
    return fetchAPI("/users/");
  },
  // Get all customers
  getCustomers: async () => {
    return fetchAPI("/users/customers");
  },
  // Get pending users (Admin only)
  getPendingUsers: async () => {
    return fetchAPI("/users/pending-users");
  },
  // Accept pending user (Admin only)
  adminUserUpdate: async (id: string, data: any) => {
    return fetchAPI(`/users/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  // Delete a customer
  deleteCustomer: async (id: string) => {
    return fetchAPI(`/users/customers/${id}`, {
      method: "DELETE",
    });
  },
};

// Payment API functions
// export const paymentAPI = {
//   // Notify backend to simulate payment and trigger socket
//   notify: async (payload: {
//     merchant_id: string;
//     order_id: string;
//     payment_id: string;
//     payhere_amount: string;
//     payhere_currency: string;
//     status_code: number;
//   }) => {
//     return fetchAPI("/payment/notify", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     });
//   },
// };
export const paymentAPI = {
  // Notify backend to simulate payment and trigger socket
  notify: async (payload: {
    merchant_id: string;
    order_id: string;
    payment_id: string;
    payhere_amount: string;
    payhere_currency: string;
    status_code: number;
  }) => {
    const response = await fetch(`${API_URL}/payment/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Instead of parsing JSON, just check status
    if (!response.ok) {
      throw new Error(`Payment notify failed with status ${response.status}`);
    }

    // You can optionally get text if you want
    // const text = await response.text();
    // console.log("Notify response:", text);

    return; // no data returned
  },
};

// Texture API functions
export const textureAPI = {
  // Get all textures
  getAll: async () => {
    return fetchAPI("/textures");
  },
  // Get single texture
  getById: async (id: string) => {
    return fetchAPI(`/textures/${id}`);
  },
  // Create texture
  create: async (textureData: any) => {
    return fetchAPI("/textures", {
      method: "POST",
      body: JSON.stringify(textureData),
    });
  },
  // Update texture
  update: async (id: string, textureData: any) => {
    return fetchAPI(`/textures/${id}`, {
      method: "PUT",
      body: JSON.stringify(textureData),
    });
  },
  // Delete texture
  delete: async (id: string) => {
    return fetchAPI(`/textures/${id}`, {
      method: "DELETE",
    });
  },
};
