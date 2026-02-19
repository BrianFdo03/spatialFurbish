const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = require("../controllers/cart.controller");
const { protectRoute, checkAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", checkAuth, getCart);
router.post("/add", checkAuth, addToCart);
router.put("/update", checkAuth, updateQuantity);
router.delete("/:productId", checkAuth, removeFromCart);
router.delete("/", checkAuth, clearCart);

module.exports = router;
