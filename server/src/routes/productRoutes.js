const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protectRoute } = require("../middleware/auth.middleware");
// GET all products
// URL: GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    }); // Newest first

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
});
// GET single product by ID
// URL: GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("allowedTextures");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
});
// POST create new product
// URL: POST /api/products
router.post("/", protectRoute(["admin", "staff"]), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

    const io = req.app.get("socketio");
    if (io) {
      io.emit("product:created", product);
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
});
// PUT update product
// URL: PUT /api/products/:id
router.put("/:id", protectRoute(["admin", "staff"]), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc, validate
    );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Emit socket event for product update
        const io = req.app.get('socketio');
        if (io) {
            io.emit('product:updated', product);
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
});
// DELETE product
// URL: DELETE /api/products/:id
router.delete("/:id", protectRoute("admin", "staff"), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Emit socket event for product deletion
        const io = req.app.get('socketio');
        if (io) {
            io.emit('product:deleted', { _id: req.params.id });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
});
module.exports = router;
