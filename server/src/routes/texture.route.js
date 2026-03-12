const express = require("express");
const router = express.Router();
const Texture = require("../models/Texture");
const { protectRoute } = require("../middleware/auth.middleware");
const {
  getAllTextures,
  getTextureByID,
  createTexture,
  updateTexture,
  deleteTexture,
} = require("../controllers/texture.controller");
router.get("/", getAllTextures); // GET all textures    // URL: GET /api/textures

router.get("/:id", getTextureByID); // GET single texture by ID     // URL: GET /api/textures/:id

router.post("/", protectRoute(["admin", "staff"]), createTexture); // POST create new texture   // URL: POST /api/textures

router.put("/:id", protectRoute(["admin", "staff"]), updateTexture); // PUT update texture  // URL: PUT /api/textures/:id

router.delete("/:id", protectRoute("admin", "staff"), deleteTexture); // DELETE texture     // URL: DELETE /api/textures/:id
module.exports = router;
