//Requiring mongoose and connecting to the yelp-camp database
const mongoose = require('mongoose');
const campground = require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

//Requiring cities, places and descriptors
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');

//Requiring campground model
const Campground = require('../models/campground');

// Database connection confirm
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const newCampground = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      author: '62ae2139d9a0dfedec95cb79',
      images: [
        {
          url: 'https://res.cloudinary.com/dfyobgtgj/image/upload/v1655670649/YelpCamp/ucrnrtpm3jcxzi7wzei3.jpg',
          filename: 'YelpCamp/ucrnrtpm3jcxzi7wzei3',
        },
      ],
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex praesentium hic non magni? Voluptates tempore voluptas impedit praesentium consectetur quis, animi voluptatum. Saepe corporis fugit praesentium nam dolore molestias voluptate.',
      price,
    });

    await newCampground.save();
  }
};

seedDB();
