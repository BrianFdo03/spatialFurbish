const SceneObject = require("../models/SceneObject");
const RoomDesign = require("../models/RoomDesign");

// mutiple objects add
const addSceneObjects = async (req, res) => {
  try {
    const { designId } = req.params;
    const { objects } = req.body;

    const newObjects = await SceneObject.insertMany(
      objects.map((obj) => ({
        productId: obj.productId,
        position: obj.position,
        rotation: obj.rotation ?? 0,
        color: obj.color,
        texture: obj.texture,
        isPlaced: true,
        roomDesignId: designId,
      })),
    );

    await RoomDesign.findByIdAndUpdate(designId, {
      $push: { sceneObjects: { $each: newObjects.map((o) => o._id) } },
    });

    res.status(201).json(newObjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to bulk add scene objects" });
  }
};

// add single object
const addSceneObject = async (req, res) => {
  try {
    const { designId } = req.params;
    const { productId, position, rotation, color, texture } = req.body;

    const newObject = await SceneObject.create({
      productId,
      position,
      rotation,
      color,
      texture,
      isPlaced: true,
      roomDesignId: designId,
    });

    await RoomDesign.findByIdAndUpdate(designId, {
      $push: { sceneObjects: newObject._id },
    });

    res.status(201).json(newObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add scene object" });
  }
};

// update single object
const updateSceneObject = async (req, res) => {
  try {
    const { objectId } = req.params;
    const { position, rotation, color, texture } = req.body;

    const updated = await SceneObject.findByIdAndUpdate(
      objectId,
      { position, rotation, color, texture },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Scene object not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update scene object" });
  }
};

// delete single object
const deleteSceneObject = async (req, res) => {
  try {
    const { designId, objectId } = req.params;

    const deleted = await SceneObject.findByIdAndDelete(objectId);

    if (!deleted) {
      return res.status(404).json({ message: "Scene object not found" });
    }

    await RoomDesign.findByIdAndUpdate(designId, {
      $pull: { sceneObjects: deleted._id },
    });

    res.json({ message: "Scene object deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete scene object" });
  }
};

const getUnplacedSceneObjects = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const objects = await SceneObject.find({
      userId: userId,
      isPlaced: false,
      $or: [{ roomDesignId: { $exists: false } }, { roomDesignId: null }],
    }).populate("productId");

    res.json(objects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
};

module.exports = {
  addSceneObjects,
  addSceneObject,
  updateSceneObject,
  deleteSceneObject,
  getUnplacedSceneObjects,
};
