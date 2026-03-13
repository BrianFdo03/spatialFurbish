const sceneObjectSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  position: { x: Number, y: Number },
  angle: Number,
  color: String, // e.g., '#FF0000'
  texture: String, // e.g., 'wood.jpg'
  isPlaced: Boolean,
  roomDesignId: { type: mongoose.Schema.Types.ObjectId, ref: "RoomDesign" },
});

const SceneObject = mongoose.model("SceneObject", sceneObjectSchema);
