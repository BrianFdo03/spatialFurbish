const {
  signup,
  login,
  logout,
  updateProfile,
  checkEmail,
} = require("../controllers/auth.controller");

const express = require("express");
const { protectRoute, checkAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/check-email", checkEmail);
router.put("/update-profile", protectRoute, updateProfile);

// To check users when they refresh the page or when they enter site
router.get("/check", checkAuth, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    verified: req.user.verified,
  });
});

module.exports = router;
