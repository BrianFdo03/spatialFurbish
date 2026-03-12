const { cloudinary } = require("../config/cloudinary");
const { generateToken } = require("../lib/utils");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  let role = "customer";
  let verified = true;
  let approvalMessage = null;

  try {
    const { fullName, email, password, convertGuestAccount } = req.body;

    // 1️⃣ Check if any field is missing or empty
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }

    // 2️⃣ Check password length (6–20 characters)
    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({
        message: "Password must be between 6 and 20 characters",
      });
    }

    // 3️⃣ Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️⃣ Check if user with the given email already exists
    const user = await User.findOne({ email });

    if (user) {
      // If user exists and is a guest, and convertGuestAccount is true, update the account
      if (user.isGuest && convertGuestAccount === true) {
        // Update the guest account with password and full name
        user.password = hashedPassword;
        user.fullName = fullName;
        user.isGuest = false;
        await user.save();

        generateToken(user, res);

        return res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          address: user.address || "",
          role: user.role || "customer",
          verified: user.verified || "true",
          message: "Account updated successfully",
        });
      }

      // If user exists but is not a guest or convertGuestAccount is not true
      return res.status(400).json({
        message: "User with this email already exists",
        isGuest: user.isGuest || false,
      });
    }

    // 5️⃣ Determine role based on email domain
    if (normalizedEmail.endsWith("spfurbish.admin.com")) {
      role = "admin";
      verified = false;
      approvalMessage =
        "Signup received. Sent for approval. Full access will be granted after approval.";
    } else if (normalizedEmail.endsWith("spfurbish.staff.com")) {
      role = "staff";
      verified = false;
      approvalMessage =
        "Signup received. Sent for approval. Full access will be granted after approval.";
    }

    const newUser = new User({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      verified,
    });

    if (!newUser) {
      return res.status(500).json({
        message: "Error creating user",
      });
    } else {
      await newUser.save();

      if (!verified) {
        return res.status(201).json({
          message: approvalMessage,
          requiresApproval: true,
        });
      }
      generateToken(newUser, res);

      const io = req.app.get("socketio");
      if (io) {
        io.emit("new-user", {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.normalizedEmail,
        });
      }

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.normalizedEmail,
        role: newUser.role,
        verified: newUser.verified,
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.error("Signup controller error: ", error);
    return res.status(500).json({
      message: "Signup controller error: ",
    });
  }
};

const login = async (req, res) => {
  let message = "";
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (
      (user.role === "admin" || user.role === "staff") &&
      user.verified === false
    ) {
      message =
        "Your account is pending approval. Full access will be granted after approval.";
    } else {
      message = "Login successful";
    }

    generateToken(user, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      verified: user.verified,
      profilePic: user.profilePic,
      message,
    });
  } catch (error) {
    console.error("Error in login controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if email exists and if it's a guest account
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(200).json({
        exists: false,
        isGuest: false,
      });
    }

    return res.status(200).json({
      exists: true,
      isGuest: user.isGuest || false,
      hasPassword: !!user.password,
    });
  } catch (error) {
    console.error("Error in checkEmail controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logout successful" });
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Can access since we passed it as an object in protectRoute middleware

    const updates = {};

    if (req.body.fullName) updates.fullName = req.body.fullName;

    if (req.body.profilePic) {
      const uploadResponse = await cloudinary.uploader.uploadImage(
        req.body.profilePic,
      );
      updates.profilePic = uploadResponse.secure_url;
    }

    // Prevent empty updates
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("Error in update profile: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, logout, updateProfile, checkEmail };
