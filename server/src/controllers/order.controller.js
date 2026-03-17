const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

// Helper to generate Order ID
const generateOrderId = () => {
  return `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
};

const createOrder = async (req, res) => {
  try {
    const { customer, total, paymentId } = req.body;
    const userId = req.user._id;

    if (!customer || !total || !paymentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Fetch User's Cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Create Order from Cart Items
    const newOrder = new Order({
      orderId: generateOrderId(),
      userId,
      customer,
      items: cart.items, // Snapshot of items
      totalCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      total,
      paymentId,
    });

    await newOrder.save();

    // 3. Clear Cart
    cart.items = [];
    await cart.save();

    // 4. Emit new order event
    const io = req.app.get("socketio");
    if (io) {
      io.emit("new-order", newOrder);
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    // Return full order objects so frontend can display details in dialog
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find by internal _id OR custom orderId
    const order = await Order.findOne({
      $or: [{ _id: id }, { orderId: id }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Guest checkout - creates order for guest user (without authentication)
const createGuestOrder = async (req, res) => {
  try {
    const { customer, email, total, paymentId, items } = req.body;

    if (
      !customer ||
      !email ||
      !total ||
      !paymentId ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Check if user exists with this email
    let user = await User.findOne({ email: email.toLowerCase() });

    // 2. If no user exists, create a guest user
    if (!user) {
      user = new User({
        fullName: customer,
        email: email.toLowerCase(),
        isGuest: true,
        // No password for guest users
      });
      await user.save();
    } else if (!user.isGuest && user.password) {
      // User already exists with password (logged in user trying to checkout as guest)
      // This shouldn't happen in normal flow, but handle it gracefully
      return res.status(400).json({
        message:
          "An account with this email already exists. Please login to continue.",
      });
    }
    // If user exists and is a guest, we'll use the existing account

    // 3. Create Order
    const newOrder = new Order({
      orderId: generateOrderId(),
      userId: user._id.toString(),
      customer,
      items: items, // Frontend will send cart items since guest doesn't have cart in DB
      totalCount: items.reduce((acc, item) => acc + item.quantity, 0),
      total,
      paymentId,
    });

    await newOrder.save();

    // 4. Emit new order event
    const io = req.app.get("socketio");
    if (io) {
      io.emit("new-order", newOrder);
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating guest order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Validate status
    const validStatuses = [
      "Processing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update order
    const order = await Order.findOne({
      $or: [{ _id: id }, { orderId: id }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  createGuestOrder,
  updateOrderStatus,
};
