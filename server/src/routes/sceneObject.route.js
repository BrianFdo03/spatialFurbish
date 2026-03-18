const {
  addSceneObjects,
  addSceneObject,
  updateSceneObject,
  deleteSceneObject,
} = require("../controllers/sceneObject.controller");
const express = require("express");

const router = express.Router();

router.post("/:designId/objects", addSceneObjects);
router.post("/:designId/object", addSceneObject);
router.put("/:designId/object/:objectId", updateSceneObject);
router.delete("/:designId/objects/:objectId", deleteSceneObject);

module.exports = router;
