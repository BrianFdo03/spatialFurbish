const mongoose = require("mongoose");

const sceneObjectSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  position: { x: Number, y: Number },
  rotation: Number,
  color: String, // e.g., '#FF0000'
  texture: String,
  isPlaced: Boolean,
  roomDesignId: { type: mongoose.Schema.Types.ObjectId, ref: "RoomDesign" },
  userId: String,
});

module.exports = mongoose.model("SceneObject", sceneObjectSchema);
