const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: String,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: [String]
});

module.exports = mongoose.model("Product", productSchema);
