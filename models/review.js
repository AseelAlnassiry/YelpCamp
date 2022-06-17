const mongoose = require("mongoose");
const Schmea = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
  body: String,
  rating: Number,
  author: {
    type: Schmea.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
