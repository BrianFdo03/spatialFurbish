const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all customers with their order stats
exports.getAllCustomers = async (req, res) => {
  try {
    // Get all users with role 'customer'
    const users = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // For each user, get their order count and total spent
    const customersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get orders for this user
        const orders = await Order.find({ userId: user._id.toString() });

        // Calculate total orders
        const orderCount = orders.length;

        // Calculate total spent (excluding cancelled orders)
        const totalSpent = orders
          .filter((order) => order.status !== "Cancelled")
          .reduce((sum, order) => {
            const amount = parseFloat(order.total.replace(/[$,]/g, "")) || 0;
            return sum + amount;
          }, 0);

        return {
          id: user._id,
          name: user.fullName,
          email: user.email,
          joined: user.createdAt,
          orders: orderCount,
          spent: totalSpent,
          isGuest: user.isGuest || false,
        };
      }),
    );

    res.json(customersWithStats);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get pending users for role access
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: false })
      .select("_id fullName email role verified")
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);
  } catch (error) {
    console.error("Error fetching unverified users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User updates (Admin)
exports.adminUserUpdate = async (req, res) => {
  try {
    const { id } = req.params; // the user to update

    const allFields = Object.keys(User.schema.paths);
    const userToUpdate = await User.findById(id);

    // exclude fields you don't want admins to update manually
    const excludedFields = ["_id", "createdAt", "updatedAt", "__v"];
    const allowedUpdates = allFields.filter(
      (field) => !excludedFields.includes(field),
    );

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    if (req.body.password && req.body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updates.password = hashedPassword;
    }

    if (
      updates.role &&
      !["customer", "staff", "admin"].includes(updates.role)
    ) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    if (
      updates.verified !== undefined &&
      typeof updates.verified !== "boolean"
    ) {
      return res.status(400).json({ message: "Verified must be a boolean" });
    }

    if (
      req.user._id.equals(userToUpdate._id) &&
      updates.role &&
      updates.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You cannot remove your own admin role" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, // return the updated document
      runValidators: true, // validate updates
    }).select("-password"); // remove password from the response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    // Emit socket event for product update
    const io = req.app.get("socketio");
    if (io) {
      io.emit("user:deleted", id);
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

