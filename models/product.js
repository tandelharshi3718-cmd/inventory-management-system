const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

    productId: {
        type: String,
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },
supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: false
},
    quantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;