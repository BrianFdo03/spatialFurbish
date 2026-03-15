const mongoose = require("mongoose");
// Define the structure of a product
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String, // Changed from ObjectId to String to match MongoDB data
      required: true,
    },
    productModel: {
      type: String,
      required: true,
    },
    allowedColors: [
      {
        type: String,
      },
    ],

    allowedTextures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Texture",
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);
// Create and export the model
module.exports = mongoose.model("Product", productSchema);
