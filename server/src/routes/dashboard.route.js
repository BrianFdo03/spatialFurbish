const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { protectRoute } = require("../middleware/auth.middleware");

// Protect all dashboard routes (only authenticated admins should access)
router.get(
  "/stats",
  protectRoute(["admin", "staff"]),
  dashboardController.getDashboardStats
);
router.get(
  "/recent-orders",
  protectRoute(["admin", "staff"]),
  dashboardController.getRecentOrders
);

module.exports = router;
