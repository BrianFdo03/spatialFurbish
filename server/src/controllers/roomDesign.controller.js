const RoomDesign = require("../models/RoomDesign");
const SceneObject = require("../models/SceneObject");

// CREATE room design — optionally with initial scene objects
const createRoomDesign = async (req, res) => {
  try {
    const { name, roomType, objects } = req.body;

    const design = await RoomDesign.create({
      name,
      roomType,
      user_id: req.user._id,
      sceneObjects: [],
    });

    // If scene objects were provided
    if (objects?.length > 0) {
      const newObjects = await SceneObject.insertMany(
        objects.map((obj) => ({
          productId: obj.productId,
          position: obj.position,
          rotation: obj.rotation,
          color: obj.color,
          texture: obj.texture,
          isPlaced: true,
          roomDesignId: design._id,
        })),
      );

      design.sceneObjects = newObjects.map((o) => o._id);
      await design.save();
    }

    res.status(201).json(design);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create room design" });
  }
};

// GET all designs for logged-in user
const getUserDesigns = async (req, res) => {
  try {
    const designs = await RoomDesign.find({
      user_id: req.user._id,
    }).sort({ createdAt: -1 });

    if (designs.length === 0) {
      return res.status(404).json({ message: "No designs found" });
    }

    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch designs" });
  }
};

// GET design with objects
const getRoomDesignById = async (req, res) => {
  try {
    const design = await RoomDesign.findById(req.params.id).populate({
      path: "sceneObjects",
      populate: {
        path: "productId",
      },
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json(design);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch design" });
  }
};

// UPDATE room design
const updateRoomDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roomType, updatedObjects } = req.body;

    const design = await RoomDesign.findById(id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    if (name) design.name = name;
    if (roomType) design.roomType = roomType;
    await design.save();

    // scene object updates
    if (updatedObjects?.length > 0) {
      await Promise.all(
        updatedObjects.map((obj) =>
          SceneObject.findByIdAndUpdate(
            obj._id,
            {
              position: obj.position,
              rotation: obj.rotation,
              color: obj.color,
              texture: obj.texture,
            },
            { new: true },
          ),
        ),
      );
    }

    res.json({ message: "Room design updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update room design" });
  }
};

// DELETE design and all its scene objects
const deleteRoomDesign = async (req, res) => {
  try {
    const design = await RoomDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    // Delete scene objects first
    if (design.sceneObjects?.length > 0) {
      await SceneObject.deleteMany({ _id: { $in: design.sceneObjects } });
    }

    await RoomDesign.findByIdAndDelete(req.params.id);

    res.json({ message: "Design deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete design" });
  }
};

module.exports = {
  createRoomDesign,
  getUserDesigns,
  getRoomDesignById,
  updateRoomDesign,
  deleteRoomDesign,
};
