const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total revenue (sum of all completed orders)
    const orders = await Order.find({ status: { $ne: "Cancelled" } });

    const totalRevenue = orders.reduce((sum, order) => {
      // Remove $ sign and convert to number
      const amount = parseFloat(order.total.replace(/[$,]/g, "")) || 0;
      return sum + amount;
    }, 0);

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Get total customers count (excluding admin)
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Calculate growth percentages (comparing to previous month)
    // For demo purposes, using static values. You can implement actual calculations
    const stats = {
      totalRevenue: {
        value: totalRevenue,
        growth: "+20.1%", // Placeholder
      },
      totalOrders: {
        value: totalOrders,
        growth: "+15.2%", // Placeholder
      },
      totalCustomers: {
        value: totalCustomers,
        growth: "+12.5%", // Placeholder
      },
      totalProducts: {
        value: totalProducts,
        growth: "+4.5%", // Placeholder
      },
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Format the orders for frontend
    const formattedOrders = recentOrders.map((order) => {
      // Calculate time ago
      const timeAgo = getTimeAgo(order.createdAt);

      // Get first product name
      const productName =
        order.items && order.items.length > 0
          ? order.items[0].name
          : "Multiple Items";

      return {
        id: order.orderId,
        customer: order.customer,
        product: productName,
        date: timeAgo,
        amount: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus || 'Pending'
      };
    });

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const orderDate = new Date(date);
  const diffInMs = now - orderDate;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return orderDate.toLocaleDateString();
  }
}
