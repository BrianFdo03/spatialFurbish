const mongoose = require('mongoose');

// Define the structure of a category
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Create and export the model
module.exports = mongoose.model('Category', categorySchema);
