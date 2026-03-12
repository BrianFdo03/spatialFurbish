const mongoose = require("mongoose");

const TextureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    texture: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Texture", TextureSchema);
