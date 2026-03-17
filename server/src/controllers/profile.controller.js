const User = require("../models/User"); // Ensure path is correct (User vs user.model)
const bcrypt = require("bcryptjs"); // Ensure bcryptjs is installed

// @desc    Update logged-in user profile
// @route   PUT /api/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    // 1. Find the logged-in user (req.user._id comes from auth middleware)
    const user = await User.findById(req.user._id);

    if (user) {
      // 2. Update fullName (Frontend sends 'username', DB uses 'fullName')
      if (req.body.username) {
        user.fullName = req.body.username;
      }

      // 3. Update password if provided
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      // 4. Save updates
      const updatedUser = await user.save();

      // 5. Send back updated info
      res.json({
        _id: updatedUser._id,
        username: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};