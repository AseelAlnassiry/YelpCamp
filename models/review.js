const mongoose = require("mongoose");
const Schmea = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Rview", reviewSchema);
