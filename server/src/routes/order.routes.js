const express = require("express");
const {
  createOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  createGuestOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { protectRoute, checkAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", checkAuth, createOrder);
router.post("/create-guest", createGuestOrder); // No auth required for guest checkout
router.get("/", protectRoute(["admin", "staff"]), getOrders);
router.get("/my-orders", checkAuth, getUserOrders);
router.get("/:id", protectRoute, getOrderById);
router.put("/:id/status", protectRoute(["admin", "staff"]), updateOrderStatus); // Update order status

module.exports = router;
