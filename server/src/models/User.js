const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false, // Not required for guest users
      minlength: 6,
    },

    isGuest: {
      type: Boolean,
      default: false, // True for users created during guest checkout
    },

    profilePic: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: false,
      default: "",
    },

    verified: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
    },

    contactNumber: {
      type: String,
      default: null,
      maxlength: 12,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);
