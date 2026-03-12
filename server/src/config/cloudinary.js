const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug check
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Cloudinary configuration missing! Check your .env file.");
} else {
  console.log("✅ Cloudinary configuration present.");
}

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "spatialFurbish/products/images",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const modelStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "spatialFurbish/products/models",
    resource_type: "raw",
    allowed_formats: ["glb", "gltf", "obj", "fbx"],
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadModel = multer({ storage: modelStorage });

module.exports = { uploadImage, uploadModel, cloudinary };
