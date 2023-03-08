const mongoose = require("mongoose");
const favSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    yourChoice: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fav", favSchema);
