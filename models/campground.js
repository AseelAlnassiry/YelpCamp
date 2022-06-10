// Requiring Mongoose and schema
const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// Creating the basic campground schema
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// Exporting the model to be usable elsewhere
module.exports = mongoose.model("Campground", CampgroundSchema);
