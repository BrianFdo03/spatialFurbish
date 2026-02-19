const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protectRoute } = require("../middleware/auth.middleware");

// Get all users (Admin only)
router.get("/", protectRoute(["admin"]), userController.getAllUsers);

// Get all customers (Admin only)
router.get(
  "/customers",
  protectRoute(["admin"]),
  userController.getAllCustomers
);

// Get pending users (Admin only)
router.get(
  "/pending-users",
  protectRoute(["admin"]),
  userController.getPendingUsers
);

// Accept a pending user (Admin only)
router.put(
  "/customers/:id",
  protectRoute(["admin"]),
  userController.adminUserUpdate
);

// Delete a customer (Admin only)
router.delete(
  "/customers/:id",
  protectRoute(["admin"]),
  userController.deleteCustomer
);

module.exports = router;
