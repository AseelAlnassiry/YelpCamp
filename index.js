if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpresError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const db = mongoose.connection;
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/fakeuser', async (req, res) => {
  const user = new User({ email: 'aseelalnassiry@gmail.com', username: 'Aseel' });
  const newUser = await User.register(user, 'chicken');
  res.send(newUser);
});

app.all('*', (req, res, next) => {
  next(new ExpresError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

const port = 8080;
app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});
