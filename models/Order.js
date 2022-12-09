const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        title: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true },
    address: {
      city: { type: String, required: true },
      area: { type: String, required: true },
      street: { type: String, required: true },
    },
    consignee: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Oder", OrderSchema);
