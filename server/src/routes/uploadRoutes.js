const express = require("express");
const router = express.Router();
const {
  uploadImage,
  uploadTexture,
  uploadModel,
} = require("../config/cloudinary");

router.post("/", (req, res) => {
  uploadImage.single("image")(req, res, (err) => {
    if (err) {
      console.error("Cloudinary Upload Error:", err);
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: err.message,
      });
    }

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      console.log("Upload successful:", req.file.path);

      res.json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl: req.file.path,
      });
    } catch (error) {
      console.error("Route Handler Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });
});

// Mutiple Images Upload
router.post("/images", (req, res) => {
  uploadImage.array("images", 5)(req, res, (err) => {
    if (err) {
      console.error("Cloudinary Upload Error:", err);
      return res.status(500).json({
        success: false,
        message: "Images upload failed",
        error: err.message,
      });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No files uploaded" });
      }

      const imageUrls = req.files.map((file) => file.path);
      console.log("Upload successful:", imageUrls);

      res.json({
        success: true,
        message: "Images uploaded successfully",
        imageUrls: imageUrls,
      });
    } catch (error) {
      console.error("Route Handler Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });
});

// Texture Upload
router.post("/texture", (req, res) => {
  uploadTexture.single("texture")(req, res, (err) => {
    if (err) {
      console.error("Cloudinary Upload Error:", err);
      return res.status(500).json({
        success: false,
        message: "Texture upload failed",
        error: err.message,
      });
    }

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      console.log("Upload successful:", req.file.path);

      res.json({
        success: true,
        message: "Texture uploaded successfully",
        textureUrl: req.file.path,
      });
    } catch (error) {
      console.error("Route Handler Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });
});

// MODEL UPLOAD
router.post("/model", (req, res) => {
  uploadModel.single("productModel")(req, res, (err) => {
    if (err) {
      console.error("Model upload error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No model uploaded" });
      }

      console.log("Model uploaded:", req.file.path);

      res.json({
        success: true,
        message: "Model uploaded successfully",
        modelUrl: req.file.path,
      });
    } catch (error) {
      console.error("Route Handler Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });
});

module.exports = router;
