// Requiring Mongoose and schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating the basic campground schema
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});
// Exporting the model to be usable elsewhere
module.exports = mongoose.model("Campground", CampgroundSchema);
