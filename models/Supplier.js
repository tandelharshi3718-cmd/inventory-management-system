const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true
    },

    companyName: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Supplier", supplierSchema);