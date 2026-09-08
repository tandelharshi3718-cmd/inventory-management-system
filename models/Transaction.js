const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    type: {
      type: String,
      enum: ["Stock In", "Stock Out"],
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    date: {
      type: Date,
      required: true
    },

    reason: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);