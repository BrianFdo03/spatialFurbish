const mongoose = require("mongoose");

// Define the structure of a RoomDesign
const roomDesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User collection
      ref: "User", // Assuming the name of the User model is 'User'
      required: true,
    },
    sceneObjects: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to SceneObject collection
        ref: "SceneObject", // Assuming the name of the SceneObject model is 'SceneObject'
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// Create and export the model
module.exports = mongoose.model("RoomDesign", roomDesignSchema);
