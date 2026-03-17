const express = require("express");
const router = express.Router();
const { updateUserProfile } = require("../controllers/profile.controller");
const { protectRoute, checkAuth } = require("../middleware/auth.middleware"); // Adjust path if needed

// The actual route: PUT /api/profile
router.put("/", checkAuth, updateUserProfile);
// router.put("/", checkAuth, updateUserProfile);

module.exports = router;