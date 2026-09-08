require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product");
const Transaction = require("./models/Transaction");
const User = require("./models/User");
const Supplier = require("./models/Supplier");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
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
// REGISTER API
app.post("/api/auth/register", async (req, res) => {
    try {
        const { shopName, ownerName, email, password } = req.body;

        if (!shopName || !ownerName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            shopName,
            ownerName,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});
// LOGIN API
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                shopName: user.shopName,
                ownerName: user.ownerName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});
// Home route
app.get("/", (req, res) => {
    res.send("Inventory Management System");
});


app.get("/api/products", authMiddleware, async (req, res) => {
    try {
        const products = await Product.find({
            userId: req.user.userId
        }).populate("supplierId", "supplierName companyName");

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});
app.post("/api/products", authMiddleware, async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            userId: req.user.userId
        });

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({
            message: "Failed to add product",
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
app.delete("/api/products/:id", authMiddleware, async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Delete related transactions
        await Transaction.deleteMany({
            productId: req.params.id,
            userId: req.user.userId
        });

        res.json({
            message: "Product and related transactions deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
});
// STOCK IN API
app.put("/api/products/:id/stock-in", authMiddleware, async (req, res) => {
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

        const transaction = new Transaction({
            userId: req.user.userId,
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
app.put("/api/products/:id/stock-out", authMiddleware, async (req, res) => {
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

        const transaction = new Transaction({
            userId: req.user.userId,
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
// GET USER TRANSACTIONS API
app.get("/api/transactions", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user.userId
        })
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
// ================= SUPPLIER APIs =================

// GET ALL SUPPLIERS
app.get("/api/suppliers", authMiddleware, async (req, res) => {
    try {
        const suppliers = await Supplier.find({
            userId: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch suppliers",
            error: error.message
        });
    }
});

// ADD SUPPLIER
app.post("/api/suppliers", authMiddleware, async (req, res) => {
    try {
        const supplier = new Supplier({
            ...req.body,
            userId: req.user.userId
        });

        const savedSupplier = await supplier.save();

        res.status(201).json(savedSupplier);
    } catch (error) {
        res.status(400).json({
            message: "Failed to add supplier",
            error: error.message
        });
    }
});

// UPDATE SUPPLIER
app.put("/api/suppliers/:id", authMiddleware, async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            req.body,
            {
                new: true
            }
        );

        if (!updatedSupplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.json(updatedSupplier);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update supplier",
            error: error.message
        });
    }
});

// DELETE SUPPLIER
app.delete("/api/suppliers/:id", authMiddleware, async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!deletedSupplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.json({
            message: "Supplier deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete supplier",
            error: error.message
        });
    }
});
// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});