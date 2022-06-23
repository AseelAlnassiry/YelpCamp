//Requiring mongoose and connecting to the yelp-camp database
const mongoose = require('mongoose');
const campground = require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken =
  'pk.eyJ1IjoiYXNlZWxhbG5hc3NpcnkiLCJhIjoiY2w0bTZmZnloMXkyMDNrc3ZqaWRsb2k5ZSJ9.hcG1U_9rnd-RmVxqpIobjA';
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

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
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);

    const price = Math.floor(Math.random() * 20) + 10;
    const newCampground = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude],
      },
      author: '62b08bc7c4764b942cc16dd6',
      images: [
        {
          url: 'https://res.cloudinary.com/dfyobgtgj/image/upload/v1655737865/YelpCamp/oheukpb1rydy5zlplfir.jpg',
          filename: 'YelpCamp/oheukpb1rydy5zlplfir',
        },
        {
          url: 'https://res.cloudinary.com/dfyobgtgj/image/upload/v1655737866/YelpCamp/gbwvaowhwtehvkjxrmtu.jpg',
          filename: 'YelpCamp/gbwvaowhwtehvkjxrmtu',
        },
        {
          url: 'https://res.cloudinary.com/dfyobgtgj/image/upload/v1655737866/YelpCamp/ctcdyyjnl0vurizaqyjk.jpg',
          filename: 'YelpCamp/ctcdyyjnl0vurizaqyjk',
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
