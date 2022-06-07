// Requiring dependancies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpresError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");

// App uses
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//Joi
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpresError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpresError(msg, 400);
  } else {
    next();
  }
};

// Database connection confirm
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Requiring path to be able to join view's directory
const path = require("path");
const campground = require("./models/campground");
const req = require("express/lib/request");

// Setting up ejs and views library
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Webpages
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new", {});
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground.id}`);
  })
);

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get(
  "/campgrounds/:id/",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpresError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("partials/error", { err });
});

// Setting the port used for listening
const port = 8080;
app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});
