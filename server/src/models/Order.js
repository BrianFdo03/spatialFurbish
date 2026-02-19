const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // Changed from simple Number to Array of Objects
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalCount: {
      // Helper to store total number of items if needed for easy query
      type: Number,
      default: 0,
    },
    total: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Processing",
        "Success",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },
    paymentStatus: {
      type: String,
      enum: ["Success", "Pending", "Failed", "Cancelled", "Charged Back"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
