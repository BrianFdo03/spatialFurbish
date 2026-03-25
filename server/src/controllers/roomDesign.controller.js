const RoomDesign = require("../models/RoomDesign");
const SceneObject = require("../models/SceneObject");
const mongoose = require("mongoose");

// CREATE room design — optionally with initial scene objects
const createRoomDesign = async (req, res) => {
  try {
    const { name, roomType, sceneObjects, userId, previewImage } = req.body;

    const design = await RoomDesign.create({
      name,
      roomType,
      user_id: userId,
      previewImage,
      sceneObjects: [],
    });

    // If scene objects were provided
    if (sceneObjects?.length > 0) {
      const newObjects = await SceneObject.insertMany(
        sceneObjects.map((obj) => ({
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
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const designs = await RoomDesign.find({
      user_id: userId,
    }).sort({ createdAt: -1 });

    res.json(designs);
  } catch (error) {
    console.error(error);
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
    const { name, roomType, updatedSceneObjects, previewImage } = req.body;

    const design = await RoomDesign.findById(id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    if (name) design.name = name;
    if (roomType) design.roomType = roomType;
    if (previewImage) design.previewImage = previewImage;
    // await design.save();

    // scene object updates
    if (updatedSceneObjects?.length > 0) {
      const sceneObjectIds = [];

      await Promise.all(
        updatedSceneObjects.map(async (obj) => {
          if (obj.sceneObjectId && obj.productId) {
            const isValidObjectId = mongoose.Types.ObjectId.isValid(
              obj.sceneObjectId,
            );
            if (isValidObjectId) {
              // If sceneObjectId is provided, update the existing scene object
              const existingObject = await SceneObject.findById(
                obj.sceneObjectId,
              );
              if (existingObject) {
                // Update the existing scene object
                existingObject.position = obj.position;
                existingObject.rotation = obj.rotation;
                existingObject.color = obj.color;
                existingObject.texture = obj.texture;
                existingObject.isPlaced =
                  obj.isPlaced ?? existingObject.isPlaced;
                existingObject.roomDesignId = design._id;
                await existingObject.save();

                sceneObjectIds.push(existingObject._id);
              }
            } else {
              console.log(
                `Converting UUID to ObjectId for sceneObject: ${obj.sceneObjectId}`,
              );
              const newSceneObject = new SceneObject({
                productId: obj.productId, // Create using the provided productId
                position: obj.position,
                rotation: obj.rotation,
                color: obj.color,
                texture: obj.texture,
                isPlaced: obj.isPlaced,
                roomDesignId: design._id, // Associate with the current room design
              });
              await newSceneObject.save(); // Save the new scene object
              // Add the new scene object's ID to the room design's sceneObjects array
              console.log(`new scene object :${newSceneObject._id} `);
              sceneObjectIds.push(newSceneObject._id);
            }
          } else {
            console.error(`Invalid object data: ${JSON.stringify(obj)}`);
            res.status(500).json({ message: "Invalid object" });
          }
        }),
      );
      // NO DUPLICATES
      design.sceneObjects = [
        ...new Set([
          ...design.sceneObjects.map((id) => id.toString()),
          ...sceneObjectIds.map((id) => id.toString()),
        ]),
      ];
      await design.save();
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
