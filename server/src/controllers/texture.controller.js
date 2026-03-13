const Texture = require("../models/Texture");
const { protectRoute } = require("../middleware/auth.middleware");

const getAllTextures = async (req, res) => {
  try {
    const textures = await Texture.find().sort({
      createdAt: -1,
    }); // Newest first

    res.json({
      success: true,
      count: textures.length,
      data: textures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching textures",
      error: error.message,
    });
  }
};

const getTextureByID = async (req, res) => {
  try {
    const texture = await Texture.findById(req.params.id);

    if (!texture) {
      return res.status(404).json({
        success: false,
        message: "Texture not found",
      });
    }

    res.json({
      success: true,
      data: texture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching texture",
      error: error.message,
    });
  }
};

const createTexture = async (req, res) => {
  try {
    const lastTexture = await Texture.findOne().sort({ textureId: -1 });

    let nextId = 1;

    if (lastTexture) {
      nextId = lastTexture.textureId + 1;
    }

    const texture = new Texture({
      ...req.body,
      textureId: nextId,
    });

    await texture.save();

    res.status(201).json({
      success: true,
      message: "Texture created successfully",
      data: texture,
    });

    // Emit socket event for new texture
    // const io = req.app.get("socketio");
    // if (io) {
    //   io.emit("texture:created", texture);
    // }
  } catch (error) {
    console.error("CREATE TEXTURE ERROR:", error);

    res.status(400).json({
      success: false,
      message: "Error creating texture",
      error: error.message,
    });
  }
};

const updateTexture = async (req, res) => {
  try {
    const texture = await Texture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }, // Return updated doc, validate
    );

    if (!texture) {
      return res.status(404).json({
        success: false,
        message: "Texture not found",
      });
    }

    // Emit socket event for texture update
    // const io = req.app.get("socketio");
    // if (io) {
    //   io.emit("texture:updated", texture);
    // }

    res.json({
      success: true,
      message: "texture updated successfully",
      data: texture,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating texture",
      error: error.message,
    });
  }
};

const deleteTexture = async (req, res) => {
  try {
    const texture = await Texture.findByIdAndDelete(req.params.id);

    if (!texture) {
      return res.status(404).json({
        success: false,
        message: "Texture not found",
      });
    }

    // Emit socket event for texture deletion
    // const io = req.app.get("socketio");
    // if (io) {
    //   io.emit("texture:deleted", { _id: req.params.id });
    // }

    res.json({
      success: true,
      message: "Texture deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting texture",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTextures,
  getTextureByID,
  createTexture,
  updateTexture,
  deleteTexture,
};
