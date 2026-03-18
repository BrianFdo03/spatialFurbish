const express = require("express");
const {
  createRoomDesign,
  getUserDesigns,
  getRoomDesignById,
  updateRoomDesign,
  deleteRoomDesign,
} = require("../controllers/roomDesign.controller");

const router = express.Router();

router.post("/", createRoomDesign);
router.get("/", getUserDesigns);
router.get("/:id", getRoomDesignById);
router.put("/:id", updateRoomDesign);
router.delete("/:id", deleteRoomDesign);

module.exports = router;
