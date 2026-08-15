require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product");
const Transaction = require("./models/Transaction");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB Atlas connection failed:", error);
    });
// Home route
app.get("/", (req, res) => {
    res.send("Inventory Management System");
});

// ADD PRODUCT API
app.post("/api/products", async (req, res) => {
    try {
        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({
            message: "Failed to add product",
            error: error.message
        });
    }
});
// GET ALL PRODUCTS API
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});
app.put("/api/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.delete("/api/products/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// STOCK IN API
app.put("/api/products/:id/stock-in", async (req, res) => {
    try {
        const { quantity, date } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Stock In quantity must be greater than 0"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Increase product quantity
        product.quantity += Number(quantity);

        const updatedProduct = await product.save();

        // Save Stock In transaction
        const transaction = new Transaction({
            productId: product._id,
            type: "Stock In",
            quantity: Number(quantity),
            date: date ? new Date(date) : new Date(),
            reason: "Stock received"
        });

        await transaction.save();

        res.json({
            message: "Stock In successful",
            product: updatedProduct,
            transaction: transaction
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add stock",
            error: error.message
        });
    }
});
// STOCK OUT API
app.put("/api/products/:id/stock-out", async (req, res) => {
    try {
        const { quantity, date, reason } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Stock Out quantity must be greater than 0"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check available stock
        if (product.quantity < Number(quantity)) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        // Decrease product quantity
        product.quantity -= Number(quantity);

        const updatedProduct = await product.save();

        // Save Stock Out transaction
        const transaction = new Transaction({
            productId: product._id,
            type: "Stock Out",
            quantity: Number(quantity),
            date: date ? new Date(date) : new Date(),
            reason: reason || "Other"
        });

        await transaction.save();

        res.json({
            message: "Stock Out successful",
            product: updatedProduct,
            transaction: transaction
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove stock",
            error: error.message
        });
    }
});
// GET ALL TRANSACTIONS API
app.get("/api/transactions", async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("productId", "productName productId")
            .sort({ date: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
});
// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});