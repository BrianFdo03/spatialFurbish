const Cart = require("../models/Cart");
const Product = require("../models/Product");
const SceneObject = require("../models/SceneObject");

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, texture, color } = req.body;

    const product =
      await Product.findById(productId).populate("allowedTextures");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product is active
    if (!product.isActive) {
      return res.status(400).json({ message: "Product is not available" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const requestedQty = quantity || 1;

    // Define your fallbacks
    const fallbackColor = product.allowedColors?.[0] || "#3B82F6";
    const fallbackTexture = product.allowedTextures?.[0]?.texture || ""; // Accessing the .texture field

    const finalColor = color || fallbackColor;
    const finalTexture = texture?.texture ? texture.texture : fallbackTexture;

    // Match item by both productId and optionally the chosen texture and color
    const itemIndex = cart.items.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        (texture ? p.texture && p.texture.name === texture.name : !p.texture) &&
        (color ? p.color === color : !p.color),
    );

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      const newQuantity = cart.items[itemIndex].quantity + requestedQty;

      // Check if new quantity exceeds available stock
      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Cannot add to cart. Only ${product.stock} items available in stock. You already have ${cart.items[itemIndex].quantity} in your cart.`,
          availableStock: product.stock,
          currentInCart: cart.items[itemIndex].quantity,
        });
      }

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Product does not exist in cart, add new item
      // Check if requested quantity exceeds available stock
      if (requestedQty > product.stock) {
        return res.status(400).json({
          message: `Cannot add to cart. Only ${product.stock} items available in stock.`,
          availableStock: product.stock,
        });
      }

      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        image:
          product.images && product.images.length > 0 ? product.images[0] : "",
        texture: texture || null,
        color: color || null,
        quantity: requestedQty,
      });

      const sceneObject = new SceneObject({
        productId: product._id,
        position: { x: 0, y: 0 }, // default position
        rotation: 0, // default rotation
        color: finalColor,
        texture: finalTexture,
        isPlaced: false,
        roomDesignId: null,
        userId: userId, // Only for cart added items, not associated with any design
      });

      await sceneObject.save();
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { textureName, color } = req.body; // Use body for texture/color since we added it to identify uniquely

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => {
      if (item.productId.toString() !== productId) return true;
      if (textureName && item.texture?.name !== textureName) return true;
      if (color && item.color !== color) return true;
      // If it matched the productId AND the provided texture and color, filter it out
      return false;
    });
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, texture, color } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        (texture ? p.texture && p.texture.name === texture.name : !p.texture) &&
        (color ? p.color === color : !p.color),
    );

    if (itemIndex > -1) {
      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        // Check stock availability before updating
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        if (!product.isActive) {
          return res.status(400).json({ message: "Product is not available" });
        }

        if (quantity > product.stock) {
          return res.status(400).json({
            message: `Cannot update quantity. Only ${product.stock} items available in stock.`,
            availableStock: product.stock,
          });
        }

        cart.items[itemIndex].quantity = quantity;
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
};
